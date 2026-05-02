import React, { useState } from "react";
import Roadmap from "./Roadmap";
import { motion, AnimatePresence } from "framer-motion";
import { MASTER_ROADMAP, CAREER_ORDER } from "../data/masterRoadmap";
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
    <div className="w-full text-slate-200 min-h-screen relative overflow-hidden font-sans bg-[#050505] p-6 md:px-12 py-10">
      {/* ARCHITECTURAL BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-[1400px] mx-auto relative z-10"
      >
        {view === "hub" && (
          <motion.header variants={itemVariants} className="mb-14 flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-white/5 pb-10 relative">
            <div className="flex flex-col gap-2 group">
              <h1 className="text-4xl font-semibold text-white tracking-tight leading-none transition-all duration-700 group-hover:tracking-normal cursor-default">
                Career Roadmaps
              </h1>
              <p className="text-[13px] text-slate-400 font-medium tracking-wide max-w-xl opacity-90">
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
                    className="group relative bg-[#080808] border border-white/5 rounded-2xl p-8 transition-all duration-700 hover:border-white/20 cursor-pointer overflow-hidden shadow-2xl"
                  >
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-white/5 group-hover:bg-cyan-500/20 transition-all duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    <div className="w-16 h-16 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center mb-10 group-hover:border-cyan-500/30 transition-all duration-700">
                      <IconComponent size={28} className="text-slate-500 group-hover:text-cyan-400 transition-colors duration-700" />
                    </div>

                    <h3 className="text-3xl font-semibold text-white tracking-tight mb-4 group-hover:text-cyan-400 transition-colors duration-700">{r.title}</h3>
                    <p className="text-[13px] text-slate-500 font-medium tracking-normal leading-relaxed italic mb-8 h-10 line-clamp-2">
                      {r.path}
                    </p>

                    <div className="flex items-center justify-between mb-10 pt-6 border-t border-white/5">
                      <div className="px-3 py-1.5 rounded-lg border border-white/5 bg-white/[0.01] flex flex-col items-start transition-all duration-700 group-hover:border-emerald-500/20">
                        <span className="text-[9px] font-semibold tracking-wider text-slate-600 mb-1 uppercase">Estimated Salary</span>
                        <span className="text-[12px] font-semibold text-emerald-400/90 tracking-wide">{r.salary}</span>
                      </div>
                      <div className="px-3 py-1.5 rounded-lg border border-white/5 bg-white/[0.01] flex flex-col items-end transition-all duration-700 group-hover:border-amber-500/20">
                        <span className="text-[9px] font-semibold tracking-wider text-slate-600 mb-1 uppercase">Market Demand</span>
                        <span className="text-[12px] font-semibold text-amber-400/90 tracking-wide uppercase">{r.demand}</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => { e.stopPropagation(); openRole(r.key); }}
                      className="w-full h-12 bg-white text-black text-[11px] font-semibold uppercase tracking-widest rounded-xl hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all duration-500 shadow-2xl relative z-20"
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
                  className="group relative bg-[#080808] border border-indigo-500/20 rounded-2xl p-8 transition-all duration-700 hover:border-indigo-500/40 cursor-pointer overflow-hidden shadow-2xl"
                >
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-indigo-500/30" />
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.03] to-transparent" />

                  <div className="w-16 h-16 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-10 group-hover:bg-indigo-500/20 transition-all duration-700">
                    <BriefcaseIcon size={28} className="text-indigo-400" />
                  </div>

                  <h3 className="text-3xl font-semibold text-white tracking-tight mb-2">Master the Interview</h3>
                  <p className="text-[13px] text-slate-500 font-medium tracking-normal leading-relaxed italic mb-8">
                    Crush technical, system design, and behavioral interviews with curated prep sets.
                  </p>

                  <ul className="space-y-4 mb-10">
                    {["Real-world Scenarios", "System Design Patterns", "Behavioral Frameworks"].map((item, i) => (
                      <li key={i} className="flex items-center text-[11px] font-medium tracking-wide text-slate-400">
                        <CheckIcon size={14} className="text-emerald-500 mr-3 opacity-80" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={(e) => { e.stopPropagation(); openRole("interview"); }}
                    className="w-full h-12 bg-indigo-600 text-white text-[11px] font-semibold uppercase tracking-widest rounded-xl hover:bg-indigo-400 hover:shadow-[0_0_20px_rgba(129,140,248,0.4)] transition-all duration-500 shadow-2xl relative z-20"
                  >
                    Start Preparation
                  </button>
                </motion.div>
              )}
            </div>

            {/* Premium Info Tip boxes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 border-t border-white/5">
              <motion.div variants={itemVariants} className="relative group bg-[#080808] border border-white/5 rounded-2xl p-8 overflow-hidden transition-all duration-700 hover:border-white/20">
                <div className="absolute top-0 left-0 w-[2px] h-full bg-indigo-500/30 group-hover:bg-indigo-500 transition-all duration-700" />
                <div className="flex gap-6 items-center">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/5 flex items-center justify-center border border-indigo-500/10 group-hover:bg-indigo-500/10 transition-all duration-700">
                    <DocumentMagnifyingGlassIcon size={20} className="text-indigo-400/60 group-hover:text-indigo-400 transition-colors" />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-semibold text-white tracking-wide mb-1">Structured Learning</h4>
                    <p className="text-[11px] text-slate-600 font-medium tracking-normal">Proven roadmap archives.</p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="relative group bg-[#080808] border border-white/5 rounded-2xl p-8 overflow-hidden transition-all duration-700 hover:border-white/20">
                <div className="absolute top-0 left-0 w-[2px] h-full bg-cyan-500/30 group-hover:bg-cyan-500 transition-all duration-700" />
                <div className="flex gap-6 items-center">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/5 flex items-center justify-center border border-cyan-500/10 group-hover:bg-cyan-500/10 transition-all duration-700">
                    <TrendingUpIcon size={20} className="text-cyan-400/60 group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-semibold text-white tracking-wide mb-1">Track Progress</h4>
                    <p className="text-[11px] text-slate-600 font-medium tracking-normal">Goal and phase analytics.</p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="relative group bg-[#080808] border border-white/5 rounded-2xl p-8 overflow-hidden transition-all duration-700 hover:border-white/20">
                <div className="absolute top-0 left-0 w-[2px] h-full bg-emerald-500/30 group-hover:bg-emerald-500 transition-all duration-700" />
                <div className="flex gap-6 items-center">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/5 flex items-center justify-center border border-emerald-500/10 group-hover:bg-emerald-500/10 transition-all duration-700">
                    <BoltIcon size={20} className="text-emerald-400/60 group-hover:text-emerald-400 transition-colors" />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-semibold text-white tracking-wide mb-1">Expert Tips</h4>
                    <p className="text-[11px] text-slate-600 font-medium tracking-normal">Industry insider advice.</p>
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
              <div className="flex flex-col items-center justify-center py-20 bg-[#080808] border border-white/5 rounded-3xl">
                <p className="text-slate-500 font-bold uppercase tracking-widest text-sm mb-6">Roadmap content not found</p>
                <button
                  onClick={goBack}
                  className="px-8 py-3 bg-white text-black font-bold uppercase tracking-[0.3em] text-[10px] rounded-xl hover:bg-cyan-500 transition-colors"
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
