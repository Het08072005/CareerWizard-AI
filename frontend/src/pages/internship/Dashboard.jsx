import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div className="space-y-6 pb-12 font-sans">
      {/* TOP BANNER / PROGRESS SECTION (Screenshot 2) */}
      <div className="bg-[var(--cw-white)] border border-[var(--cw-border)] rounded-2xl p-5 sm:p-6 shadow-sm relative overflow-hidden border-t-4 border-t-emerald-600">
        {/* Top pill tags */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200/60 font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" /> &lt;/&gt; AI / ML Engineering
          </span>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200/60 font-mono">
            Phase 2 — Build &amp; Extend
          </span>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[var(--cw-bg2)] text-[var(--cw-muted)] border border-[var(--cw-border)] font-mono">
            Advanced
          </span>
        </div>

        {/* Title & Stats + Progress Ring */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
          <div className="pt-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-[var(--cw-text)] tracking-tight leading-snug font-sans">
              Build <span className="italic text-emerald-600">real</span>&nbsp;projects.<br />
              Earn your certificate.
            </div>
          </div>

          {/* Progress Ring */}
          <div className="flex flex-col items-center bg-[var(--cw-bg2)]/60 p-4 rounded-2xl border border-[var(--cw-border)] min-w-[140px]">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="currentColor" className="text-[var(--cw-border)]" strokeWidth="8" fill="transparent" />
                <circle cx="50" cy="50" r="40" stroke="currentColor" className="text-emerald-600" strokeWidth="8" fill="transparent"
                  strokeDasharray="251.2" strokeDashoffset="27.6" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl sm:text-2xl font-bold text-[var(--cw-text)] num-font">89</span>
              </div>
            </div>
            <div className="text-[10px] font-mono font-bold tracking-wider text-[var(--cw-muted)] uppercase mt-2">
              Avg score
            </div>
            <div className="text-[10px] sm:text-[11px] text-[var(--cw-muted)] font-mono tracking-wide mt-1 text-center border-t border-[var(--cw-border)] pt-1.5 w-full">
              Rank <span className="font-bold text-[var(--cw-text)] num-font">#312</span> of 8,420
            </div>
          </div>
        </div>

        {/* Overall progress bar */}
        <div className="mt-8 pt-6 border-t border-[var(--cw-border)]">
          <div className="flex justify-between items-center mb-2.5">
            <span className="text-xs font-bold text-[var(--cw-muted)] uppercase tracking-wider font-mono">Overall progress</span>
            <span className="text-xs font-bold text-emerald-600 font-mono tracking-wide num-font">6 / 30 days — 20%</span>
          </div>
          <div className="w-full bg-[var(--cw-bg2)] h-2 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-600 rounded-full transition-all duration-500" style={{ width: '20%' }} />
          </div>

          {/* Timeline Nodes */}
          <div className="flex items-center gap-1.5 mt-4 overflow-x-auto pb-2 pt-1 scrollbar-none">
            {[1, 2, 3, 4, 5].map(d => (
              <div key={d} onClick={() => setSelectedDay(d)} className="flex-shrink-0 w-8 h-8 rounded-xl bg-emerald-100/80 border border-emerald-300 flex items-center justify-center text-[11px] font-bold text-emerald-800 cursor-pointer hover:bg-emerald-200 transition num-font shadow-xs">
                {d}
              </div>
            ))}
            <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-emerald-600 border border-emerald-700 flex items-center justify-center text-[11px] font-bold text-white cursor-pointer num-font shadow-sm shadow-emerald-600/30 ring-2 ring-emerald-600/20">
              6
            </div>
            {[7, 8].map(d => (
              <div key={d} onClick={() => setSelectedDay(d)} className="flex-shrink-0 w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[11px] font-bold text-blue-700 cursor-pointer hover:bg-blue-100 transition num-font">
                {d}
              </div>
            ))}
            {[9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30].map(d => (
              <div key={d} className="flex-shrink-0 w-8 h-8 rounded-xl bg-[var(--cw-bg2)] border border-[var(--cw-border)] flex items-center justify-center text-[11px] font-medium text-[var(--cw-muted)] opacity-50 cursor-not-allowed num-font">
                {d}
              </div>
            ))}
          </div>

          {/* Phase labels below timeline */}
          <div className="flex justify-between items-center mt-2.5 text-[10px] font-mono tracking-wider font-bold text-[var(--cw-muted)] uppercase">
            <span>PHASE 1: FOUNDATION</span>
            <span className="text-blue-600 flex items-center gap-1 font-bold tracking-widest">
              PHASE 2: BUILD <i className="fa-solid fa-caret-left text-xs ml-0.5" /> YOU ARE HERE
            </span>
            <span>PHASE 3: DEPLOY</span>
          </div>
        </div>
      </div>

      {/* 4 SUMMARY STATS TILES (Screenshot 2 bottom) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[var(--cw-white)] p-4 sm:p-5 rounded-2xl border border-[var(--cw-border)] shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg flex-shrink-0 border border-emerald-100">
            <i className="fa-solid fa-check" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-[var(--cw-text)] leading-tight num-font tracking-tight">5</div>
            <div className="text-xs font-bold text-[var(--cw-muted)] mt-0.5">Tasks done</div>
            <div className="text-[11px] font-bold text-emerald-600 mt-1 flex items-center gap-0.5 num-font">↑ 1 today</div>
          </div>
        </div>

        <div className="bg-[var(--cw-white)] p-4 sm:p-5 rounded-2xl border border-[var(--cw-border)] shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg flex-shrink-0 border border-amber-100">
            <i className="fa-solid fa-fire" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-[var(--cw-text)] leading-tight num-font tracking-tight">6</div>
            <div className="text-xs font-bold text-[var(--cw-muted)] mt-0.5">Day streak</div>
            <div className="text-[11px] font-bold text-amber-600 mt-1">Keep it up!</div>
          </div>
        </div>

        <div className="bg-[var(--cw-white)] p-4 sm:p-5 rounded-2xl border border-[var(--cw-border)] shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg flex-shrink-0 border border-blue-100">
            <i className="fa-solid fa-calendar-day" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-[var(--cw-text)] leading-tight num-font tracking-tight">24</div>
            <div className="text-xs font-bold text-[var(--cw-muted)] mt-0.5">Days remaining</div>
            <div className="text-[11px] font-bold text-blue-600 mt-1">On schedule</div>
          </div>
        </div>

        <div className="bg-[var(--cw-white)] p-4 sm:p-5 rounded-2xl border border-[var(--cw-border)] shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg flex-shrink-0 border border-purple-100">
            <i className="fa-solid fa-trophy" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-[var(--cw-text)] leading-tight num-font tracking-tight">60%</div>
            <div className="text-xs font-bold text-[var(--cw-muted)] mt-0.5">Pass threshold</div>
            <div className="text-[11px] font-bold text-emerald-600 mt-1">You're at 89 ✓</div>
          </div>
        </div>
      </div>

      {/* MIDDLE SECTION — TODAY'S TASK & RESOURCES (Screenshot 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: ACTIVE TASK (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[var(--cw-white)] border border-[var(--cw-border)] rounded-2xl p-5 sm:p-6 shadow-sm">
            <div className="flex justify-between items-center mb-3.5">
              <div className="text-xs font-bold text-[var(--cw-text)] flex items-center gap-2 font-mono uppercase tracking-wide">
                <i className="fa-solid fa-clipboard-list text-base text-[var(--cw-muted)]" />
                <span>Today's task — Day {selectedDay}</span>
              </div>
              <button onClick={() => alert('Add Custom Project Modal Opening...')} className="px-3 py-1 rounded-xl border border-[var(--cw-border)] hover:bg-[var(--cw-bg2)] text-[var(--cw-text)] text-xs font-bold transition flex items-center gap-1">
                + Add Own Project
              </button>
            </div>

            <div className="mb-3.5">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 font-mono tracking-wide">
                Phase 2 · Due 11:59 PM
              </span>
            </div>

            <div className="text-xl sm:text-2xl font-extrabold text-[var(--cw-text)] tracking-tight leading-snug mb-2.5 font-sans">
              Build a REST API with JWT Authentication
            </div>
            <p className="text-xs sm:text-sm text-[var(--cw-text2)] leading-relaxed mb-5">
              Extend your Phase 1 frontend — create a Node.js + Express backend with user registration, login, and protected routes. This task validates your understanding of modern security protocols and stateless system sessions.
            </p>

            {/* LEVEL SELECTOR TABS */}
            <div className="flex items-center gap-2 mb-5 bg-[var(--cw-bg2)] p-1 rounded-xl w-fit border border-[var(--cw-border)]">
              {['beginner', 'intermediate', 'advanced'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setActiveLevel(lvl)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all capitalize flex items-center gap-1.5 ${
                    activeLevel === lvl 
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20 font-extrabold' 
                      : 'text-[var(--cw-muted)] hover:text-[var(--cw-text)]'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${lvl === 'beginner' ? 'bg-emerald-400' : lvl === 'intermediate' ? 'bg-emerald-600' : 'bg-red-500'}`} />
                  {lvl}
                </button>
              ))}
            </div>

            {/* REQUIREMENTS BOX */}
            <div className="bg-[var(--cw-bg2)] rounded-xl p-4 border-l-[3px] border-l-red-600 mb-5">
              <div className="text-xs font-bold text-red-600 flex items-center gap-2 mb-2 tracking-wide uppercase font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
                Advanced requirements
              </div>
              <div className="space-y-2.5">
                {[
                  'Full auth system with RBAC + rate limiting',
                  'Docker containerisation with docker-compose.yml',
                  'Unit + integration tests using Jest + Supertest',
                  'CI/CD pipeline via GitHub Actions (lint → test → deploy)',
                  'Live deployment to Railway or Render with env config'
                ].map((req, idx) => (
                  <div key={idx} className="text-xs font-medium text-[var(--cw-text2)] flex items-start gap-2">
                    <span className="text-emerald-600 font-bold mt-0.5">→</span>
                    <span>{req}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* TECH STACK PILLS */}
            <div className="flex flex-wrap gap-2 mb-6">
              {['Node.js', 'Express', 'JWT', 'PostgreSQL', 'bcrypt'].map((tech) => (
                <span key={tech} className="px-2.5 py-1 rounded-lg bg-[var(--cw-bg2)] text-[var(--cw-text)] border border-[var(--cw-border)] text-xs font-mono font-bold">
                  {tech}
                </span>
              ))}
            </div>

            {/* GITHUB SUBMISSION BOX FIX (Screenshot 3) */}
            <div className="bg-[var(--cw-bg2)] border border-[var(--cw-border)] rounded-2xl p-4 sm:p-5 mb-6 shadow-inner">
              <div className="text-[11px] font-mono font-bold text-[var(--cw-muted)] uppercase tracking-wider mb-2.5 flex items-center gap-2">
                <i className="fa-brands fa-github text-sm text-[var(--cw-text)]" /> SUBMIT GITHUB REPOSITORY LINK
              </div>
              {isSubmitted ? (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3">
                  <i className="fa-solid fa-circle-check text-xl text-emerald-600 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-bold">Repository Submitted Successfully!</div>
                    <div className="text-[11px] opacity-80 mt-0.5">AI assessment is running. Results available in 2 min.</div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleGitSubmit} className="flex flex-col sm:flex-row gap-2 bg-[var(--cw-white)] border border-[var(--cw-border)] p-1 rounded-xl shadow-xs">
                  <input
                    type="url"
                    className="flex-1 px-3 py-1.5 bg-transparent text-xs text-[var(--cw-text)] focus:outline-none font-mono"
                    placeholder="https://github.com/username/repo-name"
                    value={gitLink}
                    onChange={(e) => setGitLink(e.target.value)}
                  />
                  <button type="submit" className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all duration-200 shadow-sm shadow-emerald-600/20 flex-shrink-0">
                    Submit →
                  </button>
                </form>
              )}
            </div>

            {/* ACTION FOOTER */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-[var(--cw-border)]">
              <button className="px-3.5 py-1.5 rounded-xl border border-[var(--cw-border)] hover:bg-[var(--cw-bg2)] text-xs font-bold text-[var(--cw-text)] flex items-center gap-1.5 transition" onClick={() => alert('AI Assistant loading... Ask any question about authentication or bcrypt.')}>
                <i className="fa-solid fa-robot text-purple-600 text-sm" /> Ask AI
              </button>
              <button className="px-3.5 py-1.5 rounded-xl border border-[var(--cw-border)] hover:bg-[var(--cw-bg2)] text-xs font-bold text-[var(--cw-text)] flex items-center gap-1.5 transition" onClick={() => alert('Full Grading Rubric: Functionality (40%), Security (30%), Code Structure (20%), Documentation (10%)')}>
                <i className="fa-solid fa-chart-column text-emerald-600 text-sm" /> Rubric
              </button>
              <button className="px-3.5 py-1.5 rounded-xl border border-[var(--cw-border)] hover:bg-[var(--cw-bg2)] text-xs font-bold text-[var(--cw-text)] flex items-center gap-1.5 transition" onClick={() => navigate('/internship/learning')}>
                <i className="fa-solid fa-book-open-reader text-blue-600 text-sm" /> Learn
              </button>
              <button className="px-3.5 py-1.5 rounded-xl border border-[var(--cw-border)] hover:bg-[var(--cw-bg2)] text-xs font-bold text-[var(--cw-text)] flex items-center gap-1.5 transition" onClick={() => alert('Opening Discussion Forum...')}>
                <i className="fa-solid fa-message text-amber-600 text-sm" /> Discuss
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: RESOURCES & CERTIFICATE (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          {/* RESOURCES BOX */}
          <div className="bg-[var(--cw-white)] border border-[var(--cw-border)] p-5 sm:p-6 rounded-2xl shadow-sm">
            <div className="text-base font-bold text-[var(--cw-text)] flex items-center gap-2 mb-4 font-sans">
              <i className="fa-solid fa-book-open text-[var(--cw-muted)]" /> Resources for today
            </div>
            <div className="space-y-2.5">
              {[
                { title: 'JWT Auth in Node.js — Full Tutorial', subtitle: 'YouTube · 28 min · Highly recommended', icon: 'fa-brands fa-youtube', bg: 'bg-red-50 text-red-600 border border-red-100', link: 'https://youtube.com' },
                { title: 'Express.js Routing & Middleware', subtitle: 'Official Docs · Reference', icon: 'fa-solid fa-server', bg: 'bg-emerald-50 text-emerald-600 border border-emerald-100', link: 'https://expressjs.com' },
                { title: 'Node Auth Starter Template', subtitle: 'GitHub · Clone ready', icon: 'fa-brands fa-github', bg: 'bg-blue-50 text-blue-600 border border-blue-100', link: 'https://github.com' },
                { title: 'Download All Resources', subtitle: 'PDFs, Cheatsheets, Templates', icon: 'fa-solid fa-box-archive', bg: 'bg-purple-50 text-purple-600 border border-purple-100', link: '#' }
              ].map((res, idx) => (
                <a key={idx} href={res.link} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3.5 rounded-xl border border-[var(--cw-border)] bg-[var(--cw-bg2)]/60 hover:bg-[var(--cw-bg2)] transition group shadow-xs">
                  <div className="flex items-center gap-3.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${res.bg}`}>
                      <i className={res.icon} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[var(--cw-text)] group-hover:text-emerald-600 transition font-sans">{res.title}</div>
                      <div className="text-[11px] text-[var(--cw-muted)] mt-0.5 font-mono">{res.subtitle}</div>
                    </div>
                  </div>
                  {res.title !== 'Download All Resources' && (
                    <i className="fa-solid fa-arrow-up-right-from-square text-xs text-[var(--cw-muted)] group-hover:text-[var(--cw-text)] transition ml-2 flex-shrink-0" />
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* CERTIFICATE PROGRESS BOX */}
          <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-5 sm:p-6 shadow-sm relative overflow-hidden">
            <div className="text-xs font-bold text-emerald-800 flex items-center gap-2 mb-2 uppercase tracking-wider font-mono">
              <i className="fa-solid fa-award text-base text-emerald-600" /> Certificate progress
            </div>
            <p className="text-xs text-emerald-900/80 leading-relaxed mb-5 font-medium">
              Complete all tasks with 60%+ average to earn your blockchain-verified certificate.
            </p>
            <div className="space-y-3 mb-6 text-xs font-semibold">
              <div className="flex justify-between items-center border-b border-emerald-200/50 pb-2">
                <span className="text-emerald-900/70">Tasks completed</span>
                <span className="font-bold text-emerald-800 font-mono num-font">6 / 15</span>
              </div>
              <div className="flex justify-between items-center border-b border-emerald-200/50 pb-2">
                <span className="text-emerald-900/70">Average score</span>
                <span className="font-bold text-emerald-800 font-mono num-font">89 / 100</span>
              </div>
              <div className="flex justify-between items-center pb-0.5">
                <span className="text-emerald-900/70">Status</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1 font-mono"><i className="fa-solid fa-check" /> On track</span>
              </div>
            </div>
            <button onClick={() => alert('Loading verified certificate preview...')} className="w-full py-2.5 px-4 rounded-xl border-2 border-emerald-600 hover:bg-emerald-600 hover:text-white text-emerald-700 font-bold text-xs flex items-center justify-center gap-2 transition duration-200 shadow-xs shadow-emerald-600/10">
              <i className="fa-solid fa-eye text-xs" /> Preview certificate
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION — SUBMITTED TASKS TABLE (Screenshot 4) */}
      <div className="space-y-3.5 pt-2">
        <div className="text-lg font-bold text-[var(--cw-text)] px-1 tracking-tight">Submitted tasks</div>
        <div className="bg-[var(--cw-white)] border border-[var(--cw-border)] rounded-2xl p-5 sm:p-6 shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-[var(--cw-border)] text-[10px] font-mono tracking-wider text-[var(--cw-muted)] uppercase">
                <th className="pb-3.5 font-bold w-14">DAY</th>
                <th className="pb-3.5 font-bold">TASK</th>
                <th className="pb-3.5 font-bold text-center w-28">PHASE</th>
                <th className="pb-3.5 font-bold text-center w-24">SCORE</th>
                <th className="pb-3.5 font-bold text-center w-24">RESULT</th>
                <th className="pb-3.5 font-bold text-right w-20">REVIEW</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--cw-border)] text-xs">
              {[
                { day: '01', title: 'HTML/CSS Responsive Landing Page', date: '5 days ago · github.com/het/day1', phase: 'Phase 1', score: 92 },
                { day: '02', title: 'JavaScript Fetch API + DOM Manipulation', date: '4 days ago · github.com/het/day2', phase: 'Phase 1', score: 88 },
                { day: '03', title: 'React Components + State Management', date: '3 days ago · github.com/het/day3', phase: 'Phase 1', score: 91 },
                { day: '04', title: 'PostgreSQL Schema + CRUD Operations', date: '2 days ago · github.com/het/day4', phase: 'Phase 1', score: 78, isAmber: true },
                { day: '05', title: 'Express Middleware + Error Handling', date: 'Yesterday · github.com/het/day5', phase: 'Phase 2', score: 94, isPurple: true }
              ].map((sub, idx) => (
                <tr key={idx} className="hover:bg-[var(--cw-bg2)]/40 transition group">
                  <td className="py-3.5 font-bold text-base text-[var(--cw-text)] num-font">{sub.day}</td>
                  <td className="py-3.5">
                    <div className="font-bold text-[var(--cw-text)] text-xs group-hover:text-emerald-600 transition">{sub.title}</div>
                    <div className="text-[11px] text-[var(--cw-muted)] font-mono mt-0.5">{sub.date}</div>
                  </td>
                  <td className="py-3.5 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold font-mono border ${sub.isPurple ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                      {sub.phase}
                    </span>
                  </td>
                  <td className="py-3.5 text-center">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono border shadow-xs num-font ${sub.isAmber ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
                      {sub.score}
                    </span>
                  </td>
                  <td className="py-3.5 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold font-mono border ${sub.isAmber ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200'}`}>
                      PASS
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <button onClick={() => alert(`Opening repository and feedback for Day ${sub.day}...`)} className="text-blue-600 group-hover:text-blue-800 font-bold text-xs inline-flex items-center gap-1 transition">
                      View →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
