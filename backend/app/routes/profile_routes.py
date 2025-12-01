# app/routes/profile.py
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.models.user_profile import UserProfile
from app.schemas.profile_schema import ProfileResponse
from app.core.auth import get_current_user, get_db
from app.services.ai_service import improve_text
import json, os, uuid
from fastapi import Path

router = APIRouter(prefix="/profile", tags=["Profile"])


# ---------------------- GET PROFILE ----------------------
@router.get("/", response_model=ProfileResponse)
def get_profile(current_user=Depends(get_current_user), db: Session = Depends(get_db)):

    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()

    if not profile:
        return {
            "name": current_user.name,
            "email": current_user.email,
            "location": "",
            "bio": "",
            "experience": "",
            "skills": "",
            "linkedin_url": "",
            "target_roles": [],
            "resume_file_path": ""
        }

    return {
        "name": current_user.name,
        "email": current_user.email,
        "location": profile.location,
        "bio": profile.bio,
        "experience": profile.experience,
        "skills": profile.skills,
        "linkedin_url": profile.linkedin_url,
        "target_roles": profile.get_roles(),
        "resume_file_path": os.path.basename(profile.resume_file_path) if profile.resume_file_path else ""

    }



# ---------------------- UPDATE PROFILE ----------------------
@router.put("/")
def update_profile(
    location: str = None,
    bio: str = None,
    experience: str = None,
    skills: str = None,
    linkedin_url: str = None,
    target_roles: str = None,
    resume: UploadFile = File(None),
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()

    # Create new profile if not exists
    if not profile:
        profile = UserProfile(user_id=current_user.id)
        db.add(profile)

    # Update simple fields
    profile.location = location
    profile.bio = bio
    profile.experience = experience
    profile.skills = skills
    profile.linkedin_url = linkedin_url

    # Handle target roles
    if target_roles:
        try:
            parsed_roles = json.loads(target_roles)
            profile.set_roles(parsed_roles)
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="Invalid JSON for target_roles")

    # Handle resume upload
    if resume:
        folder = "uploads/"
        os.makedirs(folder, exist_ok=True)

        unique_filename = f"{uuid.uuid4()}_{resume.filename}"
        file_path = os.path.join(folder, unique_filename)

        with open(file_path, "wb") as f:
            f.write(resume.file.read())

        profile.resume_file_path = file_path
        

    db.commit()
    db.refresh(profile)  # Refresh updated values from DB

    return {
        "message": "Profile updated successfully",
        "profile": {
            "name": current_user.name,
            "email": current_user.email,
            "location": profile.location,
            "bio": profile.bio,
            "experience": profile.experience,
            "skills": profile.skills,
            "linkedin_url": profile.linkedin_url,
            "target_roles": profile.get_roles(),
            "resume_file_path": os.path.basename(profile.resume_file_path) if profile.resume_file_path else ""
        }
    }



# ---------------------- AI Improve Text ----------------------
@router.post("/ai")
async def ai_generate(text: str, category: str):
    """
    category must be one of:
    - bio
    - experience
    - skills
    """
    if category not in ["bio", "experience", "skills"]:
        raise HTTPException(status_code=400, detail="Invalid category (bio, experience, skills only)")

    improved = await improve_text(text, category)
    return {"category": category, "improved": improved}



@router.get("/resume/{filename}")
def get_resume(filename: str = Path(...)):
    folder = "uploads/"
    file_path = os.path.join(folder, filename)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Resume not found")

    return FileResponse(file_path, media_type="application/pdf", filename=filename)