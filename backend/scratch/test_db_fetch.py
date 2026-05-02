from app.db.database import SessionLocal
from app.models.job import Job
from app.schemas.job_schema import JobOut

db = SessionLocal()
try:
    jobs = db.query(Job).all()
    print(f"Fetched {len(jobs)} jobs from DB.")
    if jobs:
        j = jobs[0]
        # Try to create JobOut
        out = JobOut(
            id=j.id,
            title=j.title,
            company=j.company,
            location=j.location,
            salary=j.salary,
            type=j.type,
            description=j.description,
            posted=j.posted,
            apply_link=getattr(j, 'apply_link', '#') or '#',
            required_skills=[s.name for s in j.required_skills]
        )
        print("Successfully created JobOut for first job.")
except Exception as e:
    print(f"Error: {e}")
finally:
    db.close()
