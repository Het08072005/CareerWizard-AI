import requests
from app.core.config import settings

def create_bucket():
    url = f"{settings.SUPABASE_URL}/storage/v1/bucket"
    headers = {
        "Authorization": f"Bearer {settings.SUPABASE_KEY}",
        "apikey": settings.SUPABASE_KEY,
        "Content-Type": "application/json"
    }
    data = {
        "id": "day-resources",
        "name": "day-resources",
        "public": True
    }
    res = requests.post(url, headers=headers, json=data)
    print("Create bucket response:", res.status_code, res.text)

if __name__ == "__main__":
    create_bucket()
