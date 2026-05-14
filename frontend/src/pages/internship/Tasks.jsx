import React, { useState } from 'react';

const CustomCheckCircle = ({ size = 18, strokeWidth = 2.5 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const initialTasks = [
  { day: 1, title: 'HTML5 & Responsive Layouts', domain: 'frontend', level: 'Beginner', tags: ['HTML5', 'CSS Grid', 'Flexbox'], status: 'done', score: 95 },
  { day: 2, title: 'Vanilla JS State Management', domain: 'frontend', level: 'Intermediate', tags: ['ES6+', 'State', 'DOM'], status: 'done', score: 88 },
  { day: 3, title: 'Connecting to RESTful APIs', domain: 'frontend', level: 'Intermediate', tags: ['Fetch API', 'JSON', 'Async'], status: 'done', score: 91 },
  { day: 4, title: 'Introduction to Node & Express', domain: 'backend', level: 'Beginner', tags: ['Node.js', 'Express', 'HTTP'], status: 'done', score: 78 },
  { day: 5, title: 'Database Design & SQL Schemas', domain: 'backend', level: 'Intermediate', tags: ['PostgreSQL', 'SQL', 'Schema'], status: 'done', score: 94 },
  { day: 6, title: 'Build a REST API with JWT Auth', domain: 'backend', level: 'Advanced', tags: ['JWT', 'Bcrypt', 'Docker'], status: 'active', score: null },
  { day: 7, title: 'Middleware & Custom Rate Limiters', domain: 'backend', level: 'Advanced', tags: ['Express', 'Security', 'Redis'], status: 'available', score: null },
  { day: 8, title: 'Cloud File Upload & Management', domain: 'backend', level: 'Intermediate', tags: ['AWS S3', 'Multer', 'APIs'], status: 'available', score: null },
  { day: 9, title: 'Real-time WebSockets with Socket.io', domain: 'fullstack', level: 'Advanced', tags: ['WebSockets', 'Realtime'], status: 'locked', score: null }
];

export default function InternshipTasks() {
  const [filter, setFilter] = useState('all');
  const [tasks, setTasks] = useState(initialTasks);
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalGit, setModalGit] = useState('');

  const filteredTasks = tasks.filter(t => {
    if (filter === 'all') return true;
    if (filter === 'completed') return t.status === 'done';
    if (filter === 'active') return t.status === 'active';
    return t.domain === filter;
  });

  return (
    <div className="space-y-6">
      <div className="cw-card">
        <div className="cw-card-header">
          <div className="cw-card-title">
            <i className="fa-solid fa-list-check" />
            <span>Assigned Internship Tasks</span>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['all', 'completed', 'active', 'frontend', 'backend'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="cw-btn cw-btn-sm"
                style={{
                  background: filter === f ? 'var(--cw-green-mid)' : 'var(--cw-bg2)',
                  color: filter === f ? '#fff' : 'var(--cw-text)',
                  borderColor: filter === f ? 'var(--cw-green-mid)' : 'var(--cw-border)',
                  textTransform: 'uppercase',
                  fontSize: 10
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredTasks.map(task => (
            <div
              key={task.day}
              onClick={() => setSelectedTask(task)}
              className="p-4 rounded-xl border border-white/5 hover:border-white/15 bg-white/[0.01] hover:bg-white/[0.03] transition flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: 8,
                  background: task.status === 'done' ? 'rgba(22, 163, 74, 0.12)' : task.status === 'active' ? 'rgba(37, 99, 235, 0.12)' : 'rgba(255,255,255,0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: task.status === 'done' ? '#16a34a' : task.status === 'active' ? '#2563eb' : 'var(--cw-muted)',
                  fontSize: 18
                }}>
                  {task.status === 'done' ? <CustomCheckCircle size={20} strokeWidth={2.5} /> : <i className={`fa-solid ${task.status === 'active' ? 'fa-bolt' : 'fa-lock'}`} />}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>
                    Day {task.day} — {task.title}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--cw-muted)', marginTop: 2 }}>
                    {task.domain.toUpperCase()} · {task.level} · {task.tags.join(', ')}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {task.score && (
                  <span className="cw-badge cw-badge-green" style={{ fontSize: 11 }}>
                    Score: {task.score}/100
                  </span>
                )}
                <span className={`cw-badge ${task.status === 'done' ? 'cw-badge-green' : task.status === 'active' ? 'cw-badge-amber' : 'cw-badge-secondary'}`}>
                  {task.status === 'done' ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <CustomCheckCircle size={14} strokeWidth={2.8} /> DONE
                    </span>
                  ) : task.status === 'active' ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <i className="fa-solid fa-bolt" style={{ fontSize: 10 }} /> ACTIVE
                    </span>
                  ) : (
                    task.status.toUpperCase()
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedTask && (
        <div className="cw-modal-overlay" onClick={() => setSelectedTask(null)}>
          <div className="cw-modal-content" onClick={e => e.stopPropagation()}>
            <div className="cw-modal-header">
              <div className="cw-modal-title">
                Day {selectedTask.day} — {selectedTask.title}
              </div>
              <button onClick={() => setSelectedTask(null)} style={{ background: 'transparent', border: 'none', color: 'var(--cw-text)', fontSize: 18 }}>
                ✕
              </button>
            </div>
            <div className="cw-modal-body space-y-4">
              <div className="flex gap-2">
                {selectedTask.tags.map(t => (
                  <span key={t} className="cw-tag">{t}</span>
                ))}
              </div>
              <p style={{ fontSize: 13, color: 'var(--cw-text2)', lineHeight: 1.6 }}>
                This is the complete assignment outline for Day {selectedTask.day}. It tests your domain expertise on {selectedTask.tags.join(', ')} using our automated logic evaluation protocols.
              </p>

              {selectedTask.score ? (
                <div style={{ padding: 14, background: 'rgba(22, 163, 74, 0.08)', borderRadius: 10, border: '1px solid #16a34a' }}>
                  <div style={{ fontWeight: 700, color: '#16a34a', fontSize: 13 }}>Passing Assessment Checked</div>
                  <p style={{ fontSize: 12, color: 'var(--cw-text2)', marginTop: 4 }}>
                    Score: {selectedTask.score}/100. Feedback: The REST endpoints match strict HTTP conventions and database persistence functions cleanly.
                  </p>
                </div>
              ) : selectedTask.status !== 'locked' ? (
                <div className="cw-submit-box">
                  <div className="cw-submit-label">PASTE GITHUB URL</div>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      className="text-input"
                      placeholder="https://github.com/username/repo"
                      value={modalGit}
                      onChange={e => setModalGit(e.target.value)}
                    />
                    <button className="cw-btn cw-btn-primary cw-btn-sm" onClick={() => { if (!modalGit) return; alert('Submitted successfully!'); setSelectedTask(null); }}>
                      Submit
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ color: 'var(--cw-muted)', fontStyle: 'italic', fontSize: 13 }}>
                  This task is currently locked. Complete preceding day milestones to unlock.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
