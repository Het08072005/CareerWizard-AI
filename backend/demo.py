# # demo.py

# import random
# from sqlalchemy.orm import Session
# from app.db.database import get_db
# from app.services.job_service import create_job
# from app.schemas.job_schema import JobCreate

# # Sample India-related realistic data

# job_titles = [
#     "Senior Frontend Developer", "Backend Engineer", "Data Scientist",
#     "DevOps Engineer", "Mobile App Developer", "UI/UX Designer",
#     "Full Stack Developer", "Cloud Architect", "QA Engineer", "Product Manager",
#     "Machine Learning Engineer", "Android Developer", "iOS Developer",
#     "Business Analyst", "Software Engineer", "Cybersecurity Analyst"
# ]

# companies = [
#     "Tata Consultancy Services", "Infosys", "Wipro", "HCL Technologies",
#     "Tech Mahindra", "Mindtree", "Cognizant India", "Capgemini India",
#     "L&T Infotech", "IBM India", "Google India", "Microsoft India",
#     "Amazon India", "Flipkart", "Reliance Digital"
# ]

# locations = [
#     "Bengaluru, Karnataka", "Hyderabad, Telangana", "Pune, Maharashtra",
#     "Mumbai, Maharashtra", "Gurugram, Haryana", "Noida, Uttar Pradesh",
#     "Chennai, Tamil Nadu", "Kolkata, West Bengal", "Jaipur, Rajasthan",
#     "Ahmedabad, Gujarat", "Remote"
# ]

# skills_pool = [
#     "Python", "JavaScript", "React", "Node.js", "Django", "TypeScript",
#     "CSS", "HTML", "Docker", "AWS", "Kubernetes", "PostgreSQL",
#     "Flutter", "Swift", "Java", "Machine Learning", "Terraform",
#     "Angular", "Vue.js", "SQL", "Git", "Jenkins", "CI/CD", "Microservices"
# ]

# # Generate 100 jobs
# demo_jobs = []
# for i in range(300):
#     title = random.choice(job_titles)
#     company = random.choice(companies)
#     location = random.choice(locations)
#     salary = f"${random.randint(80, 150)}K - ${random.randint(150, 200)}K"
#     job_type = random.choice(["Full-time", "Remote", "Part-time"])
#     description = f"This is a description for {title} at {company} located in {location}."
#     required_skills = random.sample(skills_pool, k=random.randint(3, 6))

#     demo_jobs.append({
#         "title": title,
#         "company": company,
#         "location": location,
#         "salary": salary,
#         "type": job_type,
#         "description": description,
#         "required_skills": required_skills
#     })

# def main():
#     db: Session = next(get_db())
#     for job_data in demo_jobs:
#         job_schema = JobCreate(**job_data)
#         job = create_job(db, job_schema)
#         print(f"Created job: {job.title} at {job.company}")
#     db.close()

# if __name__ == "__main__":
#     main()


# demo.py

from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services.job_service import create_job
from app.schemas.job_schema import JobCreate
import random

# India-related data
job_titles = [
    "Senior Frontend Developer", "Backend Engineer", "Data Scientist",
    "DevOps Engineer", "Mobile App Developer", "UI/UX Designer",
    "Full Stack Developer", "Cloud Architect", "QA Engineer", "Product Manager",
    "Machine Learning Engineer", "Android Developer", "iOS Developer",
    "Business Analyst", "Software Engineer", "Cybersecurity Analyst"
]

companies = [
    "Tata Consultancy Services", "Infosys", "Wipro", "HCL Technologies",
    "Tech Mahindra", "Mindtree", "Cognizant India", "Capgemini India",
    "L&T Infotech", "IBM India", "Google India", "Microsoft India",
    "Amazon India", "Flipkart", "Reliance Digital"
]

locations = [
    "Bengaluru, Karnataka", "Hyderabad, Telangana", "Pune, Maharashtra",
    "Mumbai, Maharashtra", "Gurugram, Haryana", "Noida, Uttar Pradesh",
    "Chennai, Tamil Nadu", "Kolkata, West Bengal", "Jaipur, Rajasthan",
    "Ahmedabad, Gujarat", "Remote"
]

skills_pool = [
    "Python", "JavaScript", "React", "Node.js", "Django", "TypeScript",
    "CSS", "HTML", "Docker", "AWS", "Kubernetes", "PostgreSQL",
    "Flutter", "Swift", "Java", "Machine Learning", "Terraform",
    "Angular", "Vue.js", "SQL", "Git", "Jenkins", "CI/CD", "Microservices"
]

job_types = ["Full-time", "Remote", "Part-time", "Contract"]

# Ensure coverage for each company, skill, and job type
demo_jobs = []

# 1. Ensure each company has at least one job
for company in companies:
    title = random.choice(job_titles)
    location = random.choice(locations)
    salary = f"${random.randint(80, 150)}K - ${random.randint(150, 200)}K"
    job_type = random.choice(job_types)
    description = f"This is a description for {title} at {company} located in {location}."
    required_skills = random.sample(skills_pool, k=random.randint(3, 6))
    demo_jobs.append({
        "title": title,
        "company": company,
        "location": location,
        "salary": salary,
        "type": job_type,
        "description": description,
        "required_skills": required_skills
    })

# 2. Ensure each skill is present in at least one job
for skill in skills_pool[:10]:  # pick first 10 important skills to cover
    title = random.choice(job_titles)
    company = random.choice(companies)
    location = random.choice(locations)
    salary = f"${random.randint(80, 150)}K - ${random.randint(150, 200)}K"
    job_type = random.choice(job_types)
    description = f"Job with {skill} skill at {company} in {location}."
    # Make sure the skill is included
    required_skills = [skill] + random.sample([s for s in skills_pool if s != skill], k=random.randint(2, 5))
    demo_jobs.append({
        "title": title,
        "company": company,
        "location": location,
        "salary": salary,
        "type": job_type,
        "description": description,
        "required_skills": required_skills
    })

# 3. Fill remaining jobs to reach 50
while len(demo_jobs) < 50:
    title = random.choice(job_titles)
    company = random.choice(companies)
    location = random.choice(locations)
    salary = f"${random.randint(80, 150)}K - ${random.randint(150, 200)}K"
    job_type = random.choice(job_types)
    description = f"This is a description for {title} at {company} located in {location}."
    required_skills = random.sample(skills_pool, k=random.randint(3, 6))
    demo_jobs.append({
        "title": title,
        "company": company,
        "location": location,
        "salary": salary,
        "type": job_type,
        "description": description,
        "required_skills": required_skills
    })

def main():
    db: Session = next(get_db())
    for job_data in demo_jobs:
        job_schema = JobCreate(**job_data)
        job = create_job(db, job_schema)
        print(f"Created job: {job.title} at {job.company}")
    db.close()

if __name__ == "__main__":
    main()

