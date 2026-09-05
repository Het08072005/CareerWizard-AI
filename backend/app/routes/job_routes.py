
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.job import Job
from app.services.job_service import compute_match_details, fetch_latest_jobs_from_api, sync_api_jobs_to_db

from app.utils.file_utils import extract_text_from_pdf, extract_text_from_docx
from app.services.ai_service import analyze_resume_with_ai
from app.core.auth import get_current_user
from app.models.activity import UserActivity
from app.schemas.job_schema import JobOut, JobMatch

router = APIRouter(prefix="/jobs", tags=["jobs"])


def serialize_job(job: Job) -> JobOut:
    return JobOut(
        id=job.id, title=job.title, company=job.company, location=job.location,
        salary=job.salary, type=job.type, description=job.description, posted=job.posted,
        apply_link=getattr(job, "apply_link", "#") or "#", is_api=bool(getattr(job, "is_api", False)),
        created_at=job.created_at.isoformat() if getattr(job, "created_at", None) else None,
        posted_at=job.posted_at.isoformat() if getattr(job, "posted_at", None) else None,
        fetched_at=job.fetched_at.isoformat() if getattr(job, "fetched_at", None) else None,
        source=getattr(job, "source", None), experience_level=getattr(job, "experience_level", None),
        is_remote=bool(getattr(job, "is_remote", False)), freshness_score=float(getattr(job, "freshness_score", 0) or 0),
        relevance_score=float(getattr(job, "relevance_score", 0) or 0),
        required_skills=[skill.name for skill in job.required_skills],
    )



# GET ALL JOBS (DEFAULT WHEN NO RESUME UPLOADED)

@router.get("/all", response_model=List[JobOut])
def get_all_jobs(db: Session = Depends(get_db)):
    jobs = db.query(Job).order_by(Job.relevance_score.desc().nullslast(), Job.posted_at.desc().nullslast(), Job.created_at.desc()).limit(500).all()
    return [serialize_job(job) for job in jobs]


#  MATCH RESUME AGAINST JOBS

@router.post("/match-resume", response_model=List[JobMatch])
async def match_jobs_with_resume(
    resume: UploadFile = File(...),
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    content = await resume.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Resume files must be 10 MB or smaller")
    filename = (resume.filename or "resume.txt").lower()

    if filename.endswith(".pdf"):
        text = extract_text_from_pdf(content)
    elif filename.endswith(".docx"):
        text = extract_text_from_docx(content)
    elif filename.endswith((".txt", ".md")):
        text = content.decode("utf-8", errors="ignore")
    else:
        raise HTTPException(status_code=415, detail="Only PDF, DOCX and text resumes are supported")

    if not text or len(text.strip()) < 20:
        raise HTTPException(400, "Could not read valid text from resume")

    # Call AI
    analysis = await analyze_resume_with_ai(text=text)

    ats_score = analysis.get("ats_score", 0)
    user_skills = analysis.get("skills", [])

    # fallback skill extraction
    if not user_skills:
        common = [
            "Python", "Java", "React", "Node", "SQL", "AWS", "Docker", 
            "TypeScript", "Next.js", "JavaScript", "Tailwind", "PostgreSQL",
            "MongoDB", "Express", "Kubernetes", "Terraform", "Go", "Swift",
            "Kotlin", "Flutter", "Machine Learning", "Data Science"
        ]
        user_skills = [s for s in common if s.lower() in text.lower()]

    jobs = db.query(Job).all()

    result = []
    for j in jobs:
        details = compute_match_details(j, user_skills, ats_score)
        result.append({"job": serialize_job(j), "match": details["total"], "breakdown": details})

    # Filter for jobs with at least 60% match score
    result = [r for r in result if r["match"] >= 60]

    # sort by match desc
    result_sorted = sorted(result, key=lambda x: (x["match"], x["breakdown"]["freshness"], x["breakdown"]["fresher_suitability"]), reverse=True)

    # Log activity
    activity = UserActivity(
        user_id=current_user.id,
        activity_type="job_search",
        details=f"Matched resume {resume.filename} against {len(jobs)} jobs"
    )
    db.add(activity)
    db.commit()

    return [JobMatch(**r) for r in result_sorted]

@router.get("/fetch-latest", response_model=List[JobOut])
def fetch_latest_jobs(query: str = Query("fresher software developer", min_length=2, max_length=100),
                      location: str = Query("India", min_length=2, max_length=80),
                      _current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Fetch jobs from API, sync to DB, and return ONLY those jobs.
    """
    api_jobs = fetch_latest_jobs_from_api(query, location)
    if api_jobs:
        return sync_api_jobs_to_db(db, api_jobs)
    
    return []
    
@router.get("/api-history", response_model=List[JobOut])
def get_historical_api_jobs(db: Session = Depends(get_db)):
    """
    Get all jobs that were ever fetched from the API.
    """
    jobs = (db.query(Job).filter_by(is_api=True)
            .order_by(Job.posted_at.desc().nullslast(), Job.fetched_at.desc().nullslast())
            .limit(500).all())
    return [serialize_job(job) for job in jobs]

