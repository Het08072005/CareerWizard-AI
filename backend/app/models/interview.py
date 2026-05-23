from sqlalchemy import Column, String, SmallInteger, Boolean, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.sql import func
from app.db.database import Base
import uuid

class InterviewQuestion(Base):
    __tablename__ = "interview_questions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=func.gen_random_uuid())
    domain = Column(String(50), nullable=False)
    sub_domain = Column(String(100), nullable=True)
    difficulty = Column(String(20), nullable=False)
    category = Column(String(30), nullable=False)
    question_text = Column(Text, nullable=False)
    model_answer = Column(Text, nullable=True)
    star_example = Column(Text, nullable=True)
    tags = Column(ARRAY(Text), nullable=True)
    companies = Column(ARRAY(Text), nullable=True)
    is_active = Column(Boolean, default=True, server_default="true", nullable=False)
    created_at = Column(DateTime(timezone=True), default=func.now(), server_default=func.now(), nullable=False)


class InterviewProgress(Base):
    __tablename__ = "interview_progress"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=func.gen_random_uuid())
    student_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    question_id = Column(UUID(as_uuid=True), ForeignKey("interview_questions.id", ondelete="CASCADE"), nullable=False)
    status = Column(String(20), default="unseen", server_default="unseen", nullable=False)
    student_notes = Column(Text, nullable=True)
    ai_answer_generated = Column(Boolean, default=False, server_default="false", nullable=False)
    practiced_count = Column(SmallInteger, default=0, server_default="0", nullable=False)
    last_practiced = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=func.now(), server_default=func.now(), nullable=False)
