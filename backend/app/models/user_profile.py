# app/models/user_profile.py
from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.database import Base
import json

class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)

    location = Column(String, nullable=True)
    linkedin_url = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    experience = Column(Text, nullable=True)
    skills = Column(Text, nullable=True)

    target_roles = Column(Text, nullable=True)
    resume_file_path = Column(String, nullable=True)

    user = relationship("User", back_populates="profile")

    def set_roles(self, roles):
        self.target_roles = json.dumps(roles)

    def get_roles(self):
        return json.loads(self.target_roles or "[]")
