from typing import List, Optional
from pydantic import BaseModel

class ResumeAnalysisCreate(BaseModel):
    filename: Optional[str]
    text_content: Optional[str]

class ResumeAnalysisResponse(BaseModel):
    ats_score: int
    strengths: List[str]
    improvements: List[str]
