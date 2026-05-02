import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QuestionCard from './QuestionCard';
import { ArrowLeftIcon, CodeIcon, ServerIcon, MessageSquareIcon, SparklesIcon, BookIcon } from '../ui/Icons';

const AdvancedPrep = ({
    role, progressPercent, completedCount, totalCount, questions, loading, toggleComplete,
    onRoleChange, categories, selectedCategory, setSelectedCategory,
    counts, totalQuestionsForRole, allNotes, onSaveNote, onExplainWithAI
}) => {
    const categoryIcons = {
        'All Questions': SparklesIcon,
        'Fundamentals': BookIcon,
        'Coding': CodeIcon,
        'System Design': ServerIcon,
        'Behavioral': MessageSquareIcon,
    };

    const displayCategories = ['All Questions', ...(categories || [])];

    return (
        <div className="w-full text-slate-200 min-h-screen bg-transparent p-6 md:px-12 py-8 selection:bg-indigo-500/30">
            {/* Header Section: Minimalist Intelligence Status */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative mb-8 p-8 rounded-3xl bg-white/[0.01] border border-white/[0.04] overflow-hidden"
            >
                <div className="relative z-10 flex items-center justify-between gap-8">
                    <div className="flex items-center gap-10">
                        {/* Role Primary Label */}
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                                <SparklesIcon size={26} />
                            </div>
                            <h2 className="text-3xl font-semibold text-white tracking-tight leading-none">
                                {role}
                            </h2>
                        </div>

                        <div className="h-10 w-[1px] bg-white/[0.06] hidden md:block" />

                        {/* Progress Module */}
                        <div className="flex items-center gap-8">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between gap-12">
                                    <span className="text-[13px] font-bold text-slate-600 tracking-tight">Progress</span>
                                    <span className="text-[13px] font-bold text-indigo-400 tracking-tight">{completedCount} / {totalCount}</span>
                                </div>
                                <div className="w-48 lg:w-64 h-1.5 bg-white/[0.03] rounded-full overflow-hidden border border-white/[0.05]">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progressPercent}%` }}
                                        transition={{ duration: 1.5, ease: "circOut" }}
                                        className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.4)]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onRoleChange}
                        className="group w-10 h-10 flex items-center justify-center bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-indigo-500/30 rounded-full transition-all duration-300"
                        title="Return to Selection"
                    >
                        <ArrowLeftIcon size={14} className="group-hover:-translate-x-1 transition-transform duration-300 text-slate-500 group-hover:text-indigo-400" />
                    </button>
                </div>
            </motion.div>

            {/* Categories Hub */}
            <div className="mb-12">

                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                    {displayCategories.map((cat, idx) => {
                        const CatIcon = categoryIcons[cat] || BriefcaseIcon;
                        const isActive = selectedCategory === cat;
                        const count = cat === 'All Questions' ? totalQuestionsForRole : counts[cat] || 0;

                        return (
                            <motion.button
                                key={`cat-${cat}-${idx}`}
                                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{
                                    delay: idx * 0.04,
                                    duration: 0.7,
                                    ease: [0.16, 1, 0.3, 1]
                                }}
                                onClick={() => setSelectedCategory(cat)}
                                className={`group relative p-5 rounded-2xl border transition-all duration-700 text-left overflow-hidden ${isActive
                                    ? 'bg-indigo-500/[0.06] border-indigo-500/30'
                                    : 'bg-[#060606] border-white/[0.04] hover:border-white/10'
                                    }`}
                            >
                                <div className="relative z-10 flex flex-col gap-5">
                                    <div className={`w-10 h-10 rounded-[0.85rem] flex items-center justify-center transition-all duration-700 ${isActive ? 'bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]' : 'bg-white/[0.01] text-slate-600 group-hover:text-white group-hover:bg-white/[0.04]'
                                        }`}>
                                        <CatIcon size={18} className={isActive ? 'scale-110' : 'group-hover:scale-110 transition-transform duration-700'} />
                                    </div>

                                    <div className="space-y-1.5">
                                        <h4 className={`text-[13px] font-bold transition-colors ${isActive ? 'text-white' : 'text-slate-600 group-hover:text-slate-400'}`}>
                                            {cat}
                                        </h4>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-2xl font-bold tracking-tight ${isActive ? 'text-indigo-400' : 'text-white/60'}`}>{count}</span>
                                            <span className="text-[9px] font-bold text-slate-700 tracking-tight mt-0.5">Asset Nodes</span>
                                        </div>
                                    </div>
                                </div>

                                {isActive && (
                                    <motion.div
                                        layoutId="active-selection-glow"
                                        className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.03] to-transparent pointer-events-none"
                                    />
                                )}
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Content List */}
            <div className="w-full relative">
                <div className="flex items-center justify-between mb-8 border-b border-white/[0.04] pb-8">
                    <div className="flex items-center gap-8">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-slate-600 tracking-tight">Target Phase</span>
                            <h3 className="text-2xl font-bold text-white tracking-tight">{selectedCategory}</h3>
                        </div>
                        <div className="h-10 w-[1px] bg-white/[0.06]" />
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-slate-600 tracking-tight">Available Payload</span>
                            <span className="text-2xl font-bold text-indigo-400 tracking-tight">{questions.length} <span className="text-[11px] font-bold text-slate-600 tracking-tight ml-1">Nodes</span></span>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <AnimatePresence mode="popLayout" initial={false}>
                        {loading ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-4"
                            >
                                {[1, 2, 3, 4].map((_, idx) => (
                                    <div key={`skeleton-${idx}`} className="relative h-24 w-full bg-[#080808] border border-white/[0.04] rounded-2xl overflow-hidden">
                                        <motion.div
                                            animate={{
                                                x: ['-100%', '100%']
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "linear"
                                            }}
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/5 to-transparent skew-x-12"
                                        />
                                        <div className="p-6 flex items-center gap-6">
                                            <div className="w-6 h-6 rounded-full bg-white/[0.02] border border-white/[0.05]" />
                                            <div className="flex-1 space-y-3">
                                                <div className="h-2 w-1/3 bg-white/[0.02] rounded" />
                                                <div className="h-3 w-2/3 bg-white/[0.03] rounded" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="flex flex-col items-center justify-center py-10 opacity-20">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                        className="w-8 h-8 border-2 border-t-indigo-500 border-indigo-500/10 rounded-full"
                                    />
                                    <span className="mt-4 text-[10px] font-bold tracking-widest text-white">Synthesizing Assets</span>
                                </div>
                            </motion.div>
                        ) : (
                            questions.map((question, idx) => (
                                <motion.div
                                    key={question.id || `q-${idx}`}
                                    initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                                    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{
                                        duration: 0.8,
                                        delay: Math.min(idx * 0.1, 0.4),
                                        ease: [0.16, 1, 0.3, 1]
                                    }}
                                >
                                    <QuestionCard
                                        question={question}
                                        toggleComplete={toggleComplete}
                                        currentNote={allNotes[question.id] || ''}
                                        onSaveNote={onSaveNote}
                                        onExplainWithAI={onExplainWithAI}
                                    />
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>

                    {!loading && questions.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.1 }}
                            className="flex flex-col items-center justify-center py-40 text-center"
                        >
                            <h3 className="text-sm font-bold text-white tracking-widest pl-[1.5em] italic">No Assets Detected</h3>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdvancedPrep;
