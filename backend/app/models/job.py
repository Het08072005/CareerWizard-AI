# app/models/job.py
from sqlalchemy import Column, Integer, String, Text, Table, ForeignKey
from sqlalchemy.orm import relationship
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

    required_skills = relationship("Skill", secondary=job_skill_table, back_populates="jobs")


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)

    jobs = relationship("Job", secondary=job_skill_table, back_populates="required_skills")
