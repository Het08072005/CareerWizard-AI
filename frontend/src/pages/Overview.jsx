import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import {
    ChartBarIcon,
    DocumentMagnifyingGlassIcon,
    BriefcaseIcon,
    AcademicCapIcon,
    RocketLaunchIcon,
    CommandLineIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    Cog6ToothIcon,
    CpuChipIcon,
    UserIcon
} from "@heroicons/react/24/outline";

import {
    MapIcon,
    ChatIcon,
    SparklesIcon
} from "../components/ui/Icons";

const tabs = [
    { name: "Overview", path: "/overview", icon: ChartBarIcon },
    { name: "Analysis", path: "/overview/resume-analysis", icon: DocumentMagnifyingGlassIcon },
    { name: "Jobs", path: "/overview/job-match", icon: BriefcaseIcon },
    { name: "Skills", path: "/overview/skills-gap", icon: AcademicCapIcon },
    { name: "Roadmap", path: "/overview/career-roadmap", icon: MapIcon },
    { name: "Interview", path: "/overview/interview-prep", icon: ChatIcon },
];

const Overview = () => {
    const scrollRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useContext(AuthContext);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // PERSISTENCE: Auto-scroll to top on route transition
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: 0, behavior: "instant" });
        }
    }, [location.pathname]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const ProfileIcon = ({ className }) => (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    );

    return (
        <div className="h-screen flex flex-col bg-[#050505] text-white font-sans overflow-hidden relative">
            <div className="grain-overlay" />
            <div className="nebula-bg" />
            <div className="logic-mesh" />

            {/* INTEGRATED MAIN NAVBAR - SYNCED WITH HOME PAGE */}
            <header className="h-[72px] w-full border-b border-white/5 bg-black/60 backdrop-blur-xl px-8 flex items-center justify-between shrink-0 z-[100] transition-all duration-500">
                <div className="flex items-center gap-12">
                    <Link to="/" className="group flex items-center relative z-10 py-1">
                        <h1 className="text-xl md:text-2xl font-light tracking-[-0.05em] text-slate-400 transition-all duration-700 group-hover:text-white group-hover:tracking-normal relative">
                            career<span className="font-semibold text-white ml-0.5 tracking-tight group-hover:brand-gradient-text transition-all duration-700">wizard</span>
                            <div className="absolute -inset-x-4 -inset-y-1 bg-white/[0.03] blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 rounded-lg"></div>
                            <span className="absolute -right-3 -top-1 text-[8px] font-black tracking-widest text-cyan-500 opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:translate-x-1">AI</span>
                        </h1>
                    </Link>
                </div>

                <div className="flex items-center gap-6">
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all overflow-hidden relative shadow-2xl"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 hover:opacity-100 transition-opacity"></div>
                            {user?.photoURL ? (
                                <img src={user.photoURL} alt="p" className="w-full h-full object-cover" />
                            ) : (
                                <ProfileIcon className="w-5 h-5 text-slate-300" />
                            )}
                        </button>

                        <AnimatePresence>
                            {isDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 top-14 w-60 bg-black/80 backdrop-blur-2xl rounded-2xl py-3 overflow-hidden border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.8)] z-[200]"
                                >
                                    <div className="px-5 py-4 border-b border-white/5 bg-white/[0.02]">
                                        <p className="text-[9px] text-slate-600 uppercase tracking-widest font-black mb-1">Session Protocol</p>
                                        <p className="text-sm font-bold text-white truncate">{user?.name || 'System User'}</p>
                                        <p className="text-[8px] text-slate-700 truncate mt-1">{user?.email}</p>
                                    </div>
                                    <div className="p-2 space-y-1">
                                        <button onClick={() => { navigate("/profile"); setIsDropdownOpen(false); }} className="w-full text-left px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:bg-white/5 hover:text-cyan-400 rounded-xl transition-all flex items-center gap-3">
                                            <div className="w-1 h-1 rounded-full bg-cyan-400" />
                                            Account Config
                                        </button>
                                        <button onClick={() => { navigate("/overview"); setIsDropdownOpen(false); }} className="w-full text-left px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:bg-white/5 hover:text-cyan-400 rounded-xl transition-all flex items-center gap-3">
                                            <div className="w-1 h-1 rounded-full bg-cyan-400" />
                                            Core Interface
                                        </button>
                                        <div className="border-t border-white/5 mt-2 pt-2">
                                            <button onClick={() => { logout(); navigate("/login"); }} className="w-full text-left px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-rose-500 hover:bg-rose-500/5 rounded-xl transition-all">
                                                Disconnect Node
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </header>

            {/* SYSTEM LOWER GRID */}
            <div className="flex-1 flex overflow-hidden">

                {/* MATCHING SIDEBAR: INDUSTRIAL COCKPIT DESIGN */}
                <motion.aside
                    initial={false}
                    animate={{ width: isCollapsed ? 72 : 240 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full bg-[#030303] border-r border-white/5 flex flex-col shrink-0 relative z-[100]"
                >
                    <nav className="flex-1 py-10 px-3 space-y-1.5 scrollbar-hide">
                        {tabs.map((tab) => {
                            const active = location.pathname === tab.path || (tab.path === '/overview' && location.pathname === '/overview/');
                            const IconComponent = tab.icon;

                            return (
                                <Link
                                    key={tab.path}
                                    to={tab.path}
                                    className={`
                                        relative flex items-center h-11 rounded-xl transition-all duration-500 group px-4
                                        ${active ? 'text-white bg-white/[0.04]' : 'text-slate-500 hover:text-white hover:bg-white/[0.03]'}
                                        ${isCollapsed ? 'justify-center px-0' : 'justify-start'}
                                    `}
                                >
                                    {/* SURGICAL ACTIVE INDICATOR */}
                                    {active && (
                                        <motion.div
                                            layoutId="nav_dot"
                                            className="absolute left-[-2px] w-[3px] h-4 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.8)]"
                                        />
                                    )}

                                    <div className={`
                                        flex items-center justify-center transition-all duration-500
                                        ${active ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]' : ''}
                                        ${isCollapsed ? 'w-9 h-9' : 'mr-4'}
                                    `}>
                                        <IconComponent className="shrink-0 w-4 h-4" strokeWidth={1.5} />
                                    </div>

                                    {!isCollapsed && (
                                        <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-[15px] font-semibold tracking-tight whitespace-nowrap"
                                        >
                                            {tab.name}
                                        </motion.span>
                                    )}

                                    {/* REFINED PREMIUM TOOLTIP: GLASSMORPHISM */}
                                    {isCollapsed && (
                                        <div className="absolute left-[70px] top-1/2 -translate-y-1/2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 translate-x-4 transition-all duration-500 z-[300]">
                                            <div className="relative">
                                                <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-black/80 border-l border-b border-cyan-500/20 rotate-45" />
                                                <div className="bg-black/60 backdrop-blur-2xl border border-white/10 px-4 py-2 rounded-xl shadow-[0_30px_60px_rgba(0,0,0,0.8)] border-cyan-500/20">
                                                    <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.3)] whitespace-nowrap">
                                                        {tab.name}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* LOWER CONTROL BLOCK */}
                    <div className="px-3 pb-8 space-y-2">
                        <button
                            onClick={() => navigate('/profile')}
                            className={`w-full flex items-center h-11 rounded-xl text-slate-500 hover:text-white hover:bg-white/[0.03] transition-all group relative ${isCollapsed ? 'justify-center' : 'px-4'}`}
                        >
                            <Cog6ToothIcon className="w-4 h-4 shrink-0 group-hover:rotate-90 transition-transform duration-700" strokeWidth={1.5} />
                            {!isCollapsed && <span className="ml-4 text-[13px] font-medium">Settings</span>}
                        </button>
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className={`w-full flex items-center h-11 rounded-xl bg-white/[0.04] border border-white/5 text-slate-400 hover:text-white transition-all group relative ${isCollapsed ? 'justify-center' : 'px-4'}`}
                        >
                            {isCollapsed ? (
                                <ChevronRightIcon className="w-3.5 h-3.5" strokeWidth={2} />
                            ) : (
                                <div className="flex items-center w-full">
                                    <ChevronLeftIcon className="w-3.5 h-3.5 mr-4 opacity-40 group-hover:translate-x-[-2px] transition-transform" strokeWidth={2} />
                                    <span className="text-[12px] font-medium opacity-60 group-hover:opacity-100 transition-opacity">Minimize System</span>
                                </div>
                            )}
                        </button>
                    </div>
                </motion.aside>

                {/* CONTENT AREA: FLUSH MOUNTED */}
                <main ref={scrollRef} className="flex-1 overflow-x-hidden overflow-y-auto scrollbar-hide p-0">
                    <div className="w-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Overview;