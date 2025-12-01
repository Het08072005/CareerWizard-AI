
from pydantic import BaseModel
from typing import List

class Week(BaseModel):
    title: str
    topics: List[str]
    miniProject: List[str]
    resources: List[str]

class Month(BaseModel):
    month: str
    goal: str
    isComplete: bool
    weeks: List[Week]
    skillsToMaster: List[str]

class RoadmapResponse(BaseModel):
    domain: str
    months: List[Month]
