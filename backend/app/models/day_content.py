from sqlalchemy import Column, Integer, String, DateTime, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB, UUID
import uuid
import datetime
from app.db.database import Base

class DayContent(Base):
    __tablename__ = "day_content"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    domain = Column(String, nullable=False)
    task_name = Column(String, nullable=False)
    type = Column(String, nullable=False)
    day = Column(Integer, nullable=False)
    
    beginner = Column(JSONB, default=list)
    intermediate = Column(JSONB, default=list)
    advanced = Column(JSONB, default=list)
    source = Column(JSONB, default=list)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    __table_args__ = (
        UniqueConstraint('domain', 'task_name', 'type', 'day', name='uix_day_content_domain_task_type_day'),
    )
