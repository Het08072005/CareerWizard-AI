
// import React from 'react';

// const SkillTag = ({ skill }) => (
//   <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-200 mr-2 mb-2">
//     {skill}
//   </span>
// );

// const JobCard = ({ job }) => {
//   const matchColor = job.match >= 60 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700';

//   return (
//     <div className="bg-white p-6 rounded-xl shadow-md mb-6 border border-gray-100">
//       <div className="flex justify-between items-start">
//         <div>
//           <h3 className="text-lg font-semibold text-gray-800 mb-1 flex items-center">
//             {job.title}
//             <span className={`ml-3 text-sm font-medium px-2 py-0.5 rounded-full ${matchColor}`}>
//               {job.match}% Match
//             </span>
//           </h3>
//           <p className="text-sm text-gray-500 mb-3">{job.company}</p>
//         </div>
//         <button className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg transition duration-200">
//           Apply Now
//         </button>
//       </div>

//       {/* Metadata */}
//       <div className="flex flex-wrap items-center text-sm text-gray-600 space-x-4 mb-4 border-b border-gray-100 pb-3">
//         <span>{job.location}</span>
//         <span>{job.salary}</span>
//         <span>{job.type}</span>
//         <span>{job.posted}</span>
//       </div>

//       {/* Description */}
//       <p className="text-gray-700 mb-4">{job.description}</p>

//       {/* Skills */}
//       <div className="pt-2">
//         <p className="text-sm font-medium text-gray-700 mb-2">Required Skills:</p>
//         <div className="flex flex-wrap">
//           {job.requiredSkills.map((skill, i) => <SkillTag key={i} skill={skill} />)}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default JobCard;









import React from 'react';

const SkillTag = ({ skill }) => (
  <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-200 mr-2 mb-2">
    {skill}
  </span>
);

const JobCard = ({ job }) => {
  const matchColor = job.match >= 60 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700';

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-6 border border-gray-100">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1 flex items-center">
            {job.title}

            {/* Only show match score if resume uploaded */}
            {job.match !== null && (
              <span className={`ml-3 text-sm font-medium px-2 py-0.5 rounded-full ${matchColor}`}>
                {job.match}% Match
              </span>
            )}
          </h3>

          <p className="text-sm text-gray-500 mb-3">{job.company}</p>
        </div>

        <button className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg">
          Apply Now
        </button>
      </div>

      {/* Metadata */}
      <div className="flex flex-wrap items-center text-sm text-gray-600 space-x-4 mb-4 border-b border-gray-100 pb-3">
        <span>{job.location}</span>
        <span>{job.salary}</span>
        <span>{job.type}</span>
        <span>{job.posted}</span>
      </div>

      <p className="text-gray-700 mb-4">{job.description}</p>

      <div className="pt-2">
        <p className="text-sm font-medium text-gray-700 mb-2">Required Skills:</p>
        <div className="flex flex-wrap">
          {job.requiredSkills.map((skill, i) => <SkillTag key={i} skill={skill} />)}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
