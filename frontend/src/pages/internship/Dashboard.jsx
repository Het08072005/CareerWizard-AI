import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const levelData = {
  beginner: {
    title: 'Beginner Requirements',
    color: '#16a34a',
    items: [
      'Understand JWT authentication principles and token header structure',
      'Set up Node.js Express server with routes for Login and Signup',
      'Store passwords securely using bcrypt hashing library',
      'Test endpoint successfully with a tool like Postman or Curl'
    ]
  },
  intermediate: {
    title: 'Intermediate Requirements',
    color: '#d97706',
    items: [
      'All Beginner requirements completed successfully',
      'Implement real database persistence (PostgreSQL or MongoDB)',
      'Add access token validation middleware to protect API endpoints',
      'Handle error responses systematically with proper HTTP status codes'
    ]
  },
  advanced: {
    title: 'Advanced Requirements',
    color: '#dc2626',
    items: [
      'All Intermediate requirements completed successfully',
      'Full authentication system with Role-Based Access Control (RBAC) + rate limiting',
      'Docker containerisation with a robust docker-compose.yml setup',
      'Unit + Integration testing using Jest and Supertest with 80%+ coverage',
      'CI/CD pipeline via GitHub Actions (lint → test → deploy to production)'
    ]
  }
};

export default function InternshipDashboard() {
  const navigate = useNavigate();
  const [activeLevel, setActiveLevel] = useState('intermediate');
  const [gitLink, setGitLink] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedDay, setSelectedDay] = useState(6);

  const handleGitSubmit = (e) => {
    e.preventDefault();
    if (!gitLink) {
      alert('Please paste your GitHub repository URL first!');
      return;
    }
    if (!gitLink.startsWith('https://github.com/')) {
      alert('Please enter a valid GitHub repository URL!');
      return;
    }
    setIsSubmitted(true);
  };

  return (
    <div className="space-y-6">
      {/* HEADER SUMMARY PANEL */}
      <div className="cw-track-banner">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="cw-banner-headline">
              Full-Stack Developer Internship <em>— Backend Phase</em>
            </div>
            <div className="flex flex-wrap gap-6 mt-2">
              <div>
                <div className="cw-stat-value">15</div>
                <div className="cw-stat-label">TOTAL DAYS</div>
              </div>
              <div>
                <div className="cw-stat-value">Day 6</div>
                <div className="cw-stat-label">CURRENT DAY</div>
              </div>
              <div>
                <div className="cw-stat-value">89%</div>
                <div className="cw-stat-label">AVERAGE GRADE</div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="cw-score-ring-wrap">
              <svg width="100" height="100">
                <circle cx="50" cy="50" r="40" stroke="var(--cw-border)" strokeWidth="6" fill="transparent" />
                <circle cx="50" cy="50" r="40" stroke="var(--cw-green-mid)" strokeWidth="6" fill="transparent"
                  strokeDasharray="251.2" strokeDashoffset="27.6" />
              </svg>
              <div className="cw-score-ring-center">
                <div className="cw-ring-number">89</div>
                <div className="cw-ring-label">GRADE</div>
              </div>
            </div>
          </div>
        </div>

        {/* DAY NODES PROGRESS ROW */}
        <div style={{ marginTop: 24, paddingTop: 18, borderTop: '1px solid var(--cw-border)' }}>
          <div className="cw-stat-label" style={{ fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>
            Day Progress Timeline (Click node to view details)
          </div>
          <div className="cw-day-nodes-row">
            {[1, 2, 3, 4, 5].map(d => (
              <div key={d} className="cw-day-node done" onClick={() => { setSelectedDay(d); alert(`Day ${d} task completed successfully with 92% average score!`); }}>{d}</div>
            ))}
            <div className="cw-phase-sep" />
            <div className={`cw-day-node ${selectedDay === 6 ? 'active' : 'available'}`} onClick={() => setSelectedDay(6)}>6</div>
            <div className="cw-day-node available" onClick={() => { setSelectedDay(7); alert('Day 7 is available to start early!'); }}>7</div>
            <div className="cw-day-node available" onClick={() => { setSelectedDay(8); alert('Day 8 is available to start early!'); }}>8</div>
            <div className="cw-phase-sep" />
            {[9, 10, 11, 12, 13, 14, 15].map(d => (
              <div key={d} className="cw-day-node locked" onClick={() => alert(`Day ${d} unlocks sequentially after day tasks are submitted.`)}>{d}</div>
            ))}
          </div>
        </div>
      </div>

      {/* LOWER SPLIT LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: ACTIVE TASK (8 COLS) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="cw-card">
            <div className="cw-card-header">
              <div className="cw-card-title">
                <i className="fa-solid fa-list-check" />
                <span>Today's Task — Day {selectedDay}</span>
              </div>
              <span className="cw-badge cw-badge-amber">Phase 2 — Due 11:59 PM</span>
            </div>

            <div className="cw-task-title">Build a REST API with JWT Authentication</div>
            <p className="cw-task-desc">
              Extend your frontend application from the previous phase — create a Node.js + Express backend with user registration, login, and secured routes. This task validates your understanding of modern security protocols and stateless system sessions.
            </p>

            {/* LEVEL SELECTOR TABS */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {Object.keys(levelData).map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setActiveLevel(lvl)}
                  className="cw-btn cw-btn-sm"
                  style={{
                    background: activeLevel === lvl ? 'var(--cw-green-mid)' : 'var(--cw-bg2)',
                    color: activeLevel === lvl ? '#fff' : 'var(--cw-text)',
                    borderColor: activeLevel === lvl ? 'var(--cw-green-mid)' : 'var(--cw-border)'
                  }}
                >
                  {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                </button>
              ))}
            </div>

            {/* DYNAMIC LEVEL REQUIREMENTS BOX */}
            <div className="cw-level-requirements" style={{ borderLeftColor: levelData[activeLevel].color }}>
              <div className="cw-level-req-title">{levelData[activeLevel].title}</div>
              <div className="cw-req-list">
                {levelData[activeLevel].items.map((item, idx) => (
                  <div key={idx} className="cw-req-item">{item}</div>
                ))}
              </div>
            </div>

            {/* GITHUB SUBMISSION BOX */}
            <div className="cw-submit-box">
              <div className="cw-submit-label">
                <i className="fa-brands fa-github" style={{ marginRight: 6 }} />
                SUBMIT GITHUB REPOSITORY LINK
              </div>
              {isSubmitted ? (
                <div style={{ color: 'var(--cw-green-mid)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <i className="fa-solid fa-circle-check" />
                  <span>Submitted successfully! AI assessment underway. Results available in 2 min.</span>
                </div>
              ) : (
                <form onSubmit={handleGitSubmit} className="input-row">
                  <input
                    type="url"
                    className="text-input"
                    placeholder="https://github.com/username/repository-name"
                    value={gitLink}
                    onChange={(e) => setGitLink(e.target.value)}
                  />
                  <button type="submit" className="cw-btn cw-btn-primary">
                    Submit →
                  </button>
                </form>
              )}
            </div>

            {/* ACTION FOOTER */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button className="cw-btn cw-btn-ghost cw-btn-sm" onClick={() => alert('AI Assistant loading... Ask any question about authentication or bcrypt.')}>
                <i className="fa-solid fa-robot" /> Ask AI
              </button>
              <button className="cw-btn cw-btn-ghost cw-btn-sm" onClick={() => alert('Full Grading Rubric: Functionality (40%), Security (30%), Code Structure (20%), Documentation (10%)')}>
                <i className="fa-solid fa-table-list" /> View Rubric
              </button>
              <button className="cw-btn cw-btn-ghost cw-btn-sm" onClick={() => navigate('/internship/learning')}>
                <i className="fa-solid fa-book" /> Learn Content
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: MODULE INFO & STATS (4 COLS) */}
        <div className="lg:col-span-4 space-y-6">
          {/* RESOURCES BOX */}
          <div className="cw-card">
            <div className="cw-card-header">
              <div className="cw-card-title">
                <i className="fa-solid fa-folder-open" />
                <span>Today's Resources</span>
              </div>
            </div>
            <div className="space-y-3">
              <a href="https://jwt.io" target="_blank" rel="noreferrer" className="block p-3 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 6, background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626' }}>
                    <i className="fa-solid fa-shield" />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>JWT Debugger & Spec</div>
                    <div style={{ fontSize: 11, color: 'var(--cw-muted)' }}>Learn header & payload encoding</div>
                  </div>
                </div>
              </a>
              <a href="https://expressjs.com" target="_blank" rel="noreferrer" className="block p-3 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 6, background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                    <i className="fa-solid fa-server" />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>Express Routing Docs</div>
                    <div style={{ fontSize: 11, color: 'var(--cw-muted)' }}>Official route design reference</div>
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* CERTIFICATE PROGRESS */}
          <div className="cw-card" style={{ background: 'var(--cw-green-bg)', borderColor: 'var(--cw-green-mid)' }}>
            <div className="cw-card-title" style={{ color: 'var(--cw-green-mid)', marginBottom: 8 }}>
              <i className="fa-solid fa-award" style={{ color: 'var(--cw-green-mid)' }} />
              Certificate Progress
            </div>
            <p style={{ fontSize: 12, color: 'var(--cw-text)', opacity: 0.8, marginBottom: 14 }}>
              Complete all tasks with a minimum of 60% score to receive a secure blockchain credentials certificate.
            </p>
            <div className="cw-progress-meta">
              <span className="cw-progress-label">Tasks Finished</span>
              <span className="cw-progress-value">6 / 15</span>
            </div>
            <div className="cw-progress-track">
              <div className="cw-progress-fill" style={{ width: '40%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
