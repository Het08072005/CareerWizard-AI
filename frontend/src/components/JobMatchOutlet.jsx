import React, { useState, useEffect, useRef, useContext } from "react";
import api from "../api/axiosClient";
import JobCard from "./JobCard";
import JobFilter from "./JobFilter";
import JobFilterModal from "./JobFilterModal";
import { motion, AnimatePresence } from "framer-motion";
import { DocumentIcon, BriefcaseIcon, XIcon, ExclamationCircleIcon, CheckIcon, RefreshCwIcon } from "./ui/Icons";
import { ThemeContext } from "../context/ThemeContext";

const JobMatchOutlet = () => {
  const { isDark } = useContext(ThemeContext);
  const [jobs, setJobs] = useState([]);
  const [originalJobs, setOriginalJobs] = useState([]);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [isFetchingApi, setIsFetchingApi] = useState(false);
  const [activeTab, setActiveTab] = useState("available"); // "available" or "latest"
  const [availableJobs, setAvailableJobs] = useState([]);
  const [latestJobs, setLatestJobs] = useState([]);
  const [sortBy, setSortBy] = useState("latest"); // "latest" or "oldest"
  const fileInputRef = useRef(null);

  const [filters, setFilters] = useState({
    search: "",
    jobType: "All",
    skills: [],
    location: [],
    company: [],
    role: [],
    salaryMin: 0
  });

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const [filterOptions, setFilterOptions] = useState({
    skills: [],
    company: [],
    location: [],
    role: [],
    jobType: ["Full-time", "Contract", "Internship", "Remote", "Part-time"]
  });

  // Load all jobs initially
  useEffect(() => {
    const loadAllJobs = async () => {
      try {
        setLoading(true);
        // Load Static/All Jobs
        const resAll = await api.get("/jobs/all");
        const formattedAll = resAll.data.map(j => ({
          ...j,
          match: null,
          requiredSkills: j.required_skills || []
        }));
        setAvailableJobs(formattedAll);

        // Load API History (Latest Jobs)
        const resHistory = await api.get("/jobs/api-history");
        const formattedHistory = resHistory.data.map(j => ({
          ...j,
          match: null,
          requiredSkills: j.required_skills || []
        }));
        setLatestJobs(formattedHistory);

        // Initial view shows available jobs
        setOriginalJobs(formattedAll);
        setJobs(formattedAll);
        updateFilterOptions(formattedAll);

        setInitialLoad(false);
      } catch (err) {
        console.error("Error loading jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAllJobs();
  }, []);

  const handleUploadClick = () => fileInputRef.current.click();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const processResumeFile = async (file) => {
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError("File size too large. Maximum 10MB allowed.");
      return;
    }

    setResume(file);
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await api.post(
        "/jobs/match-resume",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const result = response.data.map((item) => ({
        ...item.job,
        match: item.match,
        requiredSkills: item.job.required_skills || []
      }));

      const filteredResult = result.filter((job) => job.match >= 60);
      const sortedResult = filteredResult.sort((a, b) => b.match - a.match);

      setOriginalJobs(sortedResult);
      setJobs(sortedResult);

    } catch (err) {
      setError("Failed to analyze resume and match jobs. Please check network and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    await processResumeFile(file);
    e.target.value = null;
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    await processResumeFile(file);
  };

  const clearResume = () => {
    setResume(null);
    setError("");
    setJobs([]);
    setOriginalJobs([]);
    window.location.reload();
  };

  const switchToAvailable = () => {
    setActiveTab("available");
    setOriginalJobs(availableJobs);
    setJobs(availableJobs);
  };

  const switchToLatest = () => {
    setActiveTab("latest");
    setOriginalJobs(latestJobs);
    setJobs(latestJobs);
  };

  const fetchLatestJobsFromApi = async () => {
    setIsFetchingApi(true);
    setActiveTab("latest");
    setError("");
    const searchQuery = filters.search.trim() || "Developer";
    try {
      const res = await api.get("/jobs/fetch-latest", {
        params: { query: searchQuery, location: "India" }
      });

      const formatted = res.data.map(j => ({
        ...j,
        match: null,
        requiredSkills: j.required_skills || []
      }));

      setLatestJobs(prev => {
        // Filter out jobs that are already in the list
        const existingIds = new Set(prev.map(p => `${p.title}-${p.company}`));
        const uniqueNew = formatted.filter(f => !existingIds.has(`${f.title}-${f.company}`));
        const updated = [...uniqueNew, ...prev]; // New jobs at the top

        // Update all relevant states
        setOriginalJobs(updated);
        setJobs(updated);
        updateFilterOptions(updated);

        return updated;
      });

    } catch (err) {
      setError("Failed to fetch latest jobs from API. Please try again later.");
    } finally {
      setIsFetchingApi(false);
    }
  };

  const updateFilterOptions = (data) => {
    const skills = new Set();
    const companies = new Set();
    const locations = new Set();
    const roles = new Set();

    data.forEach(job => {
      if (job.company) companies.add(job.company);
      if (job.location) locations.add(job.location);
      if (job.title) roles.add(job.title);
      if (job.requiredSkills) {
        job.requiredSkills.forEach(s => skills.add(s));
      }
    });

    setFilterOptions(prev => ({
      ...prev,
      skills: Array.from(skills).sort(),
      company: Array.from(companies).sort(),
      location: Array.from(locations).sort(),
      role: Array.from(roles).sort()
    }));
  };

  useEffect(() => {
    let temp = [...originalJobs];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase().trim();
      const searchWords = searchLower.split(/\s+/).filter(w => w.length > 0);

      temp = temp.filter((job) => {
        const title = (job.title || "").toLowerCase();
        const company = (job.company || "").toLowerCase();
        const desc = (job.description || "").toLowerCase();
        const skills = (job.requiredSkills || []).map(s => s.toLowerCase());

        // 1. Strong Match: Exact phrase in Company or Title
        if (company === searchLower || title === searchLower) return true;
        if (company.includes(searchLower) || title.includes(searchLower)) return true;

        // 2. Weaker Match: All search words must be present
        return searchWords.every(word => {
          // For short words, use whole-word boundary
          if (word.length <= 2) {
            const regex = new RegExp(`\\b${word}\\b`, 'i');
            return regex.test(title) || regex.test(company);
          }

          // Match title or company first
          if (title.includes(word) || company.includes(word)) return true;

          // Only match skills/desc if the word is long enough to be meaningful (avoid "ai" matching "tailwind")
          if (word.length > 3) {
            return skills.some(s => s.includes(word)) || desc.includes(word);
          }
          return false;
        });
      });

      // Sort results: Put company matches and title matches at the top
      temp.sort((a, b) => {
        const aCo = (a.company || "").toLowerCase();
        const bCo = (b.company || "").toLowerCase();
        const aTi = (a.title || "").toLowerCase();
        const bTi = (b.title || "").toLowerCase();

        if (aCo === searchLower && bCo !== searchLower) return -1;
        if (bCo === searchLower && aCo !== searchLower) return 1;
        if (aTi.includes(searchLower) && !bTi.includes(searchLower)) return -1;
        if (bTi.includes(searchLower) && !aTi.includes(searchLower)) return 1;
        return 0;
      });
    }

    if (filters.company && filters.company.length > 0) {
      temp = temp.filter(job =>
        filters.company.some(c => c.toLowerCase() === (job.company || "").toLowerCase())
      );
    }

    if (filters.role && filters.role.length > 0) {
      temp = temp.filter(job =>
        filters.role.some(r => r.toLowerCase() === (job.title || "").toLowerCase())
      );
    }

    if (filters.location && filters.location.length > 0) {
      temp = temp.filter(job =>
        filters.location.some(l => l.toLowerCase() === (job.location || "").toLowerCase())
      );
    }

    if (filters.salaryMin > 0) {
      temp = temp.filter(job => {
        const match = job.salary?.match(/\$(\d+)K/);
        if (match) {
          const val = parseInt(match[1]);
          return val >= filters.salaryMin;
        }
        return true;
      });
    }

    if (filters.jobType !== "All") {
      const types = Array.isArray(filters.jobType) ? filters.jobType : [filters.jobType];
      temp = temp.filter((job) =>
        types.some(t => job.type?.toLowerCase().includes(t.toLowerCase()) ||
          job.location?.toLowerCase().includes(t.toLowerCase()))
      );
    }

    if (filters.skills.length > 0) {
      temp = temp.filter((job) => {
        const jobSkills = (job.requiredSkills || []).map(s => s.toLowerCase());
        return filters.skills.some((s) => jobSkills.includes(s.toLowerCase()));
      });
    }

    // 5. Final Sorting based on sortBy state
    temp.sort((a, b) => {
      const dateA = new Date(a.created_at || "2024-01-01");
      const dateB = new Date(b.created_at || "2024-01-01");

      if (sortBy === "latest") {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });

    setJobs(temp);
  }, [filters, originalJobs, sortBy]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className="w-full min-h-screen relative overflow-x-hidden font-sans bg-[var(--bg-main)] text-[var(--text-main)] p-5 md:px-10 pt-3 pb-8 transition-colors duration-500">
      {/* ARCHITECTURAL BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      <div className={`absolute top-0 right-0 w-[500px] h-[500px] ${isDark ? 'bg-cyan-500/5' : 'hidden'} rounded-full blur-[120px] pointer-events-none`} />
      <div className={`absolute bottom-0 left-0 w-[400px] h-[400px] ${isDark ? 'bg-indigo-500/5' : 'bg-indigo-500/3'} rounded-full blur-[100px] pointer-events-none`} />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-[1300px] mx-auto relative z-10"
      >
        <motion.div variants={itemVariants} className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4 relative">
          <div className="flex flex-col gap-1 group">
            <h3 style={{ fontFamily: '"Cormorant Garamond", serif' }} className="text-[32px] font-bold text-[var(--text-main)] tracking-tight leading-none cursor-default">
              AI Job Matching
            </h3>
          </div>
          <p className="text-[13px] text-[var(--text-muted)] font-medium max-w-sm md:text-right leading-relaxed opacity-75">
            Advanced requirement matching with intelligent resume analysis.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col">
          {/* Filters Area */}
          <div className="mb-6 relative z-20">
            <JobFilter
              filters={filters}
              filterOptions={filterOptions}
              onFilterChange={handleFilterChange}
              onFilterOpen={() => setIsFilterModalOpen(true)}
              resumeSlot={
                resume && !loading ? (
                  <div className={`border px-4 rounded-xl flex items-center justify-between h-full backdrop-blur-md ${
                    isDark ? 'bg-emerald-500/[0.03] border-white/5' : 'bg-emerald-50 border-emerald-100'
                  }`}>
                    <div className="flex items-center text-emerald-600 dark:text-emerald-400/80 overflow-hidden">
                      <CheckIcon size={14} className="mr-2 flex-shrink-0" />
                      <span className="text-[10px] font-black tracking-widest uppercase truncate max-w-[120px]">{resume.name}</span>
                    </div>
                    <button onClick={clearResume} className="ml-2 text-rose-500/50 hover:text-rose-500 transition-colors text-[9px] font-black uppercase tracking-widest">Clear</button>
                  </div>
                ) : loading ? (
                  <div className={`border px-4 rounded-xl flex items-center justify-center h-full backdrop-blur-md ${
                    isDark ? 'bg-white/[0.01] border-white/5' : 'bg-[#fffcf7] border-[var(--gold)]/20 shadow-sm'
                  }`}>
                    <svg className={`animate-spin h-4 w-4 mr-3 ${isDark ? 'text-cyan-500/50' : 'text-emerald-500'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-10" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-40" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-[var(--text-muted)] font-black text-[9px] uppercase tracking-[0.4em]">Analyzing...</span>
                  </div>
                ) : (
                  <label
                    className={`flex items-center justify-center border border-dashed rounded-xl px-4 cursor-pointer h-full transition-all duration-700 group overflow-hidden relative shadow-sm ${
                      isDragOver 
                        ? isDark ? 'border-cyan-400 bg-cyan-400/[0.03] scale-[1.01]' : 'border-[var(--gold-dark)] bg-[var(--gold)]/10 scale-[1.01]' 
                        : isDark ? 'border-white/10 bg-white/[0.01] hover:border-white/20' : 'border-[var(--gold)] bg-[#fffcf7] shadow-[inset_0_0_20px_rgba(160,120,64,0.05)] hover:bg-[var(--gold)]/10'
                    }`}
                    onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                  >
                    <div className={`flex items-center gap-2 relative z-10 transition-colors duration-700 ${
                      isDark ? 'text-slate-400 group-hover:text-cyan-400' : 'text-[var(--gold-dark)]'
                    }`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <span className="font-semibold text-[13px] whitespace-nowrap">
                        Upload Resume
                      </span>
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleResumeUpload} className="hidden" accept=".pdf,.doc,.docx" />
                  </label>
                )
              }
            />
          </div>
        </motion.div>

        {error && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-10 p-5 bg-rose-500/[0.03] border border-rose-500/20 text-rose-500 rounded-xl flex items-center font-black text-[10px] uppercase tracking-[0.2em] max-w-3xl mx-auto backdrop-blur-md">
            <ExclamationCircleIcon className="mr-4 opacity-50" size={16} />
            {error}
          </motion.div>
        )}

        {initialLoad ? (
          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between mb-10 border-b border-[var(--border-color)] pb-6">
              <div className="h-4 bg-slate-500/10 w-32 rounded animate-pulse" />
              <div className="h-4 bg-slate-500/10 w-48 rounded animate-pulse" />
            </div>
            <div className="grid grid-cols-1 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={`init-skel-${i}`} className={`relative border rounded-2xl p-8 overflow-hidden ${isDark ? 'bg-[var(--bg-sidebar)] border-[var(--border-color)]' : 'bg-[#fffcf7] border-[var(--gold)]/20 shadow-[0_4px_20px_rgba(160,120,64,0.05)]'}`}>
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-white/[0.05]" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-500/[0.02] to-transparent animate-shimmer-fast" style={{ backgroundSize: '200% 100%' }} />

                  <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center relative z-10 opacity-40">
                    <div className="w-16 h-16 rounded-xl bg-slate-500/10 border border-[var(--border-color)] shrink-0" />
                    <div className="flex-1 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2 w-full">
                          <div className="h-6 bg-slate-500/20 w-1/3 rounded-lg" />
                          <div className="h-3 bg-slate-500/10 w-1/4 rounded-lg" />
                        </div>
                        <div className="w-24 h-12 rounded-xl bg-slate-500/10 border border-[var(--border-color)]" />
                      </div>
                      <div className="flex gap-4">
                        <div className="h-3 bg-slate-500/10 w-20 rounded" />
                        <div className="h-3 bg-slate-500/10 w-20 rounded" />
                        <div className="h-3 bg-slate-500/10 w-20 rounded" />
                      </div>
                      <div className="h-12 bg-slate-500/5 border border-[var(--border-color)] w-full rounded-xl" />
                      <div className="flex gap-2">
                        <div className="h-6 bg-slate-500/10 w-16 rounded-lg" />
                        <div className="h-6 bg-slate-500/10 w-16 rounded-lg" />
                        <div className="h-6 bg-slate-500/10 w-16 rounded-lg" />
                      </div>
                    </div>
                    <div className="w-full lg:w-32 h-12 bg-slate-500/10 rounded-xl hidden lg:block" />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border border-[var(--border-color)] rounded-full flex items-center justify-center animate-spin mb-8">
                <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'bg-emerald-500'}`} />
              </div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] animate-pulse">Syncing vacancies...</p>
            </div>
          </div>
        ) : loading ? (
          <div className="mt-8 space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={`load-skel-${i}`} className={`relative border rounded-2xl p-8 overflow-hidden ${isDark ? 'bg-[var(--bg-sidebar)] border-[var(--border-color)]' : 'bg-[#fffcf7] border-[var(--gold)]/20 shadow-[0_4px_20px_rgba(160,120,64,0.05)]'}`}>
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-white/[0.05]" />
                  <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-${isDark ? 'cyan-500' : 'emerald-500'}/[0.03] to-transparent animate-shimmer-fast`} style={{ backgroundSize: '200% 100%' }} />
                  <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center relative z-10 opacity-40">
                    <div className="w-16 h-16 rounded-xl bg-slate-500/10 shrink-0" />
                    <div className="flex-1 space-y-4">
                      <div className="h-6 bg-slate-500/20 w-1/2 rounded" />
                      <div className="h-4 bg-slate-500/10 w-full rounded" />
                      <div className="h-4 bg-slate-500/10 w-full rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 border-b border-[var(--border-color)] pb-4 gap-4">
              <div className="flex items-center gap-6">
                {/* TAB SWITCHER */}
                <div className={`flex items-center p-1 border rounded-xl backdrop-blur-md ${
                  isDark ? 'bg-white/[0.03] border-white/5' : 'bg-[#fffcf7] border-[var(--gold)]/20 shadow-[0_4px_20px_rgba(160,120,64,0.05)]'
                }`}>
                  <button
                    onClick={switchToAvailable}
                    className={`px-4 py-2 rounded-lg text-[12px] font-bold transition-all duration-500 ${activeTab === "available"
                        ? isDark ? "bg-white/10 text-white shadow-lg" : "bg-white text-[var(--gold-dark)] shadow-[0_4px_15px_rgba(160,120,64,0.1)] border border-[var(--gold)]/20"
                        : isDark ? "text-slate-500 hover:text-slate-300" : "text-[var(--text-muted)] hover:text-[var(--gold-dark)]"
                      }`}
                  >
                    Available Jobs
                    <span className={`ml-2 px-1.5 py-0.5 rounded text-[10px] ${
                      activeTab === "available" 
                        ? isDark ? "bg-white/10 text-white/60" : "bg-slate-200/60 text-slate-700" 
                        : "bg-white/5 text-slate-600"
                    }`}>
                      {availableJobs.length}
                    </span>
                  </button>
                  <button
                    onClick={switchToLatest}
                    className={`px-4 py-2 rounded-lg text-[12px] font-bold transition-all duration-500 ${activeTab === "latest"
                        ? isDark
                          ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)]"
                          : "bg-[var(--gold)]/10 text-[var(--gold-dark)] border border-[var(--gold)]/30 shadow-[0_4px_15px_rgba(160,120,64,0.05)]"
                        : isDark ? "text-slate-500 hover:text-slate-300" : "text-[var(--text-muted)] hover:text-[var(--gold-dark)]"
                      }`}
                  >
                    Latest Jobs
                    <span className={`ml-2 px-1.5 py-0.5 rounded text-[10px] ${
                      activeTab === "latest" 
                        ? isDark ? "bg-cyan-500/20 text-cyan-300" : "bg-emerald-500/20 text-emerald-700" 
                        : "bg-white/5 text-slate-600"
                    }`}>
                      {latestJobs.length}
                    </span>
                  </button>
                </div>

                <button
                  onClick={fetchLatestJobsFromApi}
                  disabled={isFetchingApi}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-[12px] font-bold transition-all duration-300 active:scale-95 ${
                    isDark 
                      ? "bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border-cyan-500/20" 
                      : "bg-[#fffcf7] hover:bg-[var(--gold)]/10 text-[var(--text-main)] hover:text-[var(--gold-dark)] border-[var(--gold)]/20 hover:border-[var(--gold)]/40 shadow-[0_2px_10px_rgba(160,120,64,0.04)]"
                  }`}
                >
                  {isFetchingApi ? (
                    <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                      <circle className="opacity-10" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-40" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <RefreshCwIcon size={14} className={isFetchingApi ? "animate-spin" : ""} />
                  )}
                  Refresh
                </button>
              </div>

              <div className="flex items-center gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`rounded-xl px-4 py-2 text-[12px] font-bold focus:outline-none transition-all cursor-pointer border ${
                    isDark 
                      ? 'bg-[#080808] border-white/10 text-slate-300 focus:border-cyan-500/50' 
                      : 'bg-[#fffcf7] border-[var(--gold)]/20 text-[var(--text-main)] focus:border-[var(--gold)]/40 shadow-[0_2px_10px_rgba(160,120,64,0.04)]'
                  }`}
                >
                  <option value="latest">Sort: Newest First</option>
                  <option value="oldest">Sort: Oldest First</option>
                </select>
                {resume && (
                  <button
                    onClick={() => {
                      setResume(null);
                      setInitialLoad(true);
                      window.location.reload();
                    }}
                    className="text-[10px] font-bold text-rose-500 hover:text-rose-400 underline underline-offset-4 transition-colors"
                  >
                    Clear Resume & Reset
                  </button>
                )}
                {resume && (
                  <span className="text-[12px] font-semibold text-emerald-500 flex items-center">
                    <CheckIcon size={14} className="mr-2" />
                    Optimized Match
                  </span>
                )}
              </div>
            </div>

            {jobs.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {jobs.map((job) => <JobCard key={job.id} job={job} />)}
              </div>
            ) : (
              <div className={`border p-16 rounded-2xl text-center max-w-2xl mx-auto flex flex-col items-center ${
                isDark ? 'bg-white/[0.01] border-white/5' : 'bg-[#fffcf7] border-[var(--gold)]/20 shadow-[0_4px_20px_rgba(160,120,64,0.05)]'
              }`}>
                <h3 className="text-lg font-bold text-[var(--text-main)] mb-2">No Matches Found</h3>
                <p className="text-[14px] text-[var(--text-muted)] font-medium max-w-xs leading-relaxed mb-8">Try adjusting your filters or search terms to find relevant job opportunities.</p>
                <button
                  onClick={() => setFilters({
                    search: "",
                    jobType: "All",
                    skills: [],
                    location: [],
                    company: [],
                    role: [],
                    salaryMin: 0
                  })}
                  className={`px-6 py-2 border rounded-xl text-[12px] font-bold transition-all uppercase tracking-widest ${
                    isDark 
                      ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white' 
                      : 'bg-[var(--gold)]/10 hover:bg-[var(--gold)]/20 border-[var(--gold)]/20 text-[var(--gold-dark)] hover:shadow-md'
                  }`}
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        )}
      </motion.div>

      <JobFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        options={filterOptions}
      />
    </div>
  );
};

export default JobMatchOutlet;
