# app/routes/roadmap_routes.py
from app.services.roadmap_service import generate_roadmap_ai
from app.schemas.roadmap_schema import RoadmapResponse
from app.core.auth import get_current_user, get_db
from app.models.activity import UserActivity
from app.models.roadmap import SkillProgress
from sqlalchemy.orm import Session
from fastapi import APIRouter, Query, Depends

router = APIRouter(prefix="/roadmap", tags=["Roadmap"])

@router.get("/", response_model=RoadmapResponse)
async def get_roadmap(
    domain: str = Query(...), 
    months: int = Query(2),
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Log activity
    activity = UserActivity(
        user_id=current_user.id,
        activity_type="roadmap_gen",
        details=f"Generated {months} months roadmap for {domain}"
    )
    db.add(activity)
    db.commit()
    
    return await generate_roadmap_ai(domain, months)

@router.get("/progress/{role_key}")
def get_progress(
    role_key: str,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    progress = db.query(SkillProgress).filter(
        SkillProgress.user_id == current_user.id,
        SkillProgress.role_key == role_key
    ).first()
    
    if not progress:
        return {"progress_data": {}}
    
    return {"progress_data": progress.progress_data}

@router.post("/progress/{role_key}")
def save_progress(
    role_key: str,
    payload: dict,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    progress = db.query(SkillProgress).filter(
        SkillProgress.user_id == current_user.id,
        SkillProgress.role_key == role_key
    ).first()
    
    if not progress:
        progress = SkillProgress(
            user_id=current_user.id,
            role_key=role_key,
            progress_data=payload
        )
        db.add(progress)
    else:
        progress.progress_data = payload
    
    # Log activity on significant updates (simplified: log every save for now)
    activity = UserActivity(
        user_id=current_user.id,
        activity_type="roadmap_progress",
        details=f"Updated progress for {role_key}"
    )
    db.add(activity)
    
    db.commit()
    return {"message": "Progress saved successfully"}
 