import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const ProgressBar = ({ progress }) => {
  const { isDark } = useContext(ThemeContext);

  return (
    <div className="w-full">
      <div className={`h-2.5 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-slate-200/80'}`}>
        <div
          className={`h-full transition-all duration-500 ease-out ${isDark ? 'bg-white' : 'bg-indigo-600'}`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className={`text-[10px] mt-2 font-bold uppercase tracking-wider ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
        {progress}% Complete
      </p>
    </div>
  );
};

export default ProgressBar;
