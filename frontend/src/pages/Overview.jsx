import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import {
    ChartBarIcon,
    DocumentMagnifyingGlassIcon,
    BriefcaseIcon,
    AcademicCapIcon,
    RocketLaunchIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronDownIcon,
    Cog6ToothIcon,
    CpuChipIcon,
    SunIcon,
    MoonIcon,
    ChartPieIcon,
    ClipboardDocumentListIcon,
    BookOpenIcon,
    FolderIcon,
    CalendarIcon,
    ArrowDownTrayIcon,
    CreditCardIcon,
    IdentificationIcon,
    CheckBadgeIcon
} from "@heroicons/react/24/outline";

import {
    MapIcon,
    ChatIcon,
    SparklesIcon,
    CertificateIcon
} from "../components/ui/Icons";

const tabs = [
    { name: "Overview", path: "/overview", icon: ChartBarIcon },
    { name: "My Internship", path: "/internship", icon: RocketLaunchIcon, hasSubmenu: true },
    { name: "Analysis", path: "/overview/resume-analysis", icon: DocumentMagnifyingGlassIcon },
    { name: "Jobs", path: "/overview/job-match", icon: BriefcaseIcon },
    { name: "Skills", path: "/overview/skills-gap", icon: AcademicCapIcon },
    { name: "Roadmap", path: "/overview/career-roadmap", icon: MapIcon },
    { name: "Interview", path: "/overview/interview-prep", icon: ChatIcon },
];

const internshipSubmenu = [
    { name: "Dashboard", path: "/internship", icon: ChartPieIcon },
    { name: "My Tasks", path: "/internship/tasks", icon: ClipboardDocumentListIcon },
    { name: "Daily Learning", path: "/internship/learning", icon: BookOpenIcon },
    { name: "My Projects", path: "/internship/projects", icon: FolderIcon },
    { name: "Progress Summary", path: "/internship/summary", icon: CalendarIcon },
    { name: "Resources", path: "/internship/resources", icon: ArrowDownTrayIcon },
    { name: "Certificates", path: "/internship/certificates", icon: CertificateIcon },
];

const Overview = () => {
    const scrollRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useContext(AuthContext);
    const { theme, toggleTheme, isDark } = useContext(ThemeContext);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [isAdminView, setIsAdminView] = useState(true);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    const isInternshipRoute = location.pathname.startsWith('/internship');
    const isHome = location.pathname === '/' || location.pathname === '/overview' || location.pathname === '/overview/';
    const [isInternshipExpanded, setIsInternshipExpanded] = useState(isInternshipRoute);

    const accountTabs = [
        { name: "My Plan", path: "/internship/enroll", icon: CreditCardIcon },
        { name: "Settings", path: "/profile", icon: Cog6ToothIcon },
        { 
            name: isCollapsed ? "Expand Sidebar" : "Minimize Sidebar", 
            path: "#", 
            icon: isCollapsed ? ChevronRightIcon : ChevronLeftIcon, 
            onClick: () => setIsCollapsed(!isCollapsed) 
        }
    ];

    useEffect(() => {
        if (location.pathname.startsWith('/internship')) {
            setIsInternshipExpanded(true);
        }
    }, [location.pathname]);

    // PERSISTENCE: Auto-scroll to top on route transition
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: 0, behavior: "instant" });
        }
    }, [location.pathname]);

    const profileMenuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        function handleClickOutsideProfile(event) {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setIsProfileMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("mousedown", handleClickOutsideProfile);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("mousedown", handleClickOutsideProfile);
        };
    }, []);

    const ProfileIcon = ({ className }) => (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    );

    return (
        <div className="h-screen flex flex-col bg-[var(--bg-main)] text-[var(--text-main)] font-sans overflow-hidden relative transition-colors duration-500">
            <div className="grain-overlay" />
            {isDark && (
                <>
                    <div className="nebula-bg" />
                    <div className="logic-mesh" />
                </>
            )}

            {/* INTEGRATED MAIN NAVBAR - SYNCED WITH HOME PAGE */}
            <header className={`h-[72px] w-full border-b px-8 flex items-center justify-between shrink-0 z-[100] transition-all duration-500 ${
                isDark
                    ? 'border-white/5 bg-black/60 backdrop-blur-xl'
                    : 'border-[var(--border-color)] bg-[var(--bg-sidebar)]/80 backdrop-blur-xl'
            }`}>
                <div className="flex items-center gap-12">
                    <Link to="/" className="group flex items-center relative z-10 py-1">
                        <h1 className="cw-brand-logo relative">
                            career<span className="accent">wizard</span>
                            <div className="absolute -inset-x-4 -inset-y-1 bg-white/[0.03] blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 rounded-lg"></div>
                            <span className={`absolute -right-3 -top-1 text-[8px] font-black tracking-widest ${isDark ? 'text-cyan-500' : 'text-emerald-500'} opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:translate-x-1`}>AI</span>
                        </h1>
                    </Link>
                </div>

                <div className="flex items-center gap-6">
                    {/* UPGRADE / PRO BADGE (Only on Home/Overview page) */}
                    {isHome && (
                        <Link 
                            to="/internship/enroll" 
                            className={`flex items-center gap-1.5 px-4 py-1.8 rounded-full border text-[11px] font-bold uppercase tracking-wider transition-all duration-300 shadow-[0_4px_12px_rgba(22,163,74,0.1)] hover:scale-[1.03] hover:shadow-[0_4px_15px_rgba(22,163,74,0.2)] ${
                                isDark 
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                    : 'bg-emerald-500/5 text-[#16a34a] border-[#16a34a]/20 hover:bg-emerald-500/10'
                            }`}
                        >
                            <SparklesIcon className="w-3.5 h-3.5" />
                            <span>Upgrade Plan</span>
                        </Link>
                    )}

                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className={`w-10 h-10 rounded-full border flex items-center justify-center hover:bg-white/5 transition-all overflow-hidden relative shadow-2xl ${
                                isDark ? 'border-white/10' : 'border-[var(--border-color)]'
                            }`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 hover:opacity-100 transition-opacity"></div>
                            {user?.photoURL ? (
                                <img src={user.photoURL} alt="p" className="w-full h-full object-cover" />
                            ) : (
                                <ProfileIcon className={`w-5 h-5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`} />
                            )}
                        </button>

                        <AnimatePresence>
                            {isDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className={`absolute right-0 top-14 w-60 backdrop-blur-2xl rounded-2xl py-3 overflow-hidden border shadow-[0_30px_60px_rgba(0,0,0,0.2)] z-[200] ${
                                        isDark
                                            ? 'bg-black/85 border-white/10 text-white'
                                            : 'bg-white/95 border-[var(--border-color)] text-[var(--text-main)] shadow-xl'
                                    }`}
                                >
                                    <div className={`px-5 py-4 border-b ${isDark ? 'border-white/5 bg-white/[0.02]' : 'border-[var(--border-color)] bg-slate-50'}`}>
                                        <p className="text-[9px] text-slate-500 uppercase tracking-widest font-black mb-1">Session Protocol</p>
                                        <p className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{user?.name || 'System User'}</p>
                                        <p className="text-[8px] text-slate-400 truncate mt-1">{user?.email}</p>
                                    </div>
                                    <div className="p-2 space-y-1">
                                        <button onClick={() => { navigate("/profile"); setIsDropdownOpen(false); }} className={`w-full text-left px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest rounded-xl transition-all flex items-center gap-3 ${
                                            isDark 
                                                ? 'text-slate-400 hover:bg-white/5 hover:text-cyan-400' 
                                                : 'text-slate-600 hover:bg-slate-100 hover:text-emerald-600'
                                        }`}>
                                            <div className={`w-1 h-1 rounded-full ${isDark ? 'bg-cyan-400' : 'bg-emerald-600'}`} />
                                            Account Config
                                        </button>
                                        <button onClick={() => { navigate("/internship"); setIsDropdownOpen(false); }} className={`w-full text-left px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest rounded-xl transition-all flex items-center gap-3 ${
                                            isDark 
                                                ? 'text-slate-400 hover:bg-white/5 hover:text-cyan-400' 
                                                : 'text-slate-600 hover:bg-slate-100 hover:text-emerald-600'
                                        }`}>
                                            <div className={`w-1 h-1 rounded-full ${isDark ? 'bg-cyan-400' : 'bg-emerald-600'}`} />
                                            My Internship
                                        </button>
                                        <button onClick={() => { navigate("/overview"); setIsDropdownOpen(false); }} className={`w-full text-left px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest rounded-xl transition-all flex items-center gap-3 ${
                                            isDark 
                                                ? 'text-slate-400 hover:bg-white/5 hover:text-cyan-400' 
                                                : 'text-slate-600 hover:bg-slate-100 hover:text-emerald-600'
                                        }`}>
                                            <div className={`w-1 h-1 rounded-full ${isDark ? 'bg-cyan-400' : 'bg-emerald-600'}`} />
                                            Core Interface
                                        </button>

                                        {/* Toggle Theme */}
                                        <button onClick={() => { toggleTheme(); setIsDropdownOpen(false); }} className={`w-full text-left px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-between ${
                                            isDark 
                                                ? 'text-slate-400 hover:bg-white/5 hover:text-cyan-400' 
                                                : 'text-slate-600 hover:bg-slate-100 hover:text-emerald-600'
                                        }`}>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-1 h-1 rounded-full ${isDark ? 'bg-cyan-400' : 'bg-emerald-600'}`} />
                                                Theme Protocol
                                            </div>
                                            <span className="text-[9px] uppercase font-black px-2 py-0.5 bg-white/10 rounded">{isDark ? 'Dark' : 'Light'}</span>
                                        </button>

                                        <div className={`border-t mt-2 pt-2 ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
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
                    className="h-full bg-[var(--bg-sidebar)] border-r border-[var(--border-color)] flex flex-col shrink-0 relative z-[100] transition-colors duration-500"
                >
                    <nav className="flex-1 py-10 px-3 space-y-1.5 scrollbar-hide overflow-y-auto overflow-x-hidden">
                        {tabs.map((tab) => {
                            const active = location.pathname === tab.path || 
                                           (tab.path === '/overview' && location.pathname === '/overview/') ||
                                           (tab.hasSubmenu && location.pathname.startsWith(tab.path));
                            const IconComponent = tab.icon;
                            const hasSub = tab.hasSubmenu && !isCollapsed;

                            return (
                                <div key={tab.path} className="flex flex-col space-y-1">
                                    <Link
                                        to={tab.path}
                                        onClick={(e) => {
                                            if (tab.hasSubmenu) {
                                                setIsInternshipExpanded(!isInternshipExpanded);
                                            }
                                        }}
                                        className={`
                                            relative flex items-center h-11 rounded-xl transition-all duration-500 group px-4
                                            ${active 
                                                ? isDark ? 'text-white bg-white/[0.04]' : 'text-[#15803d] bg-emerald-500/10 font-bold'
                                                : isDark ? 'text-slate-500 hover:text-white hover:bg-white/[0.03]' : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'}
                                            ${isCollapsed ? 'justify-center px-0' : 'justify-start'}
                                        `}
                                    >
                                        {/* SURGICAL ACTIVE INDICATOR */}
                                        {active && (
                                            <motion.div
                                                layoutId="nav_dot"
                                                className={`absolute left-[-2px] w-[3px] h-4 rounded-full ${
                                                    isDark 
                                                        ? 'bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)]' 
                                                        : 'bg-[#16a34a] shadow-[0_0_15px_rgba(22,163,74,0.8)]'
                                                }`}
                                            />
                                        )}

                                        <div className={`
                                            flex items-center justify-center transition-all duration-500
                                            ${active 
                                                ? isDark 
                                                    ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]' 
                                                    : 'text-[#16a34a] drop-shadow-[0_0_8px_rgba(22,163,74,0.4)]' 
                                                : ''}
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

                                        {!isCollapsed && tab.hasSubmenu && (
                                            <ChevronDownIcon className={`w-3.5 h-3.5 ml-auto opacity-60 transition-transform duration-500 ${isInternshipExpanded ? 'rotate-180' : ''}`} strokeWidth={2} />
                                        )}

                                        {/* REFINED PREMIUM TOOLTIP: GLASSMORPHISM */}
                                        {isCollapsed && (
                                            <div className="absolute left-[70px] top-1/2 -translate-y-1/2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 translate-x-4 transition-all duration-500 z-[300]">
                                                <div className="relative">
                                                    <div className={`absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 border-l border-b rotate-45 ${isDark ? 'bg-black border-cyan-500/20' : 'bg-white border-slate-200'}`} />
                                                    <div className={`backdrop-blur-2xl border px-4 py-2 rounded-xl shadow-xl ${
                                                        isDark 
                                                            ? 'bg-black/80 border-white/10 border-cyan-500/20' 
                                                            : 'bg-white border-slate-200 shadow-md'
                                                    }`}>
                                                        <span className={`text-[9px] font-bold uppercase tracking-[0.15em] whitespace-nowrap ${
                                                            isDark 
                                                                ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]' 
                                                                : 'text-[#16a34a]'
                                                        }`}>
                                                            {tab.name}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </Link>

                                    {/* COLLAPSIBLE SUBMENU */}
                                    <AnimatePresence initial={false}>
                                        {hasSub && isInternshipExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                className="overflow-hidden flex flex-col pl-4 pr-1 py-1 space-y-1 border-l border-slate-500/10 ml-6"
                                            >
                                                {internshipSubmenu.map((sub) => {
                                                    const subActive = location.pathname === sub.path || (sub.path === '/internship' && (location.pathname === '/internship/' || location.pathname === '/internship'));
                                                    return (
                                                        <Link
                                                            key={sub.path}
                                                            to={sub.path}
                                                            className={`
                                                                flex items-center h-8 pl-4 pr-3 rounded-lg text-[13px] font-medium transition-all duration-300
                                                                ${subActive 
                                                                    ? isDark 
                                                                        ? 'text-cyan-400 bg-cyan-400/[0.05]' 
                                                                        : 'text-[#15803d] bg-emerald-500/5 font-bold'
                                                                    : isDark 
                                                                        ? 'text-slate-400 hover:text-slate-300 hover:bg-white/[0.02]' 
                                                                        : 'text-slate-700 hover:text-black hover:bg-slate-100/80'}
                                                            `}
                                                        >
                                                            {sub.icon && (
                                                                <sub.icon className={`w-3.5 h-3.5 shrink-0 mr-2 ${subActive ? (isDark ? 'text-cyan-400' : 'text-[#15803d]') : 'text-slate-400'}`} strokeWidth={2} />
                                                            )}
                                                            <span>{sub.name}</span>
                                                        </Link>
                                                    );
                                                })}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}

                        {/* ACCOUNT SECTION HEADER */}
                        {!isCollapsed && (
                            <div className="px-4 py-3 mt-6 text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 dark:text-slate-500/60">
                                Account
                            </div>
                        )}

                        {accountTabs.map((tab) => {
                            const active = location.pathname === tab.path;
                            const IconComponent = tab.icon;

                            const content = (
                                <>
                                    {/* SURGICAL ACTIVE INDICATOR */}
                                    {active && (
                                        <motion.div
                                            layoutId="nav_dot_account"
                                            className={`absolute left-[-2px] w-[3px] h-4 rounded-full ${
                                                isDark 
                                                    ? 'bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)]' 
                                                    : 'bg-[#15803d] shadow-[0_0_15px_rgba(21,128,61,0.8)]'
                                            }`}
                                        />
                                    )}

                                    <div className={`
                                        flex items-center justify-center transition-all duration-500
                                        ${active 
                                            ? isDark 
                                                ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]' 
                                                : 'text-[#15803d] drop-shadow-[0_0_8px_rgba(21,128,61,0.4)]' 
                                            : ''}
                                        ${isCollapsed ? 'w-9 h-9' : 'mr-4'}
                                    `}>
                                        <IconComponent className="shrink-0 w-4 h-4" strokeWidth={1.5} />
                                    </div>

                                    {!isCollapsed && (
                                        <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-[15px] font-semibold tracking-tight whitespace-nowrap text-left"
                                        >
                                            {tab.name}
                                        </motion.span>
                                    )}

                                    {/* COLLAPSED TOOLTIP */}
                                    {isCollapsed && (
                                        <div className="absolute left-[70px] top-1/2 -translate-y-1/2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 translate-x-4 transition-all duration-500 z-[300]">
                                            <div className="relative">
                                                <div className={`absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 border-l border-b rotate-45 ${isDark ? 'bg-black border-cyan-500/20' : 'bg-white border-slate-200'}`} />
                                                <div className={`backdrop-blur-2xl border px-4 py-2 rounded-xl shadow-xl ${
                                                    isDark 
                                                        ? 'bg-black/80 border-white/10 border-cyan-500/20' 
                                                        : 'bg-white border-slate-200 shadow-md'
                                                }`}>
                                                    <span className={`text-[9px] font-bold uppercase tracking-[0.15em] whitespace-nowrap ${
                                                        isDark 
                                                            ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]' 
                                                            : 'text-[#15803d]'
                                                    }`}>
                                                        {tab.name}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            );

                            const buttonClass = `
                                relative flex items-center h-11 rounded-xl transition-all duration-500 group px-4 cursor-pointer w-full text-left
                                ${active 
                                    ? isDark ? 'text-white bg-white/[0.04]' : 'text-[#15803d] bg-emerald-500/10 font-bold'
                                    : isDark ? 'text-slate-500 hover:text-white hover:bg-white/[0.03]' : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100/80'}
                                ${isCollapsed ? 'justify-center px-0' : 'justify-start'}
                            `;

                            if (tab.onClick) {
                                return (
                                    <div key={tab.name} className="flex flex-col space-y-1 w-full">
                                        <button
                                            type="button"
                                            onClick={tab.onClick}
                                            className={buttonClass}
                                        >
                                            {content}
                                        </button>
                                    </div>
                                );
                            }

                            return (
                                <div key={tab.path} className="flex flex-col space-y-1 w-full">
                                    <Link
                                        to={tab.path}
                                        className={buttonClass}
                                    >
                                        {content}
                                    </Link>
                                </div>
                            );
                        })}
                    </nav>

                    {/* USER PROFILE WIDGET & CONSOLIDATED POP-OVER PREFERENCES */}
                    {!isCollapsed ? (
                        <div ref={profileMenuRef} className="relative px-3 py-4 border-t border-slate-500/10 flex flex-col gap-2">
                            {/* POPUP BOX / CONTROLS PANEL */}
                            <AnimatePresence>
                                {isProfileMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                        className={`absolute bottom-20 left-4 right-4 backdrop-blur-2xl border p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-[500] space-y-2.5 ${
                                            isDark 
                                                ? 'bg-black/90 border-white/10 text-white shadow-cyan-950/20' 
                                                : 'bg-white/95 border-slate-200 text-slate-800 shadow-slate-300/50'
                                        }`}
                                    >
                                        <div className="border-b border-slate-500/10 pb-2">
                                            <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">System Preferences</span>
                                        </div>

                                        {/* UPGRADE PLAN */}
                                        {!isHome && (
                                            <button 
                                                onClick={() => { navigate('/internship/enroll'); setIsProfileMenuOpen(false); }}
                                                className={`w-full flex items-center gap-3 py-2 px-3 text-[13px] font-semibold rounded-xl border transition-all duration-300 hover:scale-[1.01] ${
                                                    isDark 
                                                        ? 'bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                                        : 'bg-[#10b981]/5 hover:bg-[#10b981]/10 text-[#0f766e] border-[#10b981]/20'
                                                }`}
                                            >
                                                <SparklesIcon className="w-3.5 h-3.5" />
                                                <span>Upgrade Plan</span>
                                            </button>
                                        )}

                                        {/* ADMIN VIEW TOGGLE */}
                                        {isHome && (
                                            <button 
                                                onClick={() => { setIsAdminView(!isAdminView); setIsProfileMenuOpen(false); }}
                                                className={`w-full flex items-center gap-3 py-2 px-3 text-[11px] font-semibold rounded-xl transition ${
                                                    isDark 
                                                        ? 'bg-white/[0.04] text-slate-300 hover:text-white' 
                                                        : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                                                }`}
                                            >
                                                <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                                <span>{isAdminView ? 'Exit Admin View' : 'Switch to Admin'}</span>
                                            </button>
                                        )}

                                        {/* THEME TOGGLE */}
                                        <button
                                            onClick={() => { toggleTheme(); }}
                                            className={`w-full flex items-center gap-3 py-2 px-3 text-[11px] font-semibold rounded-xl transition ${
                                                isDark 
                                                    ? 'hover:bg-white/[0.04] text-slate-300' 
                                                    : 'hover:bg-slate-100 text-slate-600'
                                            }`}
                                        >
                                            {isDark ? (
                                                <SunIcon className="w-3.5 h-3.5 text-yellow-400 animate-spin-slow" strokeWidth={2} />
                                            ) : (
                                                <MoonIcon className="w-3.5 h-3.5 text-slate-600" strokeWidth={2} />
                                            )}
                                            <span>{isDark ? 'Light Theme' : 'Dark Theme'}</span>
                                        </button>

                                        {/* SETTINGS / PROFILE LINK */}
                                        <button
                                            onClick={() => { navigate('/profile'); setIsProfileMenuOpen(false); }}
                                            className={`w-full flex items-center gap-3 py-2 px-3 text-[11px] font-semibold rounded-xl transition ${
                                                isDark 
                                                    ? 'hover:bg-white/[0.04] text-slate-300' 
                                                    : 'hover:bg-slate-100 text-slate-600'
                                            }`}
                                        >
                                            <Cog6ToothIcon className="w-3.5 h-3.5 text-slate-400" strokeWidth={2} />
                                            <span>Profile Settings</span>
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* COMPACT USER CARD ROW */}
                            <div className="flex items-center gap-3 p-2 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                                {/* AVATAR */}
                                <div className="w-9 h-9 rounded-xl bg-[#10b981] text-white flex items-center justify-center font-bold text-base shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                                    H
                                </div>
                                
                                {/* NAME & SUBTITLE */}
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[13px] font-bold text-[var(--text-main)] truncate">Het Panchal</span>
                                        {isAdminView && (
                                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                                                isDark
                                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                    : 'bg-[#10b981]/10 text-[#0f766e] border border-[#10b981]/20'
                                            }`}>Admin</span>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-medium truncate">Pro · CE Final Year</p>
                                </div>

                                {/* SETTINGS TOGGLE BUTTON */}
                                <button
                                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                    className={`p-2 rounded-lg border transition ${
                                        isProfileMenuOpen 
                                            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500' 
                                            : isDark
                                                ? 'border-white/5 text-slate-400 hover:text-white hover:bg-white/5' 
                                                : 'border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                                    }`}
                                >
                                    <Cog6ToothIcon className={`w-3.5 h-3.5 transition-transform duration-500 ${isProfileMenuOpen ? 'rotate-90' : ''}`} strokeWidth={2} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div ref={profileMenuRef} className="relative px-3 py-4 flex flex-col items-center justify-center border-t border-slate-500/10">
                            {/* POPUP BOX (NEXT TO THE SIDEBAR) */}
                            <AnimatePresence>
                                {isProfileMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -15, scale: 0.95 }}
                                        animate={{ opacity: 1, x: 0, scale: 1 }}
                                        exit={{ opacity: 0, x: -15, scale: 0.95 }}
                                        className={`absolute bottom-4 left-20 w-52 backdrop-blur-2xl border p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-[500] space-y-2.5 ${
                                            isDark 
                                                ? 'bg-black/90 border-white/10 text-white shadow-cyan-950/20' 
                                                : 'bg-white/95 border-slate-200 text-slate-800 shadow-slate-300/50'
                                        }`}
                                    >
                                        <div className="border-b border-slate-500/10 pb-2 flex items-center justify-between">
                                            <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">Het Panchal</span>
                                            {isAdminView && (
                                                <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                                                    isDark
                                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                        : 'bg-[#10b981]/10 text-[#0f766e] border border-[#10b981]/20'
                                                }`}>Admin</span>
                                            )}
                                        </div>

                                        {/* UPGRADE PLAN */}
                                        {!isHome && (
                                            <button 
                                                onClick={() => { navigate('/internship/enroll'); setIsProfileMenuOpen(false); }}
                                                className={`w-full flex items-center gap-2.5 py-2 px-3 text-[11px] font-semibold rounded-xl border transition-all duration-300 hover:scale-[1.01] ${
                                                    isDark 
                                                        ? 'bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                                        : 'bg-[#10b981]/5 hover:bg-[#10b981]/10 text-[#0f766e] border-[#10b981]/20'
                                                }`}
                                            >
                                                <SparklesIcon className="w-3.5 h-3.5 shrink-0" />
                                                <span>Upgrade Plan</span>
                                            </button>
                                        )}

                                        {/* THEME TOGGLE */}
                                        <button
                                            onClick={() => { toggleTheme(); }}
                                            className={`w-full flex items-center gap-2.5 py-2 px-3 text-[11px] font-semibold rounded-xl transition ${
                                                isDark 
                                                    ? 'hover:bg-white/[0.04] text-slate-300' 
                                                    : 'hover:bg-slate-100 text-slate-600'
                                            }`}
                                        >
                                            {isDark ? (
                                                <SunIcon className="w-3.5 h-3.5 text-yellow-400 shrink-0" strokeWidth={2} />
                                            ) : (
                                                <MoonIcon className="w-3.5 h-3.5 text-slate-600 shrink-0" strokeWidth={2} />
                                            )}
                                            <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                                        </button>

                                        {/* SETTINGS / PROFILE LINK */}
                                        <button
                                            onClick={() => { navigate('/profile'); setIsProfileMenuOpen(false); }}
                                            className={`w-full flex items-center gap-2.5 py-2 px-3 text-[11px] font-semibold rounded-xl transition ${
                                                isDark 
                                                    ? 'hover:bg-white/[0.04] text-slate-300' 
                                                    : 'hover:bg-slate-100 text-slate-600'
                                            }`}
                                        >
                                            <Cog6ToothIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" strokeWidth={2} />
                                            <span>Settings</span>
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* COMPACT AVATAR TRIGGER */}
                            <div 
                                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-lg cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.3)] hover:scale-105 transition-all relative"
                            >
                                H
                                {isAdminView && (
                                    <div className="absolute top-[-2px] right-[-2px] w-2.5 h-2.5 rounded-full bg-purple-500 border border-[var(--bg-sidebar)]" />
                                )}
                            </div>
                        </div>
                    )}
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