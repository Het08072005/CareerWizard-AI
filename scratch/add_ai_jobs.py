import pandas as pd
import random

roles = [
    "AI Engineer", "MLOps Engineer", "Data Scientist", "Data Engineer", "NLP Engineer",
    "Computer Vision Engineer", "AI Researcher", "Deep Learning Engineer", "Generative AI Developer",
    "Analytics Engineer", "Backend AI Developer", "Data Architect", "AI Product Manager",
    "Prompt Engineer", "AI Ethicist", "Robotics Software Engineer"
]

companies = [
    "OpenAI", "DeepMind", "NVIDIA", "Meta", "Google AI", "Anthropic", "Tesla", "Microsoft", 
    "Amazon Web Services", "Databricks", "Snowflake", "Scale AI", "Stability AI", "Mistral AI",
    "Hugging Face", "Cisco", "IBM", "Intel", "Salesforce", "Palantir"
]

locations = [
    "San Francisco, CA", "Palo Alto, CA", "Seattle, WA", "New York, NY", "Austin, TX",
    "London, UK (Remote)", "Berlin, Germany", "Toronto, Canada", "Tel Aviv, Israel",
    "Bangalore, India", "Singapore", "Tokyo, Japan", "Remote"
]

types = ["Full-time", "Contract", "Remote"]

new_jobs = []
for i in range(100):
    role = random.choice(roles)
    company = random.choice(companies)
    loc = random.choice(locations)
    job_type = random.choice(types)
    salary_min = random.randint(120, 280)
    salary_max = salary_min + random.randint(30, 100)
    
    skills = random.sample([
        "Python", "PyTorch", "TensorFlow", "Scikit-Learn", "Kubernetes", "Docker", "SQL",
        "AWS", "GCP", "Azure", "Spark", "Kafka", "React", "Node.js", "HuggingFace",
        "LangChain", "LLMs", "Vector DBs", "C++", "Rust", "Golang", "Transformers"
    ], 5)
    
    new_jobs.append({
        "id": 500 + i,
        "title": role,
        "company": company,
        "location": loc,
        "salary": f"${salary_min}K - ${salary_max}K",
        "type": job_type,
        "description": f"Join {company} as a {role} to build the future of intelligence. We are looking for experts in {skills[0]} and {skills[1]} to drive our next generation of products. You will work on cutting-edge technologies including {skills[2]} and {skills[3]}.",
        "posted": "Just now",
        "required_skills": ", ".join(skills)
    })

df = pd.DataFrame(new_jobs)
df.to_csv("backend/data/jobs.csv", mode='a', header=False, index=False)
print(f"Added {len(new_jobs)} premium AI/Data roles to jobs.csv")
