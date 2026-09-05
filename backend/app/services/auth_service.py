from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException
from app.models.user import User
from app.models.user_profile import StudentProfile
from app.core.security import hash_password, verify_password, create_access_token

def signup_service(db: Session, name: str, email: str, password: str, target_role: str | None = None):
    try:
        user = db.query(User).filter(User.email == email).first()
        if user:
            raise HTTPException(status_code=400, detail="Email already exists")

        normalized_email = email.strip().lower()
        new_user = User(full_name=name.strip(), email=normalized_email, password_hash=hash_password(password), role="student")
        db.add(new_user)
        db.flush()
        db.add(StudentProfile(user_id=new_user.id, target_role=(target_role or "").strip() or None))
        db.commit()
        db.refresh(new_user)

        token = create_access_token({"user_id": str(new_user.id)})
        return {
            "message": "Signup successful",
            "token": token,
            "user_id": str(new_user.id),
            "name": new_user.full_name,
            "email": new_user.email,
            "role": new_user.role,
        }
    except SQLAlchemyError as error:
        db.rollback()
        raise HTTPException(status_code=503, detail=f"Database unavailable: {error.__class__.__name__}") from error

def login_service(db: Session, email: str, password: str):
    try:
        user = db.query(User).filter(User.email == email.strip().lower()).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        if not user.is_active or not verify_password(password, user.password_hash):
            raise HTTPException(status_code=401, detail="Invalid password")

        token = create_access_token({"user_id": str(user.id)})
        return {
            "message": "Login successful",
            "token": token,
            "user_id": str(user.id),
            "name": user.full_name,
            "email": user.email,
            "role": user.role,
        }
    except SQLAlchemyError as error:
        raise HTTPException(status_code=503, detail=f"Database unavailable: {error.__class__.__name__}") from error
