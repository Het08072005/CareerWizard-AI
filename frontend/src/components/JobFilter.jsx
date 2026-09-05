import React, { useContext } from 'react';
import { XIcon, AdjustmentsHorizontalIcon, SearchIcon } from './ui/Icons';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { ThemeContext } from '../context/themeContextValue';

const JobFilter = ({ filters, onFilterChange, resumeSlot, onFilterOpen }) => {
  const { isDark } = useContext(ThemeContext);

  const activeFilterCount =
    filters.skills.length +
    (Array.isArray(filters.company) ? filters.company.length : 0) +
    (Array.isArray(filters.location) ? filters.location.length : 0) +
    (Array.isArray(filters.role) ? filters.role.length : 0) +
    (filters.salaryMin > 0 ? 1 : 0) +
    (filters.jobType !== 'All' ? 1 : 0);

  const removeFilter = (key, value) => {
    if (Array.isArray(filters[key])) {
      onFilterChange(key, filters[key].filter(v => v !== value));
    } else if (key === 'salaryMin') {
      onFilterChange(key, 0);
    } else if (key === 'jobType') {
      onFilterChange(key, 'All');
    }
  };

  return (
    <div className="space-y-4">
      <div className={`p-4 md:p-6 rounded-2xl relative overflow-hidden group border ${isDark ? 'bg-[var(--bg-sidebar)] border-[var(--border-color)] shadow-md' : 'bg-[#fffcf7] border-[var(--gold)]/20 shadow-[0_4px_20px_rgba(160,120,64,0.05)]'}`}>
        <div className="absolute top-0 left-0 w-full h-[1px] bg-white/5" />

        <div className="flex flex-col md:flex-row gap-4 items-center relative z-10">
          {/* Main Search Bar */}
          <div className="flex-1 w-full relative">
            <SearchIcon size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
              isDark ? 'text-slate-600 group-focus-within:text-cyan-500' : 'text-slate-400 group-focus-within:text-emerald-500'
            }`} />
            <input
              type="text"
              placeholder="Search roles or companies..."
              className={`w-full h-10 rounded-xl pl-11 pr-4 outline-none transition-all duration-700 font-medium text-[14px] border ${
                isDark
                  ? 'bg-white/[0.02] border-white/5 focus:border-cyan-500/30 text-white placeholder-slate-700'
                  : 'bg-[#fffcf7] border-[var(--gold)]/20 focus:border-[var(--gold)]/40 text-[var(--text-main)] placeholder-[var(--text-muted)] shadow-[inset_0_2px_4px_rgba(160,120,64,0.03)]'
              }`}
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
            />
            {filters.search && (
              <button
                onClick={() => onFilterChange('search', '')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-800 dark:hover:text-white transition-colors"
              >
                <XIcon size={14} />
              </button>
            )}
          </div>

          {/* Advanced Filter Button */}
          <button
            onClick={() => onFilterOpen()}
            className={`h-10 px-5 rounded-xl border transition-all duration-500 flex items-center gap-2 font-bold text-[13px] relative overflow-hidden group/btn ${
              activeFilterCount > 0
                ? isDark ? 'bg-cyan-500 text-black border-cyan-500' : 'bg-[var(--gold-dark)] text-white border-[var(--gold-dark)]'
                : isDark
                  ? 'bg-white/[0.02] border-white/5 text-slate-400 hover:border-white/20 hover:text-white'
                  : 'bg-[#fffcf7] border-[var(--gold)]/20 text-[var(--text-main)] hover:border-[var(--gold)]/40 hover:bg-[var(--gold)]/10'
            }`}
          >
            <AdjustmentsHorizontalIcon size={16} className={activeFilterCount > 0 ? 'animate-pulse' : ''} />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-black/20 px-1.5 py-0.5 rounded-full text-[9px] ml-0.5">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Resume Slot */}
          {resumeSlot && (
            <div className="w-full md:w-[240px] h-10 shrink-0">
              {resumeSlot}
            </div>
          )}
        </div>
      </div>

      {/* Active Filter Chips */}
      <AnimatePresence>
        {activeFilterCount > 0 && (
          <Motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-wrap gap-2 px-2"
          >
            {filters.skills.map(skill => (
              <FilterChip key={skill} label={skill} onRemove={() => removeFilter('skills', skill)} color={isDark ? "cyan" : "emerald"} />
            ))}
            {filters.company.map(c => (
              <FilterChip key={c} label={c} onRemove={() => removeFilter('company', c)} color={isDark ? "indigo" : "blue"} />
            ))}
            {filters.location.map(l => (
              <FilterChip key={l} label={l} onRemove={() => removeFilter('location', l)} color={isDark ? "purple" : "blue"} />
            ))}
            {filters.role && filters.role.map(r => (
              <FilterChip key={r} label={r} onRemove={() => removeFilter('role', r)} color={isDark ? "blue" : "indigo"} />
            ))}
            {filters.salaryMin > 0 && (
              <FilterChip label={`$${filters.salaryMin}K+`} onRemove={() => removeFilter('salaryMin')} color="emerald" />
            )}
            {filters.jobType !== 'All' && (
              <FilterChip label={Array.isArray(filters.jobType) ? filters.jobType.join(', ') : filters.jobType} onRemove={() => removeFilter('jobType')} color="amber" />
            )}
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FilterChip = ({ label, onRemove, color }) => {
  const colors = {
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    blue: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  };

  return (
    <Motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className={`px-3 py-1 rounded-full border ${colors[color]} flex items-center gap-2 text-[11px] font-bold tracking-tight shadow-sm`}
    >
      <span>{label}</span>
      <button onClick={onRemove} className="hover:text-black dark:hover:text-white transition-colors">
        <XIcon size={12} />
      </button>
    </Motion.div>
  );
};

export default JobFilter;
