
import os
import csv
import random
import sys

# Ensure backend is in path
sys.path.append(os.getcwd())

from sqlalchemy.orm import Session
from app.db.database import SessionLocal, engine, Base
from app.models.job import Job, Skill, job_skill_table
from app.services.job_service import create_job
from app.schemas.job_schema import JobCreate

# Expanded high-quality data for enrichment with variations
ENRICHMENT_VARIATIONS = {
    "Senior Frontend Developer": [
        "Lead the development of high-performance user interfaces using modern React ecosystems. Responsibilities include architecting frontend solutions, mentoring junior developers, and ensuring seamless UX across all devices. You will work closely with design teams to implement pixel-perfect components and optimize web performance for millions of global users.",
        "As a Senior Frontend Developer, you will drive the technical direction of our client-side applications. We are looking for an expert in React and TypeScript who can build scalable architectures and lead complex feature implementations. You will be responsible for setting coding standards, performing code reviews, and collaborating with backend engineers to define efficient API contracts.",
        "Join our engineering team to build the next generation of web interfaces. You will focus on building reusable component libraries, implementing advanced state management patterns, and ensuring our applications are accessible and performant. This role requires a deep understanding of browser internals and modern CSS techniques to deliver a premium user experience."
    ],
    "Backend Engineer": [
        "Design and implement scalable backend services and APIs using Node.js and Python. Focus on data integrity, system performance, and building robust distributed systems that handle millions of requests. You will be responsible for database schema design, implementing caching strategies, and ensuring the reliability of our core services.",
        "We are looking for a Backend Engineer to join our core platform team. You will build high-throughput microservices, optimize complex database queries, and implement secure authentication systems. Experience with message brokers like Kafka or Redis is a plus as you will work on event-driven architectures to process data in real-time.",
        "Architect and maintain the server-side logic of our cloud-based platforms. You will focus on building RESTful and gRPC APIs, managing relational and NoSQL databases, and ensuring high availability across multiple regions. This role involves deep dives into system performance tuning and implementing comprehensive monitoring solutions."
    ],
    "Backend devop Engineer": [
        "Bridge the gap between backend development and operations. Focus on building highly available backend services while managing CI/CD pipelines and cloud infrastructure using Terraform and AWS. You will ensure that our deployments are automated, secure, and observable from development to production.",
        "As a Backend DevOps Engineer, you will specialize in containerization and orchestration. You will build backend services with a focus on cloud-native patterns and manage Kubernetes clusters to ensure seamless scaling. Your goal is to empower development teams with self-service infrastructure and robust automation tools.",
        "Combine your software engineering skills with systems knowledge to build resilient infrastructure. You will develop backend logic while also taking ownership of infrastructure as code and site reliability. This dual role requires expertise in Go or Python and a deep understanding of network protocols and cloud security."
    ],
    "DevOps Engineer": [
        "Automate infrastructure deployment and management using AWS, Docker, and Kubernetes. Ensure system reliability, scalability, and security through robust CI/CD pipelines and cloud-native practices. You will be responsible for monitoring system health and responding to incidents in our production environment.",
        "Lead our infrastructure automation efforts to achieve high availability and rapid deployment cycles. You will design and implement infrastructure as code using Terraform, manage container orchestration platforms, and optimize our cloud spending. Experience with security hardening and compliance in the cloud is essential.",
        "Join our DevOps team to build and maintain the foundations of our software delivery platform. You will focus on building automated testing environments, implementing centralized logging and tracing, and ensuring our developer experience is world-class through efficient tooling and automation."
    ],
    "Full Stack Developer": [
        "End-to-end development of web applications using the MERN stack. Handle everything from database design and server-side logic to building interactive frontend components with React. You will be responsible for the entire feature lifecycle, ensuring a cohesive and performant experience across the full application stack.",
        "We are seeking a Full Stack Developer to build modern web solutions. You will work on both the client and server sides, implementing responsive designs and scalable API services. This role requires versatility and the ability to switch contexts quickly while maintaining high code quality and architectural integrity.",
        "Build full-featured applications from the ground up. You will architect database schemas, develop robust backend services, and create dynamic user interfaces. Collaboration is key as you will work with product managers to translate requirements into fully functional technical solutions across all layers of the stack."
    ],
    "Mobile App Developer": [
        "Develop high-quality mobile applications for both iOS and Android platforms using React Native or Flutter. Focus on performance, smooth animations, and delivering a native-like experience. You will be responsible for integrating with native APIs and ensuring our apps are optimized for a wide range of devices.",
        "Join our mobile team to create engaging user experiences on smartphones and tablets. You will build feature-rich applications, implement offline sync capabilities, and ensure our mobile products are stable and secure. Experience with mobile CI/CD and publishing to App Store and Google Play is required.",
        "Architect and build cross-platform mobile solutions that delight users. You will focus on pixel-perfect UI implementation, optimizing app startup times, and managing complex application states. This role involves working closely with UX designers to push the boundaries of mobile interaction design."
    ],
    "Data Scientist": [
        "Extract meaningful insights from complex datasets using Python and R. Apply statistical modeling and machine learning techniques to solve business problems and drive data-driven decision making. You will be responsible for data cleaning, exploratory analysis, and presenting findings to stakeholders.",
        "We are looking for a Data Scientist to build predictive models and recommendation engines. You will work with large-scale data systems, implement feature engineering pipelines, and evaluate model performance in production. Strong mathematical foundation and experience with A/B testing are essential for this role.",
        "Help us leverage data to gain a competitive advantage. You will design experiments, build automated reporting dashboards, and develop sophisticated algorithms to understand user behavior. This role requires the ability to translate complex data results into actionable business strategies and product improvements."
    ],
    "Machine Learning Engineer": [
        "Design, build, and deploy machine learning models at scale using PyTorch or TensorFlow. Work on deep learning architectures, feature engineering, and optimizing models for production environments. You will implement MLOps practices to ensure model reproducibility and monitor performance in real-time.",
        "As an ML Engineer, you will bridge the gap between research and production. You will take prototype models and turn them into scalable, high-performance services. This involves optimizing inference latency, managing large datasets for training, and building automated retraining pipelines.",
        "Join our AI team to solve challenging problems in computer vision and NLP. You will research state-of-the-art algorithms and adapt them to our specific use cases. The role requires strong software engineering skills to integrate ML models into our existing software ecosystem while ensuring scalability and reliability."
    ],
    "iOS Developer": [
        "Build premium iOS applications for iPhone and iPad using Swift and SwiftUI. Focus on elegant code, Apple's Human Interface Guidelines, and integrating with advanced iOS features like Widgets and Core ML. You will ensure our apps are responsive, accessible, and take full advantage of the latest iOS capabilities.",
        "We are seeking an iOS expert to lead our mobile development efforts on Apple platforms. You will architect complex apps using modern patterns like MVVM, manage data persistence with Core Data, and ensure seamless networking. A passion for detail and a commitment to providing a world-class user experience are required.",
        "Develop sophisticated iOS apps that our users love. You will focus on smooth animations, efficient memory management, and integrating with hardware sensors and APIs. This role involves participating in design sprints and contributing to the overall product strategy from a mobile-first perspective."
    ],
    "Software Engineer": [
        "Generalist software engineering role focusing on writing clean, maintainable, and efficient code in Java or C++. Participate in the full software development lifecycle from requirements to deployment. You will work on a variety of projects, from core business logic to internal tools and infrastructure components.",
        "Join our engineering team to solve complex technical challenges. You will apply software design patterns to build reusable libraries and ensure the long-term maintainability of our codebase. This role requires strong problem-solving skills and the ability to work effectively in a collaborative, agile environment.",
        "We are looking for a Software Engineer who is passionate about technical excellence. You will contribute to architecture discussions, implement high-quality features, and help improve our engineering processes. Versatility and a willingness to learn new technologies are more important than deep expertise in a single stack."
    ],
    "QA Engineer": [
        "Ensure the highest quality of software products through comprehensive automated and manual testing. Develop automated test suites using Selenium or Cypress, perform regression testing, and track bug reports from identification to resolution. You will be the advocate for quality throughout the development process.",
        "As a QA Engineer, you will build and maintain a robust automation framework. You will work closely with developers to implement unit, integration, and end-to-end tests, ensuring that every release meets our high standards for performance and reliability. Experience with load testing and security testing is a plus.",
        "Lead our quality assurance efforts to deliver bug-free software to our customers. You will design test plans, manage test data, and integrate testing into our CI/CD pipelines. This role requires a meticulous eye for detail and the ability to think like a user to identify edge cases and potential failure points."
    ],
    "UI/UX Designer": [
        "Design intuitive and beautiful user experiences for our web and mobile applications. Conduct user research, create high-fidelity prototypes in Figma, and collaborate with developers to ensure faithful implementation of your designs. You will define the visual language and interaction patterns for our entire product suite.",
        "We are seeking a UI/UX Designer who can balance aesthetics with usability. You will create user flows, wireframes, and final mockups that solve complex user problems simply. This role involves constant iteration based on user feedback and data, ensuring our products are always evolving to meet user needs.",
        "Drive the design vision of our platform. You will be responsible for creating a cohesive design system that scales across multiple products and platforms. Strong communication skills are essential as you will present your design decisions to stakeholders and work closely with engineering to bring them to life."
    ],
    "Product Manager": [
        "Define the product vision and strategy for our core features. Work closely with engineering, design, and business teams to prioritize the roadmap and deliver maximum value to users. You will be responsible for gathering requirements, writing user stories, and managing the product lifecycle from concept to launch.",
        "As a Product Manager, you will be the voice of the customer. You will conduct market research, analyze user feedback, and use data to make informed product decisions. Your goal is to build products that not only solve real problems but also delight our users and drive business growth.",
        "Lead cross-functional teams to build and ship impactful features. You will manage stakeholders, navigate technical constraints, and ensure that our products are aligned with the overall company strategy. This role requires strong leadership, excellent communication, and a deep understanding of the agile development process."
    ],
    "Cloud Architect": [
        "Design and oversee complex cloud architectures on AWS or Azure. Focus on cost-optimization, disaster recovery, and ensuring systems are built for massive scale. You will provide technical leadership for cloud migrations and ensure that our cloud infrastructure follows industry best practices for security and reliability.",
        "We are looking for a Cloud Architect to define our global infrastructure strategy. You will design serverless architectures, implement complex networking solutions, and ensure that our platform is highly available across multiple regions. This role involves mentoring engineering teams on cloud-native development patterns.",
        "Architect the foundations of our multi-cloud ecosystem. You will focus on building resilient and secure environments using infrastructure as code and modern devsecops practices. Your goal is to provide a scalable and performant platform that supports our rapidly growing user base and evolving business needs."
    ],
    "Business Analyst": [
        "Bridge the gap between business needs and technical solutions. Analyze business processes, gather detailed requirements, and provide data-backed recommendations to improve efficiency. You will work with stakeholders across the company to ensure that our technical projects are aligned with business objectives.",
        "As a Business Analyst, you will translate complex business problems into clear technical requirements. You will create process maps, conduct cost-benefit analyses, and work with development teams to ensure successful project delivery. Strong analytical skills and the ability to communicate with both technical and non-technical audiences are key.",
        "Help us optimize our operations through data-driven analysis. You will identify areas for process improvement, develop business cases for new initiatives, and measure the impact of our technical solutions. This role requires a deep understanding of our business domain and the ability to use data to drive strategic decisions."
    ],
    "Cybersecurity Analyst": [
        "Protect the organization's digital assets from internal and external threats. Monitor for security breaches, conduct vulnerability assessments using industry-standard tools, and implement robust security protocols. You will be responsible for incident response and ensuring that our systems comply with security standards and regulations.",
        "Join our security team to harden our applications and infrastructure against attacks. You will perform penetration testing, manage identity and access control systems, and conduct security awareness training for employees. This role involves staying ahead of the latest threat landscape and proactively implementing defense-in-depth strategies.",
        "Ensure the integrity and confidentiality of our data across all platforms. You will design and implement security architectures, manage SIEM systems for real-time monitoring, and oversee our security compliance programs. This role requires a deep understanding of network security, encryption, and modern security operations."
    ],
    "Android Developer": [
        "Develop robust Android applications using Kotlin and modern Jetpack components. Focus on performance, memory management, and implementing Material Design principles to create a premium user experience. You will be responsible for the entire development lifecycle, from UI implementation to integrating with backend APIs.",
        "We are seeking an Android enthusiast to build high-performance mobile apps. You will use the latest Android SDK features, implement reactive programming patterns with Coroutines and Flow, and ensure our apps are responsive and stable. Experience with modular architecture and automated testing on Android is a plus.",
        "Join our mobile team to build engaging Android products that reach millions of users. You will work on feature-rich apps, optimize app startup times and battery usage, and ensure compatibility across a wide range of devices and OS versions. This role involves collaborating with product and design teams to deliver polished, user-centric features."
    ]
}

SKILLS_MAP = {
    "Senior Frontend Developer": ["React", "TypeScript", "Next.js", "Tailwind CSS", "Redux", "Web Performance"],
    "Backend Engineer": ["Node.js", "Python", "PostgreSQL", "Redis", "Microservices", "gRPC"],
    "Backend devop Engineer": ["Python", "Go", "Docker", "Kubernetes", "AWS", "Terraform"],
    "DevOps Engineer": ["AWS", "Docker", "Kubernetes", "Terraform", "Jenkins", "Monitoring"],
    "Full Stack Developer": ["React", "Node.js", "MongoDB", "Express.js", "GraphQL", "AWS"],
    "Mobile App Developer": ["React Native", "Flutter", "Firebase", "Mobile UI Design", "App Store Optimization"],
    "Data Scientist": ["Python", "R", "SQL", "Pandas", "Scikit-Learn", "Data Visualization"],
    "Machine Learning Engineer": ["PyTorch", "TensorFlow", "NLP", "Computer Vision", "MLOps", "Model Deployment"],
    "iOS Developer": ["Swift", "SwiftUI", "Objective-C", "Core Data", "XCode", "iOS SDK"],
    "Software Engineer": ["Java", "C++", "Spring Boot", "SQL", "Design Patterns", "Unit Testing"],
    "QA Engineer": ["Selenium", "Cypress", "Jest", "Manual Testing", "API Testing", "Load Testing"],
    "UI/UX Designer": ["Figma", "Adobe XD", "User Research", "Prototyping", "Wireframing", "Visual Design"],
    "Product Manager": ["Agile", "Product Roadmap", "User Stories", "Market Research", "Data Analytics"],
    "Cloud Architect": ["AWS", "Azure", "Cloud Security", "Serverless", "Infrastructure as Code"],
    "Business Analyst": ["SQL", "Tableau", "Excel", "Requirement Gathering", "Process Improvement"],
    "Cybersecurity Analyst": ["Network Security", "Penetration Testing", "SIEM", "Incident Response", "Compliance"],
    "Android Developer": ["Kotlin", "Java", "Jetpack Compose", "Android SDK", "Retrofit", "Coroutines"]
}

def enrich_jobs():
    input_file = 'data/jobs.csv'
    output_file = 'data/jobs_enriched.csv'
    
    # 1. Read and Enrich Data
    enriched_rows = []
    with open(input_file, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for i, row in enumerate(reader):
            title = row['title']
            variations = ENRICHMENT_VARIATIONS.get(title, ["Exciting opportunity for a " + title + " to join our growing team. We value innovation and excellence."])
            skills = SKILLS_MAP.get(title, ["General Tech", "Problem Solving"])
            
            # Use index to cycle through variations and pick unique ones per job
            desc = variations[i % len(variations)]
            # Add a small random variation to make it truly unique
            suffix = random.choice([
                " Join us to make a real impact.",
                " We offer competitive benefits and a remote-friendly culture.",
                " Be part of a diverse team pushing technological boundaries.",
                " Experience with agile methodologies is preferred for this role.",
                " Looking for a self-motivated individual who loves solving complex problems."
            ])
            
            row['description'] = desc + suffix
            row['skills'] = ", ".join(skills)
            
            if row['type'] not in ["Full-time", "Part-time", "Contract", "Internship", "Remote"]:
                 row['type'] = random.choice(["Full-time", "Remote", "Contract"])
            
            enriched_rows.append(row)

    # 2. Save Enriched CSV
    fieldnames = ['id', 'title', 'company', 'location', 'salary', 'type', 'description', 'posted', 'skills']
    with open(output_file, mode='w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for row in enriched_rows:
            writer.writerow({k: row.get(k, '') for k in fieldnames})
    
    print(f"Enriched data saved to {output_file}")

    # 3. Sync with Database
    db: Session = SessionLocal()
    print("Syncing with database...")
    try:
        # Ensure tables exist
        Base.metadata.create_all(bind=engine)
        
        # Clear existing jobs and skills
        db.execute(job_skill_table.delete())
        db.query(Job).delete()
        db.query(Skill).delete()
        db.commit()
        
        for row in enriched_rows:
            skills_list = [s.strip() for s in row['skills'].split(',')]
            job_in = JobCreate(
                title=row['title'],
                company=row['company'],
                location=row['location'],
                salary=row['salary'],
                type=row['type'],
                description=row['description'],
                required_skills=skills_list
            )
            create_job(db, job_in)
        
        db.commit()
        print(f"Successfully imported {len(enriched_rows)} enriched jobs into the database.")
        
        # Overwrite original CSV with enriched version
        os.replace(output_file, input_file)
        print(f"Original {input_file} updated.")

    except Exception as e:
        print(f"Error syncing with DB: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    enrich_jobs()
