# app/routes/roadmap_routes.py
from fastapi import APIRouter, Query
from app.services.roadmap_service import generate_roadmap_ai
from app.schemas.roadmap_schema import RoadmapResponse

router = APIRouter(prefix="/roadmap", tags=["Roadmap"])

@router.get("/", response_model=RoadmapResponse)
async def get_roadmap(domain: str = Query(...), months: int = Query(2)):
    return await generate_roadmap_ai(domain, months)
 