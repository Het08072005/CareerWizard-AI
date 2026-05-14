import React, { useState, useRef, useEffect, useContext } from "react";
import api from "../api/axiosClient";
import { CheckIcon, ExclamationCircleIcon } from "./ui/Icons";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "../context/ThemeContext";

const FeedbackItem = ({ text, type, index }) => {
  const { isDark } = useContext(ThemeContext);
  const isStrength = type === "strength";
  
  const bgClass = isStrength 
    ? (isDark ? "bg-cyan-500/[0.03]" : "bg-emerald-500/[0.03]") 
    : "bg-rose-500/[0.03]";
  const iconColor = isStrength 
    ? (isDark ? "text-cyan-400" : "text-emerald-600") 
    : "text-rose-500";
  const borderColor = isStrength 
    ? (isDark ? "border-cyan-500/10" : "border-emerald-500/10") 
    : "border-rose-500/10";
  const iconBg = isStrength 
    ? (isDark ? "bg-cyan-500/10" : "bg-emerald-500/10") 
    : "bg-rose-500/10";
  
  const formatText = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  return (
    <motion.li
      initial={{ opacity: 0, x: isStrength ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={`flex items-start p-4 mb-3 rounded-2xl border ${borderColor} ${bgClass} group hover:bg-white/[0.02] transition-all duration-500 relative overflow-hidden shadow-sm`}
    >
      {/* PREMIUM ACCENT LINE */}
      <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${isStrength ? (isDark ? 'bg-cyan-500/40' : 'bg-emerald-500/40') : 'bg-rose-500/40'} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      
      <div className={`shrink-0 w-7 h-7 rounded-xl flex items-center justify-center mr-4 mt-0.5 ${iconBg} ${iconColor} border ${borderColor} group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all duration-500`}>
        {isStrength ? <CheckIcon size={12} strokeWidth={2.5} /> : <ExclamationCircleIcon size={12} strokeWidth={2.5} />}
      </div>
      <span className="text-[var(--text-main)] group-hover:text-[var(--text-main)] transition-colors leading-relaxed text-[14px] font-medium py-0.5">{formatText(text)}</span>
    </motion.li>
  );
};

const ResultView = ({ result }) => {
  const { isDark } = useContext(ThemeContext);
  const { strengths, improvements } = result;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 pb-12">
      {/* STRENGTHS */}
      <div className="bg-[var(--bg-sidebar)] p-6 rounded-[1.5rem] border border-[var(--border-color)] relative group transition-all duration-700 shadow-md overflow-hidden">
        <div className={`absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-${isDark ? 'cyan-500' : 'emerald-500'}/20 to-transparent`} />
        
        <div className="flex items-center gap-4 mb-6 border-b border-[var(--border-color)] pb-4">
          <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-cyan-500 shadow-[0_0_10px_#06b6d4]' : 'bg-emerald-500 shadow-[0_0_10px_#10b981]'} animate-pulse`} />
          <h5 className="text-[16px] font-bold text-[var(--text-main)] tracking-tight">Key Strengths</h5>
        </div>
        <ul className="space-y-1">
          {strengths.map((text, index) => (
            <FeedbackItem key={index} index={index} text={text} type="strength" />
          ))}
        </ul>
      </div>

      {/* IMPROVEMENTS */}
      <div className="bg-[var(--bg-sidebar)] p-6 rounded-[1.5rem] border border-[var(--border-color)] relative group transition-all duration-700 shadow-md overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-rose-500/20 to-transparent" />
        
        <div className="flex items-center gap-4 mb-6 border-b border-[var(--border-color)] pb-4">
          <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_10px_#f43f5e]" />
          <h5 className="text-[16px] font-bold text-[var(--text-main)] tracking-tight">Areas for Improvement</h5>
        </div>
        <ul className="space-y-1">
          {improvements.map((text, index) => (
            <FeedbackItem key={index} index={index} text={text} type="improvement" />
          ))}
        </ul>
      </div>
    </div>
  );
};

const ResumeAnalysisOutlet = () => {
  const { isDark } = useContext(ThemeContext);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [pastedText, setPastedText] = useState("");
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const savedResult = localStorage.getItem("resumeResult");
    const savedText = localStorage.getItem("resumeText");
    const savedFile = localStorage.getItem("resumeFile");

    if (savedResult) { setResult(JSON.parse(savedResult)); setShowResults(true); }
    if (savedText) setPastedText(savedText);
    if (savedFile) {
      try {
        const { name, type, data } = JSON.parse(savedFile);
        const file = new File([new Blob([atob(data)], { type })], name, { type });
        setSelectedFile(file);
      } catch (e) { localStorage.removeItem("resumeFile"); }
    }
  }, []);

  const handleUploadClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    setResult(null); setShowResults(false);
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file); setPastedText("");
      const reader = new FileReader();
      reader.onload = () => {
        localStorage.setItem("resumeFile", JSON.stringify({ name: file.name, type: file.type, data: reader.result.split(",")[1] }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault(); setIsHovering(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type === "application/pdf" || file.name.endsWith('.doc') || file.name.endsWith('.docx'))) {
      setSelectedFile(file); setPastedText("");
      const reader = new FileReader();
      reader.onload = () => {
        localStorage.setItem("resumeFile", JSON.stringify({ name: file.name, type: file.type, data: reader.result.split(",")[1] }));
      };
      reader.readAsDataURL(file);
    } else { setError("INVALID_FILE_PROTOCOL"); }
  };

  const isAnalyzeEnabled = selectedFile || pastedText.length > 0;

  const analyzeResume = async () => {
    setLoading(true); setError(""); setShowResults(false);
    try {
      const formData = new FormData();
      if (selectedFile) formData.append("file", selectedFile);
      if (pastedText) formData.append("text", pastedText);
      const response = await api.post("/resume/analyze", formData, { headers: { "Content-Type": "multipart/form-data" } });
      setResult(response.data); setShowResults(true);
      localStorage.setItem("resumeResult", JSON.stringify(response.data));
    } catch (err) { setError("SYSTEM_STREAM_INTERRUPTED"); } finally { setLoading(false); }
  };

  const handleClear = () => {
    setResult(null); setShowResults(false); setSelectedFile(null); setPastedText("");
    localStorage.removeItem("resumeResult"); localStorage.removeItem("resumeText"); localStorage.removeItem("resumeFile");
    setError("");
  };

  return (
    <div className="w-full min-h-screen relative overflow-hidden font-sans bg-[var(--bg-main)] text-[var(--text-main)] p-5 md:px-10 pt-3 pb-8 transition-colors duration-500">
      {/* ARCHITECTURAL BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      <div className={`absolute top-0 right-0 w-[500px] h-[500px] ${isDark ? 'bg-cyan-500/5' : 'hidden'} rounded-full blur-[120px] pointer-events-none`} />

      <div className="max-w-[1400px] mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[var(--border-color)] pb-6 relative">
          <div className="flex flex-col gap-2 group">
            <h3 className="text-4xl font-bold text-[var(--text-main)] tracking-tight leading-none cursor-default">
              Resume Analysis
            </h3>
          </div>

          {result && showResults && (
            <div className="relative group scale-90 md:scale-100 origin-right transition-transform duration-700">
              <div className="relative w-24 h-24 flex items-center justify-center">
                {/* HIGH-PRECISION TELEMETRY RING (C = 2 * PI * R) */}
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle cx="50%" cy="50%" r="42%" className="text-slate-500/10 stroke-current" strokeWidth="2.5" fill="none" />
                  <motion.circle
                    initial={{ strokeDashoffset: 264 }}
                    animate={{ strokeDashoffset: 264 - (264 * result.ats_score) / 100 }}
                    transition={{ duration: 2, ease: "circOut" }}
                    cx="50%" cy="50%" r="42%"
                    className={`${result.ats_score >= 60 ? (isDark ? 'text-cyan-400' : 'text-emerald-500') : 'text-rose-500'} stroke-current drop-shadow-[0_0_12px_current]`}
                    strokeWidth="2.5" fill="none"
                    strokeDasharray="264" strokeLinecap="round"
                  />
                </svg>

                {/* INTERNAL SCORE DATA */}
                <div className="flex flex-col items-center justify-center z-10">
                  <div className="flex items-baseline gap-0.5 mt-1">
                    <span className={`text-2xl font-black tracking-tighter ${result.ats_score >= 60 ? (isDark ? 'text-cyan-400' : 'text-emerald-500') : 'text-rose-500'}`}>{result.ats_score}</span>
                    <span className="text-[10px] text-[var(--text-muted)] opacity-40 font-black tracking-widest leading-none">/100</span>
                  </div>
                  <span className={`text-[10px] font-bold tracking-[0.2em] uppercase mt-0.5 ${result.ats_score >= 60 ? 'text-emerald-500/60' : 'text-rose-500/60'}`}>ATS</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <motion.div
            whileHover={{ y: -1 }}
            className={`h-14 border rounded-xl px-6 flex justify-between items-center cursor-pointer transition-all duration-700 relative overflow-hidden group/box shadow-md ${
              isDark
                ? 'border-white/5 bg-[#080808] hover:border-cyan-500/30'
                : 'border-slate-200 bg-[var(--bg-sidebar)] hover:border-emerald-500/30'
            } ${isHovering ? (isDark ? 'border-cyan-400 bg-cyan-400/[0.02]' : 'border-emerald-400 bg-emerald-400/[0.02]') : ''}`}
            onClick={handleUploadClick} onDrop={handleDrop} onDragOver={(e) => { e.preventDefault(); setIsHovering(true); }} onDragLeave={() => setIsHovering(false)}
          >
            <div className={`absolute inset-0 bg-gradient-to-r from-${isDark ? 'cyan-500' : 'emerald-500'}/[0.03] to-transparent opacity-0 group-hover/box:opacity-100 transition-opacity duration-700`} />
            <div className={`absolute bottom-0 left-0 w-full h-[1px] bg-cyan-500/0 group-hover/box:bg-${isDark ? 'cyan-500' : 'emerald-500'}/20 transition-all duration-700`} />

            {selectedFile ? (
              <span className="text-[var(--text-main)] font-semibold text-[14px] z-10 truncate">{selectedFile.name}</span>
            ) : (
              <span className={`font-medium text-[13px] transition-colors duration-700 ${
                isDark ? 'text-slate-600 group-hover/box:text-slate-300' : 'text-slate-400 group-hover/box:text-slate-700'
              }`}>Upload Resume (PDF/DOCX)</span>
            )}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.doc,.docx" />
          </motion.div>

          <motion.div whileHover={{ y: -2 }} className="relative w-full rounded-xl shadow-md group">
            <textarea
              className={`w-full p-4 rounded-xl resize-none font-medium text-[13px] transition-all duration-700 outline-none h-14 focus:h-24 ${
                isDark
                  ? 'bg-[#080808] border-white/5 text-slate-300 placeholder-slate-800 focus:border-cyan-500/30'
                  : 'bg-[var(--bg-sidebar)] border-slate-200 text-slate-800 placeholder-slate-400 focus:border-emerald-500/30'
              }`}
              placeholder="Or paste resume text here..."
              value={pastedText} onChange={(e) => setPastedText(e.target.value)}
            />
          </motion.div>
        </div>

        <div className="flex items-center gap-6 mb-8">
          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className={`h-11 rounded-lg transition-all duration-700 font-bold text-[14px] px-10 flex items-center justify-center gap-5 shadow-md ${
              isAnalyzeEnabled 
                ? isDark 
                  ? "bg-white text-black hover:bg-cyan-400" 
                  : "bg-[#0f172a] text-white hover:bg-emerald-600 hover:shadow-[0_10px_25px_-5px_rgba(22,163,74,0.3)]" 
                : isDark 
                  ? "bg-white/[0.02] border border-white/5 text-slate-700 cursor-not-allowed" 
                  : "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed"
            }`}
            onClick={analyzeResume} disabled={!isAnalyzeEnabled || loading}
          >
            {loading ? "Analyzing..." : "Analyze Resume"}
          </motion.button>
        </div>

        <AnimatePresence>
          {loading && <div className="h-48 rounded-[2rem] border border-[var(--border-color)] bg-[var(--bg-sidebar)] animate-pulse" />}
          {!loading && showResults && result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <ResultView result={result} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ResumeAnalysisOutlet;