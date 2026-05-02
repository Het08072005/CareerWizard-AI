import React from "react";
import { motion } from "framer-motion";

const Step = ({ step, onClick, color = "cyan" }) => {
  const hoverBorders = {
    cyan: "hover:border-cyan-500/30 group-hover:border-cyan-500/30",
    indigo: "hover:border-indigo-500/30 group-hover:border-indigo-500/30",
    fuchsia: "hover:border-fuchsia-500/30 group-hover:border-fuchsia-500/30",
    amber: "hover:border-amber-500/30 group-hover:border-amber-500/30",
    emerald: "hover:border-emerald-500/30 group-hover:border-emerald-500/30",
  };

  const textColors = {
    cyan: "group-hover:text-cyan-400",
    indigo: "group-hover:text-indigo-400",
    fuchsia: "group-hover:text-fuchsia-400",
    amber: "group-hover:text-amber-400",
    emerald: "group-hover:text-emerald-400",
  };

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className={`flex items-center gap-3 p-2.5 px-4 rounded-xl cursor-pointer border transition-all duration-500 group ${step.completed
        ? 'bg-emerald-500/10 border-emerald-500/20'
        : `bg-white/[0.01] border-white/10 ${hoverBorders[color] || "hover:border-cyan-500/30"} hover:bg-white/[0.03]`
        }`}
      onClick={onClick}
      layout
    >
      {/* Circle */}
      <div
        className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all duration-500 ${step.completed
          ? "bg-emerald-500 text-white"
          : `bg-white/[0.03] text-slate-600 border border-white/5 ${hoverBorders[color] || "group-hover:border-cyan-500/30"} ${textColors[color] || "group-hover:text-cyan-400"}`
          }`}
      >
        {step.completed ? (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
        ) : (
          <div className="w-1 h-1 rounded-full bg-current opacity-40"></div>
        )}
      </div>

      {/* Title */}
      <div className={`font-bold text-xs tracking-wide transition-colors ${step.completed ? "opacity-40 text-slate-400 line-through" : "text-slate-300 group-hover:text-white"
        }`}>
        {step.title}
      </div>
    </motion.div>
  );
};

export default Step;
