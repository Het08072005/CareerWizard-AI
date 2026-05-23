from sqlalchemy import Column, String, SmallInteger, Boolean, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.sql import func
from app.db.database import Base
import uuid

class TaskSubmission(Base):
    __tablename__ = "task_submissions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=func.gen_random_uuid())
    enrollment_id = Column(UUID(as_uuid=True), ForeignKey("enrollments.id", ondelete="CASCADE"), nullable=False)
    student_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    task_id = Column(UUID(as_uuid=True), ForeignKey("internship_tasks.id", ondelete="CASCADE"), nullable=False)
    day_number = Column(SmallInteger, nullable=False)
    github_url = Column(Text, nullable=False)
    difficulty_chosen = Column(String(20), nullable=False)
    submission_attempt = Column(SmallInteger, default=1, server_default="1", nullable=False)
    status = Column(String(20), default="pending", server_default="pending", nullable=False)
    ai_score_correctness = Column(SmallInteger, nullable=True)
    ai_score_approach = Column(SmallInteger, nullable=True)
    ai_score_quality = Column(SmallInteger, nullable=True)
    ai_score_docs = Column(SmallInteger, nullable=True)
    total_score = Column(SmallInteger, nullable=True)
    passed = Column(Boolean, nullable=True)
    ai_feedback = Column(Text, nullable=True)
    improvements = Column(ARRAY(Text), nullable=True)
    highlight = Column(Text, nullable=True)
    code_hash = Column(String(64), nullable=True)
    plagiarism_flag = Column(Boolean, default=False, server_default="false", nullable=False)
    reviewed_at = Column(DateTime(timezone=True), nullable=True)
    submitted_at = Column(DateTime(timezone=True), default=func.now(), server_default=func.now(), nullable=False)
