
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.auth import get_current_user, get_db
from app.models.activity import UserActivity
from sqlalchemy import func

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/stats")
def get_dashboard_stats(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    # Get activity counts
    activities = db.query(
        UserActivity.activity_type, 
        func.count(UserActivity.id).label("count")
    ).filter(UserActivity.user_id == current_user.id).group_by(UserActivity.activity_type).all()
    
    stats = {
        "resume_analysis": 0,
        "job_search": 0,
        "interview_prep": 0,
        "roadmap_gen": 0
    }
    
    for activity_type, count in activities:
        if activity_type in stats:
            stats[activity_type] = count
            
    # Get recent activities
    recent = db.query(UserActivity).filter(UserActivity.user_id == current_user.id).order_by(UserActivity.created_at.desc()).limit(5).all()
    
    return {
        "user_name": current_user.full_name,
        "stats": stats,
        "recent_activities": [
            {
                "type": a.activity_type,
                "details": a.details,
                "timestamp": a.created_at
            } for a in recent
        ]
    }
