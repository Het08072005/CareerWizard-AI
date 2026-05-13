import React, { useState } from 'react';

const learnings = [
  { day: 1, title: 'Semantic HTML & Layout Systems', topics: ['Grid', 'Flexbox', 'SEO', 'Semantic elements'], content: 'Learn to build clean, descriptive structures with HTML5.' },
  { day: 2, title: 'ES6+ Advanced Syntax & Web APIs', topics: ['Promises', 'Fetch', 'Async/Await', 'DOM'], content: 'Master callback loops, fetch endpoints, and live DOM tree manipulations.' },
  { day: 3, title: 'Stateless Application Flow & Cache', topics: ['Local Storage', 'Session Storage', 'Cookies'], content: 'Manage persistence without full server side requirements.' },
  { day: 4, title: 'Constructing REST Endpoints with Express', topics: ['Routing', 'Middleware', 'HTTP Methods'], content: 'Develop simple server networks that process JSON packets.' },
  { day: 5, title: 'Database Normalisation & SQL schemas', topics: ['Postgres', 'DML', 'DDL', 'Primary Keys'], content: 'Design tables and relationship linkages that scale under high loads.' },
  { day: 6, title: 'Token-based Authentication (JWT)', topics: ['Bcrypt', 'JWT verification', 'Headers'], content: 'Protect routes with client side cookies and secret key signed payloads.' }
];

export default function InternshipLearning() {
  const [selectedDay, setSelectedDay] = useState(6);
  const [notes, setNotes] = useState('');
  const [savedNotes, setSavedNotes] = useState({});

  const handleSaveNotes = () => {
    setSavedNotes(prev => ({ ...prev, [selectedDay]: notes }));
    alert('Notes saved successfully for Day ' + selectedDay + '!');
  };

  const activeLesson = learnings.find(l => l.day === selectedDay) || learnings[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* LESSONS LIST COLUMN */}
      <div className="lg:col-span-5 space-y-4">
        <div className="cw-card">
          <div className="cw-card-title" style={{ marginBottom: 16 }}>
            <i className="fa-solid fa-graduation-cap" />
            <span>Select Learning Day</span>
          </div>
          <div className="space-y-2">
            {learnings.map(l => (
              <div
                key={l.day}
                onClick={() => { setSelectedDay(l.day); setNotes(savedNotes[l.day] || ''); }}
                className={`p-3 rounded-xl border cursor-pointer transition ${selectedDay === l.day ? 'border-[#16a34a] bg-[rgba(22,163,74,0.05)]' : 'border-white/5 hover:border-white/10'}`}
              >
                <div style={{ fontSize: 13, fontWeight: 700 }}>Day {l.day} — {l.title}</div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 6 }}>
                  {l.topics.map(t => (
                    <span key={t} className="cw-tag" style={{ fontSize: 9, padding: '2px 6px' }}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT & NOTES COLUMN */}
      <div className="lg:col-span-7 space-y-6">
        <div className="cw-card">
          <div className="cw-card-header">
            <div className="cw-card-title">
              <i className="fa-solid fa-book-open-reader" />
              <span>Day {activeLesson.day} Lesson Content</span>
            </div>
            <span className="cw-badge cw-badge-purple">ACTIVE LESSON</span>
          </div>

          <div style={{ fontSize: 18, fontWeight: 800 }}>{activeLesson.title}</div>
          <p style={{ fontSize: 14, color: 'var(--cw-text2)', lineHeight: 1.6, marginTop: 12 }}>
            {activeLesson.content} Our interactive learning protocols match academic standards to provide key strategic concepts.
          </p>

          <div style={{ marginTop: 24, paddingTop: 18, borderTop: '1px solid var(--cw-border)' }}>
            <div className="cw-card-title" style={{ fontSize: 14, marginBottom: 8 }}>
              <i className="fa-solid fa-note-sticky" />
              <span>Personal Study Notes</span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--cw-muted)', marginBottom: 12 }}>
              Draft summary notes, code snippets, or key definitions to reference later in interview preparation modules.
            </p>
            <textarea
              className="textarea-input"
              placeholder="Paste custom codes, commands, or concepts here..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
            <button className="cw-btn cw-btn-primary cw-btn-sm" style={{ marginTop: 12 }} onClick={handleSaveNotes}>
              Save Study Notes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
