import React, { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QuestionCard from './QuestionCard';
import { ThemeContext } from '../../context/ThemeContext';
import { ArrowLeftIcon, CodeIcon, ServerIcon, MessageSquareIcon, SparklesIcon, BookIcon } from '../ui/Icons';

const AdvancedPrep = ({
    role, progressPercent, completedCount, totalCount, questions, loading, toggleComplete,
    onRoleChange, categories, selectedCategory, setSelectedCategory,
    counts, totalQuestionsForRole, allNotes, onSaveNote, onExplainWithAI
}) => {
    const { isDark } = useContext(ThemeContext);

    const categoryIcons = {
        'All Questions': SparklesIcon,
        'Fundamentals': BookIcon,
        'Coding': CodeIcon,
        'System Design': ServerIcon,
        'Behavioral': MessageSquareIcon,
    };

    const displayCategories = ['All Questions', ...(categories || [])];

    return (
        <div className="w-full text-[var(--text-main)] min-h-screen bg-transparent p-4 md:px-8 py-4 selection:bg-indigo-500/30">
            {/* Header Section: Minimalist Intelligence Status */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={`relative mb-4 p-4 rounded-xl border transition-colors duration-500 ${
                    isDark ? 'bg-white/[0.01] border-white/[0.04]' : 'bg-[var(--bg-sidebar)] border-slate-200 shadow-sm'
                } overflow-hidden`}
            >
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-8">
                    <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
                        {/* Role Primary Label */}
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-black dark:text-white">
                                <SparklesIcon size={18} />
                             </div>
                             <h2 className="text-lg font-semibold tracking-tight leading-none text-black dark:text-white">
                                 {role}
                             </h2>
                         </div>
 
                         <div className={`h-10 w-[1px] hidden md:block ${isDark ? 'bg-white/[0.06]' : 'bg-slate-200'}`} />
 
                         {/* Progress Module */}
                         <div className="flex items-center gap-8">
                             <div className="space-y-1.5">
                                 <div className="flex items-center justify-between gap-12">
                                     <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 tracking-tight uppercase">Progress</span>
                                     <span className="text-[11px] font-semibold text-black dark:text-white tracking-tight">{completedCount} / {totalCount}</span>
                                 </div>
                                 <div className={`w-48 lg:w-64 h-1.5 rounded-full overflow-hidden border ${
                                     isDark ? 'bg-white/[0.03] border-white/[0.05]' : 'bg-slate-100 border-slate-200'
                                 }`}>
                                     <motion.div
                                         initial={{ width: 0 }}
                                         animate={{ width: `${progressPercent}%` }}
                                         transition={{ type: "spring", stiffness: 100, damping: 20 }}
                                         className="h-full bg-gradient-to-r from-black to-slate-700 dark:from-white dark:to-slate-300"
                                     />
                                 </div>
                             </div>
                         </div>
                    </div>

                    <button
                        type="button"
                        onClick={onRoleChange}
                        className={`group w-9 h-9 flex items-center justify-center border rounded-full transition-all duration-300 ${
                            isDark 
                                ? 'bg-white/[0.02] hover:bg-white/[0.05] border-white/[0.06] hover:border-indigo-500/30' 
                                : 'bg-[var(--bg-main)] hover:bg-slate-200 border-slate-200 hover:border-indigo-500/30'
                        }`}
                        title="Return to Selection"
                    >
                        <ArrowLeftIcon size={13} className="group-hover:-translate-x-1 transition-transform duration-300 text-slate-500 group-hover:text-indigo-500" />
                    </button>
                </div>
            </motion.div>

            {/* Categories Hub: Flat Tabs like Image 1 */}
            <div className={`mb-6 border-b flex overflow-x-auto scrollbar-none ${
                isDark ? 'border-white/[0.05]' : 'border-slate-100'
            }`}>
                <div className="flex gap-6 md:gap-8 pb-px">
                    {displayCategories.map((cat, idx) => {
                        const CatIcon = categoryIcons[cat] || BookIcon;
                        const isActive = selectedCategory === cat;
                        const count = cat === 'All Questions' ? totalQuestionsForRole : counts[cat] || 0;

                        return (
                            <button
                                key={`cat-${cat}-${idx}`}
                                onClick={() => setSelectedCategory(cat)}
                                className={`group relative flex items-center gap-2 pb-3 text-left select-none outline-none border-b-2 transition-all duration-200 ${
                                    isActive
                                        ? 'border-black text-black dark:border-white dark:text-white font-medium'
                                        : 'border-transparent text-slate-500 hover:text-black dark:text-slate-400 dark:hover:text-white'
                                }`}
                            >
                                <div className="flex items-center gap-1.5 min-w-0">
                                    <CatIcon size={10} className={`flex-shrink-0 transition-colors duration-200 ${
                                        isActive 
                                            ? 'text-black dark:text-white' 
                                            : 'text-slate-400 group-hover:text-black dark:text-slate-500 dark:group-hover:text-white'
                                    }`} />
                                    <span className={`text-[11px] font-medium tracking-tight truncate ${
                                        isActive 
                                            ? 'text-black dark:text-white' 
                                            : 'text-slate-500 group-hover:text-black dark:text-slate-400 dark:group-hover:text-white'
                                    }`}>
                                        {cat.replace(' Questions', '')}
                                    </span>
                                </div>

                                <span className={`text-[10px] font-bold tracking-tight px-2 py-0.5 rounded-full transition-colors duration-200 ${
                                    isActive 
                                        ? 'bg-black text-white dark:bg-white dark:text-black' 
                                        : 'bg-slate-100 text-slate-600 dark:bg-white/[0.08] dark:text-slate-300'
                                }`}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Content List */}
            <div className="w-full relative">
                <div className={`flex items-center justify-between mb-5 border-b pb-3.5 ${
                    isDark ? 'border-white/[0.04]' : 'border-slate-200'
                }`}>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] font-extrabold text-slate-400 dark:text-slate-600 tracking-wider uppercase">Target Phase:</span>
                            <span className="text-[13px] font-bold text-[var(--text-main)]">{selectedCategory}</span>
                        </div>
                        <div className={`h-4 w-[1px] ${isDark ? 'bg-white/[0.06]' : 'bg-slate-200'}`} />
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] font-extrabold text-slate-400 dark:text-slate-600 tracking-wider uppercase">Available Payload:</span>
                            <span className="text-[13px] font-bold text-black dark:text-white">{questions.length} Nodes</span>
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
                                    <div key={`skeleton-${idx}`} className={`relative h-24 w-full border rounded-2xl overflow-hidden ${
                                        isDark ? 'bg-[#080808] border-white/[0.04]' : 'bg-[var(--bg-sidebar)] border-slate-200'
                                    }`}>
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
                                            <div className={`w-6 h-6 rounded-full border ${
                                                isDark ? 'bg-white/[0.02] border-white/[0.05]' : 'bg-slate-100 border-slate-200'
                                            }`} />
                                            <div className="flex-1 space-y-3">
                                                <div className={`h-2 w-1/3 rounded ${isDark ? 'bg-white/[0.02]' : 'bg-slate-100'}`} />
                                                <div className={`h-3 w-2/3 rounded ${isDark ? 'bg-white/[0.03]' : 'bg-slate-200/60'}`} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="flex flex-col items-center justify-center py-10 opacity-25">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                        className="w-8 h-8 border-2 border-t-indigo-500 border-indigo-500/10 rounded-full"
                                    />
                                    <span className="mt-4 text-[10px] font-bold tracking-widest uppercase">Synthesizing Assets</span>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="questions-list"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                className="space-y-4"
                            >
                                {questions.map((question) => (
                                    <QuestionCard
                                        key={question.id}
                                        question={question}
                                        toggleComplete={toggleComplete}
                                        currentNote={allNotes[question.id] || ''}
                                        onSaveNote={onSaveNote}
                                        onExplainWithAI={onExplainWithAI}
                                    />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {!loading && questions.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.2 }}
                            className="flex flex-col items-center justify-center py-40 text-center"
                        >
                            <h3 className="text-sm font-bold tracking-widest pl-[1.5em] italic">No Assets Detected</h3>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdvancedPrep;
