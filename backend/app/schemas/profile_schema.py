
from pydantic import BaseModel
from typing import List, Optional

class ProfileResponse(BaseModel):
    name: str
    email: str
    location: Optional[str]
    bio: Optional[str]
    experience: Optional[str]
    skills: Optional[str]
    linkedin_url: Optional[str]
    target_roles: List[str]
    resume_file_path: Optional[str]

    class Config:
        from_attributes = True
