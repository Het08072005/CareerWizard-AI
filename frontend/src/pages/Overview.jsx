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
    CheckBadgeIcon,
    ShieldCheckIcon
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
    { name: "Create Task", path: "/admin", icon: ClipboardDocumentListIcon, hasSubmenu: true, adminOnly: true },
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
    { name: "Progress", path: "/internship/summary", icon: CalendarIcon },
    { name: "Resources", path: "/internship/resources", icon: ArrowDownTrayIcon },
    { name: "Certificates", path: "/internship/certificates", icon: CertificateIcon },
];

const dummyTitles = [
    "What is Machine Learning?",
    "Python Basics for ML",
    "Data Preprocessing",
    "Supervised Learning",
    "Unsupervised Learning",
    "Model Evaluation",
    "Deep Learning Intro",
    "Neural Networks",
    "NLP Basics",
    "Computer Vision",
    "Recommender Systems",
    "Reinforcement Learning",
    "Model Deployment",
    "Capstone Project",
    "Final Review"
];

const adminSubmenu = Array.from({length: 15}, (_, i) => ({
    name: `Day ${i + 1} - ${dummyTitles[i] || 'New Topic'}`,
    path: `/admin?day=${i + 1}`,
    icon: CalendarIcon
}));

const Overview = () => {
    const scrollRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useContext(AuthContext);
    const { theme, toggleTheme, isDark } = useContext(ThemeContext);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const isAdminView = location.pathname === '/admin';
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    const isInternshipRoute = location.pathname.startsWith('/internship');
    const isAdminRoute = location.pathname.startsWith('/admin');
    const isHome = location.pathname === '/' || location.pathname === '/overview' || location.pathname === '/overview/';
    const [isInternshipExpanded, setIsInternshipExpanded] = useState(isInternshipRoute);
    const [isAdminExpanded, setIsAdminExpanded] = useState(isAdminRoute);

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
        if (location.pathname.startsWith('/admin')) {
            setIsAdminExpanded(true);
        }
    }, [location.pathname]);

    // PERSISTENCE: Auto-scroll to top on route transition
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: 0, behavior: "instant" });
        }

        // ADMIN ROUTE PROTECTION
        const isAllowedAdmin = ['het', 'Het Panchal'].includes(user?.name) || user?.email === 'het80630@gmail.com';
        if (location.pathname === '/admin' && !isAllowedAdmin) {
            navigate('/overview', { replace: true });
        }
    }, [location.pathname, user, navigate]);

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
            <header className={`h-[64px] w-full border-b px-6 lg:px-8 flex items-center justify-between shrink-0 z-[100] transition-all duration-500 ${isDark
                ? 'border-white/5 bg-black/60 backdrop-blur-xl'
                : 'border-[var(--border-color)] bg-[var(--bg-sidebar)]/80 backdrop-blur-xl'
                }`}>
                <div className="flex items-center gap-8">
                    <Link to="/" className="group flex items-center relative z-10 py-1">
                        <h1 className="cw-brand-logo relative text-xl lg:text-2xl tracking-tight">
                            Career<span className="accent">Wizard</span>
                            <div className="absolute -inset-x-4 -inset-y-1 bg-white/[0.03] blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 rounded-lg"></div>
                            {/* Premium AI Badge docked above the D */}
                            <span className={`absolute -right-2 top-0 text-[8px] font-black tracking-[0.2em] ${isDark ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]' : 'text-[var(--gold-dark)] drop-shadow-[0_0_8px_rgba(160,120,64,0.3)]'} opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:-translate-y-1`}>
                                AI
                            </span>
                        </h1>
                    </Link>
                </div>

                <div className="flex items-center gap-6">
                    <Link
                        to="/internship/enroll"
                        className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-[13px] font-semibold transition-all duration-300 shadow-sm hover:scale-[1.02] ${isDark
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-white/80 text-[var(--gold-dark)] border-[var(--gold)]/30 hover:bg-white hover:shadow-md'
                            }`}
                    >
                        <SparklesIcon className="w-3.5 h-3.5" />
                        <span>Upgrade Plan</span>
                    </Link>
                </div>
            </header>

            {/* SYSTEM LOWER GRID */}
            <div className="flex-1 flex overflow-hidden">

                {/* MATCHING SIDEBAR: INDUSTRIAL COCKPIT DESIGN */}
                <motion.aside
                    initial={false}
                    animate={{ width: isCollapsed ? 64 : 220 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className={`h-full border-r border-[var(--border-color)] flex flex-col shrink-0 relative z-[100] transition-colors duration-500 ${isDark ? 'bg-[var(--bg-sidebar)]' : 'bg-white shadow-[2px_0_20px_rgba(160,120,64,0.03)]'}`}
                >
                    <nav className="flex-1 py-8 px-3 space-y-1 scrollbar-hide overflow-y-auto overflow-x-hidden">
                        {tabs.map((tab) => {
                            const isAllowedAdmin = ['het', 'Het Panchal'].includes(user?.name) || user?.email === 'het80630@gmail.com';
                            if (tab.adminOnly && !isAdminView) return null;

                            const active = location.pathname === tab.path ||
                                (tab.path === '/overview' && location.pathname === '/overview/') ||
                                (tab.hasSubmenu && location.pathname.startsWith(tab.path));
                            const IconComponent = tab.icon;
                            const hasSub = tab.hasSubmenu && !isCollapsed;
                            const isThisExpanded = tab.path === '/admin' ? isAdminExpanded : isInternshipExpanded;

                            return (
                                <div key={tab.path} className="flex flex-col space-y-1">
                                    <Link
                                        to={tab.path}
                                        onClick={(e) => {
                                            if (tab.hasSubmenu) {
                                                if (tab.path === '/admin') setIsAdminExpanded(!isAdminExpanded);
                                                else setIsInternshipExpanded(!isInternshipExpanded);
                                            }
                                        }}
                                        className={`
                                            relative flex items-center h-10 rounded-xl transition-all duration-500 group px-3.5
                                            ${active
                                                ? isDark ? 'text-white bg-white/[0.04]' : 'text-[var(--gold-dark)] bg-[var(--gold)]/10 font-bold'
                                                : isDark ? 'text-slate-500 hover:text-white hover:bg-white/[0.03]' : 'text-slate-700 hover:text-slate-950 hover:bg-[var(--gold)]/10'}
                                            ${isCollapsed ? 'justify-center px-0' : 'justify-start'}
                                        `}
                                    >
                                        {/* SURGICAL ACTIVE INDICATOR */}
                                        {active && (
                                            <motion.div
                                                layoutId="nav_dot"
                                                className={`absolute left-[-2px] w-[3px] h-4 rounded-full ${isDark
                                                    ? 'bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)]'
                                                    : 'bg-[var(--gold-dark)] shadow-[0_0_15px_rgba(160,120,64,0.8)]'
                                                    }`}
                                            />
                                        )}

                                        <div className={`
                                            flex items-center justify-center transition-all duration-500
                                            ${active
                                                ? isDark
                                                    ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]'
                                                    : 'text-[var(--gold-dark)] drop-shadow-[0_0_8px_rgba(160,120,64,0.4)]'
                                                : isDark ? 'text-slate-500' : 'text-[var(--gold-dark)]'}
                                            ${isCollapsed ? 'w-9 h-9' : 'mr-4'}
                                        `}>
                                            <IconComponent className="shrink-0 w-4 h-4" strokeWidth={1.5} />
                                        </div>

                                        {!isCollapsed && (
                                            <motion.span
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="text-[13px] font-medium tracking-tight whitespace-nowrap"
                                            >
                                                {tab.name}
                                            </motion.span>
                                        )}

                                        {!isCollapsed && tab.hasSubmenu && (
                                            <ChevronDownIcon className={`w-3.5 h-3.5 ml-auto opacity-60 transition-transform duration-500 ${isThisExpanded ? 'rotate-180' : ''}`} strokeWidth={2} />
                                        )}

                                        {/* REFINED PREMIUM TOOLTIP: GLASSMORPHISM */}
                                        {isCollapsed && (
                                            <div className="absolute left-[70px] top-1/2 -translate-y-1/2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 translate-x-4 transition-all duration-500 z-[300]">
                                                <div className="relative">
                                                    <div className={`absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 border-l border-b rotate-45 ${isDark ? 'bg-black border-cyan-500/20' : 'bg-white border-slate-200'}`} />
                                                    <div className={`backdrop-blur-2xl border px-4 py-2 rounded-xl shadow-xl ${isDark
                                                        ? 'bg-black/80 border-white/10 border-cyan-500/20'
                                                        : 'bg-white border-slate-200 shadow-md'
                                                        }`}>
                                                        <span className={`text-[9px] font-bold uppercase tracking-[0.15em] whitespace-nowrap ${isDark
                                                            ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]'
                                                            : 'text-[var(--gold-dark)]'
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
                                        {hasSub && isThisExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                className={`flex flex-col pl-3 pr-2 py-2 space-y-[6px] border-l border-slate-500/10 ml-7 ${tab.path === '/admin' ? 'max-h-[268px] overflow-y-auto scrollbar-thin' : 'overflow-hidden'}`}
                                            >
                                                {(tab.path === '/admin' ? adminSubmenu : internshipSubmenu).map((sub) => {
                                                    const currentDay = new URLSearchParams(location.search).get('day') || '1';
                                                    const subActive = location.pathname === sub.path || 
                                                                    (sub.path === '/internship' && (location.pathname === '/internship/' || location.pathname === '/internship')) ||
                                                                    (location.pathname === '/admin' && sub.path === `/admin?day=${currentDay}`);
                                                    return (
                                                        <Link
                                                            key={sub.path}
                                                            to={sub.path}
                                                            className={`
                                                                flex items-center min-h-[38px] px-3.5 rounded-xl text-[13px] font-medium transition-all duration-300
                                                                ${subActive
                                                                    ? isDark
                                                                        ? 'text-cyan-400 bg-cyan-400/[0.05]'
                                                                        : 'text-[var(--gold-dark)] bg-[var(--gold)]/10 font-bold'
                                                                    : isDark
                                                                        ? 'text-slate-400 hover:text-slate-300 hover:bg-white/[0.02]'
                                                                        : 'text-slate-700 hover:text-black hover:bg-[var(--gold)]/10'}
                                                            `}
                                                        >
                                                            {sub.icon && (
                                                                <sub.icon className={`w-3.5 h-3.5 shrink-0 mr-2 ${subActive ? (isDark ? 'text-cyan-400' : 'text-[var(--gold-dark)]') : (isDark ? 'text-slate-400' : 'text-[var(--gold-dark)]')}`} strokeWidth={2} />
                                                            )}
                                                            <span className="truncate max-w-[115px]" title={sub.name}>{sub.name}</span>
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
                                            className={`absolute left-[-2px] w-[3px] h-4 rounded-full ${isDark
                                                ? 'bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)]'
                                                : 'bg-[var(--gold-dark)] shadow-[0_0_15px_rgba(160,120,64,0.8)]'
                                                }`}
                                        />
                                    )}

                                    <div className={`
                                        flex items-center justify-center transition-all duration-500
                                        ${active
                                            ? isDark
                                                ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]'
                                                : 'text-[var(--gold-dark)] drop-shadow-[0_0_8px_rgba(160,120,64,0.4)]'
                                            : isDark ? 'text-slate-500' : 'text-[var(--gold-dark)]'}
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
                                                <div className={`backdrop-blur-2xl border px-4 py-2 rounded-xl shadow-xl ${isDark
                                                    ? 'bg-black/80 border-white/10 border-cyan-500/20'
                                                    : 'bg-white border-slate-200 shadow-md'
                                                    }`}>
                                                    <span className={`text-[9px] font-bold uppercase tracking-[0.15em] whitespace-nowrap ${isDark
                                                        ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]'
                                                        : 'text-[var(--gold-dark)]'
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
                                relative flex items-center h-10 rounded-xl transition-all duration-500 group px-3.5 cursor-pointer w-full text-left
                                ${active
                                    ? isDark ? 'text-white bg-white/[0.04]' : 'text-[var(--gold-dark)] bg-[var(--gold)]/10 font-bold'
                                    : isDark ? 'text-slate-500 hover:text-white hover:bg-white/[0.03]' : 'text-slate-700 hover:text-slate-950 hover:bg-[var(--gold)]/10'}
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
                                        className={`absolute bottom-20 left-4 right-4 backdrop-blur-2xl border p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-[500] space-y-2.5 ${isDark
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
                                                className={`w-full flex items-center gap-3 py-2 px-3 text-[12px] font-semibold rounded-xl border transition-all duration-300 hover:scale-[1.01] ${isDark
                                                    ? 'bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                    : 'bg-[var(--gold)]/5 hover:bg-[var(--gold)]/10 text-[var(--gold-dark)] border-[var(--gold)]/20'
                                                    }`}
                                            >
                                                <SparklesIcon className="w-3.5 h-3.5" />
                                                <span>Upgrade Plan</span>
                                            </button>
                                        )}

                                        {/* THEME TOGGLE */}
                                        <button
                                            onClick={() => { toggleTheme(); }}
                                            className={`w-full flex items-center gap-3 py-2 px-3 text-[11px] font-semibold rounded-xl transition ${isDark
                                                ? 'hover:bg-white/[0.04] text-slate-300'
                                                : 'hover:bg-[var(--gold)]/10 text-slate-600'
                                                }`}
                                        >
                                            {isDark ? (
                                                <SunIcon className="w-3.5 h-3.5 text-yellow-400 animate-spin-slow" strokeWidth={2} />
                                            ) : (
                                                <MoonIcon className="w-3.5 h-3.5 text-[var(--gold-dark)]" strokeWidth={2} />
                                            )}
                                            <span>{isDark ? 'Light Theme' : 'Dark Theme'}</span>
                                        </button>

                                        {/* SETTINGS / PROFILE LINK */}
                                        <button
                                            onClick={() => { navigate('/profile'); setIsProfileMenuOpen(false); }}
                                            className={`w-full flex items-center gap-3 py-2 px-3 text-[11px] font-semibold rounded-xl transition ${isDark
                                                ? 'hover:bg-white/[0.04] text-slate-300'
                                                : 'hover:bg-[var(--gold)]/10 text-slate-600'
                                                }`}
                                        >
                                            <Cog6ToothIcon className="w-3.5 h-3.5 text-[var(--gold-dark)]" strokeWidth={2} />
                                            <span>Profile Settings</span>
                                        </button>

                                        {/* LOGOUT */}
                                        <div className={`mt-1 pt-1 border-t ${isDark ? 'border-white/5' : 'border-slate-500/10'}`}>
                                            <button
                                                onClick={() => { logout(); navigate("/login"); }}
                                                className={`w-full flex items-center gap-3 py-2 px-3 text-[11px] font-semibold rounded-xl transition text-red-500 hover:bg-red-500/10`}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                                                </svg>
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* COMPACT USER CARD ROW */}
                            <div className="flex items-center gap-3 p-2 rounded-xl bg-[var(--gold)]/5 border border-[var(--gold)]/10">
                                <div className="w-9 h-9 rounded-full border-2 border-[var(--gold)]/30 bg-[var(--gold-dark)] text-white flex items-center justify-center font-bold text-base shrink-0 shadow-[0_0_10px_rgba(160,120,64,0.2)]">
                                    H
                                </div>

                                {/* NAME & SUBTITLE */}
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[13px] font-bold text-[var(--text-main)] truncate">Het Panchal</span>
                                        {isAdminView && (
                                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${isDark
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
                                    className={`p-2 rounded-lg border transition ${isProfileMenuOpen
                                        ? 'border-[var(--gold)]/30 bg-[var(--gold)]/10 text-[var(--gold-dark)]'
                                        : isDark
                                            ? 'border-white/5 text-slate-400 hover:text-white hover:bg-white/5'
                                            : 'border-slate-200 text-[var(--gold-dark)] hover:text-[var(--gold-dark)] hover:bg-[var(--gold)]/10'
                                        }`}
                                >
                                    <Cog6ToothIcon className={`w-3.5 h-3.5 transition-transform duration-500 ${isProfileMenuOpen ? 'rotate-90' : ''}`} strokeWidth={2} />
                                </button>
                            </div>

                            {/* ADMIN VIEW EXTERNAL BUTTON */}
                            {(['het', 'Het Panchal'].includes(user?.name) || user?.email === 'het80630@gmail.com') && (
                                <button
                                    onClick={() => {
                                        if (location.pathname === '/admin') {
                                            navigate('/overview');
                                        } else {
                                            navigate('/admin');
                                        }
                                    }}
                                    className={`mt-2 w-full py-2 px-4 rounded-full flex items-center justify-center gap-2.5 text-[13px] font-semibold transition-all duration-300 ${isDark
                                        ? 'bg-[var(--gold)]/10 text-slate-200 hover:bg-[var(--gold)]/20 border border-[var(--gold)]/30'
                                        : 'bg-white text-slate-800 hover:bg-[var(--gold)]/10 border border-[var(--gold-dark)]/30 shadow-sm'
                                        }`}
                                >
                                    <ShieldCheckIcon className={`w-4 h-4 ${isDark ? 'text-[var(--gold)]' : 'text-[var(--gold-dark)]'}`} strokeWidth={2} />
                                    {location.pathname === '/admin' ? 'Exit Admin View' : 'Switch to Admin View'}
                                </button>
                            )}
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
                                        className={`absolute bottom-4 left-20 w-52 backdrop-blur-2xl border p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-[500] space-y-2.5 ${isDark
                                            ? 'bg-black/90 border-white/10 text-white shadow-cyan-950/20'
                                            : 'bg-white/95 border-slate-200 text-slate-800 shadow-slate-300/50'
                                            }`}
                                    >
                                        <div className="border-b border-slate-500/10 pb-2 flex items-center justify-between">
                                            <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">Het Panchal</span>
                                            {isAdminView && (
                                                <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${isDark
                                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                    : 'bg-[#10b981]/10 text-[#0f766e] border border-[#10b981]/20'
                                                    }`}>Admin</span>
                                            )}
                                        </div>

                                        {/* UPGRADE PLAN */}
                                        {!isHome && (
                                            <button
                                                onClick={() => { navigate('/internship/enroll'); setIsProfileMenuOpen(false); }}
                                                className={`w-full flex items-center gap-2.5 py-2 px-3 text-[11px] font-semibold rounded-xl border transition-all duration-300 hover:scale-[1.01] ${isDark
                                                    ? 'bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                    : 'bg-[var(--gold)]/5 hover:bg-[var(--gold)]/10 text-[var(--gold-dark)] border-[var(--gold)]/20'
                                                    }`}
                                            >
                                                <SparklesIcon className="w-3.5 h-3.5 shrink-0" />
                                                <span>Upgrade Plan</span>
                                            </button>
                                        )}

                                        {/* ADMIN VIEW TOGGLE */}
                                        {(['het', 'Het Panchal'].includes(user?.name) || user?.email === 'het80630@gmail.com') && (
                                            <button
                                                onClick={() => {
                                                    if (location.pathname === '/admin') {
                                                        navigate('/overview');
                                                    } else {
                                                        navigate('/admin');
                                                    }
                                                    setIsProfileMenuOpen(false);
                                                }}
                                                className={`w-full flex items-center gap-2.5 py-2 px-3 text-[11px] font-semibold rounded-xl transition ${isDark
                                                    ? 'hover:bg-white/[0.04] text-slate-300'
                                                    : 'hover:bg-[var(--gold)]/10 text-slate-600'
                                                    }`}
                                            >
                                                <div className="w-1.5 h-1.5 rounded-full bg-[var(--gold-dark)] shrink-0" />
                                                <span>{location.pathname === '/admin' ? 'Exit Admin View' : 'Switch to Admin'}</span>
                                            </button>
                                        )}

                                        {/* THEME TOGGLE */}
                                        <button
                                            onClick={() => { toggleTheme(); }}
                                            className={`w-full flex items-center gap-2.5 py-2 px-3 text-[11px] font-semibold rounded-xl transition ${isDark
                                                ? 'hover:bg-white/[0.04] text-slate-300'
                                                : 'hover:bg-[var(--gold)]/10 text-slate-600'
                                                }`}
                                        >
                                            {isDark ? (
                                                <SunIcon className="w-3.5 h-3.5 text-yellow-400 shrink-0" strokeWidth={2} />
                                            ) : (
                                                <MoonIcon className="w-3.5 h-3.5 text-[var(--gold-dark)] shrink-0" strokeWidth={2} />
                                            )}
                                            <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                                        </button>

                                        {/* SETTINGS / PROFILE LINK */}
                                        <button
                                            onClick={() => { navigate('/profile'); setIsProfileMenuOpen(false); }}
                                            className={`w-full flex items-center gap-2.5 py-2 px-3 text-[11px] font-semibold rounded-xl transition ${isDark
                                                ? 'hover:bg-white/[0.04] text-slate-300'
                                                : 'hover:bg-[var(--gold)]/10 text-slate-600'
                                                }`}
                                        >
                                            <Cog6ToothIcon className="w-3.5 h-3.5 text-[var(--gold-dark)] shrink-0" strokeWidth={2} />
                                            <span>Settings</span>
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* COMPACT AVATAR TRIGGER */}
                            <div
                                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                className="w-10 h-10 rounded-full border-2 border-[var(--gold)]/30 bg-[var(--gold-dark)] text-white flex items-center justify-center font-bold text-lg cursor-pointer shadow-[0_0_12px_rgba(160,120,64,0.3)] hover:scale-105 transition-all relative"
                            >
                                H
                                {isAdminView && (
                                    <div className="absolute top-[-2px] right-[-2px] w-2.5 h-2.5 rounded-full bg-emerald-500 border border-[var(--bg-sidebar)]" />
                                )}
                            </div>
                        </div>
                    )}
                </motion.aside>

                {/* CONTENT AREA: FLUSH MOUNTED */}
                <main ref={scrollRef} className="flex-1 overflow-x-hidden overflow-y-auto scrollbar-hide p-0">
                    <div className="w-full h-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Overview;





