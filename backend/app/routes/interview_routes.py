from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from typing import Optional, List

from app.db.database import get_db
from app.services.interview_service import create_interview_question, list_questions, get_or_create_progress, generate_ai_explanation
from app.schemas.interview_schema import InterviewCreate, InterviewResponse, InterviewProgressResponse, InterviewProgressUpdate
from app.core.auth import get_current_user_optional, get_current_user
from app.models.activity import UserActivity
from app.models.interview import InterviewProgress
from datetime import datetime

router = APIRouter(prefix="/interview", tags=["interview"])

@router.post("/add", response_model=InterviewResponse)
def add_question(
    question_in: InterviewCreate,
    db: Session = Depends(get_db)
):
    return create_interview_question(db, question_in)

@router.get("/questions", response_model=List[InterviewResponse])
def get_questions(
    role: Optional[str] = None, # frontend uses 'role'
    category: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_optional)
):
    if current_user:
        activity = UserActivity(
            user_id=current_user.id,
            activity_type="interview_prep",
            details=f"Fetched {category or 'all'} questions for role {role or 'any'}"
        )
        db.add(activity)
        db.commit()
    
    # Map frontend 'role' parameter to our backend 'domain' parameter
    return list_questions(db, domain=role, category=category)

@router.get("/progress/{question_id}", response_model=InterviewProgressResponse)
def get_question_progress(
    question_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return get_or_create_progress(db, str(current_user.id), question_id)

@router.post("/progress/{question_id}")
def update_question_progress(
    question_id: str,
    progress_in: InterviewProgressUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    progress = get_or_create_progress(db, str(current_user.id), question_id)
    progress.status = progress_in.status
    if progress_in.student_notes is not None:
        progress.student_notes = progress_in.student_notes
    progress.last_practiced = datetime.utcnow()
    progress.practiced_count += 1
    
    db.commit()
    return {"status": "success"}

@router.post("/ai-explain")
def ai_explain(payload: dict = Body(...)):
    role = payload.get('role', 'Candidate')
    question_title = payload.get('question_title', '')
    model_answer = payload.get('model_answer', '')

    explanation = generate_ai_explanation(role, question_title, model_answer)
    return { 'explanation': explanation }
