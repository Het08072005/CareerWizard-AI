import csv
import os
from app.db.database import SessionLocal
from app.models.job import Job

def sync():
    db = SessionLocal()
    current_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(current_dir, "data", "latest_jobs_fetched.csv")
    
    if not os.path.exists(csv_path):
        print(f"CSV not found at {csv_path}")
        return

    print(f"Reading from {csv_path}...")
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        count = 0
        for row in reader:
            # Check if exists
            exists = db.query(Job).filter(
                Job.title == row['title'], 
                Job.company == row['company']
            ).first()
            
            if not exists:
                job = Job(
                    title=row['title'],
                    company=row['company'],
                    location=row['location'],
                    salary=row['salary'],
                    type=row['type'],
                    description=row['description'],
                    apply_link=row['apply_link'],
                    is_api=True
                )
                db.add(job)
                count += 1
            else:
                if not exists.is_api:
                    exists.is_api = True
                    count += 1
        
        db.commit()
        print(f"Synced {count} jobs from CSV to Database.")
    db.close()

if __name__ == "__main__":
    sync()
