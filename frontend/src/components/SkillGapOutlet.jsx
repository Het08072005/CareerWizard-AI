// src/components/SkillGapOutlet.jsx
import React, { useState } from "react";
import Roadmap from "./Roadmap";
import ThemeToggle from "./ThemeToggle";

/**
 * Master data for all roles (5 roles + interview)
 * Each role has 5 phases, every phase has topics (approx 8-10), projectIdeas, ytChannels.
 * This is intentionally verbose so you get fully populated roadmaps.
 */
const MASTER_ROADMAP = {
  fullStack: {
    key: "fullStack",
    title: "Full Stack Engineer",
    icon: "⧉",  
    salary: "$95k - $150k",
    demand: "Very High",
    path: "Master both frontend and backend development",
    color: "from-blue-400 to-cyan-400",
    requiredSkills: [
      "React/Vue.js",
      "Node.js/Express",
      "TypeScript",
      "PostgreSQL/MongoDB",
      "REST APIs",
      "Docker",
      "Git",
      "AWS/Cloud",
      "Testing",
      "System Design",
    ],
    phases: [
      {
        title: "Phase 1: Frontend Foundations",
        duration: "2-3 months",
        topics: [
          "HTML5 & Semantic Markup",
          "CSS3: Flexbox & Grid",
          "JavaScript ES6+ Fundamentals",
          "DOM Manipulation",
          "Responsive Design",
          "Accessibility Basics (a11y)",
          "Package Managers (npm/yarn)",
          "Browser DevTools & Debugging",
          "Version Control with Git",
          "Small UI Projects",
        ],
        proTips: [
          "Build 3-4 static websites to practice core concepts.",
          "Master CSS layouts before frameworks.",
          "Learn JS deeply, not just syntax.",
        ],
        projectIdeas: ["Portfolio website", "Static marketing site"],
        ytChannels: ["Web Dev Simplified", "freeCodeCamp"],
      },
      {
        title: "Phase 2: Modern Frontend",
        duration: "2-3 months",
        topics: [
          "React Components & Hooks",
          "React Router",
          "State Management (Redux/Zustand)",
          "TypeScript Basics",
          "Testing (Jest/RTL)",
          "CSS-in-JS / Tailwind",
          "Performance Optimization",
          "Component Design",
          "Form Handling",
          "API Integration",
        ],
        proTips: [
          "Build 2 complete React apps.",
          "Practice API integration with real APIs.",
        ],
        projectIdeas: ["E-commerce product listing", "Blog with Markdown"],
        ytChannels: ["Fireship", "Academind"],
      },
      {
        title: "Phase 3: Backend Development",
        duration: "2-3 months",
        topics: [
          "Node.js Core",
          "Express.js",
          "RESTful API Design",
          "Authentication (JWT)",
          "Databases SQL/NoSQL",
          "ORMs and Querying",
          "Testing APIs",
          "File upload & storage",
          "Background jobs",
          "Logging & Monitoring",
        ],
        proTips: ["Understand HTTP methods and codes.", "Design normalized schemas."],
        projectIdeas: ["User management API", "Blog platform (CRUD)"],
        ytChannels: ["Traversy Media", "The Net Ninja"],
      },
      {
        title: "Phase 4: Deployment & DevOps",
        duration: "1-2 months",
        topics: [
          "Docker Fundamentals",
          "CI/CD (GitHub Actions)",
          "Basic Cloud (AWS/GCP/Azure)",
          "Infrastructure as Code (Terraform)",
          "Secrets & Env management",
          "Observability basics",
          "Load balancing",
          "Scaling considerations",
          "Backup & Recovery",
          "Cost optimization",
        ],
        proTips: ["Containerize your backend.", "Deploy full-stack app to cloud."],
        projectIdeas: ["Deploy full-stack blog with Docker + GitHub Actions"],
        ytChannels: ["TechWorld with Nana", "Kunal Kushwaha"],
      },
      {
        title: "Phase 5: System Design & Scaling",
        duration: "Ongoing",
        topics: [
          "System Design Fundamentals",
          "Caching strategies",
          "Database sharding & replication",
          "Message queues",
          "Event-driven architectures",
          "Microservices vs Monolith",
          "API Gateways",
          "Monitoring & Alerting",
          "Rate limiting & throttling",
          "Design trade-offs",
        ],
        proTips: ["Practice drawing diagrams.", "Focus on trade-offs."],
        projectIdeas: ["Design a ride-sharing backend", "Refactor to microservices"],
        ytChannels: ["Gaurav Sen", "Tech Dummies"],
      },
    ],
  },

  aiMl: {
    key: "aiMl",
    title: "AI/ML Engineer",
    icon: "🧠",
    salary: "$110k - $180k",
    demand: "Extremely High",
    path: "Build intelligent machine learning systems",
    color: "from-purple-400 to-indigo-400",
    requiredSkills: [
      "Python",
      "TensorFlow/PyTorch",
      "Statistics",
      "Linear Algebra",
      "NLP/CV",
      "Data Wrangling",
    ],
    phases: [
      // condensed for brevity (but keep 5 phases with topics)
      {
        title: "Phase 1: Python & Math",
        duration: "1-2 months",
        topics: [
          "Python Advanced (OOP, modules)",
          "NumPy",
          "Pandas",
          "Linear Algebra basics",
          "Calculus essentials",
          "Probability & Statistics",
          "Data visualization",
          "Jupyter notebooks",
          "Code organization",
          "Unit testing for data code",
        ],
        proTips: ["Master NumPy and Pandas.", "Understand math behind GD."],
        projectIdeas: ["Simple regression models", "Data cleaning scripts"],
        ytChannels: ["3Blue1Brown", "StatQuest"],
      },
      {
        title: "Phase 2: Core ML",
        duration: "2-3 months",
        topics: [
          "Supervised learning",
          "Unsupervised learning",
          "Feature engineering",
          "Model evaluation",
          "Cross-validation",
          "Scikit-learn",
          "Ensembling",
          "Hyperparameter tuning",
          "Data pipelines",
          "Experiment tracking",
        ],
        proTips: ["Build models on Kaggle datasets."],
        projectIdeas: ["House price predictor", "Iris classifier"],
        ytChannels: ["Data School", "Krish Naik"],
      },
      {
        title: "Phase 3: Deep Learning",
        duration: "3-4 months",
        topics: [
          "Neural nets (ANN)",
          "CNNs for CV",
          "RNNs & transformers",
          "PyTorch/TensorFlow",
          "Transfer learning",
          "NLP basics",
          "Attention mechanisms",
          "Pretrained models",
          "Fine-tuning",
          "Model debugging",
        ],
        proTips: ["Implement a CNN from scratch."],
        projectIdeas: ["Image classifier", "Text sentiment analyzer"],
        ytChannels: ["Yann LeCun Lectures", "Sentdex"],
      },
      {
        title: "Phase 4: Production & MLOps",
        duration: "Ongoing",
        topics: [
          "Model serving",
          "Docker & K8s",
          "Cloud ML platforms",
          "Pipeline tools (Airflow)",
          "Monitoring & drift detection",
          "A/B testing for models",
          "Feature stores",
          "CI/CD for models",
          "Security & privacy",
          "Scaling models",
        ],
        proTips: ["Deploy via an API.", "Understand CI/CD for ML."],
        projectIdeas: ["Serve TF model via FastAPI"],
        ytChannels: ["Weights & Biases", "Chip Huyen"],
      },
      {
        title: "Phase 5: Research & Advanced Topics",
        duration: "Ongoing",
        topics: [
          "Advanced architectures",
          "Reinforcement learning",
          "Self-supervised learning",
          "Generative models",
          "Model interpretability",
          "Optimization tricks",
          "Large-scale training",
          "Distributed training",
          "New research reading",
          "Deploying research",
        ],
        proTips: ["Read papers actively."],
        projectIdeas: ["Implement a small transformer", "Experiment with RL"],
        ytChannels: ["Two Minute Papers", "Henry AI Labs"],
      },
    ],
  },

  genAi: {
    key: "genAi",
    title: "Gen AI Engineer",
    icon: "⚡",
    salary: "$120k - $200k",
    demand: "Skyrocketing",
    path: "Build next-gen AI applications with LLMs",
    color: "from-orange-400 to-amber-400",
    requiredSkills: ["LLMs", "Prompt engineering", "APIs", "Python", "Model ops"],
    phases: [
      {
        title: "Phase 1: LLM Fundamentals",
        duration: "1 month",
        topics: [
          "Prompt engineering basics",
          "Tokenization & embeddings",
          "API usage (OpenAI-like)",
          "Fine-tuning vs prompt tuning",
          "Text generation control",
          "Context window management",
          "Safety & guardrails",
          "Tooling basics",
          "Evaluation metrics",
          "Small demos",
        ],
        proTips: ["Start with small prompt experiments."],
        projectIdeas: ["Chatbot prototype"],
        ytChannels: ["OpenAI Tutorials", "Hugging Face"],
      },
      {
        title: "Phase 2: Tools & Embeddings",
        duration: "1-2 months",
        topics: [
          "Embeddings & semantic search",
          "Vector DBs basics",
          "Retrieval-Augmented Generation",
          "Evaluation & QA",
          "Plugins & tools",
          "Chunking docs",
          "Latency optimization",
          "Cost analysis",
          "Data privacy",
          "Monitoring",
        ],
        proTips: ["Use embeddings for search & retrieval."],
        projectIdeas: ["RAG knowledge assistant"],
        ytChannels: ["Hugging Face", "Two Minute Papers"],
      },
      {
        title: "Phase 3: Productionizing LLMs",
        duration: "2 months",
        topics: [
          "Serving LLMs",
          "Rate limiting",
          "Caching responses",
          "Multi-model orchestration",
          "Safety checks",
          "Prompt versioning",
          "Testing & monitoring",
          "Scalable infra",
          "Cost controls",
          "Metrics collection",
        ],
        proTips: ["Measure cost vs latency trade-offs."],
        projectIdeas: ["LLM-powered assistant"],
        ytChannels: ["The AI Epiphany", "DeepLearning.AI"],
      },
      {
        title: "Phase 4: Multimodal & Plugins",
        duration: "2 months",
        topics: [
          "Multimodal architecture",
          "Vision-language",
          "Tooling & connectors",
          "Realtime integrations",
          "Plugin architecture",
          "Security for plugins",
          "User experience",
          "Evaluation",
          "Deploy patterns",
          "Edge inference",
        ],
        proTips: ["Prototype quick plugin for a use-case."],
        projectIdeas: ["Image -> captioning assistant"],
        ytChannels: ["Hugging Face", "AI Coffee Break"],
      },
      {
        title: "Phase 5: Ethics & Governance",
        duration: "Ongoing",
        topics: [
          "Bias & fairness",
          "Privacy concerns",
          "Explainability",
          "Responsible deployment",
          "Compliance",
          "Human-in-the-loop",
          "Audit trails",
          "Model cards",
          "Continuous monitoring",
          "Incident response",
        ],
        proTips: ["Add human review where mistakes cost money."],
        projectIdeas: ["Create safety policy docs"],
        ytChannels: ["AI Ethics Lab", "Data & Society"],
      },
    ],
  },

  cloud: {
    key: "cloud",
    title: "Cloud Engineer",
    icon: "☁️",
    salary: "$105k - $170k",
    demand: "Very High",
    path: "Design and manage cloud infrastructure",
    color: "from-sky-400 to-blue-500",
    requiredSkills: [
      "Linux/Shell",
      "Networking",
      "AWS/Azure/GCP",
      "Containers",
      "Terraform",
      "CI/CD",
      "Monitoring",
    ],
    phases: [
      {
        title: "Phase 1: Linux & Networking",
        duration: "1 month",
        topics: [
          "Linux CLI",
          "Shell scripting",
          "OS basics",
          "Networking fundamentals",
          "TCP/IP & DNS",
          "SSH & keys",
          "Process management",
          "Permissions & users",
          "Package management",
          "Monitoring basics",
        ],
        proTips: ["Spend time in the CLI."],
        projectIdeas: ["Set up a LAMP VM"],
        ytChannels: ["Linux Academy", "NetworkChuck"],
      },
      {
        title: "Phase 2: Cloud Fundamentals",
        duration: "2-3 months",
        topics: [
          "Compute (EC2/VMs)",
          "Storage (S3/Blob)",
          "VPC & networking",
          "IAM & security",
          "Managed DBs",
          "Monitoring tools",
          "Cost management",
          "Load balancing",
          "Backup strategies",
          "Serverless basics",
        ],
        proTips: ["Get a basic cloud cert (e.g., AWS CCP)."],
        projectIdeas: ["Host static website on S3"],
        ytChannels: ["A Cloud Guru", "FreeCodeCamp"],
      },
      {
        title: "Phase 3: DevOps & Automation",
        duration: "2-3 months",
        topics: [
          "IaC (Terraform)",
          "Config mgmt (Ansible)",
          "CI/CD (Jenkins/GHA)",
          "Secrets management",
          "Immutable infra",
          "Deployment strategies",
          "Monitoring & alerting",
          "Testing infra",
          "Cost automation",
          "Policy as code",
        ],
        proTips: ["Automate Phase 2 projects."],
        projectIdeas: ["Deploy app with Jenkins pipeline"],
        ytChannels: ["KodeKloud", "DevOps Toolkit"],
      },
      {
        title: "Phase 4: Containers & Orchestration",
        duration: "2-3 months",
        topics: [
          "Docker fundamentals",
          "Kubernetes core",
          "Helm basics",
          "Service mesh intro",
          "Ingress & egress",
          "CI for containers",
          "Observability for K8s",
          "Managed K8s (EKS/GKE)",
          "Scaling patterns",
          "Security in K8s",
        ],
        proTips: ["Containerize your app."],
        projectIdeas: ["Deploy multi-tier app on K8s"],
        ytChannels: ["TechWorld with Nana", "Nana K8s"],
      },
      {
        title: "Phase 5: SRE & Reliability",
        duration: "Ongoing",
        topics: [
          "SLA/SLO/SLI",
          "Chaos engineering",
          "Disaster recovery",
          "Capacity planning",
          "Incident response",
          "Monitoring playbooks",
          "Postmortems",
          "Automated scaling",
          "Observability at scale",
          "Cost & performance trade-offs",
        ],
        proTips: ["Practice incident drills."],
        projectIdeas: ["Implement DR runbook"],
        ytChannels: ["Google Cloud", "The InfoQ Podcast"],
      },
    ],
  },

  dataSci: {
    key: "dataSci",
    title: "Data Scientist",
    icon: "📈",
    salary: "$100k - $165k",
    demand: "High",
    path: "Extract insights from data using statistics and ML",
    color: "from-green-300 to-green-400",
    requiredSkills: [
      "SQL",
      "Python (Pandas/NumPy)",
      "Statistics",
      "Visualization",
      "Machine Learning",
      "A/B Testing",
      "Storytelling",
    ],
    phases: [
      {
        title: "Phase 1: SQL & Data Wrangling",
        duration: "1 month",
        topics: [
          "Advanced SQL (joins, windows)",
          "Pandas fundamentals",
          "Data cleaning",
          "EDA & visualization",
          "Data types & conversions",
          "Merging datasets",
          "Missing data handling",
          "Time series basics",
          "Profiling datasets",
          "SQL optimization",
        ],
        proTips: ["Solve SQL challenges online."],
        projectIdeas: ["E-commerce analysis with SQL"],
        ytChannels: ["Alex The Analyst", "Data School"],
      },
      {
        title: "Phase 2: Statistics & Probability",
        duration: "2 months",
        topics: [
          "Descriptive statistics",
          "Inferential stats",
          "Hypothesis testing",
          "A/B testing design",
          "Regression analysis",
          "Confidence intervals",
          "Bayesian basics",
          "Sample size estimation",
          "Power analysis",
          "Experiment interpretation",
        ],
        proTips: ["Understand p-values & CIs."],
        projectIdeas: ["A/B test analysis demo"],
        ytChannels: ["StatQuest", "Khan Academy"],
      },
      {
        title: "Phase 3: Machine Learning",
        duration: "3 months",
        topics: [
          "Supervised algorithms",
          "Unsupervised learning",
          "Feature engineering",
          "Model tuning",
          "Ensembling (XGBoost)",
          "Time series modeling",
          "Model evaluation",
          "Cross-validation",
          "AutoML basics",
          "Model interpretability",
        ],
        proTips: ["Compete on Kaggle."],
        projectIdeas: ["Stock prediction", "Customer segmentation"],
        ytChannels: ["Krish Naik", "Gaurav Sen"],
      },
      {
        title: "Phase 4: Deployment & Storytelling",
        duration: "Ongoing",
        topics: [
          "API dev (Flask/FastAPI)",
          "Cloud deployment",
          "Dashboards (Tableau)",
          "Data storytelling",
          "Model monitoring",
          "Feature stores",
          "MLOps basics",
          "ETL pipelines",
          "Data contracts",
          "Communicating results",
        ],
        proTips: ["Create live dashboards."],
        projectIdeas: ["Prediction API & dashboard"],
        ytChannels: ["Luke Barousse", "Jeff Leek"],
      },
      {
        title: "Phase 5: Advanced Analysis",
        duration: "Ongoing",
        topics: [
          "Causal inference",
          "Advanced time series",
          "Recommender systems",
          "Graph analysis",
          "Anomaly detection",
          "Large-scale processing",
          "Streaming data",
          "Privacy-preserving analysis",
          "Model governance",
          "Business impact evaluation",
        ],
        proTips: ["Build end-to-end projects."],
        projectIdeas: ["Recommendation engine"],
        ytChannels: ["Data Science Dojo", "Sebastian Raschka"],
      },
    ],
  },

  interview: {
    key: "interview",
    title: "Interview Prep",
    icon: "👔",
    salary: "—",
    demand: "Critical",
    path: "Master technical & behavioral interviews",
    color: "from-pink-300 to-pink-400",
    requiredSkills: ["DSA", "System Design", "Behavioral", "Mock Interviews"],
    phases: [
      {
        title: "Section 1: Data Structures & Algorithms",
        duration: "4-8 weeks",
        topics: [
          "Arrays & Strings",
          "Linked Lists",
          "Stacks & Queues",
          "Trees & Graphs",
          "Binary Search",
          "Sorting & Searching",
          "Two pointers",
          "Hash tables",
          "Recursion",
          "Complexity analysis",
        ],
        proTips: ["Practice on LeetCode daily."],
        projectIdeas: ["Implement Dijkstra / HashTable"],
        ytChannels: ["NeetCode", "Fraz"],
      },
      {
        title: "Section 2: System Design",
        duration: "Ongoing",
        topics: [
          "Scalability principles",
          "Caching strategies",
          "Load balancers",
          "Storage & DB choices",
          "CAP theorem",
          "High availability",
          "Microservices design",
          "API design",
          "Design patterns",
          "Design interview practice",
        ],
        proTips: ["Clarify requirements first."],
        projectIdeas: ["Design URL shortener"],
        ytChannels: ["Gaurav Sen", "Success in Tech"],
      },
      {
        title: "Section 3: Behavioral & Portfolio",
        duration: "2 weeks",
        topics: [
          "STAR method",
          "Handling conflict questions",
          "Explaining projects",
          "Career story",
          "Weaknesses & strengths",
          "Negotiation basics",
          "Company research",
          "Ask good questions",
          "Follow-ups",
          "Mock interviews",
        ],
        proTips: ["Prepare 5 strong STAR stories."],
        projectIdeas: ["Polish portfolio pitch"],
        ytChannels: ["Big Interview", "Career Coaching"],
      },
      {
        title: "Section 4: Role-specific Prep",
        duration: "2-4 weeks",
        topics: [
          "Frontend specifics",
          "Backend specifics",
          "Data role specifics",
          "ML & research specifics",
          "Cloud & infra specifics",
          "Optimization problems",
          "Low-level systems",
          "Behavioral practicum",
          "Coding with time limits",
          "Whiteboard practice",
        ],
        proTips: ["Practice timed mocks."],
        projectIdeas: ["Timed problem sets"],
        ytChannels: ["Interviewing.io", "Pramp"],
      },
      {
        title: "Section 5: Final Polishing",
        duration: "1-2 weeks",
        topics: [
          "Mock interviews",
          "Resume polishing",
          "Offer evaluation",
          "Salary negotiation",
          "Final system design review",
          "Behavioral rehearsals",
          "Portfolio walkthrough",
          "Refine CS fundamentals",
          "Practice with mentors",
          "Mental/physical preparation",
        ],
        proTips: ["Simulate real interviews."],
        projectIdeas: ["Do back-to-back mock rounds"],
        ytChannels: ["Exponent", "Interview Cake"],
      },
    ],
  },
};

const CAREER_ORDER = [
  "fullStack",
  "aiMl",
  "genAi",
  "cloud",
  "dataSci",
  "interview",
];

const SkillGapOutlet = () => {
  const [view, setView] = useState("hub"); // hub or details
  const [currentRoleKey, setCurrentRoleKey] = useState("fullStack");

  const openRole = (key) => {
    setCurrentRoleKey(key);
    setView("details");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setView("hub");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50 ">
      <div className="max-w-7xl mx-auto p-6">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold">Populr Roadmaps</h1>
            <p className="text-sm text-gray-600 ">
              Choose your career path and get a complete step-by-step roadmap.
            </p>
          </div>
          <ThemeToggle />
        </header>

        {view === "hub" ? (
          <>
            {/* Cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {CAREER_ORDER.slice(0, 3).map((k) => {
                const r = MASTER_ROADMAP[k];
                return (
                  <div
                    key={r.key}
                    onClick={() => openRole(r.key)}
                    className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition cursor-pointer border-gray-100"
                  >
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${r.color} text-white mb-4`}>
                      <span className="text-xl">{r.icon}</span>
                    </div>
                    <h3 className="text-lg font-semibold">{r.title}</h3>
                    <p className="text-sm text-gray-600  mt-1">{r.path}</p>

                    <div className="mt-4 flex items-center justify-between text-sm text-gray-700 ">
                      <span className="flex items-center space-x-2">
                        <span>💰</span>
                        <span className="font-medium">{r.salary}</span>
                      </span>
                      <span className="flex items-center space-x-2">
                        <span>⭐</span>
                        <span>{r.demand}</span>
                      </span>
                    </div>

                    <div className="mt-4 text-sm text-indigo-600 dark:text-indigo-400 font-semibold">View Roadmap →</div>
                  </div>
                );
              })}
            </div>

            {/* second row + tip boxes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {CAREER_ORDER.slice(3, 5).map((k) => {
                const r = MASTER_ROADMAP[k];
                return (
                  <div
                    key={r.key}
                    onClick={() => openRole(r.key)}
                    className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition cursor-pointer border-gray-100"
                  >
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${r.color} text-white mb-4`}>
                      <span className="text-xl">{r.icon}</span>
                    </div>
                    <h3 className="text-lg font-semibold">{r.title}</h3>
                    <p className="text-sm text-gray-600  mt-1">{r.path}</p>

                    <div className="mt-4 flex items-center justify-between text-sm text-gray-700 ">
                      <span className="flex items-center space-x-2">
                        <span>💰</span>
                        <span className="font-medium">{r.salary}</span>
                      </span>
                      <span className="flex items-center space-x-2">
                        <span>⭐</span>
                        <span>{r.demand}</span>
                      </span>
                    </div>

                    <div className="mt-4 text-sm text-indigo-600 dark:text-indigo-400 font-semibold">View Roadmap →</div>
                  </div>
                );
              })}

              {/* Interview prep card */}
              <div
                onClick={() => openRole("interview")}
                className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition cursor-pointer border-gray-100"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-pink-300 to-pink-400 text-white mb-4">
                  <span className="text-xl">👔</span>
                </div>
                <h3 className="text-lg font-semibold">Interview Prep</h3>
                <p className="text-sm text-gray-600  mt-1">Master the technical and behavioral interviews</p>

                <ul className="mt-3 text-sm text-gray-700  space-y-1">
                  <li>Demo Questions & Solutions</li>
                  <li>Role-wise Preparation</li>
                  <li>Behavioral Q&A</li>
                </ul>

                <div className="mt-4 text-sm text-indigo-600 dark:text-indigo-400 font-semibold">Start Prep →</div>
              </div>
            </div>

            {/* Info Tip boxes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="rounded-xl p-6 border-gray-200 bg-gradient-to-r from-blue-100 to-blue-50">
                <h4 className="font-semibold text-blue-600">Structured Learning</h4>
                <p className="text-sm text-gray-600 mt-2">Follow proven roadmaps used by thousands of successful engineers.</p>
              </div>
              <div className="rounded-xl p-6 border-gray-200 bg-gradient-to-r from-purple-100 to-purple-50">
                <h4 className="font-semibold text-purple-600">Track Progress</h4>
                <p className="text-sm text-gray-600 mt-2">Mark phases as complete and watch your journey unfold.</p>
              </div>
              <div className="rounded-xl p-6 border-gray-200 bg-gradient-to-r from-green-100 to-green-50">
                <h4 className="font-semibold text-green-600">Expert Tips</h4>
                <p className="text-sm text-gray-600 mt-2">Learn from industry experts and avoid common pitfalls.</p>
              </div>
            </div>
          </>
        ) : (
          <Roadmap
            roleData={MASTER_ROADMAP[currentRoleKey]}
            onBack={goBack}
          />
        )}
      </div>
    </div>
  );
};

export default SkillGapOutlet;



