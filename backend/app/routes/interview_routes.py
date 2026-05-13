from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional, List

from app.db.database import get_db
from app.services.interview_service import create_interview_question, list_questions
from app.schemas.interview_schema import InterviewCreate, InterviewResponse
from fastapi import Body
from app.services.interview_service import generate_ai_explanation
from app.core.auth import get_current_user_optional
from app.models.activity import UserActivity

router = APIRouter(prefix="/interview", tags=["interview"])

@router.post("/add", response_model=InterviewResponse)
def add_question(
    question_in: InterviewCreate,
    db: Session = Depends(get_db)
):
    return create_interview_question(db, question_in)

@router.get("/questions", response_model=List[InterviewResponse])
def get_questions(
    role: Optional[str] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_optional)
):
    if current_user:
        # Log activity
        activity = UserActivity(
            user_id=current_user.id,
            activity_type="interview_prep",
            details=f"Fetched {category or 'all'} questions for role {role or 'any'}"
        )
        db.add(activity)
        db.commit()
    
    return list_questions(db, role, category)


@router.post("/ai-explain")
def ai_explain(payload: dict = Body(...)):
    """POST /interview/ai-explain

    Expected JSON body: { role: str, question_title: str, model_answer: str }
    Returns: { explanation: str }
    """
    role = payload.get('role', 'Candidate')
    question_title = payload.get('question_title', '')
    model_answer = payload.get('model_answer', '')

    explanation = generate_ai_explanation(role, question_title, model_answer)
    return { 'explanation': explanation }




















