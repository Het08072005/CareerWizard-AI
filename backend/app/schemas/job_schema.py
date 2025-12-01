# app/schemas/job_schema.py
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
    required_skills: List[str]

    class Config:
        from_attributes = True

class JobMatch(BaseModel):
    job: JobOut
    match: int
