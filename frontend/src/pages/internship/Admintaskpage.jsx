import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useSearchParams } from 'react-router-dom';
import '../../css/internship.css';
import { DEFAULT_DAY1, DEFAULT_DAY5, SNIPPETS } from './admin_constants';
import '../../css/admintaskpage.css';
import { getDayContent, saveDayContent, deleteDayContent, uploadResource } from '../../api/adminInternshipApi';

const day1Md = DEFAULT_DAY1.replace(/\\n/g, '\n');
const day5Md = DEFAULT_DAY5.replace(/\\n/g, '\n');

const day1MdInt = `# Day 1 — Data Preprocessing Deep Dive\nWelcome to the Intermediate track. We assume you know the basics of Python and ML. Today, we focus heavily on Data Preprocessing and EDA.\n\n:::wyl\n- Handling Missing Data strategies\n- Advanced Pandas operations (groupby, pivot)\n- Seaborn visualization techniques\n:::\n\n:::concept\n### Handling Missing Data\nIn real-world datasets, data is rarely clean. We use strategies like Mean/Median imputation for numericals, and Mode/Forward-Fill for categoricals.\n:::\n\n:::code python\n### Imputation Example\nimport pandas as pd\nfrom sklearn.impute import SimpleImputer\n\ndf = pd.read_csv('data.csv')\nimputer = SimpleImputer(strategy='median')\ndf['Age'] = imputer.fit_transform(df[['Age']])\n:::\n\n:::quiz\nQ: What is the best strategy for missing categorical data?\nA: Mean imputation\nB: Mode imputation\nC: Dropping the column\nD: Median imputation\nCORRECT: B\nEXPLAIN: Categorical data doesn't have a numerical mean or median, so we use the most frequent value (Mode).\n:::`;

const taskMdAdv = `:::task-hero\n# Task 1 —\n## End-to-End Pipeline Architecture\nWelcome to the Advanced track! No more tutorials—just pure coding challenges. Today, build a complete data processing pipeline using Sklearn.\n- Estimated: 2–3 hours\n- Pass score: 80/100\n:::\n\n:::requirements\n### ADVANCED REQUIREMENTS\n- Create a custom Scikit-Learn Transformer for data cleaning.\n- Build a FeatureUnion pipeline.\n- Train a GradientBoostingRegressor.\n- Optimize using RandomizedSearchCV.\n:::\n\n:::code python\n### Starter Template\nfrom sklearn.pipeline import Pipeline\nfrom sklearn.compose import ColumnTransformer\n\n# TODO: Build your robust pipeline here\npipeline = Pipeline([\n    # Your steps\n])\n:::\n\n:::submit\n:::`;

const getGroupMd = (size) => {
  let tasks = `### Member 1 (Lead / ML Engineer)
- Setup repository and CI/CD pipelines
- Model training logic (LinearRegression, RandomForest)
- Hyperparameter tuning using GridSearchCV
- Push trained model to cloud

### Member 2 (Frontend / UI Engineer)
- Build responsive Streamlit UI
- Integrate model predictions via API
- Handle user input and validation
- Create visualizations in UI`;

  if (size >= 3) {
    tasks += `\n\n### Member 3 (Data Engineer)
- Develop data scraping/collection scripts
- Setup data cleaning and preprocessing pipeline
- Handle missing values and feature engineering
- Create database schema for logging inputs`;
  }
  if (size >= 4) {
    tasks += `\n\n### Member 4 (DevOps / QA)
- Containerize application with Docker
- Write integration and end-to-end tests
- Setup monitoring and logging for Streamlit
- Deploy to AWS/GCP`;
  }

  return `:::task-hero
# Task 1 —
## Large Scale Industry Project
Apply everything from Day 1–4. Ek complete ML project banao collaboratively.
- Estimated: 8–10 hours
- Due: 11:59 PM Today
- Max 2 attempts
- Pass score: 60/100
- Team Size: ${size} Members
:::

:::tip
### Pro Tip — Collaborative Development
Hamesha yaad rakhein, **Communication is key!** Modeling aur UI team ko APIs pehle decide karni chahiye:
- API payload structures pehle fix karein.
- Git flow use karein (features ke liye alag branch banayein).
- Daily 10 min stand-up call karein progress track karne ke liye.
:::

:::warning
### ⚠️ Version Control Warning
- **Never commit large datasets:** GitHub par 100MB se badi files allow nahi hoti. Hamesha apni \`.csv\` files ko \`.gitignore\` mein add karein.
- **Merge Conflicts:** Git conflicts resolve karte time hamesha peer review zarur le.
:::

## 👥 Task Allocation

:::group-tasks
${tasks}
:::

## 📦 Dataset

:::concept
### House Prices Dataset — Kaggle
**Source:** kaggle.com/c/house-prices | **Format:** CSV | **Size:** ~1,400 rows

Key columns:
- **GrLivArea** — Living area in sqft
- **SalePrice** — 🎯 Target variable (what you predict)
:::

## 🎥 Resources

:::video
url: https://www.youtube.com/watch?v=Y0L4-Zq5TGY
title: ML Project Collaboration Tutorial
meta: YouTube · 25 min
duration: 25:00
required: true
:::

## 📊 AI Scoring

:::scoring
SCORE: Correctness|25|25
SCORE: Code Quality|25|25
SCORE: Collaboration|25|25
SCORE: Documentation|25|25
PASS: Minimum Pass Score|60|100
:::

## ✅ Pre-Submit Checklist

:::checklist
- GitHub repo public hai (private nahi)
- README.md hai aur project architecture explain karta hai
- Sabhi members ne repository me commit kiya hai
- Live application working hai without errors
:::

:::submit
:::`;
};

// ─── GARAMOND FONT INJECTOR ───────────────────────────────────────────────────
const GARAMOND_STYLE = `
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');

.p-garamond { font-family: 'EB Garamond', Georgia, serif; }

/* Day hero */
.p-day-hero {
  padding: 36px 32px 28px;
  margin-bottom: 4px;
  border-bottom: 1px solid var(--border);
  background: linear-gradient(180deg, var(--cream2) 0%, transparent 100%);
  position: relative;
  overflow: hidden;
}
.p-day-hero::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--gm), var(--pm));
}
.p-day-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 18px;
}
.p-day-title {
  font-family: 'EB Garamond', Georgia, serif;
  font-size: 34px;
  font-weight: 500;
  line-height: 1.25;
  color: var(--text);
  letter-spacing: -0.02em;
  margin-bottom: 10px;
}
.p-day-desc {
  font-size: 15px;
  line-height: 1.7;
  color: var(--text2);
  max-width: 680px;
}

/* Section heading cards */
.p-card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  transition: box-shadow 0.2s;
}
.p-card:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.07); }

.p-h2 {
  font-family: 'EB Garamond', Georgia, serif;
  font-size: 26px;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.01em;
  padding-bottom: 14px;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 12px;
  line-height: 1.3;
}
.p-h2 i { font-size: 18px; flex-shrink: 0; opacity: 0.8; }

.p-h3 {
  font-family: 'EB Garamond', Georgia, serif;
  font-size: 22px;
  font-weight: 600;
  color: var(--text);
  margin: 18px 0 10px;
  letter-spacing: -0.01em;
}

.p-para {
  font-size: 14.5px;
  line-height: 1.75;
  color: var(--text2);
  margin-bottom: 10px;
}

/* ── WYL ── */
.p-wyl {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 12px;
  position: relative;
  overflow: hidden;
}
.p-wyl::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 3px;
  background: linear-gradient(180deg, var(--gm), var(--pm));
}
.p-wyl-lbl {
  font-family: 'EB Garamond', Georgia, serif;
  font-size: 17px;
  font-weight: 500;
  color: var(--text);
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: -0.01em;
}
.p-wyl-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 8px;
}
.p-wyl-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13.5px;
  color: var(--text2);
  padding: 10px 14px;
  background: var(--cream2);
  border-radius: 8px;
  border: 1px solid var(--border);
  line-height: 1.5;
  transition: all 0.15s;
}
.p-wyl-item:hover {
  border-color: var(--gm);
  background: var(--white);
  color: var(--text);
}
.p-wyl-item i {
  color: var(--gm);
  font-size: 13px;
  margin-top: 2px;
  flex-shrink: 0;
}

/* ── CONCEPT ── */
.p-concept {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 12px;
  margin-bottom: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}
.p-concept-h {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
  background: var(--cream2);
}
.p-c-icon {
  width: 32px; height: 32px;
  border-radius: 8px;
  background: #1e293b;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.p-c-icon i { color: #f8fafc; font-size: 15px; transition: transform 0.2s; }
.p-concept:hover .p-c-icon {
  background: #0f172a;
  transform: scale(1.05) translateY(-1px);
  box-shadow: 0 4px 10px rgba(0,0,0,0.15);
}
.p-concept:hover .p-c-icon i {
  transform: scale(1.1);
}
.p-concept-h span {
  font-family: 'EB Garamond', Georgia, serif;
  font-size: 24px;
  font-weight: 600;
  color: var(--text);
  letter-spacing: -0.01em;
}
.p-cc-body { padding: 20px; }
.p-cc-section { margin-bottom: 20px; }
.p-cc-section:last-child { margin-bottom: 0; }
.p-cc-section-hdr {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: 'EB Garamond', Georgia, serif;
  font-size: 26px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 1px dashed var(--border);
}
.p-cc-section-hdr i { color: var(--gm); font-size: 18px; }
.p-cc-para { font-size: 18px; color: #000; line-height: 1.75; margin-bottom: 14px; }
.p-cc-sub {
  display: flex; align-items: flex-start; gap: 8px;
  margin-bottom: 8px;
}
.p-cc-sub-ic {
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; margin-top: 5px;
}
.p-cc-sub-ic i { color: var(--gm); font-size: 13px; }
.p-cc-sub span { 
  font-family: 'EB Garamond', Georgia, serif; 
  font-size: 18px; 
  font-weight: 600; 
  color: var(--text); 
  line-height: 1.4; 
  letter-spacing: -0.01em; 
  text-decoration: underline;
  text-underline-offset: 4px;
  text-decoration-color: var(--text);
}
.p-cc-list { list-style: none; padding: 0; margin: 0 0 12px; }
.p-cc-li {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 5px 0;
}
.p-cc-li-dot i { color: #000; font-size: 14px; margin-top: 4px; }
.p-cc-li span { font-size: 16.5px; color: #000; line-height: 1.6; }
.p-cc-ol { padding-left: 0; margin: 0 0 8px; list-style: none; counter-reset: ol-counter; }
.p-cc-oli {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 5px 0;
}
.p-cc-oli-num {
  width: 24px; height: 24px;
  border-radius: 50%;
  background: #3b82f6;
  color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 700;
  flex-shrink: 0; margin-top: 2px;
}
.p-cc-oli span { font-size: 16.5px; color: #000; line-height: 1.6; }
.p-cc-code {
  background: #0d1117;
  border-radius: 10px;
  overflow: hidden;
  margin: 10px 0;
  border: 1px solid rgba(255,255,255,0.06);
}
.p-cc-code-hdr {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 14px;
  background: #161b22;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.p-cc-code-lang { font-size: 11px; font-family: monospace; color: #7ee787; font-weight: 600; letter-spacing: 0.05em; }
.p-cc-code-body pre { margin: 0; padding: 14px; font-size: 12.5px; font-family: 'DM Mono', Consolas, monospace; line-height: 1.65; color: #e6edf3; overflow-x: auto; }
.p-copy-btn {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  color: #8b949e;
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 5px;
  cursor: pointer;
  font-family: 'DM Mono', monospace;
  transition: all 0.15s;
  display: flex; align-items: center; gap: 4px;
}
.p-copy-btn:hover { background: rgba(255,255,255,0.12); color: #e6edf3; }

/* ── CALLOUTS ── */
.p-callout {
  display: flex; align-items: flex-start; gap: 14px;
  padding: 16px 20px;
  border-radius: 10px;
  margin-bottom: 12px;
  border: 1px solid;
}
.p-callout-tip {
  background: #f0fdf4;
  border-color: #bbf7d0;
}
.p-callout-warning {
  background: #fffbeb;
  border-color: #fde68a;
}
.p-callout-important {
  background: #eff6ff;
  border-color: #bfdbfe;
}
.p-callout-icon {
  font-size: 15px;
  margin-top: 2px;
  flex-shrink: 0;
}
.p-callout-tip .p-callout-icon { color: #16a34a; }
.p-callout-warning .p-callout-icon { color: #d97706; }
.p-callout-important .p-callout-icon { color: #2563eb; }
.p-callout-lbl {
  font-family: 'EB Garamond', Georgia, serif;
  font-size: 15px;
  font-weight: 600;
  display: block;
  margin-bottom: 6px;
}
.p-callout-tip .p-callout-lbl { color: #15803d; }
.p-callout-warning .p-callout-lbl { color: #b45309; }
.p-callout-important .p-callout-lbl { color: #1d4ed8; }
.p-callout-text { font-size: 13.5px; line-height: 1.7; }
.p-callout-tip .p-callout-text { color: #166534; }
.p-callout-warning .p-callout-text { color: #92400e; }
.p-callout-important .p-callout-text { color: #1e40af; }

/* ── CODE BLOCKS ── */
.p-code {
  background: #0d1117;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 12px;
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}
.p-code-hdr {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 16px;
  background: #161b22;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.p-code-dots { display: flex; gap: 6px; }
.p-code-dot { width: 12px; height: 12px; border-radius: 50%; }
.p-code-lang {
  font-size: 11px;
  font-family: 'DM Mono', monospace;
  color: #7ee787;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-right: 4px;
}
.p-code-title {
  font-size: 12px;
  color: #8b949e;
  font-family: 'DM Mono', monospace;
  flex: 1;
}
.p-code-body pre {
  margin: 0;
  padding: 18px;
  font-size: 13px;
  font-family: 'DM Mono', Consolas, monospace;
  line-height: 1.7;
  color: #e6edf3;
  overflow-x: auto;
}

/* ── KEY POINTS ── */
.p-keypoints {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}
.p-kp-title {
  font-family: 'EB Garamond', Georgia, serif;
  font-size: 17px;
  font-weight: 500;
  color: var(--text);
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: -0.01em;
}
.p-kp-title i { color: var(--am); font-size: 15px; }
.p-kp-list { display: flex; flex-direction: column; gap: 8px; }
.p-kp-item {
  display: flex; align-items: flex-start; gap: 12px;
  padding: 11px 14px;
  background: var(--cream2);
  border-radius: 8px;
  border: 1px solid var(--border);
  transition: all 0.15s;
}
.p-kp-item:hover { border-color: var(--am); background: #fffbeb; }
.p-kp-dot {
  width: 22px; height: 22px;
  border-radius: 50%;
  background: #fef3c7;
  border: 1.5px solid #fcd34d;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; margin-top: 1px;
}
.p-kp-dot i { color: #d97706; font-size: 10px; }

/* ── QUIZ ── */
.p-quiz {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 22px 24px;
  margin-bottom: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}
.p-quiz-badge {
  display: inline-flex; align-items: center;
  background: #ede9fe;
  color: #6d28d9;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
  letter-spacing: 0.03em;
  margin-bottom: 14px;
}
.p-quiz-q {
  font-family: 'EB Garamond', Georgia, serif;
  font-size: 18px;
  font-weight: 500;
  color: var(--text);
  line-height: 1.45;
  margin-bottom: 16px;
  letter-spacing: -0.01em;
}
.p-quiz-opts { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
.p-quiz-opt {
  display: flex; align-items: flex-start; gap: 12px;
  padding: 12px 16px;
  border: 1.5px solid var(--border);
  border-radius: 9px;
  cursor: pointer;
  transition: all 0.15s;
  font-size: 14px;
  color: var(--text2);
  background: var(--white);
}
.p-quiz-opt:hover { border-color: #a78bfa; background: #faf5ff; color: var(--text); }
.p-quiz-opt.selected { border-color: #7c3aed; background: #f5f3ff; color: #5b21b6; }
.p-opt-ltr {
  width: 26px; height: 26px;
  border-radius: 50%;
  background: var(--cream2);
  border: 1.5px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 700;
  color: var(--text2); flex-shrink: 0;
  font-family: 'DM Mono', monospace;
  transition: all 0.15s;
}
.p-quiz-opt.selected .p-opt-ltr { background: #ede9fe; border-color: #7c3aed; color: #5b21b6; }
.p-quiz-submit {
  background: #7c3aed;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex; align-items: center; gap: 8px;
  transition: all 0.15s;
  font-family: inherit;
}
.p-quiz-submit:hover { background: #6d28d9; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(109,40,217,0.3); }

/* ── VIDEO ── */
.p-video {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 12px;
  transition: all 0.15s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}
.p-video:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.1); transform: translateY(-1px); }
.p-video-thumb {
  position: relative;
  height: 180px;
  background: #1a1916;
  overflow: hidden;
}
.p-play {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 52px; height: 52px;
  background: rgba(0,0,0,0.6);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(4px);
  border: 2px solid rgba(255,255,255,0.3);
  transition: all 0.2s;
}
.p-play i { color: white; font-size: 18px; margin-left: 3px; }
.p-video:hover .p-play { background: #ef4444; border-color: #ef4444; transform: translate(-50%,-50%) scale(1.08); }
.p-video-dur {
  position: absolute;
  bottom: 8px; right: 10px;
  background: rgba(0,0,0,0.75);
  color: white;
  font-size: 11px; font-weight: 600;
  padding: 2px 7px;
  border-radius: 4px;
  font-family: 'DM Mono', monospace;
}
.p-video-hover {
  position: absolute;
  top: 10px; right: 10px;
  background: rgba(0,0,0,0.6);
  color: white;
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 20px;
  backdrop-filter: blur(4px);
  opacity: 0;
  transition: opacity 0.2s;
  display: flex; align-items: center; gap: 5px;
}
.p-video:hover .p-video-hover { opacity: 1; }
.p-video-info {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 16px;
  border-top: 1px solid var(--border);
}
.p-yt-ic {
  width: 36px; height: 36px;
  background: #fee2e2;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.p-yt-ic i { color: #ef4444; font-size: 16px; }
.p-video-title {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--text);
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.p-video-meta { font-size: 11.5px; color: var(--muted); margin-top: 2px; }
.p-video-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 10px; margin-bottom: 12px; }

/* ── TASK HERO ── */
.p-task-hero {
  background: #0a0a0f;
  border-radius: 14px;
  padding: 28px 28px 24px;
  margin-bottom: 16px;
  position: relative;
  overflow: hidden;
}
.p-task-hero::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, #f59e0b, #ef4444, #a78bfa);
}
.p-task-hero::after {
  content: '';
  position: absolute;
  top: -60px; right: -60px;
  width: 220px; height: 220px;
  background: radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%);
  pointer-events: none;
}
.p-task-top { position: relative; z-index: 1; }
.p-task-badge {
  display: inline-flex; align-items: center; gap: 5px;
  background: rgba(245,158,11,0.15);
  color: #fbbf24;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
  border: 1px solid rgba(245,158,11,0.25);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.p-task-title {
  font-family: 'EB Garamond', Georgia, serif;
  font-size: 30px;
  font-weight: 500;
  color: #f9fafb;
  line-height: 1.3;
  margin-top: 12px;
  margin-bottom: 8px;
  letter-spacing: -0.02em;
}
.p-task-title em { font-style: italic; color: #fbbf24; }
.p-task-desc { font-size: 14px; color: #9ca3af; line-height: 1.6; margin-bottom: 16px; }
.p-task-stats { display: flex; flex-wrap: wrap; gap: 8px; }
.p-task-stat {
  display: flex; align-items: center; gap: 6px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  color: #d1d5db;
}
.p-task-stat i { color: #fbbf24; font-size: 10px; }

/* ── REQUIREMENTS ── */
.p-card-label {
  font-family: 'EB Garamond', Georgia, serif;
  font-size: 16px;
  font-weight: 500;
  color: var(--text);
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: -0.01em;
}
.p-card-label i { font-size: 14px; opacity: 0.6; }
.p-diff-tabs { display: flex; gap: 6px; margin-bottom: 14px; }
.p-diff-tab {
  padding: 7px 16px;
  border-radius: 20px;
  font-size: 12.5px;
  font-weight: 500;
  cursor: pointer;
  border: 1.5px solid var(--border);
  color: var(--text2);
  background: var(--white);
  transition: all 0.15s;
}
.p-diff-tab:hover { border-color: var(--gm); color: var(--text); }
.p-diff-tab.active { background: var(--gm); color: white; border-color: var(--gm); }
.p-diff-tab.disabled { opacity: 0.4; cursor: not-allowed; }
.p-req-box {
  border-radius: 10px;
  padding: 16px 18px;
  border: 1px solid;
}
.p-req-beg { background: #f0fdf4; border-color: #bbf7d0; }
.p-req-int { background: #fffbeb; border-color: #fde68a; }
.p-req-adv { background: #fff1f2; border-color: #fecdd3; }
.p-req-title {
  font-family: 'EB Garamond', Georgia, serif;
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 10px;
}
.p-req-beg .p-req-title { color: #15803d; }
.p-req-int .p-req-title { color: #b45309; }
.p-req-adv .p-req-title { color: #be123c; }
.p-req-list { display: flex; flex-direction: column; gap: 6px; }
.p-req-item {
  font-size: 13.5px;
  padding: 8px 12px;
  border-radius: 7px;
  display: flex; align-items: flex-start; gap: 8px;
}
.p-req-item::before { content: '→'; font-weight: 700; flex-shrink: 0; margin-top: 0px; }
.p-req-beg .p-req-item { background: rgba(21,128,61,0.06); color: #15803d; }
.p-req-beg .p-req-item::before { color: #15803d; }
.p-req-int .p-req-item { background: rgba(180,83,9,0.06); color: #92400e; }
.p-req-int .p-req-item::before { color: #d97706; }
.p-req-adv .p-req-item { background: rgba(190,18,60,0.06); color: #9f1239; }
.p-req-adv .p-req-item::before { color: #e11d48; }

/* ── SCORING ── */
.p-score-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
}
.p-score-item {
  background: var(--cream2);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 16px 12px;
  text-align: center;
  transition: all 0.15s;
}
.p-score-item:hover { border-color: var(--gm); background: var(--white); box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
.p-score-item.pass {
  background: #f0fdf4;
  border-color: #86efac;
}
.p-score-val {
  font-family: 'EB Garamond', Georgia, serif;
  font-size: 28px;
  font-weight: 500;
  color: var(--text);
  line-height: 1;
  margin-bottom: 6px;
  letter-spacing: -0.02em;
}
.p-score-item.pass .p-score-val { color: #15803d; }
.p-score-max { font-size: 14px; color: var(--muted); font-weight: 400; }
.p-score-lbl { font-size: 11.5px; color: var(--text2); font-weight: 500; letter-spacing: 0.02em; }

/* ── CHECKLIST ── */
.p-checklist { display: flex; flex-direction: column; gap: 6px; }
.p-check-item {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 16px;
  border: 1.5px solid var(--border);
  border-radius: 9px;
  cursor: pointer;
  font-size: 13.5px;
  color: var(--text2);
  transition: all 0.15s;
  user-select: none;
}
.p-check-item:hover { border-color: #86efac; background: #f0fdf4; color: var(--text); }
.p-check-item.checked { border-color: #86efac; background: #f0fdf4; color: #15803d; }
.p-check-box {
  width: 22px; height: 22px;
  border-radius: 6px;
  border: 2px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s;
}
.p-check-box i { color: transparent; font-size: 11px; transition: all 0.15s; }
.p-check-item.checked .p-check-box { background: #16a34a; border-color: #16a34a; }
.p-check-item.checked .p-check-box i { color: white; }

/* ── SUBMIT ── */
.p-submit-box {
  background: var(--cream2);
  border-radius: 10px;
  padding: 18px;
  border: 1px solid var(--border);
}
.p-submit-lbl {
  font-family: 'EB Garamond', Georgia, serif;
  font-size: 15px;
  font-weight: 500;
  color: var(--text);
  margin-bottom: 12px;
  display: flex; align-items: center; gap: 7px;
  letter-spacing: -0.01em;
}
.p-input-row { display: flex; gap: 8px; align-items: center; }
.p-input {
  flex: 1;
  padding: 10px 14px;
  border: 1.5px solid var(--border);
  border-radius: 8px;
  font-size: 13px;
  color: var(--text);
  background: var(--white);
  outline: none;
  transition: border-color 0.15s;
  font-family: 'DM Mono', monospace;
}
.p-input:focus { border-color: var(--gm); box-shadow: 0 0 0 3px rgba(22,163,74,0.1); }

/* ── ANALOGY ── */
.p-analogy {
  display: flex; align-items: flex-start; gap: 16px;
  padding: 18px;
  background: var(--cream2);
  border: 1px solid var(--border);
  border-radius: 10px;
}
.p-analogy-emoji { font-size: 32px; flex-shrink: 0; line-height: 1; }
.p-analogy-title {
  font-family: 'EB Garamond', Georgia, serif;
  font-size: 15px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 5px;
}
.p-analogy-text { font-size: 13.5px; color: var(--text2); line-height: 1.65; }

/* ── IMAGE ── */
.p-img-wrap { margin-bottom: 12px; border-radius: 12px; overflow: hidden; border: 1px solid var(--border); }
.p-img-real { width: 100%; display: block; }
.p-img-placeholder {
  display: flex; align-items: center; justify-content: center; flex-direction: column;
  gap: 8px;
  height: 160px;
  background: var(--cream2);
  color: var(--muted);
  font-size: 13px;
}
.p-img-placeholder i { font-size: 28px; }
.p-img-caption {
  padding: 10px 16px;
  font-size: 12px;
  color: var(--muted);
  background: var(--cream2);
  border-top: 1px solid var(--border);
  text-align: center;
  font-style: italic;
}

/* ── GROUP TASKS ── */
.p-group-member-card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 10px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}

/* ── DIVIDERS ── */
.p-hr {
  border: none;
  border-top: 1px solid var(--border);
  margin: 20px 0;
}

/* ── INLINE FORMATTING ── */
.p-bold { font-family: 'EB Garamond', Georgia, serif; font-weight: 600; font-size: 1.05em; color: var(--text); letter-spacing: -0.01em; }
.p-em { font-style: italic; }
.p-inline-code {
  font-family: 'DM Mono', Consolas, monospace;
  font-size: 12.5px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  padding: 1px 6px;
  border-radius: 4px;
  color: #0f172a;
}

/* ── RESOURCES ── */
.p-resources-section {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 12px;
  margin: 16px 0 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}
.p-res-header {
  display: flex; align-items: flex-start; gap: 14px;
  padding: 18px 20px;
  border-bottom: 1px solid var(--border);
  background: var(--cream2);
}
.p-res-icon {
  width: 40px; height: 40px;
  background: #fef3c7;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.p-res-icon i { color: #d97706; font-size: 18px; }
.p-res-title {
  font-family: 'EB Garamond', Georgia, serif;
  font-size: 17px;
  font-weight: 500;
  color: var(--text);
  margin-bottom: 3px;
  letter-spacing: -0.01em;
}
.p-res-desc { font-size: 12.5px; color: var(--muted); line-height: 1.5; }
.p-res-files-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 10px;
  padding: 16px 20px 4px;
}
.p-res-file-card {
  background: var(--cream2);
  border: 1px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  transition: all 0.15s;
}
.p-res-file-card:hover { border-color: var(--gm); box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
.p-res-thumb {
  height: 100px;
  background: var(--cream2);
  display: flex; align-items: center; justify-content: center;
  border-bottom: 1px solid var(--border);
  overflow: hidden;
}
.p-res-thumb img { width: 100%; height: 100%; object-fit: cover; }
.p-res-thumb-file i { font-size: 32px; color: var(--muted); }
.p-res-file-pdf i { color: #ef4444; }
.p-res-file-info { padding: 10px 12px; }
.p-res-file-name { font-size: 12px; font-weight: 600; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.p-res-file-size { font-size: 11px; color: var(--muted); margin-top: 2px; }
.p-res-remove {
  position: absolute; top: 6px; right: 6px;
  width: 22px; height: 22px;
  background: rgba(0,0,0,0.5);
  border: none; border-radius: 50%;
  color: white; font-size: 10px;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  opacity: 0; transition: opacity 0.15s;
}
.p-res-file-card:hover .p-res-remove { opacity: 1; }
.p-res-upload-zone {
  margin: 10px 20px 16px;
  border: 2px dashed var(--border2);
  border-radius: 10px;
  padding: 28px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.15s;
  background: var(--cream2);
}
.p-res-upload-zone:hover, .p-res-upload-zone.drag-over {
  border-color: var(--gm);
  background: #f0fdf4;
}
.p-res-file-input { display: none; }
.p-res-upload-label { cursor: pointer; display: block; }
.p-res-upload-icon { font-size: 24px; color: var(--muted); margin-bottom: 8px; }
.p-res-upload-text { font-size: 13.5px; color: var(--text2); margin-bottom: 4px; }
.p-res-browse { color: var(--gm); font-weight: 600; text-decoration: underline; text-underline-offset: 2px; }
.p-res-upload-hint { font-size: 11.5px; color: var(--muted); }

/* ── DIFF CONTENT TOGGLE ── */
.p-diff-content { display: none; }
.p-diff-content.active { display: block; }
`;

export default function Admintaskpage() {
  const [setup, setSetup] = useState(null);

  const [days, setDays] = useState([]);
  const [activeLevel, setActiveLevel] = useState('beginner');
  const [groupSize, setGroupSize] = useState(2);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentDay = parseInt(searchParams.get('day')) || 1;
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const [setupDuration, setSetupDuration] = useState(15);
  const [setupDomain, setSetupDomain] = useState('aiml');
  const [setupType, setSetupType] = useState('internship');
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isDomainDropdownOpen, setIsDomainDropdownOpen] = useState(false);

  const [importDayNum, setImportDayNum] = useState(1);
  const [importType, setImportType] = useState('learn');
  const [importMd, setImportMd] = useState("");

  const [mdContent, setMdContent] = useState("");
  const [previewHtml, setPreviewHtml] = useState("");
  const [activeBtn, setActiveBtn] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [quizAnswers, setQuizAnswers] = useState({});
  const [resourceFiles, setResourceFiles] = useState([]);
  const [resourceDragOver, setResourceDragOver] = useState(false);
  const resourceInputRef = useRef(null);

  // Inject Garamond font styles into document head
  useEffect(() => {
    const styleId = 'garamond-preview-styles';
    let styleEl = document.getElementById(styleId);
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = GARAMOND_STYLE;
  });

  const loadFromDB = async () => {
    if (!setup) return;
    try {
      const { data } = await getDayContent(setup.domain, setup.track, setup.name.toLowerCase(), currentDay);

      if (data) {
        const updatedDays = [...days];
        if (data.beginner && data.beginner.length > 0) updatedDays[currentDay - 1].beginner.markdown = data.beginner[0].markdown;
        if (data.intermediate && data.intermediate.length > 0) updatedDays[currentDay - 1].intermediate.markdown = data.intermediate[0].markdown;
        if (data.advanced && data.advanced.length > 0) updatedDays[currentDay - 1].advanced.markdown = data.advanced[0].markdown;
        setDays(updatedDays);
        setMdContent(updatedDays[currentDay - 1][activeLevel].markdown);

        if (data.source) {
          setResourceFiles(data.source.map(s => ({
            name: s.name,
            url: s.url,
            size: s.size_kb * 1024,
            type: s.file_type === 'image' ? 'image/png' : s.file_type === 'pdf' ? 'application/pdf' : 'text/plain'
          })));
        } else {
          setResourceFiles([]);
        }
        triggerToast("Data loaded from database!");
      } else {
        setResourceFiles([]);
      }
    } catch (e) {
      console.error(e);
      setResourceFiles([]);
    }
  };

  const saveToDB = async () => {
    if (!setup) return;
    triggerToast("Saving to database...");
    try {
      const uploadedSources = [];
      const updatedResourceFiles = [];
      for (const f of resourceFiles) {
        let finalUrl = f.url;
        if (f.url && f.url.startsWith('blob:') && f.fileObj) {
          try {
            const result = await uploadResource(f.fileObj, currentDay, f.name);
            if (result.success) {
              finalUrl = result.url;
            } else {
              throw new Error("Upload failed, no success flag");
            }
          } catch (uploadErr) {
            console.error("Upload error:", uploadErr);
            const backendMsg = uploadErr.response?.data?.detail || uploadErr.message;
            throw new Error(`Upload failed: ${backendMsg}`);
          }
        }
        updatedResourceFiles.push({ ...f, url: finalUrl, fileObj: null });
        uploadedSources.push({
          file_type: f.type.startsWith('image/') ? 'image' : f.type === 'application/pdf' ? 'pdf' : 'link',
          name: f.name,
          url: finalUrl,
          size_kb: Math.round(f.size / 1024),
          uploaded_at: new Date().toISOString()
        });
      }
      setResourceFiles(updatedResourceFiles);

      await saveDayContent({
        domain: setup.domain,
        task_name: setup.track,
        type: setup.name.toLowerCase(),
        day: currentDay,
        beginner: [{ type: days[currentDay - 1].beginner.type, markdown: days[currentDay - 1].beginner.markdown }],
        intermediate: [{ type: days[currentDay - 1].intermediate.type, markdown: days[currentDay - 1].intermediate.markdown }],
        advanced: [{ type: days[currentDay - 1].advanced.type, markdown: days[currentDay - 1].advanced.markdown }],
        source: uploadedSources
      });

      triggerToast("Saved successfully to DB! ✓");
    } catch (e) {
      const errorMsg = e.response?.data?.detail || e.message || "Unknown error";
      triggerToast(`Failed to save: ${errorMsg}`);
      console.error(e);
    }
  };

  const deleteFromDB = async () => {
    if (!setup) return;
    try {
      await deleteDayContent(setup.domain, setup.track, setup.name.toLowerCase(), currentDay);
      triggerToast("Day content deleted from DB!");
    } catch (e) {
      console.error(e);
    }
  };

  const editorRef = useRef(null);
  const previewRef = useRef(null);

  const isSyncingLeft = useRef(false);
  const isSyncingRight = useRef(false);

  const handleEditorScroll = () => {
    if (isSyncingLeft.current) {
      isSyncingLeft.current = false;
      return;
    }
    isSyncingRight.current = true;

    if (!editorRef.current || !previewRef.current) return;
    const ta = editorRef.current;
    const prev = previewRef.current;

    const scrollMaxTa = ta.scrollHeight - ta.clientHeight;
    if (scrollMaxTa > 0) {
      const percentage = ta.scrollTop / scrollMaxTa;
      prev.scrollTop = percentage * (prev.scrollHeight - prev.clientHeight);
    }
  };

  const handlePreviewScroll = () => {
    if (isSyncingRight.current) {
      isSyncingRight.current = false;
      return;
    }
    isSyncingLeft.current = true;

    if (!editorRef.current || !previewRef.current) return;
    const ta = editorRef.current;
    const prev = previewRef.current;

    const scrollMaxPrev = prev.scrollHeight - prev.clientHeight;
    if (scrollMaxPrev > 0) {
      const percentage = prev.scrollTop / scrollMaxPrev;
      ta.scrollTop = percentage * (ta.scrollHeight - ta.clientHeight);
    }
  };

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2800);
  };

  const handleTypeChange = (newType) => {
    if (!days || days.length === 0) return;

    const updatedDays = [...days];
    const targetObj = updatedDays[currentDay - 1][activeLevel];

    if (targetObj.type !== newType) {
      targetObj.type = newType;

      let newMd = "";
      const defMd = `# Day ${currentDay} — __TYPE__\n\nAdd your content here using the toolbar above or paste markdown using the Import button.\n\n:::tip\n### Getting Started\nClick any toolbar button to insert a content block, or use Import Markdown to paste your prepared content.\n:::`;

      const lName = activeLevel === 'beginner' ? 'Beginner' : activeLevel === 'intermediate' ? 'Intermediate' : 'Advanced';

      if (newType === 'learn') {
        if (currentDay === 1) {
          if (activeLevel === 'intermediate') newMd = day1MdInt;
          else newMd = day1Md;
        } else {
          newMd = defMd.replace('__TYPE__', 'Learning Day');
        }
        newMd = newMd.replace(/^#\s+(.+)$/m, `# $1 [${lName} Track]`);
      } else if (newType === 'task') {
        if (activeLevel === 'advanced') {
          newMd = taskMdAdv;
        } else {
          newMd = day5Md;
        }
        newMd = newMd.replace(/^#\s+Task 1\s+—/m, `# Task ${currentDay} —`);
        newMd = newMd.replace(/^##\s+(.+)$/m, `## $1 [${lName} Track]`);
      } else if (newType === 'group') {
        newMd = getGroupMd(groupSize);
      }

      targetObj.markdown = newMd;
      setDays(updatedDays);
      setMdContent(newMd);
    }
  };

  const handleGroupSizeChange = (newSize) => {
    if (newSize < 2) newSize = 2;
    if (newSize > 4) newSize = 4;
    setGroupSize(newSize);

    if (days && days.length > 0) {
      const updatedDays = [...days];
      const targetObj = updatedDays[currentDay - 1][activeLevel];
      if (targetObj.type === 'group') {
        const newMd = getGroupMd(newSize);
        targetObj.markdown = newMd;
        setDays(updatedDays);
        setMdContent(newMd);
      }
    }
  };

  // ─── MARKDOWN RENDERER ────────────────────────────────────────────────────

  const escapeHtml = (text) => {
    return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };

  const inlineFormat = (text) => {
    let formatted = text
      .replace(/\*\*(.+?)\*\*/g, '<span class="p-bold">$1</span>')
      .replace(/\*(.+?)\*/g, '<em class="p-em">$1</em>')
      .replace(/`(.+?)`/g, '<code class="p-inline-code">$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:var(--bm);text-decoration:underline;text-underline-offset:2px;font-weight:600;"><i class="fa-solid fa-link" style="font-size:11px;margin-right:4px;color:var(--bm)"></i>$1</a>');
    return formatted;
  };

  const highlightPython = (code) => {
    let html = escapeHtml(code);
    html = html.replace(/(&quot;.*?&quot;|'.*?')/g, '<span style="color:#ce9178;">$1</span>');
    html = html.replace(/(#.*)/g, '<span style="color:#6a9955;">$1</span>');

    const keywords = ['def', 'class', 'return', 'import', 'from', 'if', 'else', 'elif', 'for', 'while', 'in', 'and', 'or', 'not', 'True', 'False', 'None', 'as', 'with', 'pass', 'break', 'continue', 'try', 'except', 'finally', 'lambda', 'yield'];
    const kwRegex = new RegExp(`\\b(${keywords.join('|')})\\b(?![^<]*>)`, 'g');
    html = html.replace(kwRegex, '<span style="color:#569cd6;">$1</span>');

    const builtins = ['print', 'len', 'range', 'str', 'int', 'float', 'list', 'dict', 'set', 'tuple', 'open', 'type', 'isinstance', 'sum', 'min', 'max'];
    const bltRegex = new RegExp(`\\b(${builtins.join('|')})\\b(?![^<]*>)`, 'g');
    html = html.replace(bltRegex, '<span style="color:#4ec9b0;">$1</span>');

    html = html.replace(/\b([a-zA-Z_]\w*)(?=\s*\()(?![^<]*>)/g, '<span style="color:#dcdcaa;">$1</span>');
    html = html.replace(/\b(\d+(\.\d+)?)\b(?![^<]*>)/g, '<span style="color:#b5cea8;">$1</span>');

    return html;
  };

  const renderBlock = (type, content) => {
    const lines = content.split('\n');

    const renderConceptContent = (contentLines) => {
      let html = '';
      let i = 0;
      let subColorIdx = 0;
      const subColors = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#f43f5e', '#0ea5e9'];

      while (i < contentLines.length) {
        const line = contentLines[i++];
        if (line === null || line === undefined) continue;
        const trimmed = line.trim();

        if (trimmed.match(/^####\s+/)) {
          const subtxt = trimmed.replace(/^####\s+/, '');
          const color = subColors[subColorIdx % subColors.length];
          subColorIdx++;
          html += `<div class="p-cc-sub"><div class="p-cc-sub-ic"><i class="fa-solid fa-chevron-right" style="color:${color} !important"></i></div><span style="text-decoration-color:${color} !important">${inlineFormat(subtxt)}</span></div>`;
          continue;
        }

        if (trimmed.startsWith('```')) {
          const lang = trimmed.replace(/^```/, '').trim() || 'python';
          let codeLines = [];
          while (i < contentLines.length) {
            const cl = contentLines[i];
            if (cl !== undefined && cl.trim() === '```') { i++; break; }
            codeLines.push(cl);
            i++;
          }
          const codeStr = codeLines.join('\n');
          html += `<div class="p-cc-code"><div class="p-cc-code-hdr"><span class="p-cc-code-lang">${lang}</span><button class="p-copy-btn" onclick="(function(b){var t=b.closest('.p-cc-code').querySelector('pre').innerText;navigator.clipboard.writeText(t).then(()=>{b.textContent='Copied!';setTimeout(()=>b.innerHTML='<i class=\\'fa-regular fa-copy\\'></i> Copy',1500);})})(this)"><i class="fa-regular fa-copy"></i> Copy</button></div><div class="p-cc-code-body"><pre>${highlightPython(codeStr)}</pre></div></div>`;
          continue;
        }

        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          let bullets = [trimmed.replace(/^[-*]\s+/, '')];
          while (i < contentLines.length) {
            const nb = contentLines[i] ? contentLines[i].trim() : '';
            if (nb.startsWith('- ') || nb.startsWith('* ')) {
              bullets.push(nb.replace(/^[-*]\s+/, ''));
              i++;
            } else break;
          }
          html += `<ul class="p-cc-list">${bullets.map(b => `<li class="p-cc-li"><span class="p-cc-li-dot"><i class="fa-solid fa-arrow-right-long"></i></span><span>${inlineFormat(b)}</span></li>`).join('')}</ul>`;
          continue;
        }

        if (trimmed.match(/^\d+\.\s+/)) {
          let items = [trimmed.replace(/^\d+\.\s+/, '')];
          while (i < contentLines.length) {
            const nb = contentLines[i] ? contentLines[i].trim() : '';
            if (nb.match(/^\d+\.\s+/)) {
              items.push(nb.replace(/^\d+\.\s+/, ''));
              i++;
            } else break;
          }
          html += `<ol class="p-cc-ol">${items.map((item, idx) => `<li class="p-cc-oli"><span class="p-cc-oli-num">${idx + 1}</span><span>${inlineFormat(item)}</span></li>`).join('')}</ol>`;
          continue;
        }

        if (!trimmed) continue;

        html += `<p class="p-cc-para">${inlineFormat(trimmed)}</p>`;
      }
      return html;
    };

    if (type === 'concept') {
      let mainTitle = '';
      let sections = [];
      let currentSection = null;
      let floatingLines = [];

      lines.forEach(line => {
        const tr = line.trim();
        if (!mainTitle && tr.match(/^###\s+/)) {
          mainTitle = tr.replace(/^###\s+/, '');
          return;
        }
        if (mainTitle && tr.match(/^#{2,3}\s+/)) {
          if (floatingLines.length > 0 && sections.length === 0) {
            sections.push({ title: '', lines: floatingLines });
          }
          currentSection = { title: tr.replace(/^#{2,3}\s+/, ''), lines: [] };
          sections.push(currentSection);
          floatingLines = [];
        } else if (mainTitle) {
          if (currentSection) {
            currentSection.lines.push(line);
          } else {
            floatingLines.push(line);
          }
        } else {
          floatingLines.push(line);
        }
      });

      if (floatingLines.length > 0 && sections.length === 0) {
        sections.push({ title: '', lines: floatingLines });
      }

      const sectionsHtml = sections.map(sec => {
        const bodyHtml = renderConceptContent(sec.lines);
        if (!bodyHtml && !sec.title) return '';
        return `<div class="p-cc-section">
          ${sec.title ? `<div class="p-cc-section-hdr"><i class="fa-solid fa-bookmark"></i><span>${inlineFormat(sec.title)}</span></div>` : ''}
          <div class="p-cc-section-body">${bodyHtml}</div>
        </div>`;
      }).join('');

      return `<div class="p-concept">
        ${mainTitle ? `<div class="p-concept-h"><div class="p-c-icon"><i class="fa-solid fa-layer-group"></i></div><span>${inlineFormat(mainTitle)}</span></div>` : ''}
        <div class="p-cc-body">${sectionsHtml || renderConceptContent(lines.slice(mainTitle ? 1 : 0))}</div>
      </div>`;
    }

    if (type === 'analogy') {
      let emoji = '💡', atitle = 'Analogy', abody = [];
      lines.forEach((l, li) => {
        if (li === 0 && l.trim().match(/^\S{1,4}$/)) emoji = l.trim();
        else if (l.match(/^###\s+/)) atitle = l.replace(/^###\s+/, '');
        else if (l.trim()) abody.push(l.trim());
      });
      return `<div class="p-card"><div class="p-analogy"><div class="p-analogy-emoji">${emoji}</div><div><div class="p-analogy-title">${atitle}</div><div class="p-analogy-text">${inlineFormat(abody.join(' '))}</div></div></div></div>`;
    }

    if (type === 'image') {
      let iurl = '', icap = '', ialt = '';
      lines.forEach(l => {
        const lm = l.trim();
        if (lm.startsWith('url:')) iurl = lm.replace('url:', '').trim();
        else if (lm.startsWith('caption:')) icap = lm.replace('caption:', '').trim();
        else if (lm.startsWith('alt:')) ialt = lm.replace('alt:', '').trim();
      });
      return `<div class="p-img-wrap">
        ${iurl ? `<img class="p-img-real" src="${escapeHtml(iurl)}" alt="${escapeHtml(ialt || icap)}" onerror="this.style.display='none';this.nextSibling.style.display='flex'">` : ''}
        <div class="p-img-placeholder" style="${iurl ? 'display:none' : ''}">
          <i class="fa-solid fa-image"></i>
          <span>${iurl ? iurl : 'Image block configured'}</span>
        </div>
        <div class="p-img-caption">${escapeHtml(icap || 'Add caption in markdown')}</div>
      </div>`;
    }

    if (type === 'video') {
      let vurl = '', vtitle = 'Video', vmeta = 'YouTube', vdur = '', vreq = true;
      lines.forEach(l => {
        const lm = l.trim();
        if (lm.startsWith('url:')) vurl = lm.replace('url:', '').trim();
        else if (lm.startsWith('title:')) vtitle = lm.replace('title:', '').trim();
        else if (lm.startsWith('meta:')) vmeta = lm.replace('meta:', '').trim();
        else if (lm.startsWith('duration:')) vdur = lm.replace('duration:', '').trim();
        else if (lm.startsWith('required:')) vreq = lm.replace('required:', '').trim() !== 'false';
      });
      const ytidMatch = vurl.match(/(?:youtu\.be\/|v=|embed\/)([a-zA-Z0-9_-]{11})/);
      const ytid_val = ytidMatch ? ytidMatch[1] : null;
      const safeUrl = escapeHtml(vurl);
      return `<div class="p-video" onclick="window.open('${safeUrl}','_blank')" style="cursor:pointer">
        <div class="p-video-thumb">
          ${ytid_val ? `<img src="https://img.youtube.com/vi/${ytid_val}/hqdefault.jpg" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.75">` : '<div style="position:absolute;inset:0;background:linear-gradient(135deg,#1a1916,#2d2b26)"></div>'}
          <div class="p-play"><i class="fa-solid fa-play"></i></div>
          ${vdur ? `<div class="p-video-dur">${vdur}</div>` : ''}
          <div class="p-video-hover"><i class="fa-solid fa-arrow-up-right-from-square"></i> Open on YouTube</div>
        </div>
        <div class="p-video-info">
          <div class="p-yt-ic"><i class="fa-brands fa-youtube"></i></div>
          <div style="flex:1;min-width:0"><div class="p-video-title">${escapeHtml(vtitle)}</div><div class="p-video-meta">${escapeHtml(vmeta)}</div></div>
          <span class="chip ${vreq ? 'chip-green' : 'chip-gray'}" style="font-size:10px;flex-shrink:0">${vreq ? 'Required' : 'Optional'}</span>
        </div>
      </div>`;
    }

    if (type.startsWith('code')) {
      const lang = type.replace('code', '').trim() || 'python';
      let ctitle = 'Code Example', clines = [];
      lines.forEach(l => {
        if (l.match(/^###\s+/)) ctitle = l.replace(/^###\s+/, '').trim();
        else clines.push(l);
      });
      const code = clines.join('\n').replace(/^\n/, '').replace(/\\n/g, '\n');
      return `<div class="p-code">
        <div class="p-code-hdr">
          <div class="p-code-dots">
            <div class="p-code-dot" style="background:#ff5f57"></div>
            <div class="p-code-dot" style="background:#febc2e"></div>
            <div class="p-code-dot" style="background:#28c840"></div>
          </div>
          <span class="p-code-lang">${lang}</span>
          <span class="p-code-title">${escapeHtml(ctitle)}</span>
          <button class="p-copy-btn"><i class="fa-regular fa-copy"></i> Copy</button>
        </div>
        <div class="p-code-body"><pre>${highlightPython(code)}</pre></div>
      </div>`;
    }

    if (type === 'tip' || type === 'warning' || type === 'important') {
      let clabel = type.toUpperCase(), cbodyLines = [];
      const icons = { tip: 'fa-lightbulb', warning: 'fa-triangle-exclamation', important: 'fa-circle-info' };
      lines.forEach(l => {
        if (l.match(/^###\s+/)) clabel = l.replace(/^###\s+/, '').trim();
        else cbodyLines.push(l);
      });
      const renderedBody = renderConceptContent(cbodyLines);
      return `<div class="p-callout p-callout-${type}">
        <i class="fa-solid ${icons[type]} p-callout-icon"></i>
        <div style="flex:1;min-width:0"><span class="p-callout-lbl">${clabel}</span><div class="p-callout-text">${renderedBody || cbodyLines.filter(l => l.trim()).map(l => inlineFormat(l.trim())).join('<br>')}</div></div>
      </div>`;
    }

    if (type === 'keypoints') {
      let kptitle = 'Key Takeaways', kpptsHtml = '';
      lines.forEach(l => {
        if (l.match(/^###\s+/)) kptitle = l.replace(/^###\s+/, '').trim();
        else if (l.trim().startsWith('-')) {
          kpptsHtml += `<div class="p-kp-item"><div class="p-kp-dot"><i class="fa-solid fa-check"></i></div><div style="flex:1;font-size:13.5px;color:var(--text2);line-height:1.6">${inlineFormat(l.trim().replace(/^-\s*/, ''))}</div></div>`;
        } else if (l.trim()) {
          kpptsHtml += `<div class="p-para" style="margin-bottom:6px">${inlineFormat(l.trim())}</div>`;
        }
      });
      return `<div class="p-keypoints"><div class="p-kp-title"><i class="fa-solid fa-key"></i>${kptitle}</div><div class="p-kp-list">${kpptsHtml}</div></div>`;
    }

    if (type === 'quiz') {
      let question = '', opts = { A: '', B: '', C: '', D: '' }, correct = 'A', explain = '';
      lines.forEach(l => {
        const lm = l.trim();
        if (lm.startsWith('Q:')) question = lm.replace('Q:', '').trim();
        else if (lm.startsWith('A:')) opts.A = lm.replace('A:', '').trim();
        else if (lm.startsWith('B:')) opts.B = lm.replace('B:', '').trim();
        else if (lm.startsWith('C:')) opts.C = lm.replace('C:', '').trim();
        else if (lm.startsWith('D:')) opts.D = lm.replace('D:', '').trim();
        else if (lm.startsWith('CORRECT:')) correct = lm.replace('CORRECT:', '').trim();
        else if (lm.startsWith('EXPLAIN:')) explain = lm.replace('EXPLAIN:', '').trim();
      });
      const optsHtml = ['A', 'B', 'C', 'D'].filter(l => opts[l]).map(l => {
        return `<div class="p-quiz-opt" onclick="const p=this.parentElement; Array.from(p.children).forEach(c=>c.classList.remove('selected')); this.classList.add('selected');">
          <div class="p-opt-ltr">${l}</div>
          <div>${escapeHtml(opts[l])}</div>
        </div>`;
      }).join('');
      return `<div class="p-quiz">
        <div class="p-quiz-badge"><i class="fa-solid fa-brain" style="margin-right:6px;font-size:11px"></i>Mini Quiz</div>
        <div class="p-quiz-q">${escapeHtml(question)}</div>
        <div class="p-quiz-opts">${optsHtml}</div>
        <button class="p-quiz-submit"><i class="fa-solid fa-paper-plane"></i>Submit Answer</button>
      </div>`;
    }

    if (type === 'task-hero') {
      let tprefix = 'Task —', ttitle = 'Project Challenge', tdesc = '', tstats = [];
      lines.forEach(l => {
        const lm = l.trim();
        if (lm.match(/^#\s+/)) tprefix = lm.replace(/^#\s+/, '');
        else if (lm.match(/^##\s+/)) ttitle = lm.replace(/^##\s+/, '');
        else if (lm.startsWith('- ')) tstats.push(lm.replace(/^-\s*/, ''));
        else if (lm && !lm.match(/^#/)) tdesc = lm;
      });
      const statsHtml = tstats.map(s => `<div class="p-task-stat"><i class="fa-solid fa-circle-dot"></i>${escapeHtml(s)}</div>`).join('');
      let levelChip = '';
      if (activeLevel === 'beginner') levelChip = '<span style="display:inline-flex;align-items:center;gap:5px;font-size:10px;background:rgba(21,128,61,0.15);color:#4ade80;border:1px solid rgba(74,222,128,0.2);padding:3px 10px;border-radius:20px;font-weight:600;letter-spacing:0.04em;">🟢 Beginner</span>';
      else if (activeLevel === 'intermediate') levelChip = '<span style="display:inline-flex;align-items:center;gap:5px;font-size:10px;background:rgba(245,158,11,0.15);color:#fbbf24;border:1px solid rgba(251,191,36,0.2);padding:3px 10px;border-radius:20px;font-weight:600;letter-spacing:0.04em;">🟡 Intermediate</span>';
      else if (activeLevel === 'advanced') levelChip = '<span style="display:inline-flex;align-items:center;gap:5px;font-size:10px;background:rgba(239,68,68,0.15);color:#f87171;border:1px solid rgba(248,113,113,0.2);padding:3px 10px;border-radius:20px;font-weight:600;letter-spacing:0.04em;">🔴 Advanced</span>';

      return `<div class="p-task-hero">
        <div class="p-task-top">
          <div style="display:flex;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:16px">
            <div class="p-task-badge"><i class="fa-solid fa-bolt" style="font-size:9px"></i>Task Day · Day ${currentDay}</div>
            ${levelChip}
          </div>
          <div class="p-task-title"><span style="color:#6b7280">${escapeHtml(tprefix)} </span><em>${escapeHtml(ttitle)}</em></div>
          ${tdesc ? `<div class="p-task-desc">${escapeHtml(tdesc)}</div>` : ''}
          ${statsHtml ? `<div class="p-task-stats">${statsHtml}</div>` : ''}
        </div>
      </div>`;
    }

    if (type === 'requirements') {
      let sections = { beg: [], int: [], adv: [] };
      let curSection = 'int';
      lines.forEach(l => {
        const lm = l.trim().toUpperCase();
        if (lm.includes('BEGINNER')) { curSection = 'beg'; return; }
        if (lm.includes('INTERMEDIATE')) { curSection = 'int'; return; }
        if (lm.includes('ADVANCED')) { curSection = 'adv'; return; }
        if (l.trim().startsWith('-')) sections[curSection].push(l.trim().replace(/^-\s*/, ''));
      });
      const makeReqBox = (cls, label, items) => {
        if (!items.length) return '';
        return `<div class="p-req-${cls} p-req-box"><div class="p-req-title">${label}</div>
          <div class="p-req-list">${items.map(it => `<div class="p-req-item">${escapeHtml(it)}</div>`).join('')}</div></div>`;
      };

      const clickHandler = (id) => `onclick="const p=this.parentElement; Array.from(p.children).forEach(c=>c.classList.remove('active')); this.classList.add('active'); const w=p.parentElement; Array.from(w.querySelectorAll('.p-diff-content')).forEach(c=>{c.style.display='none'; c.classList.remove('active')}); const t=w.querySelector('.p-diff-content.${id}'); if(t){t.style.display='block'; t.classList.add('active');}"`;

      return `<div class="p-card">
        <div class="p-card-label"><i class="fa-solid fa-sliders"></i>Difficulty Level</div>
        <div class="p-diff-tabs">
          <div class="p-diff-tab ${sections.beg.length ? '' : 'disabled'}" ${sections.beg.length ? clickHandler('beg') : ''}>🟢 Beginner</div>
          <div class="p-diff-tab active" ${sections.int.length ? clickHandler('int') : ''}>🟡 Intermediate</div>
          <div class="p-diff-tab ${sections.adv.length ? '' : 'disabled'}" ${sections.adv.length ? clickHandler('adv') : ''}>🔴 Advanced</div>
        </div>
        <div class="p-diff-content beg" style="display:none">${makeReqBox('beg', '🟢 Beginner Requirements', sections.beg)}</div>
        <div class="p-diff-content int active" style="display:block">${makeReqBox('int', '🟡 Intermediate Requirements', sections.int)}</div>
        <div class="p-diff-content adv" style="display:none">${makeReqBox('adv', '🔴 Advanced Requirements', sections.adv)}</div>
      </div>`;
    }

    if (type === 'group-tasks') {
      let members = [];
      let curMember = null;
      lines.forEach(l => {
        const lm = l.trim();
        if (lm.startsWith('###')) {
          if (curMember) members.push(curMember);
          curMember = { title: lm.replace('###', '').trim(), items: [] };
        } else if (lm.startsWith('-') && curMember) {
          curMember.items.push(lm.replace(/^-\s*/, ''));
        }
      });
      if (curMember) members.push(curMember);

      const memberColors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];
      const memberBg = ['#dbeafe', '#ede9fe', '#d1fae5', '#fef3c7'];
      const tasksHtml = members.map((m, i) => {
        const col = memberColors[i % memberColors.length];
        const bg = memberBg[i % memberBg.length];
        return `<div class="p-group-member-card">
          <div style="padding:12px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px;background:var(--cream2)">
            <div style="width:28px;height:28px;border-radius:50%;background:${bg};border:2px solid ${col}30;display:flex;align-items:center;justify-content:center;flex-shrink:0">
              <i class="fa-solid fa-user" style="color:${col};font-size:11px"></i>
            </div>
            <span style="font-family:'EB Garamond',Georgia,serif;font-size:15px;font-weight:500;color:var(--text)">${escapeHtml(m.title)}</span>
          </div>
          <div style="padding:14px 16px;display:flex;flex-direction:column;gap:7px">
            ${m.items.map(it => `<div style="display:flex;align-items:flex-start;gap:10px;font-size:13px;color:var(--text2);line-height:1.55"><i class="fa-solid fa-check" style="color:${col};margin-top:3px;font-size:11px;flex-shrink:0"></i><span>${escapeHtml(it)}</span></div>`).join('')}
          </div>
        </div>`;
      }).join('');

      return `<div style="padding:0">
        <div class="p-card-label" style="margin-bottom:12px"><i class="fa-solid fa-list-check"></i>Task Allocation</div>
        ${tasksHtml}
      </div>`;
    }

    if (type === 'checklist') {
      const items = lines.filter(l => l.trim().startsWith('-')).map(l => l.trim().replace(/^-\s*/, ''));
      const itemsHtml = items.map(item => `
        <div class="p-check-item" onclick="this.classList.toggle('checked')">
          <div class="p-check-box"><i class="fa-solid fa-check"></i></div>
          <span>${escapeHtml(item)}</span>
        </div>
      `).join('');
      return `<div class="p-card"><div class="p-card-label"><i class="fa-solid fa-list-check"></i>Pre-Submit Checklist</div><div class="p-checklist">${itemsHtml}</div></div>`;
    }

    if (type === 'scoring') {
      const scoreItems = [];
      lines.forEach(l => {
        const lm = l.trim();
        if (lm.startsWith('SCORE:')) {
          const parts = lm.replace('SCORE:', '').trim().split('|');
          if (parts.length >= 3) scoreItems.push({ label: parts[0].trim(), val: parts[1].trim(), max: parts[2].trim(), isPass: false });
        }
        if (lm.startsWith('PASS:')) {
          const parts = lm.replace('PASS:', '').trim().split('|');
          if (parts.length >= 3) scoreItems.push({ label: parts[0].trim(), val: parts[1].trim(), max: parts[2].trim(), isPass: true });
        }
      });
      const sgrid = scoreItems.map(s => `
        <div class="p-score-item${s.isPass ? ' pass' : ''}">
          <div class="p-score-val">${s.val}<span class="p-score-max">/${s.max}</span></div>
          <div class="p-score-lbl">${escapeHtml(s.label)}</div>
        </div>
      `).join('');
      return `<div class="p-card"><div class="p-card-label"><i class="fa-solid fa-robot"></i>AI Scoring</div><div class="p-score-grid">${sgrid}</div></div>`;
    }

    if (type === 'submit') {
      return `<div class="p-card">
        <div class="p-submit-box">
          <div class="p-submit-lbl"><i class="fa-brands fa-github"></i>Submit GitHub Repository</div>
          <div class="p-input-row">
            <input class="p-input" type="url" placeholder="https://github.com/username/repo-name">
            <button class="btn btn-primary btn-sm"><i class="fa-solid fa-paper-plane"></i> Submit</button>
          </div>
        </div>
      </div>`;
    }

    if (type === 'resources') {
      let rtitle = 'Resources & Learning Material';
      let rdesc = 'Upload and manage your learning resources — images, PDFs, documents, and more.';
      lines.forEach(l => {
        const lm = l.trim();
        if (lm.startsWith('title:')) rtitle = lm.replace('title:', '').trim();
        else if (lm.startsWith('desc:')) rdesc = lm.replace('desc:', '').trim();
      });
      return `<div class="p-resources-section" id="preview-resources-block" data-resources-block="true">
        <div class="p-res-header">
          <div class="p-res-icon"><i class="fa-solid fa-folder-open"></i></div>
          <div>
            <div class="p-res-title">${escapeHtml(rtitle)}</div>
            <div class="p-res-desc">${escapeHtml(rdesc)}</div>
          </div>
        </div>
        <div id="p-res-files-grid" class="p-res-files-grid"></div>
        <div class="p-res-upload-zone" id="p-res-drop-zone">
          <input type="file" id="p-res-file-input" class="p-res-file-input" multiple accept="*/*">
          <label for="p-res-file-input" class="p-res-upload-label">
            <div class="p-res-upload-icon"><i class="fa-solid fa-cloud-arrow-up"></i></div>
            <div class="p-res-upload-text">Drop files here or <span class="p-res-browse">browse</span></div>
            <div class="p-res-upload-hint">Images, PDFs, documents, videos — any file type supported</div>
          </label>
        </div>
      </div>`;
    }

    if (type === 'wyl') {
      const wylItems = lines.filter(l => l.trim().startsWith('-')).map(l => l.trim().replace(/^-\s*/, ''));
      const wylHtml = wylItems.map(item => `<div class="p-wyl-item"><i class="fa-solid fa-check"></i>${escapeHtml(item)}</div>`).join('');
      return `<div class="p-wyl"><div class="p-wyl-lbl"><i class="fa-solid fa-graduation-cap"></i>What You Will Learn Today</div><div class="p-wyl-grid">${wylHtml}</div></div>`;
    }

    return `<div class="p-card"><div class="p-para">${inlineFormat(content.trim())}</div></div>`;
  };

  const parseMarkdown = (md) => {
    let html = '';
    const lines = md.split('\n');
    let i = 0;

    const nextLine = () => { i++; };
    const collectBlock = (openTag) => {
      let content = [];
      nextLine();
      while (i < lines.length) {
        const l = lines[i].trimEnd();
        if (l.trim() === ':::') { nextLine(); break; }
        content.push(lines[i]);
        nextLine();
      }
      return content.join('\n');
    };

    while (i < lines.length) {
      const line = lines[i] ? lines[i].trimEnd() : '';

      if (line.match(/^:::video/)) {
        const videoCards = [];
        while (i < lines.length) {
          let tempI = i;
          while (tempI < lines.length && !lines[tempI].trim()) tempI++;
          if (tempI < lines.length && lines[tempI].trimEnd().match(/^:::video/)) {
            i = tempI;
            const bt = lines[i].replace(/^:::/, '').trim();
            const bc = collectBlock(bt);
            videoCards.push(renderBlock(bt, bc));
          } else {
            break;
          }
        }
        html += `<div class="p-video-grid">${videoCards.join('')}</div>`;
        continue;
      }

      if (line.match(/^:::/)) {
        const blockType = line.replace(/^:::/, '').trim();
        const blockContent = collectBlock(blockType);
        html += renderBlock(blockType, blockContent);
        continue;
      }

      if (line.match(/^#\s+/)) {
        const txt = line.replace(/^#\s+/, '');
        const dayTypeStr = (days[currentDay - 1] && days[currentDay - 1][activeLevel] && days[currentDay - 1][activeLevel].type === 'task')
          ? '<span class="chip chip-amber" style="font-size:10px">⚡ Task Day</span>'
          : '<span class="chip chip-gray" style="font-size:10px"><i class="fa-solid fa-book-open" style="margin-right:4px; color:var(--pm);"></i>Learning</span>';

        let levelChip = '';
        if (activeLevel === 'beginner') levelChip = '<span class="chip" style="font-size:10px;background:var(--cream2);color:var(--text);border:1px solid var(--border)">🟢 Beginner</span>';
        else if (activeLevel === 'intermediate') levelChip = '<span class="chip" style="font-size:10px;background:var(--cream2);color:var(--text);border:1px solid var(--border)">🟡 Intermediate</span>';
        else if (activeLevel === 'advanced') levelChip = '<span class="chip" style="font-size:10px;background:var(--cream2);color:var(--text);border:1px solid var(--border)">🔴 Advanced</span>';

        html += `<div class="p-day-hero"><div class="p-day-meta"><span class="chip chip-green" style="font-size:10px">Day ${currentDay}</span>${dayTypeStr}${levelChip}</div><div class="p-day-title">${inlineFormat(txt)}</div>`;
        nextLine();
        while (i < lines.length && lines[i] && !lines[i].match(/^#/) && !lines[i].match(/^:::/)) {
          const subline = lines[i].trimEnd();
          if (subline.startsWith('## ') || subline.startsWith('### ')) break;
          if (subline.trim()) html += `<div class="p-day-desc">${inlineFormat(subline)}</div>`;
          nextLine();
          if (!lines[i] || !lines[i].trim()) { nextLine(); break; }
        }
        html += '</div>';
        continue;
      }

      if (line.match(/^##\s+/)) {
        let txt2 = line.replace(/^##\s+/, '').trim();
        txt2 = txt2.replace(/^[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\u2194|\u2195|\u21a9|\u21aa|\u2934|\u2935|[\u2b05-\u2b07]|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\u24c2/g, '').trim();

        let icon = '<i class="fa-solid fa-bookmark" style="color:var(--gm)"></i>';
        const lowerTxt = txt2.toLowerCase();
        if (lowerTxt.includes('concept')) icon = '<i class="fa-solid fa-book-open" style="color:#3b82f6"></i>';
        else if (lowerTxt.includes('video') || lowerTxt.includes('resources')) icon = '<i class="fa-brands fa-youtube" style="color:#ef4444"></i>';
        else if (lowerTxt.includes('hands-on') || lowerTxt.includes('setup') || lowerTxt.includes('code')) icon = '<i class="fa-solid fa-laptop-code" style="color:#f59e0b"></i>';
        else if (lowerTxt.includes('level')) icon = '<i class="fa-solid fa-layer-group" style="color:#8b5cf6"></i>';
        else if (lowerTxt.includes('dataset')) icon = '<i class="fa-solid fa-database" style="color:#10b981"></i>';
        else if (lowerTxt.includes('scoring') || lowerTxt.includes('score')) icon = '<i class="fa-solid fa-chart-pie" style="color:#f43f5e"></i>';
        else if (lowerTxt.includes('checklist')) icon = '<i class="fa-solid fa-list-check" style="color:#10b981"></i>';

        html += `<div class="p-card"><div class="p-h2">${icon}${inlineFormat(txt2)}</div>`;
        nextLine();
        let inner = '';
        while (i < lines.length) {
          const nl = lines[i] ? lines[i].trimEnd() : '';
          if (nl.match(/^#/)) break;
          if (nl.match(/^:::video/)) {
            const videoCards = [];
            while (i < lines.length) {
              let tempI = i;
              while (tempI < lines.length && !lines[tempI].trim()) tempI++;
              if (tempI < lines.length && lines[tempI].trimEnd().match(/^:::video/)) {
                i = tempI;
                const vbt = lines[i].replace(/^:::/, '').trim();
                const vbc = collectBlock(vbt);
                videoCards.push(renderBlock(vbt, vbc));
              } else {
                break;
              }
            }
            inner += `<div class="p-video-grid">${videoCards.join('')}</div>`;
            continue;
          }
          if (nl.match(/^:::/)) {
            const bt = nl.replace(/^:::/, '').trim();
            const bc = collectBlock(bt);
            inner += renderBlock(bt, bc);
            continue;
          }
          if (nl.trim()) inner += `<div class="p-para">${inlineFormat(nl)}</div>`;
          nextLine();
        }
        html += inner + '</div>';
        continue;
      }

      if (line.match(/^###\s+/)) {
        const txt3 = line.replace(/^###\s+/, '');
        html += `<div class="p-h3">${inlineFormat(txt3)}</div>`;
        nextLine();
        continue;
      }

      if (line.trim() === '---') {
        html += '<div class="p-hr"></div>';
        nextLine();
        continue;
      }

      if (!line.trim()) { nextLine(); continue; }

      html += `<div class="p-para">${inlineFormat(line)}</div>`;
      nextLine();
    }
    return html;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setPreviewHtml(parseMarkdown(mdContent));
    }, 500);
    return () => clearTimeout(timer);
  }, [mdContent]);

  useEffect(() => {
    handleEditorScroll();
  }, [previewHtml]);

  useEffect(() => {
    if (setup && days[currentDay - 1] && days[currentDay - 1][activeLevel]) {
      setMdContent(days[currentDay - 1][activeLevel].markdown || '');
    }
    loadFromDB();
  }, [currentDay, activeLevel, setup]);

  const handleMdChange = (newVal) => {
    setMdContent(newVal || '');
    if (setup && days[currentDay - 1] && days[currentDay - 1][activeLevel]) {
      const updatedDays = [...days];
      updatedDays[currentDay - 1][activeLevel] = {
        ...updatedDays[currentDay - 1][activeLevel],
        markdown: newVal || ''
      };
      setDays(updatedDays);
    }
  };

  const selectDay = (num) => {
    setSearchParams({ day: num });
    if (days[num - 1] && days[num - 1][activeLevel]) {
      setMdContent(days[num - 1][activeLevel].markdown);
    } else {
      setMdContent('');
    }
  };

  const addDay = () => {
    const n = days.length + 1;
    const newDay = {
      num: n,
      beginner: { type: n % 5 === 0 ? 'task' : 'learn', markdown: '', done: false },
      intermediate: { type: n % 3 === 0 ? 'task' : 'learn', markdown: '', done: false },
      advanced: { type: 'task', markdown: '', done: false }
    };
    setDays([...days, newDay]);
    setSetup({ ...setup, totalDays: n });
    selectDay(n);
    triggerToast(`Day ${n} added!`);
  };

  const completeCurrentDay = () => {
    const updatedDays = [...days];
    updatedDays[currentDay - 1][activeLevel].done = !updatedDays[currentDay - 1][activeLevel].done;
    setDays(updatedDays);
    triggerToast(updatedDays[currentDay - 1][activeLevel].done ? `Day ${currentDay} marked complete! 🎉` : 'Marked incomplete');
  };

  const handleSnippetClick = (type) => {
    setActiveBtn(type);
    insertSnippet(type);
    setTimeout(() => setActiveBtn(null), 300);
  };

  const insertSnippet = (type) => {
    const snippetStr = SNIPPETS[type] || '';
    const snippet = snippetStr.replace(/\\n/g, '\n');
    if (!editorRef.current) return;

    const ta = editorRef.current;
    const safeContent = mdContent || '';

    const isFocused = document.activeElement === ta;
    let pos = (isFocused && ta.selectionEnd !== undefined) ? ta.selectionEnd : safeContent.length;

    const before = safeContent.substring(0, pos);
    const after = safeContent.substring(pos);
    const insertStr = (before.length && !before.endsWith('\n\n') ? '\n\n' : '') + snippet + '\n\n';
    const newMd = before + insertStr + after;
    handleMdChange(newMd);

    setTimeout(() => {
      if (editorRef.current) {
        const newPos = pos + insertStr.length;
        editorRef.current.focus();
        editorRef.current.setSelectionRange(newPos, newPos);
        if (newPos >= newMd.length - 10) {
          editorRef.current.scrollTop = editorRef.current.scrollHeight;
        }
        handleEditorScroll();
      }
    }, 10);
  };

  const handleImport = () => {
    if (!importMd.trim()) { triggerToast('Paste some markdown first!'); return; }
    if (importDayNum >= 1 && importDayNum <= days.length) {
      const updatedDays = [...days];
      updatedDays[importDayNum - 1][activeLevel].markdown = importMd;
      updatedDays[importDayNum - 1][activeLevel].type = importType;
      setDays(updatedDays);
      selectDay(importDayNum);
    } else {
      setMdContent(importMd);
    }
    setIsImportOpen(false);
    triggerToast(`Day ${importDayNum} content imported! ✓`);
  };

  // ─── SETUP SCREEN ──────────────────────────────────────────────────────────
  if (!setup) {
    return (
      <div className="setup cw-admin-wrap" style={{ minHeight: '100vh' }}>
        <div className="setup-card">
          <div className="setup-logo">
            <div className="setup-logo-icon"><i className="fa-solid fa-graduation-cap"></i></div>
            <div className="setup-logo-text">CareerWizard AI</div>
          </div>
          <div className="setup-title">Day Content Builder</div>
          <div className="setup-sub">Create professional internship day content using simple Markdown. Images, videos, quizzes — sab auto-render hoga.</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label className="setup-lbl" style={{ marginBottom: '4px' }}>Task Name</label>
              <input className="setup-input" id="setup-taskname" placeholder="e.g. AI/ML Bootcamp" defaultValue="AI/ML Bootcamp" style={{ marginBottom: 0 }} />
            </div>
            <div>
              <label className="setup-lbl" style={{ marginBottom: '4px' }}>Type</label>
              <div style={{ position: 'relative', zIndex: isTypeDropdownOpen ? 50 : 1 }}>
                <div style={{ position: 'absolute', left: '14px', top: '15px', pointerEvents: 'none', color: 'var(--text2)', fontSize: '14px', zIndex: 10 }}>
                  <i className="fa-solid fa-layer-group"></i>
                </div>
                <div
                  className="setup-input"
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', paddingLeft: '40px', marginBottom: 0, position: 'relative', zIndex: 5 }}
                  onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                >
                  <span style={{ flex: 1 }}>{setupType === 'internship' ? 'Internship' : 'Certificate Course'}</span>
                  <i className="fa-solid fa-chevron-down" style={{ color: 'var(--muted)', fontSize: '12px' }}></i>
                </div>
                {isTypeDropdownOpen && (
                  <>
                    <div style={{ position: 'fixed', inset: 0, zIndex: 10 }} onClick={() => setIsTypeDropdownOpen(false)}></div>
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', overflow: 'hidden', zIndex: 20 }}>
                      <div className="setup-dropdown-item" style={{ padding: '10px 14px', cursor: 'pointer', background: setupType === 'internship' ? 'var(--cream2)' : 'transparent', color: setupType === 'internship' ? 'var(--text)' : 'var(--text2)', fontWeight: setupType === 'internship' ? 600 : 400, borderBottom: '1px solid var(--border)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => { setSetupType('internship'); setIsTypeDropdownOpen(false); }}>
                        <i className="fa-solid fa-briefcase" style={{ color: setupType === 'internship' ? 'var(--gm)' : 'var(--muted)' }}></i> Internship
                      </div>
                      <div className="setup-dropdown-item" style={{ padding: '10px 14px', cursor: 'pointer', background: setupType === 'certificate' ? 'var(--cream2)' : 'transparent', color: setupType === 'certificate' ? 'var(--text)' : 'var(--text2)', fontWeight: setupType === 'certificate' ? 600 : 400, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => { setSetupType('certificate'); setIsTypeDropdownOpen(false); }}>
                        <i className="fa-solid fa-graduation-cap" style={{ color: setupType === 'certificate' ? 'var(--gm)' : 'var(--muted)' }}></i> Certificate Course
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '8px' }}>
            <div>
              <label className="setup-lbl" style={{ marginBottom: '4px' }}>Duration</label>
              <div className="setup-day-pills" style={{ marginBottom: 0 }}>
                {[15, 30, 45].map(d => (
                  <div key={d} className={`setup-day-pill ${setupDuration === d ? 'sel' : ''}`} onClick={() => setSetupDuration(d)} style={{ padding: '6px 12px', fontSize: '11.5px' }}>{d} Days</div>
                ))}
              </div>
            </div>
            <div>
              <label className="setup-lbl" style={{ marginBottom: '4px' }}>Domain</label>
              <div style={{ position: 'relative', zIndex: isDomainDropdownOpen ? 50 : 1 }}>
                <div style={{ position: 'absolute', left: '14px', top: '15px', pointerEvents: 'none', color: 'var(--text2)', fontSize: '14px', zIndex: 10 }}>
                  <i className="fa-solid fa-laptop-code"></i>
                </div>
                <div
                  className="setup-input"
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', paddingLeft: '40px', marginBottom: 0, position: 'relative', zIndex: 5 }}
                  onClick={() => setIsDomainDropdownOpen(!isDomainDropdownOpen)}
                >
                  <span style={{ flex: 1 }}>
                    {setupDomain === 'aiml' && 'AI / ML Engineering'}
                    {setupDomain === 'webdev' && 'Full Stack Web Dev'}
                    {setupDomain === 'datascience' && 'Data Science'}
                    {setupDomain === 'devops' && 'Cloud & DevOps'}
                  </span>
                  <i className="fa-solid fa-chevron-down" style={{ color: 'var(--muted)', fontSize: '12px' }}></i>
                </div>
                {isDomainDropdownOpen && (
                  <>
                    <div style={{ position: 'fixed', inset: 0, zIndex: 10 }} onClick={() => setIsDomainDropdownOpen(false)}></div>
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', overflow: 'hidden', zIndex: 20 }}>
                      {[
                        { id: 'aiml', label: 'AI / ML Engineering', icon: 'fa-robot' },
                        { id: 'webdev', label: 'Full Stack Web Dev', icon: 'fa-globe' },
                        { id: 'datascience', label: 'Data Science', icon: 'fa-chart-pie' },
                        { id: 'devops', label: 'Cloud & DevOps', icon: 'fa-cloud' }
                      ].map(dom => (
                        <div
                          key={dom.id}
                          className="setup-dropdown-item"
                          style={{ padding: '10px 14px', cursor: 'pointer', background: setupDomain === dom.id ? 'var(--cream2)' : 'transparent', color: setupDomain === dom.id ? 'var(--text)' : 'var(--text2)', fontWeight: setupDomain === dom.id ? 600 : 400, borderBottom: dom.id !== 'devops' ? '1px solid var(--border)' : 'none', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}
                          onClick={() => { setSetupDomain(dom.id); setIsDomainDropdownOpen(false); }}
                        >
                          <i className={`fa-solid ${dom.icon}`} style={{ color: setupDomain === dom.id ? 'var(--gm)' : 'var(--muted)' }}></i> {dom.label}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <button className="btn btn-primary" style={{ width: '100%', padding: '10px', marginTop: '14px', fontSize: '14px', fontFamily: "'Fraunces', serif", letterSpacing: '0.3px', fontWeight: '700', borderRadius: 'var(--radius)' }} onClick={() => {
            const taskName = document.getElementById("setup-taskname").value || "New Task";
            const type = setupType;
            const newDays = Array.from({ length: setupDuration }, (_, i) => {
              const dayNum = i + 1;
              const defMd = `# Day ${dayNum} — __TYPE__\n\nAdd your content here using the toolbar above or paste markdown using the Import button.\n\n:::tip\n### Getting Started\nClick any toolbar button to insert a content block, or use Import Markdown to paste your prepared content.\n:::`;

              const getMd = (n, isTask, levelName) => {
                let md = "";
                if (!isTask) {
                  if (n === 1) {
                    if (levelName === 'Beginner') md = day1Md;
                    else md = day1MdInt;
                  } else {
                    md = defMd.replace('__TYPE__', 'Learning Day');
                  }
                  md = md.replace(/^#\s+(.+)$/m, `# $1 [${levelName} Track]`);
                } else {
                  if (levelName === 'Advanced') {
                    md = taskMdAdv;
                    md = md.replace(/^#\s+Task 1\s+—/m, `# Task ${n} —`);
                    md = md.replace(/^##\s+(.+)$/m, `## $1 [${levelName} Track]`);
                  } else {
                    md = day5Md;
                    md = md.replace(/^#\s+Task 1\s+—/m, `# Task ${n} —`);
                    md = md.replace(/^##\s+(.+)$/m, `## $1 [${levelName} Track]`);
                  }
                }
                return md;
              };

              return {
                num: dayNum,
                beginner: { type: dayNum % 5 === 0 ? 'task' : 'learn', done: false, markdown: getMd(dayNum, dayNum % 5 === 0, 'Beginner') },
                intermediate: { type: dayNum % 3 === 0 ? 'task' : 'learn', done: false, markdown: getMd(dayNum, dayNum % 3 === 0, 'Intermediate') },
                advanced: { type: 'task', done: false, markdown: getMd(dayNum, true, 'Advanced') }
              };
            });
            setDays(newDays);
            setSetup({ name: type, track: taskName, totalDays: setupDuration, domain: setupDomain });
            setSearchParams({ day: 1 });
            setMdContent(newDays[0][activeLevel].markdown);
          }}>
            <i className="fa-solid fa-rocket"></i> Launch Content Builder
          </button>
        </div>
      </div>
    );
  }

  const curDayObj = days[currentDay - 1]?.[activeLevel];
  const completedCount = days.filter(d => d[activeLevel]?.done).length;
  const pct = Math.round((completedCount / days.length) * 100);

  return (
    <div className="cw-admin-wrap" style={{ height: '100%', width: '100%', display: 'flex', overflow: 'hidden' }}>
      <div className="shell" style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="main" style={{ flex: 1 }}>
          <div className="topbar">
            <div className="tb-left" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setSetup(null)} style={{ padding: '6px', color: 'var(--muted)' }} title="Back to Setup">
                <i className="fa-solid fa-arrow-left"></i>
              </button>
              <div className="bc">{setup?.name || 'Builder'} / <span>Day {currentDay} — {curDayObj?.type === 'task' ? 'Task Day 🔥' : 'Learning'}</span></div>
            </div>
            <div className="tb-right">
              <div style={{ display: 'flex', gap: '6px', marginRight: '12px', background: 'var(--cream2)', padding: '4px', borderRadius: '8px' }}>
                <button className={`btn btn-sm ${activeLevel === 'beginner' ? 'btn-primary' : 'btn-ghost'}`} style={{ padding: '4px 10px', fontSize: '12px' }} onClick={() => setActiveLevel('beginner')}>🟢 Beginner</button>
                <button className={`btn btn-sm ${activeLevel === 'intermediate' ? 'btn-primary' : 'btn-ghost'}`} style={{ padding: '4px 10px', fontSize: '12px' }} onClick={() => setActiveLevel('intermediate')}>🟡 Intermediate</button>
                <button className={`btn btn-sm ${activeLevel === 'advanced' ? 'btn-primary' : 'btn-ghost'}`} style={{ padding: '4px 10px', fontSize: '12px' }} onClick={() => setActiveLevel('advanced')}>🔴 Advanced</button>
              </div>

              <div className="chip chip-green"><div className="pdot" style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }}></div><span>Editing Day {currentDay}</span></div>
              <button className="icon-btn" onClick={() => setIsImportOpen(true)}><i className="fa-solid fa-file-import"></i></button>
              <button className="icon-btn" onClick={() => setIsHelpOpen(true)}><i className="fa-solid fa-circle-question"></i></button>
            </div>
          </div>

          {/* TWO PANE */}
          <div className="two-pane">
            {/* LEFT: EDITOR */}
            <div className="pane pane-left" style={{ display: isFullscreen ? 'none' : '' }}>
              <div className="pane-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ display: 'flex', background: 'var(--cream2)', borderRadius: '8px', padding: '3px' }}>
                    <button
                      onClick={() => handleTypeChange('learn')}
                      style={{ padding: '6px 14px', fontSize: '12px', border: 'none', background: curDayObj?.type === 'learn' ? '#fff' : 'transparent', color: curDayObj?.type === 'learn' ? 'var(--gm)' : 'var(--text2)', borderRadius: '6px', cursor: 'pointer', fontWeight: curDayObj?.type === 'learn' ? '600' : '500', boxShadow: curDayObj?.type === 'learn' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '6px' }}>
                      <i className="fa-solid fa-book-open" style={{ fontSize: '13px' }}></i>
                      <span>Learning</span>
                    </button>
                    <button
                      onClick={() => handleTypeChange('task')}
                      style={{ padding: '6px 14px', fontSize: '12px', border: 'none', background: curDayObj?.type === 'task' ? '#fff' : 'transparent', color: curDayObj?.type === 'task' ? 'var(--amber)' : 'var(--text2)', borderRadius: '6px', cursor: 'pointer', fontWeight: curDayObj?.type === 'task' ? '600' : '500', boxShadow: curDayObj?.type === 'task' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '6px' }}>
                      <i className="fa-solid fa-bolt" style={{ fontSize: '13px' }}></i>
                      <span>Task</span>
                    </button>
                    <div
                      onClick={() => handleTypeChange('group')}
                      style={{ padding: '6px 14px', fontSize: '12px', border: 'none', background: curDayObj?.type === 'group' ? '#fff' : 'transparent', color: curDayObj?.type === 'group' ? 'var(--pm)' : 'var(--text2)', borderRadius: '6px', cursor: 'pointer', fontWeight: curDayObj?.type === 'group' ? '600' : '500', boxShadow: curDayObj?.type === 'group' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '6px' }}>
                      <i className="fa-solid fa-users" style={{ fontSize: '13px' }}></i>
                      <span>Group</span>
                      {curDayObj?.type === 'group' && (
                        <input
                          type="number"
                          min="2" max="4"
                          value={groupSize}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => handleGroupSizeChange(parseInt(e.target.value) || 2)}
                          style={{ width: '28px', height: '20px', border: 'none', background: 'transparent', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: 'var(--pm)', outline: 'none', padding: '0', marginLeft: '2px' }}
                        />
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', background: 'var(--cream2)', borderRadius: '8px', padding: '3px' }}>
                    <button
                      onClick={() => setSetup({ ...setup, name: 'Internship' })}
                      style={{ padding: '6px 14px', fontSize: '12px', border: 'none', background: setup?.name === 'Internship' ? '#fff' : 'transparent', color: setup?.name === 'Internship' ? 'var(--gm)' : 'var(--text2)', borderRadius: '6px', cursor: 'pointer', fontWeight: setup?.name === 'Internship' ? '600' : '500', boxShadow: setup?.name === 'Internship' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '6px' }}>
                      <i className="fa-solid fa-briefcase" style={{ fontSize: '13px' }}></i>
                      <span>Internship</span>
                    </button>
                    <button
                      onClick={() => setSetup({ ...setup, name: 'Certificate' })}
                      style={{ padding: '6px 14px', fontSize: '12px', border: 'none', background: setup?.name === 'Certificate' ? '#fff' : 'transparent', color: setup?.name === 'Certificate' ? 'var(--pm)' : 'var(--text2)', borderRadius: '6px', cursor: 'pointer', fontWeight: setup?.name === 'Certificate' ? '600' : '500', boxShadow: setup?.name === 'Certificate' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '6px' }}>
                      <i className="fa-solid fa-certificate" style={{ fontSize: '13px' }}></i>
                      <span>Certificate</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="md-toolbar">
                <button className={`md-btn ${activeBtn === 'concept' ? 'md-active' : ''}`} onMouseDown={(e) => e.preventDefault()} onClick={() => handleSnippetClick('concept')}><i className="fa-solid fa-book-open"></i> Concept</button>
                <button className={`md-btn ${activeBtn === 'image' ? 'md-active' : ''}`} onMouseDown={(e) => e.preventDefault()} onClick={() => handleSnippetClick('image')}><i className="fa-solid fa-image"></i> Image</button>
                <button className={`md-btn ${activeBtn === 'video' ? 'md-active' : ''}`} onMouseDown={(e) => e.preventDefault()} onClick={() => handleSnippetClick('video')}><i className="fa-brands fa-youtube"></i> Video</button>
                <button className={`md-btn ${activeBtn === 'link' ? 'md-active' : ''}`} onMouseDown={(e) => e.preventDefault()} onClick={() => handleSnippetClick('link')}><i className="fa-solid fa-link"></i> Link</button>
                <div className="md-sep"></div>
                <button className={`md-btn ${activeBtn === 'code' ? 'md-active' : ''}`} onMouseDown={(e) => e.preventDefault()} onClick={() => handleSnippetClick('code')}><i className="fa-solid fa-code"></i> Code</button>
                <button className={`md-btn ${activeBtn === 'callout-tip' ? 'md-active' : ''}`} onMouseDown={(e) => e.preventDefault()} onClick={() => handleSnippetClick('callout-tip')}><i className="fa-solid fa-lightbulb"></i> Tip</button>
                <button className={`md-btn ${activeBtn === 'callout-warning' ? 'md-active' : ''}`} onMouseDown={(e) => e.preventDefault()} onClick={() => handleSnippetClick('callout-warning')}><i className="fa-solid fa-triangle-exclamation"></i> Warning</button>
                <div className="md-sep"></div>
                <button className={`md-btn ${activeBtn === 'keypoints' ? 'md-active' : ''}`} onMouseDown={(e) => e.preventDefault()} onClick={() => handleSnippetClick('keypoints')}><i className="fa-solid fa-key"></i> Key Points</button>
                <button className={`md-btn ${activeBtn === 'quiz' ? 'md-active' : ''}`} onMouseDown={(e) => e.preventDefault()} onClick={() => handleSnippetClick('quiz')}><i className="fa-solid fa-question"></i> Quiz</button>
                <div className="md-sep"></div>
                <button className={`md-btn ${activeBtn === 'task-hero' ? 'md-active' : ''}`} onMouseDown={(e) => e.preventDefault()} onClick={() => handleSnippetClick('task-hero')}><i className="fa-solid fa-bolt"></i> Task Hero</button>
                <button className={`md-btn ${activeBtn === 'requirements' ? 'md-active' : ''}`} onMouseDown={(e) => e.preventDefault()} onClick={() => handleSnippetClick('requirements')}><i className="fa-solid fa-list-check"></i> Requirements</button>
                <div className="md-sep"></div>
                <button className={`md-btn ${activeBtn === 'resources' ? 'md-active' : ''}`} onMouseDown={(e) => e.preventDefault()} onClick={() => handleSnippetClick('resources')}><i className="fa-solid fa-folder-open"></i> Resources</button>
              </div>

              <div className="pane-body">
                <textarea
                  className="md-textarea"
                  ref={editorRef}
                  value={mdContent}
                  onChange={(e) => handleMdChange(e.target.value)}
                  onScroll={handleEditorScroll}
                  placeholder="Type your day content here in CareerWizard Markdown...&#10;&#10;Click any toolbar button above to insert a snippet!"
                />
              </div>
            </div>

            {/* RIGHT: PREVIEW */}
            <div className={`pane pane-right ${isFullscreen ? 'fullscreen-mode' : ''}`} style={isFullscreen ? { gridColumn: '1 / -1', borderLeft: 'none' } : {}}>
              <div className="pane-header">
                <div>
                  <button className="btn btn-primary btn-sm" onClick={() => triggerToast('Preview updated successfully!')} style={{ padding: '8px 16px', fontSize: '13px', marginRight: '6px' }}>
                    <i className="fa-solid fa-play"></i> RENDER
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={deleteFromDB} style={{ padding: '8px 16px', fontSize: '13px', backgroundColor: '#ef4444' }}>
                    <i className="fa-solid fa-trash"></i> DELETE
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => setIsFullscreen(!isFullscreen)}>
                    <i className={`fa-solid ${isFullscreen ? 'fa-compress' : 'fa-expand'}`}></i> {isFullscreen ? 'Exit Full Screen' : 'Full Screen'}
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => { completeCurrentDay(); saveToDB(); }} style={curDayObj?.done ? { color: '#10b981', fontWeight: 600, background: '#ecfdf5' } : {}}>
                    {curDayObj?.done ? <><i className="fa-solid fa-check-circle"></i> Saved to DB ✓</> : <><i className="fa-solid fa-cloud-arrow-up"></i> Save to DB</>}
                  </button>
                </div>
              </div>

              <div className="pane-body">
                <div className="preview-wrap" ref={previewRef} style={{ overflowY: 'auto', height: '100%' }} onScroll={handlePreviewScroll}>
                  {!mdContent.trim() ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', textAlign: 'center', color: 'var(--muted)' }}>
                      <i className="fa-solid fa-eye-slash" style={{ fontSize: '36px', marginBottom: '14px', color: 'var(--muted2)' }}></i>
                      <div style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: '22px', fontWeight: 500, color: 'var(--text2)', marginBottom: '6px', letterSpacing: '-0.01em' }}>Preview appears here</div>
                      <div style={{ fontSize: '13px', lineHeight: 1.6, maxWidth: '300px', color: 'var(--muted)' }}>Write content in the editor and click <strong>Render Preview</strong> — or use the toolbar to insert blocks</div>
                    </div>
                  ) : (
                    <div className="preview-inner" dangerouslySetInnerHTML={{ __html: previewHtml }}></div>
                  )}

                  {/* ── RESOURCE SECTION ── */}
                  <div className="p-resources-section">
                    <div className="p-res-header">
                      <div className="p-res-icon"><i className="fa-solid fa-folder-open"></i></div>
                      <div>
                        <div className="p-res-title">Resources &amp; Learning Material</div>
                        <div className="p-res-desc">Upload learning materials — images, PDFs, documents, or any file.</div>
                      </div>
                    </div>

                    {resourceFiles.length > 0 && (
                      <div className="p-res-files-grid">
                        {resourceFiles.map((f, idx) => (
                          <div key={idx} className="p-res-file-card">
                            {f.type.startsWith('image/') ? (
                              <div className="p-res-thumb">
                                <img src={f.url} alt={f.name} />
                              </div>
                            ) : (
                              <div className={`p-res-thumb p-res-thumb-file ${f.type === 'application/pdf' ? 'p-res-file-pdf' : ''}`}>
                                <i className={`fa-solid ${f.type === 'application/pdf' ? 'fa-file-pdf' :
                                  f.type.includes('word') ? 'fa-file-word' :
                                    f.type.includes('sheet') || f.type.includes('excel') ? 'fa-file-excel' :
                                      f.type.includes('video') ? 'fa-file-video' :
                                        f.type.includes('audio') ? 'fa-file-audio' :
                                          f.type.includes('zip') || f.type.includes('rar') ? 'fa-file-zipper' :
                                            'fa-file'
                                  }`}></i>
                              </div>
                            )}
                            <div className="p-res-file-info">
                              <div className="p-res-file-name" title={f.name}>{f.name}</div>
                              <div className="p-res-file-size">{(f.size / 1024).toFixed(1)} KB</div>
                            </div>
                            <button className="p-res-remove" onClick={() => setResourceFiles(prev => prev.filter((_, i) => i !== idx))} title="Remove">
                              <i className="fa-solid fa-xmark"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div
                      className={`p-res-upload-zone ${resourceDragOver ? 'drag-over' : ''}`}
                      onDragOver={e => { e.preventDefault(); setResourceDragOver(true); }}
                      onDragLeave={() => setResourceDragOver(false)}
                      onDrop={e => {
                        e.preventDefault();
                        setResourceDragOver(false);
                        const files = Array.from(e.dataTransfer.files);
                        const mapped = files.map(f => ({ name: f.name, size: f.size, type: f.type, url: URL.createObjectURL(f), fileObj: f }));
                        setResourceFiles(prev => [...prev, ...mapped]);
                      }}
                      onClick={() => resourceInputRef.current?.click()}
                    >
                      <input
                        ref={resourceInputRef}
                        type="file"
                        multiple
                        accept="*/*"
                        style={{ display: 'none' }}
                        onChange={e => {
                          const files = Array.from(e.target.files);
                          const mapped = files.map(f => ({ name: f.name, size: f.size, type: f.type, url: URL.createObjectURL(f), fileObj: f }));
                          setResourceFiles(prev => [...prev, ...mapped]);
                          e.target.value = '';
                        }}
                      />
                      <div className="p-res-upload-icon"><i className="fa-solid fa-cloud-arrow-up"></i></div>
                      <div className="p-res-upload-text">Drop files here or <span className="p-res-browse">click to browse</span></div>
                      <div className="p-res-upload-hint">Images, PDFs, documents, videos — any file type supported</div>
                    </div>

                    {/* Paste Input Area */}
                    <div style={{ margin: '0 16px 16px', position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', pointerEvents: 'none', transition: 'color 0.2s', zIndex: 2 }}>
                        <i className="fa-regular fa-clipboard"></i>
                      </div>
                      <input
                        type="text"
                        placeholder="Click here and press Ctrl+V / Cmd+V to paste an image..."
                        style={{ width: '100%', padding: '14px 44px 14px 44px', borderRadius: '10px', border: '1.5px dashed var(--border2)', background: 'var(--white)', color: 'var(--text)', fontSize: '13px', outline: 'none', transition: 'all 0.25s ease', cursor: 'text', position: 'relative', zIndex: 1 }}
                        onFocus={(e) => {
                          e.target.style.borderColor = 'var(--bm)';
                          e.target.style.boxShadow = '0 0 0 4px rgba(37,99,235,0.1)';
                          e.target.previousSibling.style.color = 'var(--bm)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'var(--border2)';
                          e.target.style.boxShadow = 'none';
                          e.target.previousSibling.style.color = 'var(--muted)';
                        }}
                        onMouseEnter={(e) => {
                          if (document.activeElement !== e.target) e.target.style.borderColor = 'var(--muted)';
                        }}
                        onMouseLeave={(e) => {
                          if (document.activeElement !== e.target) e.target.style.borderColor = 'var(--border2)';
                        }}
                        onPaste={e => {
                          const files = Array.from(e.clipboardData.files);
                          if (files.length > 0) {
                            e.preventDefault();
                            const mapped = files.map(f => ({
                              name: f.name === 'image.png' ? `Pasted_Image_${new Date().getTime()}.png` : f.name,
                              size: f.size,
                              type: f.type,
                              url: URL.createObjectURL(f),
                              fileObj: f
                            }));
                            setResourceFiles(prev => [...prev, ...mapped]);
                            triggerToast("Pasted file added successfully! ✓");
                          } else {
                            const text = e.clipboardData.getData('text');
                            if (text) triggerToast("Please paste an image file, not text!");
                          }
                          setTimeout(() => { e.target.value = ''; }, 10);
                        }}
                        onChange={e => e.target.value = ''}
                      />
                      <div style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 2 }}>
                        <span style={{ fontSize: '10px', fontFamily: "'DM Mono', monospace", background: 'var(--cream2)', padding: '4px 6px', borderRadius: '6px', border: '1px solid var(--border)', color: 'var(--text2)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          ⌘ V
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* IMPORT MODAL */}
      {isImportOpen && (
        <div className="overlay" onClick={() => setIsImportOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '680px' }}>
            <div className="modal-hdr">
              <div className="modal-ttl"><i className="fa-solid fa-file-import" style={{ color: 'var(--gm)' }}></i>Import Day Content</div>
              <button className="modal-cls" onClick={() => setIsImportOpen(false)}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <div className="modal-body">
              <label className="modal-lbl">Day Number</label>
              <input className="modal-input" type="number" min="1" max="60" value={importDayNum} onChange={e => setImportDayNum(Number(e.target.value))} style={{ width: '100px', marginBottom: '14px' }} />
              <label className="modal-lbl">Day Type</label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <button className="btn btn-ghost btn-sm" onClick={() => setImportType('learn')} style={importType === 'learn' ? { borderColor: 'var(--bm)', color: 'var(--bm)' } : {}}><i className="fa-solid fa-book-open" style={{ marginRight: '6px' }}></i>Learning Day</button>
                <button className="btn btn-ghost btn-sm" onClick={() => setImportType('task')} style={importType === 'task' ? { borderColor: 'var(--am)', color: 'var(--am)' } : {}}>⚡ Task Day</button>
              </div>
              <label className="modal-lbl">Paste your Markdown content below</label>
              <textarea className="modal-textarea" value={importMd} onChange={e => setImportMd(e.target.value)} placeholder="Paste your full day markdown content here..." />
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={handleImport}><i className="fa-solid fa-check"></i> Import & Render</button>
              <button className="btn btn-ghost" onClick={() => setIsImportOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* HELP MODAL */}
      {isHelpOpen && (
        <div className="overlay" onClick={() => setIsHelpOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div className="modal-hdr">
              <div className="modal-ttl"><i className="fa-solid fa-book" style={{ color: 'var(--gm)' }}></i>Complete Syntax Reference</div>
              <button className="modal-cls" onClick={() => setIsHelpOpen(false)}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <div className="modal-body" style={{ fontFamily: "'DM Mono',monospace", fontSize: '11.5px', lineHeight: 1.9, color: 'var(--text2)' }}>
              <div className="syntax-guide">
                <div className="sg-head">📝 Basic Markdown</div>
                <div className="sg-row"><span className="sg-key"># Title</span><span className="sg-val">→ H1 heading (Page/Day title)</span></div>
                <div className="sg-row"><span className="sg-key">## Title</span><span className="sg-val">→ H2 section heading</span></div>
                <div className="sg-row"><span className="sg-key">### Title</span><span className="sg-val">→ H3 sub-heading</span></div>
                <div className="sg-row"><span className="sg-key">**bold**</span><span className="sg-val">→ Bold text</span></div>
                <div className="sg-row"><span className="sg-key">:::concept</span><span className="sg-val">→ Blue concept explanation box</span></div>
                <div className="sg-row"><span className="sg-key">:::image</span><span className="sg-val">→ Image. url: link, caption: text, alt: text</span></div>
                <div className="sg-row"><span className="sg-key">:::video</span><span className="sg-val">→ Video player. url:, title:, duration:, required: true/false</span></div>
                <div className="sg-row"><span className="sg-key">:::code python</span><span className="sg-val">→ Code block. Language after :::code. First ### line = title</span></div>
                <div className="sg-row"><span className="sg-key">:::quiz</span><span className="sg-val">→ Interactive quiz. Q:, A:, B:, C:, D:, CORRECT:, EXPLAIN:</span></div>
                <div className="sg-row"><span className="sg-key">:::task-hero</span><span className="sg-val">→ Task day dark hero. #=task prefix, ##=title, body=desc</span></div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setIsHelpOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      <div className={`toast ${showToast ? 'show' : ''}`}><i className="fa-solid fa-circle-check"></i><span>{toastMsg}</span></div>
    </div>
  );
}