import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeContext } from '../../context/ThemeContext';
import { StickyNoteIcon, SparklesIcon, CodeIcon, ChevronDownIcon } from '../ui/Icons';

const AnimatedCheck = ({ checked }) => {
    return (
        <div className={`relative w-7 h-7 rounded-full border-2 transition-all duration-500 flex items-center justify-center ${checked
            ? 'bg-emerald-500/20 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
            : 'bg-transparent border-slate-300 dark:border-white/10 hover:border-emerald-500/40'
            }`}>
            <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-4 h-4"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <motion.path
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{
                        pathLength: checked ? 1 : 0,
                        opacity: checked ? 1 : 0
                    }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    d="M5 13l4 4L19 7"
                    className="text-emerald-550 dark:text-emerald-400"
                />
            </svg>
            <AnimatePresence>
                {checked && (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        className="absolute inset-0 rounded-full border-2 border-emerald-500"
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

const QuestionCard = ({ question, toggleComplete, currentNote, onSaveNote, onExplainWithAI }) => {
    const { isDark } = useContext(ThemeContext);
    const [showAnswer, setShowAnswer] = useState(false);
    const [showNote, setShowNote] = useState(!!currentNote);
    const [noteDraft, setNoteDraft] = useState(currentNote || '');

    useEffect(() => {
        setNoteDraft(currentNote || '');
    }, [currentNote]);

    const getColors = (tag, type = 'all') => {
        const t = (tag || '').toLowerCase();
        if (t === 'javascript' || t === 'fundamentals') {
            if (type === 'border') return isDark ? 'border-amber-500/30' : 'border-amber-500/40';
            return isDark 
                ? 'text-amber-500/90 border-amber-500/20 bg-amber-500/[0.04]' 
                : 'text-amber-700 border-amber-500/20 bg-amber-500/[0.03]';
        }
        if (t === 'scope' || t === 'easy') {
            if (type === 'border') return isDark ? 'border-sky-500/30' : 'border-sky-500/40';
            return isDark 
                ? 'text-sky-500/90 border-sky-500/20 bg-sky-500/[0.04]' 
                : 'text-sky-700 border-sky-500/20 bg-sky-500/[0.03]';
        }
        if (t === 'medium') {
            if (type === 'border') return isDark ? 'border-orange-500/30' : 'border-orange-500/40';
            return isDark 
                ? 'text-orange-500/90 border-orange-500/20 bg-orange-500/[0.04]' 
                : 'text-orange-700 border-orange-500/20 bg-orange-500/[0.03]';
        }
        if (t === 'hard') {
            if (type === 'border') return isDark ? 'border-rose-500/30' : 'border-rose-500/40';
            return isDark 
                ? 'text-rose-500/90 border-rose-500/20 bg-rose-500/[0.04]' 
                : 'text-rose-700 border-rose-500/20 bg-rose-500/[0.03]';
        }
        if (t === 'async' || t === 'system design') {
            if (type === 'border') return isDark ? 'border-indigo-500/30' : 'border-indigo-500/40';
            return isDark 
                ? 'text-indigo-500/90 border-indigo-500/20 bg-indigo-500/[0.04]' 
                : 'text-indigo-700 border-indigo-500/20 bg-indigo-500/[0.03]';
        }
        if (type === 'border') return isDark ? 'border-white/[0.08]' : 'border-slate-200';
        return isDark 
            ? 'text-slate-500 border-white/10 bg-white/[0.02]' 
            : 'text-slate-650 border-slate-200 bg-slate-50';
    };

    const formattedCode = (question.answer.code || '').replace(/\\n/g, '\n');

    // Determine dynamic border color based on difficulty
    const dynamicBorder = question.completed ? 'border-emerald-500' : getColors(question.difficulty, 'border');

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`group relative border transition-all duration-700 rounded-2xl overflow-hidden ${
                question.completed 
                    ? 'border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.02)]' 
                    : `${dynamicBorder} hover:border-slate-400 dark:hover:border-white/20`
            } ${
                isDark ? 'bg-[#080808]' : 'bg-white shadow-sm hover:shadow-md'
            }`}
        >
            <div className="p-5 md:p-6 relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                    <div className="flex items-center gap-5 flex-1">
                        <button
                            onClick={() => toggleComplete(question.id)}
                            className="flex-shrink-0 transition-transform active:scale-90"
                        >
                            <AnimatedCheck checked={question.completed} />
                        </button>

                        <h4 className={`text-xl font-bold tracking-tight transition-all duration-500 ${
                            question.completed 
                                ? 'text-emerald-600 dark:text-emerald-400/70' 
                                : 'text-[var(--text-main)]'
                        }`}>
                            {question.title}
                        </h4>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className={`px-2 py-0.5 text-[10px] font-bold border rounded-md transition-all ${getColors(question.difficulty)}`}>
                            {question.difficulty}
                        </span>
                        {(question.tags || []).slice(0, 2).map((tag, tIdx) => (
                            <span key={`${tag}-${tIdx}`} className={`px-2 py-0.5 text-[10px] font-bold border rounded-md transition-all ${getColors(tag)}`}>
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                <div className={`mt-6 flex flex-wrap items-center gap-2 pt-5 border-t ${
                    isDark ? 'border-white/[0.04]' : 'border-slate-100'
                }`}>
                    <button
                        type="button"
                        onClick={() => setShowAnswer(!showAnswer)}
                        className={`flex items-center gap-2 px-3.5 py-1.5 text-[11px] font-bold rounded-lg border transition-all duration-300 ${
                            showAnswer
                                ? isDark 
                                    ? 'bg-white text-black border-white' 
                                    : 'bg-slate-900 text-white border-transparent'
                                : isDark
                                    ? 'bg-white/[0.02] border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
                                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                        }`}
                    >
                        <ChevronDownIcon size={10} className={`transition-transform duration-500 ${showAnswer ? 'rotate-180' : ''}`} />
                        {showAnswer ? 'Hide Answer' : 'Show Answer'}
                    </button>

                    <button
                        type="button"
                        onClick={() => setShowNote(!showNote)}
                        className={`flex items-center gap-2 px-3.5 py-1.5 text-[11px] font-bold rounded-lg border transition-all duration-300 ${
                            currentNote
                                ? 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-500'
                                : isDark
                                    ? 'bg-white/[0.02] border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
                                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                        }`}
                    >
                        <StickyNoteIcon size={10} />
                        Summary
                    </button>

                    <button
                        type="button"
                        onClick={() => onExplainWithAI(question)}
                        disabled={question.ai_explanation_loading}
                        className={`flex items-center gap-2 px-3.5 py-1.5 text-[11px] font-bold rounded-lg border transition-all duration-300 ${
                            question.ai_explanation_loading
                                ? 'opacity-45 cursor-not-allowed'
                                : isDark
                                    ? 'bg-[#0a0a0a] border-white/[0.05] text-slate-400 hover:border-indigo-500/40 hover:text-indigo-400'
                                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-indigo-500/30 hover:text-indigo-600'
                        }`}
                    >
                        <SparklesIcon size={10} className={question.ai_explanation_loading ? 'animate-spin' : ''} />
                        {question.ai_explanation_loading ? 'Analyzing...' : 'AI Explain'}
                    </button>
                </div>

                <AnimatePresence>
                    {(showNote || showAnswer) && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                        >
                            <div className="pt-6 space-y-6">
                                {showNote && (
                                    <div className={`p-5 border rounded-xl space-y-4 ${
                                        isDark ? 'bg-white/[0.015] border-white/[0.04]' : 'bg-slate-50 border-slate-200'
                                    }`}>
                                        <div className="flex items-center gap-2 opacity-35">
                                            <div className="w-1 h-3 bg-amber-500 rounded-full" />
                                            <span className="text-[7px] font-black uppercase tracking-[0.4em]">Insight_Capture</span>
                                        </div>
                                        <textarea
                                            value={noteDraft}
                                            onChange={(e) => setNoteDraft(e.target.value)}
                                            placeholder="Write technical observation..."
                                            rows="2"
                                            className="w-full bg-transparent border-none outline-none text-[var(--text-main)] text-xs font-medium placeholder-slate-400 resize-none leading-relaxed"
                                        />
                                        <div className="flex justify-end pt-1">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    onSaveNote(question.id, noteDraft || '');
                                                    setShowNote(false);
                                                }}
                                                className="px-4 py-2 bg-amber-500 text-amber-950 text-[7px] font-black uppercase tracking-widest rounded-md hover:bg-amber-400 transition-all active:scale-95 shadow-xl shadow-amber-500/10"
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {showAnswer && (
                                    <div className="space-y-6 pb-2">
                                        {question.ai_explanation && (
                                            <div className={`space-y-3 border-l-2 border-indigo-500/40 p-5 rounded-r-xl ${
                                                isDark ? 'bg-indigo-500/[0.015]' : 'bg-indigo-50/20'
                                            }`}>
                                                <div className="flex items-center gap-3">
                                                    <SparklesIcon size={10} className="text-indigo-500" />
                                                    <span className="text-[9px] font-black uppercase tracking-[0.5em]">AI Explain:</span>
                                                </div>
                                                <div
                                                    className="text-[var(--text-muted)] text-xs leading-relaxed prose max-w-none font-medium"
                                                    dangerouslySetInnerHTML={{ __html: question.ai_explanation }}
                                                />
                                            </div>
                                        )}

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 opacity-35">
                                                <div className="w-1 h-3 bg-indigo-500 rounded-full" />
                                                <span className="text-[9px] font-black uppercase tracking-[0.5em]">Answer:</span>
                                            </div>
                                            <div className={`border rounded-2xl overflow-hidden ${
                                                isDark ? 'bg-[#040404] border-white/[0.02]' : 'bg-slate-50 border-slate-200'
                                            }`}>
                                                <div
                                                    className="text-[var(--text-main)] text-xs leading-relaxed prose max-w-none p-6 md:p-8 font-medium border-b border-white/[0.01]"
                                                    dangerouslySetInnerHTML={{ __html: question.answer.explanation }}
                                                />
                                                {formattedCode && (
                                                    <div className={`p-6 md:p-8 border-t ${
                                                        isDark ? 'bg-[#060608] border-white/[0.02]' : 'bg-slate-100/60 border-slate-200/50'
                                                    }`}>
                                                        <div className="flex items-center gap-3 mb-4 opacity-30">
                                                            <CodeIcon size={10} className="text-indigo-550 dark:text-indigo-400" />
                                                            <span className="text-[8px] font-black uppercase tracking-[0.4em]">Code:</span>
                                                        </div>
                                                        <div className={`relative p-5 border rounded-2xl ${
                                                            isDark ? 'bg-black/40 border-white/[0.03]' : 'bg-white border-slate-200'
                                                        }`}>
                                                            <pre className="text-[10px] font-mono text-indigo-750 dark:text-indigo-300/80 leading-relaxed overflow-x-auto">
                                                                <code>{formattedCode}</code>
                                                            </pre>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default QuestionCard;
