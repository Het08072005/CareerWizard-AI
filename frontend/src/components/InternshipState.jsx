import { useNavigate } from 'react-router-dom';

export function WorkspaceLoading() {
  return <div className="min-h-[360px] flex items-center justify-center text-sm text-[var(--text-muted)]"><i className="fa-solid fa-circle-notch fa-spin mr-2" /> Loading internship workspace…</div>;
}

export function WorkspaceError({ message, onRetry }) {
  return <div className="max-w-xl mx-auto mt-10 p-6 rounded-2xl border border-rose-500/20 bg-rose-500/5 text-center"><h2 className="font-bold text-rose-600">Workspace unavailable</h2><p className="text-sm text-[var(--text-muted)] mt-2">{typeof message === 'string' ? message : 'Please try again.'}</p><button onClick={onRetry} className="mt-4 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold">Retry</button></div>;
}

export function EnrollmentRequired() {
  const navigate = useNavigate();
  return <div className="max-w-2xl mx-auto mt-10 p-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-center"><div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xl"><i className="fa-solid fa-rocket" /></div><h2 className="mt-4 text-xl font-bold text-[var(--text-main)]">Start a database-backed Sprint Internship</h2><p className="mt-2 text-sm text-[var(--text-muted)]">Choose a published track and level to unlock briefs, learning, GitHub submissions, reviews and verified evidence.</p><button onClick={() => navigate('/internship/enroll')} className="mt-5 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold">Choose internship</button></div>;
}
