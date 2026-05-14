import React, { useContext } from "react";
import { motion } from "framer-motion";
import { ThemeContext } from "../context/ThemeContext";

const Step = ({ step, onClick, color = "cyan" }) => {
  const { isDark } = useContext(ThemeContext);

  const hoverBorders = {
    cyan: isDark ? "hover:border-cyan-500/30 group-hover:border-cyan-500/30" : "hover:border-cyan-500/50 group-hover:border-cyan-500/50",
    indigo: isDark ? "hover:border-indigo-500/30 group-hover:border-indigo-500/30" : "hover:border-indigo-500/50 group-hover:border-indigo-500/50",
    fuchsia: isDark ? "hover:border-fuchsia-500/30 group-hover:border-fuchsia-500/30" : "hover:border-fuchsia-500/50 group-hover:border-fuchsia-500/50",
    amber: isDark ? "hover:border-amber-500/30 group-hover:border-amber-500/30" : "hover:border-amber-500/50 group-hover:border-amber-500/50",
    emerald: isDark ? "hover:border-emerald-500/30 group-hover:border-emerald-500/30" : "hover:border-emerald-500/50 group-hover:border-emerald-500/50",
  };

  const textColors = {
    cyan: "group-hover:text-cyan-500 dark:group-hover:text-cyan-400",
    indigo: "group-hover:text-indigo-500 dark:group-hover:text-indigo-400",
    fuchsia: "group-hover:text-fuchsia-500 dark:group-hover:text-fuchsia-400",
    amber: "group-hover:text-amber-500 dark:group-hover:text-amber-400",
    emerald: "group-hover:text-emerald-500 dark:group-hover:text-emerald-400",
  };

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className={`flex items-center gap-2.5 p-1.5 px-3 rounded-lg cursor-pointer border transition-all duration-500 group ${
        step.completed
          ? 'bg-emerald-500/10 border-emerald-500/20'
          : isDark 
            ? `bg-white/[0.01] border-white/10 ${hoverBorders[color] || "hover:border-cyan-500/30"} hover:bg-white/[0.03]`
            : `bg-[var(--bg-main)] border-slate-200 ${hoverBorders[color] || "hover:border-cyan-500/30"} hover:bg-slate-200/50`
      }`}
      onClick={onClick}
      layout
    >
      {/* Circle Checkbox */}
      <div
        className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-500 ${
          step.completed
            ? "bg-emerald-500 text-white border border-emerald-600 shadow-[0_0_8px_rgba(16,185,129,0.3)]"
            : isDark
              ? `bg-white/[0.03] text-slate-600 border border-white/5 ${hoverBorders[color] || "group-hover:border-cyan-500/30"} ${textColors[color] || "group-hover:text-cyan-400"}`
              : `bg-slate-200 text-slate-500 border border-slate-300 ${hoverBorders[color] || "group-hover:border-cyan-500/30"} ${textColors[color] || "group-hover:text-cyan-400"}`
        }`}
      >
        {step.completed ? (
          <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
        ) : (
          <div className="w-1 h-1 rounded-full bg-current opacity-40"></div>
        )}
      </div>

      {/* Title */}
      <div className={`font-bold text-[10px] tracking-wide transition-colors ${
        step.completed 
          ? "opacity-75 text-[var(--text-main)] font-semibold" 
          : `text-[var(--text-main)] group-hover:${textColors[color]?.split(" ")[0] || "text-cyan-500"}`
      }`}>
        {step.title}
      </div>
    </motion.div>
  );
};

export default Step;
