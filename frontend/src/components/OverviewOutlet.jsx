// components/OverviewOutlet.jsx

import React from 'react';
import { useNavigate } from "react-router-dom";

// --- Reusable Components for Clarity ---

// 1. Stat Card Component
const StatCard = ({ icon, value, title, subtitle, iconBgClass }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col space-y-3 hover:shadow-lg transition duration-300">
            {/* Icon Area */}
            <div className={`w-12 h-12 flex items-center justify-center rounded-lg text-2xl ${iconBgClass}`}>
                {icon}
            </div>
            {/* Main Value */}
            <p className="text-4xl font-bold text-gray-900 pt-2">{value}</p>
            {/* Title */}
            <p className="text-lg text-gray-700 font-semibold">{title}</p>
            {/* Subtitle */}
            <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
    );
}

// 2. Quick Action Item Component
const QuickActionItem = ({ text, IconComponent, inactiveColor }) => (
    <div className="flex justify-between items-center p-4 rounded-lg cursor-pointer hover:bg-gray-50 transition duration-150 border-b last:border-b-0 border-gray-100">
        <span className="text-gray-700">{text}</span>
        <IconComponent className={`h-5 w-5 ${inactiveColor}`} />
    </div>
);

// 3. Career Tip Component
const CareerTip = ({ tip, bgColorClass, tipColorClass }) => (
    <div className={`p-3 rounded-lg text-sm ${bgColorClass} mb-3`}>
        <span className={`font-semibold ${tipColorClass}`}>Tip:</span> {tip}
    </div>
);

// --- Main OverviewOutlet Component ---
const OverviewOutlet = () => {
    
    const navigate = useNavigate();   
    // Icon Definitions (using simple SVG paths for Quick Actions, matching the image look)
    const DocumentIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>);
    const ExpandIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 12V3h9M3 12h9M12 21v-9h9M12 12h9" /></svg>);
    const BriefcaseIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>);

    return (
        <div className="space-y-8">
            
            {/* --- 1. The Purple Banner (Ready to advance your career?) --- */}
            <div className=" from-custom-purple bg-purple-600 text-white p-8 rounded-xl shadow-xl relative overflow-hidden">
                <div className="absolute right-5 top-1/2 transform -translate-y-1/2 opacity-20 text-white">
                    <svg className="w-20 h-20 fill-current" viewBox="0 0 24 24">
                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 18c-3.32-1.34-6-4.52-6-9V6.3l6-2.67 6 2.67V10c0 4.48-2.68 7.66-6 9z"/>
                    </svg>
                </div>
                <h2 className="text-2xl font-bold mb-1">Ready to advance your career?</h2>
                <p className="text-gray-200 mb-6">Get personalized job recommendations and improve your interview skills with AI</p>
                
                <div className="flex space-x-4">
                    <button
                    className="bg-white text-purple-700 font-semibold hover:bg-gray-100 py-2 px-6 rounded-lg transition shadow-md"
                    onClick={() => navigate("/profile")}
                    >
                    Enhance profile
                    </button>
                    <button onClick={() => navigate("/overview/job-match")} className="bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg hover:bg-purple-800 hover:text-custom-purple transition">
                        Explore Jobs
                    </button>
                </div>
            </div>

            {/* --- 2. The 4 Grid Cards --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* <StatCard icon="📄" value="82%" title="ATS Score" subtitle="Resume optimization" iconBgClass="bg-blue-100 text-blue-600" /> */}
                {/* <StatCard icon="💼" value="12" title="Matched Jobs" subtitle="Based on your profile" iconBgClass="bg-purple-100 text-purple-600" /> */}
                {/* <StatCard icon="🎯" value="5" title="Skills to Learn" subtitle="Close the gap" iconBgClass="bg-indigo-100 text-indigo-600" /> */}
                {/* <StatCard icon="✅" value="0" title="Mock Interviews" subtitle="Completed sessions" iconBgClass="bg-green-100 text-green-600" /> */}
            </div>
            
            {/* --- 3. Quick Actions & Career Tips (Two-Column Layout) --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* --- Quick Actions Card --- */}
                {/* <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">Quick Actions</h3>
                    <div className="divide-y divide-gray-100">
                        <QuickActionItem  text="Analyze Resume" IconComponent={DocumentIcon} inactiveColor="text-gray-400" />
                        <QuickActionItem text="Start Interview Preperation" IconComponent={ExpandIcon} inactiveColor="text-gray-400" />
                        <QuickActionItem text="Find Jobs" IconComponent={BriefcaseIcon} inactiveColor="text-gray-400" />
                    </div>
                </div> */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
  <h3 className="text-xl font-semibold mb-4 text-gray-800">Quick Actions</h3>

  <div className="divide-y divide-gray-100">

    {/* 1: Analyze Resume */}
    <button 
      onClick={() => navigate("/overview/resume-analysis")} 
      className="w-full text-left"
    >
      <QuickActionItem text="Analyze Resume" IconComponent={DocumentIcon} />
    </button>

    {/* 2: Start Interview Preparation */}
    <button 
      onClick={() => navigate("/overview/interview-prep")}
      className="w-full text-left"
    >
      <QuickActionItem text="Start Interview Preparation" IconComponent={ExpandIcon} />
    </button>

    {/* 3: Find Jobs */}
    <button 
      onClick={() => navigate("/overview/job-match")}
      className="w-full text-left"
    >
      <QuickActionItem text="Find Jobs" IconComponent={BriefcaseIcon} />
    </button>

  </div>
</div>


                {/* --- Career Tips Card --- */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">Career Tips</h3>
                    <div className="space-y-3">
                        <CareerTip 
                            tip="Keep your resume under 2 pages for better ATS scores" 
                            bgColorClass="bg-blue-50" 
                            tipColorClass="text-blue-600" 
                        />
                        <CareerTip 
                            tip="Practice behavioral questions for better interview performance" 
                            bgColorClass="bg-purple-50" 
                            tipColorClass="text-purple-600" 
                        />
                        <CareerTip 
                            tip="Update your skills regularly to match industry trends" 
                            bgColorClass="bg-indigo-50" 
                            tipColorClass="text-indigo-600" 
                        />
                    </div>
                </div>
                
            </div>
            
        </div>
    );
};

export default OverviewOutlet;