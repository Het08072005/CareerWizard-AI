import React from 'react';
import { motion } from 'framer-motion';

const RoleSelection = ({ roles, onSelect }) => {
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
        <div className="w-full text-slate-200 min-h-screen bg-transparent p-6 md:px-12 py-12 selection:bg-indigo-500/30">
            <div className="w-full max-w-[1500px] mx-auto relative z-10">
                {/* Editorial Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-16 border-b border-white/[0.06] pb-12 flex flex-col md:flex-row items-end justify-between gap-8"
                >
                    <div className="flex flex-col gap-5">
                        <h2 className="text-3xl font-semibold text-white tracking-tight leading-none cursor-default">
                            Select your domain
                        </h2>
                        <p className="text-[12px] text-slate-500 font-medium tracking-tight max-w-lg leading-relaxed">
                            Configure your specialized interview environment for precise AI-driven preparation.
                        </p>
                    </div>
                </motion.div>

                {/* Role Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full pb-32">
                    {roles.map((r, idx) => {
                        const RoleIcon = r.icon;
                        return (
                            <motion.button
                                key={r.name}
                                custom={idx}
                                variants={cardVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: false, amount: 0.15 }}
                                whileHover={{
                                    scale: 1.03,
                                    y: -10,
                                    transition: { duration: 0.5, ease: "easeOut" }
                                }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => onSelect(r.name)}
                                className="group relative flex flex-col items-start p-12 bg-[#080808] border border-white/[0.04] rounded-[2.5rem] transition-all duration-700 hover:border-indigo-500/40 overflow-hidden text-left shadow-2xl"
                            >
                                {/* Premium Glass Background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.04] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                                <div className="absolute -inset-[100%] bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

                                <div className="relative mb-14 group-hover:transform group-hover:translate-y-[-6px] transition-transform duration-700">
                                    <div className="absolute inset-0 bg-indigo-500/25 blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                    <div className="relative w-20 h-20 flex items-center justify-center bg-[#0a0a0a] border border-white/[0.08] rounded-[2rem] text-indigo-400 group-hover:border-indigo-500/50 group-hover:text-white transition-all duration-700 shadow-2xl backdrop-blur-xl">
                                        <RoleIcon size={38} strokeWidth={1.5} className="relative z-10 transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-[360deg]" />
                                    </div>

                                    {/* Decorative Technical Badge */}
                                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center border-4 border-[#080808] opacity-0 group-hover:opacity-100 transition-all duration-500 scale-50 group-hover:scale-100 shadow-[0_0_20px_rgba(79,70,229,0.4)]">
                                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                    </div>
                                </div>

                                <div className="space-y-6 relative z-10 w-full mt-auto">
                                    <h3 className="font-semibold text-2xl text-white tracking-tight group-hover:text-indigo-400 transition-colors leading-tight">
                                        {r.name.replace(/ \(.+\)/, '')}
                                    </h3>
                                    <div className="pt-6 border-t border-white/[0.05] w-full relative">
                                        <div className="absolute top-0 left-0 w-8 h-[1px] bg-indigo-500/50 -translate-y-[1px] group-hover:w-full transition-all duration-700" />
                                        <p className="text-[12px] text-slate-500 font-medium tracking-wide leading-relaxed group-hover:text-slate-300 transition-colors opacity-70">
                                            {r.skills}
                                        </p>
                                    </div>
                                </div>

                                {/* Interactive Glow */}
                                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                            </motion.button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default RoleSelection;
