import React, { useContext } from 'react';
import { motion as Motion } from 'framer-motion';
import { ThemeContext } from '../../context/themeContextValue';

const RoleSelection = ({ roles, onSelect }) => {
    const { isDark } = useContext(ThemeContext);

    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 40,
            scale: 0.98,
        },
        visible: (idx) => ({
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                damping: 25,
                stiffness: 80,
                mass: 1,
                delay: ((idx || 0) % 4) * 0.08
            }
        })
    };

    return (
        <div className="w-full text-[var(--text-main)] min-h-screen bg-transparent p-4 md:px-8 py-5 selection:bg-indigo-500/30">
            <div className="w-full max-w-[1500px] mx-auto relative z-10">
                {/* Editorial Header */}
                <Motion.header
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-14 flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-[var(--border-color)] pb-10 relative"
                >
                    <div className="flex flex-col gap-2 group">
                        <h2 style={{ fontFamily: '"Cormorant Garamond", serif' }} className="text-4xl font-bold text-[var(--text-main)] tracking-tight leading-none transition-all duration-700 group-hover:tracking-normal cursor-default">
                            Select your domain
                        </h2>
                        <p className="text-[13px] text-[var(--text-muted)] font-medium tracking-wide max-w-xl opacity-90">
                            Configure your specialized interview environment for precise AI-driven preparation.
                        </p>
                    </div>
                </Motion.header>

                {/* Role Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full pb-16">
                    {roles.map((r, idx) => {
                        const RoleIcon = r.icon;
                        return (
                            <Motion.button
                                key={r.name}
                                custom={idx}
                                variants={cardVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.15 }}
                                whileTap={{ scale: 0.99 }}
                                onClick={() => onSelect(r.name)}
                                className={`group relative flex flex-col items-start p-6 border rounded-xl overflow-hidden text-left shadow-sm transition-all duration-500 hover:-translate-y-1 ${
                                    isDark ? 'bg-[#080808] border-white/[0.04]' : 'bg-[#fffcf7] border-[var(--gold)]/20 shadow-[0_4px_20px_rgba(160,120,64,0.05)] hover:border-[var(--gold)]/40'
                                }`}
                            >
                                {/* Header Row: Freestanding Icon and Title */}
                                <div className="flex items-center gap-3 w-full mb-4">
                                    <div className="text-slate-750 dark:text-slate-300 flex-shrink-0">
                                        <RoleIcon size={21} strokeWidth={1.75} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 style={{ fontFamily: '"Cormorant Garamond", serif' }} className="font-bold text-[19px] tracking-tight text-[var(--text-main)] leading-tight truncate">
                                            {r.name.replace(/ \(.+\)/, '')}
                                        </h3>
                                        <p className="text-[9px] text-[var(--text-muted)] font-bold tracking-wider uppercase opacity-80 mt-0.5">
                                            Specialized Prep
                                        </p>
                                    </div>
                                </div>

                                <div className={`pt-3 border-t w-full relative mb-4 ${
                                    isDark ? 'border-white/[0.05]' : 'border-[var(--border-color)]'
                                }`}>
                                    <p className="text-[11px] text-[var(--text-muted)] font-medium tracking-wide leading-relaxed h-9 line-clamp-2">
                                        {r.skills}
                                    </p>
                                </div>

                                <div className="w-full mt-auto">
                                    <div className={`w-full h-9 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all duration-500 shadow-sm flex items-center justify-center ${
                                        isDark 
                                            ? 'bg-white text-black hover:bg-slate-200 shadow-[0_4px_12px_rgba(255,255,255,0.1)]' 
                                            : 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-[0_4px_12px_rgba(15,23,42,0.15)]'
                                    }`}>
                                        Start Prep
                                    </div>
                                </div>
                            </Motion.button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default RoleSelection;
