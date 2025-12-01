// // src/components/Milestone.jsx
// import React, { useState } from "react";
// import Step from "./Step";
// import { motion, AnimatePresence } from "framer-motion";

// const Milestone = ({ data, onToggleTopic, onMarkComplete }) => {
//   const [open, setOpen] = useState(true); // start open for clarity

//   return (
//     <div className="bg-white  rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow">
//       <div className="flex items-start justify-between">
//         <div className="flex items-center space-x-4">
//           <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-xl">✓</div>
//           <div>
//             <h4 className="font-semibold text-lg">{data.title}</h4>
//             <div className="text-sm text-gray-500 dark:text-gray-300 mt-1 flex items-center gap-3">
//               <span>⏱ {data.duration}</span>
//               {data.completeFlag && <span className="text-sm text-green-600 font-medium">Completed</span>}
//             </div>
//           </div>
//         </div>

//         <div className="flex items-center gap-3">
//           <button
//             onClick={() => onMarkComplete()}
//             className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition"
//           >
//             ✓ Completed
//           </button>
//           <button onClick={() => setOpen((s) => !s)} className="p-2 rounded-md bg-gray-100 dark:bg-gray-700">
//             {open ? "−" : "+"}
//           </button>
//         </div>
//       </div>

//       <AnimatePresence initial={false}>
//         {open && (
//           <motion.div
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: "auto" }}
//             exit={{ opacity: 0, height: 0 }}
//             transition={{ duration: 0.28 }}
//             className="mt-6"
//           >
//             <h5 className="text-md font-semibold mb-3">📚 Topics to Learn</h5>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//               {data.topics.map((t, idx) => (
//                 <Step
//                   key={idx}
//                   index={idx}
//                   step={t}
//                   onClick={() => onToggleTopic(data.index, idx)}
//                 />
//               ))}
//             </div>

//             <div className="mt-6 border-t pt-4">
//               <h5 className="font-semibold">⭐ Pro Tips</h5>
//               <ul className="mt-3 space-y-2">
//                 {data.proTips?.map((tip, i) => (
//                   <li key={i} className="bg-yellow-50 p-3 rounded-lg text-sm">{tip}</li>
//                 ))}
//               </ul>
//             </div>

//             <div className="mt-6 grid md:grid-cols-2 gap-4">
//               <div>
//                 <h5 className="font-semibold">🎯 Project Ideas</h5>
//                 <ul className="list-disc list-inside mt-2 text-sm">
//                   {data.projectIdeas?.map((p, i) => <li key={i}>{p}</li>)}
//                 </ul>
//               </div>
//               <div>
//                 <h5 className="font-semibold">▶️ Popular YT Channels</h5>
//                 <ul className="list-disc list-inside mt-2 text-sm">
//                   {data.ytChannels?.map((c, i) => <li key={i}>{c}</li>)}
//                 </ul>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default Milestone;























import React, { useState } from "react";
import Step from "./Step";
import { motion, AnimatePresence } from "framer-motion";

const Milestone = ({ data, onToggleTopic, onTogglePhaseComplete }) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="bg-white  rounded-xl p-6 border border-gray-200 shadow">
      
      <div className="flex items-start justify-between">
        
        {/* Left Side */}
        <div className="flex items-center space-x-4">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-xl 
              ${data.completeFlag ? "bg-green-100 text-green-600" : "bg-gray-200 text-gray-600"}
            `}
          >
            {data.completeFlag ? "✓" : "○"}
          </div>

          <div>
            <h4 className="font-semibold text-lg">{data.title}</h4>
            <div className="text-sm text-gray-500  mt-1 flex items-center gap-3">
              <span>⏱ {data.duration}</span>
              {data.completeFlag && <span className="text-green-600 font-medium">Completed</span>}
            </div>
          </div>
        </div>

        {/* Right Buttons */}
        <div className="flex items-center gap-3">

          <button
            onClick={() => onTogglePhaseComplete(data.index)}
            className={`px-4 py-2 rounded-lg text-sm transition
              ${data.completeFlag 
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-green-600 text-white hover:bg-green-700"}
            `}
          >
            {data.completeFlag ? "Uncomplete All" : "✓ Complete All"}
          </button>

          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-full px-4 bg-gray-100 d"
          >
            {open ? "^" : "+"}
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
            transition={{ duration: 0.25 }}
            className="mt-6"
          >
            <h5 className="text-md font-semibold mb-3">📚 Topics to Learn</h5>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.topics.map((t, idx) => (
                <Step
                  key={idx}
                  index={idx}
                  step={t}
                  onClick={() => onToggleTopic(data.index, idx)}
                />
              ))}
            </div>

            {/* Pro Tips
            <div className="mt-6 border-t pt-4">
              <h5 className="font-semibold">⭐ Pro Tips</h5>
              <ul className="mt-3 space-y-2">
                {data.proTips?.map((tip, i) => (
                  <li key={i} className="bg-yellow-100 p-3 rounded-lg text-sm text-black">
                    {tip}
                  </li>
                ))}
              </ul>
            </div> */}
            {/* Pro Tips */}
<motion.div
  initial={{ opacity: 0, y: 15 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.35 }}
  className="mt-8 border-t border-gray-700 pt-6"
>
  <h5 className="font-semibold text-lg flex items-center gap-2 text-yellow-300">
    ⭐ Pro Tips
  </h5>

  <ul className="mt-4 space-y-3">
    {data.proTips?.map((tip, i) => (
      <motion.li
        key={i}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.08 }}
        className="
          p-4 rounded-xl text-sm
           backdrop-blur-xl
          border border-yellow-400/20
          text-yellow-600 shadow-lg
        "
      >
        {tip}
      </motion.li>
    ))}
  </ul>
</motion.div>


            {/* Project + YT */}
            {/* <div className="mt-6 grid md:grid-cols-2 gap-4 bg-green-300 text-black p-4 rounded-md">
              <div>
                <h5 className="font-semibold">🎯 Project Ideas</h5>
                <ul className="list-disc list-inside mt-2 text-sm">
                  {data.projectIdeas?.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="font-semibold">▶️ Popular YT Channels</h5>
                <ul className="list-disc list-inside mt-2 text-sm">
                  {data.ytChannels?.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            </div> */}
            <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
  className="mt-6 grid md:grid-cols-2 gap-6"
>
  {/* Left Card */}
  <motion.div
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.2 }}
    className="p-5 rounded-xl  backdrop-blur-xl
               border border-cyan-400/20 shadow-xl
               text-gray-200"
  >
    <h5 className="font-semibold text-lg flex items-center gap-2 text-cyan-300">
      🎯 Project Ideas
    </h5>

    <ul className="list-disc list-inside mt-3 space-y-1 text-sm text-gray-500">
      {data.projectIdeas?.map((p, i) => (
        <motion.li
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08 }}
        >
          {p}
        </motion.li>
      ))}
    </ul>
  </motion.div>

  {/* Right Card */}
  <motion.div
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.2 }}
    className="p-5 rounded-xl  backdrop-blur-xl
               border border-blue-400/20 shadow-xl
               text-gray-200"
  >
    <h5 className="font-semibold text-lg flex items-center gap-2 text-cyan-300">
      ▶️ Popular YT Channels
    </h5>

    <ul className="list-disc list-inside mt-3 space-y-1 text-sm text-gray-500">
      {data.ytChannels?.map((c, i, ) => (
        <motion.li
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08 }}
        >
          {c}
        </motion.li>
      ))}
    </ul>
  </motion.div>
</motion.div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Milestone;

