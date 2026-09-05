import React, { useState, useContext } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { ThemeContext } from '../../context/themeContextValue';
import { StickyNoteIcon, SparklesIcon, CodeIcon, ChevronDownIcon, CheckIcon, CheckCircleIcon } from '../ui/Icons';

const AnimatedCheck = ({ checked, isDark }) => {
    return (
        <div className={`relative w-6 h-6 rounded-full transition-all duration-300 flex items-center justify-center ${
            checked
                ? isDark
                    ? 'text-emerald-400 bg-emerald-500/10'
                    : 'text-emerald-600 bg-emerald-50'
                : isDark 
                    ? 'text-slate-500 hover:text-emerald-400'
                    : 'text-slate-400 hover:text-emerald-600'
        }`}>
            {checked ? (
                <CheckCircleIcon size={18} />
            ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                </svg>
            )}
        </div>
    );
};

const QuestionCard = ({ question, toggleComplete, currentNote, onSaveNote, onExplainWithAI }) => {
    const { isDark } = useContext(ThemeContext);
    const [showAnswer, setShowAnswer] = useState(false);
    const [showNote, setShowNote] = useState(!!currentNote);
    const [noteDraft, setNoteDraft] = useState(currentNote || '');

    const getColors = (tag, type = 'all') => {
        const t = (tag || '').toLowerCase();
        if (t === 'javascript' || t === 'fundamentals') {
            if (type === 'border') return isDark ? 'border-amber-500/20' : 'border-amber-500/30';
            return isDark 
                ? 'text-amber-500/90 border-amber-500/10 bg-amber-500/[0.03]' 
                : 'text-amber-700 border-amber-500/10 bg-amber-500/[0.02]';
        }
        if (t === 'scope' || t === 'easy') {
            if (type === 'border') return isDark ? 'border-sky-500/20' : 'border-sky-500/30';
            return isDark 
                ? 'text-sky-500/90 border-sky-500/10 bg-sky-500/[0.03]' 
                : 'text-sky-700 border-sky-500/10 bg-sky-500/[0.02]';
        }
        if (t === 'medium') {
            if (type === 'border') return isDark ? 'border-orange-500/20' : 'border-orange-500/30';
            return isDark 
                ? 'text-orange-500/90 border-orange-500/10 bg-orange-500/[0.03]' 
                : 'text-orange-700 border-orange-500/10 bg-orange-500/[0.02]';
        }
        if (t === 'hard') {
            if (type === 'border') return isDark ? 'border-rose-500/20' : 'border-rose-500/30';
            return isDark 
                ? 'text-rose-500/90 border-rose-500/10 bg-rose-500/[0.03]' 
                : 'text-rose-700 border-rose-500/10 bg-rose-500/[0.02]';
        }
        if (t === 'async' || t === 'system design') {
            if (type === 'border') return isDark ? 'border-indigo-500/20' : 'border-indigo-500/30';
            return isDark 
                ? 'text-indigo-500/90 border-indigo-500/10 bg-indigo-500/[0.03]' 
                : 'text-indigo-700 border-indigo-500/10 bg-indigo-500/[0.02]';
        }
        if (type === 'border') return isDark ? 'border-white/[0.06]' : 'border-slate-200';
        return isDark 
            ? 'text-slate-400 border-white/10 bg-white/[0.01]' 
            : 'text-slate-600 border-slate-200 bg-[var(--bg-main)]';
    };

    const formattedCode = (question.answer.code || '').replace(/\\n/g, '\n');

    return (
        <Motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`group relative border transition-all duration-300 rounded-xl overflow-hidden ${
                isDark 
                    ? 'bg-[#080808] border-white/5 hover:border-white/10 hover:shadow-xl' 
                    : 'bg-[#fffcf7] border-[var(--gold)]/20 shadow-[0_4px_20px_rgba(160,120,64,0.05)] hover:border-[var(--gold)]/40 hover:shadow-md'
            }`}
        >
            <div className="p-3.5 md:p-4.5 relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                        <button
                            type="button"
                            onClick={() => toggleComplete(question.id)}
                            className="flex-shrink-0 p-1.5 -m-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-all duration-200 active:scale-95 flex items-center justify-center outline-none"
                        >
                            <AnimatedCheck checked={question.completed} isDark={isDark} />
                        </button>

                        <h4 className="text-[16px] md:text-[17px] font-semibold tracking-tight text-[var(--text-main)] transition-all duration-300 leading-snug">
                            {question.title}
                        </h4>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className={`px-1.5 py-0.5 text-[9px] font-extrabold tracking-wider border rounded transition-all ${getColors(question.difficulty)}`}>
                            {question.difficulty}
                        </span>
                        {(question.tags || []).slice(0, 2).map((tag, tIdx) => (
                            <span key={`${tag}-${tIdx}`} className={`px-1.5 py-0.5 text-[9px] font-extrabold tracking-wider border rounded transition-all ${getColors(tag)}`}>
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                <div className={`mt-4 flex flex-wrap items-center gap-1.5 pt-3 border-t pl-[38px] ${
                    isDark ? 'border-white/[0.04]' : 'border-slate-100'
                }`}>
                    <button
                        type="button"
                        onClick={() => setShowAnswer(!showAnswer)}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 h-8 md:h-9 rounded-lg border text-[12px] md:text-[13px] font-bold tracking-tight transition-all duration-300 outline-none select-none ${
                            showAnswer
                                ? isDark 
                                    ? 'bg-white/10 border-white/20 text-white shadow-sm' 
                                    : 'bg-[#0f172a] border-[#0f172a] text-white shadow-sm'
                                : isDark
                                    ? 'bg-white/[0.02] border-white/[0.05] text-slate-400 hover:border-white/[0.1] hover:text-white hover:bg-white/[0.04]'
                                    : 'bg-white border-[var(--gold)]/20 text-slate-600 hover:border-[var(--gold)]/40 hover:text-slate-900 hover:bg-[#fffcf7] shadow-sm'
                        }`}
                    >
                        <ChevronDownIcon size={10} className={`transition-transform duration-300 ${showAnswer ? 'rotate-180' : ''}`} />
                        <span>{showAnswer ? 'Hide Answer' : 'Show Answer'}</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setShowNote(!showNote)}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 h-8 md:h-9 rounded-lg border text-[12px] md:text-[13px] font-bold tracking-tight transition-all duration-300 outline-none select-none ${
                            currentNote
                                ? isDark
                                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-400 shadow-sm'
                                    : 'bg-amber-50 border-amber-500/20 text-amber-700 shadow-sm'
                                : isDark
                                    ? 'bg-white/[0.02] border-white/[0.05] text-slate-400 hover:border-white/[0.1] hover:text-white hover:bg-white/[0.04]'
                                    : 'bg-white border-[var(--gold)]/20 text-slate-600 hover:border-[var(--gold)]/40 hover:text-slate-900 hover:bg-[#fffcf7] shadow-sm'
                        }`}
                    >
                        <StickyNoteIcon size={10} />
                        <span>Summary</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => onExplainWithAI(question)}
                        disabled={question.ai_explanation_loading}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 h-8 md:h-9 rounded-lg border text-[12px] md:text-[13px] font-bold tracking-tight transition-all duration-300 outline-none select-none ${
                            question.ai_explanation_loading
                                ? 'opacity-40 cursor-not-allowed'
                                : isDark
                                    ? 'bg-white/[0.02] border-white/[0.05] text-slate-400 hover:border-white/30 hover:text-white hover:bg-white/5'
                                    : 'bg-white border-[var(--gold)]/20 text-slate-600 hover:border-[var(--gold)] hover:text-slate-900 hover:bg-[#fffcf7] shadow-sm'
                        }`}
                    >
                        <SparklesIcon size={10} className={question.ai_explanation_loading ? 'animate-spin text-black dark:text-white' : 'text-slate-400 group-hover:text-black dark:group-hover:text-white'} />
                        <span>{question.ai_explanation_loading ? 'Analyzing...' : 'AI Explain'}</span>
                    </button>
                </div>

                <AnimatePresence>
                    {(showNote || showAnswer) && (
                        <Motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                        >
                            <div className="pt-4 space-y-4">
                                {showNote && (
                                    <div className={`p-4 border rounded-lg space-y-3 ${
                                        isDark ? 'bg-white/[0.015] border-white/[0.04]' : 'bg-[var(--bg-main)] border-slate-200'
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
                                                className="px-3 py-1.5 bg-amber-500 text-amber-950 text-[7px] font-black uppercase tracking-widest rounded hover:bg-amber-400 transition-all active:scale-95 shadow-xl shadow-amber-500/10"
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {showAnswer && (
                                    <div className="space-y-4 pb-2">
                                        {question.ai_explanation && (
                                            <div className={`space-y-2 border-l-2 border-black/30 dark:border-white/30 p-4 rounded-r-lg ${
                                                isDark ? 'bg-white/[0.01]' : 'bg-slate-50'
                                            }`}>
                                                <div className="flex items-center gap-2.5">
                                                    <SparklesIcon size={9} className="text-black dark:text-white" />
                                                    <span className="text-[9px] font-black uppercase tracking-[0.5em]">AI Explain:</span>
                                                </div>
                                                <div
                                                    className="text-[var(--text-muted)] text-xs leading-relaxed prose max-w-none font-medium"
                                                    dangerouslySetInnerHTML={{ __html: question.ai_explanation }}
                                                />
                                            </div>
                                        )}

                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 opacity-35">
                                                <div className="w-1 h-3 bg-black dark:bg-white rounded-full" />
                                                <span className="text-[9px] font-black uppercase tracking-[0.5em]">Answer:</span>
                                            </div>
                                            <div className={`border rounded-lg overflow-hidden ${
                                                isDark ? 'bg-[#040404] border-white/[0.02]' : 'bg-white border-[var(--gold)]/20 shadow-sm'
                                            }`}>
                                                <div
                                                    className="text-[var(--text-main)] text-[15px] leading-[1.7] prose max-w-none p-4 md:p-6 font-medium border-b border-white/[0.01]"
                                                    dangerouslySetInnerHTML={{ __html: question.answer.explanation }}
                                                />
                                                {formattedCode && (
                                                    <div className={`p-4 md:p-5 border-t ${
                                                        isDark ? 'bg-[#060608] border-white/[0.02]' : 'bg-[#fffcf7] border-[var(--gold)]/20'
                                                    }`}>
                                                        <div className="flex items-center gap-2.5 mb-3 opacity-30">
                                                            <CodeIcon size={9} className="text-black dark:text-white" />
                                                            <span className="text-[8px] font-black uppercase tracking-[0.4em]">Code:</span>
                                                        </div>
                                                        <div className={`relative p-4 border rounded-lg ${
                                                            isDark ? 'bg-black/40 border-white/[0.03]' : 'bg-[#fbf8f1] border-[var(--gold)]/20 shadow-[0_4px_20px_rgba(160,120,64,0.05)]'
                                                        }`}>
                                                            <pre className="text-[10px] font-mono text-slate-800 dark:text-slate-200 leading-relaxed overflow-x-auto">
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
                        </Motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Motion.div>
    );
};

export default QuestionCard;
