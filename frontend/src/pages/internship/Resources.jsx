import React from 'react';

const genericResources = [
  { name: 'Git & GitHub Collaboration Flow Cheat Sheet', type: 'PDF Guide', icon: 'fa-file-pdf', bg: '#fee2e2', color: '#dc2626' },
  { name: 'API Design Best Practices Checklist', type: 'Markdown Guide', icon: 'fa-list-check', bg: '#dbeafe', color: '#2563eb' },
  { name: 'Production Deployment Docker-Compose template', type: 'ZIP Template', icon: 'fa-file-zipper', bg: '#ede9fe', color: '#7c3aed' },
  { name: 'Enterprise PostgreSQL Database Schemas Samples', type: 'SQL file', icon: 'fa-database', bg: '#fef3c7', color: '#d97706' }
];

export default function InternshipResources() {
  return (
    <div className="cw-card">
      <div className="cw-card-header">
        <div className="cw-card-title">
          <i className="fa-solid fa-cloud-arrow-down" />
          <span>General Downloadable Resources</span>
        </div>
        <span className="cw-badge cw-badge-green">ALL SYSTEMS ACTIVE</span>
      </div>
      <p style={{ fontSize: 13, color: 'var(--cw-muted)', marginBottom: 20 }}>
        Access curated codebases, starter templates, SQL queries, and industry checklists to expedite your task completions.
      </p>

      <div className="space-y-3">
        {genericResources.map((res, idx) => (
          <div
            key={idx}
            onClick={() => alert(`Starting download for ${res.name}...`)}
            className="p-4 rounded-xl border border-white/5 hover:border-white/10 bg-white/[0.01] hover:bg-white/[0.02] transition flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div style={{
                width: 38,
                height: 38,
                borderRadius: 8,
                background: res.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: res.color,
                fontSize: 16
              }}>
                <i className={`fa-solid ${res.icon}`} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{res.name}</div>
                <div style={{ fontSize: 11, color: 'var(--cw-muted)', marginTop: 2 }}>{res.type} · Ready to download</div>
              </div>
            </div>
            <i className="fa-solid fa-download" style={{ color: 'var(--cw-muted)', fontSize: 14 }} />
          </div>
        ))}
      </div>
    </div>
  );
}
