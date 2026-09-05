import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveStandup, submitInternshipTask } from '../../api/internshipApi';
import { useInternship } from '../../context/internshipContextValue';
import MarkdownContent from '../../components/MarkdownContent';
import { EnrollmentRequired, WorkspaceError, WorkspaceLoading } from '../../components/InternshipState';

const Stat = ({ icon, value, label, hint }) => <div className="bg-[var(--bg-sidebar)] p-5 rounded-2xl border border-[var(--border-color)] flex items-center gap-4"><div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center"><i className={`fa-solid ${icon}`} /></div><div><div className="text-2xl font-bold text-[var(--text-main)]">{value}</div><div className="text-xs font-bold text-[var(--text-muted)]">{label}</div><div className="text-[10px] text-emerald-600 mt-1">{hint}</div></div></div>;

export default function InternshipDashboard() {
  const { data, loading, error, reload } = useInternship();
  const navigate = useNavigate();
  const [githubUrl, setGithubUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [standup, setStandup] = useState({ yesterday: '', today: '', blockers: '' });

  if (loading) return <WorkspaceLoading />;
  if (error) return <WorkspaceError message={error} onRetry={reload} />;
  if (!data?.enrollment) return <EnrollmentRequired />;

  const { enrollment, readiness, today, recent_submissions: recent } = data;
  const handleSubmit = async (event) => {
    event.preventDefault(); setSubmitting(true); setMessage('');
    try { const result = await submitInternshipTask(today.day, githubUrl); setMessage(`Review complete: ${result.submission.total_score}/100 — ${result.submission.status.replace('_', ' ')}`); setGithubUrl(''); await reload(); }
    catch (requestError) { setMessage(requestError.response?.data?.detail || 'Submission failed.'); }
    finally { setSubmitting(false); }
  };
  const handleStandup = async (event) => {
    event.preventDefault(); setSubmitting(true); setMessage('');
    try { const result = await saveStandup(standup); setMessage(`Standup saved. Communication score: ${result.standup.communication_score}`); await reload(); }
    catch (requestError) { setMessage(requestError.response?.data?.detail || 'Standup could not be saved.'); }
    finally { setSubmitting(false); }
  };

  return <div className="space-y-6 pb-12">
    <section className="bg-[var(--bg-sidebar)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6"><div><div className="flex gap-2 flex-wrap"><span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600">{enrollment.track.name}</span><span className="px-3 py-1 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 capitalize">{enrollment.difficulty_level}</span></div><h1 className="mt-4 text-3xl font-bold text-[var(--text-main)]">Work like you are already hired.</h1><p className="text-sm text-[var(--text-muted)] mt-2">{enrollment.plan.name} · Day {enrollment.current_day} of {enrollment.total_days}</p></div><div className="text-center min-w-40 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10"><div className="text-4xl font-bold text-emerald-600">{readiness.career_readiness_score}</div><div className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">Career readiness</div></div></div>
      <div className="mt-6"><div className="flex justify-between text-xs mb-2"><span>Overall progress</span><span>{enrollment.progress_percent}%</span></div><div className="h-2 rounded-full bg-slate-500/10 overflow-hidden"><div className="h-full bg-emerald-600" style={{ width: `${enrollment.progress_percent}%` }} /></div></div>
    </section>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"><Stat icon="fa-clipboard-check" value={enrollment.completed_tasks} label="Projects approved" hint={`${enrollment.total_submission_days} evidence tasks`} /><Stat icon="fa-chart-line" value={enrollment.avg_score.toFixed(0)} label="Average review score" hint="Evidence-backed" /><Stat icon="fa-code-branch" value={readiness.verified_skills} label="Verified skills" hint={`${readiness.skills.length} demonstrated`} /><Stat icon="fa-calendar" value={enrollment.total_days - enrollment.current_day + 1} label="Days remaining" hint="Sprint timeline" /></div>
    {message && <div className="p-3 rounded-xl bg-blue-500/10 text-blue-700 text-sm">{typeof message === 'string' ? message : JSON.stringify(message)}</div>}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <section className="lg:col-span-2 bg-[var(--bg-sidebar)] border border-[var(--border-color)] rounded-2xl p-6"><div className="flex justify-between gap-3"><div><div className="text-[10px] uppercase tracking-widest text-emerald-600 font-bold">Today · Phase {today?.phase || enrollment.current_phase}</div><h2 className="text-xl font-bold mt-1">{today?.title || 'No published brief for today'}</h2></div><button onClick={() => navigate('/internship/tasks')} className="text-xs text-emerald-600 font-bold">All tasks →</button></div>{today?.markdown && <div className="mt-5 max-h-80 overflow-y-auto pr-2"><MarkdownContent markdown={today.markdown} /></div>}{today && ['task', 'group'].includes(today.content_type) && today.status !== 'done' && <form onSubmit={handleSubmit} className="mt-6 pt-5 border-t border-[var(--border-color)]"><label className="text-xs font-bold">Submit public GitHub repository</label><div className="flex flex-col sm:flex-row gap-2 mt-2"><input required type="url" value={githubUrl} onChange={e => setGithubUrl(e.target.value)} placeholder="https://github.com/owner/repository" className="flex-1 px-4 py-2.5 rounded-xl bg-transparent border border-[var(--border-color)] text-sm" /><button disabled={submitting} className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold disabled:opacity-50">{submitting ? 'Reviewing…' : 'Submit & review'}</button></div><p className="text-[10px] text-[var(--text-muted)] mt-2">Repository structure, commits, tests, documentation and secret-file hygiene are checked. Viva/human review is required for final verification.</p></form>}</section>
      <section className="bg-[var(--bg-sidebar)] border border-[var(--border-color)] rounded-2xl p-6"><h2 className="font-bold">Daily async standup</h2>{data.today_standup ? <div className="mt-4 space-y-3 text-sm"><p><strong>Yesterday:</strong> {data.today_standup.yesterday}</p><p><strong>Today:</strong> {data.today_standup.today}</p><p><strong>Blockers:</strong> {data.today_standup.blockers || 'None'}</p><div className="text-emerald-600 font-bold">Communication {data.today_standup.communication_score}/100</div></div> : <form onSubmit={handleStandup} className="mt-4 space-y-3">{[['yesterday','Yesterday'],['today','Today'],['blockers','Blockers (write None if clear)']].map(([key,label]) => <textarea key={key} required={key !== 'blockers'} value={standup[key]} onChange={e => setStandup(prev => ({ ...prev, [key]: e.target.value }))} placeholder={label} className="w-full min-h-20 p-3 rounded-xl bg-transparent border border-[var(--border-color)] text-xs" />)}<button disabled={submitting} className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold">Save standup</button></form>}</section>
    </div>
    <section className="bg-[var(--bg-sidebar)] border border-[var(--border-color)] rounded-2xl p-6"><h2 className="font-bold mb-4">Recent review history</h2>{recent.length ? <div className="space-y-3">{recent.map(item => <a key={item.id} href={item.github_url} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-4 p-3 rounded-xl border border-[var(--border-color)]"><span className="text-sm">Day {item.day_number} · Attempt {item.attempt}</span><span className={`text-xs font-bold ${item.passed ? 'text-emerald-600' : 'text-amber-600'}`}>{item.total_score ?? 'Pending'} · {item.status}</span></a>)}</div> : <p className="text-sm text-[var(--text-muted)]">Your GitHub review trail will appear here.</p>}</section>
  </div>;
}
