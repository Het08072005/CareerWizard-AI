from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.resume_schema import ResumeAnalysisResponse
from app.db.database import SessionLocal
from app.services.ai_service import analyze_resume_with_ai
from app.models.resume import ResumeAnalysis

router = APIRouter(prefix="/resume", tags=["resume"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/analyze", response_model=ResumeAnalysisResponse)
async def analyze_resume(
    file: UploadFile = File(None),
    text: str = Form(None),
    db: Session = Depends(get_db)
):
    if not file and not text:
        raise HTTPException(status_code=400, detail="No resume data provided")

    file_content = await file.read() if file else None
    result = await analyze_resume_with_ai(file_content=file_content, filename=file.filename if file else None, text=text)

    # Save in DB (optional)
    db_resume = ResumeAnalysis(
        filename=file.filename if file else None,
        text_content=text,
        ats_score=result["ats_score"],
        strengths=result["strengths"],
        improvements=result["improvements"]
    )
    db.add(db_resume)
    db.commit()
    db.refresh(db_resume)

    return result
