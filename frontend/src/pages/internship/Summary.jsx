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
      <div className="bg-[#fbf8f1] rounded-3xl border border-[var(--gold)]/20 p-6 shadow-[0_4px_20px_rgba(160,120,64,0.04)]">
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
              <div className="flex-1 pb-6 pt-1">
                <div className="flex justify-between items-start">
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--cw-text)' }}>Day {ev.day} — {ev.title}</div>
                  <span className="cw-badge cw-badge-green">Score: {ev.score}/100</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--cw-text2)', marginTop: 4, lineHeight: 1.5 }}>
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
