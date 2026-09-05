import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEnrollment, updateEnrollmentDifficulty } from '../../api/internshipApi';
import { useInternship } from '../../context/internshipContextValue';
import { WorkspaceError, WorkspaceLoading } from '../../components/InternshipState';

export default function InternshipEnroll() {
  const { data, loading, error, reload } = useInternship();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [planId, setPlanId] = useState('');
  const [trackId, setTrackId] = useState('');
  const [level, setLevel] = useState('intermediate');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const catalog = data?.catalog;

  useEffect(() => {
    if (!catalog || planId || trackId) return;
    const plan = catalog.plans.find(item => item.key === '15day') || catalog.plans[0];
    const track = catalog.tracks.find(item => item.key === 'aiml') || catalog.tracks[0];
    setPlanId(plan?.id || ''); setTrackId(track?.id || '');
  }, [catalog, planId, trackId]);

  const availability = useMemo(() => catalog?.availability?.[`${trackId}:${planId}`], [catalog, trackId, planId]);
  if (loading) return <WorkspaceLoading />;
  if (error) return <WorkspaceError message={error} onRetry={reload} />;

  if (data?.enrollment) {
    const enrollment = data.enrollment;
    const changeLevel = async (next) => {
      setSaving(true); setMessage('');
      try { await updateEnrollmentDifficulty(enrollment.id, next); setLevel(next); await reload(); setMessage('Difficulty updated. Future briefs now use this level.'); }
      catch (requestError) { setMessage(requestError.response?.data?.detail || 'Could not update difficulty.'); }
      finally { setSaving(false); }
    };
    return <div className="space-y-6 max-w-5xl mx-auto"><section className="bg-[var(--bg-sidebar)] border border-[var(--border-color)] rounded-2xl p-6"><div className="flex flex-col sm:flex-row justify-between gap-4"><div><span className="text-[10px] uppercase tracking-widest text-emerald-600 font-bold">Active internship</span><h1 className="text-2xl font-bold mt-2">{enrollment.track.name}</h1><p className="text-sm text-[var(--text-muted)] mt-1">{enrollment.plan.name} · Day {enrollment.current_day}/{enrollment.total_days}</p></div><span className="h-fit px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold">● {enrollment.status}</span></div></section>{message && <div className="p-3 rounded-xl bg-blue-500/10 text-blue-700 text-sm">{message}</div>}<section className="bg-[var(--bg-sidebar)] border border-[var(--border-color)] rounded-2xl p-6"><h2 className="font-bold">Adaptive difficulty</h2><p className="text-xs text-[var(--text-muted)] mt-1">Change the depth of upcoming requirements without replacing your enrollment or history.</p><div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5">{catalog.levels.map(item => <button disabled={saving} key={item.key} onClick={() => changeLevel(item.key)} className={`text-left p-4 rounded-xl border transition ${enrollment.difficulty_level === item.key ? 'border-emerald-500 bg-emerald-500/5' : 'border-[var(--border-color)]'}`}><div className="font-bold capitalize">{item.name}</div><div className="text-xs text-[var(--text-muted)] mt-1">{item.description}</div></button>)}</div></section><button onClick={() => navigate('/internship')} className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold">Open workspace</button></div>;
  }

  const enroll = async () => {
    setSaving(true); setMessage('');
    try { await createEnrollment({ plan_id: planId, track_id: trackId, difficulty_level: level }); await reload(); navigate('/internship'); }
    catch (requestError) { const detail = requestError.response?.data?.detail; setMessage(typeof detail === 'string' ? detail : detail?.message || 'Enrollment could not be created.'); }
    finally { setSaving(false); }
  };

  return <div className="max-w-6xl mx-auto space-y-5"><div className="flex items-center gap-2">{['Plan','Track','Level','Confirm'].map((label,index) => <div key={label} className="flex-1"><button onClick={() => index + 1 <= step && setStep(index + 1)} className={`w-full py-3 rounded-xl border text-xs font-bold ${step === index + 1 ? 'border-emerald-500 text-emerald-600 bg-emerald-500/5' : 'border-[var(--border-color)] text-[var(--text-muted)]'}`}>{index + 1}. {label}</button></div>)}</div>{message && <div className="p-3 rounded-xl bg-rose-500/10 text-rose-700 text-sm">{message}</div>}<section className="bg-[var(--bg-sidebar)] border border-[var(--border-color)] rounded-2xl p-6">
    {step === 1 && <><h1 className="text-xl font-bold">Choose a Sprint Internship plan</h1><p className="text-sm text-[var(--text-muted)] mt-1">Plans are loaded from Supabase. A combination unlocks only when all required days are published.</p><div className="grid md:grid-cols-3 gap-4 mt-6">{catalog.plans.map(plan => { const state = catalog.availability?.[`${trackId}:${plan.id}`]; return <button key={plan.id} onClick={() => setPlanId(plan.id)} className={`text-left p-5 rounded-2xl border ${planId === plan.id ? 'border-emerald-500 bg-emerald-500/5' : 'border-[var(--border-color)]'}`}><div className="flex justify-between"><strong>{plan.name}</strong><span className="font-bold">₹{plan.price}</span></div><p className="text-xs text-[var(--text-muted)] mt-2">{plan.duration_days} days · {plan.total_tasks} project reviews</p><div className="mt-4 space-y-1">{plan.features.map(feature => <div key={feature} className="text-xs">✓ {feature}</div>)}</div>{state && !state.available && <div className="mt-3 text-[10px] text-amber-600">{state.available_days}/{state.required_days} days published for selected track</div>}</button>; })}</div></>}
    {step === 2 && <><h1 className="text-xl font-bold">Select your professional track</h1><div className="grid md:grid-cols-3 gap-4 mt-6">{catalog.tracks.map(track => { const state = catalog.availability?.[`${track.id}:${planId}`]; return <button key={track.id} onClick={() => setTrackId(track.id)} className={`text-left p-5 rounded-2xl border ${trackId === track.id ? 'border-emerald-500 bg-emerald-500/5' : 'border-[var(--border-color)]'}`}><i className={`fa-solid ${track.icon} text-emerald-600`} /><div className="font-bold mt-3">{track.name}</div><p className="text-xs text-[var(--text-muted)] mt-1">{track.description}</p><span className={`inline-block mt-3 text-[10px] font-bold ${state?.available ? 'text-emerald-600' : 'text-amber-600'}`}>{state?.available ? 'Ready to enroll' : `${state?.available_days || 0}/${state?.required_days || 0} days published`}</span></button>; })}</div></>}
    {step === 3 && <><h1 className="text-xl font-bold">Choose adaptive difficulty</h1><div className="grid md:grid-cols-3 gap-4 mt-6">{catalog.levels.map(item => <button key={item.key} onClick={() => setLevel(item.key)} className={`text-left p-5 rounded-2xl border ${level === item.key ? 'border-emerald-500 bg-emerald-500/5' : 'border-[var(--border-color)]'}`}><div className="font-bold">{item.name}</div><p className="text-xs text-[var(--text-muted)] mt-2">{item.description}</p></button>)}</div></>}
    {step === 4 && <><h1 className="text-xl font-bold">Confirm your workspace</h1><div className="mt-5 p-5 rounded-xl border border-[var(--border-color)] text-sm space-y-2"><p><strong>Plan:</strong> {catalog.plans.find(item => item.id === planId)?.name}</p><p><strong>Track:</strong> {catalog.tracks.find(item => item.id === trackId)?.name}</p><p><strong>Level:</strong> <span className="capitalize">{level}</span></p><p><strong>Content:</strong> {availability?.available_days || 0} published days</p><p className="text-xs text-[var(--text-muted)]">Enrollment mode: {catalog.enrollment_mode === 'beta' ? 'Beta access (payment waived and audited)' : 'Verified checkout required'}</p></div></>}
    <div className="mt-6 pt-5 border-t border-[var(--border-color)] flex justify-between"><button disabled={step === 1} onClick={() => setStep(value => Math.max(1, value - 1))} className="px-4 py-2 rounded-xl border border-[var(--border-color)] text-xs font-bold disabled:opacity-30">Back</button>{step < 4 ? <button onClick={() => setStep(value => value + 1)} className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold">Continue</button> : <button disabled={saving || !availability?.available} onClick={enroll} className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold disabled:opacity-40">{saving ? 'Creating workspace…' : availability?.available ? 'Start internship' : 'Content not fully published'}</button>}</div>
  </section></div>;
}
