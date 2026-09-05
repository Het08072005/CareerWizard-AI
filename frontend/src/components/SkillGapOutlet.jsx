import React, { useState, useContext } from "react";
import Roadmap from "./Roadmap";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { MASTER_ROADMAP, CAREER_ORDER } from "../data/masterRoadmap";
import { ThemeContext } from "../context/themeContextValue";
import {
  ArrowRightIcon,
  CheckIcon,
  ServerIcon,
  BrainIcon,
  CpuChipIcon,
  CloudIcon,
  TrendingUpIcon,
  BriefcaseIcon,
  LightBulbIcon,
  BoltIcon,
  DocumentMagnifyingGlassIcon,
  SparklesIcon
} from "./ui/Icons";

const ROLE_ICON_MAP = {
  fullStack: ServerIcon,
  aiMl: SparklesIcon,
  genAi: SparklesIcon,
  cloud: CloudIcon,
  dataSci: TrendingUpIcon,
  interview: BriefcaseIcon
};

const SkillGapOutlet = () => {
  const { isDark } = useContext(ThemeContext);
  const [view, setView] = useState("hub");
  const [currentRoleKey, setCurrentRoleKey] = useState("fullStack");

  const openRole = (key) => {
    if (!MASTER_ROADMAP[key]) {
      console.warn("Invalid role key selected:", key);
      return;
    }
    setCurrentRoleKey(key);
    setView("details");
    const mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goBack = () => {
    setView("hub");
    const mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className="w-full min-h-screen relative overflow-hidden font-sans bg-[var(--bg-main)] text-[var(--text-main)] p-4 md:px-8 py-5 transition-colors duration-500">
      {/* ARCHITECTURAL BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      <div className={`absolute top-0 right-0 w-[500px] h-[500px] ${isDark ? 'bg-cyan-500/5' : 'hidden'} rounded-full blur-[120px] pointer-events-none`} />
      <div className={`absolute bottom-0 left-0 w-[400px] h-[400px] ${isDark ? 'bg-indigo-500/5' : 'hidden'} rounded-full blur-[100px] pointer-events-none`} />

      <Motion.div
        key={view}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-[1400px] mx-auto relative z-10"
      >
        {view === "hub" && (
          <Motion.header variants={itemVariants} className="mb-14 flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-[var(--border-color)] pb-10 relative">
            <div className="flex flex-col gap-2 group">
              <h1 style={{ fontFamily: '"Cormorant Garamond", serif' }} className="text-4xl font-bold text-[var(--text-main)] tracking-tight leading-none transition-all duration-700 group-hover:tracking-normal cursor-default">
                Career Roadmaps
              </h1>
              <p className="text-[13px] text-[var(--text-muted)] font-medium tracking-wide max-w-xl opacity-90">
                Choose your path and get a complete step-by-step master plan for top tech jobs.
              </p>
            </div>
          </Motion.header>
        )}

        {view === "hub" ? (
          <div className="space-y-12">
            {/* Top Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {CAREER_ORDER.map((k) => {
                const r = MASTER_ROADMAP[k];
                if (k === 'interview') return null;
                const IconComponent = ROLE_ICON_MAP[k] || ServerIcon;

                return (
                  <Motion.div
                    key={r.key}
                    variants={itemVariants}
                    whileHover={{ y: -4, scale: 1.01 }}
                    onClick={() => openRole(r.key)}
                    className={`group relative border rounded-xl p-5 transition-all duration-700 cursor-pointer overflow-hidden shadow-sm ${isDark
                        ? 'bg-[#080808] border-white/5 hover:border-white/10 hover:shadow-xl'
                        : 'bg-[#fffcf7] border-[var(--gold)]/20 shadow-[0_4px_20px_rgba(160,120,64,0.05)] hover:border-[var(--gold)]/40 hover:shadow-md'
                      }`}
                  >
                    <div className={`absolute top-0 left-0 w-full h-[1px] ${isDark ? 'bg-white/5 group-hover:bg-cyan-500/15' : 'bg-slate-150 group-hover:bg-emerald-500/15'} transition-all duration-700`} />
                    <div className={`absolute inset-0 bg-gradient-to-br from-${isDark ? 'cyan' : 'emerald'}-500/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />

                    {/* Header Row: Icon & Title */}
                    <div className="flex items-center gap-3.5 mb-4">
                      <div className={`w-11 h-11 rounded-lg flex items-center justify-center transition-all duration-700 border ${isDark
                          ? 'bg-white/[0.02] border-white/5 group-hover:border-cyan-500/30'
                          : 'bg-[var(--gold)]/5 border-[var(--gold)]/20 group-hover:border-[var(--gold)]/40'
                        }`}>
                        <IconComponent size={20} className={`transition-colors duration-700 ${isDark ? 'text-slate-500 group-hover:text-cyan-400' : 'text-slate-400 group-hover:text-emerald-600'
                          }`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 style={{ fontFamily: '"Cormorant Garamond", serif' }} className={`text-[19px] font-bold tracking-tight transition-colors duration-700 truncate ${isDark ? 'text-white group-hover:text-cyan-400' : 'text-slate-800 group-hover:text-[var(--gold-dark)]'
                          }`}>{r.title}</h3>
                        <p className="text-[10px] text-[var(--text-muted)] opacity-75 font-semibold">
                          Career Roadmap
                        </p>
                      </div>
                    </div>

                    <p className="text-[11px] text-[var(--text-muted)] opacity-80 font-medium tracking-normal leading-relaxed mb-4 h-9 line-clamp-2">
                      {r.path}
                    </p>

                    <div className={`flex items-center justify-between mb-5 pt-3 border-t ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                      <div className="flex flex-col">
                        <span className="text-[8px] font-semibold tracking-wider text-slate-500 dark:text-slate-600 uppercase mb-0.5">Est. Salary</span>
                        <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 tracking-wide">{r.salary}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[8px] font-semibold tracking-wider text-slate-500 dark:text-slate-600 uppercase mb-0.5">Market Demand</span>
                        <span className="text-[11px] font-bold text-amber-600 dark:text-amber-450 tracking-wide uppercase">{r.demand}</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => { e.stopPropagation(); openRole(r.key); }}
                      className={`w-full h-10 text-[10px] font-semibold uppercase tracking-widest rounded-lg transition-all duration-500 shadow-sm relative z-20 ${isDark
                          ? 'bg-white text-black hover:bg-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                          : 'bg-[#0f172a] text-white hover:bg-emerald-600 hover:shadow-[0_0_15px_rgba(22,163,74,0.3)]'
                        }`}
                    >
                      Start Now
                    </button>
                  </Motion.div>
                );
              })}

              {/* Special Interview Prep Card */}
              {MASTER_ROADMAP['interview'] && (
                <Motion.div
                  key="interview"
                  variants={itemVariants}
                  whileHover={{ y: -4, scale: 1.01 }}
                  onClick={() => openRole("interview")}
                  className={`group relative border rounded-xl p-5 transition-all duration-700 cursor-pointer overflow-hidden shadow-sm ${isDark
                      ? 'bg-[#080808] border-indigo-500/20 hover:border-indigo-500/40 hover:shadow-xl'
                      : 'bg-[#fffcf7] border-[var(--gold)]/20 shadow-[0_4px_20px_rgba(160,120,64,0.05)] hover:border-[var(--gold)]/40 hover:shadow-md'
                    }`}
                >
                  <div className={`absolute top-0 left-0 w-full h-[1px] ${isDark ? 'bg-indigo-500/30' : 'bg-indigo-300'}`} />
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.01] to-transparent pointer-events-none" />

                  {/* Header Row: Icon & Title */}
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className={`w-11 h-11 rounded-lg flex items-center justify-center transition-all duration-700 border ${isDark ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-indigo-50 border-indigo-200'
                      }`}>
                      <BriefcaseIcon size={20} className="text-indigo-500" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 style={{ fontFamily: '"Cormorant Garamond", serif' }} className="text-[19px] font-bold text-[var(--text-main)] tracking-tight truncate">Master the Interview</h3>
                      <p className="text-[10px] text-indigo-500 font-bold tracking-wider uppercase">Preparation Set</p>
                    </div>
                  </div>

                  <p className="text-[11px] text-[var(--text-muted)] opacity-80 font-medium tracking-normal leading-relaxed mb-4 h-9 line-clamp-2">
                    Crush technical, system design, and behavioral interviews with curated prep sets.
                  </p>

                  <ul className="space-y-2 mb-5">
                    {["Real-world Scenarios", "System Design Patterns"].map((item, i) => (
                      <li key={i} className="flex items-center text-[10px] font-medium tracking-wide text-[var(--text-muted)] opacity-90">
                        <CheckIcon size={12} className="text-emerald-500 mr-2 opacity-85" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={(e) => { e.stopPropagation(); openRole("interview"); }}
                    className={`w-full h-10 text-[10px] font-semibold uppercase tracking-widest rounded-lg transition-all duration-500 shadow-sm relative z-20 ${isDark
                        ? 'bg-indigo-600 text-white hover:bg-indigo-400 hover:shadow-[0_0_15px_rgba(129,140,248,0.3)]'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-[0_0_15px_rgba(79,70,229,0.3)]'
                      }`}
                  >
                    Start Preparation
                  </button>
                </Motion.div>
              )}
            </div>

            {/* Premium Info Tip boxes */}
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 border-t ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
              <Motion.div variants={itemVariants} className={`relative group rounded-2xl p-8 overflow-hidden transition-all duration-700 border shadow-[0_4px_20px_rgba(160,120,64,0.05)] ${isDark ? 'bg-[#080808] border-white/5 hover:border-white/20' : 'bg-[#fffcf7] border-[var(--gold)]/20 hover:border-[var(--gold)]/40'
                }`}>
                <div className="absolute top-0 left-0 w-[2px] h-full bg-indigo-500/30 group-hover:bg-indigo-500 transition-all duration-700" />
                <div className="flex gap-6 items-center">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-700 ${isDark ? 'bg-indigo-500/5 border-indigo-500/10 group-hover:bg-indigo-500/10' : 'bg-indigo-50 border-indigo-200'
                    }`}>
                    <DocumentMagnifyingGlassIcon size={20} className="text-indigo-500" />
                  </div>
                  <div>
                    <h4 style={{ fontFamily: '"Cormorant Garamond", serif' }} className="text-[17px] font-bold text-[var(--text-main)] tracking-wide mb-1">Structured Learning</h4>
                    <p className="text-[11px] text-[var(--text-muted)] opacity-80 font-medium tracking-normal">Proven roadmap archives.</p>
                  </div>
                </div>
              </Motion.div>

              <Motion.div variants={itemVariants} className={`relative group rounded-2xl p-8 overflow-hidden transition-all duration-700 border shadow-[0_4px_20px_rgba(160,120,64,0.05)] ${isDark ? 'bg-[#080808] border-white/5 hover:border-white/20' : 'bg-[#fffcf7] border-[var(--gold)]/20 hover:border-[var(--gold)]/40'
                }`}>
                <div className="absolute top-0 left-0 w-[2px] h-full bg-cyan-500/30 group-hover:bg-cyan-500 transition-all duration-700" />
                <div className="flex gap-6 items-center">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-700 ${isDark ? 'bg-cyan-500/5 border-cyan-500/10 group-hover:bg-cyan-500/10' : 'bg-cyan-50 border-cyan-200'
                    }`}>
                    <TrendingUpIcon size={20} className="text-cyan-500" />
                  </div>
                  <div>
                    <h4 style={{ fontFamily: '"Cormorant Garamond", serif' }} className="text-[17px] font-bold text-[var(--text-main)] tracking-wide mb-1">Track Progress</h4>
                    <p className="text-[11px] text-[var(--text-muted)] opacity-80 font-medium tracking-normal">Goal and phase analytics.</p>
                  </div>
                </div>
              </Motion.div>

              <Motion.div variants={itemVariants} className={`relative group rounded-2xl p-8 overflow-hidden transition-all duration-700 border shadow-[0_4px_20px_rgba(160,120,64,0.05)] ${isDark ? 'bg-[#080808] border-white/5 hover:border-white/20' : 'bg-[#fffcf7] border-[var(--gold)]/20 hover:border-[var(--gold)]/40'
                }`}>
                <div className="absolute top-0 left-0 w-[2px] h-full bg-emerald-500/30 group-hover:bg-emerald-500 transition-all duration-700" />
                <div className="flex gap-6 items-center">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-700 ${isDark ? 'bg-emerald-500/5 border-emerald-500/10 group-hover:bg-emerald-500/10' : 'bg-emerald-50 border-emerald-200'
                    }`}>
                    <BoltIcon size={20} className="text-emerald-500" />
                  </div>
                  <div>
                    <h4 style={{ fontFamily: '"Cormorant Garamond", serif' }} className="text-[17px] font-bold text-[var(--text-main)] tracking-wide mb-1">Expert Tips</h4>
                    <p className="text-[11px] text-[var(--text-muted)] opacity-80 font-medium tracking-normal">Best practices to follow.</p>
                  </div>
                </div>
              </Motion.div>
            </div>
          </div>
        ) : (
          <Motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            {MASTER_ROADMAP[currentRoleKey] ? (
              <Roadmap
                roleData={MASTER_ROADMAP[currentRoleKey]}
                onBack={goBack}
              />
            ) : (
              <div className={`flex flex-col items-center justify-center py-20 border rounded-3xl ${isDark ? 'bg-[#080808] border-white/5' : 'bg-[var(--bg-sidebar)] border-slate-200'
                }`}>
                <p className="text-[var(--text-muted)] font-bold uppercase tracking-widest text-sm mb-6">Roadmap content not found</p>
                <button
                  onClick={goBack}
                  className={`px-8 py-3 font-bold uppercase tracking-[0.3em] text-[10px] rounded-xl transition-all duration-500 border ${isDark
                      ? 'bg-white text-black hover:bg-cyan-500 hover:text-white border-transparent'
                      : 'bg-slate-900 text-white hover:bg-emerald-600 border-transparent'
                    }`}
                >
                  Return to Hub
                </button>
              </div>
            )}
          </Motion.div>
        )}
      </Motion.div>
    </div>
  );
};

export default SkillGapOutlet;
