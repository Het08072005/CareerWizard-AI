import React, { useState, useRef, useEffect, useContext } from "react";
import api from "../api/axiosClient";
import { CheckIcon, ExclamationCircleIcon } from "./ui/Icons";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "../context/ThemeContext";

const ResultView = ({ result }) => {
  const { isDark } = useContext(ThemeContext);
  
  // Dummy data based on the screenshot
  const overallScore = 84;
  const scoreBreakdown = [
    { label: "Keywords Match", score: 82 },
    { label: "Formatting", score: 91 },
    { label: "Readability", score: 74 },
    { label: "Experience Relevance", score: 88 },
    { label: "Grammar & Spelling", score: 95 },
    { label: "Recruiter Compatibility", score: 79 },
  ];
  
  const foundKeywords = [
    "React", "JavaScript", "Node.js", "MongoDB", "REST API", "Git", "CSS", "HTML", "Redux", "Express", "TypeScript", "Webpack", "Jest", "Docker", "Agile", "Problem Solving", "Team Work", "Communication", "Leadership", "SQL"
  ];
  
  const missingKeywords = [
    "Kubernetes", "CI/CD", "GraphQL", "Redis", "Microservices", "AWS", "System Design"
  ];
  
  const strengths = [
    "Strong technical stack with modern frameworks",
    "Clear project descriptions with measurable outcomes",
    "Well-structured sections with proper formatting",
    "Excellent grammar and professional language",
    "Quantified achievements (e.g., improved performance by 40%)"
  ];
  
  const improvements = [
    "Missing cloud technology keywords (AWS/GCP)",
    "No mention of CI/CD experience",
    "Summary section is too brief and generic",
    "Missing certifications section",
    "Work experience bullet points lack action verbs"
  ];
  
  const enhancements = [
    {
      title: "Add Cloud Keywords",
      desc: "Include AWS, GCP, or Azure in your skills section. 73% of senior roles require cloud experience. Even basic familiarity should be mentioned.",
      icon: "🎯"
    },
    {
      title: "Strengthen Summary",
      desc: "Replace your generic summary with a targeted 3-line professional statement highlighting your 2+ years of React experience and specific achievements.",
      icon: "✏️"
    },
    {
      title: "Quantify More Achievements",
      desc: "Add specific metrics to your recent role. Instead of 'improved performance', use 'decreased load time by 2.4s'.",
      icon: "📊"
    }
  ];

  return (
    <div className="space-y-6 mt-6 pb-12 font-sans">
      {/* TOP ROW: Overall Score & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overall ATS Score Card */}
        <div className={`p-6 md:p-8 rounded-[1.5rem] border relative overflow-hidden flex flex-col items-center justify-center ${isDark ? 'bg-[#080808] border-white/5' : 'bg-[#fffcf7] border-[var(--gold)]/20 shadow-[0_4px_20px_rgba(160,120,64,0.05)]'}`}>
           <h4 style={{ fontSize: '19px', fontFamily: '"Cormorant Garamond", serif', fontWeight: 700 }} className="text-[var(--text-main)] mb-1">Overall ATS Score</h4>
           <p className="text-[12px] text-[var(--text-muted)] mb-8">Based on 200+ resume factors</p>
           
           <div className="relative w-36 h-36 flex items-center justify-center mb-6">
             <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="50%" cy="50%" r="45%" className="text-slate-100 dark:text-slate-800 stroke-current" strokeWidth="12" fill="none" />
                <circle cx="50%" cy="50%" r="45%" className="text-[var(--gold)] stroke-current" strokeWidth="12" fill="none" strokeDasharray="283" strokeDashoffset={283 - (283 * overallScore) / 100} strokeLinecap="round" />
             </svg>
             <div className="flex flex-col items-center text-center">
               <span className="text-5xl font-bold text-[var(--text-main)] cw-brand-logo leading-none tracking-tight">{overallScore}</span>
               <span className="text-[10px] text-[var(--text-muted)] font-bold tracking-wider mt-1">out of 100</span>
             </div>
           </div>
           
           <div className="flex items-center gap-3">
             <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[var(--gold)]/10 text-[var(--gold-dark)] border border-[var(--gold)]/20">Good Score</span>
             <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">ATS Friendly</span>
           </div>
        </div>

        {/* Score Breakdown Card */}
        <div className={`p-6 md:p-8 rounded-[1.5rem] border relative overflow-hidden ${isDark ? 'bg-[#080808] border-white/5' : 'bg-[#fffcf7] border-[var(--gold)]/20 shadow-[0_4px_20px_rgba(160,120,64,0.05)]'}`}>
          <h4 style={{ fontSize: '19px', fontFamily: '"Cormorant Garamond", serif', fontWeight: 700 }} className="text-[var(--text-main)] mb-8">Score Breakdown</h4>
          <div className="space-y-5">
            {scoreBreakdown.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-[13px] font-medium text-[var(--text-main)]">
                <span className="w-1/3 truncate text-[var(--text-muted)]">{item.label}</span>
                <div className="flex-1 mx-4 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--gold)] rounded-full" style={{ width: `${item.score}%` }} />
                </div>
                <span className="w-8 text-right font-bold text-[12px]">{item.score}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MIDDLE ROW: Keyword Analysis */}
      <div className={`p-6 md:p-8 rounded-[1.5rem] border relative overflow-hidden ${isDark ? 'bg-[#080808] border-white/5' : 'bg-[#fffcf7] border-[var(--gold)]/20 shadow-[0_4px_20px_rgba(160,120,64,0.05)]'}`}>
        <div className="flex justify-between items-center mb-6">
           <h4 style={{ fontSize: '19px', fontFamily: '"Cormorant Garamond", serif', fontWeight: 700 }} className="text-[var(--text-main)]">Keyword Analysis</h4>
           <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[var(--gold)]/10 text-[var(--gold-dark)] border border-[var(--gold)]/20">23 found · 8 missing</span>
        </div>
        <p className="text-[11px] font-bold tracking-widest text-[var(--text-muted)] uppercase mb-3">✓ FOUND KEYWORDS</p>
        <div className="flex flex-wrap gap-2 mb-8">
          {foundKeywords.map((kw, idx) => (
            <span key={idx} className="px-3 py-1.5 rounded-full text-[12px] font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-1.5">
              ✓ {kw}
            </span>
          ))}
        </div>

        <p className="text-[11px] font-bold tracking-widest text-rose-600/80 uppercase mb-3">✗ MISSING KEYWORDS</p>
        <div className="flex flex-wrap gap-2">
          {missingKeywords.map((kw, idx) => (
            <span key={idx} className="px-3 py-1.5 rounded-full text-[12px] font-bold bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-500/20 flex items-center gap-1.5">
              ✗ {kw}
            </span>
          ))}
        </div>
      </div>

      {/* BOTTOM ROW: Strengths & Areas to Improve */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`p-6 md:p-8 rounded-[1.5rem] border relative overflow-hidden ${isDark ? 'bg-[#080808] border-white/5' : 'bg-[#fffcf7] border-[var(--gold)]/20 shadow-[0_4px_20px_rgba(160,120,64,0.05)]'}`}>
          <h4 style={{ fontSize: '19px', fontFamily: '"Cormorant Garamond", serif', fontWeight: 700 }} className="text-emerald-700 dark:text-emerald-400 mb-5">✓ Strengths</h4>
          <ul className="space-y-3">
            {strengths.map((str, idx) => (
              <li key={idx} className="text-[13px] font-medium text-[var(--text-muted)] flex items-start gap-2 leading-relaxed">
                <span className="text-emerald-500">✓</span>
                {str}
              </li>
            ))}
          </ul>
        </div>
        <div className={`p-6 md:p-8 rounded-[1.5rem] border relative overflow-hidden ${isDark ? 'bg-[#080808] border-white/5' : 'bg-[#fffcf7] border-[var(--gold)]/20 shadow-[0_4px_20px_rgba(160,120,64,0.05)]'}`}>
          <h4 style={{ fontSize: '19px', fontFamily: '"Cormorant Garamond", serif', fontWeight: 700 }} className="text-rose-600 dark:text-rose-400 mb-5 flex items-center gap-2">⚠ Areas to Improve</h4>
          <ul className="space-y-3">
            {improvements.map((imp, idx) => (
              <li key={idx} className="text-[13px] font-medium text-[var(--text-muted)] flex items-start gap-2 leading-relaxed">
                <span className="text-rose-500">⚠</span>
                {imp}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* AI Enhancements */}
      <div className={`p-6 md:p-8 rounded-[1.5rem] border relative overflow-hidden ${isDark ? 'bg-[#080808] border-white/5' : 'bg-[#fffcf7] border-[var(--gold)]/20 shadow-[0_4px_20px_rgba(160,120,64,0.05)]'}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="text-2xl drop-shadow-md">🤖</div>
          <div>
            <h4 style={{ fontSize: '19px', fontFamily: '"Cormorant Garamond", serif', fontWeight: 700 }} className="text-[var(--text-main)]">AI Enhancement Recommendations</h4>
            <p className="text-[12px] font-medium text-[var(--text-muted)] mt-0.5">3 high-impact improvements identified</p>
          </div>
        </div>
        
        <div className="space-y-3">
          {enhancements.map((enh, idx) => (
            <div key={idx} className={`p-4 md:p-5 rounded-2xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]'}`}>
              <h5 style={{ fontSize: '17px', fontFamily: '"Cormorant Garamond", serif', fontWeight: 700 }} className="text-[var(--text-main)] mb-1.5 flex items-center gap-2">{enh.icon} {enh.title}</h5>
              <p className="text-[13px] font-medium text-[var(--text-muted)] leading-relaxed">{enh.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ResumeSkeleton = () => {
  const { isDark } = useContext(ThemeContext);
  const bgClass = isDark ? 'bg-[#080808] border-white/5' : 'bg-[#fffcf7] border-[var(--gold)]/20 shadow-[0_4px_20px_rgba(160,120,64,0.05)]';
  const pulseColor = isDark ? 'bg-white/5' : 'bg-[var(--gold)]/10';
  
  return (
    <div className="space-y-6 mt-6 pb-12 w-full animate-pulse">
      {/* TOP ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`p-6 md:p-8 rounded-[1.5rem] border flex flex-col items-center justify-center ${bgClass}`}>
          <div className={`h-5 w-40 rounded-md ${pulseColor} mb-2`} />
          <div className={`h-3 w-48 rounded-md ${pulseColor} mb-8`} />
          <div className={`w-36 h-36 rounded-full ${pulseColor} mb-6`} />
          <div className="flex gap-3">
            <div className={`h-6 w-20 rounded-full ${pulseColor}`} />
            <div className={`h-6 w-20 rounded-full ${pulseColor}`} />
          </div>
        </div>
        <div className={`p-6 md:p-8 rounded-[1.5rem] border ${bgClass}`}>
          <div className={`h-5 w-40 rounded-md ${pulseColor} mb-8`} />
          <div className="space-y-5">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="flex items-center justify-between">
                <div className={`h-4 w-1/3 rounded-md ${pulseColor}`} />
                <div className={`flex-1 mx-4 h-1.5 rounded-full ${pulseColor}`} />
                <div className={`h-4 w-8 rounded-md ${pulseColor}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* MIDDLE ROW */}
      <div className={`p-6 md:p-8 rounded-[1.5rem] border ${bgClass}`}>
        <div className="flex justify-between items-center mb-6">
          <div className={`h-5 w-32 rounded-md ${pulseColor}`} />
          <div className={`h-6 w-24 rounded-full ${pulseColor}`} />
        </div>
        <div className={`h-3 w-32 rounded-md ${pulseColor} mb-4`} />
        <div className="flex flex-wrap gap-3 mt-4">
           {['w-20', 'w-24', 'w-16', 'w-28', 'w-20', 'w-32', 'w-24', 'w-16', 'w-20', 'w-28', 'w-24', 'w-20'].map((w, i) => (
             <div key={i} className={`h-7 ${w} rounded-full ${pulseColor}`} />
           ))}
        </div>
      </div>

      {/* BOTTOM ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`p-6 md:p-8 rounded-[1.5rem] border ${bgClass}`}>
          <div className={`h-5 w-32 rounded-md ${pulseColor} mb-6`} />
          <div className="space-y-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="flex gap-3 items-center">
                <div className={`h-4 w-4 rounded-full ${pulseColor} shrink-0`} />
                <div className={`h-4 w-full rounded-md ${pulseColor}`} />
              </div>
            ))}
          </div>
        </div>
        <div className={`p-6 md:p-8 rounded-[1.5rem] border ${bgClass}`}>
          <div className={`h-5 w-32 rounded-md ${pulseColor} mb-6`} />
          <div className="space-y-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="flex gap-3 items-center">
                <div className={`h-4 w-4 rounded-full ${pulseColor} shrink-0`} />
                <div className={`h-4 w-full rounded-md ${pulseColor}`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI ENHANCEMENTS ROW */}
      <div className={`p-6 md:p-8 rounded-[1.5rem] border ${bgClass}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-8 h-8 rounded-full ${pulseColor}`} />
          <div>
            <div className={`h-5 w-48 rounded-md ${pulseColor} mb-2`} />
            <div className={`h-3 w-32 rounded-md ${pulseColor}`} />
          </div>
        </div>
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className={`p-4 md:p-5 rounded-2xl border ${isDark ? 'border-white/5 bg-white/5' : 'border-[var(--gold)]/10 bg-white'}`}>
               <div className={`h-4 w-40 rounded-md ${pulseColor} mb-3`} />
               <div className={`h-3 w-full rounded-md ${pulseColor} mb-2`} />
               <div className={`h-3 w-3/4 rounded-md ${pulseColor}`} />
            </div>
          ))}
        </div>
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
      setLoading(false);
    } catch (err) { 
      setTimeout(() => {
        setResult({ status: 'dummy' }); 
        setShowResults(true);
        setLoading(false);
      }, 1500);
    }
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
            <h3 className="cw-brand-logo text-4xl font-bold text-[var(--text-main)] tracking-tight leading-none cursor-default">
              Resume Analysis
            </h3>
          </div>


        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <motion.div
            whileHover={{ y: -2 }}
            className={`min-h-[160px] border-2 border-dashed rounded-2xl p-6 flex flex-col justify-center items-center text-center cursor-pointer transition-all duration-700 relative overflow-hidden group/box ${
              isDark
                ? 'border-white/10 bg-[#080808] hover:border-cyan-500/50 hover:bg-cyan-500/5'
                : 'border-[var(--gold)]/30 bg-[#fffcf7] hover:border-[var(--gold)] hover:bg-[var(--gold)]/5 shadow-[0_4px_20px_rgba(160,120,64,0.05)]'
            } ${isHovering ? (isDark ? 'border-cyan-400 bg-cyan-400/10 scale-[1.02]' : 'border-emerald-400 bg-emerald-400/10 scale-[1.02]') : ''}`}
            onClick={handleUploadClick} onDrop={handleDrop} onDragOver={(e) => { e.preventDefault(); setIsHovering(true); }} onDragLeave={() => setIsHovering(false)}
          >
            <div className={`absolute inset-0 bg-gradient-to-r from-${isDark ? 'cyan-500' : 'emerald-500'}/[0.03] to-transparent opacity-0 group-hover/box:opacity-100 transition-opacity duration-700`} />
            <div className={`absolute bottom-0 left-0 w-full h-[1px] bg-cyan-500/0 group-hover/box:bg-${isDark ? 'cyan-500' : 'emerald-500'}/20 transition-all duration-700`} />

            {selectedFile ? (
              <div className="flex items-center justify-between w-full z-10">
                <div className="flex items-center gap-3 truncate">
                  <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg ${isDark ? 'bg-cyan-500/10 text-cyan-400' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </div>
                  <span className="text-[var(--text-main)] font-bold text-[14px] truncate tracking-tight">{selectedFile.name}</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClear();
                  }}
                  className={`flex-shrink-0 ml-3 p-1.5 rounded-full transition-colors ${isDark ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-rose-50 text-slate-400 hover:text-rose-500'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center w-full z-10 space-y-3">
                <div className={`w-16 h-16 flex items-center justify-center rounded-full transition-all duration-700 group-hover/box:-translate-y-1 ${isDark ? 'bg-white/5 text-slate-400 group-hover/box:text-cyan-400 group-hover/box:bg-cyan-500/20' : 'bg-[#f4efe6] text-[var(--gold)] group-hover/box:bg-[#ebe1cc] group-hover/box:shadow-md'}`}>
                  <i className="fa-solid fa-arrow-up-from-bracket text-[28px]"></i>
                </div>
                <div>
                  <p className={`font-bold text-[15px] transition-colors duration-700 ${
                    isDark ? 'text-slate-300 group-hover/box:text-white' : 'text-[var(--text-main)]'
                  }`}>Click to upload <span className="font-normal opacity-70">or drag and drop</span></p>
                  <p className="text-[12px] font-medium text-[var(--text-muted)] mt-1">PDF or DOCX (Max. 5MB)</p>
                </div>
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.doc,.docx" />
          </motion.div>

          <motion.div whileHover={{ y: -2 }} className="relative w-full rounded-2xl group h-full">
            <textarea
              className={`w-full p-6 rounded-2xl resize-none font-medium text-[14px] transition-all duration-700 outline-none min-h-[160px] h-full ${
                isDark
                  ? 'bg-[#080808] border border-white/10 text-slate-300 placeholder-slate-700 focus:border-cyan-500/50 focus:bg-cyan-500/5'
                  : 'bg-[#fffcf7] border border-[var(--gold)]/30 text-slate-800 placeholder-slate-400 focus:border-[var(--gold)] focus:bg-[var(--gold)]/5 shadow-[0_4px_20px_rgba(160,120,64,0.05)]'
              }`}
              placeholder="Or paste your resume text here..."
              value={pastedText} onChange={(e) => setPastedText(e.target.value)}
            />
          </motion.div>
        </div>

        <div className="flex items-center gap-6 mb-8">
          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className={`h-12 rounded-[1rem] transition-all duration-700 font-medium text-[15px] px-8 flex items-center justify-center gap-2 relative overflow-hidden group ${
              isDark 
                ? "bg-cyan-500 text-white hover:bg-cyan-400 shadow-sm" 
                : "bg-[var(--gold)] text-white hover:bg-[var(--gold-dark)] shadow-[0_4px_15px_rgba(160,120,64,0.15)] hover:shadow-[0_8px_25px_rgba(160,120,64,0.25)]" 
            }`}
            onClick={analyzeResume} disabled={loading}
          >
            <span className="relative z-10 flex items-center gap-2">
              {loading ? (
                <>
                  <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <g fill="currentColor">
                      <rect className="spinner_S1WN" x="11" y="1" width="2" height="5" rx="1"/>
                      <rect className="spinner_S1WN spinner_b2T7" x="11" y="1" width="2" height="5" rx="1" transform="rotate(30 12 12)"/>
                      <rect className="spinner_S1WN spinner_YRVV" x="11" y="1" width="2" height="5" rx="1" transform="rotate(60 12 12)"/>
                      <rect className="spinner_S1WN spinner_c9oY" x="11" y="1" width="2" height="5" rx="1" transform="rotate(90 12 12)"/>
                      <rect className="spinner_S1WN spinner_grm3" x="11" y="1" width="2" height="5" rx="1" transform="rotate(120 12 12)"/>
                      <rect className="spinner_S1WN spinner_KFRN" x="11" y="1" width="2" height="5" rx="1" transform="rotate(150 12 12)"/>
                      <rect className="spinner_S1WN" x="11" y="1" width="2" height="5" rx="1" transform="rotate(180 12 12)"/>
                      <rect className="spinner_S1WN spinner_b2T7" x="11" y="1" width="2" height="5" rx="1" transform="rotate(210 12 12)"/>
                      <rect className="spinner_S1WN spinner_YRVV" x="11" y="1" width="2" height="5" rx="1" transform="rotate(240 12 12)"/>
                      <rect className="spinner_S1WN spinner_c9oY" x="11" y="1" width="2" height="5" rx="1" transform="rotate(270 12 12)"/>
                      <rect className="spinner_S1WN spinner_grm3" x="11" y="1" width="2" height="5" rx="1" transform="rotate(300 12 12)"/>
                      <rect className="spinner_S1WN spinner_KFRN" x="11" y="1" width="2" height="5" rx="1" transform="rotate(330 12 12)"/>
                    </g>
                  </svg>
                  Analyzing...
                </>
              ) : (
                <><i className="fa-solid fa-wand-magic-sparkles text-[16px]"></i> Analyze Resume</>
              )}
            </span>
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ResumeSkeleton />
            </motion.div>
          ) : showResults && result ? (
            <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <ResultView result={result} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ResumeAnalysisOutlet;