
from typing import List, Optional
from pydantic import BaseModel

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
    required_skills: Optional[List[str]] = []

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

    required_skills: List[str]


    class Config:
        from_attributes = True

class JobMatch(BaseModel):
    job: JobOut
    match: int
