import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const plans = [
  { id: 'course', name: 'Course Certificate', price: 199, duration: 'Self-paced course', popular: false, features: ['Video lessons + quizzes', 'Course completion letter', 'No GitHub tasks', 'No AI code review'] },
  { id: '15day', name: '15-Day Internship', price: 399, duration: '15 Days', popular: false, features: ['5 real project tasks', 'AI GitHub code review', 'Verified certificate', 'Own project option ✨'] },
  { id: '30day', name: '30-Day Internship', price: 599, duration: '30 Days', popular: true, tag: 'Most Popular', features: ['6 phased project tasks', 'AI + human spot review', 'Blockchain certificate', 'Own project option ✨'] },
  { id: '45day', name: '45-Day Internship', price: 999, duration: '45 Days', popular: false, features: ['9 advanced tasks', 'Priority AI review', 'Premium certificate', 'Job match boost'] },
  { id: '3month', name: '3-Month Internship', price: 1899, duration: '90 Days', popular: false, features: ['12 real-world tasks', 'Mentor review sessions', 'Gold certificate', 'Company referrals'] },
  { id: '6month', name: '6-Month Internship', price: 3599, duration: '180 Days', popular: false, features: ['15 enterprise tasks', '1:1 mentor calls', 'Platinum certificate', 'Guaranteed interview'] }
];

const tracks = [
  { id: 'webdev', name: 'Web Development', icon: 'fa-code', desc: 'React, Node.js, REST APIs, databases' },
  { id: 'ds', name: 'Data Science', icon: 'fa-chart-simple', desc: 'Python, Pandas, ML models, visualization' },
  { id: 'aiml', name: 'AI / ML Engineering', icon: 'fa-brain', desc: 'PyTorch, NLP, Computer Vision, deployment' },
  { id: 'uiux', name: 'UI / UX Design', icon: 'fa-pen-ruler', desc: 'Figma, wireframing, prototyping, research' },
  { id: 'devops', name: 'DevOps & Cloud', icon: 'fa-server', desc: 'Docker, AWS basics, CI/CD pipelines' },
  { id: 'pm', name: 'Product Management', icon: 'fa-clipboard-list', desc: 'PRDs, user stories, roadmaps, metrics' }
];

const levels = [
  { id: 'beginner', name: 'Beginner', difficulty: 'Easy', color: '#22c55e', desc: 'HTML, CSS, vanilla JS. No prior experience needed.', experience: '0 - 6 months experience' },
  { id: 'intermediate', name: 'Intermediate', difficulty: 'Recommended', color: '#f59e0b', desc: 'React + backend + database. Build full-stack apps.', experience: '6 months - 2 years' },
  { id: 'advanced', name: 'Advanced', difficulty: 'Pro', color: '#ef4444', desc: 'Full-stack + Docker + CI/CD + tests. Production-level code.', experience: '2+ years experience' }
];

export default function InternshipEnroll() {
  const navigate = useNavigate();
  const [isEnrolled, setIsEnrolled] = useState(false); // start as unenrolled to trigger the gorgeous setup flow
  
  // Setup Wizard States
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(plans[2]); // Standard 30 days default
  const [selectedTrack, setSelectedTrack] = useState(tracks[0]); // Web dev default
  const [selectedLevel, setSelectedLevel] = useState(levels[1]); // Intermediate default
  
  // Checkout Details States
  const [paymentMethod, setPaymentMethod] = useState('upi'); // upi, card, netbanking
  const [upiId, setUpiId] = useState('hetpanchal@okaxis');
  const [cardNumber, setCardNumber] = useState('4321 8892 4432 1092');
  const [cardExpiry, setCardExpiry] = useState('12/29');
  const [cardCvv, setCardCvv] = useState('***');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Completed Enrollment Details View States
  const [activeEnrolledTrack, setActiveEnrolledTrack] = useState('webdev');
  const [activeEnrolledLevel, setActiveEnrolledLevel] = useState('intermediate');

  const handleCompleteEnrollment = () => {
    setIsProcessing(true);
    // Simulate high-end processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      // Let success modal hold for 1.5 seconds, then flip status and navigate
      setTimeout(() => {
        setIsEnrolled(true);
        setPaymentSuccess(false);
        setStep(1); // Reset state for next visit
        navigate('/internship');
      }, 2000);
    }, 2500);
  };

  // If already enrolled, render the active dashboard control view (Specialization Changer & Level Config)
  if (isEnrolled) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto p-2 md:p-4">
        <div className="bg-[var(--bg-sidebar)] border border-[var(--border-color)] rounded-2xl p-6 shadow-xl relative overflow-hidden transition-all duration-500">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600"></div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-certificate text-[#16a34a] text-xl" />
              <h2 className="text-xl font-bold tracking-tight">Active Internship Status</h2>
            </div>
            <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-[#16a34a] border border-[#16a34a]/20 animate-pulse">
              ● Active Student
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6 p-5 rounded-2xl bg-emerald-500/[0.02] border border-emerald-500/10">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-3xl text-[#16a34a] shrink-0 border border-emerald-500/20">
              <i className="fa-solid fa-graduation-cap" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="text-lg font-bold text-[var(--text-main)]">
                {tracks.find(t => t.id === activeEnrolledTrack)?.name || 'Web Development'} Internship
              </div>
              <div className="text-sm text-slate-400 mt-1">
                Currently tracking on the <strong className="text-emerald-500">{selectedPlan.name}</strong> • Level is set to <strong className="text-[#f59e0b] capitalize">{activeEnrolledLevel}</strong>.
              </div>
            </div>
            <button 
              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl bg-slate-100 hover:bg-slate-200 text-[#1a1916] transition shadow-sm border border-slate-200"
              onClick={() => alert('Certificate generates automatically when overall average reaches 60% or above!')}
            >
              <i className="fa-solid fa-file-contract mr-2" /> Requirements
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* SPECIALIZATION CHANGER */}
          <div className="bg-[var(--bg-sidebar)] border border-[var(--border-color)] rounded-2xl p-6 shadow-lg relative transition-all duration-500">
            <div className="flex items-center gap-3 mb-4">
              <i className="fa-solid fa-route text-emerald-500 text-lg" />
              <h3 className="text-base font-bold">Change Your Specialization</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              You can dynamically pivot your track context. Today's tasks adapt dynamically based on your active route selection.
            </p>
            <div className="space-y-3">
              {tracks.map(t => (
                <div
                  key={t.id}
                  onClick={() => setActiveEnrolledTrack(t.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition flex items-start gap-4 ${activeEnrolledTrack === t.id ? 'border-[#16a34a] bg-emerald-500/5' : 'border-slate-500/10 hover:border-slate-500/20'}`}
                >
                  <div className={`text-xl ${activeEnrolledTrack === t.id ? 'text-[#16a34a]' : 'text-slate-400'}`}>
                    <i className={`fa-solid ${t.icon}`} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[var(--text-main)]">{t.name}</div>
                    <div className="text-xs text-slate-400 mt-1 leading-relaxed">{t.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DIFFICULTY SWITCHER */}
          <div className="bg-[var(--bg-sidebar)] border border-[var(--border-color)] rounded-2xl p-6 shadow-lg relative transition-all duration-500">
            <div className="flex items-center gap-3 mb-4">
              <i className="fa-solid fa-sliders text-emerald-500 text-lg" />
              <h3 className="text-base font-bold">Internship Difficulty Level</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Difficulty alters the grading matrix and AI code assessment metrics. Pick a target that matches your current expertise.
            </p>
            <div className="space-y-3">
              {levels.map(l => (
                <div
                  key={l.id}
                  onClick={() => setActiveEnrolledLevel(l.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition flex items-start gap-4 ${activeEnrolledLevel === l.id ? 'border-[#16a34a] bg-emerald-500/5' : 'border-slate-500/10 hover:border-slate-500/20'}`}
                >
                  <div className="w-4 h-4 rounded-full border flex items-center justify-center mt-1 border-slate-500/20 shrink-0">
                    {activeEnrolledLevel === l.id && <div className="w-2.5 h-2.5 rounded-full bg-[#16a34a]" />}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[var(--text-main)]">{l.name} Selection</div>
                    <div className="text-xs text-slate-400 mt-1 leading-relaxed">{l.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Otherwise, render the premium Multi-Step wizard flow
  return (
    <div className="max-w-7xl mx-auto p-2 md:p-4 space-y-6">
      
      {/* GORGEOUS STEP HEADER WIDGET */}
      <div className="bg-[var(--bg-sidebar)] border border-[var(--border-color)] rounded-xl p-4 shadow-sm transition-all duration-500">
        <div className="flex items-center justify-between gap-2 max-w-3xl mx-auto flex-wrap md:flex-nowrap">
          <div onClick={() => setStep(1)} className={`flex items-center gap-2 cursor-pointer transition ${step === 1 ? 'opacity-100' : 'opacity-50 hover:opacity-80'}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] ${step >= 1 ? 'bg-[#16a34a] text-white' : 'border border-slate-400 text-slate-400'}`}>1</div>
            <span className={`text-[11px] font-semibold ${step === 1 ? 'text-[#16a34a]' : 'text-slate-400'}`}>Choose plan</span>
          </div>
          <div className="flex-1 h-[1px] bg-slate-500/10 mx-2 hidden md:block"></div>
          <div onClick={() => step > 1 && setStep(2)} className={`flex items-center gap-2 cursor-pointer transition ${step === 2 ? 'opacity-100' : 'opacity-50 hover:opacity-80'}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] ${step >= 2 ? 'bg-[#16a34a] text-white' : 'border border-slate-400 text-slate-400'}`}>2</div>
            <span className={`text-[11px] font-semibold ${step === 2 ? 'text-[#16a34a]' : 'text-slate-400'}`}>Select track</span>
          </div>
          <div className="flex-1 h-[1px] bg-slate-500/10 mx-2 hidden md:block"></div>
          <div onClick={() => step > 2 && setStep(3)} className={`flex items-center gap-2 cursor-pointer transition ${step === 3 ? 'opacity-100' : 'opacity-50 hover:opacity-80'}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] ${step >= 3 ? 'bg-[#16a34a] text-white' : 'border border-slate-400 text-slate-400'}`}>3</div>
            <span className={`text-[11px] font-semibold ${step === 3 ? 'text-[#16a34a]' : 'text-slate-400'}`}>Pick level</span>
          </div>
          <div className="flex-1 h-[1px] bg-slate-500/10 mx-2 hidden md:block"></div>
          <div onClick={() => step > 3 && setStep(4)} className={`flex items-center gap-2 cursor-pointer transition ${step === 4 ? 'opacity-100' : 'opacity-50 hover:opacity-80'}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] ${step >= 4 ? 'bg-[#16a34a] text-white' : 'border border-slate-400 text-slate-400'}`}>4</div>
            <span className={`text-[11px] font-semibold ${step === 4 ? 'text-[#16a34a]' : 'text-slate-400'}`}>Confirm</span>
          </div>
        </div>
      </div>

      {/* STEP CONTENT SWITCHER */}
      <div className="bg-[var(--bg-sidebar)] border border-[var(--border-color)] rounded-xl p-5 shadow-sm relative overflow-hidden transition-all duration-500">
        
        {/* STEP 1: CHOOSE PLAN */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="border-b border-slate-500/10 pb-3">
              <h2 className="text-base font-bold tracking-tight text-[var(--text-main)]">Choose your internship plan</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Select an optimal duration and certification path matching your goal.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPlan(p)}
                  className={`relative p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-between hover:translate-y-[-2px] ${
                    selectedPlan.id === p.id 
                      ? 'border-[#16a34a] bg-emerald-500/[0.04] shadow-[0_4px_20px_rgba(22,163,74,0.1)]' 
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-white/[0.01]'
                  }`}
                >
                  {p.popular && (
                    <span className="absolute top-[-10px] left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[9px] font-bold tracking-widest uppercase bg-[#16a34a] text-white shadow-md">
                      {p.tag}
                    </span>
                  )}
                  <div>
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="text-2xl font-extrabold text-[var(--text-main)]">₹{p.price.toLocaleString()}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{p.duration}</span>
                    </div>
                    <div className="text-sm font-bold text-[var(--text-main)] mb-4">{p.name}</div>
                    
                    <div className="space-y-2.5 mb-6">
                      {p.features.map((feat, idx) => {
                        const isNo = feat.startsWith('No ');
                        return (
                          <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 leading-normal font-medium">
                            <i className={`fa-solid ${isNo ? 'fa-xmark text-rose-500 mt-0.5' : 'fa-check text-[#16a34a] mt-0.5'}`} />
                            <span>{feat}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <button className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                    selectedPlan.id === p.id 
                      ? 'bg-[#16a34a] text-white shadow-md' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-transparent'
                  }`}>
                    {selectedPlan.id === p.id ? 'Selected' : 'Select Plan'}
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4">
              <button 
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#16a34a] hover:bg-emerald-600 text-white transition shadow-md flex items-center gap-2"
              >
                <span>Continue</span>
                <i className="fa-solid fa-arrow-right" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SELECT TRACK */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="border-b border-slate-500/10 pb-3">
              <h2 className="text-base font-bold tracking-tight text-[var(--text-main)]">Select your domain track</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Select the professional domain specialization for your projects.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {tracks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTrack(t)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                    selectedTrack.id === t.id 
                      ? 'border-[#16a34a] bg-emerald-500/[0.04]' 
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-white/[0.01]'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                      selectedTrack.id === t.id 
                        ? 'bg-emerald-500/10 text-[#16a34a] border-emerald-500/20' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}>
                      <i className={`fa-solid ${t.icon} text-sm`} />
                    </div>
                    <span className="text-sm font-semibold text-[var(--text-main)]">{t.name}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">{t.desc}</p>
                  
                  <button className={`w-full py-2 rounded-lg text-xs font-semibold transition ${
                    selectedTrack.id === t.id 
                      ? 'bg-[#16a34a] text-white' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-transparent'
                  }`}>
                    {selectedTrack.id === t.id ? 'Selected' : 'Select'}
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2">
              <button 
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-transparent transition"
              >
                Back
              </button>
              <button 
                onClick={() => setStep(3)}
                className="px-5 py-2 rounded-lg text-xs font-semibold bg-[#16a34a] hover:bg-emerald-600 text-white transition shadow-sm flex items-center gap-2"
              >
                <span>Continue</span>
                <i className="fa-solid fa-arrow-right" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PICK LEVEL */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="border-b border-slate-500/10 pb-3">
              <h2 className="text-base font-bold tracking-tight text-[var(--text-main)]">Choose your difficulty level</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Select an optimal experience bracket to calibrate AI grading rubrics.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {levels.map((l) => (
                <div
                  key={l.id}
                  onClick={() => setSelectedLevel(l)}
                  className={`relative p-4 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                    selectedLevel.id === l.id 
                      ? 'border-[#16a34a] bg-emerald-500/[0.04]' 
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-white/[0.01]'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: l.color }} />
                      <span className="text-sm font-semibold text-[var(--text-main)]">{l.name}</span>
                      <span className="ml-auto px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-transparent">
                        {l.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{l.desc}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-[10.5px] text-slate-500 dark:text-slate-400 font-mono mb-3 border-t border-slate-200 dark:border-slate-800 pt-2.5">
                      <i className="fa-regular fa-clock" />
                      <span>{l.experience}</span>
                    </div>
                    <button className={`w-full py-2 rounded-lg text-xs font-semibold transition ${
                      selectedLevel.id === l.id 
                        ? 'bg-[#16a34a] text-white' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-transparent'
                    }`}>
                      {selectedLevel.id === l.id ? 'Selected' : 'Select Level'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2">
              <button 
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-transparent transition"
              >
                Back
              </button>
              <button 
                onClick={() => setStep(4)}
                className="px-5 py-2 rounded-lg text-xs font-semibold bg-[#16a34a] hover:bg-emerald-600 text-white transition shadow-sm flex items-center gap-2"
              >
                <span>Continue</span>
                <i className="fa-solid fa-arrow-right" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: CONFIRM AND PAY */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="border-b border-slate-500/10 pb-4">
              <h2 className="text-xl font-bold tracking-tight">Confirm & Enroll</h2>
              <p className="text-xs text-slate-400 mt-1">Review your selections and initiate payment via secure gateway.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              
              {/* ORDER SUMMARY */}
              <div className="space-y-4">
                <div className="bg-slate-100/60 dark:bg-slate-500/5 border border-slate-200 dark:border-slate-500/10 rounded-xl p-4 space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Order Summary</div>
                  
                  <div className="space-y-2.5 pt-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 dark:text-slate-400">Selected Plan</span>
                      <span className="font-bold text-[var(--text-main)]">{selectedPlan.name}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 dark:text-slate-400">Domain Track</span>
                      <span className="font-bold text-[var(--text-main)]">{selectedTrack.name}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 dark:text-slate-400">Difficulty Level</span>
                      <span className="font-bold text-[var(--text-main)]">{selectedLevel.name}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 dark:text-slate-400">Duration</span>
                      <span className="font-bold text-[var(--text-main)]">{selectedPlan.duration}</span>
                    </div>
                    
                    <div className="border-t border-slate-200 dark:border-slate-500/10 my-2 pt-2.5 flex justify-between items-baseline">
                      <span className="text-xs font-bold text-[var(--text-main)]">Total Amount</span>
                      <span className="text-xl font-extrabold text-[#16a34a]">₹{selectedPlan.price}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-500/5 border border-blue-500/10 text-[11px] text-blue-400 leading-relaxed">
                  <i className="fa-solid fa-shield-halved mt-0.5 shrink-0" />
                  <span>Your subscription credentials and live workspace keys will be generated and emailed instantly upon payment confirmation.</span>
                </div>
              </div>

              {/* PAYMENT OPTION SELECTOR */}
              <div className="space-y-4 bg-slate-100/60 dark:bg-slate-500/[0.02] border border-slate-200 dark:border-slate-500/10 rounded-xl p-4">
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-500/10 pb-3">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <i className="fa-solid fa-lock text-emerald-500" />
                    <span>Razorpay Secure Gateway</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">TEST MODE</span>
                </div>

                {/* PAYMENT METHOD TABS */}
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    onClick={() => setPaymentMethod('upi')}
                    className={`py-1.5 text-[10.5px] font-semibold rounded-lg border transition ${
                      paymentMethod === 'upi' 
                        ? 'border-[#16a34a] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    UPI
                  </button>
                  <button 
                    onClick={() => setPaymentMethod('card')}
                    className={`py-1.5 text-[10.5px] font-semibold rounded-lg border transition ${
                      paymentMethod === 'card' 
                        ? 'border-[#16a34a] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    Card
                  </button>
                  <button 
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`py-1.5 text-[10.5px] font-semibold rounded-lg border transition ${
                      paymentMethod === 'netbanking' 
                        ? 'border-[#16a34a] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    Net Banking
                  </button>
                </div>

                {/* UPI INPUT */}
                {paymentMethod === 'upi' && (
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Virtual Payment Address (VPA)</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-500/10 bg-slate-500/5 text-xs text-[var(--text-main)] outline-none focus:border-[#16a34a] transition font-mono"
                        placeholder="username@vpa"
                      />
                      <i className="fa-solid fa-circle-check text-[#16a34a] absolute right-3.5 top-3.5 text-xs" />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-1">
                      <span className="hover:text-slate-300 cursor-pointer">@okaxis</span>
                      <span className="hover:text-slate-300 cursor-pointer">@okicici</span>
                      <span className="hover:text-slate-300 cursor-pointer">@okpaytm</span>
                      <span className="hover:text-slate-300 cursor-pointer">@okhdfc</span>
                    </div>
                  </div>
                )}

                {/* CARD INPUTS */}
                {paymentMethod === 'card' && (
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Card Number</label>
                      <input 
                        type="text" 
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-500/10 bg-slate-500/5 text-xs text-[var(--text-main)] outline-none focus:border-[#16a34a] transition font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Expiry</label>
                        <input 
                          type="text" 
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-500/10 bg-slate-500/5 text-xs text-[var(--text-main)] outline-none focus:border-[#16a34a] transition font-mono"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CVV</label>
                        <input 
                          type="password" 
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-500/10 bg-slate-500/5 text-xs text-[var(--text-main)] outline-none focus:border-[#16a34a] transition font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* NET BANKING */}
                {paymentMethod === 'netbanking' && (
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Bank</label>
                    <select className="w-full px-3.5 py-2.5 rounded-xl border border-slate-500/10 bg-[var(--bg-sidebar)] text-xs text-[var(--text-main)] outline-none focus:border-[#16a34a] transition">
                      <option>State Bank of India</option>
                      <option>HDFC Bank</option>
                      <option>ICICI Bank</option>
                      <option>Axis Bank</option>
                      <option>Kotak Mahindra Bank</option>
                    </select>
                  </div>
                )}

                {/* SUBMIT BUTTON WITH SPINNER */}
                <button
                  onClick={handleCompleteEnrollment}
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#16a34a] hover:bg-emerald-600 disabled:bg-emerald-600/50 text-white transition shadow-md flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Securing Connection...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-lock" />
                      <span>Pay ₹{selectedPlan.price} & Activate Status</span>
                    </>
                  )}
                </button>

                <div className="text-[10px] text-slate-400 text-center leading-relaxed">
                  Secured by Razorpay • 2% transaction fee included • Click to trigger instant student dashboard access.
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-slate-500/10">
              <button 
                onClick={() => setStep(3)}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-transparent transition"
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>

      {/* PAYMENT SUCCESS POPUP MODAL */}
      {paymentSuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="bg-[var(--bg-sidebar)] border border-emerald-500/30 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl relative overflow-hidden animate-bounce-short">
            <div className="absolute top-0 inset-x-0 h-[4px] bg-[#16a34a]" />
            
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-3xl text-[#16a34a] mx-auto mb-4 border border-emerald-500/20">
              <i className="fa-solid fa-circle-check" />
            </div>
            
            <h3 className="text-lg font-bold text-[var(--text-main)] mb-1">Payment Successful!</h3>
            <p className="text-xs text-slate-400 mb-6">Razorpay ID: <span className="font-mono text-emerald-500 font-bold uppercase">pay_ht52a8b3z</span></p>
            
            <div className="p-3 bg-emerald-500/5 rounded-xl text-[11px] text-[#16a34a] font-semibold flex items-center justify-center gap-2 border border-emerald-500/10">
              <i className="fa-solid fa-spinner animate-spin" />
              <span>Initializing Live Dashboard...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
