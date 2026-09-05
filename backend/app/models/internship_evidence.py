import uuid

from sqlalchemy import Boolean, Column, Date, DateTime, ForeignKey, Integer, Numeric, String, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.sql import func

from app.db.database import Base


class InternshipContentVersion(Base):
    __tablename__ = "internship_content_versions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=func.gen_random_uuid())
    day_content_id = Column(UUID(as_uuid=True), ForeignKey("day_content.id", ondelete="CASCADE"), nullable=False)
    revision = Column(Integer, nullable=False)
    content_hash = Column(String(64), nullable=False)
    snapshot = Column(JSONB, nullable=False)
    change_note = Column(Text, nullable=True)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime(timezone=True), default=func.now(), server_default=func.now(), nullable=False)

    __table_args__ = (UniqueConstraint("day_content_id", "revision", name="uq_content_version_revision"),)


class SkillEvidence(Base):
    __tablename__ = "skill_evidence"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=func.gen_random_uuid())
    student_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    enrollment_id = Column(UUID(as_uuid=True), ForeignKey("enrollments.id", ondelete="CASCADE"), nullable=False)
    submission_id = Column(UUID(as_uuid=True), ForeignKey("task_submissions.id", ondelete="CASCADE"), nullable=False)
    skill_name = Column(String(100), nullable=False)
    proficiency_score = Column(Numeric(5, 2), nullable=False)
    evidence_type = Column(String(30), default="project", server_default="project", nullable=False)
    evidence_url = Column(Text, nullable=True)
    verified = Column(Boolean, default=False, server_default="false", nullable=False)
    verification_method = Column(String(40), nullable=True)
    metadata_json = Column(JSONB, nullable=True)
    demonstrated_at = Column(DateTime(timezone=True), default=func.now(), server_default=func.now(), nullable=False)

    __table_args__ = (UniqueConstraint("submission_id", "skill_name", name="uq_submission_skill_evidence"),)


class DailyStandup(Base):
    __tablename__ = "daily_standups"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=func.gen_random_uuid())
    enrollment_id = Column(UUID(as_uuid=True), ForeignKey("enrollments.id", ondelete="CASCADE"), nullable=False)
    student_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    standup_date = Column(Date, nullable=False)
    yesterday = Column(Text, nullable=False)
    today = Column(Text, nullable=False)
    blockers = Column(Text, nullable=True)
    communication_score = Column(Numeric(5, 2), nullable=True)
    created_at = Column(DateTime(timezone=True), default=func.now(), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=func.now(), server_default=func.now(), onupdate=func.now(), nullable=False)

    __table_args__ = (UniqueConstraint("enrollment_id", "standup_date", name="uq_enrollment_standup_date"),)
