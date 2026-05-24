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
