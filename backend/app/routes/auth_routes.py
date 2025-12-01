from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.schemas.user_schema import SignupRequest, LoginRequest
from app.services.auth_service import signup_service, login_service

router = APIRouter(prefix="/auth", tags=["Auth"])

def db():
    d = SessionLocal()
    try:
        yield d
    finally:
        d.close()

@router.post("/signup")
def signup(req: SignupRequest, db: Session = Depends(db)):
    return signup_service(db, req.name, req.email, req.password)

@router.post("/login")
def login(req: LoginRequest, db: Session = Depends(db)):
    return login_service(db, req.email, req.password)
