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

const renderResource = (res, i, isDark) => {
  let type = "DOCS";
  let content = res;

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

  const typeConfigs = {
    YOUTUBE: { label: 'YouTube', color: 'text-[#ef4444] dark:text-[#f87171]', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> },
    DOCS: { label: 'Docs', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
    PRACTICE: { label: 'Practice', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg> },
    COURSE: { label: 'Course', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg> },
    TOOL: { label: 'Tool', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> }
  };
  const config = typeConfigs[type] || typeConfigs.DOCS;

  return (
    <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border transition-all duration-300 ${isDark ? 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]' : 'bg-white border-[var(--gold)]/20 hover:border-[var(--gold)]/40 shadow-sm hover:shadow-md'}`}>
      <div className={`p-2 rounded-lg border ${isDark ? 'bg-white/5 border-white/10' : 'bg-[var(--bg-main)] border-[var(--gold)]/20'} ${config.color || (isDark ? 'text-slate-300' : 'text-slate-600')}`}>
        {config.icon}
      </div>
      <div className="flex flex-col">
        <span className={`text-[9px] font-black uppercase tracking-wider mb-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{config.label}</span>
        <span className="text-[12.5px] font-semibold text-slate-700 dark:text-slate-300 leading-snug tracking-tight">
          {content}
        </span>
      </div>
    </div>
  );
};

const WeekComponent = ({ week }) => {
  const { isDark } = useContext(ThemeContext);
  const isProject = !!week.project;

  const badgeClass = isProject 
    ? (isDark ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' : 'bg-indigo-50 text-indigo-700 border-indigo-200')
    : (isDark ? 'bg-white/5 text-slate-300 border-white/10' : 'bg-[#f4efe6] text-[var(--gold-dark)] border-[var(--gold)]/30');

  const containerClass = isProject 
    ? (isDark ? 'bg-indigo-500/[0.02] border-indigo-500/10 hover:border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.03)]' : 'bg-indigo-50/30 border-indigo-100 hover:border-indigo-300 shadow-sm')
    : (isDark ? 'bg-white/[0.015] border-white/[0.04] hover:bg-white/[0.025] hover:border-white/[0.07]' : 'bg-[#fffcf7] border-[var(--gold)]/20 hover:bg-[var(--gold)]/5 hover:border-[var(--gold)]/40 shadow-[0_2px_15px_rgba(160,120,64,0.03)]');

  return (
    <div className={`p-4 md:p-5 rounded-xl border transition-all duration-300 relative overflow-hidden ${containerClass}`}>
       {isProject && <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[40px] -z-10 rounded-full" />}
       
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-100 dark:border-white/[0.03]">
          <div className="flex items-center gap-3">
             <div className={`px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border ${badgeClass}`}>
               Week {week.weekNum < 10 ? '0'+week.weekNum : week.weekNum}
             </div>
             <h4 className={`text-[14px] font-bold tracking-tight ${isProject ? (isDark ? 'text-indigo-300' : 'text-indigo-800') : 'text-[var(--text-main)]'}`}>
               {week.title}
             </h4>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6">
          <div className="lg:col-span-7 flex flex-col gap-2.5">
             <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Curriculum Topics</span>
             <div className="flex flex-col gap-2">
               {(week.days || (week.topics ? week.topics.map((t, i) => ({ day: i+1, title: t, resources: [] })) : [])).map((dayObj, i) => (
                  <details key={i} className={`group rounded-lg border transition-all duration-300 overflow-hidden ${
                    isDark ? 'bg-[#0a0a0a] border-white/5 text-slate-300' : 'bg-white border-[var(--gold)]/20 text-slate-700 shadow-sm'
                  }`}>
                    <summary className={`flex items-center gap-3 px-3 py-2 cursor-pointer list-none select-none font-semibold text-[12px] ${
                      isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-[var(--gold)]/5 hover:border-[var(--gold)]/40'
                    }`}>
                      <span className="font-bold text-[14px] text-emerald-500 mt-[1px] shrink-0">✓</span>
                      <span className="leading-relaxed flex-1">Day {dayObj.day}: {dayObj.title}</span>
                      <svg className="w-4 h-4 transition-transform duration-300 group-open:rotate-180 opacity-50 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </summary>
                    <div className={`px-4 md:px-10 pb-3 pt-4 border-t ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                      {dayObj.topics && dayObj.topics.length > 0 && (
                        <div className="mb-4">
                          <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2 block">Topics to Cover</span>
                          <ul className="list-disc pl-5 space-y-1">
                            {dayObj.topics.map((t, tidx) => (
                              <li key={tidx} className={`text-[11.5px] font-medium leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                {t}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Day Skills */}
                      {dayObj.skills && dayObj.skills.length > 0 && (
                        <div className="mb-4">
                           <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2 block">Skills Acquired</span>
                           <div className="flex flex-wrap gap-2">
                             {dayObj.skills.map((skill, sIdx) => (
                               <div key={sIdx} className={`px-2.5 py-1 rounded-md border text-[10.5px] font-bold ${
                                 isDark ? 'bg-white/[0.02] border-white/10 text-slate-300' : 'bg-white border-[var(--gold)]/20 text-slate-600 shadow-sm'
                               }`}>
                                 {skill}
                               </div>
                             ))}
                           </div>
                        </div>
                      )}

                      {/* Day Project */}
                      {dayObj.project && (
                        <div className={`mb-4 p-3 rounded-lg border flex items-start gap-3 shadow-sm ${
                          isDark ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-200' : 'bg-indigo-50 border-indigo-200 text-indigo-900'
                        }`}>
                          <SparklesIcon className="w-4 h-4 shrink-0 text-indigo-500 mt-0.5" />
                          <div className="flex flex-col">
                            <span className={`text-[9px] font-bold uppercase tracking-widest mb-1 block ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>Daily Project</span>
                            <span className="text-[12px] font-semibold leading-snug tracking-tight">{dayObj.project}</span>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col gap-2">
                        {dayObj.resources && dayObj.resources.length > 0 ? dayObj.resources.map((r, rIdx) => renderResource(r, rIdx, isDark)) : (
                          <span className="text-[10px] text-slate-400 italic">No specific resources for this day.</span>
                        )}
                      </div>
                    </div>
                  </details>
               ))}
             </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-4">
             {week.projects && week.projects.length > 0 && (
               <div className="flex flex-col gap-2">
                 <span className={`text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${
                   isProject ? 'text-indigo-500' : 'text-[var(--gold-dark)] dark:text-slate-400'
                 }`}>
                   <SparklesIcon className="w-3 h-3" /> {isProject ? 'Capstone Projects' : 'Mini Exercises'}
                 </span>
                 <div className="flex flex-col gap-2.5">
                   {week.projects.map((proj, pIdx) => (
                     <div key={pIdx} className={`p-4 rounded-xl border text-[12px] font-semibold leading-relaxed shadow-sm flex items-start gap-3 ${
                       isProject 
                         ? (isDark ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-200' : 'bg-indigo-50 border-indigo-200 text-indigo-900')
                         : (isDark ? 'bg-[#0a0a0a] border-white/10 text-slate-300' : 'bg-white border-[var(--gold)]/30 text-slate-700')
                     }`}>
                       <div className={`p-2 rounded-lg mt-0.5 shrink-0 ${
                         isProject 
                           ? 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400' 
                           : 'bg-[var(--bg-main)] text-[var(--gold-dark)] dark:text-slate-300 border border-[var(--gold)]/20'
                       }`}>
                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                           <path strokeLinecap="round" strokeLinejoin="round" d={isProject ? "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" : "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"} />
                         </svg>
                       </div>
                       {proj}
                     </div>
                   ))}
                 </div>
               </div>
             )}
             
             {week.skills && week.skills.length > 0 && (
               <div className={`flex flex-col gap-2 ${week.projects && week.projects.length > 0 ? 'border-t border-slate-100 dark:border-white/[0.03] pt-3' : ''}`}>
                  <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Skills to Learn</span>
                  <div className="flex flex-wrap gap-2">
                    {week.skills.map((skill, i) => (
                      <div key={i} className={`px-3 py-1.5 rounded-lg border text-[11.5px] font-bold shadow-sm transition-all hover:scale-105 cursor-default flex items-center gap-1.5 ${
                        isDark 
                          ? 'bg-white/[0.02] border-white/10 text-slate-300 hover:bg-white/5' 
                          : 'bg-white border-[var(--gold)]/20 text-slate-700 hover:border-[var(--gold)]/40 hover:bg-[var(--gold)]/5'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-indigo-400' : 'bg-[var(--gold-dark)]'}`} />
                        {skill}
                      </div>
                    ))}
                  </div>
               </div>
             )}

             {week.resources && week.resources.length > 0 && (
               <div className={`flex flex-col gap-2 ${((week.projects && week.projects.length > 0) || (week.skills && week.skills.length > 0)) ? 'border-t border-slate-100 dark:border-white/[0.03] pt-3' : ''}`}>
                  <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Learning Resources</span>
                  <div className="flex flex-col gap-2">
                    {week.resources.map((r, i) => renderResource(r, i, isDark))}
                  </div>
               </div>
             )}
          </div>
       </div>
    </div>
  )
}

const TimelineStep = ({ monthData, isLastMonth, isFirstMonth }) => {
  const { isDark } = useContext(ThemeContext);
  const match = monthData.month.match(/Month (\d+)/i);
  const monthNumber = match ? match[1] : '?';

  return (
    <div className="w-full relative pb-1">
      {/* BOX CONTAINER FOR THE MONTH */}
      <div className={`border rounded-2xl p-6 relative overflow-hidden group/month transition-all duration-700 shadow-sm ${
        isDark ? 'bg-[#0a0a0a] border-[var(--border-color)]' : 'bg-[#FAF9F5]/90 border-[#E5E2D9]'
      }`}>
        {/* Header Block exactly like Image 3 */}
        <div className="flex flex-col gap-1 mb-4">
          <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-white' : 'text-black'}`}>
            Month {monthNumber}
          </span>
          <h2 className="text-[18px] font-extrabold text-[var(--text-main)] tracking-tight">
            Phase {parseInt(monthNumber) * 2 - 1} & {parseInt(monthNumber) * 2}
          </h2>
          <p className="text-[11px] text-[var(--text-muted)] font-medium leading-relaxed max-w-3xl mt-0.5">
            {monthData.goal}
          </p>
        </div>

        {/* Professional Vertical Timeline */}
        <div className="relative mt-4 pt-4 border-t border-[var(--gold)]/20 dark:border-white/[0.05]">
          {/* Vertical Track Line */}
          <div className={`absolute left-[19px] top-8 bottom-6 w-[2px] ${isDark ? 'bg-white/10' : 'bg-slate-200'} rounded-full shadow-inner`} />
          
          <div className="space-y-4">
            {(monthData.weeks || monthData.days || []).map((week, idx) => (
              <div key={idx} className="relative pl-12 group/week">
                {/* Timeline Node */}
                <div className={`absolute left-[13px] top-6 w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 z-10 ${
                  week.project 
                    ? 'bg-indigo-500 border-indigo-200 shadow-[0_0_10px_rgba(99,102,241,0.6)] scale-110' 
                    : (isDark ? 'bg-[#0a0a0a] border-slate-500 group-hover/week:border-white' : 'bg-white border-slate-300 group-hover/week:border-slate-500')
                }`} />
                
                {/* Horizontal Connector Line */}
                <div className={`absolute left-[25px] top-[29px] h-[2px] w-6 -z-10 ${
                  week.project ? 'bg-indigo-200 dark:bg-indigo-900/50' : 'bg-slate-100 dark:bg-white/5'
                }`} />

                <WeekComponent week={week} />
              </div>
            ))}
          </div>
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
  const [roadmapData, setRoadmapData] = useState(null);
  const [activeTab, setActiveTab] = useState('classic');
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
    setLoading(true);
    setError(null);
    setRoadmapData(null);
    try {
      // Generate Classic Data
      const classicMonths = [];
      const totalMonths = parseInt(timeInMonths) || 3;
      const domain = targetDomain.trim() || "Full Stack Developer";
      
      for(let m=1; m<=totalMonths; m++) {
        const weeks = [];
        for(let w=1; w<=4; w++) {
          const absoluteWeek = (m-1)*4 + w;
          const isProjectWeek = absoluteWeek % 2 === 0;
          
          const weekDays = Array.from({length: 7}).map((_, i) => ({
            day: i + 1,
            title: isProjectWeek ? `Building ${domain} Feature Module ${i+1}` : `Understanding ${domain} Architecture Part ${i+1}`,
            topics: [`Core theory: Syntax, lifecycle, and best practices for module ${i+1}.`, `Implementation: Writing standard boilerplate and test cases.`, `Debugging: Identifying and resolving common edge cases.`],
            resources: [`YouTube: ${domain} Deep Dive Part ${i+1}`, `YouTube: ${domain} Crash Course Module ${i+1}`]
          }));

          weeks.push({
            weekNum: absoluteWeek,
            title: isProjectWeek ? `Build Phase: ${domain} Applications` : `Core Theory: Mastering ${domain}`,
            days: weekDays,
            projects: isProjectWeek ? [`Capstone 1: Scalable architecture design for ${domain} ecosystem.`, `Capstone 2: End-to-end integration and automated test suite deployment.`] : [`Mini-Exercise 1: Basic routing and controller setup for ${domain}.`, `Mini-Exercise 2: Write unit tests covering syntax edge cases.`, `Mini-Exercise 3: Implement data fetching and state caching.`],
            skills: [`Advanced ${domain} Concepts`, 'System Architecture', 'Performance Optimization'],
            resources: [`YouTube: ${domain} Full Masterclass 2026`, `Docs: Official ${domain} Architecture Guide`, `Practice: 50+ Hands-on coding exercises`]
          });
        }
        
        classicMonths.push({
          month: `Month ${m}`,
          goal: `Establish foundational mastery and build real-world applications in ${domain}.`,
          weeks: weeks
        });
      }

      // Generate Method 2 Data
      const method2Months = [];
      const m2Weeks = [];
      m2Weeks.push({
        weekNum: 1,
        title: `Python Foundation (Intensive)`,
        days: [
          { day: 1, title: "Environment & Basics", topics: ["Install Python", "VS Code setup", "Jupyter notebook setup", "run first program", "understand syntax basics and execution flow"], skills: ["Python language basics", "environment setup", "beginner programming understanding", "code execution flow"], project: "First Python program (Hello World + basic calculator script)", resources: ["YouTube: https://www.youtube.com/watch?v=_uQrJ0TkZlc"] },
          { day: 2, title: "Data Handling & Expressions", topics: ["Variables", "data types", "input-output functions", "operators", "type conversion", "basic arithmetic expressions"], skills: ["Python language fundamentals", "logic building", "data handling basics"], project: "Simple calculator using Python (add, subtract, multiply, divide)", resources: ["Docs: W3Schools Python"] },
          { day: 3, title: "Conditional Decision Making", topics: ["If-else conditions", "nested conditions", "logical operators", "decision making statements"], skills: ["Python logical programming", "decision making", "conditional thinking"], project: "Age eligibility checker system using Python conditions", resources: ["YouTube: https://www.youtube.com/watch?v=_uQrJ0TkZlc"] },
          { day: 4, title: "Iteration & Looping", topics: ["Loops (for loop, while loop)", "break, continue", "nested loops for pattern generation"], skills: ["Python iteration handling", "looping logic", "repetition-based problem solving"], project: "Pattern printing program (star patterns using loops)", resources: ["Practice: freeCodeCamp Python"] },
          { day: 5, title: "Modular Functions", topics: ["Functions", "arguments", "return statements", "lambda functions", "scope of variables"], skills: ["Python modular programming", "reusable code writing", "function-based logic building"], project: "Function-based calculator system using Python functions", resources: ["Docs: W3Schools Functions"] },
          { day: 6, title: "Data Structures", topics: ["Lists", "tuples", "sets", "dictionaries", "indexing, slicing, sorting, searching operations"], skills: ["Python data structures", "data handling", "structured programming"], project: "Student record management system using dictionaries in Python", resources: ["YouTube: https://www.youtube.com/watch?v=R-HLU9Fl5ug"] },
          { day: 7, title: "Object-Oriented Design", topics: ["Object-Oriented Programming (class, object, inheritance, encapsulation, polymorphism)"], skills: ["Python OOP concepts", "real-world modeling", "structured programming design"], project: "Bank management system using OOP in Python", resources: ["YouTube: https://www.youtube.com/watch?v=ZDa-Z5JzLYM"] }
        ]
      });
      method2Months.push({
        month: `Month 1`,
        goal: `Establish foundational mastery with daily intensive projects in Python.`,
        weeks: m2Weeks
      });

      const finalData = { classic: classicMonths, method2: method2Months };
      
      await new Promise(r => setTimeout(r, 1500)); // Simulate AI processing time
      setRoadmapData(finalData);
      localStorage.setItem('hasGenerated', 'true');
      localStorage.setItem('roadmapDataObj', JSON.stringify(finalData));
    } catch {
      setError('TRANSMISSION_PROTOCOL_FAILED');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('hasGenerated') === 'true') {
      const saved = localStorage.getItem('roadmapDataObj');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.classic && parsed.method2) {
             setRoadmapData(parsed);
          }
        } catch {
          // Pass
        }
      }
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="w-full text-[var(--text-main)] min-h-screen bg-[var(--bg-main)] p-4 md:px-8 py-5 selection:bg-indigo-500/30 transition-colors duration-500"
    >
      <style>{customScrollbarStyle}</style>

      {/* Grid Trace */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '60px 60px' }} />
      <div className={`fixed top-0 right-0 w-[1000px] h-[1000px] bg-indigo-500/[0.012] rounded-full blur-[250px] pointer-events-none ${isDark ? '' : 'hidden'}`} />

      <div className="w-full max-w-[1500px] mx-auto relative z-10">

        {/* Editorial Header */}
        <div className={`mb-14 flex flex-col md:flex-row md:items-center justify-between gap-8 border-b pb-10 relative ${
          isDark ? 'border-white/[0.06]' : 'border-slate-200'
        }`}>
          <div className="flex flex-col gap-2 group">
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif' }} className="text-4xl font-bold text-[var(--text-main)] tracking-tight leading-none transition-all duration-700 group-hover:tracking-normal cursor-default">
              Career Roadmaps
            </h2>
            <p className="text-[13px] text-[var(--text-muted)] font-medium tracking-wide max-w-xl opacity-90">
              Choose your path and get a complete step-by-step master plan for top tech jobs.
            </p>
          </div>
          {roadmapData && (
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
            ) : roadmapData ? (
              <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-10">
                {/* POST-GENERATION TABS */}
                <div className={`flex items-center gap-2 mb-8 p-1.5 rounded-xl border inline-flex ${isDark ? 'bg-white/[0.02] border-white/10' : 'bg-[#FAF9F5] border-[#E5E2D9]'}`}>
                  <button 
                    onClick={() => setActiveTab('classic')}
                    className={`px-6 py-2 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all ${
                      activeTab === 'classic' 
                        ? (isDark ? 'bg-white/10 text-white shadow-sm' : 'bg-white border border-[#E5E2D9] text-[var(--text-main)] shadow-sm')
                        : (isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700')
                    }`}
                  >
                    Classic Track
                  </button>
                  <button 
                    onClick={() => setActiveTab('method2')}
                    className={`px-6 py-2 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all ${
                      activeTab === 'method2' 
                        ? (isDark ? 'bg-white/10 text-white shadow-sm' : 'bg-white border border-[#E5E2D9] text-[var(--text-main)] shadow-sm')
                        : (isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700')
                    }`}
                  >
                    Day-by-Day (New)
                  </button>
                </div>

                <div ref={roadmapRef} className="space-y-6">
                  {roadmapData[activeTab].map((monthData, idx) => (
                    <TimelineStep
                      key={idx}
                      monthData={monthData}
                      isLastMonth={idx === roadmapData[activeTab].length - 1}
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


































// import React, { useState, useEffect, useContext, useRef } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { ThemeContext } from '../context/ThemeContext';

// // ─── SCROLL STYLE ────────────────────────────────────────────────────────────
// const scrollbarCSS = `
//   .cw-scroll::-webkit-scrollbar { width: 3px; }
//   .cw-scroll::-webkit-scrollbar-track { background: transparent; }
//   .cw-scroll::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.3); border-radius: 10px; }
//   @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
//   .shimmer { background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%); background-size:200% 100%; animation: shimmer 1.8s infinite; }
//   details > summary { list-style: none; }
//   details > summary::-webkit-details-marker { display: none; }
//   .tab-active-ind { background: linear-gradient(135deg, #6366f1, #8b5cf6); }
// `;

// // ─── LOCAL STORAGE HOOK ──────────────────────────────────────────────────────
// const useLS = (key, init) => {
//   const [v, sv] = useState(() => {
//     try { const i = localStorage.getItem(key); return i ? JSON.parse(i) : init; } catch { return init; }
//   });
//   useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)); } catch {} }, [key, v]);
//   return [v, sv];
// };

// // ─── ICONS ───────────────────────────────────────────────────────────────────
// const Icon = {
//   Sparkle: ({ className }) => (
//     <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
//       <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l1.5 3.5L10 8l-3.5 1.5L5 13l-1.5-3.5L0 8l3.5-1.5L5 3z M19 13l1 2.5 2.5 1-2.5 1L19 20l-1-2.5L15.5 17l2.5-1L19 13z" />
//     </svg>
//   ),
//   Calendar: ({ className }) => (
//     <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//       <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
//     </svg>
//   ),
//   Target: ({ className }) => (
//     <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//       <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
//     </svg>
//   ),
//   Book: ({ className }) => (
//     <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//       <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
//     </svg>
//   ),
//   Code: ({ className }) => (
//     <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//       <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
//     </svg>
//   ),
//   Check: ({ className }) => (
//     <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
//       <polyline points="20 6 9 17 4 12"/>
//     </svg>
//   ),
//   Arrow: ({ className }) => (
//     <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//       <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
//     </svg>
//   ),
//   Download: ({ className }) => (
//     <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//       <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
//     </svg>
//   ),
//   YouTube: ({ className }) => (
//     <svg className={className} fill="currentColor" viewBox="0 0 24 24">
//       <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
//     </svg>
//   ),
//   Docs: ({ className }) => (
//     <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//       <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
//     </svg>
//   ),
//   Wrench: ({ className }) => (
//     <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//       <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
//     </svg>
//   ),
//   Project: ({ className }) => (
//     <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//       <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
//     </svg>
//   ),
//   ChevronDown: ({ className }) => (
//     <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//       <polyline points="6 9 12 15 18 9"/>
//     </svg>
//   ),
//   Refresh: ({ className }) => (
//     <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//       <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.49"/>
//     </svg>
//   ),
//   User: ({ className }) => (
//     <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//       <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
//     </svg>
//   ),
//   Level: ({ className }) => (
//     <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//       <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
//     </svg>
//   ),
// };

// // ─── SPINNER ─────────────────────────────────────────────────────────────────
// const Spinner = ({ size = 16, color = 'currentColor' }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="animate-spin">
//     {[0,30,60,90,120,150,180,210,240,270,300,330].map((a, i) => (
//       <rect key={i} x="11" y="2.5" width="2" height="5.5" rx="1" fill={color}
//         transform={`rotate(${a} 12 12)`} style={{ opacity: 0.1 + (i / 11) * 0.9 }} />
//     ))}
//   </svg>
// );

// // ─── RESOURCE BADGE ──────────────────────────────────────────────────────────
// const ResourceBadge = ({ res, isDark }) => {
//   const lower = res.toLowerCase();
//   const isYT = lower.includes('youtube') || lower.includes('youtu.be') || lower.includes('yt:') || lower.includes('video:');
//   const isDocs = lower.includes('docs:') || lower.includes('documentation') || lower.includes('official') || lower.includes('mdn') || lower.includes('w3schools');
//   const isPractice = lower.includes('practice:') || lower.includes('exercise') || lower.includes('leetcode') || lower.includes('hackerrank') || lower.includes('project:');
//   const isTool = lower.includes('tool:') || lower.includes('github') || lower.includes('library') || lower.includes('framework');
//   const isCourse = lower.includes('course:') || lower.includes('udemy') || lower.includes('coursera') || lower.includes('freecodecamp');

//   // Extract URL if present
//   const urlMatch = res.match(/https?:\/\/[^\s]+/);
//   const url = urlMatch ? urlMatch[0] : null;

//   let type = 'DOCS', label = 'Reference', colorClass = '', bg = '', IconComp = Icon.Docs;
//   if (isYT) { type='YT'; label='YouTube'; colorClass='text-red-400'; bg=isDark?'bg-red-500/10 border-red-500/20':'bg-red-50 border-red-200'; IconComp=Icon.YouTube; }
//   else if (isPractice) { type='PR'; label='Practice'; colorClass='text-emerald-400'; bg=isDark?'bg-emerald-500/10 border-emerald-500/20':'bg-emerald-50 border-emerald-200'; IconComp=Icon.Code; }
//   else if (isCourse) { type='CR'; label='Course'; colorClass='text-violet-400'; bg=isDark?'bg-violet-500/10 border-violet-500/20':'bg-violet-50 border-violet-200'; IconComp=Icon.Book; }
//   else if (isTool) { type='TL'; label='Tool'; colorClass='text-amber-400'; bg=isDark?'bg-amber-500/10 border-amber-500/20':'bg-amber-50 border-amber-200'; IconComp=Icon.Wrench; }
//   else { colorClass=isDark?'text-blue-400':'text-blue-600'; bg=isDark?'bg-blue-500/10 border-blue-500/20':'bg-blue-50 border-blue-200'; }

//   // Clean display text
//   const cleanText = res
//     .replace(/^(youtube:|yt:|docs:|practice:|course:|tool:|video:|reference:)/i, '')
//     .replace(/https?:\/\/[^\s]+/, '')
//     .trim();

//   const content = (
//     <div className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border text-[11px] font-semibold transition-all duration-200 ${bg} ${url ? 'cursor-pointer hover:scale-[1.02] hover:shadow-md' : ''}`}>
//       <IconComp className={`w-3.5 h-3.5 shrink-0 ${colorClass}`} />
//       <div className="flex flex-col min-w-0">
//         <span className={`text-[8.5px] font-black uppercase tracking-wider mb-0.5 ${colorClass}`}>{label}</span>
//         <span className={`truncate leading-tight ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{cleanText || url}</span>
//       </div>
//       {url && <Icon.Arrow className={`w-3 h-3 shrink-0 ml-auto ${colorClass} opacity-60`} />}
//     </div>
//   );

//   return url ? <a href={url} target="_blank" rel="noopener noreferrer" className="block no-underline">{content}</a> : content;
// };

// // ─── DAY CARD ────────────────────────────────────────────────────────────────
// const DayCard = ({ day, isDark, weekNum }) => {
//   const [open, setOpen] = useState(false);

//   return (
//     <div className={`rounded-xl border transition-all duration-300 overflow-hidden ${
//       isDark ? 'bg-[#0d0d0d] border-white/[0.06] hover:border-white/10' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
//     }`}>
//       <button
//         onClick={() => setOpen(p => !p)}
//         className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
//           isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50'
//         }`}
//       >
//         {/* Day number chip */}
//         <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-[10px] font-black ${
//           isDark ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border border-indigo-200'
//         }`}>
//           {day.day}
//         </div>

//         <div className="flex-1 min-w-0">
//           <div className={`text-[12px] font-bold leading-tight truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
//             Day {day.day}: {day.title}
//           </div>
//           {day.topics && day.topics.length > 0 && (
//             <div className={`text-[10px] mt-0.5 truncate ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
//               {day.topics.slice(0, 2).join(' · ')}
//             </div>
//           )}
//         </div>

//         <div className="flex items-center gap-2 shrink-0">
//           {day.project && (
//             <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider border ${
//               isDark ? 'bg-violet-500/10 text-violet-400 border-violet-500/20' : 'bg-violet-50 text-violet-600 border-violet-200'
//             }`}>Project</span>
//           )}
//           {day.resources && day.resources.length > 0 && (
//             <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider border ${
//               isDark ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-red-50 text-red-600 border-red-200'
//             }`}>+{day.resources.length} links</span>
//           )}
//           <Icon.ChevronDown className={`w-4 h-4 transition-transform duration-300 ${open ? 'rotate-180' : ''} ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
//         </div>
//       </button>

//       <AnimatePresence>
//         {open && (
//           <motion.div
//             initial={{ height: 0, opacity: 0 }}
//             animate={{ height: 'auto', opacity: 1 }}
//             exit={{ height: 0, opacity: 0 }}
//             transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
//             className="overflow-hidden"
//           >
//             <div className={`px-4 pb-4 pt-3 border-t ${isDark ? 'border-white/[0.04]' : 'border-slate-100'} space-y-4`}>

//               {/* Topics */}
//               {day.topics && day.topics.length > 0 && (
//                 <div>
//                   <p className={`text-[8.5px] font-black uppercase tracking-[0.15em] mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Topics to Cover</p>
//                   <ul className="space-y-1.5">
//                     {day.topics.map((t, i) => (
//                       <li key={i} className="flex items-start gap-2">
//                         <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${isDark ? 'bg-indigo-500' : 'bg-indigo-400'}`} />
//                         <span className={`text-[11.5px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{t}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}

//               {/* Skills */}
//               {day.skills && day.skills.length > 0 && (
//                 <div>
//                   <p className={`text-[8.5px] font-black uppercase tracking-[0.15em] mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Skills You'll Gain</p>
//                   <div className="flex flex-wrap gap-1.5">
//                     {day.skills.map((s, i) => (
//                       <span key={i} className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${
//                         isDark ? 'bg-white/[0.03] border-white/[0.07] text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
//                       }`}>{s}</span>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Daily Project */}
//               {day.project && (
//                 <div className={`p-3 rounded-xl border flex items-start gap-3 ${
//                   isDark ? 'bg-violet-500/[0.07] border-violet-500/20' : 'bg-violet-50 border-violet-200'
//                 }`}>
//                   <Icon.Project className={`w-4 h-4 shrink-0 mt-0.5 ${isDark ? 'text-violet-400' : 'text-violet-600'}`} />
//                   <div>
//                     <p className={`text-[8.5px] font-black uppercase tracking-[0.15em] mb-1 ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>Daily Build</p>
//                     <p className={`text-[12px] font-semibold leading-relaxed ${isDark ? 'text-violet-200' : 'text-violet-900'}`}>{day.project}</p>
//                   </div>
//                 </div>
//               )}

//               {/* Resources */}
//               {day.resources && day.resources.length > 0 && (
//                 <div>
//                   <p className={`text-[8.5px] font-black uppercase tracking-[0.15em] mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Learning Resources</p>
//                   <div className="space-y-2">
//                     {day.resources.map((r, i) => <ResourceBadge key={i} res={r} isDark={isDark} />)}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// // ─── WEEK PANEL ──────────────────────────────────────────────────────────────
// const WeekPanel = ({ week, globalWeekNum, isDark }) => {
//   const [expanded, setExpanded] = useState(globalWeekNum === 1);
//   const isCapstone = week.isCapstone || week.weekType === 'capstone';

//   return (
//     <div className={`relative rounded-2xl border transition-all duration-500 overflow-hidden ${
//       isCapstone
//         ? (isDark ? 'bg-indigo-950/20 border-indigo-500/20 shadow-[0_0_40px_rgba(99,102,241,0.05)]' : 'bg-indigo-50/40 border-indigo-200 shadow-sm')
//         : (isDark ? 'bg-[#0a0a0a] border-white/[0.06] hover:border-white/10' : 'bg-white border-slate-200 shadow-sm hover:shadow-md')
//     }`}>

//       {/* Week header (always visible) */}
//       <button
//         onClick={() => setExpanded(p => !p)}
//         className={`w-full flex items-center gap-4 px-5 py-4 text-left transition-colors ${
//           isDark ? 'hover:bg-white/[0.015]' : 'hover:bg-slate-50/80'
//         }`}
//       >
//         {/* Week badge */}
//         <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 border ${
//           isCapstone
//             ? (isDark ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400' : 'bg-indigo-100 border-indigo-300 text-indigo-700')
//             : (isDark ? 'bg-white/[0.03] border-white/[0.06] text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600')
//         }`}>
//           <span className="text-[8px] font-black uppercase tracking-wider opacity-60">WK</span>
//           <span className="text-[16px] font-black leading-none">{String(globalWeekNum).padStart(2,'0')}</span>
//         </div>

//         <div className="flex-1 min-w-0">
//           <div className="flex items-center gap-2 mb-1 flex-wrap">
//             {isCapstone && (
//               <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider border ${
//                 isDark ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' : 'bg-indigo-100 text-indigo-700 border-indigo-300'
//               }`}>Capstone</span>
//             )}
//             <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider border ${
//               isDark ? 'bg-white/[0.03] text-slate-500 border-white/[0.05]' : 'bg-slate-50 text-slate-500 border-slate-200'
//             }`}>{week.days?.length || 7} Days</span>
//           </div>
//           <h4 className={`text-[14px] font-bold tracking-tight ${
//             isCapstone ? (isDark ? 'text-indigo-300' : 'text-indigo-800') : (isDark ? 'text-slate-100' : 'text-slate-900')
//           }`}>{week.title}</h4>
//           {week.goal && (
//             <p className={`text-[11px] mt-0.5 leading-relaxed ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{week.goal}</p>
//           )}
//         </div>

//         <div className="flex items-center gap-3 shrink-0">
//           {/* Skill count pill */}
//           {week.skills && week.skills.length > 0 && (
//             <div className={`hidden md:flex items-center gap-1 text-[10px] font-bold ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
//               <Icon.Code className="w-3.5 h-3.5" />
//               {week.skills.length} skills
//             </div>
//           )}
//           <div className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all duration-300 ${
//             expanded
//               ? (isDark ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400' : 'bg-indigo-50 border-indigo-200 text-indigo-600')
//               : (isDark ? 'bg-white/[0.03] border-white/[0.06] text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-500')
//           }`}>
//             <Icon.ChevronDown className={`w-4 h-4 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
//           </div>
//         </div>
//       </button>

//       {/* Expanded content */}
//       <AnimatePresence>
//         {expanded && (
//           <motion.div
//             initial={{ height: 0, opacity: 0 }}
//             animate={{ height: 'auto', opacity: 1 }}
//             exit={{ height: 0, opacity: 0 }}
//             transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
//             className="overflow-hidden"
//           >
//             <div className={`border-t ${isDark ? 'border-white/[0.04]' : 'border-slate-100'}`}>
//               <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">

//                 {/* Left: Day-by-day (2/3 width) */}
//                 <div className={`lg:col-span-2 p-5 border-r ${isDark ? 'border-white/[0.04]' : 'border-slate-100'}`}>
//                   <p className={`text-[8.5px] font-black uppercase tracking-[0.15em] mb-3 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>Day-by-Day Plan</p>
//                   <div className="space-y-2">
//                     {(week.days || []).map((day, i) => (
//                       <DayCard key={i} day={day} isDark={isDark} weekNum={globalWeekNum} />
//                     ))}
//                   </div>
//                 </div>

//                 {/* Right: Skills + Projects + Resources (1/3 width) */}
//                 <div className="p-5 space-y-5">

//                   {/* Week Skills */}
//                   {week.skills && week.skills.length > 0 && (
//                     <div>
//                       <p className={`text-[8.5px] font-black uppercase tracking-[0.15em] mb-2.5 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>Skills This Week</p>
//                       <div className="flex flex-wrap gap-1.5">
//                         {week.skills.map((s, i) => (
//                           <span key={i} className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-[10.5px] font-bold transition-all hover:scale-105 cursor-default ${
//                             isDark ? 'bg-white/[0.02] border-white/[0.07] text-slate-300 hover:bg-white/[0.05]' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
//                           }`}>
//                             <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isDark ? 'bg-indigo-400' : 'bg-indigo-500'}`} />
//                             {s}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {/* Week Projects */}
//                   {week.projects && week.projects.length > 0 && (
//                     <div>
//                       <p className={`text-[8.5px] font-black uppercase tracking-[0.15em] mb-2.5 ${
//                         isCapstone ? (isDark ? 'text-indigo-500' : 'text-indigo-600') : (isDark ? 'text-slate-600' : 'text-slate-400')
//                       }`}>
//                         {isCapstone ? '🚀 Capstone Projects' : '⚡ Mini Projects'}
//                       </p>
//                       <div className="space-y-2">
//                         {week.projects.map((proj, i) => (
//                           <div key={i} className={`p-3 rounded-xl border flex items-start gap-2.5 ${
//                             isCapstone
//                               ? (isDark ? 'bg-indigo-500/[0.08] border-indigo-500/20 text-indigo-200' : 'bg-indigo-50 border-indigo-200 text-indigo-900')
//                               : (isDark ? 'bg-white/[0.02] border-white/[0.06] text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700')
//                           }`}>
//                             <Icon.Project className={`w-4 h-4 shrink-0 mt-0.5 ${isCapstone ? (isDark ? 'text-indigo-400' : 'text-indigo-600') : (isDark ? 'text-slate-500' : 'text-slate-400')}`} />
//                             <span className="text-[11.5px] font-semibold leading-relaxed">{proj}</span>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {/* Week Resources */}
//                   {week.resources && week.resources.length > 0 && (
//                     <div>
//                       <p className={`text-[8.5px] font-black uppercase tracking-[0.15em] mb-2.5 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>Key Resources</p>
//                       <div className="space-y-2">
//                         {week.resources.map((r, i) => <ResourceBadge key={i} res={r} isDark={isDark} />)}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// // ─── MONTH SECTION ───────────────────────────────────────────────────────────
// const MonthSection = ({ monthData, monthIndex, weekOffset, isDark }) => (
//   <div className={`rounded-2xl border overflow-hidden ${
//     isDark ? 'bg-[#070707] border-white/[0.05]' : 'bg-[#FAFAF8] border-slate-200'
//   }`}>
//     {/* Month header */}
//     <div className={`px-6 py-5 border-b ${isDark ? 'border-white/[0.05]' : 'border-slate-200'}`}>
//       <div className="flex items-start justify-between gap-4 flex-wrap">
//         <div>
//           <div className="flex items-center gap-2 mb-1">
//             <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
//               Month {monthIndex + 1}
//             </span>
//             <span className={`w-4 h-[1px] ${isDark ? 'bg-white/10' : 'bg-slate-300'}`} />
//             <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-indigo-500' : 'text-indigo-600'}`}>
//               {(monthData.weeks || []).length} Weeks
//             </span>
//           </div>
//           <h3 className={`text-[20px] font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
//             {monthData.title || `Phase ${monthIndex + 1}`}
//           </h3>
//           <p className={`text-[12px] mt-1 leading-relaxed max-w-2xl ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
//             {monthData.goal}
//           </p>
//         </div>

//         {/* Month milestone badge */}
//         {monthData.milestone && (
//           <div className={`px-4 py-2 rounded-xl border text-[11px] font-bold flex items-center gap-2 shrink-0 ${
//             isDark ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
//           }`}>
//             <Icon.Check className="w-3.5 h-3.5" />
//             {monthData.milestone}
//           </div>
//         )}
//       </div>
//     </div>

//     {/* Weeks */}
//     <div className="p-4 md:p-6 space-y-3">
//       {(monthData.weeks || []).map((week, wi) => (
//         <WeekPanel
//           key={wi}
//           week={week}
//           globalWeekNum={weekOffset + wi + 1}
//           isDark={isDark}
//         />
//       ))}
//     </div>
//   </div>
// );

// // ─── SKELETON ─────────────────────────────────────────────────────────────────
// const RoadmapSkeleton = ({ isDark }) => (
//   <div className="space-y-4">
//     {[1, 2].map(i => (
//       <div key={i} className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-[#070707] border-white/[0.05]' : 'bg-[#FAFAF8] border-slate-200'}`}>
//         <div className={`px-6 py-5 border-b ${isDark ? 'border-white/[0.05]' : 'border-slate-200'}`}>
//           <div className={`h-3 w-20 rounded mb-2 shimmer ${isDark ? 'bg-white/[0.04]' : 'bg-slate-200'}`} />
//           <div className={`h-6 w-56 rounded mb-2 shimmer ${isDark ? 'bg-white/[0.03]' : 'bg-slate-200'}`} />
//           <div className={`h-4 w-3/4 rounded shimmer ${isDark ? 'bg-white/[0.02]' : 'bg-slate-100'}`} />
//         </div>
//         <div className="p-6 space-y-3">
//           {[1, 2, 3].map(j => (
//             <div key={j} className={`h-16 rounded-2xl shimmer ${isDark ? 'bg-white/[0.02]' : 'bg-slate-100'}`} />
//           ))}
//         </div>
//       </div>
//     ))}
//   </div>
// );

// // ─── SETUP GUIDE ─────────────────────────────────────────────────────────────
// const SetupGuide = ({ isDark }) => {
//   const steps = [
//     { icon: Icon.Target, title: 'Enter your goal role', desc: 'Be specific — "React Developer", "ML Engineer", "DevOps Architect"' },
//     { icon: Icon.Level, title: 'Pick your current level', desc: 'Helps the AI calibrate difficulty and skip what you already know' },
//     { icon: Icon.Calendar, title: 'Set your timeline', desc: 'Realistic timelines produce better, more achievable roadmaps' },
//     { icon: Icon.Sparkle, title: 'Generate & follow', desc: 'Expand each week, track daily tasks, and use linked YouTube resources' },
//   ];
//   return (
//     <div className={`rounded-2xl border p-6 md:p-8 ${isDark ? 'bg-[#080808] border-white/[0.05]' : 'bg-white border-slate-200 shadow-sm'}`}>
//       <div className="mb-6">
//         <h3 className={`text-[15px] font-extrabold tracking-tight mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>How to get the best roadmap</h3>
//         <p className={`text-[12px] ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Follow these four steps for a highly actionable, week-by-week plan.</p>
//       </div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         {steps.map((s, i) => (
//           <div key={i} className={`p-4 rounded-xl border relative overflow-hidden ${
//             isDark ? 'bg-white/[0.015] border-white/[0.05]' : 'bg-slate-50 border-slate-200'
//           }`}>
//             <div className={`absolute top-3 right-3 text-[32px] font-black leading-none ${isDark ? 'text-white/[0.04]' : 'text-slate-100'}`}>
//               {String(i + 1).padStart(2, '0')}
//             </div>
//             <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 border ${
//               isDark ? 'bg-indigo-500/15 border-indigo-500/20 text-indigo-400' : 'bg-indigo-50 border-indigo-200 text-indigo-600'
//             }`}>
//               <s.icon className="w-4.5 h-4.5" />
//             </div>
//             <p className={`text-[12px] font-bold mb-1 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{s.title}</p>
//             <p className={`text-[10.5px] leading-relaxed ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{s.desc}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// // ─── STATS BAR ───────────────────────────────────────────────────────────────
// const RoadmapStats = ({ data, isDark }) => {
//   const totalWeeks = data.reduce((a, m) => a + (m.weeks?.length || 0), 0);
//   const totalDays = data.reduce((a, m) => a + (m.weeks || []).reduce((b, w) => b + (w.days?.length || 0), 0), 0);
//   const totalResources = data.reduce((a, m) => a + (m.weeks || []).reduce((b, w) => b + (w.days || []).reduce((c, d) => c + (d.resources?.length || 0), 0) + (w.resources?.length || 0), 0), 0);
//   const totalProjects = data.reduce((a, m) => a + (m.weeks || []).reduce((b, w) => b + (w.projects?.length || 0), 0), 0);

//   const stats = [
//     { label: 'Months', value: data.length },
//     { label: 'Weeks', value: totalWeeks },
//     { label: 'Days Planned', value: totalDays },
//     { label: 'Resources', value: totalResources },
//     { label: 'Projects', value: totalProjects },
//   ];

//   return (
//     <div className={`rounded-2xl border px-5 py-4 flex flex-wrap items-center gap-x-8 gap-y-3 ${
//       isDark ? 'bg-[#080808] border-white/[0.05]' : 'bg-white border-slate-200 shadow-sm'
//     }`}>
//       {stats.map((s, i) => (
//         <div key={i} className="flex flex-col">
//           <span className={`text-[22px] font-black leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>{s.value}</span>
//           <span className={`text-[9.5px] font-bold uppercase tracking-wider mt-0.5 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>{s.label}</span>
//         </div>
//       ))}
//     </div>
//   );
// };

// // ─── ROADMAP DATA ENGINE ─────────────────────────────────────────────────────
// // NOTE FOR GEMINI INTEGRATION:
// // Replace `generateDummyRoadmap()` call inside handleGenerate with your
// // Gemini API call via your FastAPI/Django backend proxy like:
// //   const res = await fetch('/api/generate-roadmap', { method:'POST', body: JSON.stringify({role,level,months,focus}) });
// //   const result = await res.json();  // expects { months: [...] }
// // The JSON structure this function returns is the exact contract your backend must follow.

// const DOMAIN_DATA = {
//   // ── per-domain curated YouTube playlists & docs ──────────────────────────
//   default: {
//     yt: [
//       { title: 'Full Course for Beginners', id: 'rfscVS0vtbw' },
//       { title: 'Crash Course 2024',         id: 'ysEN5RaKOlA' },
//       { title: 'Complete Tutorial',          id: 'WPqXP_kLzpo' },
//       { title: 'Project Tutorial',           id: 'f2EqECiTBL8' },
//       { title: 'Advanced Concepts',          id: 'Ke90Tje7VS0' },
//       { title: 'Best Practices & Patterns',  id: 'SqcY0GlETPk' },
//       { title: 'Interview Prep 2024',        id: 'xozIkMnSLK0' },
//     ],
//     docs: ['https://developer.mozilla.org', 'https://www.w3schools.com', 'https://roadmap.sh'],
//     practice: ['https://leetcode.com', 'https://www.hackerrank.com', 'https://www.codewars.com'],
//   },
//   react: {
//     yt: [
//       { title: 'React Full Course – Bro Code',          id: 'CgkZ7MvWUAA' },
//       { title: 'React JS Crash Course – Traversy',      id: 'w7ejDZ8SWv8' },
//       { title: 'React Hooks Explained',                 id: 'dpw9EHDh2bM' },
//       { title: 'React Router v6 Tutorial',              id: 'Ul3y1LXxzdU' },
//       { title: 'React + TypeScript Full Course',        id: 'FJDVKeh7RJI' },
//       { title: 'Next.js 14 Full Course',                id: 'ZjAqacIC_3c' },
//       { title: 'React State Management – Redux',        id: '5yEG6GhoJBs' },
//     ],
//     docs: ['https://react.dev', 'https://nextjs.org/docs', 'https://redux-toolkit.js.org'],
//     practice: ['https://react.gg', 'https://frontendmentor.io', 'https://codesandbox.io'],
//   },
//   python: {
//     yt: [
//       { title: 'Python for Beginners – Mosh',           id: '_uQrJ0TkZlc' },
//       { title: 'Python Full Course – freeCodeCamp',     id: 'rfscVS0vtbw' },
//       { title: 'Python OOP Tutorial',                   id: 'ZDa-Z5JzLYM' },
//       { title: 'Python Data Structures',                id: 'R-HLU9Fl5ug' },
//       { title: 'FastAPI Crash Course',                  id: '7t2alSnE2-I' },
//       { title: 'Django for Beginners',                  id: 'rHux0gMZ3Eg' },
//       { title: 'Python Projects for Portfolio',         id: 'NpmFl5w_VqA' },
//     ],
//     docs: ['https://docs.python.org/3', 'https://fastapi.tiangolo.com', 'https://www.djangoproject.com'],
//     practice: ['https://leetcode.com', 'https://exercism.org/tracks/python', 'https://replit.com'],
//   },
//   ml: {
//     yt: [
//       { title: 'Machine Learning Course – Andrew Ng',   id: 'jGwO_UgTS7I' },
//       { title: 'ML with Python – Sentdex',              id: 'OGxgnH8y2NM' },
//       { title: 'Deep Learning Crash Course',            id: 'VyWAvY2CF9c' },
//       { title: 'PyTorch Full Course',                   id: 'V_xro1gewh8' },
//       { title: 'Scikit-Learn Tutorial',                 id: '0Lt9w-BxKFQ' },
//       { title: 'Neural Networks from Scratch',          id: 'Wo5dMEP_BbI' },
//       { title: 'NLP with Transformers',                 id: 'KmAISyVvE1Y' },
//     ],
//     docs: ['https://scikit-learn.org/stable', 'https://pytorch.org/docs', 'https://www.tensorflow.org/learn'],
//     practice: ['https://kaggle.com', 'https://huggingface.co', 'https://paperswithcode.com'],
//   },
//   fullstack: {
//     yt: [
//       { title: 'Full Stack Web Dev – freeCodeCamp',     id: 'nu_pCVPKzTk' },
//       { title: 'MERN Stack Full Course',                id: 'fnpmR6Q5lEc' },
//       { title: 'Node.js Crash Course',                  id: 'fBNz5xF-Kx4' },
//       { title: 'PostgreSQL Full Course',                id: 'qw--VYLpxG4' },
//       { title: 'Docker for Beginners',                  id: 'fqMOX6JJhGo' },
//       { title: 'REST API Design & Best Practices',      id: 's7wmiS2mSXY' },
//       { title: 'System Design Interview Prep',          id: 'i53Gi_K3o7I' },
//     ],
//     docs: ['https://nodejs.org/docs', 'https://expressjs.com', 'https://www.postgresql.org/docs'],
//     practice: ['https://frontendmentor.io', 'https://app.codedamn.com', 'https://www.theodinproject.com'],
//   },
//   devops: {
//     yt: [
//       { title: 'DevOps Roadmap 2024',                   id: 'j5Zsa_eOXeY' },
//       { title: 'Linux Full Course',                     id: 'sWbUDq4S6Y8' },
//       { title: 'Docker & Kubernetes – TechWorld',       id: 'X48VuDVv0do' },
//       { title: 'AWS Full Course – freeCodeCamp',        id: 'ulprqHHWlng' },
//       { title: 'Terraform for Beginners',               id: 'SLB_c_ayRMo' },
//       { title: 'CI/CD with GitHub Actions',             id: 'R8_veQiYBjI' },
//       { title: 'Kubernetes Complete Course',            id: 'X48VuDVv0do' },
//     ],
//     docs: ['https://docs.docker.com', 'https://kubernetes.io/docs', 'https://docs.aws.amazon.com'],
//     practice: ['https://killercoda.com', 'https://play.instruqt.com', 'https://labs.play-with-docker.com'],
//   },
// };

// // Pick best domain data based on role string
// const getDomainData = (role) => {
//   const r = role.toLowerCase();
//   if (r.includes('react') || r.includes('frontend') || r.includes('front end') || r.includes('ui')) return DOMAIN_DATA.react;
//   if (r.includes('python') || r.includes('django') || r.includes('flask') || r.includes('fastapi')) return DOMAIN_DATA.python;
//   if (r.includes('ml') || r.includes('machine learn') || r.includes('ai engineer') || r.includes('data sci') || r.includes('deep learn')) return DOMAIN_DATA.ml;
//   if (r.includes('full stack') || r.includes('fullstack') || r.includes('mern') || r.includes('node')) return DOMAIN_DATA.fullstack;
//   if (r.includes('devops') || r.includes('cloud') || r.includes('sre') || r.includes('kubernetes') || r.includes('docker')) return DOMAIN_DATA.devops;
//   return DOMAIN_DATA.default;
// };

// // Domain-specific week plans per month per level
// const WEEK_PLANS = {
//   beginner: [
//     // Month 1
//     [
//       { title: 'Environment Setup & Fundamentals',    goal: 'Install all tools, understand core syntax and run your first program.' },
//       { title: 'Core Concepts & Data Types',          goal: 'Master variables, data types, operators and control flow.' },
//       { title: 'Functions, Modules & Structure',      goal: 'Write reusable code with functions and understand project structure.' },
//       { title: 'Capstone: First Working Application', goal: 'Combine everything learned to build a complete mini-application.', isCapstone: true },
//     ],
//     // Month 2
//     [
//       { title: 'Object-Oriented Programming Basics',  goal: 'Understand classes, objects, inheritance and encapsulation.' },
//       { title: 'File I/O, APIs & Data Handling',      goal: 'Read/write files, call REST APIs, parse JSON data.' },
//       { title: 'Debugging, Testing & Code Quality',   goal: 'Write tests, debug effectively, follow clean code principles.' },
//       { title: 'Capstone: CRUD Application',          goal: 'Build a full CRUD application with persistent storage.', isCapstone: true },
//     ],
//     // Month 3
//     [
//       { title: 'Version Control & Collaboration',     goal: 'Master Git workflows, branching, PRs and team collaboration.' },
//       { title: 'Databases & Data Modeling',           goal: 'Design schemas, write queries, understand relationships.' },
//       { title: 'Deployment & Cloud Basics',           goal: 'Deploy your app live using a cloud platform.' },
//       { title: 'Capstone: Portfolio Project',         goal: 'Build and deploy a portfolio-worthy full project.', isCapstone: true },
//     ],
//   ],
//   intermediate: [
//     [
//       { title: 'Advanced Language Features',          goal: 'Master advanced patterns, decorators, async/await and performance.' },
//       { title: 'System Design Principles',            goal: 'Learn scalable architecture, microservices and design patterns.' },
//       { title: 'Authentication & Security',           goal: 'Implement JWT, OAuth2, rate limiting and secure coding.' },
//       { title: 'Capstone: Production-Grade API',      goal: 'Build a fully authenticated, rate-limited REST API.', isCapstone: true },
//     ],
//     [
//       { title: 'Database Optimization & Caching',     goal: 'Write efficient queries, use Redis caching and indexing strategies.' },
//       { title: 'Message Queues & Event-Driven Design',goal: 'Implement async jobs with Redis Queue / RabbitMQ / Kafka.' },
//       { title: 'Containerization with Docker',        goal: 'Dockerize applications and orchestrate with docker-compose.' },
//       { title: 'Capstone: Microservice Architecture', goal: 'Build a multi-service system with Docker networking.', isCapstone: true },
//     ],
//     [
//       { title: 'CI/CD Pipelines',                    goal: 'Automate builds, tests and deployments via GitHub Actions.' },
//       { title: 'Monitoring, Logging & Alerting',      goal: 'Set up observability with structured logs and dashboards.' },
//       { title: 'Performance & Load Testing',          goal: 'Profile bottlenecks, benchmark, and optimize under load.' },
//       { title: 'Capstone: Full Production Deploy',    goal: 'Ship a monitored, auto-deployed production system.', isCapstone: true },
//     ],
//   ],
//   advanced: [
//     [
//       { title: 'Distributed Systems Fundamentals',   goal: 'Understand CAP theorem, consensus, eventual consistency.' },
//       { title: 'High-Scale Database Engineering',     goal: 'Sharding, replication, vector search, time-series DBs.' },
//       { title: 'Advanced API Design (GraphQL/gRPC)',  goal: 'Design GraphQL schemas, implement gRPC services.' },
//       { title: 'Capstone: Distributed Data Pipeline', goal: 'Build a real-time data pipeline handling 100k+ events/sec.', isCapstone: true },
//     ],
//     [
//       { title: 'Platform Engineering & IaC',         goal: 'Terraform, Pulumi, Kubernetes operators and GitOps.' },
//       { title: 'Security Engineering & Zero Trust',   goal: 'SAST/DAST, secrets management, zero-trust networking.' },
//       { title: 'AI/ML Integration Patterns',          goal: 'Embed LLM inference, vector search, RAG pipelines.' },
//       { title: 'Capstone: Enterprise SaaS Platform',  goal: 'Build a multi-tenant SaaS with full observability stack.', isCapstone: true },
//     ],
//     [
//       { title: 'Technical Leadership & Architecture', goal: 'ADRs, RFC process, engineering trade-off decisions.' },
//       { title: 'Open Source & Community Building',    goal: 'Contribute to OSS, write technical blogs, build your brand.' },
//       { title: 'Startup & Product Engineering',       goal: 'Ship fast, measure impact, make tech-business decisions.' },
//       { title: 'Capstone: Public Portfolio + OSS PR', goal: 'Land an open-source PR and publish a technical article.', isCapstone: true },
//     ],
//   ],
// };

// // Per-day topic banks keyed by week index (0-3) and day (0-6)
// const DAY_TEMPLATES = [
//   // Week 1 – Setup & Basics
//   [
//     { title: 'Environment Setup & Hello World',         topics: ['Install required tools (IDE, runtime, package manager)', 'Understand project folder structure and config files', 'Run your first "Hello World" program and trace execution flow'], skills: ['Development environment setup', 'CLI basics', 'First program execution'] },
//     { title: 'Variables, Data Types & Operators',       topics: ['Primitive types: string, number, boolean, null/undefined', 'Type coercion and explicit casting', 'Arithmetic, comparison and logical operators with precedence'], skills: ['Data type awareness', 'Operator usage', 'Type conversion'] },
//     { title: 'Control Flow: Conditionals',              topics: ['if / else if / else chains', 'Switch statements and when to use them', 'Ternary operator and short-circuit evaluation'], skills: ['Conditional logic', 'Decision-based programming', 'Code branching'] },
//     { title: 'Loops & Iteration',                       topics: ['for, while, do-while loop patterns', 'break, continue, and loop labels', 'Nested loops and common pitfalls (infinite loops)'], skills: ['Iterative thinking', 'Loop control', 'Pattern generation'] },
//     { title: 'Functions & Scope',                       topics: ['Defining and calling functions with parameters', 'Return values and void functions', 'Variable scope: local vs global, closures intro'], skills: ['Modular code writing', 'Scope understanding', 'Code reusability'] },
//     { title: 'Arrays & Collections',                    topics: ['Array creation, indexing and slicing', 'Core methods: map, filter, reduce, find', 'Nested arrays and multi-dimensional structures'], skills: ['Array manipulation', 'Functional iteration', 'Data collection handling'] },
//     { title: 'Objects & Key-Value Structures',          topics: ['Object literals, property access and mutation', 'Destructuring assignment (array & object)', 'Spread operator and shallow vs deep copy'], skills: ['Object-oriented thinking', 'Data modeling basics', 'Destructuring patterns'] },
//   ],
//   // Week 2 – Core Concepts
//   [
//     { title: 'Object-Oriented Programming: Classes',    topics: ['Class declaration, constructor and instance properties', 'Instance methods vs static methods', 'new keyword and object instantiation'], skills: ['OOP fundamentals', 'Class-based design', 'Encapsulation'] },
//     { title: 'Inheritance & Polymorphism',              topics: ['Extending classes with inheritance chains', 'Method overriding and super() calls', 'Polymorphism patterns in real codebase examples'], skills: ['Code reuse via inheritance', 'Polymorphic design', 'OOP hierarchy'] },
//     { title: 'Error Handling & Exceptions',             topics: ['try / catch / finally blocks', 'Custom error classes and error types', 'Graceful degradation and user-friendly error messages'], skills: ['Defensive programming', 'Error propagation', 'Robust code writing'] },
//     { title: 'Asynchronous Programming Basics',         topics: ['Synchronous vs asynchronous execution model', 'Callbacks, Promises and .then()/.catch() chaining', 'async/await syntax and error handling with try/catch'], skills: ['Async thinking', 'Promise chaining', 'Non-blocking code'] },
//     { title: 'Modules & Package Management',            topics: ['Import/export module system (ESM vs CommonJS)', 'Installing and managing packages with npm/pip/etc', 'Understanding package.json / requirements.txt / go.mod'], skills: ['Modular architecture', 'Dependency management', 'Package ecosystem'] },
//     { title: 'Working with APIs (Fetch & REST)',        topics: ['HTTP methods: GET, POST, PUT, DELETE', 'Fetch API / Axios / requests library — making real calls', 'Handling JSON responses and status codes'], skills: ['REST API consumption', 'HTTP fundamentals', 'JSON data handling'] },
//     { title: 'Local Storage, Sessions & State',        topics: ['Browser storage: localStorage, sessionStorage, cookies', 'State management concept: lifting state, prop drilling', 'Persisting user preferences across sessions'], skills: ['Client-side persistence', 'State management basics', 'User session handling'] },
//   ],
//   // Week 3 – Depth & Integration
//   [
//     { title: 'Database Fundamentals',                   topics: ['Relational vs non-relational databases and when to use each', 'CRUD operations: INSERT, SELECT, UPDATE, DELETE', 'Primary keys, foreign keys and table relationships'], skills: ['SQL basics', 'Data modeling', 'Database design'] },
//     { title: 'Building Your First API Endpoint',        topics: ['Setting up a server (Express / FastAPI / Django)', 'Routing: defining GET/POST endpoints with parameters', 'Request parsing and JSON response formatting'], skills: ['Backend development', 'API design', 'Server setup'] },
//     { title: 'Authentication: JWT & Sessions',          topics: ['Password hashing with bcrypt / argon2', 'JWT creation, signing and verification flow', 'Protected routes and middleware for auth checks'], skills: ['Security fundamentals', 'Auth implementation', 'Middleware design'] },
//     { title: 'Frontend–Backend Integration',            topics: ['CORS setup and cross-origin requests', 'Connecting a React/HTML frontend to your API', 'Environment variables and API URL configuration'], skills: ['Full-stack thinking', 'CORS handling', 'Integration debugging'] },
//     { title: 'Testing: Unit & Integration',             topics: ['Unit tests with Jest / pytest / Go test', 'Integration tests and mocking external dependencies', 'Code coverage metrics and what good coverage means'], skills: ['Test-driven mindset', 'Mocking strategies', 'Code quality'] },
//     { title: 'Git Workflow & Code Review',              topics: ['Feature branch workflow: branch → PR → merge', 'Writing good commit messages (Conventional Commits)', 'Code review best practices and resolving merge conflicts'], skills: ['Git branching', 'Collaboration', 'Code review'] },
//     { title: 'Deployment Prep & Environment Config',    topics: ['Environment separation: dev / staging / prod', 'Twelve-Factor App principles for deployment', 'dotenv files, secrets management and config injection'], skills: ['Environment management', 'Config best practices', 'Deploy readiness'] },
//   ],
//   // Week 4 – Capstone
//   [
//     { title: 'Project Planning & Architecture',         topics: ['Define requirements, features and non-functional goals', 'Create a system design diagram and data model', 'Set up the project repo with proper folder structure and README'], skills: ['Project planning', 'System design thinking', 'Documentation'] },
//     { title: 'Core Feature Implementation',             topics: ['Implement the main CRUD operations end-to-end', 'Write business logic with clean separation of concerns', 'Handle edge cases, null checks and defensive logic'], skills: ['Feature development', 'Business logic', 'Edge case handling'] },
//     { title: 'UI / Frontend Build',                     topics: ['Design the UI wireframe (Figma or paper sketch)', 'Build responsive components with mobile-first layout', 'Connect UI to backend APIs with loading and error states'], skills: ['Frontend development', 'Responsive design', 'State-driven UI'] },
//     { title: 'Security & Input Validation',             topics: ['Validate and sanitize all user inputs (frontend + backend)', 'Add rate limiting and CSRF protection', 'Review OWASP Top 10 vulnerabilities and patch relevant ones'], skills: ['Security hardening', 'Input validation', 'OWASP awareness'] },
//     { title: 'Automated Testing Suite',                 topics: ['Write unit tests covering all core functions (>80% coverage)', 'Add integration tests for API endpoints with edge cases', 'Set up a pre-commit hook running tests before every commit'], skills: ['Test automation', 'Coverage analysis', 'CI readiness'] },
//     { title: 'Docker & Deployment Pipeline',            topics: ['Write a production-ready Dockerfile with multi-stage build', 'Deploy to Render / Railway / Fly.io / VPS', 'Set up GitHub Actions CI/CD: test → build → deploy'], skills: ['Containerization', 'CI/CD', 'Production deployment'] },
//     { title: 'Demo, Documentation & Showcase',         topics: ['Record a Loom walkthrough of your project features', 'Write a detailed README with setup, usage and architecture', 'Push to GitHub and add to your portfolio/LinkedIn'], skills: ['Documentation', 'Demo skills', 'Portfolio building'] },
//   ],
// ];

// const PROJECT_BANKS = {
//   beginner: [
//     'Calculator with history log', 'To-Do list with local storage', 'Weather app using OpenWeather API',
//     'Quiz app with score tracker', 'Expense tracker with charts', 'CRUD note-taking app',
//     'Personal portfolio website', 'BMI calculator with health tips', 'Random quote generator',
//     'Countdown timer app', 'Currency converter using live rates', 'Simple blog with markdown rendering',
//   ],
//   intermediate: [
//     'JWT-authenticated REST API with role-based access', 'Real-time chat app with WebSockets',
//     'E-commerce backend with cart and payment mock', 'Job board with search and filters',
//     'Social media feed with infinite scroll', 'URL shortener service with analytics',
//     'Multi-user task management API', 'File upload service with S3 integration',
//     'GraphQL API with subscriptions', 'Dockerized microservices app',
//   ],
//   advanced: [
//     'Distributed rate limiter using Redis Cluster', 'Real-time event processing pipeline with Kafka',
//     'Multi-tenant SaaS API with workspace isolation', 'AI-powered document search with RAG + pgvector',
//     'Kubernetes-deployed auto-scaling service', 'gRPC-based microservices with protobuf contracts',
//     'Zero-downtime blue-green deployment setup', 'Observability stack: Prometheus + Grafana + Loki',
//     'Terraform IaC for multi-region cloud infra', 'LLM fine-tuning pipeline with custom dataset',
//   ],
// };

// const SKILL_BANKS = {
//   week0: ['Environment setup', 'CLI fluency', 'Syntax fundamentals', 'Debugging basics'],
//   week1: ['OOP design', 'Async programming', 'REST APIs', 'Package management'],
//   week2: ['Database design', 'Authentication', 'Testing', 'Git workflow'],
//   week3: ['System design', 'Docker', 'CI/CD', 'Production deployment', 'Documentation'],
// };

// // ── MAIN GENERATOR (replace with Gemini call later) ──────────────────────────
// const generateDummyRoadmap = (role, level, numMonths, focus) => {
//   const dom = getDomainData(role);
//   const lvl = ['beginner', 'intermediate', 'advanced'].includes(level) ? level : 'beginner';
//   const weekPlans = WEEK_PLANS[lvl];
//   const projects = PROJECT_BANKS[lvl];
//   const months = [];

//   for (let m = 0; m < numMonths; m++) {
//     // Cycle week plans if more months than we have plans for
//     const monthWeekPlan = weekPlans[m % weekPlans.length];
//     const weeks = [];

//     for (let w = 0; w < 4; w++) {
//       const weekPlan   = monthWeekPlan[w];
//       const ytPool     = dom.yt;
//       const isCapstone = !!weekPlan.isCapstone;

//       // Build 7 days
//       const days = DAY_TEMPLATES[w].map((tmpl, d) => {
//         const ytEntry = ytPool[(m * 28 + w * 7 + d) % ytPool.length];
//         const ytEntry2 = ytPool[(m * 28 + w * 7 + d + 1) % ytPool.length];
//         const docUrl  = dom.docs[d % dom.docs.length];
//         const practiceUrl = dom.practice[d % dom.practice.length];

//         // Add focus-specific topic if provided
//         const extraTopic = focus.trim()
//           ? `Apply ${focus} concepts to: ${tmpl.title.toLowerCase()}`
//           : null;

//         return {
//           day: d + 1,
//           title: tmpl.title,
//           topics: extraTopic ? [...tmpl.topics, extraTopic] : tmpl.topics,
//           skills: tmpl.skills,
//           project: (d === 4 || d === 6)
//             ? projects[(m * 12 + w * 3 + d) % projects.length]
//             : null,
//           resources: [
//             `YouTube: ${role} — ${ytEntry.title} https://www.youtube.com/watch?v=${ytEntry.id}`,
//             d % 3 === 0
//               ? `Docs: Official Reference ${docUrl}`
//               : d % 3 === 1
//               ? `Practice: Hands-on Exercises ${practiceUrl}`
//               : `YouTube: ${role} — ${ytEntry2.title} https://www.youtube.com/watch?v=${ytEntry2.id}`,
//           ],
//         };
//       });

//       // Week-level resources (3-4 links)
//       const wYt1 = ytPool[(m * 4 + w) % ytPool.length];
//       const wYt2 = ytPool[(m * 4 + w + 2) % ytPool.length];
//       const weekResources = [
//         `YouTube: ${role} — ${wYt1.title} https://www.youtube.com/watch?v=${wYt1.id}`,
//         `YouTube: ${role} — ${wYt2.title} https://www.youtube.com/watch?v=${wYt2.id}`,
//         `Docs: Official Documentation ${dom.docs[w % dom.docs.length]}`,
//         `Practice: Coding Exercises ${dom.practice[w % dom.practice.length]}`,
//       ];

//       // Week skills
//       const skillKey = `week${w}`;
//       const weekSkills = [
//         ...(SKILL_BANKS[skillKey] || SKILL_BANKS.week0),
//         role,
//         ...(focus.trim() ? [focus.trim()] : []),
//       ].slice(0, 5);

//       // Week projects
//       const weekProjects = isCapstone
//         ? [
//             projects[(m * 3 + 0) % projects.length],
//             projects[(m * 3 + 1) % projects.length],
//           ]
//         : [projects[(m * 4 + w) % projects.length]];

//       weeks.push({
//         title: weekPlan.title,
//         goal: weekPlan.goal,
//         isCapstone,
//         skills: weekSkills,
//         projects: weekProjects,
//         resources: weekResources,
//         days,
//       });
//     }

//     const milestones = {
//       beginner:      ['Run your first working application', 'Build a complete CRUD app', 'Deploy a live project'],
//       intermediate:  ['Ship a production-grade API', 'Deploy with Docker & CI/CD', 'Full monitored production deploy'],
//       advanced:      ['Design a distributed pipeline', 'Own the infra as code', 'Publish OSS + technical writing'],
//     };
//     const titlePrefixes = {
//       beginner:     ['Foundations & Core Concepts', 'Building Real Features', 'Deployment & Portfolio'],
//       intermediate: ['Advanced Patterns & Architecture', 'Infrastructure & Scalability', 'Production & Observability'],
//       advanced:     ['Distributed Systems Mastery', 'Platform & Security Engineering', 'Leadership & Open Source'],
//     };
//     const monthTitles = titlePrefixes[lvl];
//     const monthMilestones = milestones[lvl];

//     months.push({
//       title: monthTitles[m % monthTitles.length] + (numMonths > 3 ? ` – Part ${Math.floor(m / 3) + 1}` : ''),
//       goal: `Become proficient in ${role} ${lvl}-level skills through structured daily practice and hands-on projects.${focus.trim() ? ` Special emphasis on ${focus}.` : ''}`,
//       milestone: monthMilestones[m % monthMilestones.length],
//       weeks,
//     });
//   }

//   return months;
// };

// // ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
// const CareerRoadmapOutlet = () => {
//   const { isDark } = useContext(ThemeContext);

//   const [role, setRole] = useLS('cw_role', '');
//   const [level, setLevel] = useLS('cw_level', 'beginner');
//   const [months, setMonths] = useLS('cw_months', 3);
//   const [focus, setFocus] = useLS('cw_focus', '');
//   const [roadmap, setRoadmap] = useLS('cw_roadmap', null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [progress, setProgress] = useState('');
//   const roadmapRef = useRef(null);

//   const levelOptions = [
//     { value: 'beginner', label: 'Beginner', desc: 'New to this field' },
//     { value: 'intermediate', label: 'Intermediate', desc: 'Some experience' },
//     { value: 'advanced', label: 'Advanced', desc: 'Looking to specialize' },
//   ];

//   const handleGenerate = async () => {
//     if (!role.trim()) { setError('Please enter your target role.'); return; }
//     setLoading(true);
//     setError('');
//     setRoadmap(null);
//     setProgress('Analyzing your career goal...');

//     const prompt = `Generate a complete ${months}-month career roadmap for someone who wants to become a ${role}. 
// Their current level is: ${level}.
// ${focus.trim() ? `Special focus areas: ${focus}` : ''}

// Requirements:
// - Each month has exactly 4 weeks.
// - Each week has exactly 7 days (day 1-7).
// - Every day has 3-4 topics, 2-3 skills, a practical project, and 2 resources (at least 1 YouTube link).
// - Week 4 of each month should be a capstone week (isCapstone: true) with bigger projects.
// - Include real, working YouTube tutorial links relevant to the topic.
// - Resources should be specific and actionable.
// - Projects should be progressively more complex each month.
// - Start from absolute basics for beginners, intermediate for intermediate level, advanced concepts for advanced level.

// Generate exactly ${months} months.`;

//     try {
//       setProgress('Generating your personalized roadmap with AI...');
      
//       // Temporary Dummy Data for UI Preview as requested
//       await new Promise(r => setTimeout(r, 1500));
//       const dummyMonths = Array.from({ length: parseInt(months) || 1 }).map((_, mIndex) => ({
//         title: `Month ${mIndex + 1}`,
//         goal: `Mastering Phase ${mIndex + 1} for ${role || 'Career'}`,
//         weeks: Array.from({ length: 4 }).map((_, wIndex) => ({
//           title: `Week ${wIndex + 1}: ${wIndex === 3 ? 'Capstone & Review' : 'Deep Dive Concepts'}`,
//           isCapstone: wIndex === 3,
//           days: Array.from({ length: 7 }).map((_, dIndex) => ({
//             day: dIndex + 1,
//             title: `Day ${dIndex + 1}: Core Implementation`,
//             topics: [
//               `Understanding fundamental syntax for ${role}`,
//               `Best practices and modern tooling`,
//               `Debugging common issues`
//             ],
//             skills: [`Problem Solving`, `Core Architecture`, `Clean Code`],
//             project: `Mini Project: Implement feature set ${dIndex + 1}`,
//             resources: [
//               `YouTube: Advanced ${role} Masterclass Part ${dIndex + 1}`,
//               `Docs: Official Documentation Guide`
//             ]
//           }))
//         }))
//       }));

//       setProgress('Finalizing your week-by-week plan...');
//       await new Promise(r => setTimeout(r, 400));
//       setRoadmap(dummyMonths);
//       setProgress('');
//     } catch (e) {
//       setError('Generation failed. Check your API connection and try again.');
//       console.error(e);
//     } finally {
//       setLoading(false);
//       setProgress('');
//     }
//   };

//   const handleExport = () => {
//     if (!roadmapRef.current) return;
//     const html = `<!DOCTYPE html><html><head><title>Career Roadmap: ${role}</title>
// <script src="https://cdn.tailwindcss.com"></script>
// <style>body{background:#050505;color:#cbd5e1;font-family:sans-serif;padding:40px}*{opacity:1!important;transform:none!important}</style>
// </head><body><div style="max-width:1100px;margin:0 auto"><h1 style="color:white;font-size:32px;font-weight:900;margin-bottom:40px;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:16px">Career Roadmap: ${role}</h1>${roadmapRef.current.innerHTML}</div></body></html>`;
//     const a = document.createElement('a');
//     a.href = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
//     a.download = `Roadmap_${role.replace(/\s+/g, '_')}.html`;
//     a.click();
//   };

//   // Compute cumulative week offsets per month
//   const weekOffsets = (roadmap || []).reduce((acc, m, i) => {
//     acc.push(i === 0 ? 0 : acc[i - 1] + (roadmap[i - 1].weeks?.length || 0));
//     return acc;
//   }, []);

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
//       className={`w-full min-h-screen p-4 md:px-8 py-6 transition-colors duration-500 ${
//         isDark ? 'bg-[#050505] text-slate-200' : 'bg-[#F8F8F6] text-slate-900'
//       }`}
//     >
//       <style>{scrollbarCSS}</style>

//       {/* Subtle grid background */}
//       <div className="fixed inset-0 pointer-events-none" style={{
//         backgroundImage: isDark
//           ? 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.025) 1px, transparent 0)'
//           : 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.04) 1px, transparent 0)',
//         backgroundSize: '48px 48px'
//       }} />
//       {isDark && <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-indigo-600/[0.025] rounded-full blur-[200px] pointer-events-none" />}

//       <div className="relative z-10 w-full max-w-[1400px] mx-auto space-y-8">

//         {/* ── HEADER ── */}
//         <div className={`flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b ${
//           isDark ? 'border-white/[0.06]' : 'border-slate-200'
//         }`}>
//           <div>
//             <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest mb-3 ${
//               isDark ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-indigo-50 border-indigo-200 text-indigo-600'
//             }`}>
//               <Icon.Sparkle className="w-3 h-3" />
//               AI-Powered · Week-by-Week
//             </div>
//             <h1 className={`text-[28px] md:text-[36px] font-extrabold tracking-tight leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
//               Career Roadmap Builder
//             </h1>
//             <p className={`text-[13px] mt-2 max-w-lg leading-relaxed ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
//               Generate a structured, day-by-day learning plan tailored to your target role — with curated YouTube resources, hands-on projects, and progressive skill building.
//             </p>
//           </div>
//           {roadmap && (
//             <button
//               onClick={handleExport}
//               className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-[11px] font-black uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shrink-0 ${
//                 isDark ? 'bg-white/[0.04] border-white/10 text-slate-300 hover:bg-white/[0.08]' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 shadow-sm'
//               }`}
//             >
//               <Icon.Download className="w-3.5 h-3.5" />
//               Export HTML
//             </button>
//           )}
//         </div>

//         {/* ── SETUP GUIDE (only show when no roadmap yet) ── */}
//         {!roadmap && <SetupGuide isDark={isDark} />}

//         {/* ── GENERATION FORM ── */}
//         <div className={`rounded-2xl border p-6 md:p-7 ${
//           isDark ? 'bg-[#080808] border-white/[0.06]' : 'bg-white border-slate-200 shadow-sm'
//         }`}>
//           <h2 className={`text-[14px] font-extrabold tracking-tight mb-5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
//             {roadmap ? 'Regenerate your roadmap' : 'Build your roadmap'}
//           </h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">

//             {/* Target Role */}
//             <div className="lg:col-span-2">
//               <label className={`block text-[9px] font-black uppercase tracking-[0.18em] mb-2 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
//                 Target Role *
//               </label>
//               <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all ${
//                 isDark ? 'bg-[#0d0d0d] border-white/[0.06] focus-within:border-indigo-500/30' : 'bg-slate-50 border-slate-200 focus-within:border-indigo-400 focus-within:bg-white'
//               }`}>
//                 <Icon.Target className={`w-4 h-4 shrink-0 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
//                 <input
//                   type="text"
//                   placeholder="e.g. Full Stack Developer, ML Engineer, DevOps..."
//                   value={role}
//                   onChange={e => { setRole(e.target.value); setError(''); }}
//                   className={`flex-1 bg-transparent outline-none text-[13px] font-medium placeholder:text-slate-500 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}
//                 />
//               </div>
//             </div>

//             {/* Duration */}
//             <div>
//               <label className={`block text-[9px] font-black uppercase tracking-[0.18em] mb-2 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
//                 Duration (Months)
//               </label>
//               <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all ${
//                 isDark ? 'bg-[#0d0d0d] border-white/[0.06] focus-within:border-indigo-500/30' : 'bg-slate-50 border-slate-200 focus-within:border-indigo-400 focus-within:bg-white'
//               }`}>
//                 <Icon.Calendar className={`w-4 h-4 shrink-0 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
//                 <input
//                   type="number"
//                   min="1" max="12"
//                   value={months}
//                   onChange={e => setMonths(Math.max(1, Math.min(12, Number(e.target.value))))}
//                   className={`flex-1 bg-transparent outline-none text-[13px] font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}
//                 />
//               </div>
//             </div>

//             {/* Special Focus */}
//             <div>
//               <label className={`block text-[9px] font-black uppercase tracking-[0.18em] mb-2 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
//                 Special Focus (optional)
//               </label>
//               <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all ${
//                 isDark ? 'bg-[#0d0d0d] border-white/[0.06] focus-within:border-indigo-500/30' : 'bg-slate-50 border-slate-200 focus-within:border-indigo-400 focus-within:bg-white'
//               }`}>
//                 <Icon.Book className={`w-4 h-4 shrink-0 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
//                 <input
//                   type="text"
//                   placeholder="e.g. React, AWS, System Design..."
//                   value={focus}
//                   onChange={e => setFocus(e.target.value)}
//                   className={`flex-1 bg-transparent outline-none text-[13px] font-medium placeholder:text-slate-500 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Level selector */}
//           <div className="mb-5">
//             <label className={`block text-[9px] font-black uppercase tracking-[0.18em] mb-2 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
//               Your Current Level
//             </label>
//             <div className="flex gap-2 flex-wrap">
//               {levelOptions.map(opt => (
//                 <button
//                   key={opt.value}
//                   onClick={() => setLevel(opt.value)}
//                   className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-[11px] font-bold transition-all ${
//                     level === opt.value
//                       ? (isDark ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300' : 'bg-indigo-50 border-indigo-400 text-indigo-700')
//                       : (isDark ? 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:border-white/10' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100')
//                   }`}
//                 >
//                   <span className={`w-2 h-2 rounded-full transition-all ${
//                     level === opt.value ? (isDark ? 'bg-indigo-400' : 'bg-indigo-500') : (isDark ? 'bg-white/20' : 'bg-slate-300')
//                   }`} />
//                   <span>{opt.label}</span>
//                   <span className={`text-[9px] font-medium ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>· {opt.desc}</span>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {error && (
//             <p className={`text-[11px] font-semibold mb-4 px-4 py-2.5 rounded-xl border ${
//               isDark ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-red-50 border-red-200 text-red-600'
//             }`}>{error}</p>
//           )}

//           {/* Generate button */}
//           <button
//             onClick={handleGenerate}
//             disabled={loading}
//             className={`w-full md:w-auto flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl font-black uppercase tracking-widest text-[11px] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed ${
//               isDark
//                 ? 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/20'
//                 : 'bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20'
//             }`}
//           >
//             {loading ? (
//               <>
//                 <Spinner size={14} color="white" />
//                 <span>{progress || 'Generating...'}</span>
//               </>
//             ) : (
//               <>
//                 <Icon.Sparkle className="w-4 h-4" />
//                 <span>{roadmap ? 'Regenerate Roadmap' : 'Generate My Roadmap'}</span>
//               </>
//             )}
//           </button>

//           {loading && progress && (
//             <p className={`text-[10px] mt-3 font-medium ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>{progress}</p>
//           )}
//         </div>

//         {/* ── ROADMAP OUTPUT ── */}
//         <AnimatePresence mode="wait">
//           {loading ? (
//             <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
//               <RoadmapSkeleton isDark={isDark} />
//             </motion.div>
//           ) : roadmap ? (
//             <motion.div key="roadmap" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

//               {/* Stats bar */}
//               <RoadmapStats data={roadmap} isDark={isDark} />

//               {/* Roadmap content */}
//               <div ref={roadmapRef} className="space-y-5 mt-5">
//                 {roadmap.map((month, mi) => (
//                   <MonthSection
//                     key={mi}
//                     monthData={month}
//                     monthIndex={mi}
//                     weekOffset={weekOffsets[mi]}
//                     isDark={isDark}
//                   />
//                 ))}
//               </div>
//             </motion.div>
//           ) : (
//             <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
//               className={`flex flex-col items-center justify-center py-24 rounded-2xl border border-dashed ${
//                 isDark ? 'border-white/[0.06]' : 'border-slate-200'
//               }`}
//             >
//               <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 border ${
//                 isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-slate-50 border-slate-200'
//               }`}>
//                 <Icon.Target className={`w-6 h-6 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
//               </div>
//               <p className={`text-[13px] font-bold mb-1 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>No roadmap generated yet</p>
//               <p className={`text-[11px] ${isDark ? 'text-slate-700' : 'text-slate-300'}`}>Fill in your details above and click Generate</p>
//             </motion.div>
//           )}
//         </AnimatePresence>

//       </div>
//     </motion.div>
//   );
// };

// export default CareerRoadmapOutlet;