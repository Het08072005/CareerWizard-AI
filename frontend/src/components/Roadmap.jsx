import React, { useEffect, useState, useContext } from "react";
import api from "../api/axiosClient";
import ProgressBar from "./ProgressBar";
import Milestone from "./Milestone";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { ArrowRightIcon, BriefcaseIcon, TrendingUpIcon, ChartBarIcon } from "./ui/Icons";

const STORAGE_PREFIX = "skillgap_progress_";

const Roadmap = ({ roleData, onBack }) => {
  const { user } = useContext(AuthContext);
  const roleKey = roleData.key;

  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch initial progress from backend if logged in
  useEffect(() => {
    const fetchProgress = async () => {
      if (user) {
        try {
          const res = await api.get(`/roadmap/progress/${roleKey}`);
          if (res.data.progress_data && Object.keys(res.data.progress_data).length > 0) {
            setProgress(res.data.progress_data);
          } else {
            const raw = localStorage.getItem(STORAGE_PREFIX + roleKey);
            if (raw) setProgress(JSON.parse(raw));
          }
        } catch (err) {
          console.error("Error fetching progress:", err);
          const raw = localStorage.getItem(STORAGE_PREFIX + roleKey);
          if (raw) setProgress(JSON.parse(raw));
        }
      } else {
        const raw = localStorage.getItem(STORAGE_PREFIX + roleKey);
        if (raw) setProgress(JSON.parse(raw) || {});
      }
      setLoading(false);
    };
    fetchProgress();
  }, [roleKey, user]);

  useEffect(() => {
    if (Object.keys(progress).length === 0 && !loading) return;
    localStorage.setItem(STORAGE_PREFIX + roleKey, JSON.stringify(progress));

    const timeout = setTimeout(async () => {
      if (user && Object.keys(progress).length > 0) {
        try {
          await api.post(`/roadmap/progress/${roleKey}`, progress);
        } catch (err) {
          console.error("Progress sync error", err);
        }
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, [progress, roleKey, user, loading]);

  const phases = (roleData?.phases || []).map((phase, pIdx) => {
    const topics = (phase?.topics || []).map((t, tIdx) => {
      const completed = !!progress[`phase_${pIdx}_topic_${tIdx}`];
      return { title: t || "Untitled Topic", completed };
    });
    const completeFlag = !!progress[`phase_${pIdx}_complete`];
    return { ...phase, topics, completeFlag, index: pIdx };
  });

  const totalTopics = phases.reduce((a, ph) => a + (ph.topics?.length || 0), 0);
  const completedTopics = phases.reduce((a, ph) => a + (ph.topics || []).filter((t) => t.completed).length, 0);
  const percent = totalTopics ? Math.round((completedTopics / totalTopics) * 100) : 0;

  const toggleTopic = (phaseIndex, topicIndex) => {
    setProgress((prev) => {
      const key = `phase_${phaseIndex}_topic_${topicIndex}`;
      const newState = { ...prev, [key]: !prev[key] };
      const currentPhase = roleData?.phases?.[phaseIndex];
      if (!currentPhase) return newState;
      const allDone = (currentPhase.topics || []).every((_, idx) => newState[`phase_${phaseIndex}_topic_${idx}`]);
      newState[`phase_${phaseIndex}_complete`] = allDone;
      return newState;
    });
  };

  const togglePhaseComplete = (phaseIndex) => {
    setProgress((prev) => {
      const newState = { ...prev };
      const currentPhase = roleData?.phases?.[phaseIndex];
      if (!currentPhase) return newState;
      const isNowComplete = !prev[`phase_${phaseIndex}_complete`];
      (currentPhase.topics || []).forEach((_, idx) => { newState[`phase_${phaseIndex}_topic_${idx}`] = isNowComplete; });
      newState[`phase_${phaseIndex}_complete`] = isNowComplete;
      return newState;
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.96, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <div className="w-full text-slate-200 relative">
      {/* HEADER SECTION */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={itemVariants}
        className="relative group bg-[#080808] border border-white/5 rounded-3xl p-10 overflow-hidden shadow-2xl mb-10"
      >
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.02] to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-3xl shadow-2xl group-hover:border-indigo-500/20 transition-all duration-700">
              {typeof roleData?.icon === 'string' ? <span>{roleData.icon}</span> : (roleData?.icon ? <roleData.icon size={28} className="text-indigo-400" /> : <TrendingUpIcon size={28} className="text-indigo-400" />)}
            </div>
            <div className="group">
              <h2 className="text-3xl font-semibold text-white tracking-tight leading-none transition-all duration-700 group-hover:tracking-normal cursor-default">{roleData?.title || "Career Path"}</h2>
              <p className="text-[12px] text-slate-500 font-medium tracking-normal italic mt-2 opacity-80">{roleData?.path || "Technical Roadmap"}</p>
            </div>
          </div>

          <button
            onClick={onBack}
            className="h-12 px-8 bg-white text-black text-[11px] font-semibold uppercase tracking-widest rounded-xl hover:bg-indigo-500 hover:text-white transition-all duration-700 shadow-2xl active:scale-95"
          >
            ← Back to Paths
          </button>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5 relative z-10">
          <div className="bg-white/[0.01] border border-white/5 rounded-xl p-5 transition-all duration-700 hover:border-white/10">
            <div className="text-[9px] font-semibold text-slate-600 tracking-wider mb-2 uppercase">Average Salary</div>
            <div className="text-2xl font-semibold text-white tracking-tight">{roleData.salary}</div>
          </div>
          <div className="bg-white/[0.01] border border-white/5 rounded-xl p-5 transition-all duration-700 hover:border-white/10">
            <div className="text-[9px] font-semibold text-slate-600 tracking-wider mb-2 uppercase">Market Demand</div>
            <div className="text-2xl font-semibold text-white tracking-tight uppercase">{roleData.demand}</div>
          </div>
          <div className="bg-white/[0.01] border border-white/5 rounded-xl p-5 transition-all duration-700 hover:border-indigo-500/20 relative overflow-hidden group/progress">
            <div className="absolute inset-0 bg-indigo-500/[0.01] opacity-0 group-hover/progress:opacity-100 transition-opacity" />
            <div className="text-[9px] font-semibold text-slate-600 tracking-wider mb-2 uppercase">Path Completion</div>
            <div className="text-2xl font-semibold text-indigo-400 tracking-tight">{percent}%</div>
          </div>
        </div>

        <div className="mt-10">
          <ProgressBar progress={percent} />
        </div>
      </motion.div>

      {/* CORE SKILLS SECTION */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={itemVariants}
        className="bg-[#080808] border border-white/5 rounded-3xl p-10 mb-10 overflow-hidden relative"
      >
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-500/[0.03] rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <h3 className="text-[12px] font-semibold text-white tracking-widest mb-6 flex items-center opacity-80">
          <ChartBarIcon size={14} className="text-cyan-400 mr-3" />
          Technical Requirements
        </h3>
        <div className="flex flex-wrap gap-3 relative z-10">
          {(roleData.requiredSkills || []).map((s, i) => (
            <span
              key={s}
              className="px-4 py-2 bg-white/[0.02] border border-white/5 rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-wider transition-all duration-500 hover:border-cyan-500/30 hover:text-cyan-300 hover:bg-cyan-500/5"
            >
              {s}
            </span>
          ))}
        </div>
      </motion.div>

      {/* PHASES SECTION */}
      <motion.div
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="flex items-center justify-between px-2">
          <h3 className="text-[12px] font-semibold text-white tracking-widest flex items-center opacity-70">
            <ChartBarIcon size={16} className="text-cyan-400 mr-3" />
            Strategic Curriculum
          </h3>
          <span className="text-[11px] font-semibold text-slate-500 tracking-widest">{phases.length} PHASES DETECTED</span>
        </div>

        {phases.map((ph, idx) => {
          const colors = ["cyan", "indigo", "fuchsia", "amber", "emerald"];
          const phaseColor = colors[idx % colors.length];

          return (
            <motion.div
              key={ph.title + idx}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.15 }}
              variants={itemVariants}
            >
              <Milestone
                data={ph}
                color={phaseColor}
                onToggleTopic={toggleTopic}
                onTogglePhaseComplete={togglePhaseComplete}
              />
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default Roadmap;
