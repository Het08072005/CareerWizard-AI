import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import './CertificateView.css';

export default function CertificateView() {
  const { certificateId } = useParams();
  const location = useLocation();

  const storedCertificate = (() => {
    try {
      return certificateId ? JSON.parse(localStorage.getItem(`certificate:${certificateId}`) || 'null') : null;
    } catch {
      return null;
    }
  })();

  const initialCertificate = location.state?.certificate || storedCertificate;

  const [certData, setCertData] = useState({
    name: initialCertificate?.name || 'Het Panchal',
    role: 'Full-Stack Development Track',
    days: '30',
    start: 'May 1, 2025',
    end: 'May 30, 2025',
    certid: certificateId || 'CW-2025-INT-0047',
    score: '9.2',
    tasks: '24/25',
    grade: 'A+',
    programTitle: 'Professional Internship Program',
    verified: true,
    blockchain: true,
  });

  useEffect(() => {
    if (initialCertificate) {
      setCertData((prev) => ({
        ...prev,
        ...initialCertificate,
        certid: initialCertificate.certid || certificateId || prev.certid,
      }));
    } else if (certificateId) {
      setCertData((prev) => ({
        ...prev,
        certid: certificateId,
      }));
    }
  }, [initialCertificate, certificateId]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="certificate-view-container">
      {/* INTERACTIVE TOOLBAR */}
      <div className="toolbar">
        <button className="tool-btn primary" onClick={handlePrint}>⬇ Download PDF</button>
      </div>

      {/* CERTIFICATE */}
      <div className="cert">
        {/* Frame & texture */}
        <div className="frame-outer"></div>
        <div className="frame-inner"></div>

        {/* Corner ornaments */}
        <div className="corner corner-tl">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 6 L6 30" stroke="#C4A96B" strokeWidth="1.5" fill="none" />
            <path d="M6 6 L30 6" stroke="#C4A96B" strokeWidth="1.5" fill="none" />
            <path d="M12 6 L12 24" stroke="rgba(196,169,107,0.4)" strokeWidth="0.5" fill="none" />
            <path d="M6 12 L24 12" stroke="rgba(196,169,107,0.4)" strokeWidth="0.5" fill="none" />
            <rect x="4" y="4" width="5" height="5" fill="#C4A96B" />
            <circle cx="6" cy="30" r="2.5" fill="none" stroke="#C4A96B" strokeWidth="0.75" />
            <circle cx="30" cy="6" r="2.5" fill="none" stroke="#C4A96B" strokeWidth="0.75" />
          </svg>
        </div>
        <div className="corner corner-tr">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 6 L6 30" stroke="#C4A96B" strokeWidth="1.5" fill="none" />
            <path d="M6 6 L30 6" stroke="#C4A96B" strokeWidth="1.5" fill="none" />
            <path d="M12 6 L12 24" stroke="rgba(196,169,107,0.4)" strokeWidth="0.5" fill="none" />
            <path d="M6 12 L24 12" stroke="rgba(196,169,107,0.4)" strokeWidth="0.5" fill="none" />
            <rect x="4" y="4" width="5" height="5" fill="#C4A96B" />
            <circle cx="6" cy="30" r="2.5" fill="none" stroke="#C4A96B" strokeWidth="0.75" />
            <circle cx="30" cy="6" r="2.5" fill="none" stroke="#C4A96B" strokeWidth="0.75" />
          </svg>
        </div>
        <div className="corner corner-bl">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 6 L6 30" stroke="#C4A96B" strokeWidth="1.5" fill="none" />
            <path d="M6 6 L30 6" stroke="#C4A96B" strokeWidth="1.5" fill="none" />
            <path d="M12 6 L12 24" stroke="rgba(196,169,107,0.4)" strokeWidth="0.5" fill="none" />
            <path d="M6 12 L24 12" stroke="rgba(196,169,107,0.4)" strokeWidth="0.5" fill="none" />
            <rect x="4" y="4" width="5" height="5" fill="#C4A96B" />
            <circle cx="6" cy="30" r="2.5" fill="none" stroke="#C4A96B" strokeWidth="0.75" />
            <circle cx="30" cy="6" r="2.5" fill="none" stroke="#C4A96B" strokeWidth="0.75" />
          </svg>
        </div>
        <div className="corner corner-br">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 6 L6 30" stroke="#C4A96B" strokeWidth="1.5" fill="none" />
            <path d="M6 6 L30 6" stroke="#C4A96B" strokeWidth="1.5" fill="none" />
            <path d="M12 6 L12 24" stroke="rgba(196,169,107,0.4)" strokeWidth="0.5" fill="none" />
            <path d="M6 12 L24 12" stroke="rgba(196,169,107,0.4)" strokeWidth="0.5" fill="none" />
            <rect x="4" y="4" width="5" height="5" fill="#C4A96B" />
            <circle cx="6" cy="30" r="2.5" fill="none" stroke="#C4A96B" strokeWidth="0.75" />
            <circle cx="30" cy="6" r="2.5" fill="none" stroke="#C4A96B" strokeWidth="0.75" />
          </svg>
        </div>

        {/* HEADER */}
        <div className="header">
          <div className="logo-wrap">
            <div className="logo-text">Career<em>Wizard</em></div>
            <div className="logo-sub">The AI that builds your entire career</div>
          </div>

          {/* Premium Seal Badge Header Icon */}
          <svg width="64" height="64" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E8D5A3" />
                <stop offset="50%" stopColor="#C4A96B" />
                <stop offset="100%" stopColor="#8B7355" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="42" stroke="url(#gold-grad)" strokeWidth="2" strokeDasharray="6 3" />
            <circle cx="50" cy="50" r="36" stroke="#C4A96B" strokeWidth="1" />
            <path d="M50 30 L54 44 L68 44 L56 52 L60 66 L50 58 L40 66 L44 52 L32 44 L46 44 Z" fill="url(#gold-grad)" />
            <path d="M38 72 Q 50 82 62 72 L 68 96 Q 50 88 32 96 Z" fill="rgba(196,169,107,0.15)" stroke="url(#gold-grad)" strokeWidth="1" />
          </svg>
        </div>
        <div className="gold-bar"></div>

        {/* WATERMARK */}
        <div className="watermark">CareerWizard</div>

        {/* BODY */}
        <div className="body">
          <div className="content">
            <div className="eyebrow">Certificate of Completion</div>

            <div className="cert-title-1">{certData.programTitle || 'Professional Internship'}</div>
            <div className="divider">
              <div className="dline"></div>
              <div className="ddot"></div>
              <div className="dgem"></div>
              <div className="ddot"></div>
              <div className="dline"></div>
            </div>

            <div className="presented">This is to proudly certify that</div>

            <div className="recipient">{certData.name}</div>
            <div className="recipient-role">{certData.verified ? 'Verified Intern' : 'Intern'} · {certData.role}</div>

            <div className="cert-para">
              has successfully completed the <strong>{certData.days}-Day Professional Internship Program</strong>
              {' '}at CareerWizard, demonstrating exceptional dedication, technical proficiency,
              and a commitment to excellence across all assigned projects and deliverables.
            </div>

            <div className="duration">
              <div className="dur-gem"></div>
              {certData.start} — {certData.end} &nbsp;·&nbsp; {certData.days} Days
              <div className="dur-gem"></div>
            </div>

            <div className="section-lbl">Internship Deliverables & Key Contributions</div>
            <div className="work-grid">
              <div className="work-item">
                <div className="work-title">UI/UX Development</div>
                <div className="work-desc">Designed and built responsive React components with Tailwind CSS, boosting user engagement by 28%</div>
              </div>
              <div className="work-item">
                <div className="work-title">API Integration</div>
                <div className="work-desc">Integrated RESTful APIs and data pipelines using React Query with robust error handling</div>
              </div>
              <div className="work-item">
                <div className="work-title">AI Resume Module</div>
                <div className="work-desc">Contributed to the AI resume scoring engine — keyword extraction and skill gap analysis</div>
              </div>
              <div className="work-item">
                <div className="work-title">Database Architecture</div>
                <div className="work-desc">Designed MongoDB schemas for user profiles and application tracker with query optimizations</div>
              </div>
              <div className="work-item">
                <div className="work-title">Testing & Quality</div>
                <div className="work-desc">Achieved 87% code coverage across all modules using Jest & Vitest unit and integration tests</div>
              </div>
              <div className="work-item">
                <div className="work-title">Technical Documentation</div>
                <div className="work-desc">Authored comprehensive docs reducing new contributor ramp-up time by 40%</div>
              </div>
            </div>

            <div className="score-row">
              <div className="score-card">
                <div className="score-lbl">Performance</div>
                <div className="score-val">{certData.score}</div>
                <div className="score-sub">out of 10</div>
              </div>
              <div className="score-card">
                <div className="score-lbl">Attendance</div>
                <div className="score-val">100%</div>
                <div className="score-sub">all {certData.days} days</div>
              </div>
              <div className="score-card">
                <div className="score-lbl">Tasks Completed</div>
                <div className="score-val">{certData.tasks}</div>
                <div className="score-sub">deliverables</div>
              </div>
              <div className="score-card">
                <div className="score-lbl">Final Grade</div>
                <div className="score-val">{certData.grade}</div>
                <div className="score-sub">with distinction</div>
              </div>
            </div>

            <div className="divider" style={{ margin: '2px 0 20px', maxWidth: '100%' }}>
              <div className="dline"></div>
              <div className="ddot"></div>
              <div className="dgem" style={{ width: '5px', height: '5px' }}></div>
              <div className="ddot"></div>
              <div className="dline"></div>
            </div>

            {/* SIGNATURE ROW */}
            <div className="sig-section">
              {/* Founder signature */}
              <div className="sig-block sig-block-left">
                <div className="sig-name">Het Panchal</div>
                <div className="sig-line"></div>
                <div className="sig-label">Het Panchal</div>
                <div className="sig-sub-text">Founder & CEO, CareerWizard</div>
              </div>

              {/* Compass Seal */}
              <div className="seal-wrap">
                <svg width="96" height="96" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="gold-grad-seal" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#E8D5A3" />
                      <stop offset="50%" stopColor="#C4A96B" />
                      <stop offset="100%" stopColor="#8B7355" />
                    </linearGradient>
                  </defs>
                  <circle cx="50" cy="50" r="42" stroke="url(#gold-grad-seal)" strokeWidth="2" strokeDasharray="6 3" />
                  <circle cx="50" cy="50" r="36" stroke="#C4A96B" strokeWidth="1" />
                  <path d="M50 30 L54 44 L68 44 L56 52 L60 66 L50 58 L40 66 L44 52 L32 44 L46 44 Z" fill="url(#gold-grad-seal)" />
                  <path d="M38 72 Q 50 82 62 72 L 68 96 Q 50 88 32 96 Z" fill="rgba(196,169,107,0.15)" stroke="url(#gold-grad-seal)" strokeWidth="1" />
                </svg>
              </div>

              {/* Date & ID */}
              <div className="sig-block sig-block-right">
                <div className="date-display">{certData.end}</div>
                <div className="sig-line"></div>
                <div className="sig-label">Date of Issue</div>
                <div className="sig-sub-text">ID: {certData.certid}</div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="footer-bar"></div>
        <div className="footer">
          <div className="footer-id">
            CERT ID:{' '}
            <a href={window.location.pathname} target="_blank" rel="noopener noreferrer" className="cert-link">
              {certData.certid}
              <svg className="external-link-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          </div>
          <div className="footer-brand">Career<em>Wizard</em></div>
          <div className="footer-date">careerwizard.in &nbsp;·&nbsp; Issued {certData.end}</div>
        </div>
      </div>
    </div>
  );
}
