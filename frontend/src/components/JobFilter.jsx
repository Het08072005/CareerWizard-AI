
  



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



