
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.job import Job
from app.services.job_service import compute_match_score
from app.utils.file_utils import extract_text_from_pdf, extract_text_from_docx
from app.schemas.job_schema import JobOut, JobMatch
from app.services.ai_service import analyze_resume_with_ai

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
            required_skills=[s.name for s in j.required_skills]
        )
        for j in jobs
    ]


#  MATCH RESUME AGAINST JOBS

@router.post("/match-resume", response_model=List[JobMatch])
async def match_jobs_with_resume(
    resume: UploadFile = File(...),
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
        common = ["Python", "Java", "React", "Node", "SQL", "AWS", "Docker"]
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
            required_skills=[s.name for s in j.required_skills]
        )

        result.append({"job": job_out, "match": match_score})

    # sort by match desc
    result_sorted = sorted(result, key=lambda x: x["match"], reverse=True)

    return [JobMatch(**r) for r in result_sorted]
