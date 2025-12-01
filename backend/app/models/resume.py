
from sqlalchemy import Column, Integer, String, Text, JSON
from app.db.database import Base

class ResumeAnalysis(Base):
    __tablename__ = "resume_analysis"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=True)
    text_content = Column(Text, nullable=True)
    ats_score = Column(Integer, nullable=True)  # 0-100
    strengths = Column(JSON, nullable=True)
    improvements = Column(JSON, nullable=True)
    # optionally store parsed_skills if you parse them
    parsed_skills = Column(JSON, nullable=True)
