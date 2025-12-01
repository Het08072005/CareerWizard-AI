// import React, { useState } from 'react';

// const JobFilter = ({ filters, onFilterChange }) => {
//   const jobTypes = ['All', 'Full-time', 'Part-time', 'Contract', 'Remote'];
//   const popularSkills = ['JavaScript', 'Python', 'React', 'Node.js', 'AWS', 'Docker', 'SQL', 'TypeScript', 'Machine Learning', 'DevOps'];

// //   const [resumeFile, setResumeFile] = useState(null);

//   const handleJobTypeChange = (type) => {
//     onFilterChange('jobType', type);
//   };

//   const handleSkillChange = (skill) => {
//     const currentSkills = filters.skills;
//     const newSkills = currentSkills.includes(skill)
//       ? currentSkills.filter(s => s !== skill)
//       : [...currentSkills, skill];
//     onFilterChange('skills', newSkills);
//   };

// //   const handleResumeUpload = (e) => {
// //     const file = e.target.files[0];
// //     setResumeFile(file);
// //     // Send resume file info back to parent component
// //     onFilterChange('resume', file);
// //   };

//   return (
//     <div className="bg-white p-6 rounded-xl shadow-md mb-8">
//       <h2 className="text-xl font-semibold text-gray-800 mb-4">AI-Powered Job Matching</h2>

//       {/* Search Bar */}
//       <div className="mb-6 relative">
//         <input
//           type="text"
//           placeholder="Search jobs by title or company..."
//           className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
//           value={filters.search}
//           onChange={(e) => onFilterChange('search', e.target.value)}
//         />
//         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//           <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//         </svg>
//       </div>

//       {/* Job Type */}
//       <div className="mb-6">
//         <p className="font-medium text-gray-700 mb-3">Job Type</p>
//         <div className="flex flex-wrap gap-2">
//           {jobTypes.map(type => (
//             <button
//               key={type}
//               onClick={() => handleJobTypeChange(type)}
//               className={`px-4 py-2 text-sm rounded-lg font-medium border-2 transition duration-150 ${
//                 filters.jobType === type ? 'border-green-400' : 'border-gray-300'
//               }`}
//             >
//               {type}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Skills */}
//       <div className="mb-6">
//         <p className="font-medium text-gray-700 mb-3">Filter by Skills</p>
//         <div className="flex flex-wrap gap-2">
//           {popularSkills.map(skill => (
//             <button
//               key={skill}
//               onClick={() => handleSkillChange(skill)}
//               className={`px-4 py-2 text-sm rounded-lg font-medium border-2 transition duration-150 ${
//                 filters.skills.includes(skill) ? 'border-green-400 bg-green-50' : 'border-gray-300'
//               }`}
//             >
//               {skill}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Resume Upload
//       <div>
//         <p className="font-medium text-gray-700 mb-2">Upload Resume (PDF/DOCX)</p>
//         <input
//           type="file"
//           accept=".pdf,.doc,.docx"
//           onChange={handleResumeUpload}
//           className="border border-gray-300 rounded-lg p-2 w-full"
//         />
//         {resumeFile && (
//           <p className="mt-2 text-sm text-gray-600">
//             Uploaded: <span className="font-medium">{resumeFile.name}</span>
//           </p>
//         )}
//       </div> */}
//     </div>
//   );
// };

// export default JobFilter;




  



import React from 'react';

const JobFilter = ({ filters, onFilterChange }) => {
  const jobTypes = ['All', 'Full-time', 'Part-time', 'Contract', 'Remote'];
  const popularSkills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'AWS', 
    'Docker', 'SQL', 'TypeScript', 'Machine Learning', 'DevOps'
  ];

  const handleJobTypeChange = (type) => {
    onFilterChange('jobType', type);
  };

  const handleSkillChange = (skill) => {
    const currentSkills = filters.skills;
    const newSkills = currentSkills.includes(skill)
      ? currentSkills.filter(s => s !== skill)
      : [...currentSkills, skill];
    onFilterChange('skills', newSkills);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">AI-Powered Job Matching</h2>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <input
          type="text"
          placeholder="Search jobs by title or company..."
          className="w-full p-3 pl-10 border border-gray-300 rounded-lg"
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
        />
      </div>

      {/* Job Type */}
      <div className="mb-6">
        <p className="font-medium text-gray-700 mb-3">Job Type</p>
        <div className="flex flex-wrap gap-2">
          {jobTypes.map(type => (
            <button
              key={type}
              onClick={() => handleJobTypeChange(type)}
              className={`px-4 py-2 text-sm rounded-lg font-medium border-2 ${
                filters.jobType === type ? 'border-green-400' : 'border-gray-300'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="mb-6">
        <p className="font-medium text-gray-700 mb-3">Filter by Skills</p>
        <div className="flex flex-wrap gap-2">
          {popularSkills.map(skill => (
            <button
              key={skill}
              onClick={() => handleSkillChange(skill)}
              className={`px-4 py-2 text-sm rounded-lg font-medium border-2 ${
                filters.skills.includes(skill) ? 'border-green-400 bg-green-50' : 'border-gray-300'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobFilter;



