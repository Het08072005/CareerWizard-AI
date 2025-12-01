// InterviewPrepOutlet.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchQuestions, addQuestion, generateAIExplanation } from '../api/interviewApi'; // ensure path is correct

// --- Helper Hook for LocalStorage ---
const usePersistentState = (key, defaultValue) => {
    const [state, setState] = useState(() => {
        try {
            const storedValue = window.localStorage.getItem(key);
            // Handling potential large JSON objects gracefully
            if (storedValue) {
                const parsedValue = JSON.parse(storedValue);
                // Simple check for data integrity
                return (typeof parsedValue === 'object' && parsedValue !== null) ? parsedValue : defaultValue;
            }
            return defaultValue;
        } catch (error) {
            console.error("Error reading localStorage key “" + key + "”:", error);
            return defaultValue;
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(state));
        } catch (error) {
            // This can happen if local storage limit is exceeded (e.g., saving large AI explanations)
            console.error("Error writing localStorage key “" + key + "” (Storage likely full):", error);
        }
    }, [key, state]);

    return [state, setState];
};

// --- Icon Definitions (SVGs - Replacing Lucide React) ---
const BriefcaseIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>);
const SettingsIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.44a2 2 0 0 1-2 2H4a2 2 0 0 0-2 2v.44a2 2 0 0 1 2 2h.44a2 2 0 0 0 2 2v.44a2 2 0 0 1-2 2H2a2 2 0 0 0-2 2v.44a2 2 0 0 1 2 2h.44a2 2 0 0 0 2 2v.44a2 2 0 0 1 2 2h.44a2 2 0 0 0 2 2v.44a2 2 0 0 1 2 2H20a2 2 0 0 0 2-2v-.44a2 2 0 0 1 2-2h.44a2 2 0 0 0 2-2v-.44a2 2 0 0 1 2-2h.44a2 2 0 0 0 2-2v-.44a2 2 0 0 1-2-2h-.44a2 2 0 0 0-2-2v-.44a2 2 0 0 1-2-2h-.44a2 2 0 0 0-2-2v-.44a2 2 0 0 1-2-2z" /><circle cx="12" cy="12" r="3" /></svg>);
const RocketIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2.5L12 11l-3-3L4.5 16.5zM18 4l-4 4M7.5 13.5l3 3" /><path d="M14.5 19.5l-3-3" /></svg>);
const CloudIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" /></svg>);
const SmartphoneIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><path d="M12 18h.01" /></svg>);
const TrendingUpIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>);
const CpuIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M9 9h6v6H9z" /><path d="M15 2v2M15 20v2M2 15h2M20 15h2M9 2v2M9 20v2M2 9h2M20 9h2" /></svg>);
const ClipboardListIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="3" width="6" height="4" rx="2" ry="2" /><path d="M12 3v3m0 11h7m-7 0H5m7 0V7" /></svg>);
const PaletteIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-10a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm-4 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm8 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" /></svg>);
const UserCheckIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><polyline points="17 11 19 13 23 9" /></svg>);
const RefreshCwIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>);

// --- CATEGORY ICONS ---
const FolderOpenIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 20a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3l2-2h6a2 2 0 0 1 2 2v4"/></svg>);
const CodeIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>);
const ServerIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>);
const MessageSquareIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>);
const ListIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>);
const StickyNoteIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>);
const LightbulbIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-.5 1-1 1-1s-1.5-2.5-3-2.5c-3 0-4 2.5-4 2.5s.8.5 1 1"/><path d="M9.5 8.5v-1a4 4 0 0 1 4-4v1"/><path d="M12 21a2 2 0 0 0 2-2v-1.5a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v1.5a2 2 0 0 0 2 2z"/></svg>);

// --- AI/ML ICON (BrainIcon) ---
const BrainIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5a3 3 0 0 0-3 3v2a3 3 0 0 0 6 0V8a3 3 0 0 0-3-3z"/><path d="M16 12a4 4 0 1 1 0 8 4 4 0 0 1 0-8z"/><path d="M8 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/><path d="M15 8h.01"/><path d="M9 8h.01"/><path d="M12 13v.01"/><path d="M18.8 9.2a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/><path d="M5.2 9.2a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/></svg>);

// --- CATEGORIES (CONSOLIDATED TO 4) ---
const CATEGORIES = ['Fundamentals', 'Coding', 'System Design', 'Behavioral'];

// --- Sub-Components (RoleSelection, QuestionCard) ---

const RoleSelection = ({ roles, onSelect }) => {
    // This is typically the starting screen for role selection.
    // Placeholder logic for demonstration:
    return (
        <div className="text-center ">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Select Your Target Role</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4  mx-auto">
                {roles.map((r) => {
                    const RoleIcon = r.icon;
                    return (
                        <button
                            key={r.name}
                            type="button"
                            onClick={() => onSelect(r.name)}
                            className="p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 text-gray-700 hover:text-indigo-600 border border-gray-200"
                        >
                            <RoleIcon size={32} className="mx-auto mb-2" />
                            <p className="font-semibold text-sm">{r.name}</p>
                            <p className="text-xs text-gray-500 mt-1">{r.skills}</p>
                        </button>
                    );
                })}
            </div>
            <p className="mt-8 text-sm text-gray-500">Your selection will be saved for future visits.</p>
        </div>
    );
};

/**
 * QuestionCard
 * - showNote toggles the note area.
 * - noteDraft is a local draft so typing doesn't persist until Save is pressed.
 * - onSaveNote(questionId, content) persists note to parent (and localStorage via hooks).
 */
const QuestionCard = ({ question, toggleComplete, currentNote, onSaveNote, onExplainWithAI }) => {
    const [showAnswer, setShowAnswer] = useState(false);
    // Show note if there is already a saved note
    const [showNote, setShowNote] = useState(!!currentNote);

    // Local draft for note editing; keeps typing local until Save clicked
    const [noteDraft, setNoteDraft] = useState(currentNote || '');

    // Sync draft whenever saved note (prop) changes
    useEffect(() => {
        setNoteDraft(currentNote || '');
    }, [currentNote]);

    const getTagColor = (tag) => {
        switch ((tag || '').toLowerCase()) {
            case 'javascript': return 'bg-yellow-100 text-yellow-800';
            case 'fundamentals': return 'bg-blue-100 text-blue-800';
            case 'scope': return 'bg-purple-100 text-purple-800';
            case 'medium': return 'bg-orange-100 text-orange-800';
            case 'hard': return 'bg-red-100 text-red-800';
            case 'async': return 'bg-violet-100 text-violet-800';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <p className="text-sm font-semibold text-indigo-600 mb-2">Question {question.id}</p>
                    <h4 className="text-lg font-bold text-gray-800 mb-3">{question.title}</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getTagColor(question.difficulty)}`}>
                            {question.difficulty}
                        </span>
                        {(question.tags || []).map(tag => (
                            <span key={tag} className={`px-3 py-1 text-xs font-medium rounded-full ${getTagColor(tag)}`}>
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="flex text-gray-400 hover:text-indigo-500 cursor-pointer p-1">
                    <svg className={`w-6 h-6 transform transition-transform duration-300`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
            </div>

            <div className="flex space-x-4 mt-4 flex-wrap gap-y-3">
                <button
                    type="button"
                    onClick={() => setShowAnswer(!showAnswer)}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition duration-150 ${showAnswer ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
                >
                    {showAnswer ? 'Hide Answer' : 'Show Answer'}
                </button>

                {/* Toggle Note Button */}
                <button
                    type="button"
                    onClick={() => setShowNote(!showNote)}
                    className={`flex items-center px-4 py-2 text-sm font-semibold rounded-lg transition duration-150 ${currentNote ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                    <StickyNoteIcon size={14} className="w-4 h-4 mr-2" />
                    {currentNote ? 'Edit Note' : 'Add Note'}
                </button>

                {/* Explain with AI Button */}
                <button
                    type="button"
                    onClick={() => onExplainWithAI(question)}
                    disabled={question.ai_explanation_loading}
                    className={`flex items-center px-4 py-2 text-sm font-semibold rounded-lg transition duration-150 ${
                        question.ai_explanation_loading
                        ? 'bg-purple-200 text-purple-400 cursor-not-allowed'
                        : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                    }`}
                >
                    <LightbulbIcon size={14} className={`w-4 h-4 mr-2 ${question.ai_explanation_loading ? 'animate-pulse' : ''}`} />
                    {question.ai_explanation_loading ? 'Generating...' : (question.ai_explanation ? 'Regenerate AI Expl.' : 'Explain with AI')}
                </button>

                <button
                    type="button"
                    onClick={() => toggleComplete(question.id)}
                    className={`flex items-center px-4 py-2 text-sm font-semibold rounded-lg transition duration-150 ${question.completed ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                    {question.completed ? (
                        <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    ) : (
                        <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                    )}
                    {question.completed ? 'Completed' : 'Mark Complete'}
                </button>
            </div>

            {/* Note Area: only saved when user presses Save */}
            {showNote && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center text-md font-bold text-yellow-800 mb-3">
                        <StickyNoteIcon size={18} className="mr-2" />
                        My Personal Note
                    </div>

                    <textarea
                        value={noteDraft}
                        onChange={(e) => setNoteDraft(e.target.value)}
                        placeholder="Write your personal answer, key concepts, or follow-up questions here..."
                        rows="4"
                        className="w-full p-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500 text-gray-700 bg-white resize-y"
                    />

                    <div className="mt-3 flex items-center justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => {
                                // revert draft to saved note
                                setNoteDraft(currentNote || '');
                                // do not close by default — keep UX consistent; you can close if you prefer:
                                // setShowNote(false);
                            }}
                            className="px-3 py-1 rounded-md bg-white border border-yellow-200 text-yellow-800 text-sm hover:bg-yellow-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                // Call parent to save the note (persist to localStorage)
                                onSaveNote(question.id, noteDraft || '');
                            }}
                            className="px-3 py-1 rounded-md bg-yellow-600 text-white text-sm hover:bg-yellow-700"
                        >
                            Save Note
                        </button>
                    </div>

                    <p className="text-xs text-yellow-700 mt-2">
                        Notes are saved only when you click "Save Note".
                    </p>
                </div>
            )}

            {showAnswer && (
                <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-center text-lg font-bold text-gray-700 mb-3">
                        <svg className="w-5 h-5 mr-2 text-indigo-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/></svg>
                        Model Answer
                    </div>

                    {/* AI Explanation Area */}
                    {question.ai_explanation_loading && (
                        <div className="p-4 bg-purple-50 text-purple-700 rounded-md mb-4 flex items-center">
                            <RefreshCwIcon size={16} className="animate-spin mr-3" />
                            Generating AI explanation...
                        </div>
                    )}
                    {question.ai_explanation && (
                        <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                            <div className="text-md font-bold text-purple-700 mb-2 flex items-center">
                                <LightbulbIcon size={18} className="mr-2" /> AI Explanation
                            </div>
                            {/* Use dangerouslySetInnerHTML for the formatted HTML explanation */}
                            <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: question.ai_explanation }} />
                        </div>
                    )}

                    {/* Original Model Answer */}
                    {question.answer && question.answer.explanation && (
                        <div className="mt-4">
                            <div className="text-gray-700 mb-4" dangerouslySetInnerHTML={{ __html: question.answer.explanation }} />
                            {question.answer.code && (
                                <div className="p-3 bg-gray-800 rounded-md text-white overflow-x-auto text-sm font-mono">
                                    <pre>
                                        <code>{question.answer.code}</code>
                                    </pre>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const AdvancedPrep = ({ role, progressPercent, completedCount, totalCount, questions, toggleComplete, onRoleChange, categories, selectedCategory, setSelectedCategory, counts, totalQuestionsForRole, allNotes, onSaveNote, onExplainWithAI }) => {
    // --- categoryIcons map ---
    const categoryIcons = {
        'All Questions': ListIcon,
        'Fundamentals': FolderOpenIcon, // Includes Async
        'Coding': CodeIcon, // Includes Algorithms & Data Structures
        'System Design': ServerIcon,
        'Behavioral': MessageSquareIcon,
    };

    // The categories to display in the UI (All Questions + the 4 core categories)
    const displayCategories = ['All Questions', ...categories];

    return (
        <div>
            {/* Header Banner - Change Role Button and Progress Bar */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-xl shadow-2xl mb-8">
                <div className="flex justify-between items-start">
                    <div className="flex items-center">
                        <span className="mr-3 text-3xl">🧠</span>
                        <div>
                            <h2 className="text-xl font-bold text-white">Advanced Interview Preparation</h2>
                            <p className="text-sm text-indigo-200 mt-1 font-semibold">{role}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onRoleChange}
                        className="flex items-center bg-white/20 hover:bg-white/30 text-white text-sm font-medium py-2 px-4 rounded-full transition duration-150"
                    >
                        <RefreshCwIcon size={14} className="mr-2" /> Change Role
                    </button>
                </div>

                {/* Progress bar uses the total progress from the main component's state */}
                <div className="mt-4">
                    <p className="text-sm text-white mb-2">Your Progress: <span className="font-semibold">{completedCount}</span> / <span className="font-semibold">{totalCount}</span> completed</p>
                    <div className="h-2 bg-indigo-400 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-green-400 transition-all duration-500"
                            style={{ width: `${progressPercent}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Categories */}
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Categories</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
                {displayCategories.map((cat) => {
                    // Use the consolidated icon mapping
                    const CatIcon = categoryIcons[cat] || BriefcaseIcon;
                    const isActive = selectedCategory === cat;
                    // Use pre-calculated counts
                    const count = cat === 'All Questions' ? totalQuestionsForRole : counts[cat] || 0;

                    let displayName = cat;
                    if (cat === 'Coding') {
                        displayName = 'Coding ';
                    } else if (cat === 'Fundamentals') {
                        displayName = 'Fundamentals ';
                    }

                    return (
                        <div
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`p-4 rounded-xl shadow-lg cursor-pointer transition duration-150 ${isActive ? 'bg-indigo-50 border-2 border-indigo-500 text-indigo-700' : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-indigo-300'}`}
                        >
                            <div className="flex items-center">
                                {CatIcon && <CatIcon size={24} className={`mr-3 ${isActive ? 'text-indigo-500' : 'text-gray-500'}`} />}
                                <div>
                                    <p className="text-sm font-medium">{displayName}</p>
                                    <p className="text-xs text-gray-500">{count} questions</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Questions List */}
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{selectedCategory} ({questions.length})</h3>
            <div className="space-y-6">
                {questions.map(question => (
                    <QuestionCard
                        key={question.id}
                        question={question}
                        toggleComplete={toggleComplete}
                        currentNote={allNotes[question.id] || ''}
                        onSaveNote={onSaveNote}
                        onExplainWithAI={onExplainWithAI}
                    />
                ))}
                {questions.length === 0 && (
                    <div className="text-center py-8 text-gray-500 bg-white p-6 rounded-xl shadow-md">
                        No questions found for this category yet.
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Final Main Component Export with persistence integration ---
const InterviewPrepOutlet = () => {
    const roles = [
        { name: 'Frontend Developer', icon: BriefcaseIcon, skills: 'React, Vue, Angular, HTML/CSS' },
        { name: 'Backend Developer', icon: SettingsIcon, skills: 'Node.js, Python, Java, APIs' },
        { name: 'Full Stack Developer', icon: RocketIcon, skills: 'Frontend + Backend + Database' },
        { name: 'AI Engineer', icon: BrainIcon, skills: 'MLOps, Production AI Systems, Cloud' },
        { name: 'Machine Learning Engineer (ML)', icon: CpuIcon, skills: 'Model Building, Deep Learning, Python' },
        { name: 'Generative AI Engineer (GenAI)', icon: PaletteIcon, skills: 'LLMs, Prompt Engineering, Stable Diffusion' },
        { name: 'Data Scientist', icon: TrendingUpIcon, skills: 'Statistics, Predictive Modeling, Analysis' },
        { name: 'MLOps Engineer', icon: CpuIcon, skills: 'CI/CD for ML, Kubernetes, Model Deployment' },
        { name: 'Deep Learning Engineer', icon: CpuIcon, skills: 'Neural Networks, NLP, Computer Vision' },
        { name: 'Computer Vision Engineer', icon: SmartphoneIcon, skills: 'Image Processing, OpenCV, Object Detection' },
        { name: 'DevOps Engineer', icon: CloudIcon, skills: 'CI/CD, Docker, Kubernetes, Cloud' },
        { name: 'Mobile Developer', icon: SmartphoneIcon, skills: 'React Native, iOS, Android' },
        { name: 'QA Engineer', icon: ClipboardListIcon, skills: 'Testing, Automation, Quality Assurance' },
        { name: 'Product Manager', icon: UserCheckIcon, skills: 'Strategy, Roadmap, Stakeholder Management' },
        { name: 'UI/UX Designer', icon: UserCheckIcon, skills: 'Design, User Experience, Prototyping' },
    ];

    // Use persistent state for the selected role
    const [selectedRole, setSelectedRole] = usePersistentState('interviewRole', null);

    // Store completion status { [roleName]: { [questionId]: true, ... }, ... }
    const [allCompletedStatus, setAllCompletedStatus] = usePersistentState('allCompletedStatus', {});

    // Store personal notes { [roleName]: { [questionId]: 'My note', ... }, ... }
    const [allRoleNotes, setAllRoleNotes] = usePersistentState('allRoleNotes', {});

    // ** NEW: Store AI explanations { [roleName]: { [questionId]: 'AI explanation HTML', ... }, ... }
    const [allAIExplanations, setAllAIExplanations] = usePersistentState('allAIExplanations', {});

    // allRoleQuestions will be the list of questions for the *current* role with *merged* status/notes/AI_Expl.
    const [allRoleQuestions, setAllRoleQuestions] = useState([]);
    const [questions, setQuestions] = useState([]); // Filtered list for display
    const [loading, setLoading] = useState(false);
    // Initialize selectedCategory to 'All Questions'
    const [selectedCategory, setSelectedCategory] = useState('All Questions');
    const [error, setError] = useState(null);

    // Get the current role's notes object
    const currentRoleNotes = useMemo(() => {
        return allRoleNotes[selectedRole] || {};
    }, [allRoleNotes, selectedRole]);

    // --- 1. Load questions from API and merge with persisted status/notes/AI_Expl on role change ---
    useEffect(() => {
        if (!selectedRole) {
            setAllRoleQuestions([]);
            setQuestions([]);
            return;
        }

        const loadQuestions = async () => {
            setError(null);
            setLoading(true);

            let baseQuestions = [];
            try {
                const data = await fetchQuestions(selectedRole);
                baseQuestions = (data || []).map(q => ({
                    ...q,
                    // Normalize the answer structure
                    answer: q.answer || { explanation: q.answer_explanation || '', code: q.answer_code || null },
                }));

            } catch (err) {
                console.error('Error fetching role questions:', err);
                setError('Failed to load questions for selected role.');
                setAllRoleQuestions([]);
                setQuestions([]);
                setLoading(false);
                return;
            }

            // MERGE: Apply the persisted status, notes, and AI explanation
            const completedStatus = allCompletedStatus[selectedRole] || {};
            const savedAIExplanations = allAIExplanations[selectedRole] || {}; // ** NEW **

            const questionsWithStatus = baseQuestions.map(q => ({
                ...q,
                completed: !!completedStatus[q.id],
                // ** MERGE SAVED AI EXPLANATION **
                ai_explanation: savedAIExplanations[q.id] || null,
                ai_explanation_loading: false,
            }));

            setAllRoleQuestions(questionsWithStatus);
            setQuestions(questionsWithStatus);
            setLoading(false);
        };

        loadQuestions();
        // ** ADD allAIExplanations to dependencies **
    }, [selectedRole, allCompletedStatus, allRoleNotes, allAIExplanations]);


    // SAVE Note handler (persist note on Save click)
    const handleSaveNote = useCallback((questionId, noteContent) => {
        if (!selectedRole) return;

        setAllRoleNotes(prev => {
            const roleNotes = prev[selectedRole] || {};

            let newRoleNotes;
            if (!noteContent || noteContent.trim() === '') {
                // remove the note if empty
                newRoleNotes = { ...roleNotes };
                delete newRoleNotes[questionId];
            } else {
                newRoleNotes = { ...roleNotes, [questionId]: noteContent };
            }

            return {
                ...prev,
                [selectedRole]: newRoleNotes,
            };
        });
    }, [selectedRole, setAllRoleNotes]);

    // UPDATED: Handler for AI Explanation - calls backend AI explain endpoint and SAVES result
    const handleExplainWithAI = useCallback(async (question) => {
        if (question.ai_explanation_loading) return;

        // 1. Set loading state for the specific question
        setAllRoleQuestions(prev => prev.map(q =>
            q.id === question.id
                ? { ...q, ai_explanation_loading: true, ai_explanation: q.ai_explanation }
                : q
        ));

        try {
            const text = await generateAIExplanation(selectedRole, question.title, question.answer.explanation);

            // Format the returned text for display (convert newlines to <br />)
            const formatted = text ? text.replace(/\n/g, '<br />') : 'Failed to generate explanation. Please try again.';

            // ** 2. Save the result to the Persistent State (allAIExplanations) **
            setAllAIExplanations(prev => ({
                ...prev,
                [selectedRole]: {
                    ...(prev[selectedRole] || {}),
                    [question.id]: formatted,
                }
            }));

            // 3. Update local state (allRoleQuestions) for immediate UI feedback
            setAllRoleQuestions(prev => prev.map(q =>
                q.id === question.id
                    ? { ...q, ai_explanation: formatted, ai_explanation_loading: false }
                    : q
            ));

        } catch (e) {
            console.error("AI Explanation Error:", e);
            // 4. Set error message and stop loading
            setAllRoleQuestions(prev => prev.map(q =>
                q.id === question.id
                    ? { ...q, ai_explanation_loading: false, ai_explanation: `<p class="text-red-500">Failed to generate AI explanation: ${e.message || 'Server error'}.</p>` }
                    : q
            ));
        }
    }, [selectedRole, setAllAIExplanations]); // Dependency added

    // counts per category (computed from allRoleQuestions)
    const counts = useMemo(() => {
        const map = { 'Fundamentals': 0, 'Coding': 0, 'System Design': 0, 'Behavioral': 0 };

        allRoleQuestions.forEach(q => {
            const c = q.category;
            if (c === 'Coding') {
                map['Coding'] += 1;
            } else if (c === 'Async') {
                map['Fundamentals'] += 1; // Consolidate Async into Fundamentals
            } else if (map[c] !== undefined) {
                map[c] += 1;
            }
        });
        return map;
    }, [allRoleQuestions]);

    // Progress derived from ALL questions for the role
    const completedCount = allRoleQuestions.filter(q => q.completed).length;
    const totalCount = allRoleQuestions.length;
    const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    // Handle initial role selection
    const handleRoleSelect = useCallback((roleName) => {
        setSelectedRole(roleName);
        setSelectedCategory('All Questions');
    }, [setSelectedRole]);

    // When category changes: filter from allRoleQuestions
    useEffect(() => {
        if (!selectedRole) return;

        const filterQuestions = () => {
            setLoading(true);

            let filtered = [];
            if (!selectedCategory || selectedCategory === 'All Questions') {
                filtered = allRoleQuestions;
            } else if (selectedCategory === 'Fundamentals') {
                filtered = allRoleQuestions.filter(q => q.category === 'Fundamentals' || q.category === 'Async');
            } else if (selectedCategory === 'Coding') {
                filtered = allRoleQuestions.filter(q => q.category === 'Coding');
            } else {
                filtered = allRoleQuestions.filter(q => q.category === selectedCategory);
            }
            setQuestions(filtered);
            setLoading(false);
        };

        filterQuestions();
    }, [selectedCategory, allRoleQuestions, selectedRole]); // Dependency added

    // UPDATED: Toggle complete by updating the global completed status map
    const toggleQuestionComplete = useCallback((questionId) => {
        if (!selectedRole) return;

        // 1. Update the global completed status map (persistent state)
        setAllCompletedStatus(prev => {
            const roleStatus = prev[selectedRole] || {};
            const isCompleted = !!roleStatus[questionId];

            let newRoleStatus;
            if (isCompleted) {
                newRoleStatus = { ...roleStatus };
                delete newRoleStatus[questionId];
            } else {
                newRoleStatus = { ...roleStatus, [questionId]: true };
            }

            return {
                ...prev,
                [selectedRole]: newRoleStatus,
            };
        });

        // 2. Optimistically update the current list for immediate UI feedback
        setAllRoleQuestions(prev => prev.map(q => q.id === questionId ? { ...q, completed: !q.completed } : q));

    }, [selectedRole, setAllCompletedStatus]);

    // Function to reset state and clear role in localStorage
    const handleRoleChange = () => {
        setSelectedRole(null);
        localStorage.removeItem('interviewRole');
        setAllRoleQuestions([]);
        setQuestions([]);
        setSelectedCategory('All Questions');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                {!selectedRole ? (
                    <RoleSelection roles={roles} onSelect={handleRoleSelect} />
                ) : loading ? (
                    <div className="text-center py-16">
                        <p className="text-gray-500">Loading questions...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 p-4 rounded mb-4">
                        <p className="text-red-600">{error}</p>
                        <button type="button" className="mt-2 text-sm text-indigo-600" onClick={() => handleRoleSelect(selectedRole)}>Retry</button>
                    </div>
                ) : (
                    <AdvancedPrep
                        role={selectedRole}
                        progressPercent={progressPercent}
                        completedCount={completedCount}
                        totalCount={totalCount}
                        questions={questions}
                        toggleComplete={toggleQuestionComplete}
                        onRoleChange={handleRoleChange} // Pass the handler
                        categories={CATEGORIES}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        counts={counts}
                        totalQuestionsForRole={totalCount}
                        allNotes={currentRoleNotes} // Pass the current role's notes
                        onSaveNote={handleSaveNote} // Pass the save-note handler
                        onExplainWithAI={handleExplainWithAI} // Pass the AI handler
                    />
                )}
            </div>
        </div>
    );
};

export default InterviewPrepOutlet;





