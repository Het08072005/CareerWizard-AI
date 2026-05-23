from sqlalchemy import Column, String, Integer, SmallInteger, Boolean, Text, DateTime
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.sql import func
from app.db.database import Base
import uuid

class InternshipPlan(Base):
    __tablename__ = "internship_plans"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=func.gen_random_uuid())
    plan_key = Column(String(30), unique=True, nullable=False)
    name = Column(String(100), nullable=False)
    price = Column(Integer, nullable=False)
    duration_days = Column(SmallInteger, nullable=False)
    total_tasks = Column(SmallInteger, nullable=False)
    is_course_only = Column(Boolean, default=False, server_default="false", nullable=False)
    features = Column(ARRAY(Text), nullable=True)
    is_active = Column(Boolean, default=True, server_default="true", nullable=False)
    created_at = Column(DateTime(timezone=True), default=func.now(), server_default=func.now(), nullable=False)
