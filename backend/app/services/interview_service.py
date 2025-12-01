from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from app.models.interview import InterviewQuestion
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
    """
    Create a new interview question in the database.
    Automatically generates an AI explanation if not provided.
    """

    explanation_text = question_in.answer.explanation

    # Auto-generate explanation if not provided
    if not explanation_text:
        explanation_text = generate_ai_explanation(
            role=question_in.role,
            question_title=question_in.title,
            model_answer=question_in.answer.code or ""
        )

    db_question = InterviewQuestion(
        role=question_in.role,
        skills=question_in.skills,
        category=question_in.category,
        title=question_in.title,
        difficulty=question_in.difficulty,
        tags=question_in.tags,
        answer_explanation=explanation_text,
        answer_code=question_in.answer.code
    )
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question


def list_questions(
    db: Session,
    role: Optional[str] = None,
    category: Optional[str] = None
):
    """
    List interview questions filtered by role/category.
    Includes 'global' questions automatically.
    """
    q = db.query(InterviewQuestion)

    if role:
        q = q.filter(
            or_(
                InterviewQuestion.role == role,
                InterviewQuestion.role == "global"
            )
        )

    if category:
        q = q.filter(InterviewQuestion.category == category)

    return q.all()


def generate_ai_explanation(role: str, question_title: str, model_answer: str) -> str:
    """
    Generates an interview-ready explanation using Gemini AI.

    FINAL OUTPUT STRUCTURE:
    1) Short Summary
    2) Step-by-Step Breakdown
    3) Code Example (if needed)
    4) STAR Interview Answer → Direct 4–5 line natural response (no labels)
    """

    prompt = f"""
You are an expert interviewer and teacher.
Explain the model answer in extremely clear and simple English.
Make the explanation interview-friendly and easy to speak.

Follow this exact output format:

1) Short Summary (2–3 sentences)
2) Step-by-Step Breakdown (4–6 numbered steps)
3) Code Example (only if relevant)
4) STAR Interview Answer:
   Provide a natural 4–5 line answer that follows the STAR method,
   BUT do NOT mention "Situation, Task, Action, Result" directly.
   It should sound like a real interview response, short and confident.
   Avoid story mode. Keep it tight, practical, professional.

Rules:
- Do NOT use markdown, bullets, hyphens, *, #, or special symbols.
- Use only plain text.
- Make answers short, clean, clear, and ready to speak.

Role: {role}
Question: {question_title}
Model Answer: {model_answer}
"""

    try:
        model_name = "gemini-2.5-flash"

        if hasattr(genai, 'GenerativeModel'):
            model = genai.GenerativeModel(model_name)
            response = model.generate_content(prompt)
            text = getattr(response, 'text', None)

            if not text and hasattr(response, 'output'):
                try:
                    text = response.output[0]['content'][0]['text']
                except:
                    text = None

        elif hasattr(genai, 'generate_content'):
            resp = genai.generate_content(prompt)
            text = getattr(resp, 'text', None)

        else:
            text = None

        if text:
            return text.strip()

    except Exception as e:
        print(f"Gemini explain error: {e}")

    # ---------- FALLBACK ----------
    fallback = []

    fallback.append("Short Summary:\n" + model_answer[:200] + ("..." if len(model_answer) > 200 else ""))

    fallback.append("\nStep-by-Step Breakdown:")
    sentences = [s.strip() for s in model_answer.replace('\n', ' ').split('. ') if s.strip()]
    for i, s in enumerate(sentences[:6], 1):
        fallback.append(f"{i}. {s.rstrip('.')}")

    if any(w in model_answer.lower() for w in ["code", "function", "class", "example"]):
        fallback.append("\nCode Example:\nRefer to the code above.")

    fallback.append(
        "\nSTAR Interview Answer:\n"
        "In a recent task, I analyzed the problem and identified the root cause by examining key patterns. "
        "I applied the right steps to correct the issue and ensured the solution was aligned with performance goals. "
        "This approach helped improve the system's accuracy and delivered a reliable outcome."
    )

    return "\n".join(fallback)
