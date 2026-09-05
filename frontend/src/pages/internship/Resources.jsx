import { EnrollmentRequired, WorkspaceError, WorkspaceLoading } from '../../components/InternshipState';
import { useInternship } from '../../context/internshipContextValue';

export default function InternshipResources() {
  const { data, loading, error, reload } = useInternship();
  if (loading) return <WorkspaceLoading />;
  if (error) return <WorkspaceError message={error} onRetry={reload} />;
  if (!data?.enrollment) return <EnrollmentRequired />;
  const resources = data.tasks.flatMap(task => task.resources.map((resource, index) => ({ ...resource, day: task.day, key: `${task.day}-${resource.url || resource.name}-${index}` })));
  return <div className="space-y-5"><div><h1 className="text-2xl font-bold">Sprint resources</h1><p className="text-sm text-[var(--text-muted)] mt-1">Files and links attached to your published daily briefs.</p></div><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{resources.map(resource => <a key={resource.key} href={resource.url} target="_blank" rel="noreferrer" className="p-5 rounded-2xl bg-[var(--bg-sidebar)] border border-[var(--border-color)] hover:border-emerald-500 transition"><div className="text-[10px] text-emerald-600 font-bold">DAY {resource.day} · {(resource.file_type || 'resource').toUpperCase()}</div><div className="font-bold text-sm mt-2 break-words">{resource.name || 'Open resource'}</div>{resource.size_kb && <div className="text-[10px] text-[var(--text-muted)] mt-2">{resource.size_kb} KB</div>}</a>)}{!resources.length && <div className="md:col-span-2 lg:col-span-3 p-10 rounded-2xl border border-dashed border-[var(--border-color)] text-center text-sm text-[var(--text-muted)]">No downloadable resources are attached yet. Inline links remain available inside Daily Learning.</div>}</div></div>;
}
