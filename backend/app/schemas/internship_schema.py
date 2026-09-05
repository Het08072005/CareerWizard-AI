from datetime import date
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, Field, HttpUrl, field_validator


Difficulty = Literal["beginner", "intermediate", "advanced"]


class EnrollmentCreate(BaseModel):
    plan_id: UUID
    track_id: UUID
    difficulty_level: Difficulty
    payment_id: UUID | None = None


class DifficultyUpdate(BaseModel):
    difficulty_level: Difficulty


class SubmissionCreate(BaseModel):
    day_number: int = Field(ge=1, le=365)
    github_url: HttpUrl

    @field_validator("github_url")
    @classmethod
    def github_only(cls, value: HttpUrl):
        if value.scheme != "https" or value.host not in {"github.com", "www.github.com"}:
            raise ValueError("A public HTTPS GitHub repository URL is required")
        parts = [part for part in value.path.split("/") if part]
        if len(parts) != 2:
            raise ValueError("Use a repository URL such as https://github.com/owner/repository")
        return value


class StandupCreate(BaseModel):
    standup_date: date = Field(default_factory=date.today)
    yesterday: str = Field(min_length=2, max_length=2000)
    today: str = Field(min_length=2, max_length=2000)
    blockers: str | None = Field(default=None, max_length=2000)


class AdminReviewCreate(BaseModel):
    correctness: int = Field(ge=0, le=25)
    approach: int = Field(ge=0, le=25)
    quality: int = Field(ge=0, le=25)
    documentation: int = Field(ge=0, le=25)
    feedback: str = Field(min_length=5, max_length=10000)
    improvements: list[str] = Field(default_factory=list, max_length=20)
    highlight: str | None = Field(default=None, max_length=1000)


class DayContentUpsert(BaseModel):
    domain: str = Field(min_length=2, max_length=100, pattern=r"^[a-zA-Z0-9_-]+$")
    task_name: str = Field(min_length=2, max_length=200)
    type: Literal["internship", "certificate", "course"]
    day: int = Field(ge=1, le=365)
    beginner: list[dict] = Field(default_factory=list)
    intermediate: list[dict] = Field(default_factory=list)
    advanced: list[dict] = Field(default_factory=list)
    source: list[dict] = Field(default_factory=list)
    refresh_interval_days: Literal[15, 30] = 30
    change_note: str | None = Field(default=None, max_length=500)
