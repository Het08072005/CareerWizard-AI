from fastapi import APIRouter
from app.services.recommendation_service import recommendation_service

router = APIRouter(prefix="/recommend")

@router.get("/")
def recommend(skill: str):
    return {"jobs": recommendation_service(skill)}
