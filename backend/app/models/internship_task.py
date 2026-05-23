from sqlalchemy import Column, String, SmallInteger, Boolean, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, ARRAY, JSONB
from sqlalchemy.sql import func
from app.db.database import Base
import uuid

class InternshipTask(Base):
    __tablename__ = "internship_tasks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=func.gen_random_uuid())
    track_id = Column(UUID(as_uuid=True), ForeignKey("internship_tracks.id", ondelete="CASCADE"), nullable=False)
    plan_duration = Column(SmallInteger, nullable=False)
    task_number = Column(SmallInteger, nullable=False)
    phase = Column(SmallInteger, nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    beginner_reqs = Column(ARRAY(Text), nullable=True)
    inter_reqs = Column(ARRAY(Text), nullable=True)
    advanced_reqs = Column(ARRAY(Text), nullable=True)
    tech_tags = Column(ARRAY(Text), nullable=True)
    resources = Column(JSONB, nullable=True)
    expected_output = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, server_default="true", nullable=False)
    created_at = Column(DateTime(timezone=True), default=func.now(), server_default=func.now(), nullable=False)
