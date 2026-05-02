from sqlalchemy import Column, Integer, String
from app.db.database import Base
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    role = Column(String, nullable=True)

    profile = relationship("UserProfile", back_populates="user", uselist=False)
    activities = relationship("UserActivity", back_populates="user", cascade="all, delete-orphan")
