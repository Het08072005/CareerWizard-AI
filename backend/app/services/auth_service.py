from sqlalchemy.orm import Session
from app.models.user import User
from app.core.security import hash_password, verify_password, create_access_token

def signup_service(db: Session, name: str, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()
    if user:
        return {"error": "Email already exists"}

    new_user = User(name=name, email=email, password=hash_password(password))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"user_id": new_user.id})
    return {
        "message": "Signup successful",
        "token": token,
        "user_id": new_user.id,
        "name": new_user.name
    }

def login_service(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return {"error": "User not found"}

    if not verify_password(password, user.password):
        return {"error": "Invalid password"}

    token = create_access_token({"user_id": user.id})
    return {
        "message": "Login successful",
        "token": token,
        "user_id": user.id,
        "name": user.name
    }
