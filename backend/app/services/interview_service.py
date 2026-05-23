from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from app.models.interview import InterviewQuestion, InterviewProgress
from app.schemas.interview_schema import InterviewCreate
import os
import google.generativeai as genai
from app.core.config import settings

# Ensure Gemini API is configured
try:
    genai.configure(api_key=settings.GEMINI_API_KEY)
except Exception:
    pass

def create_interview_question(db: Session, question_in: InterviewCreate):
    db_question = InterviewQuestion(
        domain=question_in.domain,
        sub_domain=question_in.sub_domain,
        difficulty=question_in.difficulty,
        category=question_in.category,
        question_text=question_in.question_text,
        model_answer=question_in.model_answer,
        star_example=question_in.star_example,
        tags=question_in.tags,
        companies=question_in.companies
    )
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question

def list_questions(
    db: Session,
    domain: Optional[str] = None,
    category: Optional[str] = None
):
    q = db.query(InterviewQuestion).filter(InterviewQuestion.is_active == True)

    if domain:
        q = q.filter(
            or_(
                InterviewQuestion.domain.ilike(f"%{domain}%"),
                InterviewQuestion.domain == "global"
            )
        )

    if category:
        q = q.filter(InterviewQuestion.category.ilike(f"%{category}%"))

    return q.all()

def get_or_create_progress(db: Session, student_id: str, question_id: str):
    progress = db.query(InterviewProgress).filter(
        InterviewProgress.student_id == student_id,
        InterviewProgress.question_id == question_id
    ).first()
    
    if not progress:
        progress = InterviewProgress(
            student_id=student_id,
            question_id=question_id,
            status="unseen"
        )
        db.add(progress)
        db.commit()
        db.refresh(progress)
    return progress

def generate_ai_explanation(role: str, question_title: str, model_answer: str) -> str:
    prompt = f"""
You are an expert interviewer and teacher.
Explain the model answer in extremely clear and simple English.
Make the explanation interview-friendly and easy to speak.

Follow this exact output format:

1) Short Summary (2–3 sentences)
2) Step-by-Step Breakdown (4–6 numbered steps)
3) Code Example (only if relevant)
4) STAR Interview Answer:
   Provide a natural 4–5 line answer that follows the STAR method.

Role: {role}
Question: {question_title}
Model Answer: {model_answer}
"""
    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content(prompt)
        if hasattr(response, 'text') and response.text:
            return response.text.strip()
    except Exception as e:
        print(f"Gemini explain error: {e}")

    return "Summary: " + (model_answer or "No answer provided")
