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
from app.models.activity import UserActivity
from app.models.roadmap import SkillProgress

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

