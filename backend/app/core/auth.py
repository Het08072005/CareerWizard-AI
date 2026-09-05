from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from app.db.database import SessionLocal
from app.models.user import User
from app.core.security import SECRET_KEY, ALGORITHM

security = HTTPBearer()
security_optional = HTTPBearer(auto_error=False)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(credentials=Depends(security), db: Session = Depends(get_db)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    import uuid
    try:
        uuid_obj = uuid.UUID(str(user_id))
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid token format (expected UUID)")

    user = db.query(User).filter(User.id == str(uuid_obj)).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="User is unavailable")

    return user


def get_current_admin(current_user=Depends(get_current_user)):
    """Require an explicit admin record or a recognized privileged legacy role."""
    privileged_roles = {"admin", "developer", "reviewer", "mentor"}
    if current_user.admin is None and (current_user.role or "").lower() not in privileged_roles:
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

def get_current_user_optional(credentials=Depends(security_optional), db: Session = Depends(get_db)):
    if not credentials:
        return None
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
    except JWTError:
        return None

    import uuid
    try:
        uuid_obj = uuid.UUID(str(user_id))
    except ValueError:
        return None

    return db.query(User).filter(User.id == str(uuid_obj)).first()

