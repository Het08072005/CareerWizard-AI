from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.db.database import Base
import uuid

class Payment(Base):
    __tablename__ = "payments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=func.gen_random_uuid())
    student_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    plan_id = Column(UUID(as_uuid=True), ForeignKey("internship_plans.id", ondelete="CASCADE"), nullable=False)
    razorpay_order_id = Column(String(100), unique=True, nullable=False)
    razorpay_payment_id = Column(String(100), unique=True, nullable=True)
    razorpay_signature = Column(Text, nullable=True)
    amount = Column(Integer, nullable=False)
    currency = Column(String(5), default="INR", server_default="INR", nullable=False)
    status = Column(String(20), default="created", server_default="created", nullable=False)
    payment_method = Column(String(30), nullable=True)
    gateway_fee = Column(Integer, nullable=True)
    refund_id = Column(String(100), nullable=True)
    refund_amount = Column(Integer, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=func.now(), server_default=func.now(), nullable=False)
    paid_at = Column(DateTime(timezone=True), nullable=True)
