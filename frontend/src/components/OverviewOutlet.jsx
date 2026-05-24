import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import api from "../api/axiosClient";
import { motion } from "framer-motion";
import {
    DocumentIcon,
    BriefcaseIcon,
    UserCheckIcon,
    ArrowRightIcon,
    TrendingUpIcon,
    SparklesIcon,
    MapIcon,
    ChatIcon
} from "./ui/Icons";

const FadeUp = ({ children, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
        {children}
    </motion.div>
);

const ProtocolCard = ({ title, desc, IconComponent, onClick, delay }) => {
    const { isDark } = useContext(ThemeContext);
    return (
        <FadeUp delay={delay}>
            <div
                onClick={onClick}
                className={`group relative p-5 rounded-[1.2rem] border transition-all duration-700 cursor-pointer overflow-hidden flex flex-col items-start h-full ${
                    isDark ? 'bg-[#1a1a1a]/80 border-white/10 hover:border-[var(--gold)]/30' : 'bg-[#fbf8f1] border-[var(--gold)]/20 shadow-[0_4px_20px_rgba(160,120,64,0.05)] hover:shadow-[0_4px_20px_rgba(160,120,64,0.08)]'
                }`}
            >
                <div className={`absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000`} />

                <div className="flex items-center gap-4 mb-3 w-full">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-105 ${
                        isDark 
                            ? 'bg-white/5 border border-white/10 text-slate-400 group-hover:text-[var(--gold)] group-hover:bg-[var(--gold)]/10' 
                            : 'bg-slate-50 border border-slate-100 text-slate-500 group-hover:text-[var(--gold-dark)] group-hover:bg-[var(--gold)]/5'
                    }`}>
                        <IconComponent className="w-4.5 h-4.5" />
                    </div>
                    <h4 className={`text-[16px] font-bold text-[var(--text-main)] transition-colors duration-500 ${
                        isDark ? 'group-hover:text-white' : 'group-hover:text-[var(--gold-dark)]'
                    }`}>{title}</h4>
                </div>

                <p className="text-[14px] text-[var(--text-muted)] leading-relaxed group-hover:text-[var(--text-main)] transition-colors duration-500 line-clamp-2">{desc}</p>
            </div>
        </FadeUp>
    );
};

const OverviewOutlet = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { isDark } = useContext(ThemeContext);

    return (
        <div className="space-y-5 p-6 pb-8">

            {/* OPTIMIZED COMPACT HERO AREA */}
            <section className={`relative p-6 md:p-8 px-10 rounded-[1.5rem] border overflow-hidden transition-colors duration-500 ${isDark ? 'bg-[#1a1a1a]/80 border-white/10 shadow-sm' : 'bg-[#fbf8f1] border-[var(--gold)]/20 shadow-[0_8px_30px_rgba(160,120,64,0.06)]'}`}>
                <div className={`absolute top-0 right-0 w-80 h-80 ${isDark ? 'bg-[var(--gold)]/[0.05]' : 'bg-[var(--gold)]/[0.03]'} blur-[150px] -z-10`} />

                <div className="max-w-4xl">
                    <FadeUp>
                        <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-main)] leading-none tracking-tight">
                            Welcome back,
                            <span className={`ml-4 font-black tracking-tight ${
                                isDark 
                                    ? 'bg-gradient-to-r from-[var(--gold)] via-amber-300 to-yellow-500 bg-clip-text text-transparent' 
                                    : 'bg-gradient-to-r from-[var(--gold-dark)] to-amber-700 bg-clip-text text-transparent'
                            }`}>
                                {user?.name || 'het'}
                            </span>
                        </h1>
                        <p className="text-[var(--text-muted)] text-[11px] font-medium mt-5 italic flex items-center gap-2">
                            <span className="w-5 h-[1px] bg-slate-500/20" />
                            Your dashboard is up to date • Ready to start learning
                        </p>
                    </FadeUp>

                    <FadeUp delay={0.2}>
                        <div className="flex items-center gap-7 mt-5">
                            <button
                                onClick={() => navigate("/overview/job-match")}
                                className={`px-8 py-3.5 rounded-xl text-[14px] font-bold transition-all active:scale-95 shadow-lg ${
                                    isDark
                                        ? 'bg-[var(--gold)] text-black hover:bg-amber-400 hover:shadow-[0_10px_25px_-5px_rgba(252,211,77,0.3)]'
                                        : 'bg-[var(--gold-dark)] text-white hover:bg-amber-700 hover:shadow-[0_10px_25px_-5px_rgba(160,120,64,0.3)]'
                                }`}
                            >
                                Find Job
                            </button>
                        </div>
                    </FadeUp>
                </div>
            </section>

            {/* SYNCHRONIZED COMPACT GRID */}
            <div className="flex flex-col lg:flex-row gap-5 items-stretch pt-0">

                {/* PROTOCOL GRID */}
                <div className="flex-1 lg:max-w-[66.666%] flex flex-col">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 flex-1">
                        <ProtocolCard
                            title="ATS Matching"
                            desc="Optimize your resume for maximum compatibility with Applicant Tracking Systems."
                            IconComponent={DocumentIcon}
                            onClick={() => navigate("/overview/resume-analysis")}
                            delay={0.3}
                        />
                        <ProtocolCard
                            title="Interview Prep"
                            desc="Practice with AI-driven simulations and master the STAR technique."
                            IconComponent={ChatIcon}
                            onClick={() => navigate("/overview/interview-prep")}
                            delay={0.4}
                        />
                        <ProtocolCard
                            title="Job Finding"
                            desc="Discover matching job opportunities across global platforms."
                            IconComponent={BriefcaseIcon}
                            onClick={() => navigate("/overview/job-match")}
                            delay={0.5}
                        />
                        <ProtocolCard
                            title="Structured Roadmap"
                            desc="A step-by-step guide to bridging skill gaps and reaching your career goals."
                            IconComponent={MapIcon}
                            onClick={() => navigate("/overview/skills-gap")}
                            delay={0.6}
                        />
                    </div>
                </div>

                {/* VOLATILITY INTEL */}
                <div className="flex-1 lg:max-w-[33.333%] flex flex-col">
                    <div className={`flex-1 p-5 rounded-[1.2rem] border flex flex-col group overflow-hidden relative transition-colors duration-500 ${isDark ? 'bg-[#1a1a1a]/80 border-white/10 shadow-sm' : 'bg-[#fbf8f1] border-[var(--gold)]/20 shadow-[0_8px_30px_rgba(160,120,64,0.06)]'}`}>
                        <div className={`absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent`} />

                        <div className="flex justify-between items-center mb-6">
                            <h5 className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Job Market Trends</h5>
                            <SparklesIcon className={`w-3.5 h-3.5 ${isDark ? 'text-[var(--gold)]/40 group-hover:text-[var(--gold)]' : 'text-[var(--gold)]/60 group-hover:text-[var(--gold-dark)]'} transition-colors`} />
                        </div>

                        <div className="space-y-3.5 flex-1">
                            {[
                                { r: 'Systems Eng.', v: '+14%', p: 'High Demand' },
                                { r: 'AI Specialist', v: '+38%', p: 'Surging' },
                                { r: 'Analytics Lead', v: '+11%', p: 'Stable Growth' },
                            ].map((item, id) => (
                                <div key={id} className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 border ${
                                    isDark 
                                        ? 'bg-white/[0.01] border-white/5 hover:border-[var(--gold)]/20' 
                                        : 'bg-slate-50/50 border-slate-100 hover:border-[var(--gold)]/30 hover:bg-slate-50'
                                }`}>
                                    <div className="flex flex-col gap-0.5">
                                        <p className="text-[14px] font-semibold text-[var(--text-main)] tracking-tight transition-colors">{item.r}</p>
                                        <span className="text-[11px] font-medium text-[var(--text-muted)] opacity-80">{item.p}</span>
                                    </div>
                                    <span className={`text-[15px] font-bold ${isDark ? 'text-[var(--gold)]' : 'text-[var(--gold-dark)]'}`}>{item.v}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default OverviewOutlet;
