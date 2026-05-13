import React, { useState, useContext } from "react";
import Roadmap from "./Roadmap";
import { motion, AnimatePresence } from "framer-motion";
import { MASTER_ROADMAP, CAREER_ORDER } from "../data/masterRoadmap";
import { ThemeContext } from "../context/ThemeContext";
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setView("hub");
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    <div className="w-full min-h-screen relative overflow-hidden font-sans bg-[var(--bg-main)] text-[var(--text-main)] p-6 md:px-12 py-10 transition-colors duration-500">
      {/* ARCHITECTURAL BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      <div className={`absolute top-0 right-0 w-[500px] h-[500px] ${isDark ? 'bg-cyan-500/5' : 'hidden'} rounded-full blur-[120px] pointer-events-none`} />
      <div className={`absolute bottom-0 left-0 w-[400px] h-[400px] ${isDark ? 'bg-indigo-500/5' : 'hidden'} rounded-full blur-[100px] pointer-events-none`} />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-[1400px] mx-auto relative z-10"
      >
        {view === "hub" && (
          <motion.header variants={itemVariants} className="mb-14 flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-[var(--border-color)] pb-10 relative">
            <div className="flex flex-col gap-2 group">
              <h1 className="text-4xl font-semibold text-[var(--text-main)] tracking-tight leading-none transition-all duration-700 group-hover:tracking-normal cursor-default">
                Career Roadmaps
              </h1>
              <p className="text-[13px] text-[var(--text-muted)] font-medium tracking-wide max-w-xl opacity-90">
                Choose your path and get a complete step-by-step master plan for top tech jobs.
              </p>
            </div>
          </motion.header>
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
                  <motion.div
                    key={r.key}
                    variants={itemVariants}
                    whileHover={{ y: -8, scale: 1.02 }}
                    onClick={() => openRole(r.key)}
                    className={`group relative border rounded-2xl p-8 transition-all duration-700 cursor-pointer overflow-hidden shadow-md ${
                      isDark 
                        ? 'bg-[#080808] border-white/5 hover:border-white/20 hover:shadow-2xl' 
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-lg'
                    }`}
                  >
                    <div className={`absolute top-0 left-0 w-full h-[1px] ${isDark ? 'bg-white/5 group-hover:bg-cyan-500/20' : 'bg-slate-200 group-hover:bg-emerald-500/20'} transition-all duration-700`} />
                    <div className={`absolute inset-0 bg-gradient-to-br from-${isDark ? 'cyan' : 'emerald'}-500/[0.015] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />

                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-10 transition-all duration-700 border ${
                      isDark 
                        ? 'bg-white/[0.02] border-white/5 group-hover:border-cyan-500/30' 
                        : 'bg-slate-50 border-slate-200 group-hover:border-emerald-500/30'
                    }`}>
                      <IconComponent size={28} className={`transition-colors duration-700 ${
                        isDark ? 'text-slate-500 group-hover:text-cyan-400' : 'text-slate-400 group-hover:text-emerald-600'
                      }`} />
                    </div>

                    <h3 className={`text-3xl font-semibold tracking-tight mb-4 transition-colors duration-700 ${
                      isDark ? 'text-white group-hover:text-cyan-400' : 'text-slate-800 group-hover:text-emerald-600'
                    }`}>{r.title}</h3>
                    
                    <p className="text-[13px] text-[var(--text-muted)] opacity-85 font-medium tracking-normal leading-relaxed italic mb-8 h-10 line-clamp-2">
                      {r.path}
                    </p>

                    <div className={`flex items-center justify-between mb-10 pt-6 border-t ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
                      <div className={`px-3 py-1.5 rounded-lg border flex flex-col items-start transition-all duration-700 ${
                        isDark ? 'border-white/5 bg-white/[0.01] group-hover:border-emerald-500/20' : 'border-slate-200 bg-slate-50 group-hover:border-emerald-500/45'
                      }`}>
                        <span className="text-[9px] font-semibold tracking-wider text-slate-500 dark:text-slate-600 mb-1 uppercase">Estimated Salary</span>
                        <span className="text-[12px] font-semibold text-emerald-600 dark:text-emerald-400 tracking-wide">{r.salary}</span>
                      </div>
                      <div className={`px-3 py-1.5 rounded-lg border flex flex-col items-end transition-all duration-700 ${
                        isDark ? 'border-white/5 bg-white/[0.01] group-hover:border-amber-500/20' : 'border-slate-200 bg-slate-50 group-hover:border-amber-500/45'
                      }`}>
                        <span className="text-[9px] font-semibold tracking-wider text-slate-500 dark:text-slate-600 mb-1 uppercase">Market Demand</span>
                        <span className="text-[12px] font-semibold text-amber-600 dark:text-amber-400 tracking-wide uppercase">{r.demand}</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => { e.stopPropagation(); openRole(r.key); }}
                      className={`w-full h-12 text-[11px] font-semibold uppercase tracking-widest rounded-xl transition-all duration-500 shadow-sm relative z-20 ${
                        isDark 
                          ? 'bg-white text-black hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]' 
                          : 'bg-[#0f172a] text-white hover:bg-emerald-600 hover:shadow-[0_0_20px_rgba(22,163,74,0.4)]'
                      }`}
                    >
                      Start Now
                    </button>
                  </motion.div>
                );
              })}

              {/* Special Interview Prep Card */}
              {MASTER_ROADMAP['interview'] && (
                <motion.div
                  key="interview"
                  variants={itemVariants}
                  whileHover={{ y: -8, scale: 1.02 }}
                  onClick={() => openRole("interview")}
                  className={`group relative border rounded-2xl p-8 transition-all duration-700 cursor-pointer overflow-hidden shadow-md ${
                    isDark 
                      ? 'bg-[#080808] border-indigo-500/20 hover:border-indigo-500/40 hover:shadow-2xl' 
                      : 'bg-white border-indigo-200 hover:border-indigo-300 hover:shadow-lg'
                  }`}
                >
                  <div className={`absolute top-0 left-0 w-full h-[1px] ${isDark ? 'bg-indigo-500/30' : 'bg-indigo-300'}`} />
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.015] to-transparent pointer-events-none" />

                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-10 transition-all duration-700 border ${
                    isDark ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-indigo-50 border-indigo-200'
                  }`}>
                    <BriefcaseIcon size={28} className="text-indigo-500" />
                  </div>

                  <h3 className="text-3xl font-semibold text-[var(--text-main)] tracking-tight mb-2">Master the Interview</h3>
                  <p className="text-[13px] text-[var(--text-muted)] opacity-85 font-medium tracking-normal leading-relaxed italic mb-8">
                    Crush technical, system design, and behavioral interviews with curated prep sets.
                  </p>

                  <ul className="space-y-4 mb-10">
                    {["Real-world Scenarios", "System Design Patterns", "Behavioral Frameworks"].map((item, i) => (
                      <li key={i} className="flex items-center text-[11px] font-medium tracking-wide text-[var(--text-muted)] opacity-90">
                        <CheckIcon size={14} className="text-emerald-500 mr-3 opacity-85" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={(e) => { e.stopPropagation(); openRole("interview"); }}
                    className={`w-full h-12 text-[11px] font-semibold uppercase tracking-widest rounded-xl transition-all duration-500 shadow-sm relative z-20 ${
                      isDark
                        ? 'bg-indigo-600 text-white hover:bg-indigo-400 hover:shadow-[0_0_20px_rgba(129,140,248,0.4)]'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)]'
                    }`}
                  >
                    Start Preparation
                  </button>
                </motion.div>
              )}
            </div>

            {/* Premium Info Tip boxes */}
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 border-t ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
              <motion.div variants={itemVariants} className={`relative group rounded-2xl p-8 overflow-hidden transition-all duration-700 border shadow-sm ${
                isDark ? 'bg-[#080808] border-white/5 hover:border-white/20' : 'bg-white border-slate-200 hover:border-slate-300'
              }`}>
                <div className="absolute top-0 left-0 w-[2px] h-full bg-indigo-500/30 group-hover:bg-indigo-500 transition-all duration-700" />
                <div className="flex gap-6 items-center">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-700 ${
                    isDark ? 'bg-indigo-500/5 border-indigo-500/10 group-hover:bg-indigo-500/10' : 'bg-indigo-50 border-indigo-200'
                  }`}>
                    <DocumentMagnifyingGlassIcon size={20} className="text-indigo-500" />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-semibold text-[var(--text-main)] tracking-wide mb-1">Structured Learning</h4>
                    <p className="text-[11px] text-[var(--text-muted)] opacity-80 font-medium tracking-normal">Proven roadmap archives.</p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className={`relative group rounded-2xl p-8 overflow-hidden transition-all duration-700 border shadow-sm ${
                isDark ? 'bg-[#080808] border-white/5 hover:border-white/20' : 'bg-white border-slate-200 hover:border-slate-300'
              }`}>
                <div className="absolute top-0 left-0 w-[2px] h-full bg-cyan-500/30 group-hover:bg-cyan-500 transition-all duration-700" />
                <div className="flex gap-6 items-center">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-700 ${
                    isDark ? 'bg-cyan-500/5 border-cyan-500/10 group-hover:bg-cyan-500/10' : 'bg-cyan-50 border-cyan-200'
                  }`}>
                    <TrendingUpIcon size={20} className="text-cyan-500" />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-semibold text-[var(--text-main)] tracking-wide mb-1">Track Progress</h4>
                    <p className="text-[11px] text-[var(--text-muted)] opacity-80 font-medium tracking-normal">Goal and phase analytics.</p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className={`relative group rounded-2xl p-8 overflow-hidden transition-all duration-700 border shadow-sm ${
                isDark ? 'bg-[#080808] border-white/5 hover:border-white/20' : 'bg-white border-slate-200 hover:border-slate-300'
              }`}>
                <div className="absolute top-0 left-0 w-[2px] h-full bg-emerald-500/30 group-hover:bg-emerald-500 transition-all duration-700" />
                <div className="flex gap-6 items-center">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-700 ${
                    isDark ? 'bg-emerald-500/5 border-emerald-500/10 group-hover:bg-emerald-500/10' : 'bg-emerald-50 border-emerald-200'
                  }`}>
                    <BoltIcon size={20} className="text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-semibold text-[var(--text-main)] tracking-wide mb-1">Expert Tips</h4>
                    <p className="text-[11px] text-[var(--text-muted)] opacity-80 font-medium tracking-normal">Industry insider advice.</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        ) : (
          <motion.div
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
              <div className={`flex flex-col items-center justify-center py-20 border rounded-3xl ${
                isDark ? 'bg-[#080808] border-white/5' : 'bg-white border-slate-200'
              }`}>
                <p className="text-[var(--text-muted)] font-bold uppercase tracking-widest text-sm mb-6">Roadmap content not found</p>
                <button
                  onClick={goBack}
                  className={`px-8 py-3 font-bold uppercase tracking-[0.3em] text-[10px] rounded-xl transition-all duration-500 border ${
                    isDark 
                      ? 'bg-white text-black hover:bg-cyan-500 hover:text-white border-transparent' 
                      : 'bg-slate-900 text-white hover:bg-emerald-600 border-transparent'
                  }`}
                >
                  Return to Hub
                </button>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default SkillGapOutlet;
