from app.services.ai_gateway import get_ai_gateway

def get_job_recommendations(skill: str):
    prompt = f"Suggest 5 job roles for someone skilled in {skill}. Output only list."
    result = get_ai_gateway().generate_text(prompt)
    
    # Clean split
    return [line.strip() for line in result.split("\n") if line.strip()]
