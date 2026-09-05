
from typing import List, Optional
from pydantic import BaseModel, Field

class SkillBase(BaseModel):
    name: str

    class Config:
        from_attributes = True

class JobCreate(BaseModel):
    title: str
    company: str
    location: Optional[str]
    salary: Optional[str]
    type: Optional[str]
    description: Optional[str]
    apply_link: Optional[str]
    required_skills: List[str] = Field(default_factory=list)

class JobOut(BaseModel):
    id: int 
    title: str
    company: str
    location: Optional[str]
    salary: Optional[str]
    type: Optional[str]
    description: Optional[str]
    posted: Optional[str]
    apply_link: Optional[str] = "#"
    is_api: Optional[bool] = False
    created_at: Optional[str] = None
    posted_at: Optional[str] = None
    fetched_at: Optional[str] = None
    source: Optional[str] = None
    experience_level: Optional[str] = None
    is_remote: Optional[bool] = False
    freshness_score: Optional[float] = 0
    relevance_score: Optional[float] = 0

    required_skills: List[str]


    class Config:
        from_attributes = True

class JobMatch(BaseModel):
    job: JobOut
    match: int
    breakdown: dict = Field(default_factory=dict)
