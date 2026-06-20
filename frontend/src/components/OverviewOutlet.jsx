import React, { useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { motion } from "framer-motion";
import {
    DocumentIcon,
    BriefcaseIcon,
    SparklesIcon,
    MapIcon,
    ChatIcon,
    ArrowRightIcon,
    TrendingUpIcon
} from "./ui/Icons";
import { RocketLaunchIcon, CheckBadgeIcon } from "@heroicons/react/24/outline";

const FadeUp = ({ children, delay = 0, className = "" }) => (
    <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
        className={className}
    >
        {children}
    </motion.div>
);

const BentoCard = ({ title, desc, IconComponent, onClick, delay }) => {
    const { isDark } = useContext(ThemeContext);
    return (
        <FadeUp delay={delay} className="h-full">
            <div
                onClick={onClick}
                className={`group relative p-5 sm:p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between h-full ${
                    isDark 
                        ? 'bg-[#111111]/80 border-white/5 hover:bg-[#1a1a1a] hover:border-[var(--gold)]/30 shadow-sm' 
                        : 'bg-white/90 backdrop-blur-md border-slate-200/80 hover:bg-white hover:border-[var(--gold-dark)]/40 shadow-sm hover:shadow-[0_8px_30px_rgba(160,120,64,0.08)]'
                }`}
            >
                <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center gap-3.5 mb-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-sm ${
                            isDark 
                                ? 'bg-white/5 border border-white/10 text-slate-300 group-hover:text-[var(--gold)] group-hover:bg-[var(--gold)]/10' 
                                : 'bg-slate-50 border border-slate-100 text-slate-600 group-hover:text-white group-hover:bg-[var(--gold-dark)]'
                        }`}>
                            <IconComponent className="w-4 h-4" />
                        </div>
                        <h4 
                            className={`text-[17px] font-bold tracking-tight transition-colors duration-300 ${isDark ? 'text-white' : 'text-slate-900 group-hover:text-[var(--gold-dark)]'}`}
                            style={{ fontFamily: "'EB Garamond', Georgia, serif" }}
                        >
                            {title}
                        </h4>
                    </div>
                    
                    <p className={`text-[13.5px] leading-relaxed transition-colors duration-300 flex-1 ${
                        isDark ? 'text-slate-400 group-hover:text-slate-300' : 'text-slate-500 group-hover:text-slate-700'
                    }`}>{desc}</p>
                </div>
            </div>
        </FadeUp>
    );
};

const OverviewOutlet = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { isDark } = useContext(ThemeContext);

    return (
        <div className="p-4 md:p-6 space-y-5 md:space-y-6 font-sans pb-16 max-w-[1400px] mx-auto">
            {/* SLEEK PROFESSIONAL HERO SECTION */}
            <FadeUp delay={0.1}>
                <section className={`relative w-full rounded-2xl border p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 transition-colors duration-500 overflow-hidden ${
                    isDark 
                        ? 'bg-[#0a0a0a] border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.4)]' 
                        : 'bg-gradient-to-r from-slate-50 to-white border-slate-200/60 shadow-sm'
                }`}>
                    <div className={`absolute top-0 right-0 w-[400px] h-[400px] -mt-32 -mr-32 rounded-full blur-[100px] opacity-30 pointer-events-none ${isDark ? 'bg-gradient-to-b from-[var(--gold)]/30 to-purple-900/10' : 'bg-gradient-to-b from-[var(--gold)]/20 to-blue-200/20'}`} />
                    
                    <div className="relative z-10 w-full md:max-w-2xl">
                        <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest mb-4 border ${
                            isDark ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-white border-slate-200 text-slate-500 shadow-sm'
                        }`}>
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                            </span>
                            Dashboard
                        </div>
                        
                        <h1 
                            className="text-3xl md:text-4xl tracking-tight mb-3 flex items-center gap-2 flex-wrap"
                            style={{ fontFamily: "'EB Garamond', Georgia, serif" }}
                        >
                            <span className={isDark ? 'text-white font-medium' : 'text-slate-900 font-medium'}>Welcome back,</span>
                            <span 
                                className={`font-bold ${isDark ? 'text-[var(--gold)]' : 'text-[var(--gold-dark)]'}`}
                                style={{ fontFamily: "'EB Garamond', Georgia, serif" }}
                            >
                                {user?.name || 'Het'}
                            </span>
                        </h1>
                        <p className={`text-[14px] md:text-[15px] font-medium max-w-lg ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Your career dashboard is up to date. Ready to take the next step?
                        </p>
                    </div>

                    <div className="relative z-10 w-full md:w-auto flex-shrink-0 mt-2 md:mt-0">
                        <button
                            onClick={() => navigate("/overview/job-match")}
                            className={`group relative flex items-center gap-2.5 px-6 py-3 rounded-xl text-[14px] font-bold transition-all duration-300 active:scale-[0.98] ${
                                isDark 
                                    ? 'bg-[var(--gold)] text-black hover:bg-amber-400 shadow-[0_0_15px_rgba(252,211,77,0.2)]' 
                                    : 'bg-[var(--gold-dark)] text-white hover:bg-amber-700 shadow-[0_4px_15px_rgba(160,120,64,0.3)]'
                            }`}
                        >
                            <SparklesIcon className="w-4 h-4" />
                            Find Job
                        </button>
                    </div>
                </section>
            </FadeUp>

            {/* BENTO BOX GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
                
                {/* ROW 1 */}
                <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                    <BentoCard
                        title="ATS Matching"
                        desc="Scan and optimize your resume against actual Applicant Tracking Systems algorithms."
                        IconComponent={DocumentIcon}
                        onClick={() => navigate("/overview/resume-analysis")}
                        delay={0.2}
                    />
                    <BentoCard
                        title="Interview Prep"
                        desc="Practice with highly-realistic AI simulations using the STAR response framework."
                        IconComponent={ChatIcon}
                        onClick={() => navigate("/overview/interview-prep")}
                        delay={0.3}
                    />
                    <BentoCard
                        title="Job Finding"
                        desc="Leverage our deep-search engine to uncover matching opportunities globally."
                        IconComponent={BriefcaseIcon}
                        onClick={() => navigate("/overview/job-match")}
                        delay={0.4}
                    />
                    <BentoCard
                        title="Structured Roadmap"
                        desc="A step-by-step path to bridge skill gaps and reach your dream role faster."
                        IconComponent={MapIcon}
                        onClick={() => navigate("/overview/skills-gap")}
                        delay={0.5}
                    />
                    <BentoCard
                        title="Internship Portal"
                        desc="Access your daily tasks, learning resources, and track your overall progress."
                        IconComponent={RocketLaunchIcon}
                        onClick={() => navigate("/internship")}
                        delay={0.6}
                    />
                    <BentoCard
                        title="My Certificates"
                        desc="View, manage, and download all your earned certificates from completed programs."
                        IconComponent={CheckBadgeIcon}
                        onClick={() => navigate("/internship/certificates")}
                        delay={0.7}
                    />
                </div>

                {/* COMPACT PROFESSIONAL WIDGET: JOB MARKET TRENDS */}
                <FadeUp delay={0.4} className="xl:col-span-1">
                    <div className={`h-full p-6 sm:p-7 rounded-2xl border relative flex flex-col transition-colors duration-300 ${
                        isDark 
                            ? 'bg-[#111111]/80 border-white/5 shadow-sm' 
                            : 'bg-white border-slate-200/80 shadow-sm'
                    }`}>
                        <div className="flex justify-between items-center mb-6 border-b pb-4 border-slate-500/10">
                            <div className="flex items-center gap-2.5">
                                <TrendingUpIcon className={`w-4 h-4 ${isDark ? 'text-[var(--gold)]' : 'text-[var(--gold-dark)]'}`} />
                                <h5 
                                    className={`text-[16px] font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}
                                    style={{ fontFamily: "'EB Garamond', Georgia, serif" }}
                                >
                                    Market Trends
                                </h5>
                            </div>
                        </div>

                        <div className="space-y-4 flex-1 flex flex-col justify-center">
                            {[
                                { r: 'Systems Engineering', v: '+14%', p: 'High Demand', color: 'bg-blue-500', width: '75%' },
                                { r: 'AI Specialist', v: '+38%', p: 'Surging', color: 'bg-emerald-500', width: '95%' },
                                { r: 'Analytics Lead', v: '+11%', p: 'Stable Growth', color: 'bg-[var(--gold)]', width: '60%' },
                            ].map((item, id) => (
                                <div key={id} className="group">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <p className={`text-[13.5px] font-semibold tracking-tight ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{item.r}</p>
                                        <span className={`text-[13px] font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.v}</span>
                                    </div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`text-[11px] font-medium uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{item.p}</span>
                                    </div>
                                    <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-slate-100'}`}>
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: item.width }}
                                            transition={{ duration: 1.2, delay: 0.5 + (id * 0.15), ease: "easeOut" }}
                                            className={`h-full rounded-full ${item.color} relative overflow-hidden`}
                                        >
                                            <div className="absolute inset-0 bg-white/20 w-full h-full animate-shimmer" style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)', transform: 'skewX(-20deg)' }} />
                                        </motion.div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </FadeUp>
            </div>
        </div>
    );
};

export default OverviewOutlet;
