
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.job import Job
from app.services.job_service import compute_match_score, fetch_latest_jobs_from_api, sync_api_jobs_to_db, get_api_job_history

from app.utils.file_utils import extract_text_from_pdf, extract_text_from_docx
from app.services.ai_service import analyze_resume_with_ai
from app.core.auth import get_current_user
from app.models.activity import UserActivity
from app.schemas.job_schema import JobOut, JobMatch

router = APIRouter(prefix="/jobs", tags=["jobs"])



# GET ALL JOBS (DEFAULT WHEN NO RESUME UPLOADED)

@router.get("/all", response_model=List[JobOut])
def get_all_jobs(db: Session = Depends(get_db)):
    jobs = db.query(Job).all()

    return [
        JobOut(
            id=j.id,
            title=j.title,
            company=j.company,
            location=j.location,
            salary=j.salary,
            type=j.type,
            description=j.description,
            posted=j.posted,
            apply_link=getattr(j, "apply_link", "#") or "#",
            is_api=getattr(j, "is_api", False),
            created_at=str(j.created_at) if getattr(j, "created_at", None) else None,
            required_skills=[s.name for s in j.required_skills]
        )
        for j in jobs
    ]


#  MATCH RESUME AGAINST JOBS

@router.post("/match-resume", response_model=List[JobMatch])
async def match_jobs_with_resume(
    resume: UploadFile = File(...),
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    content = await resume.read()

    if resume.filename.endswith(".pdf"):
        text = extract_text_from_pdf(content)
    elif resume.filename.endswith(".docx"):
        text = extract_text_from_docx(content)
    else:
        text = content.decode("utf-8", errors="ignore")

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
        match_score = compute_match_score(j, user_skills, ats_score)

        job_out = JobOut(
            id=j.id,
            title=j.title,
            company=j.company,
            location=j.location,
            salary=j.salary,
            type=j.type,
            description=j.description,
            posted=j.posted,
            apply_link=getattr(j, "apply_link", "#") or "#",
            is_api=getattr(j, "is_api", False),
            created_at=str(j.created_at) if getattr(j, "created_at", None) else None,
            required_skills=[s.name for s in j.required_skills]
        )

        result.append({"job": job_out, "match": match_score})

    # Filter for jobs with at least 60% match score
    result = [r for r in result if r["match"] >= 60]

    # sort by match desc
    result_sorted = sorted(result, key=lambda x: x["match"], reverse=True)

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
def fetch_latest_jobs(query: str = "Developer", location: str = "India", db: Session = Depends(get_db)):
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
    jobs = get_api_job_history(db)
    return [
        JobOut(
            id=j.get('id', 0),
            title=j.get('title'),
            company=j.get('company'),
            location=j.get('location'),
            salary=j.get('salary'),
            type=j.get('type'),
            description=j.get('description'),
            posted=j.get('posted'),
            apply_link=j.get('apply_link', '#'),
            is_api=True,
            created_at=j.get('created_at'),
            required_skills=j.get('required_skills', [])
        )
        for j in jobs
    ]



