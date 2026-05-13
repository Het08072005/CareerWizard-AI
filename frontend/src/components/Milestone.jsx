import React, { useState, useContext } from "react";
import Step from "./Step";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "../context/ThemeContext";

const Milestone = ({ data, color = "cyan", onToggleTopic, onTogglePhaseComplete }) => {
  const [open, setOpen] = useState(true);
  const { isDark } = useContext(ThemeContext);

  const colorMap = {
    cyan: "bg-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.4)] border-cyan-500/30",
    indigo: "bg-indigo-500/40 shadow-[0_0_12px_rgba(99,102,241,0.4)] border-indigo-500/30",
    fuchsia: "bg-fuchsia-500/40 shadow-[0_0_12px_rgba(217,70,239,0.4)] border-fuchsia-500/30",
    amber: "bg-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.4)] border-amber-500/30",
    emerald: "bg-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.4)] border-emerald-500/30",
  };

  const hoverBorders = {
    cyan: isDark ? "hover:border-cyan-500/30" : "hover:border-cyan-500/50 hover:shadow-md",
    indigo: isDark ? "hover:border-indigo-500/30" : "hover:border-indigo-500/50 hover:shadow-md",
    fuchsia: isDark ? "hover:border-fuchsia-500/30" : "hover:border-fuchsia-500/50 hover:shadow-md",
    amber: isDark ? "hover:border-amber-500/30" : "hover:border-amber-500/50 hover:shadow-md",
    emerald: isDark ? "hover:border-emerald-500/30" : "hover:border-emerald-500/50 hover:shadow-md",
  };

  return (
    <div className={`backdrop-blur-3xl rounded-xl p-4 md:p-5 border transition-all duration-500 ${
      isDark ? "bg-[#0A0A0A] border-white/5" : "bg-white border-slate-200"
    } ${hoverBorders[color] || (isDark ? "hover:border-white/10" : "hover:border-slate-300")} group/milestone relative overflow-hidden`}>
      
      {/* Left Beam - Extended and Joined to Divider */}
      <div className={`absolute left-0 top-0 w-[1.5px] h-[84px] ${colorMap[color].split(" shadow")[0] || colorMap.cyan.split(" shadow")[0]} group-hover/milestone:opacity-100 opacity-60 transition-opacity duration-700`}>
        <div className={`absolute inset-0 ${colorMap[color]?.split(" border")[0] || colorMap.cyan.split(" border")[0]} blur-md opacity-50 animate-pulse`}></div>
      </div>

      {/* Right Minor Light */}
      <div className={`absolute right-0 top-4 w-[1px] h-10 ${colorMap[color]?.split(" border")[0] || colorMap.cyan.split(" border")[0]} opacity-0 group-hover/milestone:opacity-20 transition-opacity duration-700 blur-[0.5px]`}></div>

      <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.01] rounded-bl-2xl pointer-events-none transition-colors"></div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10 pl-2">

        {/* Left Side */}
        <div className="flex items-center space-x-5">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg border transition-all duration-500
              ${data.completeFlag
                ? "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/20"
                : isDark 
                  ? "bg-white/[0.01] text-slate-700 border-white/5 group-hover/milestone:border-white/20"
                  : "bg-slate-50 text-slate-400 border-slate-200 group-hover/milestone:border-slate-300"}
            `}
          >
            {data.completeFlag ? "✓" : "○"}
          </div>

          <div>
            <h4 className="font-semibold text-lg text-[var(--text-main)] tracking-tight mb-1 transition-colors duration-500">{data.title}</h4>
            <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-600 flex flex-wrap items-center gap-3 uppercase tracking-wider">
              <span className="flex items-center">
                <svg className="w-3 h-3 mr-1.5 text-slate-400 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {data.duration}
              </span>
              {data.completeFlag && <span className="text-emerald-600 dark:text-emerald-400/80 font-semibold">Synced</span>}
            </div>
          </div>
        </div>

        {/* Right Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end mt-3 sm:mt-0">
          <button
            onClick={() => onTogglePhaseComplete(data.index)}
            className={`h-9 px-5 rounded-md text-[10px] font-semibold uppercase tracking-widest transition-all border 
              ${data.completeFlag
                ? isDark
                  ? "bg-white/[0.03] text-slate-400 border-white/10 hover:bg-white/[0.05]"
                  : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                : isDark
                  ? "bg-white/[0.03] text-slate-500 border-white/5 hover:bg-white/[0.05] hover:text-white"
                  : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200 hover:text-slate-800"}
            `}
          >
            {data.completeFlag ? "Reset" : "Finalize"}
          </button>

          <button
            onClick={() => setOpen(!open)}
            className={`w-8 h-8 flex items-center justify-center rounded-md text-slate-500 transition-all duration-500 ${
              isDark
                ? "bg-white/[0.01] border border-white/5 hover:text-white hover:bg-white/[0.03]"
                : "bg-slate-50 border border-slate-200 hover:text-slate-800 hover:bg-slate-100"
            }`}
          >
            {open ? (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 relative z-10"
          >
            {/* Divider surgically joined to the beam */}
            <div className={`h-[1px] w-auto -mx-4 md:-mx-5 mb-6 opacity-40 ${
              isDark ? (colorMap[color]?.split(" ")[0] || "bg-white/10") : "bg-slate-200"
            }`} />

            <h5 className="font-semibold text-[10px] uppercase tracking-widest text-slate-500 mb-4">
              Detailed Requirements
            </h5>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.topics.map((t, idx) => (
                <Step
                  key={idx}
                  index={idx}
                  step={t}
                  color={color}
                  onClick={() => onToggleTopic(data.index, idx)}
                />
              ))}
            </div>

            {/* Pro Tips */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`mt-6 pt-6 border-t ${isDark ? 'border-white/5' : 'border-slate-150'}`}
            >
              <h5 className="font-semibold text-[10px] uppercase tracking-widest text-slate-500 mb-4">
                Core Protocols
              </h5>

              <div className="space-y-1.5">
                {data.proTips?.map((tip, i) => (
                  <motion.div
                    key={i}
                    className={`p-2 px-4 rounded-lg text-[10px] flex items-center leading-relaxed font-medium tracking-wide border ${
                      isDark 
                        ? "bg-white/[0.01] border-white/[0.03] text-slate-400" 
                        : "bg-slate-50 border-slate-100 text-slate-600"
                    }`}
                  >
                    <div className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-600 mr-3 flex-shrink-0"></div>
                    {tip}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Additional Resources */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-6 grid xl:grid-cols-2 gap-3"
            >
              <div className={`p-5 rounded-xl border group/proj transition-all duration-500 ${
                isDark 
                  ? "bg-white/[0.01] border-white/5 hover:border-white/10" 
                  : "bg-slate-50/50 border-slate-200 hover:border-slate-300"
              }`}>
                <h5 className="font-semibold text-[10px] uppercase tracking-widest text-slate-500 mb-4">
                  Artifact Development
                </h5>
                <ul className="space-y-2 text-[9px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-600">
                  {data.projectIdeas?.map((p, i) => (
                    <li key={i} className="flex items-start group-hover/proj:text-[var(--text-main)] transition-colors">
                      <span className="text-slate-400 dark:text-slate-500 mr-2">/</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`p-5 rounded-xl border group/yt transition-all duration-500 ${
                isDark 
                  ? "bg-white/[0.01] border-white/5 hover:border-white/10" 
                  : "bg-slate-50/50 border-slate-200 hover:border-slate-300"
              }`}>
                <h5 className="font-semibold text-[10px] uppercase tracking-widest text-slate-500 mb-4">
                  Intelligence Sync
                </h5>
                <ul className="space-y-2 text-[11px] text-slate-500 dark:text-slate-600 font-medium tracking-wide">
                  {data.ytChannels?.map((c, i) => (
                    <li key={i} className="flex items-start group-hover/yt:text-[var(--text-main)] transition-colors">
                      <span className="text-slate-400 dark:text-slate-500 mr-2">/</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Milestone;
