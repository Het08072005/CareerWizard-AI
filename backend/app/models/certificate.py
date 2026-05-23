from sqlalchemy import Column, String, SmallInteger, Boolean, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.db.database import Base
import uuid

class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=func.gen_random_uuid())
    enrollment_id = Column(UUID(as_uuid=True), ForeignKey("enrollments.id", ondelete="CASCADE"), nullable=False)
    student_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    certificate_uid = Column(String(30), unique=True, nullable=False)
    type = Column(String(30), nullable=False)
    track_name = Column(String(100), nullable=False)
    plan_name = Column(String(100), nullable=False)
    final_score = Column(SmallInteger, nullable=False)
    pdf_url = Column(Text, nullable=True)
    qr_code_url = Column(Text, nullable=True)
    blockchain_hash = Column(Text, nullable=True)
    blockchain_tx = Column(Text, nullable=True)
    is_verified = Column(Boolean, default=False, server_default="false", nullable=False)
    issued_at = Column(DateTime(timezone=True), default=func.now(), server_default=func.now(), nullable=False)
    revoked = Column(Boolean, default=False, server_default="false", nullable=False)
    revoked_reason = Column(Text, nullable=True)
