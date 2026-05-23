from typing import List, Optional
from pydantic import BaseModel, UUID4
from datetime import datetime

class InterviewCreate(BaseModel):
    domain: str
    sub_domain: Optional[str] = None
    difficulty: str
    category: str
    question_text: str
    model_answer: Optional[str] = None
    star_example: Optional[str] = None
    tags: Optional[List[str]] = None
    companies: Optional[List[str]] = None

class InterviewResponse(BaseModel):
    id: UUID4
    domain: str
    sub_domain: Optional[str] = None
    difficulty: str
    category: str
    question_text: str
    model_answer: Optional[str] = None
    star_example: Optional[str] = None
    tags: Optional[List[str]] = None
    companies: Optional[List[str]] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Also schema for Interview Progress (User-wise)
class InterviewProgressUpdate(BaseModel):
    status: str
    student_notes: Optional[str] = None

class InterviewProgressResponse(BaseModel):
    id: UUID4
    student_id: UUID4
    question_id: UUID4
    status: str
    student_notes: Optional[str] = None
    ai_answer_generated: bool
    practiced_count: int
    last_practiced: Optional[datetime] = None

    class Config:
        from_attributes = True
