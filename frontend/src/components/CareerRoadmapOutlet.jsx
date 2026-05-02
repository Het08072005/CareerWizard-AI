import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRoadmap } from '../api/profile';
import { CheckIcon, SparklesIcon } from './ui/Icons';

const customScrollbarStyle = `
  .dark-roadmap-scroll::-webkit-scrollbar { width: 4px; }
  .dark-roadmap-scroll::-webkit-scrollbar-track { background: transparent; }
  .dark-roadmap-scroll::-webkit-scrollbar-thumb { background-color: #222; border-radius: 20px; }
  .dark-roadmap-scroll::-webkit-scrollbar-thumb:hover { background-color: #333; }
`;

// --- HELPERS ---
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch {
      // LocalStorage error catch
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};

const TechnicalSpinner = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-spin">
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
      <rect
        key={i}
        x="11"
        y="2"
        width="2"
        height="6"
        rx="1"
        fill={color}
        transform={`rotate(${angle} 12 12)`}
        style={{ opacity: 0.2 + (i * 0.1) }}
      />
    ))}
  </svg>
);

const SkeletonPulse = () => (
  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent animate-shimmer-fast" style={{ backgroundSize: '200% 100%' }} />
);

const RoadmapSkeleton = () => (
  <div className="space-y-6 w-full py-10 opacity-10">
    {[1, 2].map((i) => (
      <div key={i} className="relative pl-14 pb-10">
        <div className="absolute left-[19px] top-12 w-[1px] bg-white/5 bottom-0"></div>
        <div className="absolute left-0 top-0 w-10 h-10 rounded-full border border-white/5"></div>
        <div className="bg-[#080808] p-8 rounded-3xl border border-white/5 space-y-4">
          <SkeletonPulse />
          <div className="h-4 w-1/4 bg-white/5 rounded"></div>
          <div className="h-16 w-full bg-white/[0.01] rounded-xl"></div>
        </div>
      </div>
    ))}
  </div>
);

// --- COMPONENT ATOMS ---

const WeekComponent = ({ week, index, isLastWeek, isLastMonth }) => {
  const colors = [
    { text: 'text-indigo-400', border: 'border-indigo-500/20', bg: 'bg-indigo-500/5', shadow: 'shadow-indigo-500/20', accent: 'bg-indigo-500', link: 'decoration-indigo-500/30' },
    { text: 'text-cyan-400', border: 'border-cyan-500/20', bg: 'bg-cyan-500/5', shadow: 'shadow-cyan-500/20', accent: 'bg-cyan-400', link: 'decoration-cyan-500/30' },
    { text: 'text-violet-400', border: 'border-violet-500/20', bg: 'bg-violet-500/5', shadow: 'shadow-violet-500/20', accent: 'bg-violet-500', link: 'decoration-violet-500/30' }
  ];
  const theme = colors[index % colors.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-100px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="group/week mb-3 last:mb-0 relative pl-10 bg-white/[0.02] border border-white/[0.04] rounded-2xl transition-all duration-500 hover:bg-white/[0.04] hover:border-white/[0.08]"
    >
      {/* REFINED LUMINOUS STRING */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] py-4 pointer-events-none">
        <div className={`w-full h-full bg-gradient-to-b from-transparent ${theme.accent.replace('bg-', 'via-')} to-transparent opacity-30 group-hover/week:opacity-100 transition-all duration-700 shadow-[0_0_10px] ${theme.shadow}`} />
      </div>

      <div className="p-8 flex flex-col gap-10">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`px-2.5 py-0.5 rounded-md ${theme.bg} ${theme.text} text-[9px] font-bold uppercase tracking-widest border ${theme.border}`}>
              Seq_0{index + 1}
            </div>
            <h4 className="text-[15px] font-semibold text-white tracking-wide">{week.title}</h4>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <svg className="w-3.5 h-3.5 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span className="text-[10px] font-bold uppercase tracking-tighter opacity-40">Estimate: 14 Days</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT COLUMN: CURRICULUM & TOPICS */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Curriculum</span>
                <div className="h-[1px] flex-1 bg-white/[0.03]" />
              </div>
              <div className="flex flex-wrap gap-2.5">
                {week.topics.map((topic, i) => (
                  <span
                    key={i}
                    className={`px-3.5 py-1.5 text-[11px] font-semibold rounded-lg border transition-all duration-300 ${theme.bg} ${theme.border} ${theme.text} cursor-default hover:border-white/20`}
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Practical Application</span>
                <div className="h-[1px] flex-1 bg-white/[0.03]" />
              </div>
              <ul className="space-y-4">
                {(Array.isArray(week.miniProject) ? week.miniProject : [week.miniProject]).map((p, i) => (
                  <li key={i} className="flex items-start gap-3 group/project">
                    <div className={`mt-1 flex-shrink-0 w-4 h-4 rounded-full ${theme.bg} border ${theme.border} flex items-center justify-center`}>
                      <CheckIcon size={10} className={theme.text} />
                    </div>
                    <span className="text-slate-300 font-medium text-[13px] leading-relaxed tracking-tight">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* RIGHT COLUMN: REFERENCES */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Reference Hub</span>
              <div className="h-[1px] flex-1 bg-white/[0.03]" />
            </div>
            <div className="flex flex-col gap-3">
              {week.resources.map((res, i) => (
                <div key={i} className="group/res flex items-center gap-3 p-3 rounded-xl bg-white/[0.01] border border-white/[0.03] hover:bg-white/[0.03] hover:border-white/[0.08] transition-all cursor-pointer">
                  <div className={`w-7 h-7 rounded-lg ${theme.bg} flex items-center justify-center border ${theme.border} opacity-40 group-hover/res:opacity-100 transition-all`}>
                    <svg className={`w-3.5 h-3.5 ${theme.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  </div>
                  <span className={`text-[11px] font-semibold ${theme.text} opacity-60 group-hover/res:opacity-100 group-hover/res:text-white transition-all line-clamp-1`}>
                    {res}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const TimelineStep = ({ monthData, isLastMonth, isFirstMonth }) => {
  const match = monthData.month.match(/Month (\d+)/i);
  const monthNumber = match ? match[1] : '?';

  return (
    <div className="w-full relative pb-1">
      {/* BOX CONTAINER FOR THE MONTH */}
      <div className="bg-[#080808] border border-white/[0.05] rounded-3xl p-10 relative overflow-hidden group/month transition-all duration-700 hover:border-white/[0.08] shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/[0.02] blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.01] to-transparent pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-4 border-b border-white/[0.03] pb-4">
          <div className="flex flex-col gap-4">
            <h2 className="text-[15px] font-semibold text-indigo-400 uppercase tracking-[0.4em] underline underline-offset-8 decoration-indigo-500/30">Month {monthNumber}</h2>
            <p className="text-[11px] text-slate-400 font-medium tracking-wide leading-relaxed opacity-90 max-w-2xl mt-2">
              {monthData.goal}
            </p>
          </div>
          <div className="h-12 w-[1px] bg-white/5 hidden md:block" />
          <div className="flex items-center gap-3 bg-indigo-500/5 px-4 py-2 rounded-xl border border-indigo-500/10 shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[10px] font-semibold text-indigo-300 uppercase tracking-widest italic">
              Phase {monthNumber} Sequence
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {monthData.weeks.map((week, idx) => (
            <WeekComponent
              key={idx}
              week={week}
              index={idx}
              isLastWeek={idx === monthData.weeks.length - 1}
              isLastMonth={isLastMonth}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// --- ORCHESTRATOR ---

const CareerRoadmapOutlet = () => {
  const [targetDomain, setTargetDomain] = useLocalStorage('roadmapDomain', '');
  const [timeInMonths, setTimeInMonths] = useLocalStorage('roadmapMonths', 3);
  const [roadmap, setRoadmap] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const roadmapRef = React.useRef(null);

  const handleDownloadHTML = () => {
    if (!roadmapRef.current) return;
    setIsExporting(true);
    try {
      // Clone the roadmap element to avoid affecting the live UI
      const clone = roadmapRef.current.cloneNode(true);

      // Force all elements in the clone to be visible (overriding framer-motion initial states)
      const allElements = clone.querySelectorAll('*');
      allElements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.visibility = 'visible';
      });

      const content = clone.innerHTML;
      const styles = Array.from(document.styleSheets)
        .map(sheet => {
          try {
            return Array.from(sheet.cssRules).map(rule => rule.cssText).join('\n');
          } catch { return ''; }
        }).join('\n');

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Career Blueprint - ${targetDomain}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { background: #050505; color: #cbd5e1; font-family: sans-serif; padding: 50px; }
            ${styles}
            ${customScrollbarStyle}
            /* Extra visibility overrides for export */
            .group\\/week { opacity: 1 !important; transform: none !important; }
            div { opacity: 1 !important; transform: none !important; visibility: visible !important; }
          </style>
        </head>
        <body class="selection:bg-indigo-500/30">
          <div style="max-width: 1200px; margin: 0 auto;">
            <h1 style="color: white; font-size: 40px; font-weight: 900; margin-bottom: 50px; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px;">
              Career Blueprint: ${targetDomain}
            </h1>
            ${content}
          </div>
        </body>
        </html>
      `;

      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Career_Blueprint_${targetDomain.replace(/\s+/g, '_')}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export Error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleGenerate = async (e) => {
    e?.preventDefault();
    if (!targetDomain.trim()) return;
    setLoading(true);
    setError(null);
    setRoadmap([]);
    try {
      const response = await getRoadmap(targetDomain, parseInt(timeInMonths) || 3);
      await new Promise(r => setTimeout(r, 1200));
      setRoadmap(response?.months || []);
      localStorage.setItem('hasGenerated', 'true');
      localStorage.setItem('roadmapData', JSON.stringify(response?.months || []));
    } catch {
      setError('TRANSMISSION_PROTOCOL_FAILED');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('hasGenerated') === 'true') {
      const saved = localStorage.getItem('roadmapData');
      if (saved) setRoadmap(JSON.parse(saved));
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="w-full text-slate-200 min-h-screen bg-[#050505] p-6 md:px-12 py-12 selection:bg-indigo-500/30"
    >
      <style>{customScrollbarStyle}</style>

      {/* Grid Trace */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '60px 60px' }} />
      <div className="fixed top-0 right-0 w-[1000px] h-[1000px] bg-indigo-500/[0.012] rounded-full blur-[250px] pointer-events-none" />

      <div className="w-full max-w-[1500px] mx-auto relative z-10">

        {/* Editorial Header */}
        <div className="mb-10 border-b border-white/[0.06] pb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <h2 className="text-3xl font-semibold text-white tracking-tight leading-none cursor-default">
            Career Roadmaps
          </h2>
        </div>

        {/* Action Matrix Hub */}
        <div className="mb-16 w-full">
          <form onSubmit={handleGenerate} className="flex flex-row items-center gap-2 p-1.5 bg-white/[0.03] border border-white/5 rounded-2xl h-14 w-full group transition-all duration-500 hover:border-white/10 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.3)]">

            {/* ROLE SEGMENT */}
            <div className="flex-[3] flex items-center px-5 h-full rounded-xl bg-white/[0.02] border border-transparent transition-all focus-within:bg-white/[0.05] focus-within:border-white/5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/10 mr-4 shrink-0">
                <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest leading-none mb-1">Target Role</span>
                <input
                  type="text"
                  placeholder="e.g. Systems Architect"
                  value={targetDomain}
                  onChange={(e) => setTargetDomain(e.target.value)}
                  className="bg-transparent border-none outline-none text-white text-[12px] font-medium tracking-wide w-full placeholder-slate-700 h-5"
                />
              </div>
            </div>

            {/* DURATION SEGMENT */}
            <div className="flex-1 flex items-center px-5 h-full rounded-xl bg-white/[0.02] border border-transparent transition-all focus-within:bg-white/[0.05] focus-within:border-white/5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/10 mr-4 shrink-0">
                <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" /></svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest leading-none mb-1">Months</span>
                <input
                  type="number"
                  min="1" max="12"
                  value={timeInMonths}
                  onChange={(e) => setTimeInMonths(e.target.value)}
                  className="bg-transparent border-none outline-none text-white text-[12px] font-medium tracking-wide w-full placeholder-slate-700 h-5"
                />
              </div>
            </div>

            {/* ACTION BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="h-full px-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-semibold uppercase tracking-widest text-[10px] flex items-center gap-3 hover:from-indigo-400 hover:to-violet-500 transition-all active:scale-95 disabled:opacity-20 shrink-0 shadow-lg shadow-indigo-500/20"
            >
              <div className="relative z-10 flex items-center gap-2">
                {loading ? (
                  <>
                    <TechnicalSpinner size={14} color="white" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <span>Generate Roadmap</span>
                    <SparklesIcon size={14} className="group-hover:rotate-12 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </form>
          {error && <p className="mt-4 text-center text-rose-500 text-[10px] font-semibold uppercase tracking-widest opacity-40">!! {error} !!</p>}
        </div>

        {/* Compact Dynamic Roadmaps */}
        <div className="relative min-h-[600px]">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <RoadmapSkeleton />
              </motion.div>
            ) : roadmap.length > 0 ? (
              <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-10">
                <div ref={roadmapRef} className="space-y-2 py-10">
                  {roadmap.map((monthData, idx) => (
                    <TimelineStep
                      key={idx}
                      monthData={monthData}
                      isLastMonth={idx === roadmap.length - 1}
                      isFirstMonth={idx === 0}
                    />
                  ))}
                </div>

                {/* EXPORT CONTROL CENTER */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 pt-4 border-t border-white/[0.06] flex flex-col items-center gap-8"
                >
                  <div className="text-center space-y-3">
                    <h3 className="text-[14px] font-black text-white tracking-[0.4em] uppercase">Blueprint Transmission Complete</h3>
                    <p className="text-[11px] text-slate-500 font-bold tracking-wide uppercase opacity-60">Ready for offline storage and physical distribution</p>
                  </div>

                  <button
                    onClick={handleDownloadHTML}
                    disabled={isExporting}
                    className="group relative px-14 py-6 rounded-2xl bg-white text-black font-black text-[12px] uppercase tracking-[0.3em] transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-wait overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.15)]"
                  >
                    <div className="relative z-10 flex items-center gap-4">
                      {isExporting ? (
                        <TechnicalSpinner size={18} color="black" />
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                      )}
                      <span>{isExporting ? 'Preparing File...' : 'Dowanlod Roadmap'}</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/[0.08] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </button>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-start py-32 opacity-10">
                <h3 className="text-xs font-black text-white uppercase tracking-[2.5em] pl-[2.5em] italic">Awaiting_Neural_Sequence</h3>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default CareerRoadmapOutlet;
