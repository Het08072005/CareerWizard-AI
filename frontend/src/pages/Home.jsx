import { Link } from "react-router-dom";
import React, { useContext, useState } from 'react';
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { BrainIcon, RocketIcon, UserCheckIcon } from "../components/ui/Icons";
import {
  CheckIcon,
  ArrowRightIcon,
  ChartBarIcon,
  DocumentMagnifyingGlassIcon,
  AcademicCapIcon,
  CommandLineIcon,
  CpuChipIcon,
  GlobeAltIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";

const FadeUp = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ margin: "-10%" }}
    transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

const FeatureSection = ({ title, description, features, icon: Icon, image, reversed = false }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className={`flex flex-col ${reversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-16 py-24 border-t border-white/5`}>
      <div className="flex-1 space-y-6">
        <FadeUp>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400">
              <Icon className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.5em] text-cyan-400/60">Module Protocol</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif text-white italic leading-tight mb-4">{title}</h2>
          <p className="text-slate-400 text-[13px] leading-relaxed max-w-md mb-8">{description}</p>
          <ul className="grid grid-cols-1 gap-4">
            {features.map((f, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckIcon className="w-3.5 h-3.5 text-cyan-500 mt-1 shrink-0" />
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500">{f}</span>
              </li>
            ))}
          </ul>
        </FadeUp>
      </div>
      <div className="flex-1 w-full relative">
        <FadeUp delay={0.2}>
          <div className="glass-card rounded-[2.5rem] p-2 aspect-[16/10] flex items-center justify-center group overflow-hidden border-white/5 bg-white/[0.01] border hover:border-cyan-400/30 transition-all duration-1000">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/5 via-transparent to-fuchsia-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-10"></div>

            {imgError ? (
              <div className="w-full h-full flex items-center justify-center bg-white/[0.02] rounded-[2.2rem]">
                <Icon className="w-20 h-20 text-slate-800 opacity-20 group-hover:opacity-60 group-hover:scale-110 transition-all duration-1000" />
              </div>
            ) : (
              <img
                src={image}
                alt={title}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover rounded-[2.2rem] opacity-60 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-1000 grayscale group-hover:grayscale-0 shadow-2xl"
              />
            )}
          </div>
        </FadeUp>
      </div>
    </div>
  );
};

export default function Home() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 flex flex-col relative overflow-hidden">
      <div className="grain-overlay" />
      <div className="nebula-bg" />
      <div className="logic-mesh" />

      {/* DESIGNER CENTERED HERO */}
      <section className="max-w-7xl mx-auto w-full px-6 pt-32 pb-4 relative z-10 min-h-screen flex flex-col items-center justify-between text-center">

        {/* Space preservation without the visual line */}
        <div className="h-20"></div>

        <div className="max-w-4xl mx-auto space-y-8 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ margin: "-10%" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-5xl md:text-[8rem] font-serif text-white italic leading-[0.85] tracking-tighter">
              Next-Gen <br />
              <span className="brand-gradient">Career Protocol.</span>
            </h1>
          </motion.div>

          <FadeUp delay={0.3}>
            <p className="text-slate-400 text-sm md:text-base max-w-lg mx-auto leading-relaxed italic font-light opacity-50">
              The definitive logic-gate for professional acceleration. <br className="hidden md:block" />
              Surgical matching and strategic roadmaps.
            </p>
          </FadeUp>

          <FadeUp delay={0.4}>
            <Link
              to={isLoggedIn ? "/overview" : "/signup"}
              className="inline-flex px-12 py-4 rounded-full bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] group transition-all hover:translate-y-[-4px] hover:shadow-[0_20px_40px_-20px_rgba(255,255,255,0.3)] shadow-2xl mb-12"
            >
              <span className="relative z-10">{isLoggedIn ? 'Access Dashboard' : 'Get Started'}</span>
              <ArrowRightIcon className="ml-4 w-4 h-4 transition-transform group-hover:translate-x-2" />
            </Link>
          </FadeUp>

          <div className="h-24"></div>
        </div>

        {/* Feature Row */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl pb-10">
          {[
            { t: "Neural Matching", d: "High-yield competency alignment via LLM layers.", i: BrainIcon },
            { t: "Skeleton Maps", d: "Strategic heuristic tracking for growth scaling.", i: RocketIcon },
            { t: "Protocol Prep", d: "Stress-test knowledge via role-specific drills.", i: UserCheckIcon }
          ].map((box, i) => (
            <FadeUp delay={0.5 + i * 0.1} key={i}>
              <div className="glass-card relative overflow-hidden p-8 rounded-[2rem] border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-700 h-full group text-left flex flex-col justify-start border hover:border-cyan-400/30">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/[0.05] to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-[2500ms] ease-in-out skew-x-[-25deg]"></div>

                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-10 transition-all duration-700 text-cyan-400 group-hover:bg-cyan-400/20 group-hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                  <box.i className="w-7 h-7 transition-all duration-500 group-hover:scale-110 group-hover:rotate-[5deg]" />
                </div>

                <div>
                  <h3 className="text-[13px] font-black uppercase tracking-[0.3em] mb-4 text-white group-hover:brand-gradient-text transition-all duration-500 underline decoration-white/5 underline-offset-8 decoration-2 group-hover:decoration-cyan-400/30">{box.t}</h3>
                  <p className="text-slate-500 text-[11px] font-medium leading-relaxed transition-colors duration-700 group-hover:text-slate-300">{box.d}</p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-32 px-6 max-w-7xl mx-auto w-full relative z-10 border-t border-white/10 mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <FadeUp>
            <h3 className="text-2xl md:text-3xl font-serif text-white italic leading-tight">
              Generic platforms produce predictable outcomes. CareerWizard AI detects the skill gaps,
              optimizes the narrative, and steers the professional journey towards elite status.
            </h3>
          </FadeUp>
          <div className="space-y-10">
            <FadeUp delay={0.2}>
              <div className="glass-card p-10 rounded-[2rem] border border-white/5 bg-white/[0.02] relative overflow-hidden group">
                <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-5">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white">Diagnostics</span>
                </div>
                <div className="space-y-6">
                  <div className="flex justify-between items-baseline group/item">
                    <span className="text-[9px] uppercase tracking-widest font-black text-slate-600">Accuracy</span>
                    <span className="text-[16px] font-serif italic text-cyan-400">98.2%</span>
                  </div>
                  <div className="flex justify-between items-baseline group/item">
                    <span className="text-[9px] uppercase tracking-widest font-black text-slate-600">Reliability</span>
                    <span className="text-[16px] font-serif italic text-cyan-400">Enterprise</span>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Detailed Features - 4 Professional Modules */}
      <section className="py-12 px-6 max-w-7xl mx-auto w-full relative z-10">
        <FeatureSection
          title="Neural Matching Protocol"
          description="CareerWizard AI shows only jobs where your profile meets 60% or higher match criteria."
          icon={ChartBarIcon}
          image="/neural_match.png"
          features={["60%+ Compatibility Prediction", "Neural Logic Integration"]}
        />
        <FeatureSection
          reversed
          title="ATS & Resume Dominance"
          description="Optimize your artifacts to clear Applicant Tracking Systems with instant evaluation."
          icon={DocumentMagnifyingGlassIcon}
          image="/ats_score.png"
          features={["ATS Score Prediction", "Keyword Gap Detection"]}
        />
        <FeatureSection
          title="Strategic Career Roadmap"
          description="A phase-wise tactical guide to bridge your skill gaps and reach your target roles."
          icon={AcademicCapIcon}
          image="/career_roadmap.png"
          features={["Phase-Wise Skill Sync", "Vertical Growth Mapping"]}
        />
        <FeatureSection
          reversed
          title="Neural Interview Drill"
          description="Stress-test your knowledge with AI-driven interview simulations and real-time feedback."
          icon={CommandLineIcon}
          image="/interview_drill.png"
          features={["STAR Method Mastery", "Voice Analysis Diagnostics"]}
        />
      </section>

      {/* Protocol Grid */}
      <section className="py-20 px-6 border-y border-white/5 relative z-10 bg-[#080808]">
        <div className="max-w-7xl mx-auto text-center">
          <FadeUp>
            <h2 className="text-4xl md:text-5xl font-serif text-white italic mb-12 leading-none">The Protocol.</h2>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 border border-white/5">
            {[
              { s: "Extract", d: "Upload Resume → ATS Score → Tactical Tools.", i: DocumentMagnifyingGlassIcon },
              { s: "Sync", d: "Auto Skill Extraction → Job Matching (60%+).", i: CpuChipIcon },
              { s: "Map", d: "Domain Skills → Checklists → Growth.", i: GlobeAltIcon },
              { s: "Synthesize", d: "AI Roadmap (Phase-Wise) → Visuals.", i: AcademicCapIcon },
              { s: "Drill", d: "Interview Questions → STAR Method.", i: CommandLineIcon },
              { s: "Dominate", d: "AI Explanations → STAR Mastery.", i: SparklesIcon }
            ].map((st, i) => (
              <div key={i} className="bg-[#050505] p-10 md:p-12 hover:bg-white/[0.03] transition-all duration-700 group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="flex items-center justify-end mb-8">
                  <st.i className="w-5 h-5 text-slate-800 transition-all duration-700 group-hover:text-cyan-400 group-hover:scale-110" />
                </div>
                <h4 className="text-xl text-white font-serif italic mb-4 group-hover:translate-x-2 transition-transform duration-700">{st.s}</h4>
                <p className="text-slate-500 text-[11px] leading-relaxed font-medium transition-all duration-700 group-hover:text-slate-300">{st.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-24 px-6 relative z-10 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
              <div className="md:col-span-5 space-y-8">
                <h2 className="text-3xl font-serif italic text-white tracking-tighter">
                  CareerWizard <span className="brand-gradient">AI.</span>
                </h2>
                <p className="text-slate-600 text-[11px] leading-relaxed max-w-sm font-medium italic opacity-70">
                  Engineering professional trajectories via neural protocols and tactical intelligence.
                </p>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                    <span className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-600">System Nominal</span>
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-700">LDN / NYC / BLR</span>
                </div>
              </div>

              <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-10">
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.6em] text-white">System</h4>
                  <ul className="space-y-3 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">
                    <li><Link to="/overview" className="hover:text-white transition-colors">Dashboard</Link></li>
                    <li><Link to="/signup" className="hover:text-white transition-colors">Intelligence</Link></li>
                  </ul>
                </div>
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.6em] text-white">Modules</h4>
                  <ul className="space-y-3 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">
                    <li><Link to="/overview/job-match" className="hover:text-cyan-400 transition-colors">Matching</Link></li>
                    <li><Link to="/overview/resume" className="hover:text-cyan-400 transition-colors">ATS Neural</Link></li>
                  </ul>
                </div>
                <div className="space-y-6 hidden md:block">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.6em] text-white">Node</h4>
                  <div className="text-[9px] font-black text-slate-700 tracking-widest uppercase">AES_256.SHD</div>
                  <div className="text-[9px] font-black text-slate-700 tracking-widest uppercase">TLS_1.3.SECURE</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-white/5 text-[8px] uppercase tracking-[0.6em] font-black text-slate-800">
              <span>© 2026 CAREERWIZARD_LABS.INT</span>
              <div className="flex items-center gap-6 mt-6 md:mt-0">
                <span className="hover:text-white transition-colors cursor-pointer">Privacy</span>
                <span className="hover:text-white transition-colors cursor-pointer">Protocol_G</span>
              </div>
            </div>
          </FadeUp>
        </div>
      </footer>
    </div>
  );
}
