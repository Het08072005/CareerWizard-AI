from sqlalchemy.dialects.postgresql import UUID

from sqlalchemy import Column, Integer, String, ForeignKey, JSON, DateTime
from app.db.database import Base
from datetime import datetime

class SkillProgress(Base):
    __tablename__ = "skill_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), index=True)
    role_key = Column(String, index=True) # e.g. frontend, backend, ai_ml
    progress_data = Column(JSON) # Stores the progress object (milestones/topics)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Roadmap(Base):
    __tablename__ = "roadmaps"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), index=True)
    domain = Column(String(100))
    content = Column(JSON)
    progress = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
