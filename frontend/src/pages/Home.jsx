import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css';

const createParticle = (canvas, context) => {
  const particle = {
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.4 + 0.1;
      this.color = Math.random() > 0.5 ? '201,169,110' : '140,127,110';
    },
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    },
    draw() {
      context.beginPath();
      context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      context.fillStyle = `rgba(${this.color},${this.opacity})`;
      context.fill();
    },
  };
  particle.reset();
  return particle;
};

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    // Loader timeout
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 60);

      // Scroll progress
      const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      setScrollProgress(scrolled);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animation and interaction logic
  useEffect(() => {
    const dot = document.getElementById('cursor-dot');
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;

    // Original Precise Trail Logic
    const trailCanvas = document.getElementById('trail-canvas');
    let trailCtx;
    let trailFrameId;
    let trailPath = [];
    const maxAge = 35; // Frames before point vanishes (faster fade)

    const handleMouseMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (dot) {
        dot.style.left = mx + 'px';
        dot.style.top = my + 'px';
      }
      // Add exact point to trail directly under mouse
      trailPath.push({ x: mx, y: my, age: 0 });
    };

    document.addEventListener('mousemove', handleMouseMove);

    if (trailCanvas) {
      trailCtx = trailCanvas.getContext('2d');
      const resizeTrail = () => {
        trailCanvas.width = window.innerWidth;
        trailCanvas.height = window.innerHeight;
      };
      resizeTrail();
      window.addEventListener('resize', resizeTrail);

      const animateTrail = () => {
        trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);

        // Age points
        for (let i = 0; i < trailPath.length; i++) {
          trailPath[i].age += 1;
        }
        
        // Remove dead points
        trailPath = trailPath.filter(p => p.age < maxAge);

        // Draw exact path using High-Level Catmull-Rom Cubic Splines
        if (trailPath.length > 2) {
          trailCtx.globalCompositeOperation = 'source-over';
          trailCtx.lineCap = 'round';
          trailCtx.lineJoin = 'round';
          trailCtx.shadowBlur = 0; 
          trailCtx.shadowColor = 'transparent'; 

          // Pad array for Catmull-Rom boundaries (requires 4 points per curve)
          const pts = [trailPath[0], ...trailPath, trailPath[trailPath.length - 1]];

          for (let i = 1; i < pts.length - 2; i++) {
            const p0 = pts[i - 1];
            const p1 = pts[i];
            const p2 = pts[i + 1];
            const p3 = pts[i + 2];
            
            // Age calculation based on the actual point
            const life = Math.max(0, 1 - (p1.age / maxAge)); 
            const organicLife = Math.pow(life, 0.5); 

            // High-Level Catmull-Rom to Cubic Bezier Formula
            // This guarantees the curve passes exactly through the mouse coordinates
            // creating mathematically perfect circles and infinite loops.
            const tension = 0.5; // Optimal tension for exact path following
            
            const cp1x = p1.x + (p2.x - p0.x) * tension / 3;
            const cp1y = p1.y + (p2.y - p0.y) * tension / 3;
            const cp2x = p2.x - (p3.x - p1.x) * tension / 3;
            const cp2y = p2.y - (p3.y - p1.y) * tension / 3;

            trailCtx.beginPath();
            trailCtx.moveTo(p1.x, p1.y);
            trailCtx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
            
            // Light Gold
            trailCtx.strokeStyle = `rgba(215, 185, 125, ${organicLife * 0.85})`; 
            
            // Extremely smooth precise width
            trailCtx.lineWidth = 1.8 * organicLife; 
            trailCtx.stroke();
          }
        }
        trailFrameId = requestAnimationFrame(animateTrail);
      };
      animateTrail();
    }

    const addHover = () => document.body.classList.add('cursor-hover');
    const removeHover = () => document.body.classList.remove('cursor-hover');
    const interactables = document.querySelectorAll('a, button, .feature-card, .intern-card, .roadmap-card, .pricing-card, .testimonial-card, .interview-feature, .company-logo-item, .dash-nav-item, .filter-pill, .dash-tab');

    interactables.forEach(el => {
      el.addEventListener('mouseenter', addHover);
      el.addEventListener('mouseleave', removeHover);
    });

    const addClick = () => document.body.classList.add('cursor-click');
    const removeClick = () => document.body.classList.remove('cursor-click');
    document.addEventListener('mousedown', addClick);
    document.addEventListener('mouseup', removeClick);

    // Particles
    const canvas = document.getElementById('particles-canvas');
    let ctx;
    let particles = [];
    let particlesFrameId;

    if (canvas) {
      ctx = canvas.getContext('2d');
      const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      for (let i = 0; i < 90; i++) particles.push(createParticle(canvas, ctx));

      const animateParticles = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        particles.forEach((p, i) => {
          particles.slice(i + 1).forEach(p2 => {
            const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
            if (dist < 100) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(201,169,110,${0.06 * (1 - dist / 100)})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          });
        });
        particlesFrameId = requestAnimationFrame(animateParticles);
      };
      animateParticles();
    }

    // Scroll Reveal
    const revealEls = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => revealObserver.observe(el));

    // ATS Animation
    const atsSection = document.getElementById('ats-section');
    const atsRing = document.getElementById('ats-ring-circle');
    const atsMetricFills = document.querySelectorAll('.ats-metric-fill');
    let atsAnimated = false;
    let atsInterval;

    const atsObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && !atsAnimated) {
          atsAnimated = true;
          if (atsRing) atsRing.classList.add('animated');
          atsMetricFills.forEach(f => f.classList.add('animated'));
          let start = 0;
          atsInterval = setInterval(() => {
            start++;
            const el = document.getElementById('ats-score-num');
            if (el) el.textContent = start;
            if (start >= 78) clearInterval(atsInterval);
          }, 25);
        }
      });
    }, { threshold: 0.4 });
    if (atsSection) atsObserver.observe(atsSection);

    // Stat Counters
    const animateCount = (el, target, suffix = '') => {
      let current = 0;
      const step = target / 80;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        const display = target >= 1000 ? Math.floor(current).toLocaleString('en-IN') : Math.floor(current);
        el.textContent = display + suffix;
      }, 20);
    };

    const statEls = document.querySelectorAll('.stat-num[data-target]');
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const target = parseInt(e.target.dataset.target);
          const suffix = target === 98 ? '%' : (target >= 300 ? '+' : '');
          animateCount(e.target, target, suffix);
          statObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    statEls.forEach(el => statObserver.observe(el));

    // Mouse Parallax for Cards
    const cards = document.querySelectorAll('.feature-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mx', x + '%');
        card.style.setProperty('--my', y + '%');
      });
    });

    // Magnetic Buttons
    const magBtns = document.querySelectorAll('.btn-primary, .btn-secondary, .nav-cta');
    magBtns.forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height / 2);
        btn.style.transform = `translate(${dx * 0.2}px, ${dy * 0.2}px) translateY(-3px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
      });
    });

    // Parallax Orbs
    const handleOrbScroll = () => {
      const scrollY = window.scrollY;
      document.querySelectorAll('.hero-bg-orb').forEach((orb, i) => {
        const speed = [0.3, 0.2, 0.15][i] || 0.1;
        orb.style.transform = `translateY(${scrollY * speed}px)`;
      });
    };
    window.addEventListener('scroll', handleOrbScroll);

    // Hero title styling
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
      heroTitle.style.backgroundImage = 'linear-gradient(135deg, var(--ink) 0%, var(--ink) 70%, var(--gold) 100%)';
      heroTitle.style.webkitBackgroundClip = 'text';
    }

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (trailFrameId) cancelAnimationFrame(trailFrameId);
      interactables.forEach(el => {
        el.removeEventListener('mouseenter', addHover);
        el.removeEventListener('mouseleave', removeHover);
      });
      document.removeEventListener('mousedown', addClick);
      document.removeEventListener('mouseup', removeClick);
      if (particlesFrameId) cancelAnimationFrame(particlesFrameId);
      revealObserver.disconnect();
      atsObserver.disconnect();
      if (atsInterval) clearInterval(atsInterval);
      statObserver.disconnect();
      window.removeEventListener('scroll', handleOrbScroll);
    };
  }, [isLoaded]);

  // Tab state
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [activeFilter, setActiveFilter] = useState('All Domains');

  return (
    <div className="home-container">
      {/* Scroll Progress Indicator */}
      <div
        style={{
          position: 'fixed', top: 0, left: 0, height: '2px',
          background: 'linear-gradient(90deg, var(--gold-dark), var(--gold))',
          zIndex: 9999, width: `${scrollProgress}%`, transition: 'width 0.1s linear',
          pointerEvents: 'none'
        }}
      />

      {/* TRAIL CANVAS */}
      <canvas id="trail-canvas" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9998 }}></canvas>

      {/* CURSOR */}
      <div id="cursor-dot"></div>

      {/* LOADER */}
      <div id="loader" className={isLoaded ? 'out' : ''}>
        <div className="loader-logo" style={{ position: 'relative', display: 'inline-block' }}>
          CareerWizard
          <span style={{
            position: 'absolute',
            right: '-1.5rem',
            top: '0rem',
            fontSize: '0.3em',
            fontWeight: 900,
            fontStyle: 'normal',
            letterSpacing: '0.1em',
            color: 'var(--gold-dark)'
          }}>AI</span>
        </div>
        <div className="loader-bar-wrap"><div className="loader-bar"></div></div>
        <div className="loader-count">Initializing Intelligence</div>
      </div>

      {/* NAV */}
      <nav id="main-nav" className={navScrolled ? 'scrolled' : ''}>
        <Link to="/" className="group flex items-center relative z-10 py-1" style={{ textDecoration: 'none' }}>
          <h1 className="cw-brand-logo-home relative" style={{ fontFamily: 'var(--font-display, "Cormorant Garamond", serif)', fontWeight: 500, fontSize: '28px', letterSpacing: '0.02em', color: 'var(--ink)', margin: 0, display: 'flex', alignItems: 'center' }}>
            Career<span className="accent" style={{ fontWeight: 500, letterSpacing: '0.02em', marginLeft: '0px', color: 'var(--gold-dark)' }}>Wizard</span>
            <div className="absolute -inset-x-4 -inset-y-1 bg-[var(--gold)]/10 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 rounded-lg"></div>
            <span className="absolute -right-3 -top-1 text-[10px] font-black tracking-widest text-[var(--gold-dark)] opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:translate-x-1">AI</span>
          </h1>
        </Link>
        <ul className="nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#internships">Internships</a></li>
          <li><a href="#interview-prep">Interview Prep</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#companies">Partners</a></li>
        </ul>
        <Link to="/signup" className="nav-cta">Get Started</Link>
        <div className="hamburger" id="hamburger">
          <span></span><span></span><span></span>
        </div>
      </nav>

      {/* HERO */}
      <section id="hero">
        <canvas id="particles-canvas"></canvas>
        <div className="hero-bg-orb orb-1"></div>
        <div className="hero-bg-orb orb-2"></div>
        <div className="hero-bg-orb orb-3"></div>
        <div className="hero-badge">
          <div className="hero-badge-dot"></div>
          Now powering 50,000+ careers across India
        </div>
        <h1 className="hero-title">
          The AI that builds<br />
          <em className="line-2">your entire career</em>
        </h1>
        <p className="hero-subtitle">
          From résumé analysis to job placement — CareerWizard AI is the only career intelligence platform that works for you at every step, with surgical precision.
        </p>
        <div className="hero-actions">
          <Link to="/signup" className="btn-primary">
            Start for Free →
          </Link>
          <Link to="/overview" className="btn-secondary">
            ◎ View Dashboard
          </Link>
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-num" data-target="50000">0</div>
            <div className="hero-stat-label">Students Placed</div>
          </div>
          <div className="stat-separator"></div>
          <div className="hero-stat">
            <div className="hero-stat-num" data-target="1000">0</div>
            <div className="hero-stat-label">Company Questions</div>
          </div>
          <div className="stat-separator"></div>
          <div className="hero-stat">
            <div className="hero-stat-num" data-target="98">0</div>
            <div className="hero-stat-label">ATS Success Rate</div>
          </div>
          <div className="stat-separator"></div>
          <div className="hero-stat">
            <div className="hero-stat-num">4.9★</div>
            <div className="hero-stat-label">User Rating</div>
          </div>
        </div>
        <div className="hero-scroll-cue">
          <div className="scroll-line"></div>
          <div className="scroll-text">Scroll to explore</div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-section">
        <div className="marquee-track" id="marquee">
          <div className="marquee-item">AI Resume Analysis <span>✦</span></div>
          <div className="marquee-item">ATS Score Checker <span>✦</span></div>
          <div className="marquee-item">Smart Job Finder <span>✦</span></div>
          <div className="marquee-item">Career Roadmap <span>✦</span></div>
          <div className="marquee-item">STAR Method Prep <span>✦</span></div>
          <div className="marquee-item">Internship Marketplace <span>✦</span></div>
          <div className="marquee-item">1000+ Company Questions <span>✦</span></div>
          <div className="marquee-item">Certified Courses <span>✦</span></div>
          <div className="marquee-item">Direct Hiring Pipeline <span>✦</span></div>
          <div className="marquee-item">Recruiter Dashboard <span>✦</span></div>
          <div className="marquee-item">College Partnerships <span>✦</span></div>
          <div className="marquee-item">AI Career Assistant <span>✦</span></div>
          {/* Duplicated for seamless loop */}
          <div className="marquee-item">AI Resume Analysis <span>✦</span></div>
          <div className="marquee-item">ATS Score Checker <span>✦</span></div>
          <div className="marquee-item">Smart Job Finder <span>✦</span></div>
          <div className="marquee-item">Career Roadmap <span>✦</span></div>
          <div className="marquee-item">STAR Method Prep <span>✦</span></div>
          <div className="marquee-item">Internship Marketplace <span>✦</span></div>
          <div className="marquee-item">1000+ Company Questions <span>✦</span></div>
          <div className="marquee-item">Certified Courses <span>✦</span></div>
          <div className="marquee-item">Direct Hiring Pipeline <span>✦</span></div>
          <div className="marquee-item">Recruiter Dashboard <span>✦</span></div>
          <div className="marquee-item">College Partnerships <span>✦</span></div>
          <div className="marquee-item">AI Career Assistant <span>✦</span></div>
        </div>
      </div>

      {/* FEATURES */}
      <section id="features">
        <div className="section-inner">
          <div className="features-header reveal">
            <div className="section-label">Platform Features</div>
            <h2 className="section-title">Everything your career<br /><em>could ever need</em></h2>
          </div>
          <div className="features-grid">
            <div className="feature-card reveal" data-delay="0">
              <div className="feature-icon"><i className="fa-regular fa-file-lines"></i></div>
              <div className="feature-name">AI Resume Parser</div>
              <div className="feature-desc">Upload your resume and get a complete structural analysis, keyword gaps, and industry-specific suggestions in seconds.</div>
              <div className="feature-tag">Core AI</div>
            </div>
            <div className="feature-card reveal reveal-delay-1" data-delay="100">
              <div className="feature-icon"><i className="fa-solid fa-bullseye"></i></div>
              <div className="feature-name">ATS Score Engine</div>
              <div className="feature-desc">Real-time ATS compatibility scoring against 500+ hiring systems with specific optimization recommendations.</div>
              <div className="feature-tag">Precision</div>
            </div>
            <div className="feature-card reveal reveal-delay-2" data-delay="200">
              <div className="feature-icon"><i className="fa-solid fa-magnifying-glass"></i></div>
              <div className="feature-name">AI Job Finder</div>
              <div className="feature-desc">Intelligent job matching powered by your skills, experience, and career goals — updated daily with curated listings.</div>
              <div className="feature-tag">Discovery</div>
            </div>
            <div className="feature-card reveal reveal-delay-1">
              <div className="feature-icon"><i className="fa-solid fa-route"></i></div>
              <div className="feature-name">Smart Roadmap Generator</div>
              <div className="feature-desc">Get a personalised 30/60/90-day career roadmap with milestones tailored to your target role and industry.</div>
              <div className="feature-tag">Strategy</div>
            </div>
            <div className="feature-card reveal reveal-delay-2">
              <div className="feature-icon"><i className="fa-solid fa-microphone-lines"></i></div>
              <div className="feature-name">Interview Preparation Module</div>
              <div className="feature-desc">Mock interviews, instant feedback, vocal analysis, and confidence scoring across 50+ role categories.</div>
              <div className="feature-tag">Practice</div>
            </div>
            <div className="feature-card reveal reveal-delay-3">
              <div className="feature-icon"><i className="fa-solid fa-chart-pie"></i></div>
              <div className="feature-name">Profile Scoring System</div>
              <div className="feature-desc">A holistic career profile score across skills, projects, certifications, and market alignment — always improving.</div>
              <div className="feature-tag">Analytics</div>
            </div>
            <div className="feature-card reveal">
              <div className="feature-icon"><i className="fa-regular fa-building"></i></div>
              <div className="feature-name">Company Tie-Up System</div>
              <div className="feature-desc">Direct hiring pipelines with 300+ partner companies offering exclusive referrals and fast-track interviews.</div>
              <div className="feature-tag">Network</div>
            </div>
            <div className="feature-card reveal reveal-delay-1">
              <div className="feature-icon"><i className="fa-solid fa-robot"></i></div>
              <div className="feature-name">AI Career Assistant</div>
              <div className="feature-desc">Your 24/7 career advisor. Ask anything — salary negotiation, industry shifts, skill gaps, or cover letter drafts.</div>
              <div className="feature-tag">Assistant</div>
            </div>
            <div className="feature-card reveal reveal-delay-2">
              <div className="feature-icon"><i className="fa-solid fa-arrow-trend-up"></i></div>
              <div className="feature-name">Career Growth Analytics</div>
              <div className="feature-desc">Longitudinal skill tracking, market demand forecasting, and personalised growth reports every week.</div>
              <div className="feature-tag">Insights</div>
            </div>
          </div>
        </div>
      </section>

      {/* ATS SECTION */}
      <section id="ats-section">
        <div className="section-inner">
          <div className="ats-inner">
            <div className="ats-content reveal">
              <div className="section-label">ATS Intelligence</div>
              <h2 className="section-title">Your résumé,<br /><em>decoded and perfected</em></h2>
              <p className="ats-desc">Our AI dissects every resume against actual recruiter behaviour and 500+ ATS systems — then shows you exactly what to fix to land interviews.</p>
              <div className="ats-features">
                <div className="ats-feature-item"><span className="ats-feature-icon">→</span> Real-time keyword gap analysis against job descriptions</div>
                <div className="ats-feature-item"><span className="ats-feature-icon">→</span> Formatting compliance check for 500+ ATS parsers</div>
                <div className="ats-feature-item"><span className="ats-feature-icon">→</span> One-click AI optimization suggestions</div>
                <div className="ats-feature-item"><span className="ats-feature-icon">→</span> Before/after score comparison with improvement tracking</div>
              </div>
            </div>
            <div className="ats-visual reveal reveal-delay-2">
              <div className="ats-card">
                <div className="ats-card-glow"></div>
                <div className="ats-score-display">
                  <div className="ats-score-ring">
                    <svg className="ats-ring-svg" viewBox="0 0 150 150" width="150" height="150">
                      <circle className="ats-ring-bg" cx="75" cy="75" r="65" />
                      <circle className="ats-ring-fill" id="ats-ring-circle" cx="75" cy="75" r="65" />
                    </svg>
                    <div className="ats-score-num" id="ats-score-num">0</div>
                  </div>
                  <div className="ats-score-label">Overall ATS Score</div>
                </div>
                <div className="ats-metrics">
                  <div className="ats-metric">
                    <div className="ats-metric-header"><span className="ats-metric-name">Keyword Match</span><span className="ats-metric-val">92%</span></div>
                    <div className="ats-metric-bar"><div className="ats-metric-fill" style={{ '--target-width': '92%' }}></div></div>
                  </div>
                  <div className="ats-metric">
                    <div className="ats-metric-header"><span className="ats-metric-name">Formatting</span><span className="ats-metric-val">88%</span></div>
                    <div className="ats-metric-bar"><div className="ats-metric-fill" style={{ '--target-width': '88%' }}></div></div>
                  </div>
                  <div className="ats-metric">
                    <div className="ats-metric-header"><span className="ats-metric-name">Skills Alignment</span><span className="ats-metric-val">74%</span></div>
                    <div className="ats-metric-bar"><div className="ats-metric-fill" style={{ '--target-width': '74%' }}></div></div>
                  </div>
                  <div className="ats-metric">
                    <div className="ats-metric-header"><span className="ats-metric-name">Experience Depth</span><span className="ats-metric-val">81%</span></div>
                    <div className="ats-metric-bar"><div className="ats-metric-fill" style={{ '--target-width': '81%' }}></div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section id="dashboard-preview">
        <div className="section-inner">
          <div className="dashboard-header reveal">
            <div className="section-label">Premium Dashboard</div>
            <h2 className="section-title">Your career command <em>center</em></h2>
          </div>
          <div className="dashboard-mockup reveal">
            <div className="dash-topbar">
              <div className="dash-dots">
                <div className="dash-dot"></div>
                <div className="dash-dot"></div>
                <div className="dash-dot"></div>
              </div>
              <div className="dash-tab-bar">
                {['Dashboard', 'Jobs', 'Internships', 'Interview Prep'].map(tab => (
                  <div key={tab} className={`dash-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                    {tab}
                  </div>
                ))}
              </div>
            </div>
            <div className="dash-body">
              <div className="dash-sidebar">
                <div className="dash-sidebar-section">Main</div>
                <div className="dash-nav-item active">⬡ &nbsp;Overview</div>
                <div className="dash-nav-item">◎ &nbsp;Resume AI</div>
                <div className="dash-nav-item">⌖ &nbsp;Job Finder</div>
                <div className="dash-nav-item">◈ &nbsp;Roadmap</div>
                <div className="dash-sidebar-section">Prepare</div>
                <div className="dash-nav-item">◐ &nbsp;Interview Prep</div>
                <div className="dash-nav-item">◑ &nbsp;STAR Method</div>
                <div className="dash-nav-item">◒ &nbsp;Mock Tests</div>
                <div className="dash-sidebar-section">Grow</div>
                <div className="dash-nav-item">⬙ &nbsp;Courses</div>
                <div className="dash-nav-item">⬘ &nbsp;Analytics</div>
                <div className="dash-nav-item">⬗ &nbsp;Career AI</div>
              </div>
              <div className="dash-content">
                <div className="dash-welcome">Good morning, <em>Arjun</em> 👋</div>
                <div className="dash-sub">Your career score improved by 12 points this week. Keep the momentum.</div>
                <div className="dash-metric-row">
                  <div className="dash-metric-card">
                    <div className="dash-metric-val">87</div>
                    <div className="dash-metric-key">Career Score</div>
                    <div className="dash-metric-change">↑ 12 this week</div>
                  </div>
                  <div className="dash-metric-card">
                    <div className="dash-metric-val">24</div>
                    <div className="dash-metric-key">Jobs Matched</div>
                    <div className="dash-metric-change">↑ 3 new today</div>
                  </div>
                  <div className="dash-metric-card">
                    <div className="dash-metric-val">78%</div>
                    <div className="dash-metric-key">ATS Score</div>
                    <div className="dash-metric-change">↑ 8% vs last</div>
                  </div>
                  <div className="dash-metric-card">
                    <div className="dash-metric-val">6</div>
                    <div className="dash-metric-key">Interviews Prepped</div>
                    <div className="dash-metric-change">↑ 2 completed</div>
                  </div>
                </div>
                <div className="dash-bottom-row">
                  <div className="dash-panel">
                    <div className="dash-panel-title">SKILL PROGRESS</div>
                    <div className="skill-bar-item">
                      <div className="skill-bar-label"><span>Python</span><span style={{ color: 'var(--gold)' }}>82%</span></div>
                      <div className="skill-bar-track"><div className="skill-bar-fill" style={{ width: '82%' }}></div></div>
                    </div>
                    <div className="skill-bar-item">
                      <div className="skill-bar-label"><span>Data Analysis</span><span style={{ color: 'var(--gold)' }}>71%</span></div>
                      <div className="skill-bar-track"><div className="skill-bar-fill" style={{ width: '71%' }}></div></div>
                    </div>
                    <div className="skill-bar-item">
                      <div className="skill-bar-label"><span>Communication</span><span style={{ color: 'var(--gold)' }}>90%</span></div>
                      <div className="skill-bar-track"><div className="skill-bar-fill" style={{ width: '90%' }}></div></div>
                    </div>
                    <div className="skill-bar-item">
                      <div className="skill-bar-label"><span>System Design</span><span style={{ color: 'var(--gold)' }}>58%</span></div>
                      <div className="skill-bar-track"><div className="skill-bar-fill" style={{ width: '58%' }}></div></div>
                    </div>
                  </div>
                  <div className="dash-panel">
                    <div className="dash-panel-title">RECENT ACTIVITY</div>
                    <div className="activity-item">
                      <div className="activity-dot"></div>
                      <div className="activity-text">
                        Resume analyzed for <strong style={{ color: 'var(--cream-dark)' }}>Software Engineer @ Google</strong>
                        <div className="activity-time">2h ago</div>
                      </div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-dot"></div>
                      <div className="activity-text">
                        Completed mock interview: <strong style={{ color: 'var(--cream-dark)' }}>Behavioral Round</strong>
                        <div className="activity-time">Yesterday</div>
                      </div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-dot"></div>
                      <div className="activity-text">
                        Applied to internship at <strong style={{ color: 'var(--cream-dark)' }}>Razorpay — 30 Day Program</strong>
                        <div className="activity-time">2 days ago</div>
                      </div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-dot"></div>
                      <div className="activity-text">
                        Course completed: <strong style={{ color: 'var(--cream-dark)' }}>DSA Fundamentals</strong>
                        <div className="activity-time">3 days ago</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROADMAP */}
      <section id="roadmap-section">
        <div className="section-inner">
          <div className="roadmap-grid">
            <div>
              <div className="reveal">
                <div className="section-label">Career Roadmap AI</div>
                <h2 className="section-title">Every step mapped,<br /><em>nothing left to chance</em></h2>
              </div>
              <div className="roadmap-steps">
                <div className="roadmap-step reveal">
                  <div className="roadmap-step-num">01</div>
                  <div className="roadmap-step-content">
                    <div className="roadmap-step-title">Profile Assessment & Goal Setting</div>
                    <div className="roadmap-step-text">AI evaluates your current skills, education, and aspirations to define your ideal career trajectory.</div>
                  </div>
                </div>
                <div className="roadmap-step reveal reveal-delay-1">
                  <div className="roadmap-step-num">02</div>
                  <div className="roadmap-step-content">
                    <div className="roadmap-step-title">Gap Analysis & Skill Mapping</div>
                    <div className="roadmap-step-text">Identifies exactly which skills, certifications, or projects you need to close the gap between where you are and where you want to be.</div>
                  </div>
                </div>
                <div className="roadmap-step reveal reveal-delay-2">
                  <div className="roadmap-step-num">03</div>
                  <div className="roadmap-step-content">
                    <div className="roadmap-step-title">30/60/90-Day Action Plan</div>
                    <div className="roadmap-step-text">A concrete, week-by-week roadmap with tasks, resources, and milestones you can track and complete.</div>
                  </div>
                </div>
                <div className="roadmap-step reveal reveal-delay-3">
                  <div className="roadmap-step-num">04</div>
                  <div className="roadmap-step-content">
                    <div className="roadmap-step-title">Application & Interview Sprint</div>
                    <div className="roadmap-step-text">Tailored application strategy with optimized résumés, cover letters, and interview prep for target companies.</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="roadmap-visual-cards reveal reveal-delay-2">
              <div className="roadmap-card">
                <div className="roadmap-card-icon"><i className="fa-solid fa-bolt"></i></div>
                <div>
                  <div className="roadmap-card-title">AI-Personalised Path</div>
                  <div className="roadmap-card-desc">No two roadmaps are the same. Built entirely around your unique profile, goals, and timeline.</div>
                </div>
              </div>
              <div className="roadmap-card">
                <div className="roadmap-card-icon"><i className="fa-regular fa-calendar-days"></i></div>
                <div>
                  <div className="roadmap-card-title">Adaptive Scheduling</div>
                  <div className="roadmap-card-desc">Roadmap adjusts dynamically based on your progress, market changes, and new opportunities.</div>
                </div>
              </div>
              <div className="roadmap-card">
                <div className="roadmap-card-icon"><i className="fa-solid fa-graduation-cap"></i></div>
                <div>
                  <div className="roadmap-card-title">Certified Learning Integration</div>
                  <div className="roadmap-card-desc">Recommended courses embedded directly into your roadmap with progress sync and certificate tracking.</div>
                </div>
              </div>
              <div className="roadmap-card">
                <div className="roadmap-card-icon"><i className="fa-solid fa-trophy"></i></div>
                <div>
                  <div className="roadmap-card-title">Achievement Milestones</div>
                  <div className="roadmap-card-desc">Earn badges, update your profile score, and get recruiter visibility as you complete each milestone.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERNSHIPS */}
      <section id="internships">
        <div className="section-inner">
          <div className="reveal">
            <div className="section-label">Internship Marketplace</div>
            <h2 className="section-title">Real experience,<br /><em>real results</em></h2>
            <p className="internship-subtitle">15-day, 30-day, 45-day, and 3-month internships across tech, design, finance, marketing, and operations.</p>
          </div>
          <div className="internship-filter-row reveal">
            {['All Domains', 'Technology', 'Design', 'Finance', 'Marketing', 'Operations', 'Data Science'].map(filter => (
              <div key={filter} className={`filter-pill ${activeFilter === filter ? 'active' : ''}`} onClick={() => setActiveFilter(filter)}>
                {filter}
              </div>
            ))}
          </div>
          <div className="internship-cards">
            <div className="intern-card reveal">
              <div className="intern-duration-badge">15 Days · Remote</div>
              <div className="intern-company">
                <div className="intern-logo"><i className="fa-solid fa-rocket"></i></div>
                <div className="intern-company-name">Razorpay</div>
              </div>
              <div className="intern-title">Frontend Development Sprint</div>
              <div className="intern-meta">
                <div className="intern-tag">React</div>
                <div className="intern-tag">TypeScript</div>
                <div className="intern-tag">₹8,000 stipend</div>
              </div>
              <Link to="/internship" className="intern-apply" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>Apply Now →</Link>
            </div>
            <div className="intern-card reveal reveal-delay-1">
              <div className="intern-duration-badge">30 Days · Hybrid</div>
              <div className="intern-company">
                <div className="intern-logo"><i className="fa-regular fa-lightbulb"></i></div>
                <div className="intern-company-name">Meesho</div>
              </div>
              <div className="intern-title">Product Design Immersion</div>
              <div className="intern-meta">
                <div className="intern-tag">Figma</div>
                <div className="intern-tag">UX Research</div>
                <div className="intern-tag">₹15,000 stipend</div>
              </div>
              <Link to="/internship" className="intern-apply" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>Apply Now →</Link>
            </div>
            <div className="intern-card reveal reveal-delay-2">
              <div className="intern-duration-badge">45 Days · On-site</div>
              <div className="intern-company">
                <div className="intern-logo"><i className="fa-solid fa-chart-simple"></i></div>
                <div className="intern-company-name">Groww</div>
              </div>
              <div className="intern-title">Data Science & Analytics</div>
              <div className="intern-meta">
                <div className="intern-tag">Python</div>
                <div className="intern-tag">ML</div>
                <div className="intern-tag">₹22,000 stipend</div>
              </div>
              <Link to="/internship" className="intern-apply" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>Apply Now →</Link>
            </div>
            <div className="intern-card reveal">
              <div className="intern-duration-badge">3 Months · Remote</div>
              <div className="intern-company">
                <div className="intern-logo"><i className="fa-solid fa-globe"></i></div>
                <div className="intern-company-name">Zepto</div>
              </div>
              <div className="intern-title">Full-Stack Engineering Residency</div>
              <div className="intern-meta">
                <div className="intern-tag">Node.js</div>
                <div className="intern-tag">Postgres</div>
                <div className="intern-tag">₹45,000/mo</div>
              </div>
              <Link to="/internship" className="intern-apply" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>Apply Now →</Link>
            </div>
            <div className="intern-card reveal reveal-delay-1">
              <div className="intern-duration-badge">30 Days · Remote</div>
              <div className="intern-company">
                <div className="intern-logo"><i className="fa-solid fa-mobile-screen"></i></div>
                <div className="intern-company-name">PhonePe</div>
              </div>
              <div className="intern-title">Digital Marketing & Growth</div>
              <div className="intern-meta">
                <div className="intern-tag">SEO</div>
                <div className="intern-tag">Performance Ads</div>
                <div className="intern-tag">₹12,000 stipend</div>
              </div>
              <Link to="/internship" className="intern-apply" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>Apply Now →</Link>
            </div>
            <div className="intern-card reveal reveal-delay-2">
              <div className="intern-duration-badge">3 Months · Hybrid</div>
              <div className="intern-company">
                <div className="intern-logo"><i className="fa-solid fa-building-columns"></i></div>
                <div className="intern-company-name">CRED</div>
              </div>
              <div className="intern-title">Finance & Risk Analysis</div>
              <div className="intern-meta">
                <div className="intern-tag">Excel</div>
                <div className="intern-tag">SQL</div>
                <div className="intern-tag">₹40,000/mo</div>
              </div>
              <Link to="/internship" className="intern-apply" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>Apply Now →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* INTERVIEW PREP */}
      <section id="interview-prep">
        <div className="section-inner">
          <div className="interview-layout">
            <div>
              <div className="reveal">
                <div className="section-label">Interview Intelligence</div>
                <h2 className="section-title">Walk in prepared.<br /><em>Walk out hired.</em></h2>
              </div>
              <div className="interview-features">
                <div className="interview-feature reveal">
                  <div className="interview-feature-icon"><i className="fa-solid fa-brain"></i></div>
                  <div>
                    <div className="interview-feature-title">AI Mock Interview Engine</div>
                    <div className="interview-feature-text">Realistic simulations with adaptive questioning based on your target role, company culture, and past answers.</div>
                  </div>
                </div>
                <div className="interview-feature reveal reveal-delay-1">
                  <div className="interview-feature-icon"><i className="fa-regular fa-building"></i></div>
                  <div>
                    <div className="interview-feature-title">1000+ Company-Wise Questions</div>
                    <div className="interview-feature-text">Curated question banks for Google, Amazon, Flipkart, Infosys, TCS, Goldman Sachs, and 990+ more companies.</div>
                  </div>
                </div>
                <div className="interview-feature reveal reveal-delay-2">
                  <div className="interview-feature-icon"><i className="fa-solid fa-bullseye"></i></div>
                  <div>
                    <div className="interview-feature-title">Instant Answer Coaching</div>
                    <div className="interview-feature-text">Real-time feedback on structure, relevance, confidence markers, and improvements after every answer.</div>
                  </div>
                </div>
                <div className="interview-feature reveal reveal-delay-3">
                  <div className="interview-feature-icon"><i className="fa-regular fa-pen-to-square"></i></div>
                  <div>
                    <div className="interview-feature-title">STAR Method Framework</div>
                    <div className="interview-feature-text">Guided STAR-format answer builder for behavioral questions — turn any experience into a compelling story.</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="reveal reveal-delay-2">
              <div className="star-card">
                <div className="star-card-top">⬡ STAR Method Framework</div>
                <div className="star-method">
                  <div className="star-item">
                    <div className="star-letter">S</div>
                    <div className="star-word">Situation</div>
                    <div className="star-desc">Set the context — where, when, what was the challenge you faced?</div>
                  </div>
                  <div className="star-item">
                    <div className="star-letter">T</div>
                    <div className="star-word">Task</div>
                    <div className="star-desc">Define your responsibility — what was expected of you specifically?</div>
                  </div>
                  <div className="star-item">
                    <div className="star-letter">A</div>
                    <div className="star-word">Action</div>
                    <div className="star-desc">Describe steps you took — focus on your individual contributions.</div>
                  </div>
                  <div className="star-item">
                    <div className="star-letter">R</div>
                    <div className="star-word">Result</div>
                    <div className="star-desc">Quantify outcomes — metrics, impact, recognition, or lessons learned.</div>
                  </div>
                </div>
                <div style={{ marginTop: '1.5rem' }}>
                  <div style={{ fontFamily: 'var(--font-label)', fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.8rem' }}>Companies covered</div>
                  <div className="company-questions-strip">
                    <div className="company-badge">Google</div>
                    <div className="company-badge">Amazon</div>
                    <div className="company-badge">Microsoft</div>
                    <div className="company-badge">Flipkart</div>
                    <div className="company-badge">Infosys</div>
                    <div className="company-badge">TCS</div>
                    <div className="company-badge">Wipro</div>
                    <div className="company-badge">Goldman</div>
                    <div className="company-badge">Deloitte</div>
                    <div className="company-badge">+990 more</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section id="stats-section">
        <div className="section-inner">
          <div className="stats-grid">
            <div className="stat-item reveal">
              <div className="stat-num" data-target="50000">0</div>
              <div className="stat-label">Students Empowered</div>
            </div>
            <div className="stat-item reveal reveal-delay-1">
              <div className="stat-num" data-target="1000">0</div>
              <div className="stat-label">Company Q&A Banks</div>
            </div>
            <div className="stat-item reveal reveal-delay-2">
              <div className="stat-num" data-target="300">0</div>
              <div className="stat-label">Hiring Partners</div>
            </div>
            <div className="stat-item reveal reveal-delay-3">
              <div className="stat-num" data-target="98">0</div>
              <div className="stat-label">% ATS Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials">
        <div className="section-inner">
          <div className="testimonials-header reveal">
            <div className="section-label">Testimonials</div>
            <h2 className="section-title">Careers transformed,<br /><em>lives changed</em></h2>
          </div>
          <div className="testimonials-track-wrap reveal">
            <div className="testimonials-track">
              <div className="testimonial-card">
                <div className="testimonial-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
                <div className="testimonial-text">"CareerWizard's ATS engine told me exactly what was wrong with my resume. Three weeks later I had my dream offer from Razorpay."</div>
                <div className="testimonial-author"><div className="testimonial-avatar">P</div><div><div className="testimonial-name">Priya Sharma</div><div className="testimonial-role">SDE II @ Razorpay · IIT Bombay</div></div></div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
                <div className="testimonial-text">"The STAR method coach is incredible. I went from bombing interviews to confidently clearing 4 final rounds in a single month."</div>
                <div className="testimonial-author"><div className="testimonial-avatar">A</div><div><div className="testimonial-name">Arjun Mehta</div><div className="testimonial-role">Product Manager @ Meesho · NIT Trichy</div></div></div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
                <div className="testimonial-text">"The 30-day internship at Groww through CareerWizard directly converted to a PPO. This platform is genuinely life-changing."</div>
                <div className="testimonial-author"><div className="testimonial-avatar">S</div><div><div className="testimonial-name">Sneha Kulkarni</div><div className="testimonial-role">Data Scientist @ Groww · BITS Pilani</div></div></div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
                <div className="testimonial-text">"I used every feature — roadmap, mock interviews, company questions. Got placed at Amazon 6 weeks after signing up. Worth every rupee."</div>
                <div className="testimonial-author"><div className="testimonial-avatar">R</div><div><div className="testimonial-name">Rahul Gupta</div><div className="testimonial-role">SDE @ Amazon · Delhi University</div></div></div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
                <div className="testimonial-text">"As a non-CS graduate, I was skeptical. But the AI roadmap told me exactly what to learn and in what order. Now I'm a product designer at Swiggy."</div>
                <div className="testimonial-author"><div className="testimonial-avatar">K</div><div><div className="testimonial-name">Kavya Nair</div><div className="testimonial-role">Product Designer @ Swiggy · Kerala University</div></div></div>
              </div>
              {/* Duplicated for scroll */}
              <div className="testimonial-card">
                <div className="testimonial-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
                <div className="testimonial-text">"CareerWizard's ATS engine told me exactly what was wrong with my resume. Three weeks later I had my dream offer from Razorpay."</div>
                <div className="testimonial-author"><div className="testimonial-avatar">P</div><div><div className="testimonial-name">Priya Sharma</div><div className="testimonial-role">SDE II @ Razorpay · IIT Bombay</div></div></div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
                <div className="testimonial-text">"The STAR method coach is incredible. I went from bombing interviews to confidently clearing 4 final rounds in a single month."</div>
                <div className="testimonial-author"><div className="testimonial-avatar">A</div><div><div className="testimonial-name">Arjun Mehta</div><div className="testimonial-role">Product Manager @ Meesho · NIT Trichy</div></div></div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
                <div className="testimonial-text">"The 30-day internship at Groww through CareerWizard directly converted to a PPO. This platform is genuinely life-changing."</div>
                <div className="testimonial-author"><div className="testimonial-avatar">S</div><div><div className="testimonial-name">Sneha Kulkarni</div><div className="testimonial-role">Data Scientist @ Groww · BITS Pilani</div></div></div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
                <div className="testimonial-text">"I used every feature — roadmap, mock interviews, company questions. Got placed at Amazon 6 weeks after signing up. Worth every rupee."</div>
                <div className="testimonial-author"><div className="testimonial-avatar">R</div><div><div className="testimonial-name">Rahul Gupta</div><div className="testimonial-role">SDE @ Amazon · Delhi University</div></div></div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
                <div className="testimonial-text">"As a non-CS graduate, I was skeptical. But the AI roadmap told me exactly what to learn and in what order. Now I'm a product designer at Swiggy."</div>
                <div className="testimonial-author"><div className="testimonial-avatar">K</div><div><div className="testimonial-name">Kavya Nair</div><div className="testimonial-role">Product Designer @ Swiggy · Kerala University</div></div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing">
        <div className="section-inner">
          <div className="pricing-header reveal">
            <div className="section-label">Pricing Plans</div>
            <h2 className="section-title">Invest in your <em>future</em></h2>
            <p style={{ color: 'var(--muted)', marginTop: '0.8rem', fontSize: '1rem' }}>All plans include a 7-day free trial. No credit card required.</p>
          </div>
          <div className="pricing-grid">
            <div className="pricing-card reveal">
              <div className="pricing-plan">Starter</div>
              <div className="pricing-price"><span>₹</span>399</div>
              <div className="pricing-period">per month</div>
              <div className="pricing-divider"></div>
              <ul className="pricing-features">
                <li><span className="pricing-check">✓</span> Resume upload & ATS score</li>
                <li><span className="pricing-check">✓</span> 3 AI resume analyses/month</li>
                <li><span className="pricing-check">✓</span> Job finder access</li>
                <li><span className="pricing-check">✓</span> Basic roadmap generation</li>
                <li><span className="pricing-check">✓</span> 50 company questions</li>
                <li><span className="pricing-check">✓</span> 2 internship applications</li>
              </ul>
              <button className="pricing-btn pricing-btn-outline">Get Started</button>
            </div>
            <div className="pricing-card reveal reveal-delay-1">
              <div className="pricing-plan">Growth</div>
              <div className="pricing-price"><span>₹</span>599</div>
              <div className="pricing-period">per month</div>
              <div className="pricing-divider"></div>
              <ul className="pricing-features">
                <li><span className="pricing-check">✓</span> Everything in Starter</li>
                <li><span className="pricing-check">✓</span> Unlimited ATS analyses</li>
                <li><span className="pricing-check">✓</span> Full roadmap + milestones</li>
                <li><span className="pricing-check">✓</span> 200 company questions</li>
                <li><span className="pricing-check">✓</span> 5 mock interviews/month</li>
                <li><span className="pricing-check">✓</span> 10 internship applications</li>
                <li><span className="pricing-check">✓</span> Certified course access</li>
              </ul>
              <button className="pricing-btn pricing-btn-outline">Get Started</button>
            </div>
            <div className="pricing-card featured reveal reveal-delay-2">
              <div className="pricing-popular">Most Popular</div>
              <div className="pricing-plan">Pro</div>
              <div className="pricing-price" style={{ color: 'var(--gold)' }}><span>₹</span>999</div>
              <div className="pricing-period">per month</div>
              <div className="pricing-divider"></div>
              <ul className="pricing-features">
                <li><span className="pricing-check">✓</span> Everything in Growth</li>
                <li><span className="pricing-check">✓</span> 1000+ company questions</li>
                <li><span className="pricing-check">✓</span> Unlimited mock interviews</li>
                <li><span className="pricing-check">✓</span> STAR method AI coaching</li>
                <li><span className="pricing-check">✓</span> Direct recruiter referrals</li>
                <li><span className="pricing-check">✓</span> Unlimited internships</li>
                <li><span className="pricing-check">✓</span> Priority AI career assistant</li>
                <li><span className="pricing-check">✓</span> Profile badge & verification</li>
              </ul>
              <button className="pricing-btn pricing-btn-gold">Get Pro Access</button>
            </div>
            <div className="pricing-card reveal reveal-delay-3">
              <div className="pricing-plan">Elite</div>
              <div className="pricing-price"><span>₹</span>1599</div>
              <div className="pricing-period">per month</div>
              <div className="pricing-divider"></div>
              <ul className="pricing-features">
                <li><span className="pricing-check">✓</span> Everything in Pro</li>
                <li><span className="pricing-check">✓</span> 1:1 expert mentorship sessions</li>
                <li><span className="pricing-check">✓</span> Dedicated career manager</li>
                <li><span className="pricing-check">✓</span> Direct hiring pipeline access</li>
                <li><span className="pricing-check">✓</span> Custom interview prep plan</li>
                <li><span className="pricing-check">✓</span> Salary negotiation coaching</li>
                <li><span className="pricing-check">✓</span> College/recruiter network</li>
                <li><span className="pricing-check">✓</span> Placement guarantee program</li>
              </ul>
              <button className="pricing-btn pricing-btn-outline">Get Elite</button>
            </div>
          </div>
        </div>
      </section>

      {/* COMPANIES */}
      <section id="companies">
        <div className="section-inner">
          <div className="companies-header">
            <div className="companies-label">Trusted by candidates from</div>
          </div>
          <div className="companies-logos reveal">
            <div className="company-logo-item">Google</div>
            <div className="company-logo-item">Amazon</div>
            <div className="company-logo-item">Microsoft</div>
            <div className="company-logo-item">Flipkart</div>
            <div className="company-logo-item">Razorpay</div>
            <div className="company-logo-item">Zepto</div>
            <div className="company-logo-item">PhonePe</div>
            <div className="company-logo-item">Swiggy</div>
            <div className="company-logo-item">CRED</div>
            <div className="company-logo-item">Meesho</div>
          </div>
        </div>
      </section>

      {/* COLLEGE PARTNERSHIP */}
      <section id="college-partnership">
        <div className="section-inner">
          <div className="college-grid">
            <div className="college-content reveal">
              <div className="section-label">College Ecosystem</div>
              <h2 className="section-title">Power your<br /><em>entire campus</em></h2>
              <p className="college-desc">Partner with CareerWizard AI to give every student access to the career intelligence platform — from first year to placement season.</p>
              <div className="college-benefits">
                <div className="college-benefit">Branded college career portal for your institution</div>
                <div className="college-benefit">Placement cell dashboard with cohort analytics</div>
                <div className="college-benefit">Bulk student onboarding & bulk ATS scans</div>
                <div className="college-benefit">Company connect & campus drive facilitation</div>
                <div className="college-benefit">TPO reporting suite with placement metrics</div>
                <div className="college-benefit">Dedicated success manager for your team</div>
              </div>
              <div style={{ marginTop: '2.5rem' }}>
                <Link to="/signup" className="btn-primary">Request College Demo →</Link>
              </div>
            </div>
            <div className="college-visual reveal reveal-delay-2">
              <div className="college-card">
                <div className="college-card-icon"><i className="fa-solid fa-building-columns"></i></div>
                <div className="college-card-title">Institutional Licensing</div>
                <div className="college-card-text">Custom pricing for colleges with 500+ to 10,000+ students. Full platform access for all enrolled students.</div>
              </div>
              <div className="college-card">
                <div className="college-card-icon"><i className="fa-solid fa-chart-simple"></i></div>
                <div className="college-card-title">Placement Analytics</div>
                <div className="college-card-text">Real-time dashboard showing placement rates, top employers, average packages, and skill trends.</div>
              </div>
              <div className="college-card">
                <div className="college-card-icon"><i className="fa-regular fa-handshake"></i></div>
                <div className="college-card-title">Recruiter Connect</div>
                <div className="college-card-text">Bring partner companies directly to your campus through CareerWizard's recruiter network.</div>
              </div>
              <div className="college-card">
                <div className="college-card-icon"><i className="fa-solid fa-graduation-cap"></i></div>
                <div className="college-card-title">Faculty Dashboard</div>
                <div className="college-card-text">Professors and TPOs can track individual student progress and intervene with targeted support.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta-section">
        <div className="section-inner">
          <div className="cta-inner reveal">
            <div className="section-label" style={{ justifyContent: 'center' }}>Start Today</div>
            <h2 className="cta-title">Your career's best<br /><em>chapter starts now</em></h2>
            <p className="cta-text">Join 50,000+ students who used CareerWizard AI to land dream roles, ace interviews, and build careers they're proud of.</p>
            <div className="cta-email-row">
              <input className="cta-email-input" type="email" placeholder="Enter your college email..." />
              <button className="cta-email-btn">Begin →</button>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>7-day free trial · No credit card · Cancel anytime</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="footer-logo">CareerWizard AI</div>
              <div className="footer-brand-desc">The most intelligent career platform for India's next generation of professionals. Built with AI. Powered by ambition.</div>
            </div>
            <div>
              <div className="footer-col-title">Platform</div>
              <ul className="footer-links">
                <li><a href="#">Resume AI</a></li>
                <li><a href="#">ATS Checker</a></li>
                <li><a href="#">Job Finder</a></li>
                <li><a href="#">Career Roadmap</a></li>
                <li><a href="#">Internships</a></li>
                <li><a href="#">Courses</a></li>
              </ul>
            </div>
            <div>
              <div className="footer-col-title">Resources</div>
              <ul className="footer-links">
                <li><a href="#">Interview Prep</a></li>
                <li><a href="#">STAR Method</a></li>
                <li><a href="#">Company Questions</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Career Guides</a></li>
                <li><a href="#">Help Center</a></li>
              </ul>
            </div>
            <div>
              <div className="footer-col-title">Company</div>
              <ul className="footer-links">
                <li><a href="#">About Us</a></li>
                <li><a href="#">College Partners</a></li>
                <li><a href="#">For Recruiters</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-copy">© 2025 CareerWizard AI. All rights reserved. Made with ♥ for India's talent.</div>
            <div className="footer-socials">
              <a href="#" className="footer-social">𝕏</a>
              <a href="#" className="footer-social">in</a>
              <a href="#" className="footer-social">ig</a>
              <a href="#" className="footer-social">yt</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
