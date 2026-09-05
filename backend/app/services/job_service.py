
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional, Dict, Any
import requests
import os
import hashlib
import logging
import re
from datetime import datetime, timezone, timedelta

from app.models.job import Job, Skill
from app.schemas.job_schema import JobCreate
import csv

from app.core.config import settings

logger = logging.getLogger(__name__)

FRESHER_TERMS = ("fresher", "entry level", "entry-level", "graduate", "new grad", "junior", "trainee", "intern", "associate")
SENIOR_TERMS = ("senior", "sr.", "staff", "principal", "lead", "manager", "director", "head of", "architect")


def normalize_skill(value: str) -> str:
    aliases = {"node.js": "node", "nodejs": "node", "react.js": "react", "postgres": "postgresql",
               "scikit-learn": "sklearn", "machine-learning": "machine learning", "js": "javascript"}
    normalized = re.sub(r"\s+", " ", value.strip().lower())
    return aliases.get(normalized, normalized)


def parse_posted_at(job: Dict[str, Any]) -> Optional[datetime]:
    raw = job.get("job_posted_at_datetime_utc") or job.get("posted_at") or job.get("posted_date")
    if raw:
        try:
            parsed = datetime.fromisoformat(str(raw).replace("Z", "+00:00"))
            return parsed if parsed.tzinfo else parsed.replace(tzinfo=timezone.utc)
        except (ValueError, TypeError):
            pass
    timestamp = job.get("job_posted_at_timestamp")
    try:
        return datetime.fromtimestamp(int(timestamp), tz=timezone.utc) if timestamp else None
    except (ValueError, TypeError, OSError):
        return None


def freshness_score(posted_at: Optional[datetime], fetched_at: Optional[datetime] = None) -> float:
    reference = posted_at or fetched_at
    if not reference:
        return 15.0
    if reference.tzinfo is None:
        reference = reference.replace(tzinfo=timezone.utc)
    age_days = max(0.0, (datetime.now(timezone.utc) - reference).total_seconds() / 86400)
    if age_days <= 1: return 100.0
    if age_days <= 3: return 90.0
    if age_days <= 7: return 75.0
    if age_days <= 14: return 55.0
    if age_days <= 30: return 30.0
    return 5.0


def suitability_score(title: str, description: str, experience_level: Optional[str] = None) -> float:
    text = f"{title} {description or ''} {experience_level or ''}".lower()
    if any(term in text for term in SENIOR_TERMS):
        return 5.0
    if any(term in text for term in FRESHER_TERMS):
        return 100.0
    years = [int(value) for value in re.findall(r"(\d+)\+?\s*(?:years?|yrs?)", text)]
    if years and min(years) >= 3:
        return 10.0
    if years and min(years) <= 1:
        return 85.0
    return 55.0


def job_fingerprint(title: str, company: str, location: str, external_id: Optional[str] = None) -> str:
    key = external_id or "|".join(re.sub(r"\W+", " ", value.lower()).strip() for value in (title or "", company or "", location or ""))
    return hashlib.sha256(key.encode("utf-8")).hexdigest()


def backfill_job_metadata() -> None:
    """Populate ranking metadata for legacy jobs without changing their job content."""
    from app.db.database import SessionLocal
    db = SessionLocal()
    try:
        for job in db.query(Job).all():
            job.fingerprint = job.fingerprint or job_fingerprint(job.title, job.company, job.location or "")
            job.source = job.source or ("legacy_api" if job.is_api else "catalog")
            job.fetched_at = job.fetched_at or job.created_at or datetime.now(timezone.utc)
            job.freshness_score = freshness_score(job.posted_at, job.fetched_at)
            job.relevance_score = suitability_score(job.title, job.description or "", job.experience_level)
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()

def ensure_skill(db: Session, skill_name: str) -> Skill:
    skill = db.query(Skill).filter(Skill.name == skill_name).first()
    if not skill:
        skill = Skill(name=skill_name)
        db.add(skill)
        db.flush()  # assign id
    return skill

def create_job(db: Session, job_in: JobCreate) -> Job:
    job = Job(
        title=job_in.title,
        company=job_in.company,
        location=job_in.location,
        salary=job_in.salary,
        type=job_in.type,
        description=job_in.description,
        apply_link=job_in.apply_link,
        fingerprint=job_fingerprint(job_in.title, job_in.company, job_in.location or ""),
    )
    db.add(job)
    # attach skills
    for s in (job_in.required_skills or []):
        skill = ensure_skill(db, s)
        job.required_skills.append(skill)
    db.commit()
    db.refresh(job)
    return job

def list_jobs(db: Session, search: Optional[str] = None, job_type: Optional[str] = None, skills: Optional[List[str]] = None):
    q = db.query(Job).distinct()
    if search:
        like = f"%{search.lower()}%"
        q = q.filter((Job.title.ilike(like)) | (Job.company.ilike(like)))
    if job_type and job_type.lower() != "all":
        # allow match 'Remote' if location contains remote or type contains remote
        q = q.filter((Job.type.ilike(f"%{job_type}%")) | (Job.location.ilike(f"%{job_type}%")))
    if skills and len(skills) > 0:
        # Match jobs that have at least one of the selected skills
        q = q.filter(Job.required_skills.any(Skill.name.in_(skills)))
    return q.all()

def compute_match_details(job: Job, user_skills: List[str], ats_score: Optional[Any]) -> Dict[str, Any]:
    """
    Weighted scoring with fuzzy skill matching:
      - skills overlap (fuzzy): 70% of score
      - ats_score (if present): 30% of score
    Result 0-100 as int.
    """
    try:
        ats_val = int(ats_score) if ats_score is not None else None
    except (ValueError, TypeError):
        ats_val = 0

    req_skills = [normalize_skill(s.name) for s in job.required_skills]
    user_skills_lower = [normalize_skill(s) for s in user_skills if s]
    
    if not req_skills:
        skills_score = 40 if user_skills_lower else 0
    else:
        # Fuzzy overlap: check if req_skill is in any user_skill or vice versa
        overlap = 0
        for rs in req_skills:
            if any(rs == us or (len(rs) >= 4 and rs in us) or (len(us) >= 4 and us in rs) for us in user_skills_lower):
                overlap += 1
        
        skills_score = int((overlap / len(req_skills)) * 100)

    fresh = freshness_score(job.posted_at, job.fetched_at or job.created_at)
    suitable = suitability_score(job.title, job.description or "", job.experience_level)
    ats_component = max(0, min(100, ats_val if ats_val is not None else 50))
    total = round(skills_score * 0.55 + ats_component * 0.10 + fresh * 0.20 + suitable * 0.15)
    return {"total": max(0, min(100, total)), "skills": skills_score, "resume_quality": ats_component,
            "freshness": round(fresh), "fresher_suitability": round(suitable)}


def compute_match_score(job: Job, user_skills: List[str], ats_score: Optional[Any]) -> int:
    return compute_match_details(job, user_skills, ats_score)["total"]

def fetch_latest_jobs_from_api(query: str = "Developer", location: str = "India"):
    """
    Fetch jobs from JSearch API.
    """
    url = "https://jsearch.p.rapidapi.com/search"
    querystring = {"query": f"{query} in {location}", "num_pages": "1", "num_results": "20"}
    if not settings.RAPIDAPI_KEY:
        logger.warning("RAPIDAPI_KEY is not configured; latest-job fetch skipped")
        return []
    headers = {"X-RapidAPI-Key": settings.RAPIDAPI_KEY, "X-RapidAPI-Host": settings.RAPIDAPI_HOST}
    
    try:
        response = requests.get(url, headers=headers, params=querystring, timeout=30)
        if response.status_code == 200:
            return response.json().get('data', [])
        logger.warning("JSearch returned status %s", response.status_code)
        return []
    except requests.RequestException as exc:
        logger.warning("Latest job fetch failed: %s", exc.__class__.__name__)
        return []



def save_jobs_to_csv(jobs_data: List[Dict]):
    """
    Append fetched jobs to a local CSV file.
    """
    # Fix the path to point directly to backend/data
    current_dir = os.path.dirname(os.path.abspath(__file__))
    # current_dir is backend/app/services, so we go up 2 levels to reach backend/
    backend_dir = os.path.abspath(os.path.join(current_dir, "../../"))
    file_path = os.path.join(backend_dir, "data", "latest_jobs_fetched.csv")
    
    os.makedirs(os.path.dirname(file_path), exist_ok=True)


    
    file_exists = os.path.isfile(file_path)
    existing_entries = set()
    
    if file_exists:
        try:
            with open(file_path, mode='r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    existing_entries.add(f"{row.get('title')}-{row.get('company')}")
        except Exception as e:
            print(f"Error reading CSV for duplicates: {e}")

    fields = ['title', 'company', 'location', 'salary', 'type', 'description', 'apply_link', 'created_at']
    
    # Read existing content
    existing_rows = []
    if file_exists:
        try:
            with open(file_path, mode='r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                existing_rows = list(reader)
        except Exception as e:
            print(f"Error reading CSV for prepending: {e}")

    from datetime import datetime
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # Prepare new rows (only unique ones)
    new_rows = []
    for job in jobs_data:
        title = job.get('job_title')
        company = job.get('employer_name')
        if f"{title}-{company}" not in existing_entries:
            new_rows.append({
                'title': title,
                'company': company,
                'location': f"{job.get('job_city', '')} {job.get('job_country', '')}".strip() or job.get('job_location'),
                'salary': job.get('job_salary_range', 'Not disclosed') or 'Not disclosed',
                'type': job.get('job_employment_type', 'Full-time'),
                'description': job.get('job_description', '')[:500] + "...",
                'apply_link': job.get('job_apply_link', '#'),
                'created_at': now_str
            })
            existing_entries.add(f"{title}-{company}")

    # Write back: New rows first, then old rows
    all_rows = new_rows + existing_rows
    with open(file_path, mode='w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        writer.writerows(all_rows)


def sync_api_jobs_to_db(db: Session, api_jobs: List[Dict]):
    """
    Convert API job data to Job models and save to DB if they don't exist.
    Also saves to CSV.
    """
    # Supabase is canonical; CSV export remains an explicit diagnostic utility only.
    synced_jobs = []

    now = datetime.now(timezone.utc)
    for aj in api_jobs:
        title = (aj.get('job_title') or '').strip()
        company = (aj.get('employer_name') or '').strip()
        location = f"{aj.get('job_city', '')} {aj.get('job_country', '')}".strip() or aj.get('job_location') or ""
        if not title or not company:
            continue
        external_id = aj.get("job_id")
        fingerprint = job_fingerprint(title, company, location, external_id)
        exists = db.query(Job).filter(Job.fingerprint == fingerprint).first()
        if not exists:
            exists = db.query(Job).filter(func.lower(Job.title) == title.lower(), func.lower(Job.company) == company.lower()).first()
        posted_at = parse_posted_at(aj)
        description = aj.get('job_description') or ''
        experience = aj.get("job_required_experience", {}).get("required_experience_in_months") if isinstance(aj.get("job_required_experience"), dict) else None
        experience_level = "Junior" if experience is not None and experience <= 24 else ("Senior" if experience is not None and experience >= 60 else None)
        fresh_score = freshness_score(posted_at, now)
        suitable_score = suitability_score(title, description, experience_level)
        if not exists:
            job = Job(
                title=title,
                company=company,
                location=location,
                salary=aj.get('job_salary_range', 'Not disclosed'),
                type=aj.get('job_employment_type', 'Full-time'),
                description=description[:5000],
                apply_link=aj.get('job_apply_link', '#'),
                is_api=True, external_id=external_id, source="jsearch", posted_at=posted_at,
                fetched_at=now, experience_level=experience_level,
                is_remote=bool(aj.get("job_is_remote")), freshness_score=fresh_score,
                relevance_score=suitable_score, fingerprint=fingerprint, raw_payload=aj,
            )
            db.add(job)
            db.flush()
            
            common = ["Python", "React", "Node", "Java", "SQL", "JavaScript", "TypeScript", "AWS", "Docker", "Machine Learning", "FastAPI"]
            for s in common:
                if s.lower() in f"{title} {description}".lower():
                    skill = ensure_skill(db, s)
                    job.required_skills.append(skill)
            
            synced_jobs.append(job)
        else:
            exists.external_id = external_id or exists.external_id
            exists.fingerprint = fingerprint
            exists.description = description[:5000] or exists.description
            exists.apply_link = aj.get('job_apply_link') or exists.apply_link
            exists.posted_at = posted_at or exists.posted_at
            exists.fetched_at = now
            exists.freshness_score = fresh_score
            exists.relevance_score = suitable_score
            exists.raw_payload = aj
            synced_jobs.append(exists)
            
    db.commit()
    
    # Return as list of dicts for the route
    return [
        {
            "id": j.id,
            "title": j.title,
            "company": j.company,
            "location": j.location,
            "salary": j.salary,
            "type": j.type,
            "description": j.description,
            "posted": j.posted,
            "apply_link": j.apply_link,
            "is_api": j.is_api,
            "posted_at": j.posted_at.isoformat() if j.posted_at else None,
            "fetched_at": j.fetched_at.isoformat() if j.fetched_at else None,
            "source": j.source,
            "experience_level": j.experience_level,
            "is_remote": j.is_remote,
            "freshness_score": float(j.freshness_score or 0),
            "relevance_score": float(j.relevance_score or 0),
            "required_skills": [s.name for s in j.required_skills]
        }
        for j in sorted(synced_jobs, key=lambda item: (float(item.freshness_score or 0), float(item.relevance_score or 0)), reverse=True)
    ]


def sync_normalized_jobs_to_db(db: Session, jobs_data: List[Dict[str, Any]]) -> Dict[str, int]:
    """Upsert normalized multi-source scraper output into the canonical jobs table."""
    inserted = updated = skipped = 0
    now = datetime.now(timezone.utc)
    try:
        for item in jobs_data:
            title = str(item.get("title") or "").strip()
            company = str(item.get("company") or "").strip()
            location = str(item.get("location") or "").strip()
            apply_link = str(item.get("job_url") or item.get("apply_link") or "").strip()
            if not title or not company or not apply_link.startswith(("https://", "http://")):
                skipped += 1
                continue
            posted_at = parse_posted_at(item)
            if posted_at and posted_at < now - timedelta(days=30):
                skipped += 1
                continue
            external_id = str(item.get("external_id") or "").strip() or None
            fingerprint = job_fingerprint(title, company, location, external_id)
            job = db.query(Job).filter(Job.fingerprint == fingerprint).first()
            if not job:
                job = db.query(Job).filter(func.lower(Job.title) == title.lower(),
                                           func.lower(Job.company) == company.lower()).first()
            is_new = job is None
            if is_new:
                job = Job(title=title, company=company, location=location, fingerprint=fingerprint)
                db.add(job)
                inserted += 1
            else:
                updated += 1
            description = str(item.get("description") or "")[:5000]
            job.location = location or job.location
            job.salary = str(item.get("salary") or "")[:100] or job.salary
            job.type = str(item.get("employment_type") or item.get("type") or "Full-time")[:50]
            job.description = description or job.description
            job.apply_link = apply_link
            job.is_api = True
            job.external_id = external_id or job.external_id
            job.source = str(item.get("source") or "multi_source_scraper")[:80]
            job.posted_at = posted_at or job.posted_at
            job.fetched_at = now
            job.experience_level = str(item.get("experience_level") or "")[:30] or None
            job.is_remote = bool(item.get("is_remote"))
            job.freshness_score = freshness_score(job.posted_at, now)
            job.relevance_score = suitability_score(title, description, job.experience_level)
            job.fingerprint = fingerprint
            job.raw_payload = item
            db.flush()
            existing_skills = {normalize_skill(skill.name) for skill in job.required_skills}
            for name in (item.get("skills") or item.get("technologies") or []):
                clean_name = str(name).strip()
                if clean_name and normalize_skill(clean_name) not in existing_skills:
                    job.required_skills.append(ensure_skill(db, clean_name))
                    existing_skills.add(normalize_skill(clean_name))
        db.commit()
    except Exception:
        db.rollback()
        raise
    return {"inserted": inserted, "updated": updated, "skipped": skipped}

def get_api_job_history(db: Session):
    """
    Get all jobs from the latest_jobs_fetched.csv file, newest first.
    """
    current_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.abspath(os.path.join(current_dir, "../../"))
    file_path = os.path.join(backend_dir, "data", "latest_jobs_fetched.csv")
    
    jobs = []
    if os.path.isfile(file_path):
        try:
            with open(file_path, mode='r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for i, row in enumerate(reader):
                    # Mock an ID for frontend tracking
                    row['id'] = -(i + 1) 
                    row['is_api'] = True
                    row['required_skills'] = [] 
                    # If created_at is missing, use a very old date
                    if not row.get('created_at'):
                        row['created_at'] = "2024-01-01 00:00:00"
                    jobs.append(row)
        except Exception as e:
            print(f"Error reading CSV history: {e}")
            
    # Sort by created_at descending (Latest First)
    jobs.sort(key=lambda x: x.get('created_at', ''), reverse=True)
    return jobs


