import React, { useState } from 'react';

const initialProjects = [
  { name: 'CareerWizard Platform UI', stack: 'React, Tailwind v4, Vite', target: '30-day plan', progress: 40, desc: 'A gorgeous career accelerator cockpit dashboard utilizing modern theme switches.' }
];

export default function InternshipProjects() {
  const [projects, setProjects] = useState(initialProjects);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [stack, setStack] = useState('');
  const [target, setTarget] = useState('15-day plan');
  const [desc, setDesc] = useState('');

  const handleAddProject = (e) => {
    e.preventDefault();
    if (!name) return;
    const newProj = { name, stack, target, progress: 10, desc };
    setProjects([...projects, newProj]);
    setName('');
    setStack('');
    setDesc('');
    setShowAdd(false);
  };

  return (
    <div className="space-y-6">
      <div className="cw-card">
        <div className="cw-card-header">
          <div className="cw-card-title">
            <i className="fa-solid fa-folder-open" />
            <span>My Custom Parallel Projects</span>
          </div>
          <button className="cw-btn cw-btn-primary cw-btn-sm" onClick={() => setShowAdd(true)}>
            + Add Personal Project
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((p, idx) => (
            <div key={idx} className="p-5 rounded-2xl border border-white/5 bg-white/[0.01] space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--cw-muted)', marginTop: 2 }}>{p.stack} · {p.target}</div>
                </div>
                <span className="cw-badge cw-badge-purple">My Project</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--cw-text2)' }}>{p.desc || 'No description supplied yet.'}</p>
              <div>
                <div style={{ display: 'flex', justify: 'space-between', fontSize: 11, color: 'var(--cw-muted)', marginBottom: 6 }}>
                  <span>ACCELERATION PROGRESS</span>
                  <span style={{ fontWeight: 700 }}>{p.progress}%</span>
                </div>
                <div className="cw-progress-track">
                  <div className="cw-progress-fill" style={{ width: `${p.progress}%`, background: 'var(--cw-purple-mid)' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ADD MODAL */}
      {showAdd && (
        <div className="cw-modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="cw-modal-content" onClick={e => e.stopPropagation()}>
            <div className="cw-modal-header">
              <div className="cw-modal-title">Track a New Project</div>
              <button onClick={() => setShowAdd(false)} style={{ background: 'transparent', border: 'none', color: 'var(--cw-text)', fontSize: 18 }}>
                ✕
              </button>
            </div>
            <form onSubmit={handleAddProject} className="cw-modal-body space-y-4">
              <div className="space-y-1">
                <label style={{ fontSize: 12, fontWeight: 700 }}>PROJECT NAME</label>
                <input type="text" className="text-input" placeholder="e.g. Portfolio Website" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div className="space-y-1">
                <label style={{ fontSize: 12, fontWeight: 700 }}>TECH STACK</label>
                <input type="text" className="text-input" placeholder="e.g. React, Node, SQL" value={stack} onChange={e => setStack(e.target.value)} />
              </div>
              <div className="space-y-1">
                <label style={{ fontSize: 12, fontWeight: 700 }}>TARGET TIMELINE</label>
                <select className="select-input" style={{ width: '100%' }} value={target} onChange={e => setTarget(e.target.value)}>
                  <option value="15-day plan">15-day plan</option>
                  <option value="30-day plan">30-day plan</option>
                </select>
              </div>
              <div className="space-y-1">
                <label style={{ fontSize: 12, fontWeight: 700 }}>DESCRIPTION</label>
                <textarea className="textarea-input" placeholder="Summarize features..." value={desc} onChange={e => setDesc(e.target.value)} />
              </div>
              <button type="submit" className="cw-btn cw-btn-primary cw-btn-full">
                Add Project
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
