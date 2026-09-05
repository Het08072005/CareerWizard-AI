import { useEffect, useState } from 'react';
import { getInternshipCertificates } from '../../api/internshipApi';
import { EnrollmentRequired, WorkspaceError, WorkspaceLoading } from '../../components/InternshipState';
import { useInternship } from '../../context/internshipContextValue';

export default function InternshipCertificates() {
  const workspace = useInternship(); const [result, setResult] = useState(null); const [error, setError] = useState('');
  useEffect(() => { if (workspace.data?.enrollment) getInternshipCertificates().then(setResult).catch(err => setError(err.response?.data?.detail || 'Credentials could not be loaded.')); }, [workspace.data?.enrollment]);
  if (workspace.loading || (workspace.data?.enrollment && !result && !error)) return <WorkspaceLoading />;
  if (workspace.error || error) return <WorkspaceError message={workspace.error || error} onRetry={() => window.location.reload()} />;
  if (!workspace.data?.enrollment) return <EnrollmentRequired />;
  return <div className="space-y-5"><div><h1 className="text-2xl font-bold">Proof-of-work credentials</h1><p className="text-sm text-[var(--text-muted)] mt-1">Credentials are issued from database evidence after completion; no browser-local certificate data is used.</p></div><div className="grid md:grid-cols-2 gap-5">{result.certificates.map(cert => <article key={cert.id} className="p-6 rounded-2xl bg-[var(--bg-sidebar)] border border-[var(--border-color)]"><div className="flex justify-between"><i className="fa-solid fa-award text-3xl text-amber-500" /><span className={`text-[10px] font-bold ${cert.verified ? 'text-emerald-600' : 'text-amber-600'}`}>{cert.verified ? 'VERIFIED' : 'PENDING VERIFICATION'}</span></div><h2 className="text-lg font-bold mt-5">{cert.track_name}</h2><p className="text-xs text-[var(--text-muted)] mt-1">{cert.plan_name}</p><div className="text-3xl font-bold text-emerald-600 mt-4">{cert.score}/100</div><div className="text-[10px] mt-2">Credential ID: {cert.uid}</div>{cert.pdf_url && <a href={cert.pdf_url} target="_blank" rel="noreferrer" className="inline-block mt-4 text-xs text-emerald-600 font-bold">Download credential →</a>}</article>)}{!result.certificates.length && <div className="md:col-span-2 p-10 text-center rounded-2xl border border-dashed border-[var(--border-color)]"><h2 className="font-bold">Credential in progress</h2><p className="text-sm text-[var(--text-muted)] mt-2">Complete all published evidence tasks with an average score of at least 60, then finish verification.</p></div>}</div></div>;
}
