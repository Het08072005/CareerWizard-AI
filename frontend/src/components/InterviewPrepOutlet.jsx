import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchQuestions, generateAIExplanation } from '../api/interviewApi';
import { usePersistentState } from '../hooks/usePersistentState';
import RoleSelection from './InterviewPrep/RoleSelection';
import AdvancedPrep from './InterviewPrep/AdvancedPrep';
import {
    BriefcaseIcon, BrainIcon, CpuIcon,
    PaletteIcon, SmartphoneIcon, CloudIcon, UserCheckIcon,
    CodeIcon, ServerIcon, ZapIcon, LightbulbIcon,
    CpuChipIcon, SparklesIcon, ChartBarIcon, RefreshCwIcon
} from './ui/Icons';

const CATEGORIES = ['Fundamentals', 'Coding', 'System Design', 'Behavioral'];

const customScrollbarStyle = `
  .dark-prep-scroll::-webkit-scrollbar { width: 4px; }
  .dark-prep-scroll::-webkit-scrollbar-track { background: transparent; }
  .dark-prep-scroll::-webkit-scrollbar-thumb { background-color: #222; border-radius: 20px; }
  .dark-prep-scroll::-webkit-scrollbar-thumb:hover { background-color: #333; }
`;

const InterviewPrepOutlet = () => {
    const roles = [
        { name: 'Frontend Developer', icon: CodeIcon, skills: 'React, Vue, Angular, HTML/CSS' },
        { name: 'Backend Developer', icon: ServerIcon, skills: 'Node.js, Python, Java, APIs' },
        { name: 'Full Stack Developer', icon: ZapIcon, skills: 'Frontend + Backend + Database' },
        { name: 'AI Engineer', icon: CpuChipIcon, skills: 'MLOps, Production AI Systems, Cloud' },
        { name: 'Machine Learning Engineer (ML)', icon: BrainIcon, skills: 'Model Building, Deep Learning, Python' },
        { name: 'Generative AI Engineer (GenAI)', icon: SparklesIcon, skills: 'LLMs, Prompt Engineering, Stable Diffusion' },
        { name: 'Data Scientist', icon: ChartBarIcon, skills: 'Statistics, Predictive Modeling, Analysis' },
        { name: 'MLOps Engineer', icon: RefreshCwIcon, skills: 'CI/CD for ML, Kubernetes, Model Deployment' },
        { name: 'Deep Learning Engineer', icon: CpuIcon, skills: 'Neural Networks, NLP, Computer Vision' },
        { name: 'Computer Vision Engineer', icon: LightbulbIcon, skills: 'Image Processing, OpenCV, Object Detection' },
        { name: 'DevOps Engineer', icon: CloudIcon, skills: 'CI/CD, Docker, Kubernetes, Cloud' },
        { name: 'Mobile Developer', icon: SmartphoneIcon, skills: 'React Native, iOS, Android' },
        { name: 'QA Engineer', icon: UserCheckIcon, skills: 'Testing, Automation, Quality Assurance' },
        { name: 'Product Manager', icon: BriefcaseIcon, skills: 'Strategy, Roadmap, Stakeholder Management' },
        { name: 'UI/UX Designer', icon: PaletteIcon, skills: 'Design, User Experience, Prototyping' },
    ];

    const [selectedRole, setSelectedRole] = usePersistentState('interviewRole', null);
    const [allCompletedStatus, setAllCompletedStatus] = usePersistentState('allCompletedStatus', {});
    const [allRoleNotes, setAllRoleNotes] = usePersistentState('allRoleNotes', {});
    const [allAIExplanations, setAllAIExplanations] = usePersistentState('allAIExplanations', {});

    const [allRoleQuestions, setAllRoleQuestions] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All Questions');
    const [error, setError] = useState(null);

    const currentRoleNotes = useMemo(() => {
        return allRoleNotes[selectedRole] || {};
    }, [allRoleNotes, selectedRole]);

    useEffect(() => {
        // RESET VIEWPORT: Scroll parent main element to top on role change
        const mainEl = document.querySelector('main');
        if (mainEl) {
            mainEl.scrollTo({ top: 0, behavior: "instant" });
        }

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

            const completedStatus = allCompletedStatus[selectedRole] || {};
            const savedAIExplanations = allAIExplanations[selectedRole] || {};

            const questionsWithStatus = baseQuestions.map(q => ({
                ...q,
                completed: !!completedStatus[q.id],
                ai_explanation: savedAIExplanations[q.id] || null,
                ai_explanation_loading: false,
            }));

            setAllRoleQuestions(questionsWithStatus);
            setQuestions(questionsWithStatus);
            setLoading(false);
        };

        loadQuestions();
    }, [selectedRole]);


    const handleSaveNote = useCallback((questionId, noteContent) => {
        if (!selectedRole) return;

        setAllRoleNotes(prev => {
            const roleNotes = prev[selectedRole] || {};

            let newRoleNotes;
            if (!noteContent || noteContent.trim() === '') {
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

    const handleExplainWithAI = useCallback(async (question) => {
        if (question.ai_explanation_loading) return;

        setAllRoleQuestions(prev => prev.map(q =>
            q.id === question.id
                ? { ...q, ai_explanation_loading: true, ai_explanation: q.ai_explanation }
                : q
        ));

        try {
            const text = await generateAIExplanation(selectedRole, question.title, question.answer.explanation);
            const formatted = text ? text.replace(/\n/g, '<br />') : 'Failed to generate explanation. Please try again.';

            setAllAIExplanations(prev => ({
                ...prev,
                [selectedRole]: {
                    ...(prev[selectedRole] || {}),
                    [question.id]: formatted,
                }
            }));

            setAllRoleQuestions(prev => prev.map(q =>
                q.id === question.id
                    ? { ...q, ai_explanation: formatted, ai_explanation_loading: false }
                    : q
            ));

        } catch (e) {
            console.error("AI Explanation Error:", e);
            setAllRoleQuestions(prev => prev.map(q =>
                q.id === question.id
                    ? { ...q, ai_explanation_loading: false, ai_explanation: `<p class="text-rose-400 font-bold bg-rose-500/10 p-3 rounded-lg border border-rose-500/20 shadow-sm">Failed to generate AI explanation: ${e.message || 'Server error'}.</p>` }
                    : q
            ));
        }
    }, [selectedRole, setAllAIExplanations]);

    const counts = useMemo(() => {
        const map = { 'Fundamentals': 0, 'Coding': 0, 'System Design': 0, 'Behavioral': 0 };

        allRoleQuestions.forEach(q => {
            const c = q.category;
            if (c === 'Coding') {
                map['Coding'] += 1;
            } else if (c === 'Async') {
                map['Fundamentals'] += 1;
            } else if (map[c] !== undefined) {
                map[c] += 1;
            }
        });
        return map;
    }, [allRoleQuestions]);

    const completedCount = allRoleQuestions.filter(q => q.completed).length;
    const totalCount = allRoleQuestions.length;
    const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    const handleRoleSelect = useCallback((roleName) => {
        setLoading(true);
        setSelectedRole(roleName);
        setSelectedCategory('All Questions');
    }, [setSelectedRole]);

    useEffect(() => {
        if (!selectedRole) return;

        const filterQuestions = () => {
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
        };

        filterQuestions();
    }, [selectedCategory, allRoleQuestions, selectedRole]);

    const toggleQuestionComplete = useCallback((questionId) => {
        if (!selectedRole) return;

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

        setAllRoleQuestions(prev => prev.map(q => q.id === questionId ? { ...q, completed: !q.completed } : q));

    }, [selectedRole, setAllCompletedStatus]);

    const handleRoleChange = () => {
        setSelectedRole(null);
        localStorage.removeItem('interviewRole');
        setAllRoleQuestions([]);
        setQuestions([]);
        setSelectedCategory('All Questions');
    };

    return (
        <div className="min-h-screen bg-transparent relative overflow-hidden transition-colors duration-500 text-slate-900 dark:text-slate-200 dark-prep-scroll selection:bg-indigo-500/30">
            <style>{customScrollbarStyle}</style>
            {/* Grid Trace Background */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '60px 60px' }} />
            <div className="fixed top-0 right-0 w-[1000px] h-[1000px] bg-indigo-500/[0.012] rounded-full blur-[250px] pointer-events-none" />

            <div className="w-full relative z-10 px-0">
                {!selectedRole ? (
                    <RoleSelection roles={roles} onSelect={handleRoleSelect} />
                ) : error ? (
                    <div className="bg-rose-500/10 border border-rose-500/20 p-8 rounded-2xl shadow-sm mb-6 flex flex-col items-center animate-fade-in max-w-lg mx-auto mt-20 backdrop-blur-md">
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-rose-400 drop-shadow-sm mb-4 border border-rose-500/30">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <p className="text-xl font-bold text-rose-300 mb-3">{error}</p>
                        <button type="button" className="px-6 py-2 bg-gradient-to-r from-rose-500 to-red-600 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(244,63,94,0.4)] hover:-translate-y-0.5 transition-transform" onClick={() => handleRoleSelect(selectedRole)}>Try Again</button>
                    </div>
                ) : (
                    <AdvancedPrep
                        role={selectedRole}
                        progressPercent={progressPercent}
                        completedCount={completedCount}
                        totalCount={totalCount}
                        questions={questions}
                        loading={loading}
                        toggleComplete={toggleQuestionComplete}
                        onRoleChange={handleRoleChange}
                        categories={CATEGORIES}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        counts={counts}
                        totalQuestionsForRole={totalCount}
                        allNotes={currentRoleNotes}
                        onSaveNote={handleSaveNote}
                        onExplainWithAI={handleExplainWithAI}
                    />
                )}
            </div>
        </div>
    );
};

export default InterviewPrepOutlet;
