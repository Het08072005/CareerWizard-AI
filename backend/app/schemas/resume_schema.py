from typing import List, Optional
from pydantic import BaseModel, Field

class ResumeAnalysisCreate(BaseModel):
    filename: Optional[str]
    text_content: Optional[str]

class ResumeAnalysisResponse(BaseModel):
    ats_score: int
    skills: List[str] = Field(default_factory=list)
    missing_skills: List[str] = Field(default_factory=list)
    score_breakdown: dict = Field(default_factory=dict)
    strengths: List[str]
    improvements: List[str]
    enhancements: List[dict] = Field(default_factory=list)
