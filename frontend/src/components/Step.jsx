import React, { useContext } from "react";
import { motion } from "framer-motion";
import { ThemeContext } from "../context/ThemeContext";

const Step = ({ step, onClick, color = "cyan" }) => {
  const { isDark } = useContext(ThemeContext);



  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className={`flex items-center gap-2.5 p-1.5 px-3 rounded-lg cursor-pointer border transition-all duration-500 group ${
        step.completed
          ? 'bg-[var(--gold)]/10 border-[var(--gold)]/20'
          : isDark 
            ? `bg-white/[0.01] border-white/10 hover:border-[var(--gold)]/30 hover:bg-white/[0.03]`
            : `bg-white border-[var(--gold)]/20 shadow-[0_2px_8px_rgba(160,120,64,0.04)] hover:border-[var(--gold)]/50 hover:shadow-md`
      }`}
      onClick={onClick}
      layout
    >
      {/* Circle Checkbox */}
      <div
        className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-500 ${
          step.completed
            ? "bg-[var(--gold)] text-white border border-[var(--gold-dark)] shadow-[0_0_8px_rgba(160,120,64,0.3)]"
            : isDark
              ? `bg-white/[0.03] text-slate-600 border border-white/5 group-hover:border-[var(--gold)]/30 group-hover:text-[var(--gold)]`
              : `bg-[var(--bg-main)] text-slate-400 border border-[var(--gold)]/30 group-hover:border-[var(--gold)]/50 group-hover:text-[var(--gold-dark)]`
        }`}
      >
        {step.completed ? (
          <span className="text-[10px] font-bold">✓</span>
        ) : null}
      </div>

      {/* Title */}
      <div className={`font-bold text-[13px] tracking-wide transition-colors ${
        step.completed 
          ? "opacity-75 text-[var(--text-main)] font-semibold" 
          : `text-[var(--text-main)] group-hover:text-[var(--gold-dark)] dark:group-hover:text-[var(--gold)]`
      }`}>
        {step.title}
      </div>
    </motion.div>
  );
};

export default Step;
