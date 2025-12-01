import React from 'react';
// Assuming you would pass job data as props in a real application
// export default function Job({ jobData }) { ... }

const Job = () => {
    // Mock Data to demonstrate the layout
    const mockJob = {
        title: "Senior AI/ML Backend Engineer",
        company: "AI Tech Solutions",
        location: "Remote / Bengaluru, India",
        type: "Full-Time",
        salary: "₹25 - ₹40 LPA",
        description: `Join our innovative team to build and scale high-performance machine learning infrastructure. You will be responsible for designing, developing, and deploying scalable backend services that power our core AI job matching platform. This role requires strong proficiency in Python, cloud technologies, and experience with large-scale data processing.`,
        requirements: [
            "5+ years of experience in backend development (Python/Node.js).",
            "Expertise in cloud platforms (AWS, Azure, or GCP) and containerization (Docker/Kubernetes).",
            "Strong command of relational and NoSQL databases (PostgreSQL, MongoDB).",
            "Experience with ML frameworks (TensorFlow, PyTorch) and MLOps practices.",
            "Excellent communication skills and ability to work in an agile environment."
        ],
        benefits: [
            "Competitive salary and performance bonuses.",
            "Flexible working hours and fully remote setup.",
            "Health, dental, and vision insurance.",
            "Generous professional development stipend.",
            "Annual company retreat to exotic locations."
        ]
    };

    const FeaturePill = ({ text, colorClass }) => (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${colorClass} mr-2 mb-2`}>
            {text}
        </span>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-4xl mx-auto px-4">
                
                {/* Back Button (Interactive Element) */}
                <button 
                    onClick={() => window.history.back()}
                    className="flex items-center text-violet-600 hover:text-violet-800 mb-6 transition duration-150"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back to Jobs
                </button>

                {/* Job Detail Card */}
                <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-100">
                    
                    {/* 1. Job Header and Action Button */}
                    <div className="flex justify-between items-start border-b pb-6 mb-6">
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                                {mockJob.title}
                            </h1>
                            <h2 className="text-xl font-semibold text-violet-600 mb-3">
                                {mockJob.company}
                            </h2>
                            
                            {/* Metadata Pills */}
                            <div className="flex flex-wrap items-center space-x-4 text-sm text-gray-500">
                                <span className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    {mockJob.location}
                                </span>
                                
                                <span className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c1.657 0 3 .895 3 2s-1.343 2-3 2h-1v-2h1c1.657 0 3-.895 3-2s-1.343-2-3-2zM4 16h16M4 4h16v16H4V4z" /></svg>
                                    {mockJob.salary}
                                </span>

                                <span className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    {mockJob.type}
                                </span>
                            </div>
                        </div>
                        
                        {/* Apply Button */}
                        <a 
                            href="#" // Replace with actual application link
                            className="bg-violet-600 text-white font-semibold py-3 px-6 rounded-lg 
                                       hover:bg-violet-700 transition duration-300 shadow-md whitespace-nowrap"
                        >
                            Apply Now
                        </a>
                    </div>
                    
                    {/* 2. Job Description */}
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold text-gray-800 mb-3 border-b border-violet-100 pb-2">
                            Job Description
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                            {mockJob.description}
                        </p>
                    </div>

                    {/* 3. Key Requirements */}
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold text-gray-800 mb-3 border-b border-violet-100 pb-2">
                            Key Requirements
                        </h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            {mockJob.requirements.map((req, index) => (
                                <li key={index} className="flex items-start">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-violet-500  mt-0.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                    <span className="flex-1">{req}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    {/* 4. Benefits */}
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-3 border-b border-violet-100 pb-2">
                            What We Offer
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {mockJob.benefits.map((benefit, index) => (
                                <div key={index} className="flex items-start text-gray-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-teal-500  mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    {benefit}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Related Skills Section (Optional but good for AI Career Platform) */}
                <div className="mt-8">
                    <h3 className="text-xl font-semibold text-gray-700 mb-3">Key Technologies</h3>
                    <div className="flex flex-wrap">
                        <FeaturePill text="Python" colorClass="bg-indigo-100 text-indigo-700"/>
                        <FeaturePill text="Kubernetes" colorClass="bg-indigo-100 text-indigo-700"/>
                        <FeaturePill text="PostgreSQL" colorClass="bg-indigo-100 text-indigo-700"/>
                        <FeaturePill text="TensorFlow" colorClass="bg-pink-100 text-pink-700"/>
                        <FeaturePill text="AWS" colorClass="bg-yellow-100 text-yellow-700"/>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Job;