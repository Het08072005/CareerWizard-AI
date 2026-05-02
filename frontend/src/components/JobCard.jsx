import React from 'react';
import { BriefcaseIcon, CheckIcon } from './ui/Icons';
import { motion } from 'framer-motion';

const SkillTag = ({ skill }) => (
  <span className="inline-flex items-center rounded-lg bg-white/[0.03] px-3 py-1 text-[11px] font-medium text-slate-400 border border-white/5 mr-2 mb-2 transition-all duration-500 hover:border-white/20 hover:text-white">
    {skill}
  </span>
);

const JobCard = ({ job }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const description = job.description || "";
  const isLongDescription = description.length > 150;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group relative bg-[#080808] border border-white/5 rounded-2xl p-6 transition-all duration-700 hover:border-white/20 overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-[1px] bg-white/5 group-hover:bg-cyan-500/20 transition-all duration-700" />
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      <div className="flex flex-col lg:flex-row gap-8 items-start relative z-10">
        <div className="w-16 h-16 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center shrink-0 group-hover:border-cyan-500/20 transition-all duration-700">
          <BriefcaseIcon size={24} className="text-slate-500 group-hover:text-cyan-400 transition-colors duration-700" />
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-2xl font-bold text-white tracking-tight">{job.title}</h3>
                {job.match !== null && (
                  <div className={`px-2.5 py-1 rounded-md border font-bold text-[14px] transition-all duration-700 shrink-0 ${job.match >= 90 ? 'bg-[#00ff9d]/10 border-[#00ff9d]/50 text-[#00ff9d] shadow-[0_0_20px_rgba(0,255,157,0.2)]' :
                      job.match >= 75 ? 'bg-[#00e68a]/10 border-[#00e68a]/50 text-[#00e68a]' :
                         'bg-[#00cc7a]/10 border-[#00cc7a]/50 text-[#00cc7a]'
                    }`}>
                    {job.match}% Match
                  </div>
                )}
              </div>
              <p className="text-[14px] font-bold text-cyan-400">{job.company}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 text-[12px] font-medium text-slate-400">
            <span className="flex items-center gap-2 transition-colors hover:text-slate-200">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/40" /> {job.location}
            </span>
            <span className="flex items-center gap-2 transition-colors hover:text-slate-200">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/40" /> {job.salary}
            </span>
            <span className="flex items-center gap-2 transition-colors hover:text-slate-200">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/40" /> {job.type}
            </span>
          </div>

          <div className="relative group/desc">
            <p className={`text-[14px] text-slate-300 font-medium leading-relaxed max-w-4xl transition-all duration-700 ${isExpanded ? '' : 'line-clamp-2'}`}>
              {description}
            </p>
            {isLongDescription && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 text-[11px] font-bold text-cyan-500/80 hover:text-cyan-400 transition-colors duration-500 flex items-center"
              >
                {isExpanded ? 'Show Less [-]' : 'Read More [+]'}
              </button>
            )}
          </div>

          <div className="flex flex-wrap pt-2">
            {(job.requiredSkills || []).map((skill, i) => <SkillTag key={i} skill={skill} />)}
          </div>
        </div>

        <a 
          href={job.apply_link || "#"} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full lg:w-auto px-8 h-11 bg-white text-black text-[14px] font-bold rounded-xl hover:bg-emerald-400 transition-all duration-700 shadow-2xl shrink-0 flex items-center justify-center decoration-0 no-underline"
        >
          Apply Now
        </a>
      </div>
    </motion.div>
  );
};

export default JobCard;
