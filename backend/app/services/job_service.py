
from sqlalchemy.orm import Session
from typing import List, Optional, Dict
import requests
import os

from app.models.job import Job, Skill
from app.schemas.job_schema import JobCreate
import csv
import os

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

def compute_match_score(job: Job, user_skills: List[str], ats_score: Optional[any]) -> int:
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

    req_skills = [s.name.lower() for s in job.required_skills]
    user_skills_lower = [s.lower() for s in user_skills]
    
    if not req_skills:
        skills_score = 100 if user_skills_lower else 0
    else:
        # Fuzzy overlap: check if req_skill is in any user_skill or vice versa
        overlap = 0
        for rs in req_skills:
            if any(rs in us or us in rs for us in user_skills_lower):
                overlap += 1
        
        skills_score = int((overlap / len(req_skills)) * 100)

    if ats_val is None:
        total = skills_score
    else:
        total = int(skills_score * 0.7 + ats_val * 0.3)
    
    return max(0, min(100, total))

def fetch_latest_jobs_from_api(query: str = "Developer", location: str = "India"):
    """
    Fetch jobs from JSearch API.
    """
    url = "https://jsearch.p.rapidapi.com/search"
    querystring = {"query": f"{query} in {location}", "num_pages": "1", "num_results": "20"}
    headers = {
        "X-RapidAPI-Key": "1101e1ed37msh81073c685023a8bp15f3cbjsn8add310c338d",
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
    }
    
    try:
        response = requests.get(url, headers=headers, params=querystring, timeout=30)
        if response.status_code == 200:
            return response.json().get('data', [])
        return []
    except Exception as e:
        print(f"Error fetching jobs: {e}")
        # Return fallback sample data for testing purposes
        return [
            {
                "job_title": "Sample Python Developer (API Test)",
                "employer_name": "Test Company AI",
                "job_city": "Mumbai",
                "job_country": "India",
                "job_salary_range": "8L - 15L PA",
                "job_employment_type": "Full-time",
                "job_description": "This is a sample job returned because the real API timed out. It proves the system is working!",
                "job_apply_link": "https://example.com/apply"
            }
        ]



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
    # Save to CSV first
    save_jobs_to_csv(api_jobs)
    
    synced_jobs = []

    for aj in api_jobs:
        # Simple check for duplicates by title and company
        exists = db.query(Job).filter(Job.title == aj.get('job_title'), Job.company == aj.get('employer_name')).first()
        if not exists:
            job = Job(
                title=aj.get('job_title'),
                company=aj.get('employer_name'),
                location=f"{aj.get('job_city', '')} {aj.get('job_country', '')}".strip() or aj.get('job_location'),
                salary=aj.get('job_salary_range', 'Not disclosed'),
                type=aj.get('job_employment_type', 'Full-time'),
                description=aj.get('job_description', '')[:500] + "...",
                apply_link=aj.get('job_apply_link', '#'),
                is_api=True
            )
            db.add(job)
            db.flush()
            
            common = ["Python", "React", "Node", "Java", "SQL", "JavaScript", "TypeScript"]
            for s in common:
                if s.lower() in (aj.get('job_title') + aj.get('job_description')).lower():
                    skill = ensure_skill(db, s)
                    job.required_skills.append(skill)
            
            synced_jobs.append(job)
        else:
            # If exists, still add to the list we show to user for "Latest"
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
            "required_skills": [s.name for s in j.required_skills]
        }
        for j in synced_jobs
    ]

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


