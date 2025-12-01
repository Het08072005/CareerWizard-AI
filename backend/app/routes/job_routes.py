# # app/routes/job_routes.py
# from fastapi import APIRouter, Depends, HTTPException, Query
# from sqlalchemy.orm import Session
# from typing import List, Optional
# from app.db.database import get_db
# from app.services.job_service import create_job, list_jobs, compute_match_score
# from app.schemas.job_schema import JobCreate, JobOut, JobMatch
# from app.models.resume import ResumeAnalysis
# from app.models.job import Job

# router = APIRouter(prefix="/jobs", tags=["jobs"])

# @router.post("", response_model=JobOut)
# def create_job_endpoint(payload: JobCreate, db: Session = Depends(get_db)):
#     job = create_job(db, payload)
#     return JobOut(
#         id=job.id,
#         title=job.title,
#         company=job.company,
#         location=job.location,
#         salary=job.salary,
#         type=job.type,
#         description=job.description,
#         posted=job.posted,
#         required_skills=[s.name for s in job.required_skills]
#     )

# @router.get("", response_model=List[JobOut])
# def get_jobs(search: Optional[str] = None, jobType: Optional[str] = Query("All"), skills: Optional[str] = Query(None), db: Session = Depends(get_db)):
#     """
#     skills: comma separated names e.g. "React,Python"
#     jobType: 'All' | 'Full time' | 'Remote' etc.
#     """
#     skill_list = [s.strip() for s in skills.split(",")] if skills else []
#     jobs = list_jobs(db, search=search, job_type=jobType, skills=skill_list)
#     # convert to JobOut
#     out = []
#     for j in jobs:
#         out.append(JobOut(
#             id=j.id,
#             title=j.title,
#             company=j.company,
#             location=j.location,
#             salary=j.salary,
#             type=j.type,
#             description=j.description,
#             posted=j.posted,
#             required_skills=[s.name for s in j.required_skills]
#         ))
#     return out

# @router.post("/match", response_model=List[JobMatch])
# def match_jobs(resume_id: Optional[int] = None, text_skills: Optional[str] = None, db: Session = Depends(get_db)):
#     """
#     Provide either resume_id (existing ResumeAnalysis record) or text_skills (comma-separated skills),
#     returns jobs with computed match score.
#     """
#     user_skills = []
#     ats_score = None

#     if resume_id:
#         resume = db.query(ResumeAnalysis).filter(ResumeAnalysis.id == resume_id).first()
#         if not resume:
#             raise HTTPException(status_code=404, detail="Resume not found")
#         ats_score = resume.ats_score
#         if resume.parsed_skills:
#             user_skills = resume.parsed_skills
#     elif text_skills:
#         user_skills = [s.strip() for s in text_skills.split(",") if s.strip()]
#     else:
#         raise HTTPException(status_code=400, detail="Provide resume_id or text_skills")

#     jobs = db.query(Job).all()

#     result = []
#     for j in jobs:
#         score = compute_match_score(j, user_skills, ats_score)
#         job_out = JobOut(
#             id=j.id,
#             title=j.title,
#             company=j.company,
#             location=j.location,
#             salary=j.salary,
#             type=j.type,
#             description=j.description,
#             posted=j.posted,
#             required_skills=[s.name for s in j.required_skills]
#         )
#         result.append({"job": job_out, "match": score})

#     # sort desc by match
#     result_sorted = sorted(result, key=lambda r: r["match"], reverse=True)
#     return [JobMatch(**r) for r in result_sorted]
















# # app/routes/job_routes.py
# from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
# from sqlalchemy.orm import Session
# from typing import List
# from app.db.database import get_db
# from app.models.job import Job
# from app.services.job_service import compute_match_score
# from app.utils.file_utils import extract_text_from_pdf, extract_text_from_docx
# from app.schemas.job_schema import JobOut, JobMatch
# from app.services.ai_service import analyze_resume_with_ai  # Make sure path matches

# router = APIRouter(prefix="/jobs", tags=["jobs"])

# @router.post("/match-resume", response_model=List[JobMatch])
# async def match_jobs_with_resume(
#     resume: UploadFile = File(...),
#     db: Session = Depends(get_db)
# ):
#     # ---------- 1. extract text ----------
#     content = await resume.read()

#     if resume.filename.endswith(".pdf"):
#         text = extract_text_from_pdf(content)
#     elif resume.filename.endswith(".docx"):
#         text = extract_text_from_docx(content)
#     else:
#         text = content.decode('utf-8', errors='ignore')

#     if not text or len(text.strip()) < 20:
#         raise HTTPException(400, "Could not read valid text from resume")

#     # ---------- 2. Analyze resume with AI ----------
#     analysis = await analyze_resume_with_ai(text=text)

#     ats_score = analysis.get("ats_score", 0)
#     strengths = analysis.get("strengths", [])
#     improvements = analysis.get("improvements", [])

#     # Extract skills → AI gives list of strings
#     user_skills = []
#     if "skills" in analysis:
#         user_skills = analysis["skills"]
#     else:
#         # Fallback skill extraction (simple keyword detection)
#         common_skills = ["Python", "Java", "React", "Node", "SQL", "AWS", "Docker"]
#         user_skills = [s for s in common_skills if s.lower() in text.lower()]

#     # ---------- 3. Fetch all jobs ----------
#     jobs = db.query(Job).all()

#     # ---------- 4. Compute matching ----------
#     result = []
#     for job in jobs:
#         match_score = compute_match_score(job, user_skills, ats_score)
        
#         job_out = JobOut(
#             id=job.id,
#             title=job.title,
#             company=job.company,
#             location=job.location,
#             salary=job.salary,
#             type=job.type,
#             description=job.description,
#             posted=job.posted,
#             required_skills=[s.name for s in job.required_skills]
#         )

#         result.append({
#             "job": job_out,
#             "match": match_score
#         })

#     # Sort by match desc
#     result_sorted = sorted(result, key=lambda x: x["match"], reverse=True)

#     # Return proper JobMatch schema objects
#     return [JobMatch(**r) for r in result_sorted]









# app/routes/job_routes.py
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


# -----------------------------------------------------
# 1️⃣ GET ALL JOBS (DEFAULT WHEN NO RESUME UPLOADED)
# -----------------------------------------------------
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


# -----------------------------------------------------
# 2️⃣ MATCH RESUME AGAINST JOBS
# -----------------------------------------------------
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
