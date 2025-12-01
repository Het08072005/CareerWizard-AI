// // src/components/Step.jsx
// import React from "react";
// import { motion } from "framer-motion";

// const Step = ({ step, onClick, index }) => {
//   return (
//     <motion.div
//       whileTap={{ scale: 0.98 }}
//       className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 cursor-pointer border border-gray-200"
//       onClick={onClick}
//     >
//       <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.completed ? "bg-green-500 text-white" : "bg-white text-gray-400 border "}`}>
//         {step.completed ? "✓" : <span className="text-gray-600">◯</span>}
//       </div>
//       <div className={`${step.completed ? "opacity-60" : ""}`}>{step.title}</div>
//     </motion.div>
//   );
// };

// export default Step;


// src/components/Step.jsx
import React from "react";
import { motion } from "framer-motion";

const Step = ({ step, onClick, type }) => {
  // Determine border color based on type
  

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border  border-green-600/20 shadow-lg backdrop-blur-xl`}
      onClick={onClick}
      layout
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {/* Circle */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center ${
          step.completed
            ? "bg-green-500 text-white border-green-500"
            : "bg-white text-gray-400 border border-gray-300"
        }`}
      >
        {step.completed ? "✓" : <span className="text-gray-600">◯</span>}
      </div>

      {/* Title */}
      <div className={`${step.completed ? "opacity-60" : ""}`}>
        {step.title}
      </div>
    </motion.div>
  );
};

export default Step;




// className="p-5 rounded-xl bg-[#1e293b]/60 backdrop-blur-xl
//                border border-cyan-400/20 shadow-xl
//                text-gray-200"