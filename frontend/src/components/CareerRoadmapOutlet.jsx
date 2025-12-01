
import React, { useState, useEffect } from 'react';
import { getRoadmap } from '../api/profile';

const scrollbarHiddenStyle = `
  .career-roadmap-scroll::-webkit-scrollbar { display: none; }
  .career-roadmap-scroll { -ms-overflow-style: none; scrollbar-width: none; }
`;

// Custom Hook for Local Storage Management
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch {}
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};

// Week Component
const WeekStep = ({ week }) => (
  <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm transition">
    <p className="font-medium text-gray-700 mb-1">Topics:</p>
    <ul className="list-disc list-inside mb-2 ml-4 text-sm text-gray-600">
      {week.topics.map((topic, i) => <li  className='py-1' key={i}>{topic}</li>)}
    </ul>

    <p className="font-medium text-gray-700 mb-1">Mini-projects:</p>
    <ul className="list-disc list-inside mb-2 ml-4 text-sm text-gray-600">
      {Array.isArray(week.miniProject)
        ? week.miniProject.map((p, i) => <li className='py-1' key={i}>{p}</li>)
        : <li>{week.miniProject}</li>}
    </ul>

    <p className="font-medium text-gray-700 mb-1">Resources:</p>
    <ul className="list-disc list-inside ml-4 text-sm text-gray-600">
      {week.resources.map((res, i) => <li  className='py-1' key={i}>{res}</li>)}
    </ul>
  </div>
);

// Month Component
const MonthStepContent = ({ monthData }) => (
  <div className="space-y-4">
    <p className="text-gray-700 font-medium border-b pb-2 mb-4">
      <span className="font-bold text-purple-600 mr-1">Goal:</span> {monthData.goal}
    </p>

    {monthData.weeks.map((week, idx) => (
      <div key={idx} className="pl-0">
        <h3 className="text-lg font-semibold text-purple-700 mb-2">{week.title}</h3>
        <WeekStep week={week} />
      </div>
    ))}

    <div className="pt-4 border-t border-gray-100">
      <p className="font-medium text-gray-700 mb-2 flex items-center">
        <span className="text-lg mr-1">🔑</span> Skills to Master:
      </p>
      <div className="flex flex-wrap gap-2">
        {monthData.skillsToMaster.map(skill => (
          <span key={skill} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
            {skill}
          </span>
        ))}
      </div>
    </div>
  </div>
);

// Timeline Step Component (Final Version)
const TimelineStep = ({ monthData, isLast }) => {
  const isComplete = monthData.isComplete;
  const dotClasses = isComplete ? "bg-green-500 ring-green-200" : "bg-purple-600 ring-purple-300"; 
  const lineClasses = isComplete ? "bg-green-400" : "bg-gray-300";
  
  // Extract month number
  const match = monthData.month.match(/Month (\d+)/);
  const monthNumber = match ? match[1] : '?';
  const iconContent = <span className="font-bold text-white text-lg">{monthNumber}</span>; 

  return (
    <div className="relative pl-12 pb-10">
      {/* Vertical Line: Adjusting bottom margin for the last step to reach the completion footer */}
      <div 
        className={`absolute left-[19px] top-8 w-1 ${lineClasses}`} 
        style={{ bottom: isLast ? '-4.5rem' : '-1.5rem' }} 
      />
      
      {/* Icon/Circle: Displays month number */}
      <div 
        className={`absolute left-0 top-0 w-10 h-10 rounded-full flex items-center justify-center ring-4 ${dotClasses} z-10`} 
        style={{ left: '0px' }}
      >
        {iconContent} 
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 ml-2 hover:shadow-2xl transition">
        <div className="inline-block bg-purple-600 text-white text-lg px-4 py-1 rounded-lg font-bold mb-4 shadow-md">
          {monthData.month}
        </div>

        <MonthStepContent monthData={monthData} />
      </div>
    </div>
  );
};

// Main Component
const CareerRoadmap = () => {
  const [targetDomain, setTargetDomain] = useLocalStorage('roadmapDomain', '');
  const [timeInMonths, setTimeInMonths] = useLocalStorage('roadmapMonths', 3);
  const [roadmap, setRoadmap] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async (e) => {
    e?.preventDefault();
    if (!targetDomain.trim()) {
      setError('Please enter a valid roadmap/domain name.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const months = parseInt(timeInMonths) || 3; 
      const response = await getRoadmap(targetDomain, months);
      const data = response?.months || [];
      setRoadmap(data);

      localStorage.setItem('hasGenerated', 'true');
      localStorage.setItem('roadmapData', JSON.stringify(data));

    } catch (err) {
      console.error('Error fetching roadmap:', err);
      setError('Failed to generate roadmap. Ensure backend is running.');

      const saved = localStorage.getItem('roadmapData');
      if (saved) setRoadmap(JSON.parse(saved));

    } finally {
      setLoading(false);
    }
  };
  
  // Handler for numeric input and constraints (1-12 months)
  const handleTimeInMonthsChange = (e) => {
    const value = e.target.value;
    const num = value === '' ? '' : parseInt(value); 
    
    if (value === '') {
        setTimeInMonths('');
    } else if (!isNaN(num)) {
        setTimeInMonths(Math.max(1, Math.min(12, num))); 
    }
  };

  useEffect(() => {
    const hasGenerated = localStorage.getItem('hasGenerated') === 'true';
    if (hasGenerated) {
      const saved = localStorage.getItem('roadmapData');
      if (saved) setRoadmap(JSON.parse(saved));
    }
  }, []);

  return (
    <>
      <style>{scrollbarHiddenStyle}</style>

      <div className="flex flex-col lg:flex-row gap-8 p-6 bg-gray-100 min-h-screen">

        {/* Left Panel */}
        <div className="lg:w-1/3 space-y-6 sticky top-8 h-fit">
          <div className="p-6 bg-gray-800 text-white rounded-xl shadow-2xl">
            <h1 className="text-3xl font-extrabold tracking-tight">AI Career Roadmap 🗺️</h1>
            <p className="mt-2 text-gray-300 text-sm">Generate your personalized roadmap for any domain.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Domain/Role</label>
              <input
                type="text"
                placeholder="e.g., AI Engineer, Full-Stack Developer"
                value={targetDomain}
                onChange={(e) => setTargetDomain(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time to Complete (Months)</label>
              <input
                type="number"
                min="1"
                max="12"
                value={timeInMonths}
                onChange={handleTimeInMonthsChange} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading}
              className="mt-4 w-full py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating...' : 'Generate Roadmap'}
            </button>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
        </div>

        {/* Right Panel */}
        <div className="lg:w-2/3 bg-white p-6 rounded-xl shadow-lg border border-gray-100 career-roadmap-scroll overflow-y-auto max-h-[80vh]">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">
            {roadmap.length > 0 ? "Proper Roadmap :" : 'Career Milestones'}
          </h2>

          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Generating your roadmap...</p>
              </div>
            </div>
          )}

          {!loading && roadmap.length > 0 ? (
            <div className="relative">
              {roadmap.map((monthData, idx) => (
                <TimelineStep
                  key={idx}
                  monthData={monthData}
                  isLast={idx === roadmap.length - 1}
                />
              ))}
              <div className="flex items-center justify-center mt-8 pt-6 border-t border-gray-200">
                <p className="text-lg font-bold text-green-600">🎉 Roadmap Complete!</p>
              </div>
            </div>
          ) : !loading && (
            <p className="text-gray-500 text-center py-12">
              No roadmap generated yet. Enter your domain and months, then click Generate Roadmap.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default CareerRoadmap;










