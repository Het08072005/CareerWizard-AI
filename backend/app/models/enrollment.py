from sqlalchemy import Column, String, SmallInteger, Numeric, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.db.database import Base
import uuid

class Enrollment(Base):
    __tablename__ = "enrollments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=func.gen_random_uuid())
    student_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    plan_id = Column(UUID(as_uuid=True), ForeignKey("internship_plans.id", ondelete="CASCADE"), nullable=False)
    track_id = Column(UUID(as_uuid=True), ForeignKey("internship_tracks.id", ondelete="CASCADE"), nullable=False)
    difficulty_level = Column(String(20), nullable=False)
    status = Column(String(20), default="active", server_default="active", nullable=False)
    payment_id = Column(UUID(as_uuid=True), ForeignKey("payments.id", ondelete="CASCADE"), nullable=False)
    current_day = Column(SmallInteger, default=1, server_default="1", nullable=False)
    current_phase = Column(SmallInteger, default=1, server_default="1", nullable=False)
    total_days = Column(SmallInteger, nullable=False)
    avg_score = Column(Numeric(5, 2), default=0.0, server_default="0.0", nullable=False)
    streak_days = Column(SmallInteger, default=0, server_default="0", nullable=False)
    started_at = Column(DateTime(timezone=True), default=func.now(), server_default=func.now(), nullable=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    deadline_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), default=func.now(), server_default=func.now(), nullable=False)
