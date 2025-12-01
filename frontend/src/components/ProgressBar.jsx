// src/components/ProgressBar.jsx
import React from "react";

const ProgressBar = ({ progress }) => {
  return (
    <div className="w-full">
      <div className="h-3 bg-white/30 rounded-full overflow-hidden">
        <div
          className="h-full bg-white transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-sm text-white/90 mt-2 font-medium">{progress}% Complete</p>
    </div>
  );
};

export default ProgressBar;
