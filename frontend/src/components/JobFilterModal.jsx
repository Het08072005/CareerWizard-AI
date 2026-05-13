import React, { useState, useMemo, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, SearchIcon, CheckIcon, BuildingOfficeIcon, MapPinIcon, CurrencyDollarIcon, BriefcaseIcon, SparklesIcon, ChevronRightIcon, AdjustmentsHorizontalIcon } from './ui/Icons';
import { ThemeContext } from '../context/ThemeContext';

const JobFilterModal = ({ isOpen, onClose, filters, onFilterChange, options }) => {
  const { isDark } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState('skills');
  const [searchTerm, setSearchTerm] = useState('');

  const tabs = [
    { id: 'role', label: 'Roles', icon: BriefcaseIcon },
    { id: 'skills', label: 'Skills', icon: SparklesIcon },
    { id: 'company', label: 'Companies', icon: BuildingOfficeIcon },
    { id: 'location', label: 'Locations', icon: MapPinIcon },
    { id: 'jobType', label: 'Job Type', icon: AdjustmentsHorizontalIcon },
    { id: 'salary', label: 'Salary Range', icon: CurrencyDollarIcon },
  ];

  const currentOptions = useMemo(() => {
    let list = options[activeTab] || [];
    if (searchTerm) {
      list = list.filter(item => item.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return list;
  }, [activeTab, options, searchTerm]);

  const toggleFilter = (key, value) => {
    if (key === 'skills') {
      const newSkills = filters.skills.includes(value)
        ? filters.skills.filter(s => s !== value)
        : [...filters.skills, value];
      onFilterChange('skills', newSkills);
    } else if (key === 'jobType') {
      const current = Array.isArray(filters.jobType) ? filters.jobType : (filters.jobType === 'All' ? [] : [filters.jobType]);
      const next = current.includes(value)
        ? current.filter(t => t !== value)
        : [...current, value];
      onFilterChange('jobType', next.length === 0 ? 'All' : next);
    } else if (key === 'company' || key === 'location' || key === 'role') {
      const current = Array.isArray(filters[key]) ? filters[key] : (filters[key] ? [filters[key]] : []);
      const next = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      onFilterChange(key, next);
    }
  };

  const handleSalaryChange = (min) => {
    onFilterChange('salaryMin', min === filters.salaryMin ? 0 : min);
  };

  const clearAll = () => {
    onFilterChange('skills', []);
    onFilterChange('jobType', 'All');
    onFilterChange('location', []);
    onFilterChange('company', []);
    onFilterChange('role', []);
    onFilterChange('salaryMin', 0);
  };

  const activeFilterCount = 
    filters.skills.length + 
    (Array.isArray(filters.company) ? filters.company.length : 0) +
    (Array.isArray(filters.location) ? filters.location.length : 0) +
    (Array.isArray(filters.role) ? filters.role.length : 0) +
    (filters.salaryMin > 0 ? 1 : 0);

  React.useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const tabColor = isDark ? 'text-cyan-400' : 'text-emerald-600';
  const tabBorderBg = isDark ? 'bg-cyan-500' : 'bg-emerald-500';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          onWheel={(e) => e.stopPropagation()}
          className="fixed inset-y-0 right-0 w-full max-w-[400px] bg-[var(--bg-sidebar)] border-l border-[var(--border-color)] shadow-2xl flex flex-col z-[9999]"
        >
          {/* Header */}
          <div className="p-4 border-b border-[var(--border-color)] bg-white/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button 
                onClick={onClose}
                className="p-1.5 hover:bg-slate-500/10 rounded-full transition-colors text-slate-400 hover:text-[var(--text-main)] mr-1"
              >
                <ChevronRightIcon size={16} />
              </button>
              <div>
                <h2 className="text-[16px] font-bold text-[var(--text-main)] tracking-tight">Advanced Filters</h2>
                <p className="text-[10px] text-[var(--text-muted)] font-medium">{activeFilterCount} active filters</p>
              </div>
            </div>
            <button 
              onClick={clearAll}
              className="text-[11px] font-black uppercase tracking-widest text-rose-500/50 hover:text-rose-500 transition-colors"
            >
              Reset
            </button>
          </div>

          {/* Sidebar Content Layout */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Navigation Tabs (Vertical for slender sidebar) */}
            <div className={`flex overflow-x-auto custom-scrollbar-hide border-b shrink-0 ${
              isDark ? 'border-white/5 bg-white/[0.01]' : 'border-slate-200 bg-slate-50'
            }`}>
              <div className="flex flex-row w-full no-scrollbar">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setSearchTerm('');
                    }}
                    className={`flex-1 min-w-0 py-2.5 flex flex-col items-center gap-1.5 transition-all duration-300 relative group ${
                      activeTab === tab.id ? tabColor : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    <tab.icon size={15} className={activeTab === tab.id ? tabColor : 'group-hover:text-slate-400'} />
                    <span className="text-[7.5px] font-black uppercase tracking-tight text-center">{tab.label}</span>
                    {activeTab === tab.id && (
                      <motion.div layoutId="activeTabSidebar" className={`absolute bottom-0 left-0 right-0 h-[2px] ${tabBorderBg}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 flex flex-col min-h-0">
              {/* Search Input for options */}
              {activeTab !== 'salary' && activeTab !== 'jobType' && (
                <div className={`p-4 border-b ${isDark ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="relative">
                    <SearchIcon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                    <input
                      type="text"
                      placeholder={`Search ${activeTab}...`}
                      className={`w-full h-10 rounded-xl pl-12 pr-4 outline-none transition-all duration-500 text-[13px] border ${
                        isDark
                          ? 'bg-white/[0.03] border-white/5 focus:border-cyan-500/30 text-white placeholder-slate-700'
                          : 'bg-white border-slate-200 focus:border-emerald-500/30 text-slate-800 placeholder-slate-400'
                      }`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Options List */}
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar overscroll-contain" onScroll={(e) => e.stopPropagation()}>
                {activeTab === 'salary' ? (
                  <div className="space-y-2">
                    {[
                      { label: 'All Salaries', val: 0 },
                      { label: '$100K+', val: 100 },
                      { label: '$140K+', val: 140 },
                      { label: '$180K+', val: 180 },
                      { label: '$220K+', val: 220 },
                      { label: '$250K+', val: 250 },
                    ].map(s => (
                      <button
                        key={s.label}
                        onClick={() => handleSalaryChange(s.val)}
                        className={`w-full p-4 rounded-xl border transition-all duration-500 flex items-center justify-between group ${
                          filters.salaryMin === s.val 
                            ? isDark 
                              ? 'bg-cyan-500/10 border-cyan-500/50 text-white shadow-sm' 
                              : 'bg-emerald-500/10 border-emerald-500/50 text-emerald-700'
                            : isDark 
                              ? 'bg-white/[0.02] border-white/5 text-slate-400 hover:border-white/20' 
                              : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700'
                        }`}
                      >
                        <span className="font-semibold text-[13px]">{s.label}</span>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                          filters.salaryMin === s.val 
                            ? isDark ? 'bg-cyan-500 border-cyan-500' : 'bg-emerald-500 border-emerald-500' 
                            : isDark ? 'border-white/10 group-hover:border-white/30' : 'border-slate-300 group-hover:border-slate-400'
                        }`}>
                          {filters.salaryMin === s.val && <CheckIcon size={10} className={isDark ? 'text-black' : 'text-white'} />}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {currentOptions.map(option => {
                      let isChecked = false;
                      if (activeTab === 'skills') isChecked = filters.skills.includes(option);
                      else if (activeTab === 'jobType') {
                        isChecked = Array.isArray(filters.jobType) ? filters.jobType.includes(option) : filters.jobType === option;
                      } else {
                        const currentVal = filters[activeTab];
                        isChecked = Array.isArray(currentVal) ? currentVal.includes(option) : currentVal === option;
                      }

                      return (
                        <button
                          key={option}
                          onClick={() => toggleFilter(activeTab, option)}
                          className={`w-full p-3 rounded-lg border transition-all duration-500 flex items-center gap-3 text-left group ${
                            isChecked 
                              ? isDark 
                                ? 'bg-white/[0.05] border-white/20 text-white' 
                                : 'bg-slate-100 border-slate-300 text-slate-900'
                              : isDark 
                                ? 'bg-white/[0.01] border-white/5 text-slate-500 hover:border-white/10 hover:text-slate-300' 
                                : 'bg-transparent border-slate-100 text-slate-500 hover:border-slate-200 hover:text-slate-800'
                          }`}
                        >
                          <div className={`w-4 h-4 shrink-0 rounded border flex items-center justify-center transition-all ${
                            isChecked 
                              ? isDark ? 'bg-cyan-500 border-cyan-500' : 'bg-emerald-500 border-emerald-500' 
                              : isDark ? 'border-white/10 group-hover:border-white/30' : 'border-slate-300 group-hover:border-slate-400'
                          }`}>
                            {isChecked && <CheckIcon size={10} className={isDark ? 'text-black' : 'text-white'} />}
                          </div>
                          <span className="text-[13px] font-medium truncate">{option}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className={`p-4 border-t mt-auto shrink-0 grid grid-cols-2 gap-3 ${
              isDark ? 'border-white/5 bg-white/[0.02]' : 'border-slate-200 bg-slate-50'
            }`}>
              <button
                onClick={onClose}
                className={`h-10 text-[12px] font-bold rounded-xl transition-all duration-500 border ${
                  isDark
                    ? 'bg-white/[0.05] hover:bg-white/10 text-white border-white/5'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                Close
              </button>
              <button
                onClick={onClose}
                className={`h-10 text-[12px] font-bold rounded-xl transition-all duration-500 shadow-sm ${
                  isDark
                    ? 'bg-cyan-500 hover:bg-cyan-400 text-black'
                    : 'bg-[#16a34a] hover:bg-[#15803d] text-white'
                }`}
              >
                Apply
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default JobFilterModal;
