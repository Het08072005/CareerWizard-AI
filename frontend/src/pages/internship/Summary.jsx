import React from 'react';

const events = [
  { day: 5, title: 'Database Design Normalisation', status: 'verified', score: 94 },
  { day: 4, title: 'Introduction to Node & Express servers', status: 'verified', score: 78 },
  { day: 3, title: 'Connecting to RESTful APIs', status: 'verified', score: 91 },
  { day: 2, title: 'Vanilla JS State Systems', status: 'verified', score: 88 },
  { day: 1, title: 'Semantic HTML5 & Responsive Grids', status: 'verified', score: 95 }
];

export default function InternshipSummary() {
  return (
    <div className="space-y-6">
      <div className="cw-card">
        <div className="cw-card-header">
          <div className="cw-card-title">
            <i className="fa-solid fa-clock-rotate-left" />
            <span>Progress Timeline & History</span>
          </div>
          <span className="cw-badge cw-badge-green">6 MILESTONES COMPLETED</span>
        </div>

        <div className="space-y-6" style={{ position: 'relative', paddingLeft: 16 }}>
          {/* Vertical Timeline Bar */}
          <div style={{ position: 'absolute', top: 8, bottom: 8, left: 6, width: 2, background: 'var(--cw-border)' }} />

          {events.map(ev => (
            <div key={ev.day} style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <div style={{
                position: 'absolute',
                left: -14,
                top: 4,
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: '#16a34a',
                border: '2px solid var(--cw-white)'
              }} />
              <div className="flex-1 p-4 rounded-xl border border-white/5 bg-white/[0.01]">
                <div className="flex justify-between items-center">
                  <div style={{ fontSize: 14, fontWeight: 700 }}>Day {ev.day} — {ev.title}</div>
                  <span className="cw-badge cw-badge-green">Score: {ev.score}/100</span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--cw-muted)', marginTop: 4 }}>
                  Verified successfully via automated secure blockchain credential checks. Excellent work conforming to API specs!
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
