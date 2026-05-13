import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRoadmap } from '../api/profile';
import { CheckIcon, SparklesIcon } from './ui/Icons';
import { ThemeContext } from '../context/ThemeContext';

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
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
      <rect
        key={i}
        x="11"
        y="2.5"
        width="2"
        height="5.5"
        rx="1"
        fill={color}
        transform={`rotate(${angle} 12 12)`}
        style={{ opacity: 0.15 + ((i / 11) * 0.85) }}
      />
    ))}
  </svg>
);

const SkeletonPulse = () => (
  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent animate-shimmer-fast" style={{ backgroundSize: '200% 100%' }} />
);

const RoadmapSkeleton = ({ isDark }) => (
  <div className="space-y-6 w-full py-10 opacity-10">
    {[1, 2].map((i) => (
      <div key={i} className="relative pl-14 pb-10">
        <div className={`absolute left-[19px] top-12 w-[1px] bottom-0 ${isDark ? 'bg-white/5' : 'bg-slate-200'}`}></div>
        <div className={`absolute left-0 top-0 w-10 h-10 rounded-full border ${isDark ? 'border-white/5' : 'border-slate-200'}`}></div>
        <div className={`p-8 rounded-3xl border space-y-4 ${isDark ? 'bg-[#080808] border-white/5' : 'bg-white border-slate-200'}`}>
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
  const { isDark } = useContext(ThemeContext);

  const typeConfigs = {
    YOUTUBE: {
      text: 'text-rose-600 dark:text-rose-400',
      label: 'YouTube'
    },
    DOCS: {
      text: 'text-cyan-600 dark:text-cyan-400',
      label: 'Docs'
    },
    PRACTICE: {
      text: 'text-violet-600 dark:text-violet-400',
      label: 'Practice'
    },
    COURSE: {
      text: 'text-indigo-600 dark:text-indigo-400',
      label: 'Course'
    },
    TOOL: {
      text: 'text-amber-600 dark:text-amber-400',
      label: 'Tool'
    }
  };

  const renderResource = (res, i) => {
    let type = "DOCS";
    let content = res;

    // Try to parse prefix from format like "YouTube: Title" or "Course: Title"
    const colonIndex = res.indexOf(':');
    if (colonIndex !== -1 && colonIndex < 12) {
      type = res.substring(0, colonIndex).trim().toUpperCase();
      content = res.substring(colonIndex + 1).trim();
    } else {
      const lower = res.toLowerCase();
      if (lower.includes("youtube") || lower.includes("video")) type = "YOUTUBE";
      else if (lower.includes("course") || lower.includes("tutorial")) type = "COURSE";
      else if (lower.includes("tool") || lower.includes("library") || lower.includes("github")) type = "TOOL";
      else if (lower.includes("practice") || lower.includes("exercise") || lower.includes("build")) type = "PRACTICE";
    }

    const config = typeConfigs[type] || typeConfigs.DOCS;

    return (
      <div key={i} className="flex items-center gap-3 py-2.5 border-b border-dashed border-slate-200/50 dark:border-white/[0.04] last:border-0 last:pb-0">
        <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider border border-slate-200 dark:border-white/10 bg-transparent shrink-0 w-[64px] text-center ${config.text}`}>
          {config.label}
        </span>
        <span className="text-[11.5px] font-semibold text-slate-600 dark:text-slate-400 leading-normal tracking-tight">
          {content}
        </span>
      </div>
    );
  };

  const numColorClass = isDark ? 'text-white' : 'text-[#111111]';
  const seqBadgeClass = isDark 
    ? 'bg-white/5 text-slate-300 border-white/10' 
    : 'bg-[#ECE9E0] text-[#111111] border-[#DDD9CD]';

  return (
    <div className={`p-8 border rounded-2xl transition-all duration-500 ${
      isDark 
        ? 'bg-white/[0.015] border-white/[0.04] hover:bg-white/[0.025] hover:border-white/[0.07] shadow-xl shadow-black/5' 
        : 'bg-white border-slate-200/70 hover:bg-slate-50/30 hover:border-slate-300 shadow-md shadow-slate-100/20'
    }`}>
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-150/50 dark:border-white/[0.03] pb-4 mb-6">
        <div className="flex items-center gap-3.5">
          <div className={`px-2.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border ${seqBadgeClass}`}>
            Seq_0{index + 1}
          </div>
          <h4 className="text-[15.5px] font-bold text-[var(--text-main)] tracking-tight">{week.title}</h4>
        </div>
        <div className="flex items-center gap-1.5 text-[var(--text-muted)] opacity-70">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span className="text-[9.5px] font-bold uppercase tracking-wider">Estimate: 14 days</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* LEFT COLUMN: CURRICULUM (takes 7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-3.5">
          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Curriculum</span>
          <div className="flex flex-col gap-2">
            {week.topics.map((topic, i) => (
              <div
                key={i}
                className={`w-full px-4 py-3 text-[12px] font-semibold rounded-lg border transition-all duration-300 flex items-center gap-3.5 ${
                  isDark 
                    ? 'bg-white/[0.012] border-white/[0.04] text-slate-300 hover:bg-white/[0.025]' 
                    : 'bg-[#F9F8F6] border-[#ECE9E0] text-slate-700 hover:bg-[#F2EFF6]'
                }`}
              >
                <span className={`flex-shrink-0 w-5.5 h-5.5 rounded-full bg-[#ECE9E0] dark:bg-white/10 ${numColorClass} text-[11px] font-black flex items-center justify-center border border-[#DDD9CD] dark:border-white/15 shadow-sm`}>
                  {i + 1}
                </span>
                <span className="leading-relaxed">{topic}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: PROJECTS + REFERENCE HUB (takes 5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-7">
          {/* PROJECTS */}
          <div className="flex flex-col gap-3.5">
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Projects</span>
            <div className="flex flex-col gap-2">
              {(Array.isArray(week.miniProject) ? week.miniProject : [week.miniProject]).map((p, i) => (
                <div
                  key={i}
                  className={`w-full px-4 py-3 text-[12px] font-semibold rounded-lg border transition-all duration-300 flex items-start gap-3.5 ${
                    isDark 
                      ? 'bg-white/[0.012] border-white/[0.04] text-slate-300 hover:bg-white/[0.025]' 
                      : 'bg-[#F9F8F6] border-[#ECE9E0] text-slate-700 hover:bg-[#F2EFF6]'
                  }`}
                >
                  <span className={`flex-shrink-0 w-5.5 h-5.5 rounded-md bg-[#ECE9E0] dark:bg-white/10 ${numColorClass} text-[11px] font-black flex items-center justify-center border border-[#DDD9CD] dark:border-white/15 shadow-sm`}>
                    {i + 1}
                  </span>
                  <span className="leading-relaxed text-slate-600 dark:text-slate-400 font-semibold text-[11.5px] tracking-tight">{p}</span>
                </div>
              ))}
            </div>
          </div>

          {/* REFERENCE HUB */}
          <div className="flex flex-col gap-3 border-t border-slate-100 dark:border-white/[0.03] pt-6">
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Reference Hub</span>
            <div className="flex flex-col bg-transparent border-0 p-0">
              {week.resources.map((res, i) => renderResource(res, i))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TimelineStep = ({ monthData, isLastMonth, isFirstMonth }) => {
  const { isDark } = useContext(ThemeContext);
  const match = monthData.month.match(/Month (\d+)/i);
  const monthNumber = match ? match[1] : '?';

  return (
    <div className="w-full relative pb-1">
      {/* BOX CONTAINER FOR THE MONTH */}
      <div className={`border rounded-3xl p-8 relative overflow-hidden group/month transition-all duration-700 shadow-xl ${
        isDark ? 'bg-[#0a0a0a] border-[var(--border-color)]' : 'bg-[#FAF9F5]/90 border-[#E5E2D9]'
      }`}>
        {/* Header Block exactly like Image 3 */}
        <div className="flex flex-col gap-1 mb-5">
          <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-white' : 'text-black'}`}>
            Month {monthNumber}
          </span>
          <h2 className="text-lg font-extrabold text-[var(--text-main)] tracking-tight">
            Phase {parseInt(monthNumber) * 2 - 1} & {parseInt(monthNumber) * 2}
          </h2>
          <p className="text-[11.5px] text-[var(--text-muted)] font-medium leading-relaxed max-w-3xl mt-0.5">
            {monthData.goal}
          </p>
        </div>

        {/* Vertical stacked weeks with inner 2 columns layout */}
        <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-white/[0.03]">
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
  const { isDark } = useContext(ThemeContext);
  const [targetDomain, setTargetDomain] = useLocalStorage('roadmapDomain', '');
  const [timeInMonths, setTimeInMonths] = useLocalStorage('roadmapMonths', 3);
  const [roadmap, setRoadmap] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const roadmapRef = React.useRef(null);

  const iconWrapperClass = isDark
    ? 'bg-white/5 text-slate-300'
    : 'bg-[#ECE9E0] text-[#5C5952]';

  const actionBtnClass = isDark
    ? 'bg-gradient-to-br from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 shadow-indigo-500/20'
    : 'bg-[#1E1D1A] hover:bg-[#2D2B27] shadow-[#1E1D1A]/15 text-[#FAF9F5]';

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
      className="w-full text-[var(--text-main)] min-h-screen bg-[var(--bg-main)] p-6 md:px-12 py-12 selection:bg-indigo-500/30 transition-colors duration-500"
    >
      <style>{customScrollbarStyle}</style>

      {/* Grid Trace */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '60px 60px' }} />
      <div className={`fixed top-0 right-0 w-[1000px] h-[1000px] bg-indigo-500/[0.012] rounded-full blur-[250px] pointer-events-none ${isDark ? '' : 'hidden'}`} />

      <div className="w-full max-w-[1500px] mx-auto relative z-10">

        {/* Editorial Header */}
        <div className={`mb-10 border-b pb-8 flex flex-col md:flex-row items-center justify-between gap-6 ${
          isDark ? 'border-white/[0.06]' : 'border-slate-200'
        }`}>
          <h2 className="text-3xl font-semibold tracking-tight leading-none cursor-default">
            Career Roadmaps
          </h2>
          {roadmap.length > 0 && (
            <button
              onClick={handleDownloadHTML}
              disabled={isExporting}
              title="Download Roadmap"
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 shrink-0 ${
                isDark
                  ? 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-slate-200 hover:text-white'
                  : 'bg-[#ECE9E0] hover:bg-[#DDD9CD] border-[#DDD9CD] text-slate-800 hover:text-slate-900 shadow-sm'
              }`}
            >
              {isExporting ? (
                <TechnicalSpinner size={12} color={isDark ? "white" : "black"} />
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              )}
              <span>{isExporting ? 'Preparing...' : 'Download Roadmap'}</span>
            </button>
          )}
        </div>

        {/* Action Matrix Hub */}
        <div className="mb-8 w-full">
          <form onSubmit={handleGenerate} className={`flex flex-row items-center gap-2 p-1.5 border rounded-2xl h-14 w-full group transition-all duration-500 backdrop-blur-2xl shadow-xl ${
            isDark 
              ? 'bg-white/[0.03] border-white/5 hover:border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.3)]' 
              : 'bg-[#FAF9F5]/90 border-[#E5E2D9] hover:border-[#DDD9CD]'
          }`}>

            {/* ROLE SEGMENT */}
            <div className={`flex-[3] flex items-center px-5 h-full rounded-xl border border-transparent transition-all ${
              isDark 
                ? 'bg-white/[0.02] focus-within:bg-white/[0.05] focus-within:border-indigo-500/10' 
                : 'bg-[#FAF9F5] focus-within:bg-[#EFECE6] focus-within:border-[#DDD9CD]'
            }`}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-lg mr-4 shrink-0 transition-colors ${iconWrapperClass}`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <div className="flex flex-col w-full">
                <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest leading-none mb-1">Target Role</span>
                <input
                  type="text"
                  placeholder="e.g. Systems Architect"
                  value={targetDomain}
                  onChange={(e) => setTargetDomain(e.target.value)}
                  className="bg-transparent border-none outline-none text-[var(--text-main)] text-[12px] font-medium tracking-wide w-full placeholder-slate-400 dark:placeholder-slate-700 h-5"
                />
              </div>
            </div>

            {/* DURATION SEGMENT */}
            <div className={`flex-[1.2] flex items-center px-5 h-full rounded-xl border border-transparent transition-all ${
              isDark 
                ? 'bg-white/[0.02] focus-within:bg-white/[0.05] focus-within:border-indigo-500/10' 
                : 'bg-[#FAF9F5] focus-within:bg-[#EFECE6] focus-within:border-[#DDD9CD]'
            }`}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-lg mr-4 shrink-0 transition-colors ${iconWrapperClass}`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" /></svg>
              </div>
              <div className="flex flex-col w-full">
                <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest leading-none mb-1">Months</span>
                <input
                  type="number"
                  min="1" max="12"
                  value={timeInMonths}
                  onChange={(e) => setTimeInMonths(e.target.value)}
                  className="bg-transparent border-none outline-none text-[var(--text-main)] text-[12px] font-medium tracking-wide w-full placeholder-slate-400 dark:placeholder-slate-700 h-5"
                />
              </div>
            </div>

            {/* ACTION BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className={`h-full px-8 rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center gap-3 active:scale-95 disabled:opacity-20 shrink-0 transition-all duration-300 ${actionBtnClass}`}
            >
              <div className="relative z-10 flex items-center gap-2">
                {loading ? (
                  <>
                    <TechnicalSpinner size={14} color={isDark ? "white" : "#FAF9F5"} />
                    <span>Loading...</span>
                  </>
                ) : (
                  <span>Generate Roadmap</span>
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
                <RoadmapSkeleton isDark={isDark} />
              </motion.div>
            ) : roadmap.length > 0 ? (
              <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-10">
                <div ref={roadmapRef} className="space-y-6 py-10">
                  {roadmap.map((monthData, idx) => (
                    <TimelineStep
                      key={idx}
                      monthData={monthData}
                      isLastMonth={idx === roadmap.length - 1}
                      isFirstMonth={idx === 0}
                    />
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-start py-32 opacity-10">
                <h3 className="text-xs font-black uppercase tracking-[2.5em] pl-[2.5em] italic">Awaiting_Neural_Sequence</h3>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default CareerRoadmapOutlet;
