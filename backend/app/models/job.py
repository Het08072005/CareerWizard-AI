from sqlalchemy import Column, Integer, String, Text, Table, ForeignKey, Boolean, DateTime, Numeric
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

# Association table between jobs and skills
job_skill_table = Table(
    "job_skill",
    Base.metadata,
    Column("job_id", Integer, ForeignKey("jobs.id", ondelete="CASCADE"), primary_key=True),
    Column("skill_id", Integer, ForeignKey("skills.id", ondelete="CASCADE"), primary_key=True),
)

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    company = Column(String(200), nullable=False)
    location = Column(String(200))
    salary = Column(String(100))
    type = Column(String(50))  # Full-time, Part-time, Contract, Remote
    description = Column(Text)
    posted = Column(String(50))  # e.g. "3 days ago"
    apply_link = Column(String(500))
    is_api = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    external_id = Column(String(255), nullable=True)
    source = Column(String(80), nullable=True)
    posted_at = Column(DateTime(timezone=True), nullable=True)
    fetched_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    expires_at = Column(DateTime(timezone=True), nullable=True)
    experience_level = Column(String(30), nullable=True)
    is_remote = Column(Boolean, default=False)
    freshness_score = Column(Numeric(5, 2), default=0)
    relevance_score = Column(Numeric(5, 2), default=0)
    fingerprint = Column(String(64), nullable=True, unique=True)
    raw_payload = Column(JSONB, nullable=True)


    required_skills = relationship("Skill", secondary=job_skill_table, back_populates="jobs")


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)

    jobs = relationship("Job", secondary=job_skill_table, back_populates="required_skills")
