import React from 'react';
import { useNavigate } from 'react-router-dom';

const certificates = [
  {
    id: 1,
    title: 'Web Development — 30-Day Internship',
    issued: 'Jan 15, 2025',
    id_code: 'CW-2025-00312',
    score: 89,
    track: 'Web Development',
    verified: true,
    blockchain: true,
  }
];

const inProgress = [
  {
    id: 2,
    title: 'Web Dev — 15-Day Internship',
    progress: 6,
    total: 15,
    avg_score: 89,
    on_track: true,
  }
];

export default function InternshipCertificates() {
  const navigate = useNavigate();

  return (
    <div className="space-y-5">

      {/* MY CERTIFICATES */}
      <div className="bg-[var(--bg-sidebar)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-sm">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[var(--border-color)]">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#16a34a] shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" />
          </svg>
          <span className="text-sm font-semibold text-[var(--text-main)]">My Certificates</span>
        </div>

        <div className="p-5 space-y-3">
          {certificates.map(cert => (
            <div key={cert.id} className="flex items-center gap-4 p-4 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/20">
              {/* ICON */}
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#16a34a]" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                </svg>
              </div>

              {/* INFO */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-[var(--text-main)] leading-snug">{cert.title}</div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                  <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
                    Issued {cert.issued}
                  </span>
                  {cert.blockchain && (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" /></svg>
                      Blockchain verified
                    </span>
                  )}
                  <span className="text-xs text-slate-400 dark:text-slate-500">ID: {cert.id_code}</span>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                    Download PDF
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" /></svg>
                    Share
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                    Verify
                  </button>
                </div>
              </div>

              {/* SCORE */}
              <div className="text-right shrink-0">
                <div className="text-3xl font-extrabold text-[#16a34a] leading-none">{cert.score}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">out of 100</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* IN PROGRESS */}
      <div className="bg-[var(--bg-sidebar)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-sm">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[var(--border-color)]">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <span className="text-sm font-semibold text-[var(--text-main)]">In progress</span>
        </div>

        <div className="p-5 space-y-3">
          {inProgress.map(item => (
            <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl border border-[var(--border-color)] bg-slate-50/50 dark:bg-white/[0.01]">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-[var(--text-main)]">{item.title}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {item.progress} / {item.total} tasks done · Avg score {item.avg_score} · On track for certificate
                </div>
                {/* PROGRESS BAR */}
                <div className="mt-2.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden w-full max-w-[180px]">
                  <div
                    className="h-full rounded-full bg-[#16a34a] transition-all"
                    style={{ width: `${(item.progress / item.total) * 100}%` }}
                  />
                </div>
              </div>
              <button
                onClick={() => navigate('/internship')}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-[#16a34a] hover:bg-emerald-600 text-white transition shadow-sm shrink-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                Continue
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
