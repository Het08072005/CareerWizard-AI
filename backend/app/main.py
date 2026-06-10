# Server reload triggered to refresh DB schema
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import Base, engine
from app.routes.auth_routes import router as auth_router
from app.routes.profile_routes import router as profile_router
from app.routes.resume_routes import router as resume_router
from app.routes.job_routes import router as job_router
from app.routes.roadmap_routes import router as roadmap_router
from app.routes.interview_routes import router as interview_router
from app.routes.dashboard_routes import router as dashboard_router
from app.routes.admin_internship_routes import router as admin_internship_router
from app.models.activity import UserActivity
from app.models.roadmap import SkillProgress
from app.models.user import User
from app.models.user_profile import StudentProfile
from app.models.admin import Admin
from app.models.internship_plan import InternshipPlan
from app.models.internship_track import InternshipTrack
from app.models.internship_task import InternshipTask
from app.models.payment import Payment
from app.models.enrollment import Enrollment
from app.models.task_submission import TaskSubmission
from app.models.certificate import Certificate
from app.models.interview import InterviewQuestion, InterviewProgress
from app.models.day_content import DayContent

Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/")
def home():
    return {"message": "Backend running!"}

app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(resume_router)
app.include_router(job_router)
app.include_router(roadmap_router)
app.include_router(interview_router)
app.include_router(dashboard_router)
app.include_router(admin_internship_router)
