### CareerWizard AI

CareerWizard is a database-backed career simulation and proof-of-work platform. Its internship workspace now connects published Supabase content to enrollment, adaptive briefs, GitHub repository review, evidence timelines, readiness scoring, standups, portfolio projects, resources, and credentials.

CareerWizard AI is an AI-powered career development platform designed to help users **enhance their career journey** through smart automation and personalized guidance. The platform offers:

- **AI-Powered Job Matching:** Receive job recommendations where the AI predicts **60%+ compatibility** based on your resume and profile. Only jobs that match your skillset and experience are highlighted.
- **Resume Improvement & ATS Analysis:** Optimize your resume to pass Applicant Tracking Systems and improve visibility to recruiters.
- **Skills Gap Identification:** Discover missing skills and get actionable koirecommendations for upskilling.
- **Learning Roadmaps:** Personalized plans to help you acquire the skills needed for your target roles.

- **Interview Preparation:** Access **800+ domain-specific questions** with AI-guided explanations, teaching you how to answer effectively using the **STAR method**.
- **Career Roadmap & Progress Tracking:** Visualize your career growth, set milestones, and track achievements.

> **Example:** In the Job Match section, CareerWizard AI shows only jobs where your profile meets **60% or higher match criteria**, making your job search efficient and focused.

This AI-driven approach ensures users get **actionable insights** at every step, from building resumes to landing interviews and advancing their careers.

---

## 🚀 Features

### **1. Resume Analysis & ATS Scoring**
- Upload your resume and receive instant AI-powered evaluation.
- ATS score calculation based on standard criteria.
- Highlights missing keywords, formatting issues, and improvement areas.
- Provides actionable suggestions to make your resume job-ready.

### **2. Job Matching (60%+ Recommended Jobs Only)**
- Intelligent job matching based on your resume and extracted skills.
- Supports external job APIs + inbuilt demo job dataset.
- Only shows jobs with **60%+ compatibility score**.
- Match breakdown includes:
  - Matching skills  
  - Missing skills  
  - Experience alignment  
  - Keyword overlap  

### **3. Roadmaps & Learning Paths**
- Explore expertly crafted **career roadmaps** for the most in-demand roles (e.g., Full Stack, AI/ML).
- Receive personalized **skill-gap analysis** and step-by-step learning recommendations tailored to industry standards.
- Get organized learning resources and milestones to effectively **launch your career growth.**

### **4. AI-Powered Roadmap Generator (Phase-Wise)**
- Automatically creates a structured learning path:
  - Phase 1: Basics  
  - Phase 2: Practical Projects  
  - Phase 3: Advanced Skills  
- Interactive checklist system to track learning.
- Task completion increases progress visually.

### **5. Interview Preparation System**
- Domain-wise interview preparation with **800+ curated questions**.
- Users can:
  - Practice questions  
  - Mark questions as completed  
  - Add notes  
  - Track overall interview readiness  

### **6. AI Answer Explanation + STAR Method**
- Generates detailed explanations for answers.
- Helps users craft strong responses using the **STAR Method**:
  - Situation  
  - Task  
  - Action  
  - Result  
- Provides example answers & improvement recommendations.

---

## 🧩 Complete Workflow

1. Upload Resume → ATS Score → Suggestions  
2. Auto Skill Extraction Using Resume→ Job Matching (60%+ only)  
3. Domain Skills  → Checklists → Learning Recommendations   → Progress Tracking
4. AI Roadmap (Phase-Wise) → Progress Tracking  
5. Interview Questions → Notes → Completion Tracking  
6. AI Answer Explanations → STAR Method Guidance  



---

## 🛠️ Tech Stack

- **Frontend:** React 19 + Vite
- **Backend:** FastAPI / Python
- **AI Layer:** Google Gen AI SDK through a centralized gateway
- **Database:** Supabase PostgreSQL + Storage
<!-- - **Hosting:** Vercel / AWS / Render   -->

---

## 🔮 Future Enhancements

- Voice-based mock interviews  
- Portfolio & LinkedIn optimization tools  
- Coding challenge integration  
- Career growth analytics  

---

## 📧 Support

For support or questions: **het80630@gmail.com**

---

### ⭐ If you like this project, consider giving it a star!

## Installation

```bash
git clone https://github.com/your-username/CareerWizard-AI.git
cd CareerWizard-AI

python3 -m venv backend/.venv
source backend/.venv/bin/activate
pip install -r backend/requirements.txt
cp backend/.env.example backend/.env

cd frontend
npm install
cd ..
```

Configure `backend/.env`, then start both services in separate terminals:

```bash
cd backend
python3 -m uvicorn app.main:app --reload
```

```bash
cd frontend
npm run dev
```

The frontend runs at `http://localhost:5173`; FastAPI and its OpenAPI docs run at `http://127.0.0.1:8000` and `/docs`.

### Database setup

Point `DATABASE_URL` at Supabase PostgreSQL. On backend startup, idempotent checked-in migrations run and missing catalog rows are inserted without overwriting existing content. Existing `day_content` rows receive an initial version snapshot and a 15/30-day review schedule.

For a scheduled multi-source job refresh:

```bash
cd backend
python3 scrapper/job_scrap.py
python3 scrapper/sync_jobs.py --input scrapper/jobs_output.json
```

Run this workflow from your deployment scheduler (for example every 6 hours). The importer deduplicates and upserts into Supabase; fresher suitability and source-posted freshness drive ranking.

### Quality gates

```bash
cd backend && python3 -m unittest discover -s tests
cd ../frontend && npm run lint && npm run build
```
