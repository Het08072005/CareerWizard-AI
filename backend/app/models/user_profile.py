from sqlalchemy import Column, String, SmallInteger, Numeric, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.sql import func
from app.db.database import Base
from sqlalchemy.orm import relationship
import uuid

class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=func.gen_random_uuid())
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    college_name = Column(String(200), nullable=True)
    branch = Column(String(100), nullable=True)
    year_of_study = Column(SmallInteger, nullable=True)
    graduation_year = Column(SmallInteger, nullable=True)
    city = Column(String(100), nullable=True)
    target_role = Column(Text, nullable=True)
    experience_years = Column(Numeric(3, 1), default=0.0, server_default="0.0", nullable=False)
    skills = Column(ARRAY(Text), nullable=True)
    resume_url = Column(Text, nullable=True)
    ats_score = Column(SmallInteger, nullable=True)
    profile_completeness = Column(SmallInteger, default=0, server_default="0", nullable=False)
    bio = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=func.now(), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=func.now(), server_default=func.now(), onupdate=func.now(), nullable=False)

    user = relationship("User", back_populates="profile")
