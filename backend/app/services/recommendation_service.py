from app.utils.gemini_client import get_job_recommendations

def recommendation_service(skill: str):
    return get_job_recommendations(skill)
