import React, { useState } from "react";
import Step from "./Step";
import { motion, AnimatePresence } from "framer-motion";

const Milestone = ({ data, color = "cyan", onToggleTopic, onTogglePhaseComplete }) => {
  const [open, setOpen] = useState(true);

  const colorMap = {
    cyan: "bg-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.4)] border-cyan-500/30",
    indigo: "bg-indigo-500/40 shadow-[0_0_12px_rgba(99,102,241,0.4)] border-indigo-500/30",
    fuchsia: "bg-fuchsia-500/40 shadow-[0_0_12px_rgba(217,70,239,0.4)] border-fuchsia-500/30",
    amber: "bg-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.4)] border-amber-500/30",
    emerald: "bg-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.4)] border-emerald-500/30",
  };

  const hoverBorders = {
    cyan: "hover:border-cyan-500/30",
    indigo: "hover:border-indigo-500/30",
    fuchsia: "hover:border-fuchsia-500/30",
    amber: "hover:border-amber-500/30",
    emerald: "hover:border-emerald-500/30",
  };

  return (
    <div className={`bg-[#0A0A0A] backdrop-blur-3xl rounded-xl p-4 md:p-5 border border-white/5 transition-all duration-500 ${hoverBorders[color] || "hover:border-white/10"} group/milestone relative overflow-hidden`}>
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
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-white/[0.01] text-slate-700 border-white/5 group-hover/milestone:border-white/20"}
            `}
          >
            {data.completeFlag ? "✓" : "○"}
          </div>

          <div>
            <h4 className="font-semibold text-lg text-white tracking-tight mb-1 group-hover/milestone:text-white transition-colors duration-500">{data.title}</h4>
            <div className="text-[10px] font-semibold text-slate-600 flex flex-wrap items-center gap-3 uppercase tracking-wider">
              <span className="flex items-center">
                <svg className="w-3 h-3 mr-1.5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {data.duration}
              </span>
              {data.completeFlag && <span className="text-emerald-500/80 font-semibold">Synced</span>}
            </div>
          </div>
        </div>

        {/* Right Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end mt-3 sm:mt-0">
          <button
            onClick={() => onTogglePhaseComplete(data.index)}
            className={`h-9 px-5 rounded-md text-[10px] font-semibold uppercase tracking-widest transition-all border 
              ${data.completeFlag
                ? "bg-white/[0.03] text-slate-400 border-white/10 hover:bg-white/[0.05]"
                : "bg-white/[0.03] text-slate-500 border-white/5 hover:bg-white/[0.05] hover:text-white"}
            `}
          >
            {data.completeFlag ? "Reset" : "Finalize"}
          </button>

          <button
            onClick={() => setOpen(!open)}
            className="w-8 h-8 flex items-center justify-center rounded-md bg-white/[0.01] border border-white/5 text-slate-600 hover:text-white hover:bg-white/[0.03] transition-all duration-500"
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
            <div className={`h-[1px] w-auto -mx-4 md:-mx-5 ${colorMap[color]?.split(" ")[0] || "bg-white/10"} mb-6 opacity-40`} />

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
              className="mt-6 border-t border-white/5 pt-6"
            >
              <h5 className="font-semibold text-[10px] uppercase tracking-widest text-slate-500 mb-4">
                Core Protocols
              </h5>

              <div className="space-y-1.5">
                {data.proTips?.map((tip, i) => (
                  <motion.div
                    key={i}
                    className="p-2 px-4 rounded-lg text-[10px] bg-white/[0.01] border border-white/[0.03] text-slate-400 flex items-center leading-relaxed font-medium tracking-wide"
                  >
                    <div className="w-1 h-1 rounded-full bg-slate-700 mr-3 flex-shrink-0"></div>
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
              <div className="p-5 rounded-xl bg-white/[0.01] border border-white/5 group/proj transition-all duration-500 hover:border-white/10">
                <h5 className="font-semibold text-[10px] uppercase tracking-widest text-slate-500 mb-4">
                  Artifact Development
                </h5>
                <ul className="space-y-2 text-[9px] text-slate-600 font-bold uppercase tracking-widest">
                  {data.projectIdeas?.map((p, i) => (
                    <li key={i} className="flex items-start group-hover/proj:text-slate-400 transition-colors">
                      <span className="text-white/20 mr-2">/</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-xl bg-white/[0.01] border border-white/5 group/yt transition-all duration-500 hover:border-white/10">
                <h5 className="font-semibold text-[10px] uppercase tracking-widest text-slate-500 mb-4">
                  Intelligence Sync
                </h5>
                <ul className="space-y-2 text-[11px] text-slate-600 font-medium tracking-wide">
                  {data.ytChannels?.map((c, i) => (
                    <li key={i} className="flex items-start group-hover/yt:text-slate-400 transition-colors">
                      <span className="text-white/20 mr-2">/</span>
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
