import { useEffect, useState } from 'react';
import { getInternshipPortfolio } from '../../api/internshipApi';
import { EnrollmentRequired, WorkspaceError, WorkspaceLoading } from '../../components/InternshipState';
import { useInternship } from '../../context/internshipContextValue';

export default function InternshipProjects() {
  const workspace = useInternship(); const [portfolio, setPortfolio] = useState(null); const [error, setError] = useState('');
  useEffect(() => { if (workspace.data?.enrollment) getInternshipPortfolio().then(setPortfolio).catch(err => setError(err.response?.data?.detail || 'Portfolio could not be loaded.')); }, [workspace.data?.enrollment]);
  if (workspace.loading || (workspace.data?.enrollment && !portfolio && !error)) return <WorkspaceLoading />;
  if (workspace.error || error) return <WorkspaceError message={workspace.error || error} onRetry={() => window.location.reload()} />;
  if (!workspace.data?.enrollment) return <EnrollmentRequired />;
  return <div className="space-y-5"><div><h1 className="text-2xl font-bold">Proof-of-work portfolio</h1><p className="text-sm text-[var(--text-muted)] mt-1">Approved repositories automatically become evidence-backed case studies.</p></div><div className="grid md:grid-cols-2 gap-5">{portfolio.projects.map(project => <article key={project.id} className="bg-[var(--bg-sidebar)] border border-[var(--border-color)] rounded-2xl p-6"><div className="flex justify-between gap-3"><span className={`text-[10px] font-bold ${project.verified ? 'text-emerald-600' : 'text-amber-600'}`}>{project.verified ? 'VERIFIED' : 'VIVA PENDING'}</span><strong className="text-emerald-600">{project.score}/100</strong></div><h2 className="font-bold text-lg mt-3">{project.title}</h2><p className="text-xs text-[var(--text-muted)] mt-2 line-clamp-4">{project.problem}</p><div className="flex flex-wrap gap-1 mt-4">{project.skills.map(skill => <span key={skill} className="px-2 py-1 rounded bg-slate-500/10 text-[10px]">{skill}</span>)}</div><a href={project.github_url} target="_blank" rel="noreferrer" className="inline-block mt-5 text-xs font-bold text-emerald-600">Open GitHub evidence →</a></article>)}{!portfolio.projects.length && <div className="md:col-span-2 p-10 border border-dashed border-[var(--border-color)] rounded-2xl text-center text-sm text-[var(--text-muted)]">Approved submissions will appear here automatically.</div>}</div></div>;
}
