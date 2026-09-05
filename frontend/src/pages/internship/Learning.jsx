import { useState } from 'react';
import MarkdownContent from '../../components/MarkdownContent';
import { EnrollmentRequired, WorkspaceError, WorkspaceLoading } from '../../components/InternshipState';
import { useInternship } from '../../context/internshipContextValue';

export default function InternshipLearning() {
  const { data, loading, error, reload } = useInternship();
  const [day, setDay] = useState(null);
  if (loading) return <WorkspaceLoading />;
  if (error) return <WorkspaceError message={error} onRetry={reload} />;
  if (!data?.enrollment) return <EnrollmentRequired />;
  const learning = data.tasks.filter(item => item.content_type === 'learn' && item.enabled);
  const active = learning.find(item => item.day === day) || learning[0];
  return <div className="space-y-5"><div><h1 className="text-2xl font-bold">Daily learning</h1><p className="text-sm text-[var(--text-muted)] mt-1">Difficulty-aware content published by the internship content engine.</p></div>{learning.length ? <div className="grid lg:grid-cols-4 gap-5"><aside className="space-y-2">{learning.map(item => <button key={item.day} onClick={() => setDay(item.day)} className={`w-full text-left p-3 rounded-xl border text-sm ${active?.day === item.day ? 'border-emerald-500 bg-emerald-500/5' : 'border-[var(--border-color)]'}`}><span className="text-[10px] text-emerald-600">DAY {item.day}</span><div className="font-bold mt-1">{item.title}</div></button>)}</aside><article className="lg:col-span-3 bg-[var(--bg-sidebar)] border border-[var(--border-color)] rounded-2xl p-6"><MarkdownContent markdown={active?.markdown} /></article></div> : <div className="p-8 rounded-2xl border border-[var(--border-color)] text-center text-sm text-[var(--text-muted)]">No learning days are published for this difficulty yet.</div>}</div>;
}
