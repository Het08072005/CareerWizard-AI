# app/services/job_service.py
from sqlalchemy.orm import Session
from typing import List, Optional, Dict
from app.models.job import Job, Skill
from app.schemas.job_schema import JobCreate

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
        # join with skills: require job to have all selected skills
        for s in skills:
            q = q.filter(Job.required_skills.any(Skill.name == s))
    return q.all()

def compute_match_score(job: Job, user_skills: List[str], ats_score: Optional[int]) -> int:
    """
    Simple weighted scoring:
      - skills overlap: 70% of score
      - ats_score (if present): 30% of score
    Result 0-100 as int.
    """
    req_skills = [s.name for s in job.required_skills]
    if len(req_skills) == 0:
        skills_score = 0
    else:
        overlap = sum(1 for s in req_skills if s in user_skills)
        skills_score = int((overlap / len(req_skills)) * 100)

    if ats_score is None:
        total = skills_score
    else:
        total = int(skills_score * 0.7 + ats_score * 0.3)
    # clamp
    total = max(0, min(100, total))
    return total
