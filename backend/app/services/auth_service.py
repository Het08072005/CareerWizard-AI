from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.user import User
from app.core.security import hash_password, verify_password, create_access_token

def signup_service(db: Session, name: str, email: str, password: str, role: str = None):
    user = db.query(User).filter(User.email == email).first()
    if user:
        raise HTTPException(status_code=400, detail="Email already exists")

    new_user = User(full_name=name, email=email, password_hash=hash_password(password), role=role or "student")
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"user_id": str(new_user.id)})
    return {
        "message": "Signup successful",
        "token": token,
        "user_id": str(new_user.id),
        "name": new_user.full_name
    }

def login_service(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid password")

    token = create_access_token({"user_id": str(user.id)})
    return {
        "message": "Login successful",
        "token": token,
        "user_id": str(user.id),
        "name": user.full_name,
        "email": user.email
    }
