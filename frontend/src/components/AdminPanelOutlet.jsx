import React, { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import {
  UsersIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  AcademicCapIcon,
  ListBulletIcon,
  PencilSquareIcon,
  TrashIcon,
  BookOpenIcon,
  BoltIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  PhotoIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';

export default function AdminPanelOutlet() {
  const [activeTab, setActiveTab] = useState('create');
  const [step, setStep] = useState(1);

  // Step 1 State
  const [domain, setDomain] = useState("Web Development");
  const [plan, setPlan] = useState("15-Day Internship");
  const [dayNumber, setDayNumber] = useState("");
  const [difficulty, setDifficulty] = useState("Beginner");
  const [title, setTitle] = useState("");
  const [shortDesc, setShortDesc] = useState("");

  // Step 2 State
  const [taskType, setTaskType] = useState(null); // 'learning' or 'task'

  // Step 3 (Learning) State
  const [concepts, setConcepts] = useState([]);
  const [newConcept, setNewConcept] = useState("");
  const [resources, setResources] = useState([]);
  const [newResTitle, setNewResTitle] = useState("");
  const [newResUrl, setNewResUrl] = useState("");
  const [newResType, setNewResType] = useState("video");
  const [outcomes, setOutcomes] = useState("");

  // Step 3 (Task) State
  const [taskFullDesc, setTaskFullDesc] = useState("");
  const [requirements, setRequirements] = useState([]);
  const [newReq, setNewReq] = useState("");
  const [deliverable, setDeliverable] = useState("");
  const [timeEst, setTimeEst] = useState("");
  const [evalCriteria, setEvalCriteria] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");

  const [adminTasks, setAdminTasks] = useState([
    { id: 1, day: 1, title: 'HTML/CSS Responsive Landing Page', domain: 'Web Development', plan: '15-Day Internship', difficulty: 'Beginner', type: 'task' },
    { id: 2, day: 2, title: 'DOM Manipulation Basics', domain: 'Web Development', plan: '15-Day Internship', difficulty: 'Intermediate', type: 'learning' },
  ]);

  const addConcept = () => {
    if (!newConcept.trim()) return;
    setConcepts([...concepts, { name: newConcept, desc: '', usage: '' }]);
    setNewConcept("");
  };

  const addResource = () => {
    if (!newResTitle.trim()) return;
    setResources([...resources, { title: newResTitle, url: newResUrl, type: newResType }]);
    setNewResTitle("");
    setNewResUrl("");
  };

  const addRequirement = () => {
    if (!newReq.trim()) return;
    setRequirements([...requirements, newReq]);
    setNewReq("");
  };

  const handlePublish = () => {
    const newTask = {
      id: Date.now(),
      day: parseInt(dayNumber) || 1,
      title,
      domain,
      plan,
      difficulty,
      type: taskType
    };
    setAdminTasks([...adminTasks, newTask]);
    setStep(1);
    setTitle("");
    setShortDesc("");
    setDayNumber("");
    setTaskType(null);
    setConcepts([]);
    setResources([]);
    setRequirements([]);
    setActiveTab('tasks');
  };

  // --- RENDERING ---

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-8 relative w-full">
      <div className="absolute left-0 right-0 top-1/2 h-[2px] bg-slate-200 dark:bg-white/10 -z-10 -translate-y-1/2"></div>

      {[
        { num: 1, label: 'Domain & Plan' },
        { num: 2, label: 'Task Type' },
        { num: 3, label: 'Content' },
        { num: 4, label: 'Review' }
      ].map((s) => {
        const isActive = step === s.num;
        const isDone = step > s.num;
        return (
          <div key={s.num} className="flex flex-col items-center gap-2 bg-[var(--bg-main)] px-4 sm:px-8">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold transition-all ${isActive ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(147,51,234,0.4)] border-2 border-[var(--bg-main)]' :
                isDone ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-white/30 border border-slate-200 dark:border-white/10'
              }`}>
              {isDone ? <CheckCircleIcon className="w-5 h-5" /> : s.num}
            </div>
            <span className={`text-[10px] sm:text-[11px] font-bold tracking-widest uppercase ${isActive ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400'}`}>
              {s.label}
            </span>
          </div>
        );
      })}
    </div>
  );

  const renderStep1 = () => (
    <Motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 w-full">
      <div className="bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2 mb-2 text-slate-800 dark:text-white font-bold">
          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-lg flex items-center justify-center">1</div>
          Initialize Track Details
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">Domain / Track</label>
            <select value={domain} onChange={e => setDomain(e.target.value)} className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-[13px] outline-none text-slate-800 dark:text-white focus:border-purple-500 transition-colors">
              <option>Web Development</option>
              <option>Data Science</option>
              <option>AI / ML Engineering</option>
              <option>UI / UX Design</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">Assign to Plan</label>
            <select value={plan} onChange={e => setPlan(e.target.value)} className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-[13px] outline-none text-slate-800 dark:text-white focus:border-purple-500 transition-colors">
              <option>15-Day Smart Internship</option>
              <option>30-Day Deep Dive</option>
              <option>60-Day Mastery Program</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">Day Number</label>
            <input type="number" value={dayNumber} onChange={e => setDayNumber(e.target.value)} className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-[13px] outline-none text-slate-800 dark:text-white focus:border-purple-500 transition-colors" placeholder="e.g. 7" />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">Difficulty</label>
            <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-[13px] outline-none text-slate-800 dark:text-white focus:border-purple-500 transition-colors">
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">Task Title</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-[13px] outline-none text-slate-800 dark:text-white focus:border-purple-500 transition-colors" placeholder="e.g. Arrays & Two Pointer Technique" />
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">Short Description</label>
          <textarea rows={3} value={shortDesc} onChange={e => setShortDesc(e.target.value)} className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-[13px] outline-none text-slate-800 dark:text-white focus:border-purple-500 transition-colors resize-none" placeholder="Brief overview of what this day covers..."></textarea>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-white/5">
          <button
            disabled={!title || !dayNumber}
            onClick={() => setStep(2)}
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold text-[13px] flex items-center gap-2 transition-all shadow-[0_4px_16px_rgba(147,51,234,0.3)] hover:shadow-[0_4px_24px_rgba(147,51,234,0.4)] hover:-translate-y-0.5"
          >
            Continue to Task Type
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Motion.div>
  );

  const renderStep2 = () => (
    <Motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full">
      <div className="bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2 mb-2 text-slate-800 dark:text-white font-bold">
          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-lg flex items-center justify-center">2</div>
          Select Day Structure
        </div>
        <p className="text-[13px] text-slate-500 dark:text-slate-400">Choose how this day is formatted. A Learning Day focuses on concepts, while a Task Day is a hands-on assignment.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div
            onClick={() => setTaskType('learning')}
            className={`cursor-pointer rounded-2xl p-6 border-2 transition-all relative overflow-hidden group ${taskType === 'learning' ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 shadow-[0_0_24px_rgba(59,130,246,0.15)]' : 'border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] hover:border-blue-300'}`}
          >
            {taskType === 'learning' && <div className="absolute top-4 right-4 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center"><CheckCircleIcon className="w-5 h-5" /></div>}
            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BookOpenIcon className="w-7 h-7" />
            </div>
            <h4 className="text-[15px] font-bold text-slate-800 dark:text-white mb-2">Learning Day</h4>
            <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed">Concepts, explanations, how-to-use guides, video resources, and practical examples. Best for theory-heavy topics.</p>
          </div>

          <div
            onClick={() => setTaskType('task')}
            className={`cursor-pointer rounded-2xl p-6 border-2 transition-all relative overflow-hidden group ${taskType === 'task' ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10 shadow-[0_0_24px_rgba(249,115,22,0.15)]' : 'border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] hover:border-orange-300'}`}
          >
            {taskType === 'task' && <div className="absolute top-4 right-4 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center"><CheckCircleIcon className="w-5 h-5" /></div>}
            <div className="w-14 h-14 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BoltIcon className="w-7 h-7" />
            </div>
            <h4 className="text-[15px] font-bold text-slate-800 dark:text-white mb-2">Task Day</h4>
            <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed">Hands-on assignments, coding challenges, projects. Includes requirements, submission format, and evaluation criteria.</p>
          </div>
        </div>

        <div className="flex justify-between pt-6 border-t border-slate-100 dark:border-white/5">
          <button onClick={() => setStep(1)} className="px-5 py-2.5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-white rounded-xl font-bold text-[13px] flex items-center gap-2 transition-all">
            <ChevronLeftIcon className="w-4 h-4" /> Back
          </button>
          <button
            disabled={!taskType}
            onClick={() => setStep(3)}
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold text-[13px] flex items-center gap-2 transition-all shadow-[0_4px_16px_rgba(147,51,234,0.3)] hover:-translate-y-0.5"
          >
            Continue to Content
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Motion.div>
  );

  const renderStep3Learning = () => (
    <div className="w-full space-y-6">
      {/* CONCEPTS */}
      <div className="bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl p-6 sm:p-8">
        <h3 className="text-[15px] font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
          <BookOpenIcon className="w-6 h-6 text-blue-500 bg-blue-50 dark:bg-blue-500/10 p-1 rounded-md" /> Concepts to Cover
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {concepts.map((c, i) => (
            <div key={i} className="flex items-center justify-between bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center text-[12px] font-bold shrink-0">{i + 1}</div>
                <div className="text-[13px] font-bold text-slate-700 dark:text-white">{c.name}</div>
              </div>
              <button onClick={() => {
                const newC = [...concepts]; newC.splice(i, 1); setConcepts(newC);
              }} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors"><TrashIcon className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
        {concepts.length === 0 && <p className="text-[13px] text-slate-400 italic mb-6">No concepts added yet. Start by adding one below.</p>}

        <div className="flex flex-col sm:flex-row gap-3">
          <input type="text" value={newConcept} onChange={e => setNewConcept(e.target.value)} onKeyDown={e => e.key === 'Enter' && addConcept()} className="flex-1 bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-[13px] outline-none text-slate-800 dark:text-white focus:border-blue-500 transition-colors" placeholder="Concept name (e.g. Two Pointer Technique)" />
          <button onClick={addConcept} className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-[13px] font-bold transition-all shadow-[0_4px_12px_rgba(59,130,246,0.2)] whitespace-nowrap">Add Concept</button>
        </div>
      </div>

      {/* RESOURCES */}
      <div className="bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl p-6 sm:p-8">
        <h3 className="text-[15px] font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
          <VideoCameraIcon className="w-6 h-6 text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 p-1 rounded-md" /> Recommended Resources
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {resources.map((r, i) => (
            <div key={i} className="flex items-center gap-3 bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 p-3 rounded-xl">
              <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${r.type === 'video' ? 'bg-red-100 text-red-600' : r.type === 'article' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>{r.type}</span>
              <div className="flex-1 text-[13px] font-medium text-slate-700 dark:text-white truncate">{r.title}</div>
              <button onClick={() => {
                const newR = [...resources]; newR.splice(i, 1); setResources(newR);
              }} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"><TrashIcon className="w-4 h-4" /></button>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input type="text" value={newResTitle} onChange={e => setNewResTitle(e.target.value)} className="flex-1 bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-[13px] outline-none text-slate-800 dark:text-white focus:border-emerald-500 transition-colors" placeholder="Resource Title" />
          <input type="text" value={newResUrl} onChange={e => setNewResUrl(e.target.value)} className="flex-1 bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-[13px] outline-none text-slate-800 dark:text-white focus:border-emerald-500 transition-colors" placeholder="URL (Optional)" />
          <select value={newResType} onChange={e => setNewResType(e.target.value)} className="w-full sm:w-32 bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-[13px] outline-none text-slate-800 dark:text-white focus:border-emerald-500 transition-colors">
            <option value="video">Video</option>
            <option value="article">Article</option>
            <option value="doc">Doc</option>
          </select>
          <button onClick={addResource} className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[13px] font-bold transition-all shadow-[0_4px_12px_rgba(16,185,129,0.2)] whitespace-nowrap">Add</button>
        </div>
      </div>

      <div className="bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl p-6 sm:p-8">
        <label className="block text-[12px] font-bold uppercase tracking-widest text-slate-500 mb-2">Learning Outcomes (Markdown Support)</label>
        <textarea rows={4} value={outcomes} onChange={e => setOutcomes(e.target.value)} className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-4 text-[13px] outline-none text-slate-800 dark:text-white focus:border-purple-500 transition-colors resize-none font-mono" placeholder="By the end of this day, students will be able to..."></textarea>

        <div className="flex justify-between pt-6 mt-4 border-t border-slate-100 dark:border-white/5">
          <button onClick={() => setStep(2)} className="px-5 py-2.5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-white rounded-xl font-bold text-[13px] flex items-center gap-2 transition-all">
            <ChevronLeftIcon className="w-4 h-4" /> Back
          </button>
          <button onClick={() => setStep(4)} className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-[13px] flex items-center gap-2 transition-all shadow-[0_4px_16px_rgba(147,51,234,0.3)] hover:-translate-y-0.5">
            Continue to Review
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep3Task = () => (
    <div className="w-full space-y-6">
      <div className="bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl p-6 sm:p-8">
        <label className="block text-[12px] font-bold uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-2">
          <BoltIcon className="w-5 h-5 text-orange-500 bg-orange-50 dark:bg-orange-500/10 p-1 rounded-md" /> Task Full Description
        </label>
        <textarea rows={4} value={taskFullDesc} onChange={e => setTaskFullDesc(e.target.value)} className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-4 text-[13px] outline-none text-slate-800 dark:text-white focus:border-orange-500 transition-colors resize-none font-mono" placeholder="Detailed task description: context, background, goals..."></textarea>
      </div>

      <div className="bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl p-6 sm:p-8">
        <h3 className="text-[15px] font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
          <ClipboardDocumentCheckIcon className="w-6 h-6 text-purple-500 bg-purple-50 dark:bg-purple-500/10 p-1 rounded-md" /> Requirements / Checklist
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {requirements.map((r, i) => (
            <div key={i} className="flex items-center gap-3 bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 p-3 rounded-xl">
              <div className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0"></div>
              <div className="flex-1 text-[13px] text-slate-700 dark:text-white">{r}</div>
              <button onClick={() => {
                const newR = [...requirements]; newR.splice(i, 1); setRequirements(newR);
              }} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"><TrashIcon className="w-4 h-4" /></button>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input type="text" value={newReq} onChange={e => setNewReq(e.target.value)} onKeyDown={e => e.key === 'Enter' && addRequirement()} className="flex-1 bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-[13px] outline-none text-slate-800 dark:text-white focus:border-purple-500 transition-colors" placeholder="Add requirement (e.g. Implement BFS traversal)" />
          <button onClick={addRequirement} className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl text-[13px] font-bold transition-all shadow-[0_4px_12px_rgba(168,85,247,0.2)] whitespace-nowrap">Add Requirement</button>
        </div>
      </div>

      <div className="bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">Deliverable / Expected Output</label>
            <input type="text" value={deliverable} onChange={e => setDeliverable(e.target.value)} className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-[13px] outline-none text-slate-800 dark:text-white focus:border-orange-500 transition-colors" placeholder="e.g. GitHub repo link, Deployed URL" />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">Estimated Time</label>
            <input type="text" value={timeEst} onChange={e => setTimeEst(e.target.value)} className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-[13px] outline-none text-slate-800 dark:text-white focus:border-orange-500 transition-colors" placeholder="e.g. 3-4 hours" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-1.5"><PhotoIcon className="w-4 h-4 text-slate-400" /> Task Image / Pipeline URL</label>
            <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-[13px] outline-none text-slate-800 dark:text-white focus:border-orange-500 transition-colors" placeholder="https://image.url/diagram.png" />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-1.5"><VideoCameraIcon className="w-4 h-4 text-slate-400" /> YouTube Reference Link</label>
            <input type="text" value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-[13px] outline-none text-slate-800 dark:text-white focus:border-orange-500 transition-colors" placeholder="https://youtube.com/watch?v=..." />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">Evaluation Criteria & Hints</label>
          <textarea rows={3} value={evalCriteria} onChange={e => setEvalCriteria(e.target.value)} className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-4 text-[13px] outline-none text-slate-800 dark:text-white focus:border-orange-500 transition-colors resize-none font-mono" placeholder="How will this be evaluated? Optional hints..."></textarea>
        </div>

        <div className="flex justify-between pt-6 border-t border-slate-100 dark:border-white/5">
          <button onClick={() => setStep(2)} className="px-5 py-2.5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-white rounded-xl font-bold text-[13px] flex items-center gap-2 transition-all">
            <ChevronLeftIcon className="w-4 h-4" /> Back
          </button>
          <button onClick={() => setStep(4)} className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-[13px] flex items-center gap-2 transition-all shadow-[0_4px_16px_rgba(147,51,234,0.3)] hover:-translate-y-0.5">
            Continue to Review
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <Motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-full">
      <div className="bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl p-8 mb-6 relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-48 h-48 rounded-bl-full opacity-5 ${taskType === 'learning' ? 'bg-blue-500' : 'bg-orange-500'}`}></div>

        <div className="flex items-center gap-5 mb-8">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-lg ${taskType === 'learning' ? 'bg-blue-500 shadow-[0_4px_20px_rgba(59,130,246,0.3)]' : 'bg-orange-500 shadow-[0_4px_20px_rgba(249,115,22,0.3)]'}`}>
            {taskType === 'learning' ? <BookOpenIcon className="w-7 h-7" /> : <BoltIcon className="w-7 h-7" />}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-lg border ${taskType === 'learning' ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-500/20 dark:border-blue-500/30 dark:text-blue-400' : 'bg-orange-50 border-orange-200 text-orange-600 dark:bg-orange-500/20 dark:border-orange-500/30 dark:text-orange-400'}`}>
                {taskType === 'learning' ? 'Learning Day' : 'Task Day'}
              </span>
              <span className="px-2.5 py-1 bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-300 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-slate-200 dark:border-white/10">{difficulty}</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">{title || 'Untitled Task'}</h2>
            <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400 mt-1">Day {dayNumber || 1} • {domain} • {plan}</p>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-xl p-6">
          <p className="text-[14px] text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            {shortDesc || 'No description provided.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {taskType === 'learning' ? (
              <>
                <div className="bg-white dark:bg-black/40 border border-slate-100 dark:border-white/5 rounded-xl p-4 flex justify-between items-center">
                  <span className="font-bold text-slate-500 text-[13px]">Concepts Covered</span>
                  <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">{concepts.length}</span>
                </div>
                <div className="bg-white dark:bg-black/40 border border-slate-100 dark:border-white/5 rounded-xl p-4 flex justify-between items-center">
                  <span className="font-bold text-slate-500 text-[13px]">Resources Provided</span>
                  <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">{resources.length}</span>
                </div>
              </>
            ) : (
              <>
                <div className="bg-white dark:bg-black/40 border border-slate-100 dark:border-white/5 rounded-xl p-4 flex justify-between items-center">
                  <span className="font-bold text-slate-500 text-[13px]">Requirements Count</span>
                  <span className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">{requirements.length}</span>
                </div>
                <div className="bg-white dark:bg-black/40 border border-slate-100 dark:border-white/5 rounded-xl p-4 flex justify-between items-center">
                  <span className="font-bold text-slate-500 text-[13px]">Expected Deliverable</span>
                  <span className="font-medium text-[13px] text-slate-800 dark:text-white max-w-[150px] truncate">{deliverable || 'None'}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button onClick={() => setStep(3)} className="px-5 py-2.5 bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-600 dark:text-white rounded-xl font-bold text-[13px] flex items-center gap-2 transition-all">
          <ChevronLeftIcon className="w-4 h-4" /> Back to Edit
        </button>
        <button onClick={handlePublish} className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-[14px] flex items-center gap-2 transition-all shadow-[0_4px_20px_rgba(16,185,129,0.3)] hover:-translate-y-0.5">
          <CheckCircleIcon className="w-5 h-5" /> Publish Task Live
        </button>
      </div>
    </Motion.div>
  );

  return (
    <div className="w-full h-full p-4 sm:p-6 md:p-8">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center shadow-sm">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">Admin Curriculum Architect</h1>
            <p className="text-[13px] text-slate-500 font-medium">Design structured learning paths and actionable tasks.</p>
          </div>
        </div>
      </div>

      {/* STATS TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mb-8">
        {[
          { label: 'Active Users', val: '1,247', icon: UsersIcon, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
          { label: 'Total Tasks', val: adminTasks.length, icon: ClipboardDocumentCheckIcon, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
          { label: 'Pending Reviews', val: '34', icon: ClockIcon, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
          { label: 'Certs Issued', val: '312', icon: AcademicCapIcon, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10' }
        ].map((s, i) => (
          <div key={i} className="bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl p-5 flex items-center gap-4 hover:-translate-y-1 transition-transform">
            <div className={`w-12 h-12 ${s.bg} ${s.color} rounded-xl flex items-center justify-center shrink-0`}>
              <s.icon className="w-6 h-6" strokeWidth={2} />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-800 dark:text-white">{s.val}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-0.5">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div className="flex border-b border-slate-200 dark:border-white/10 mb-8 w-full">
        <button
          onClick={() => setActiveTab('create')}
          className={`px-8 py-3 text-[14px] font-bold transition-all border-b-2 ${activeTab === 'create' ? 'border-purple-600 text-purple-600 dark:text-purple-400' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
        >
          ➕ Create New Task
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-8 py-3 text-[14px] font-bold transition-all border-b-2 ${activeTab === 'tasks' ? 'border-purple-600 text-purple-600 dark:text-purple-400' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
        >
          📋 Manage Tasks
        </button>
      </div>

      {/* CONTENT AREA */}
      <div className="w-full">
        <AnimatePresence mode="wait">
          {activeTab === 'create' && (
            <Motion.div key="create" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full pb-10">
              {renderStepIndicator()}
              <div className="mt-8 w-full">
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && taskType === 'learning' && renderStep3Learning()}
                {step === 3 && taskType === 'task' && renderStep3Task()}
                {step === 4 && renderStep4()}
              </div>
            </Motion.div>
          )}

          {activeTab === 'tasks' && (
            <Motion.div key="tasks" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden w-full">
              <div className="p-5 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02] flex items-center justify-between">
                <h3 className="font-bold text-slate-800 dark:text-white text-[15px]">All Tasks</h3>
                <select className="bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 text-[13px] outline-none font-medium">
                  <option>All Domains</option>
                  <option>Web Development</option>
                  <option>Data Science</option>
                </select>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-white/5">
                {adminTasks.map((t) => (
                  <div key={t.id} className="p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-[13px] font-bold ${t.type === 'learning' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                        D{t.day}
                      </div>
                      <div>
                        <div className="text-[15px] font-bold text-slate-800 dark:text-white">{t.title}</div>
                        <div className="flex items-center gap-2 mt-1.5 text-[12px] text-slate-500 font-medium">
                          <span className="font-bold text-slate-700 dark:text-slate-300">{t.domain}</span>
                          <span>•</span>
                          <span>{t.plan}</span>
                          <span>•</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${t.type === 'learning' ? 'bg-blue-50 text-blue-500 border border-blue-100' : 'bg-orange-50 text-orange-500 border border-orange-100'}`}>{t.type}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 mr-4 border border-slate-200 dark:border-white/10">{t.difficulty}</span>
                      <button className="p-2.5 text-slate-400 hover:text-blue-500 transition-colors bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl shadow-sm hover:shadow-md"><PencilSquareIcon className="w-4 h-4" /></button>
                      <button onClick={() => setAdminTasks(adminTasks.filter(x => x.id !== t.id))} className="p-2.5 text-slate-400 hover:text-red-500 transition-colors bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl shadow-sm hover:shadow-md"><TrashIcon className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
                {adminTasks.length === 0 && (
                  <div className="p-10 text-center text-slate-500 text-[14px] font-medium">No tasks created yet.</div>
                )}
              </div>
            </Motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
