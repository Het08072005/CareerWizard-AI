import React, { useState, useContext } from "react";
import Step from "./Step";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "../context/ThemeContext";

const Milestone = ({ data, color = "cyan", onToggleTopic, onTogglePhaseComplete }) => {
  const [open, setOpen] = useState(true);
  const { isDark } = useContext(ThemeContext);



  return (
    <div className={`rounded-xl p-3 md:p-4 border transition-all duration-500 ${
      isDark ? "bg-[#0A0A0A] border-white/5 hover:border-white/10" : "bg-[#fffcf7] border-[var(--gold)]/20 shadow-[0_4px_20px_rgba(160,120,64,0.05)] hover:border-[var(--gold)]/40 hover:shadow-[0_4px_20px_rgba(160,120,64,0.08)]"
    } group/milestone relative overflow-hidden`}>
      
      {/* Left Beam - Extended and Joined to Divider */}
      <div className={`absolute left-0 top-0 w-[1.5px] h-[84px] bg-[var(--gold)]/80 group-hover/milestone:opacity-100 opacity-60 transition-opacity duration-700`}>
        <div className={`absolute inset-0 bg-[var(--gold)] blur-md opacity-50 animate-pulse`}></div>
      </div>

      {/* Right Minor Light */}
      <div className={`absolute right-0 top-4 w-[1px] h-10 bg-[var(--gold)]/60 opacity-0 group-hover/milestone:opacity-20 transition-opacity duration-700 blur-[0.5px]`}></div>

      <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.01] rounded-bl-2xl pointer-events-none transition-colors"></div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10 pl-1.5">

        {/* Left Side */}
        <div className="flex items-center space-x-4">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border transition-all duration-500
              ${data.completeFlag
                ? "bg-[var(--gold)]/10 text-[var(--gold-dark)] border-[var(--gold)]/20 shadow-[0_0_8px_rgba(160,120,64,0.15)]"
                : isDark 
                  ? "bg-white/[0.01] text-slate-700 border-white/5 group-hover/milestone:border-white/20"
                  : "bg-[var(--bg-main)] text-slate-400 border-slate-200 group-hover/milestone:border-slate-300"}
            `}
          >
            {data.completeFlag ? (
              <span className="font-bold text-[14px]">✓</span>
            ) : (
              <div className="w-1.5 h-1.5 rounded-full bg-current opacity-40"></div>
            )}
          </div>

          <div>
            <h4 style={{ fontFamily: '"Cormorant Garamond", serif' }} className="font-bold text-[18px] text-[var(--text-main)] tracking-tight mb-0.5 transition-colors duration-500">{data.title}</h4>
            <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-600 flex flex-wrap items-center gap-3 uppercase tracking-wider">
              <span className="flex items-center">
                <svg className="w-3 h-3 mr-1.5 text-slate-400 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {data.duration}
              </span>
              {data.completeFlag && <span className="text-[var(--gold)] font-semibold">Synced</span>}
            </div>
          </div>
        </div>

        {/* Right Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end mt-2 sm:mt-0">
          <button
            onClick={() => onTogglePhaseComplete(data.index)}
            className={`h-8 px-3.5 rounded-md text-[12px] font-semibold transition-all border flex items-center justify-center gap-1.5
              ${data.completeFlag
                ? isDark
                  ? "bg-white/[0.03] text-slate-400 border-white/10 hover:bg-white/[0.05]"
                  : "bg-[var(--bg-main)] text-slate-500 border-slate-200 hover:bg-slate-200/50"
                : isDark
                  ? "bg-white/[0.03] text-slate-500 border-white/5 hover:bg-white/[0.05] hover:text-white"
                  : "bg-[var(--gold)]/10 text-[var(--gold-dark)] border-[var(--gold)]/20 hover:bg-[var(--gold)]/20 hover:text-[var(--text-main)]"}
            `}
          >
            {data.completeFlag ? (
              <>
                <span>✗</span>
                Incomplete
              </>
            ) : (
              <>
                <span>✓</span>
                Complete
              </>
            )}
          </button>

          <button
            onClick={() => setOpen(!open)}
            className={`w-7 h-7 flex items-center justify-center rounded-md text-slate-500 transition-all duration-500 ${
              isDark
                ? "bg-white/[0.01] border border-white/5 hover:text-white hover:bg-white/[0.03]"
                : "bg-[var(--bg-main)] border border-slate-200 hover:text-slate-800 hover:bg-slate-200/50"
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
            className="mt-4 relative z-10"
          >
            {/* Divider surgically joined to the beam */}
            <div className={`h-[1px] w-auto -mx-3 md:-mx-4 mb-4 opacity-40 ${
              isDark ? "bg-[var(--gold)]/30" : "bg-[var(--gold)]/50"
            }`} />

            <h5 style={{ fontFamily: '"Cormorant Garamond", serif' }} className="font-bold text-[18px] tracking-widest text-[var(--gold-dark)] mb-3">
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
              className={`mt-4 pt-4 border-t ${isDark ? 'border-white/5' : 'border-slate-150'}`}
            >
              <h5 style={{ fontFamily: '"Cormorant Garamond", serif' }} className="font-bold text-[18px] tracking-widest text-[var(--gold-dark)] mb-3">
                Core Protocols
              </h5>

              <div className="space-y-1.5">
                {data.proTips?.map((tip, i) => (
                  <motion.div
                    key={i}
                    className={`p-2 px-4 rounded-lg text-[13px] flex items-center leading-relaxed font-medium tracking-wide border ${
                      isDark 
                        ? "bg-white/[0.01] border-white/[0.03] text-slate-400" 
                        : "bg-[var(--bg-main)] border-[var(--gold)]/20 shadow-[0_2px_8px_rgba(160,120,64,0.03)] text-slate-600"
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
              className="mt-4 grid xl:grid-cols-2 gap-3"
            >
              <div className={`p-4 rounded-xl border group/proj transition-all duration-500 ${
                isDark 
                  ? "bg-white/[0.01] border-white/5 hover:border-white/10" 
                  : "bg-[var(--bg-main)] border-[var(--gold)]/20 shadow-[0_4px_15px_rgba(160,120,64,0.03)] hover:border-[var(--gold)]/40 hover:shadow-md"
              }`}>
                <h5 style={{ fontFamily: '"Cormorant Garamond", serif' }} className="font-bold text-[18px] tracking-widest text-[var(--gold-dark)] mb-3">
                  Project Ideas
                </h5>
                <ul className="space-y-2 text-[13px] text-slate-600 dark:text-slate-500 font-medium tracking-wide">
                  {data.projectIdeas?.map((p, i) => (
                    <li key={i} className="flex items-start group-hover/proj:text-[var(--text-main)] transition-colors">
                      <div className="w-1 h-1 rounded-full bg-[var(--gold)]/40 mt-1.5 mr-2.5 flex-shrink-0"></div>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`p-4 rounded-xl border group/yt transition-all duration-500 ${
                isDark 
                  ? "bg-white/[0.01] border-white/5 hover:border-white/10" 
                  : "bg-[var(--bg-main)] border-[var(--gold)]/20 shadow-[0_4px_15px_rgba(160,120,64,0.03)] hover:border-[var(--gold)]/40 hover:shadow-md"
              }`}>
                <h5 style={{ fontFamily: '"Cormorant Garamond", serif' }} className="font-bold text-[18px] tracking-widest text-[var(--gold-dark)] mb-3">
                  YouTube Channels
                </h5>
                <ul className="space-y-2 text-[13px] text-slate-600 dark:text-slate-500 font-medium tracking-wide">
                  {data.ytChannels?.map((c, i) => (
                    <li key={i} className="flex items-start group-hover/yt:text-[var(--text-main)] transition-colors">
                      <div className="w-1 h-1 rounded-full bg-[var(--gold)]/40 mt-1.5 mr-2.5 flex-shrink-0"></div>
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
