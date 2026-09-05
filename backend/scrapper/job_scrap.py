#!/usr/bin/env python3
"""
job_scrap.py — Production-level async job scraper
Supports: Greenhouse, Lever, Ashby, SmartRecruiters, Workday, BambooHR,
          direct career pages, and custom URLs.
Output: jobs_output.json (UTF-8, deduplicated, normalized)
"""

import asyncio
import aiohttp
import requests
import json
import re
import hashlib
import logging
import random
import time
import html
from datetime import datetime, timezone, timedelta
from typing import Optional
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse, quote
from dataclasses import dataclass, asdict, field

# ─────────────────────────────────────────────────────────────────────────────
# LOGGING
# ─────────────────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("JobScraper")

# ─────────────────────────────────────────────────────────────────────────────
# CONFIGURATION
# ─────────────────────────────────────────────────────────────────────────────
MAX_DAYS_OLD = 10          # Only jobs posted in last N days
CONCURRENCY  = 8           # Max parallel async tasks
REQUEST_TIMEOUT = 20       # Seconds per HTTP request
PLAYWRIGHT_TIMEOUT = 30000 # ms for Playwright pages
MIN_DELAY = 0.5            # Seconds between requests (min)
MAX_DELAY = 2.0            # Seconds between requests (max)
OUTPUT_FILE = "jobs_output.json"

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 "
    "(KHTML, like Gecko) Version/17.4 Safari/605.1.15",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) "
    "Gecko/20100101 Firefox/125.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
]

# ── Greenhouse companies ────────────────────────────────────────────────────
GREENHOUSE_COMPANIES = [
    "airbnb", "stripe", "dropbox", "coinbase", "robinhood", "brex",
    "plaid", "figma", "notion", "discord", "airtable", "gusto",
    "carta", "benchling", "chime", "openai", "anthropic", "scale",
    "databricks", "confluent", "segment", "amplitude", "mixpanel",
    "lattice", "rippling", "deel", "remote", "retool", "linear",
    "vercel", "planetscale", "supabase", "fly", "render", "railway",
    "hubspot", "zendesk", "intercom", "twilio", "sendgrid", "okta",
    "cloudflare", "fastly", "datadog", "newrelic", "pagerduty",
    "hashicorp", "mongodb", "elastic", "splunk", "dynatrace",
]

# ── Lever companies ─────────────────────────────────────────────────────────
LEVER_COMPANIES = [
    "netflix", "uber", "lyft", "instacart", "doordash", "postmates",
    "grubhub", "peloton", "calm", "headspace", "duolingo", "coursera",
    "udemy", "edx", "khan-academy", "brilliant", "codecademy",
    "github", "gitlab", "atlassian", "jira", "confluence", "trello",
    "asana", "monday", "clickup", "basecamp", "notion", "coda",
    "miro", "lucidchart", "draw-io", "figma", "sketch", "zeplin",
    "invision", "principle", "framer", "webflow", "squarespace",
    "wix", "shopify", "bigcommerce", "magento", "woocommerce",
]

# ── Ashby companies ─────────────────────────────────────────────────────────
ASHBY_COMPANIES = [
    "openai", "anthropic", "mistral", "cohere", "together-ai",
    "hugging-face", "replicate", "modal", "banana-dev", "baseten",
    "anyscale", "ray", "dbt-labs", "airbyte", "fivetran", "hightouch",
    "census", "rudderstack", "mparticle", "segment", "amplitude",
    "mixpanel", "heap", "fullstory", "logrocket", "posthog",
    "june", "june-so", "june-analytics",
]

# ── SmartRecruiters companies ───────────────────────────────────────────────
SMARTRECRUITERS_COMPANIES = [
    "bosch", "sanofi", "aldi", "lidl", "zalando", "booking",
    "deliveroo", "revolut", "monzo", "starling", "wise", "n26",
    "bunq", "klarna", "adyen", "checkout", "paysafe", "worldpay",
    "payoneer", "remitly", "transfergo", "currencycloud",
]

# ── Workday companies (tenant IDs) ──────────────────────────────────────────
WORKDAY_TENANTS = [
    ("amazon",   "amazon"),
    ("google",   "google_wgz"),
    ("microsoft","microsoft"),
    ("apple",    "apple"),
    ("meta",     "meta"),
    ("salesforce","salesforce"),
    ("oracle",   "oracle"),
    ("sap",      "sap"),
    ("vmware",   "vmware"),
    ("adobe",    "adobe"),
    ("servicenow","servicenow"),
]

# ── BambooHR companies ──────────────────────────────────────────────────────
BAMBOOHR_COMPANIES = [
    "zapier", "buffer", "basecamp", "doist", "remote",
    "loom", "notion", "linear", "pitch", "superhuman",
]

# ── Custom career page URLs (add your own here freely) ─────────────────────
CUSTOM_CAREER_URLS = [
    "https://careers.google.com/jobs/results/?q=software+engineer",
    "https://www.amazon.jobs/en/search?base_query=software+engineer&loc_query=&job_count=10&offset=0&result_limit=10&sort=recent",
    "https://jobs.netflix.com/search?q=engineer",
    "https://www.metacareers.com/jobs?q=engineer",
    "https://jobs.apple.com/en-us/search?search=software+engineer",
    "https://careers.microsoft.com/us/en/search-results?keywords=software+engineer",
    "https://www.uber.com/us/en/careers/list/?query=engineer",
    "https://boards.greenhouse.io/embed/job_board/js?for=airbnb",
]

# ── Tech skills keyword list ─────────────────────────────────────────────────
TECH_SKILLS = [
    "python","javascript","typescript","java","kotlin","swift","go","rust","c++",
    "c#","ruby","php","scala","r","matlab","sql","nosql","graphql","rest","grpc",
    "react","vue","angular","svelte","nextjs","nuxtjs","gatsby","remix",
    "node","express","fastapi","django","flask","spring","rails","laravel",
    "aws","gcp","azure","docker","kubernetes","terraform","ansible","helm",
    "postgresql","mysql","mongodb","redis","elasticsearch","kafka","rabbitmq",
    "spark","hadoop","airflow","dbt","snowflake","bigquery","redshift",
    "pytorch","tensorflow","sklearn","pandas","numpy","huggingface","langchain",
    "git","github","gitlab","ci/cd","jenkins","github actions","circleci",
    "linux","bash","zsh","nginx","apache","prometheus","grafana","datadog",
    "openai","gpt","llm","rag","vector","pinecone","weaviate","chroma",
    "figma","sketch","xd","jira","confluence","notion","slack","agile","scrum",
    "machine learning","deep learning","nlp","computer vision","mlops","devops",
    "microservices","distributed systems","system design","api","sdk","blockchain",
]

# ─────────────────────────────────────────────────────────────────────────────
# DATA MODEL
# ─────────────────────────────────────────────────────────────────────────────
@dataclass
class Job:
    title: str = ""
    company: str = ""
    location: str = ""
    job_url: str = ""
    salary: str = ""
    employment_type: str = ""
    experience_level: str = ""
    is_remote: bool = False
    posted_date: str = ""
    description: str = ""
    skills: list = field(default_factory=list)
    requirements: list = field(default_factory=list)
    technologies: list = field(default_factory=list)
    experience_required: str = ""
    education: str = ""
    department: str = ""
    benefits: list = field(default_factory=list)
    source: str = ""
    scrape_timestamp: str = ""
    career_page_url: str = ""
    ats_platform: str = ""
    priority_score: float = 0.0

# ─────────────────────────────────────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────────────────────────────────────
def rand_ua() -> str:
    return random.choice(USER_AGENTS)

def rand_delay():
    time.sleep(random.uniform(MIN_DELAY, MAX_DELAY))

async def async_rand_delay():
    await asyncio.sleep(random.uniform(MIN_DELAY, MAX_DELAY))

def job_hash(j: Job) -> str:
    key = f"{j.title.lower().strip()}|{j.company.lower().strip()}|{j.location.lower().strip()}"
    return hashlib.md5(key.encode()).hexdigest()

def clean_html(raw: str) -> str:
    if not raw:
        return ""
    raw = html.unescape(raw)
    soup = BeautifulSoup(raw, "lxml")
    text = soup.get_text(separator="\n")
    text = re.sub(r"\n{3,}", "\n\n", text).strip()
    return text[:4000]  # cap description length

def extract_skills(text: str) -> list[str]:
    t = text.lower()
    found = []
    for skill in TECH_SKILLS:
        pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(pattern, t):
            found.append(skill)
    return list(dict.fromkeys(found))  # preserve order, dedupe

def detect_remote(text: str) -> bool:
    t = text.lower()
    return any(kw in t for kw in ["remote", "work from home", "wfh", "distributed", "anywhere"])

def detect_exp_level(title: str, desc: str) -> str:
    t = (title + " " + desc).lower()
    if any(x in t for x in ["senior", "sr.", "lead", "principal", "staff"]):
        return "Senior"
    if any(x in t for x in ["junior", "jr.", "entry", "graduate", "intern", "fresher"]):
        return "Junior"
    if any(x in t for x in ["mid", "intermediate", "associate"]):
        return "Mid"
    if any(x in t for x in ["manager", "director", "head of", "vp ", "vice president"]):
        return "Management"
    return "Not specified"

def detect_emp_type(text: str) -> str:
    t = text.lower()
    if "contract" in t or "contractor" in t:
        return "Contract"
    if "part-time" in t or "part time" in t:
        return "Part-time"
    if "intern" in t or "internship" in t:
        return "Internship"
    if "freelance" in t:
        return "Freelance"
    return "Full-time"

def extract_salary(text: str) -> str:
    patterns = [
        r'\$[\d,]+(?:\s*[-–]\s*\$[\d,]+)?(?:\s*(?:per|/)\s*(?:year|yr|hour|hr|month|mo))?',
        r'[\d,]+\s*(?:USD|EUR|GBP|INR|CAD|AUD)(?:\s*[-–]\s*[\d,]+\s*(?:USD|EUR|GBP|INR|CAD|AUD))?',
        r'(?:salary|compensation|pay)[\s:]+[\$£€]?[\d,]+',
    ]
    for p in patterns:
        m = re.search(p, text, re.IGNORECASE)
        if m:
            return m.group(0).strip()
    return ""

def normalize_date(raw: str) -> str:
    """Best-effort ISO date parse."""
    if not raw:
        return ""
    raw = raw.strip()
    # Already ISO
    if re.match(r'\d{4}-\d{2}-\d{2}', raw):
        return raw[:10]
    # Epoch ms or s
    if re.match(r'^\d{10,13}$', raw):
        ts = int(raw)
        if ts > 1e12:
            ts //= 1000
        try:
            return datetime.fromtimestamp(ts, tz=timezone.utc).strftime("%Y-%m-%d")
        except Exception:
            return ""
    # Human-readable
    for fmt in ["%B %d, %Y", "%b %d, %Y", "%d %B %Y", "%d %b %Y",
                "%m/%d/%Y", "%d/%m/%Y", "%Y/%m/%d"]:
        try:
            return datetime.strptime(raw, fmt).strftime("%Y-%m-%d")
        except Exception:
            pass
    return raw[:10]

def is_recent(date_str: str) -> bool:
    """Returns True if date is within MAX_DAYS_OLD."""
    if not date_str:
        return True  # include unknown dates
    try:
        d = datetime.strptime(date_str[:10], "%Y-%m-%d").replace(tzinfo=timezone.utc)
        return (datetime.now(timezone.utc) - d).days <= MAX_DAYS_OLD
    except Exception:
        return True


def fresher_priority(job: Job) -> float:
    """Rank recent entry-level roles first without silently deleting unknown roles."""
    text = f"{job.title} {job.description} {job.experience_level} {job.experience_required}".lower()
    junior_terms = ("fresher", "entry level", "entry-level", "graduate", "new grad", "junior", "trainee", "intern", "associate")
    senior_terms = ("senior", "sr.", "staff", "principal", "lead", "manager", "director", "head of", "architect")
    suitability = 100 if any(term in text for term in junior_terms) else 55
    if any(term in text for term in senior_terms):
        suitability = 5
    freshness = 25
    if job.posted_date:
        try:
            posted = datetime.strptime(job.posted_date[:10], "%Y-%m-%d").replace(tzinfo=timezone.utc)
            age = max(0, (datetime.now(timezone.utc) - posted).days)
            freshness = 100 if age <= 1 else 90 if age <= 3 else 75 if age <= 7 else 50
        except ValueError:
            pass
    completeness = min(100, len(job.skills) * 12 + (20 if job.description else 0) + (15 if job.job_url else 0))
    return round(freshness * 0.5 + suitability * 0.4 + completeness * 0.1, 2)

def now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

def extract_education(text: str) -> str:
    t = text.lower()
    if "phd" in t or "doctorate" in t:
        return "PhD"
    if "master" in t or "m.s." in t or "msc" in t:
        return "Master's"
    if "bachelor" in t or "b.s." in t or "b.e." in t or "bsc" in t or "b.tech" in t:
        return "Bachelor's"
    if "associate" in t:
        return "Associate's"
    return ""

def extract_requirements(text: str) -> list[str]:
    reqs = []
    lines = text.split("\n")
    for line in lines:
        line = line.strip()
        if len(line) > 20 and len(line) < 300:
            if any(kw in line.lower() for kw in
                   ["experience", "required", "must", "proficient",
                    "knowledge", "ability", "familiar", "years"]):
                reqs.append(line)
    return reqs[:10]

def make_headers(extra: dict = None) -> dict:
    h = {
        "User-Agent": rand_ua(),
        "Accept": "application/json, text/html, */*",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
        "Cache-Control": "no-cache",
    }
    if extra:
        h.update(extra)
    return h

# ─────────────────────────────────────────────────────────────────────────────
# ATS DETECTION
# ─────────────────────────────────────────────────────────────────────────────
def detect_ats(url: str) -> str:
    url_lower = url.lower()
    if "greenhouse.io" in url_lower or "boards.greenhouse" in url_lower:
        return "greenhouse"
    if "lever.co" in url_lower or "jobs.lever" in url_lower:
        return "lever"
    if "ashbyhq.com" in url_lower or "jobs.ashby" in url_lower:
        return "ashby"
    if "smartrecruiters.com" in url_lower:
        return "smartrecruiters"
    if "myworkdayjobs.com" in url_lower or "workday" in url_lower:
        return "workday"
    if "bamboohr.com" in url_lower:
        return "bamboohr"
    if "icims.com" in url_lower:
        return "icims"
    if "taleo.net" in url_lower:
        return "taleo"
    if "jobvite.com" in url_lower:
        return "jobvite"
    return "unknown"

# ─────────────────────────────────────────────────────────────────────────────
# GREENHOUSE SCRAPER
# ─────────────────────────────────────────────────────────────────────────────
async def scrape_greenhouse(session: aiohttp.ClientSession, company: str) -> list[Job]:
    jobs = []
    url = f"https://boards-api.greenhouse.io/v1/boards/{company}/jobs?content=true"
    try:
        await async_rand_delay()
        async with session.get(url, headers=make_headers(), timeout=aiohttp.ClientTimeout(total=REQUEST_TIMEOUT)) as resp:
            if resp.status != 200:
                log.warning(f"Greenhouse {company}: HTTP {resp.status}")
                return jobs
            data = await resp.json(content_type=None)

        for j in data.get("jobs", []):
            posted_raw = j.get("updated_at", j.get("first_published", ""))
            posted = normalize_date(posted_raw)
            if not is_recent(posted):
                continue

            desc_raw = j.get("content", "")
            desc = clean_html(desc_raw)
            title = j.get("title", "")
            location = j.get("location", {}).get("name", "")

            job = Job(
                title=title,
                company=company.replace("-", " ").title(),
                location=location,
                job_url=j.get("absolute_url", ""),
                employment_type=detect_emp_type(desc),
                experience_level=detect_exp_level(title, desc),
                is_remote=detect_remote(location + " " + desc),
                posted_date=posted,
                description=desc,
                skills=extract_skills(desc),
                technologies=extract_skills(desc),
                requirements=extract_requirements(desc),
                salary=extract_salary(desc),
                education=extract_education(desc),
                department=j.get("departments", [{}])[0].get("name", "") if j.get("departments") else "",
                source="Greenhouse",
                scrape_timestamp=now_iso(),
                career_page_url=f"https://boards.greenhouse.io/{company}",
                ats_platform="greenhouse",
            )
            jobs.append(job)

        log.info(f"Greenhouse [{company}]: {len(jobs)} jobs")
    except asyncio.TimeoutError:
        log.warning(f"Greenhouse {company}: timeout")
    except Exception as e:
        log.warning(f"Greenhouse {company}: {e}")
    return jobs

# ─────────────────────────────────────────────────────────────────────────────
# LEVER SCRAPER
# ─────────────────────────────────────────────────────────────────────────────
async def scrape_lever(session: aiohttp.ClientSession, company: str) -> list[Job]:
    jobs = []
    url = f"https://api.lever.co/v0/postings/{company}?mode=json"
    try:
        await async_rand_delay()
        async with session.get(url, headers=make_headers(), timeout=aiohttp.ClientTimeout(total=REQUEST_TIMEOUT)) as resp:
            if resp.status != 200:
                log.warning(f"Lever {company}: HTTP {resp.status}")
                return jobs
            data = await resp.json(content_type=None)

        if not isinstance(data, list):
            data = data.get("postings", [])

        for j in data:
            created_ts = str(j.get("createdAt", ""))
            # Lever returns millisecond epoch
            posted = normalize_date(created_ts)
            if not is_recent(posted):
                continue

            desc_raw = ""
            for section in j.get("descriptionBody", {}).get("descriptionBodyHtml", ""):
                desc_raw += section
            if not desc_raw:
                desc_raw = j.get("descriptionPlain", "")
            desc = clean_html(desc_raw) if desc_raw else j.get("descriptionPlain", "")

            title = j.get("text", "")
            loc_data = j.get("categories", {})
            location = loc_data.get("location", j.get("workplaceType", ""))
            job_url = j.get("hostedUrl", j.get("applyUrl", ""))

            job = Job(
                title=title,
                company=company.replace("-", " ").title(),
                location=location,
                job_url=job_url,
                employment_type=loc_data.get("commitment", detect_emp_type(desc)),
                experience_level=detect_exp_level(title, desc),
                is_remote=detect_remote(location + " " + desc),
                posted_date=posted,
                description=desc,
                skills=extract_skills(desc),
                technologies=extract_skills(desc),
                requirements=extract_requirements(desc),
                salary=extract_salary(desc),
                education=extract_education(desc),
                department=loc_data.get("department", ""),
                source="Lever",
                scrape_timestamp=now_iso(),
                career_page_url=f"https://jobs.lever.co/{company}",
                ats_platform="lever",
            )
            jobs.append(job)

        log.info(f"Lever [{company}]: {len(jobs)} jobs")
    except asyncio.TimeoutError:
        log.warning(f"Lever {company}: timeout")
    except Exception as e:
        log.warning(f"Lever {company}: {e}")
    return jobs

# ─────────────────────────────────────────────────────────────────────────────
# ASHBY SCRAPER
# ─────────────────────────────────────────────────────────────────────────────
async def scrape_ashby(session: aiohttp.ClientSession, company: str) -> list[Job]:
    jobs = []
    # Ashby uses a JSON API endpoint
    url = f"https://jobs.ashbyhq.com/api/non-user-graphql?op=ApiJobBoardWithTeams"
    payload = {
        "operationName": "ApiJobBoardWithTeams",
        "variables": {"organizationHostedJobsPageName": company},
        "query": """
        query ApiJobBoardWithTeams($organizationHostedJobsPageName: String!) {
          jobBoard: jobBoardWithTeams(
            organizationHostedJobsPageName: $organizationHostedJobsPageName
          ) {
            jobPostings {
              id title locationName employmentType isRemote
              publishedDate
              team { name }
              jobRequisition {
                compensationBands {
                  currencyCode
                  minValue maxValue interval
                }
              }
            }
          }
        }
        """,
    }
    headers = make_headers({"Content-Type": "application/json", "Origin": "https://jobs.ashbyhq.com"})
    try:
        await async_rand_delay()
        async with session.post(url, json=payload, headers=headers,
                                timeout=aiohttp.ClientTimeout(total=REQUEST_TIMEOUT)) as resp:
            if resp.status != 200:
                log.warning(f"Ashby {company}: HTTP {resp.status}")
                return jobs
            data = await resp.json(content_type=None)

        postings = (data.get("data") or {}).get("jobBoard") or {}
        postings = postings.get("jobPostings", [])

        for j in postings:
            posted = normalize_date(j.get("publishedDate", ""))
            if not is_recent(posted):
                continue

            # Fetch individual job detail for description
            job_id = j.get("id", "")
            desc = await _fetch_ashby_job_detail(session, company, job_id)

            comp_bands = ((j.get("jobRequisition") or {}).get("compensationBands") or [{}])
            salary = ""
            if comp_bands and comp_bands[0]:
                b = comp_bands[0]
                salary = f"{b.get('minValue','')}-{b.get('maxValue','')} {b.get('currencyCode','')} / {b.get('interval','')}"

            title = j.get("title", "")
            location = j.get("locationName", "")

            job = Job(
                title=title,
                company=company.replace("-", " ").title(),
                location=location,
                job_url=f"https://jobs.ashbyhq.com/{company}/{job_id}",
                employment_type=j.get("employmentType", detect_emp_type(desc)),
                experience_level=detect_exp_level(title, desc),
                is_remote=j.get("isRemote", False) or detect_remote(location + desc),
                posted_date=posted,
                description=desc,
                skills=extract_skills(desc),
                technologies=extract_skills(desc),
                requirements=extract_requirements(desc),
                salary=salary or extract_salary(desc),
                education=extract_education(desc),
                department=(j.get("team") or {}).get("name", ""),
                source="Ashby",
                scrape_timestamp=now_iso(),
                career_page_url=f"https://jobs.ashbyhq.com/{company}",
                ats_platform="ashby",
            )
            jobs.append(job)

        log.info(f"Ashby [{company}]: {len(jobs)} jobs")
    except asyncio.TimeoutError:
        log.warning(f"Ashby {company}: timeout")
    except Exception as e:
        log.warning(f"Ashby {company}: {e}")
    return jobs

async def _fetch_ashby_job_detail(session, company, job_id) -> str:
    if not job_id:
        return ""
    url = "https://jobs.ashbyhq.com/api/non-user-graphql?op=ApiJobPosting"
    payload = {
        "operationName": "ApiJobPosting",
        "variables": {"organizationHostedJobsPageName": company, "jobPostingId": job_id},
        "query": """
        query ApiJobPosting($organizationHostedJobsPageName: String!, $jobPostingId: String!) {
          jobPosting(
            organizationHostedJobsPageName: $organizationHostedJobsPageName
            jobPostingId: $jobPostingId
          ) { descriptionHtml }
        }
        """,
    }
    try:
        async with session.post(url, json=payload, headers=make_headers({"Content-Type": "application/json"}),
                                timeout=aiohttp.ClientTimeout(total=REQUEST_TIMEOUT)) as resp:
            d = await resp.json(content_type=None)
            raw = ((d.get("data") or {}).get("jobPosting") or {}).get("descriptionHtml", "")
            return clean_html(raw)
    except Exception:
        return ""

# ─────────────────────────────────────────────────────────────────────────────
# SMARTRECRUITERS SCRAPER
# ─────────────────────────────────────────────────────────────────────────────
async def scrape_smartrecruiters(session: aiohttp.ClientSession, company: str) -> list[Job]:
    jobs = []
    url = f"https://api.smartrecruiters.com/v1/companies/{company}/postings"
    params = {"limit": 100, "status": "PUBLIC"}
    try:
        await async_rand_delay()
        async with session.get(url, params=params, headers=make_headers(),
                               timeout=aiohttp.ClientTimeout(total=REQUEST_TIMEOUT)) as resp:
            if resp.status != 200:
                log.warning(f"SmartRecruiters {company}: HTTP {resp.status}")
                return jobs
            data = await resp.json(content_type=None)

        for j in data.get("content", []):
            posted = normalize_date(j.get("releasedDate", j.get("updatedOn", "")))
            if not is_recent(posted):
                continue

            title = j.get("name", "")
            location = j.get("location", {})
            loc_str = f"{location.get('city','')}, {location.get('country','')}"
            desc = clean_html(j.get("jobAd", {}).get("sections", {}).get("jobDescription", {}).get("text", ""))
            job_url = j.get("ref", f"https://jobs.smartrecruiters.com/{company}/{j.get('id','')}")

            job = Job(
                title=title,
                company=company.replace("-", " ").title(),
                location=loc_str.strip(", "),
                job_url=job_url,
                employment_type=j.get("typeOfEmployment", {}).get("label", detect_emp_type(desc)),
                experience_level=detect_exp_level(title, desc),
                is_remote=j.get("remoteWork", False) or detect_remote(desc),
                posted_date=posted,
                description=desc,
                skills=extract_skills(desc),
                technologies=extract_skills(desc),
                requirements=extract_requirements(desc),
                salary=extract_salary(desc),
                education=extract_education(desc),
                department=j.get("department", {}).get("label", "") if isinstance(j.get("department"), dict) else "",
                source="SmartRecruiters",
                scrape_timestamp=now_iso(),
                career_page_url=f"https://jobs.smartrecruiters.com/{company}",
                ats_platform="smartrecruiters",
            )
            jobs.append(job)

        log.info(f"SmartRecruiters [{company}]: {len(jobs)} jobs")
    except asyncio.TimeoutError:
        log.warning(f"SmartRecruiters {company}: timeout")
    except Exception as e:
        log.warning(f"SmartRecruiters {company}: {e}")
    return jobs

# ─────────────────────────────────────────────────────────────────────────────
# BAMBOOHR SCRAPER
# ─────────────────────────────────────────────────────────────────────────────
async def scrape_bamboohr(session: aiohttp.ClientSession, company: str) -> list[Job]:
    jobs = []
    url = f"https://{company}.bamboohr.com/careers/list"
    headers = make_headers({"Accept": "application/json"})
    try:
        await async_rand_delay()
        async with session.get(url, headers=headers, timeout=aiohttp.ClientTimeout(total=REQUEST_TIMEOUT)) as resp:
            if resp.status != 200:
                log.warning(f"BambooHR {company}: HTTP {resp.status}")
                return jobs
            data = await resp.json(content_type=None)

        for j in data.get("result", []):
            posted = normalize_date(j.get("datePosted", ""))
            if not is_recent(posted):
                continue

            title = j.get("jobOpeningName", "")
            location = j.get("location", {}).get("city", "") if isinstance(j.get("location"), dict) else str(j.get("location", ""))
            job_id = j.get("id", "")
            desc = ""
            if job_id:
                desc = await _fetch_bamboohr_desc(session, company, job_id)

            job = Job(
                title=title,
                company=company.replace("-", " ").title(),
                location=location,
                job_url=f"https://{company}.bamboohr.com/careers/{job_id}",
                employment_type=j.get("employmentType", detect_emp_type(desc)),
                experience_level=detect_exp_level(title, desc),
                is_remote=detect_remote(location + desc),
                posted_date=posted,
                description=desc,
                skills=extract_skills(desc),
                technologies=extract_skills(desc),
                requirements=extract_requirements(desc),
                salary=extract_salary(desc),
                education=extract_education(desc),
                department=j.get("department", {}).get("label", "") if isinstance(j.get("department"), dict) else str(j.get("department", "")),
                source="BambooHR",
                scrape_timestamp=now_iso(),
                career_page_url=f"https://{company}.bamboohr.com/careers/",
                ats_platform="bamboohr",
            )
            jobs.append(job)

        log.info(f"BambooHR [{company}]: {len(jobs)} jobs")
    except asyncio.TimeoutError:
        log.warning(f"BambooHR {company}: timeout")
    except Exception as e:
        log.warning(f"BambooHR {company}: {e}")
    return jobs

async def _fetch_bamboohr_desc(session, company, job_id) -> str:
    url = f"https://{company}.bamboohr.com/careers/{job_id}"
    try:
        async with session.get(url, headers=make_headers(),
                               timeout=aiohttp.ClientTimeout(total=REQUEST_TIMEOUT)) as resp:
            text = await resp.text()
            soup = BeautifulSoup(text, "lxml")
            desc_div = soup.find("div", {"id": "BambooHR-ATS-Jobs-List"}) or soup.find("div", class_=re.compile(r"description|job-detail"))
            return clean_html(str(desc_div)) if desc_div else ""
    except Exception:
        return ""

# ─────────────────────────────────────────────────────────────────────────────
# WORKDAY SCRAPER (API-based)
# ─────────────────────────────────────────────────────────────────────────────
async def scrape_workday(session: aiohttp.ClientSession, company: str, tenant: str) -> list[Job]:
    jobs = []
    # Workday public API
    url = f"https://{company}.wd1.myworkdayjobs.com/wday/cxs/{company}/{tenant}/jobs"
    payload = {
        "appliedFacets": {},
        "limit": 20,
        "offset": 0,
        "searchText": "",
    }
    headers = make_headers({"Content-Type": "application/json"})
    try:
        await async_rand_delay()
        async with session.post(url, json=payload, headers=headers,
                                timeout=aiohttp.ClientTimeout(total=REQUEST_TIMEOUT)) as resp:
            if resp.status != 200:
                log.warning(f"Workday {company}: HTTP {resp.status}")
                return jobs
            data = await resp.json(content_type=None)

        for j in data.get("jobPostings", []):
            posted = normalize_date(j.get("postedOn", ""))
            if not is_recent(posted):
                continue

            title = j.get("title", "")
            location = j.get("locationsText", "")
            job_path = j.get("externalPath", "")
            job_url = f"https://{company}.wd1.myworkdayjobs.com/en-US/{tenant}/job{job_path}"

            job = Job(
                title=title,
                company=company.title(),
                location=location,
                job_url=job_url,
                employment_type=j.get("jobScheduleType", detect_emp_type(title)),
                experience_level=detect_exp_level(title, ""),
                is_remote=detect_remote(location + title),
                posted_date=posted,
                description="",
                skills=[],
                technologies=[],
                requirements=[],
                salary="",
                education="",
                department=j.get("primarySearchFacet", ""),
                source="Workday",
                scrape_timestamp=now_iso(),
                career_page_url=f"https://{company}.wd1.myworkdayjobs.com/en-US/{tenant}",
                ats_platform="workday",
            )
            jobs.append(job)

        log.info(f"Workday [{company}]: {len(jobs)} jobs")
    except asyncio.TimeoutError:
        log.warning(f"Workday {company}: timeout")
    except Exception as e:
        log.warning(f"Workday {company}: {e}")
    return jobs

# ─────────────────────────────────────────────────────────────────────────────
# REMOTIVE (Remote jobs board – free public API)
# ─────────────────────────────────────────────────────────────────────────────
async def scrape_remotive(session: aiohttp.ClientSession) -> list[Job]:
    jobs = []
    url = "https://remotive.com/api/remote-jobs?limit=100"
    try:
        await async_rand_delay()
        async with session.get(url, headers=make_headers(),
                               timeout=aiohttp.ClientTimeout(total=REQUEST_TIMEOUT)) as resp:
            if resp.status != 200:
                log.warning(f"Remotive: HTTP {resp.status}")
                return jobs
            data = await resp.json(content_type=None)

        for j in data.get("jobs", []):
            posted = normalize_date(j.get("publication_date", ""))
            if not is_recent(posted):
                continue

            desc = clean_html(j.get("description", ""))
            title = j.get("title", "")
            company = j.get("company_name", "")
            location = j.get("candidate_required_location", "Remote")

            job = Job(
                title=title,
                company=company,
                location=location,
                job_url=j.get("url", ""),
                employment_type=j.get("job_type", "Full-time"),
                experience_level=detect_exp_level(title, desc),
                is_remote=True,
                posted_date=posted,
                description=desc,
                skills=extract_skills(desc),
                technologies=extract_skills(desc),
                requirements=extract_requirements(desc),
                salary=j.get("salary", extract_salary(desc)),
                education=extract_education(desc),
                department=j.get("category", ""),
                source="Remotive",
                scrape_timestamp=now_iso(),
                career_page_url="https://remotive.com",
                ats_platform="remotive",
            )
            jobs.append(job)

        log.info(f"Remotive: {len(jobs)} jobs")
    except Exception as e:
        log.warning(f"Remotive: {e}")
    return jobs

# ─────────────────────────────────────────────────────────────────────────────
# ARBEITNOW (Free EU/remote jobs API)
# ─────────────────────────────────────────────────────────────────────────────
async def scrape_arbeitnow(session: aiohttp.ClientSession) -> list[Job]:
    jobs = []
    url = "https://www.arbeitnow.com/api/job-board-api"
    try:
        await async_rand_delay()
        async with session.get(url, headers=make_headers(),
                               timeout=aiohttp.ClientTimeout(total=REQUEST_TIMEOUT)) as resp:
            if resp.status != 200:
                log.warning(f"ArbeitNow: HTTP {resp.status}")
                return jobs
            data = await resp.json(content_type=None)

        for j in data.get("data", []):
            posted = normalize_date(j.get("created_at", ""))
            if not is_recent(posted):
                continue

            desc = clean_html(j.get("description", ""))
            title = j.get("title", "")
            company = j.get("company_name", "")
            location = j.get("location", "")

            job = Job(
                title=title,
                company=company,
                location=location,
                job_url=j.get("url", ""),
                employment_type=j.get("job_types", ["Full-time"])[0] if j.get("job_types") else "Full-time",
                experience_level=detect_exp_level(title, desc),
                is_remote=j.get("remote", False),
                posted_date=posted,
                description=desc,
                skills=extract_skills(desc),
                technologies=extract_skills(j.get("tags", []).__str__() + desc),
                requirements=extract_requirements(desc),
                salary=extract_salary(desc),
                education=extract_education(desc),
                department="",
                source="ArbeitNow",
                scrape_timestamp=now_iso(),
                career_page_url="https://www.arbeitnow.com",
                ats_platform="arbeitnow",
            )
            jobs.append(job)

        log.info(f"ArbeitNow: {len(jobs)} jobs")
    except Exception as e:
        log.warning(f"ArbeitNow: {e}")
    return jobs

# ─────────────────────────────────────────────────────────────────────────────
# JOBICY (Remote jobs API)
# ─────────────────────────────────────────────────────────────────────────────
async def scrape_jobicy(session: aiohttp.ClientSession) -> list[Job]:
    jobs = []
    url = "https://jobicy.com/api/v2/remote-jobs?count=50&industry=technology"
    try:
        await async_rand_delay()
        async with session.get(url, headers=make_headers(),
                               timeout=aiohttp.ClientTimeout(total=REQUEST_TIMEOUT)) as resp:
            if resp.status != 200:
                log.warning(f"Jobicy: HTTP {resp.status}")
                return jobs
            data = await resp.json(content_type=None)

        for j in data.get("jobs", []):
            posted = normalize_date(j.get("pubDate", ""))
            if not is_recent(posted):
                continue

            desc = clean_html(j.get("jobDescription", ""))
            title = j.get("jobTitle", "")
            company = j.get("companyName", "")
            location = j.get("jobGeo", "Remote")

            job = Job(
                title=title,
                company=company,
                location=location,
                job_url=j.get("url", ""),
                employment_type=j.get("jobType", "Full-time"),
                experience_level=j.get("jobLevel", detect_exp_level(title, desc)),
                is_remote=True,
                posted_date=posted,
                description=desc,
                skills=extract_skills(desc + " ".join(j.get("jobSkills", []))),
                technologies=extract_skills(desc),
                requirements=extract_requirements(desc),
                salary=j.get("annualSalaryMin", ""),
                education=extract_education(desc),
                department=j.get("jobIndustry", [""])[0] if j.get("jobIndustry") else "",
                source="Jobicy",
                scrape_timestamp=now_iso(),
                career_page_url="https://jobicy.com",
                ats_platform="jobicy",
            )
            jobs.append(job)

        log.info(f"Jobicy: {len(jobs)} jobs")
    except Exception as e:
        log.warning(f"Jobicy: {e}")
    return jobs

# ─────────────────────────────────────────────────────────────────────────────
# WELLFOUND (AngelList Talent) – public API
# ─────────────────────────────────────────────────────────────────────────────
async def scrape_wellfound(session: aiohttp.ClientSession) -> list[Job]:
    """Scrape Wellfound startup jobs via public search."""
    jobs = []
    url = "https://wellfound.com/jobs"
    try:
        await async_rand_delay()
        async with session.get(url, headers=make_headers({"Accept": "text/html"}),
                               timeout=aiohttp.ClientTimeout(total=REQUEST_TIMEOUT)) as resp:
            if resp.status != 200:
                log.warning(f"Wellfound: HTTP {resp.status}")
                return jobs
            html_text = await resp.text()

        soup = BeautifulSoup(html_text, "lxml")
        # Extract JSON-LD
        for script in soup.find_all("script", type="application/ld+json"):
            try:
                ld = json.loads(script.string or "")
                if isinstance(ld, list):
                    items = ld
                elif ld.get("@type") == "ItemList":
                    items = ld.get("itemListElement", [])
                else:
                    items = [ld]
                for item in items:
                    if item.get("@type") == "JobPosting":
                        posted = normalize_date(item.get("datePosted", ""))
                        if not is_recent(posted):
                            continue
                        desc = clean_html(item.get("description", ""))
                        title = item.get("title", "")
                        company = (item.get("hiringOrganization") or {}).get("name", "")
                        loc = (item.get("jobLocation") or {})
                        if isinstance(loc, list):
                            loc = loc[0] if loc else {}
                        location = (loc.get("address") or {}).get("addressLocality", "")
                        job = Job(
                            title=title,
                            company=company,
                            location=location,
                            job_url=item.get("url", ""),
                            employment_type=item.get("employmentType", "Full-time"),
                            experience_level=detect_exp_level(title, desc),
                            is_remote=detect_remote(desc + location),
                            posted_date=posted,
                            description=desc,
                            skills=extract_skills(desc),
                            technologies=extract_skills(desc),
                            requirements=extract_requirements(desc),
                            salary=extract_salary(str(item.get("baseSalary", "")) + desc),
                            education=extract_education(desc),
                            source="Wellfound",
                            scrape_timestamp=now_iso(),
                            career_page_url="https://wellfound.com/jobs",
                            ats_platform="wellfound",
                        )
                        jobs.append(job)
            except Exception:
                pass
        log.info(f"Wellfound: {len(jobs)} jobs")
    except Exception as e:
        log.warning(f"Wellfound: {e}")
    return jobs

# ─────────────────────────────────────────────────────────────────────────────
# GENERIC JSON-LD SCRAPER (for any career page)
# ─────────────────────────────────────────────────────────────────────────────
async def scrape_generic_jsonld(session: aiohttp.ClientSession, url: str, source_name: str = "") -> list[Job]:
    """
    Scrapes any career page for JSON-LD JobPosting structured data.
    Works on many company career pages (Google, Apple, etc.)
    """
    jobs = []
    if not source_name:
        source_name = urlparse(url).netloc
    try:
        await async_rand_delay()
        async with session.get(url, headers=make_headers(),
                               timeout=aiohttp.ClientTimeout(total=REQUEST_TIMEOUT)) as resp:
            if resp.status != 200:
                log.warning(f"Generic [{source_name}]: HTTP {resp.status}")
                return jobs
            html_text = await resp.text()

        soup = BeautifulSoup(html_text, "lxml")
        for script in soup.find_all("script", type="application/ld+json"):
            try:
                ld = json.loads(script.string or "")
                items = []
                if isinstance(ld, list):
                    items = ld
                elif ld.get("@type") == "JobPosting":
                    items = [ld]
                elif ld.get("@type") == "ItemList":
                    items = [x.get("item", x) for x in ld.get("itemListElement", [])]

                for item in items:
                    if item.get("@type") != "JobPosting":
                        continue
                    posted = normalize_date(item.get("datePosted", ""))
                    if not is_recent(posted):
                        continue
                    desc = clean_html(item.get("description", ""))
                    title = item.get("title", "")
                    company_data = item.get("hiringOrganization") or {}
                    company = company_data.get("name", source_name)
                    loc_data = item.get("jobLocation") or {}
                    if isinstance(loc_data, list):
                        loc_data = loc_data[0] if loc_data else {}
                    addr = loc_data.get("address") or {}
                    if isinstance(addr, str):
                        location = addr
                    else:
                        location = ", ".join(filter(None, [
                            addr.get("addressLocality", ""),
                            addr.get("addressRegion", ""),
                            addr.get("addressCountry", ""),
                        ]))

                    base_salary = item.get("baseSalary") or {}
                    salary_val = ""
                    if isinstance(base_salary, dict):
                        val = base_salary.get("value") or {}
                        if isinstance(val, dict):
                            salary_val = f"{val.get('minValue','')}-{val.get('maxValue','')} {base_salary.get('currency','')} / {val.get('unitText','')}"
                        else:
                            salary_val = str(val)

                    job = Job(
                        title=title,
                        company=company,
                        location=location,
                        job_url=item.get("url", url),
                        employment_type=item.get("employmentType", detect_emp_type(desc)),
                        experience_level=detect_exp_level(title, desc),
                        is_remote=item.get("jobLocationType") == "TELECOMMUTE" or detect_remote(desc + location),
                        posted_date=posted,
                        description=desc,
                        skills=extract_skills(desc),
                        technologies=extract_skills(desc),
                        requirements=extract_requirements(desc),
                        salary=salary_val or extract_salary(desc),
                        education=item.get("educationRequirements", extract_education(desc)),
                        experience_required=item.get("experienceRequirements", ""),
                        department="",
                        source=source_name,
                        scrape_timestamp=now_iso(),
                        career_page_url=url,
                        ats_platform="json-ld",
                    )
                    jobs.append(job)
            except Exception:
                pass

    except asyncio.TimeoutError:
        log.warning(f"Generic [{source_name}]: timeout")
    except Exception as e:
        log.warning(f"Generic [{source_name}]: {e}")
    return jobs

# ─────────────────────────────────────────────────────────────────────────────
# PLAYWRIGHT SCRAPER (JavaScript-rendered pages)
# ─────────────────────────────────────────────────────────────────────────────
async def scrape_with_playwright(url: str, source_name: str = "") -> list[Job]:
    """
    Falls back to Playwright for JS-heavy pages.
    Extracts JSON-LD or structured job data after JS execution.
    """
    jobs = []
    try:
        from playwright.async_api import async_playwright
    except ImportError:
        log.warning("Playwright not installed. Skipping JS-rendered page: " + url)
        return jobs

    if not source_name:
        source_name = urlparse(url).netloc

    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True, args=[
                "--no-sandbox", "--disable-setuid-sandbox",
                "--disable-blink-features=AutomationControlled",
            ])
            context = await browser.new_context(
                user_agent=rand_ua(),
                viewport={"width": 1280, "height": 800},
                extra_http_headers={"Accept-Language": "en-US,en;q=0.9"},
            )
            page = await context.new_page()
            await page.goto(url, timeout=PLAYWRIGHT_TIMEOUT, wait_until="networkidle")
            await asyncio.sleep(2)
            content = await page.content()
            await browser.close()

        # Now parse via JSON-LD + BeautifulSoup
        soup = BeautifulSoup(content, "lxml")
        for script in soup.find_all("script", type="application/ld+json"):
            try:
                ld = json.loads(script.string or "")
                items = ld if isinstance(ld, list) else [ld]
                for item in items:
                    if item.get("@type") != "JobPosting":
                        continue
                    posted = normalize_date(item.get("datePosted", ""))
                    if not is_recent(posted):
                        continue
                    desc = clean_html(item.get("description", ""))
                    title = item.get("title", "")
                    job = Job(
                        title=title,
                        company=(item.get("hiringOrganization") or {}).get("name", source_name),
                        location=str((item.get("jobLocation") or {}).get("address", "")),
                        job_url=item.get("url", url),
                        employment_type=item.get("employmentType", "Full-time"),
                        experience_level=detect_exp_level(title, desc),
                        is_remote=detect_remote(desc),
                        posted_date=posted,
                        description=desc,
                        skills=extract_skills(desc),
                        technologies=extract_skills(desc),
                        requirements=extract_requirements(desc),
                        salary=extract_salary(desc),
                        education=extract_education(desc),
                        source=source_name,
                        scrape_timestamp=now_iso(),
                        career_page_url=url,
                        ats_platform="playwright-jsonld",
                    )
                    jobs.append(job)
            except Exception:
                pass

        log.info(f"Playwright [{source_name}]: {len(jobs)} jobs")
    except Exception as e:
        log.warning(f"Playwright [{source_name}]: {e}")
    return jobs

# ─────────────────────────────────────────────────────────────────────────────
# DEDUPLICATION
# ─────────────────────────────────────────────────────────────────────────────
def deduplicate(jobs: list[Job]) -> list[Job]:
    seen = {}
    for j in jobs:
        h = job_hash(j)
        if h not in seen:
            seen[h] = j
    return list(seen.values())

# ─────────────────────────────────────────────────────────────────────────────
# MAIN ORCHESTRATOR
# ─────────────────────────────────────────────────────────────────────────────
async def run_all_scrapers() -> list[Job]:
    all_jobs: list[Job] = []
    sem = asyncio.Semaphore(CONCURRENCY)

    connector = aiohttp.TCPConnector(limit=CONCURRENCY)
    timeout   = aiohttp.ClientTimeout(total=60)

    async def safe(coro):
        async with sem:
            try:
                return await coro
            except Exception as e:
                log.error(f"Task failed: {e}")
                return []

    async with aiohttp.ClientSession(connector=connector, timeout=timeout) as session:
        tasks = []

        # ── Greenhouse ────────────────────────────────────────────────────
        log.info(f"Queuing {len(GREENHOUSE_COMPANIES)} Greenhouse companies…")
        for c in GREENHOUSE_COMPANIES:
            tasks.append(safe(scrape_greenhouse(session, c)))

        # ── Lever ─────────────────────────────────────────────────────────
        log.info(f"Queuing {len(LEVER_COMPANIES)} Lever companies…")
        for c in LEVER_COMPANIES:
            tasks.append(safe(scrape_lever(session, c)))

        # ── Ashby ─────────────────────────────────────────────────────────
        log.info(f"Queuing {len(ASHBY_COMPANIES)} Ashby companies…")
        for c in ASHBY_COMPANIES:
            tasks.append(safe(scrape_ashby(session, c)))

        # ── SmartRecruiters ───────────────────────────────────────────────
        log.info(f"Queuing {len(SMARTRECRUITERS_COMPANIES)} SmartRecruiters companies…")
        for c in SMARTRECRUITERS_COMPANIES:
            tasks.append(safe(scrape_smartrecruiters(session, c)))

        # ── BambooHR ──────────────────────────────────────────────────────
        log.info(f"Queuing {len(BAMBOOHR_COMPANIES)} BambooHR companies…")
        for c in BAMBOOHR_COMPANIES:
            tasks.append(safe(scrape_bamboohr(session, c)))

        # ── Workday ───────────────────────────────────────────────────────
        log.info(f"Queuing {len(WORKDAY_TENANTS)} Workday tenants…")
        for company, tenant in WORKDAY_TENANTS:
            tasks.append(safe(scrape_workday(session, company, tenant)))

        # ── Free public job APIs ──────────────────────────────────────────
        tasks.append(safe(scrape_remotive(session)))
        tasks.append(safe(scrape_arbeitnow(session)))
        tasks.append(safe(scrape_jobicy(session)))
        tasks.append(safe(scrape_wellfound(session)))

        # ── Custom career URLs (JSON-LD extraction) ───────────────────────
        log.info(f"Queuing {len(CUSTOM_CAREER_URLS)} custom career URLs…")
        for url in CUSTOM_CAREER_URLS:
            ats = detect_ats(url)
            if ats == "unknown":
                tasks.append(safe(scrape_generic_jsonld(session, url)))
            # ATS-specific URLs handled separately above

        # ── Run all tasks concurrently ────────────────────────────────────
        log.info(f"Running {len(tasks)} total scraping tasks with concurrency={CONCURRENCY}…")
        results = await asyncio.gather(*tasks, return_exceptions=True)

        for r in results:
            if isinstance(r, list):
                all_jobs.extend(r)

    # ── Playwright fallback for custom JS-heavy URLs ──────────────────────
    JS_URLS = []  # Add JS-heavy URLs here if needed
    for url in JS_URLS:
        pw_jobs = await scrape_with_playwright(url)
        all_jobs.extend(pw_jobs)

    return all_jobs

# ─────────────────────────────────────────────────────────────────────────────
# OUTPUT
# ─────────────────────────────────────────────────────────────────────────────
def save_output(jobs: list[Job]):
    data = {
        "meta": {
            "total_jobs": len(jobs),
            "scrape_time": now_iso(),
            "max_days_old": MAX_DAYS_OLD,
            "sources": sorted(list({j.source for j in jobs})),
        },
        "jobs": [asdict(j) for j in jobs],
    }
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    log.info(f"✅ Saved {len(jobs)} jobs → {OUTPUT_FILE}")

# ─────────────────────────────────────────────────────────────────────────────
# ENTRY POINT
# ─────────────────────────────────────────────────────────────────────────────
def main():
    start = time.time()
    log.info("=" * 60)
    log.info("  Job Scraper Starting")
    log.info(f"  Target: jobs from last {MAX_DAYS_OLD} days")
    log.info("=" * 60)

    try:
        all_jobs = asyncio.run(run_all_scrapers())
    except KeyboardInterrupt:
        log.warning("Interrupted by user.")
        all_jobs = []

    log.info(f"Raw jobs collected: {len(all_jobs)}")
    deduped = deduplicate(all_jobs)
    log.info(f"After deduplication: {len(deduped)}")

    # Filter one more time just to be safe
    recent = [j for j in deduped if is_recent(j.posted_date)]
    log.info(f"After recency filter: {len(recent)}")

    for job in recent:
        job.priority_score = fresher_priority(job)
    recent.sort(key=lambda job: (job.priority_score, job.posted_date or ""), reverse=True)

    save_output(recent)

    elapsed = time.time() - start
    log.info(f"⏱  Completed in {elapsed:.1f}s")
    log.info(f"📄 Output: {OUTPUT_FILE}")

    # Quick summary
    by_source: dict[str, int] = {}
    for j in recent:
        by_source[j.source] = by_source.get(j.source, 0) + 1
    log.info("─── Jobs by source ───")
    for src, cnt in sorted(by_source.items(), key=lambda x: -x[1]):
        log.info(f"  {src:<25} {cnt:>5}")


if __name__ == "__main__":
    main()
