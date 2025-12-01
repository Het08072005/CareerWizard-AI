// // src/components/Roadmap.jsx
// import React, { useEffect, useState } from "react";
// import Milestone from "./Milestone";
// import ProgressBar from "./ProgressBar";

// /**
//  * roleData shape:
//  * {
//  *   key, title, icon, salary, demand, path, color, requiredSkills: [], phases: [{ title, duration, topics: [], proTips: [], projectIdeas: [], ytChannels: [] }]
//  * }
//  */

// const STORAGE_PREFIX = "skillgap_progress_";

// const Roadmap = ({ roleData, onBack }) => {
//   const roleKey = roleData.key;
//   // progress structure: { phase_0_topic_index: true, phase_0_complete: true, ... }
//   const [progress, setProgress] = useState(() => {
//     try {
//       const raw = localStorage.getItem(STORAGE_PREFIX + roleKey);
//       return raw ? JSON.parse(raw) : {};
//     } catch {
//       return {};
//     }
//   });

//   useEffect(() => {
//     localStorage.setItem(STORAGE_PREFIX + roleKey, JSON.stringify(progress));
//   }, [progress, roleKey]);

//   // Build topics+completed structure for each phase
//   const phases = roleData.phases.map((phase, pIdx) => {
//     const topics = phase.topics.map((t, tIdx) => {
//       const completed = !!progress[`phase_${pIdx}_topic_${tIdx}`];
//       return { title: t, completed };
//     });
//     const completeFlag = !!progress[`phase_${pIdx}_complete`];
//     return { ...phase, topics, completeFlag, index: pIdx };
//   });

//   const totalTopics = phases.reduce((acc, ph) => acc + ph.topics.length, 0);
//   const completedTopics = phases.reduce(
//     (acc, ph) => acc + ph.topics.filter((t) => t.completed).length,
//     0
//   );

//   const percent = totalTopics === 0 ? 0 : Math.round((completedTopics / totalTopics) * 100);

//   const toggleTopic = (phaseIndex, topicIndex) => {
//     setProgress((prev) => {
//       const key = `phase_${phaseIndex}_topic_${topicIndex}`;
//       const newState = { ...prev, [key]: !prev[key] };

//       // update phase completion flag
//       const allCompleted = roleData.phases[phaseIndex].topics.every((_, idx) => newState[`phase_${phaseIndex}_topic_${idx}`]);
//       newState[`phase_${phaseIndex}_complete`] = allCompleted;
//       return newState;
//     });
//   };

//   const markPhaseComplete = (phaseIndex) => {
//     setProgress((prev) => {
//       const newState = { ...prev };
//       roleData.phases[phaseIndex].topics.forEach((_, idx) => {
//         newState[`phase_${phaseIndex}_topic_${idx}`] = true;
//       });
//       newState[`phase_${phaseIndex}_complete`] = true;
//       return newState;
//     });
//   };

//   return (
//     <div>
//       {/* Header */}
//       <div className={`rounded-xl p-6 text-white bg-gradient-to-r ${roleData.color}`}>
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-4">
//             <div className="w-14 h-14 rounded-lg bg-white/20 flex items-center justify-center text-2xl">{roleData.icon}</div>
//             <div>
//               <h2 className="text-2xl font-bold">{roleData.title}</h2>
//               <p className="text-sm opacity-90">{roleData.path}</p>
//             </div>
//           </div>
//           <button onClick={onBack} className="bg-white/20 px-4 py-2 rounded-lg">← Back</button>
//         </div>

//         <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div className="bg-white/20 rounded-lg p-4">
//             <div className="text-xs text-white/90">Avg Salary</div>
//             <div className="text-lg font-semibold mt-1">{roleData.salary}</div>
//           </div>
//           <div className="bg-white/20 rounded-lg p-4">
//             <div className="text-xs text-white/90">Job Demand</div>
//             <div className="text-lg font-semibold mt-1">{roleData.demand}</div>
//           </div>
//           <div className="bg-white/20 rounded-lg p-4">
//             <div className="text-xs text-white/90">Progress</div>
//             <div className="text-lg font-semibold mt-1">{percent}%</div>
//           </div>
//         </div>

//         <div className="mt-6">
//           <ProgressBar progress={percent} />
//         </div>
//       </div>

//       {/* Required Skills */}
//       <div className="mt-6 bg-white  rounded-xl p-6 border">
//         <h3 className="font-semibold text-lg">Required Skills</h3>
//         <div className="mt-3 flex flex-wrap gap-2">
//           {roleData.requiredSkills.map((s) => (
//             <span key={s} className="text-sm px-3 py-1 bg-violet-50 text-violet-700 rounded-full">{s}</span>
//           ))}
//         </div>
//       </div>

//       {/* Phases */}
//       <div className="mt-6 space-y-6">
//         {phases.map((ph) => (
//           <Milestone
//             key={ph.title}
//             data={ph}
//             onToggleTopic={toggleTopic}
//             onMarkComplete={() => markPhaseComplete(ph.index)}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Roadmap;



















import React, { useEffect, useState } from "react";
import Milestone from "./Milestone";
import ProgressBar from "./ProgressBar";

const STORAGE_PREFIX = "skillgap_progress_";

const Roadmap = ({ roleData, onBack }) => {
  const roleKey = roleData.key;

  const [progress, setProgress] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + roleKey);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + roleKey, JSON.stringify(progress));
  }, [progress, roleKey]);

  // Build phase + topics
  const phases = roleData.phases.map((phase, pIdx) => {
    const topics = phase.topics.map((t, tIdx) => {
      const completed = !!progress[`phase_${pIdx}_topic_${tIdx}`];
      return { title: t, completed };
    });

    const completeFlag = !!progress[`phase_${pIdx}_complete`];

    return { ...phase, topics, completeFlag, index: pIdx };
  });

  // Progress %
  const totalTopics = phases.reduce((a, ph) => a + ph.topics.length, 0);
  const completedTopics = phases.reduce(
    (a, ph) => a + ph.topics.filter((t) => t.completed).length,
    0
  );
  const percent = totalTopics ? Math.round((completedTopics / totalTopics) * 100) : 0;

  // Toggle single topic
  const toggleTopic = (phaseIndex, topicIndex) => {
    setProgress((prev) => {
      const key = `phase_${phaseIndex}_topic_${topicIndex}`;
      const newState = { ...prev, [key]: !prev[key] };

      // Check if all topics completed
      const allDone = roleData.phases[phaseIndex].topics.every((_, idx) =>
        newState[`phase_${phaseIndex}_topic_${idx}`]
      );

      newState[`phase_${phaseIndex}_complete`] = allDone;
      return newState;
    });
  };

  // 🔥 Toggle phase complete/uncomplete (NEW)
  const togglePhaseComplete = (phaseIndex) => {
    setProgress((prev) => {
      const newState = { ...prev };

      const isNowComplete = !prev[`phase_${phaseIndex}_complete`];

      roleData.phases[phaseIndex].topics.forEach((_, idx) => {
        newState[`phase_${phaseIndex}_topic_${idx}`] = isNowComplete;
      });

      newState[`phase_${phaseIndex}_complete`] = isNowComplete;
      return newState;
    });
  };

  return (
    <div>
      {/* Header */}
      <div className={`rounded-xl p-6 text-white bg-gradient-to-r ${roleData.color}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-lg bg-white/20 flex items-center justify-center text-2xl">
              {roleData.icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{roleData.title}</h2>
              <p className="text-sm opacity-90">{roleData.path}</p>
            </div>
          </div>
          <button onClick={onBack} className="bg-white/20 px-4 py-2 rounded-lg">
            ← Back
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/20 rounded-lg p-4">
            <div className="text-xs text-white/90">Avg Salary</div>
            <div className="text-lg font-semibold mt-1">{roleData.salary}</div>
          </div>
          <div className="bg-white/20 rounded-lg p-4">
            <div className="text-xs text-white/90">Job Demand</div>
            <div className="text-lg font-semibold mt-1">{roleData.demand}</div>
          </div>
          <div className="bg-white/20 rounded-lg p-4">
            <div className="text-xs text-white/90">Progress</div>
            <div className="text-lg font-semibold mt-1">{percent}%</div>
          </div>
        </div>

        <div className="mt-6">
          <ProgressBar progress={percent} />
        </div>
      </div>

      {/* Required Skills */}
      <div className="mt-6 bg-white  rounded-xl p-6 border border-gray-100">
        <h3 className="font-semibold text-lg">Required Skills</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {roleData.requiredSkills.map((s) => (
            <span key={s} className="text-sm px-3 py-1 bg-violet-50 text-violet-700 rounded-full">
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Phases */}
      <div className="mt-6 space-y-6">
        {phases.map((ph) => (
          <Milestone
            key={ph.title}
            data={ph}
            onToggleTopic={toggleTopic}
            onTogglePhaseComplete={togglePhaseComplete}
          />
        ))}
      </div>
    </div>
  );
};

export default Roadmap;



