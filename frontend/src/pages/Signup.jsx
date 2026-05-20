import { useState, useContext } from "react";
import { register } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { ChevronRightIcon } from "../components/ui/Icons";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { isDark } = useContext(ThemeContext);

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMsg("");
    try {
      const res = await register(name, email, password, role);
      setMsg(res.data.message);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMsg(err.response?.data?.detail || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 pt-32 relative overflow-hidden ${isDark ? 'bg-black text-slate-200' : 'bg-[#f0eeea] text-slate-900'}`}>
      {isDark && <div className="nebula-bg"></div>}

      <div className="w-full max-w-[480px] relative z-10 animate-reveal-up">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className={`text-3xl font-bold tracking-tight mb-2 uppercase ${isDark ? 'text-white' : 'text-black'}`}>Create Profile</h2>
          <p className="text-slate-500 font-medium text-xs tracking-wide">Enter your details to create an account.</p>
        </div>

        {/* Form Card */}
        <div className={`glass-card p-10 md:p-12 rounded-3xl relative overflow-hidden transition-all duration-500 ${isDark ? 'hover:border-white/20' : 'hover:border-black/10'}`}>
          <div className="shimmer-sweep opacity-30"></div>

          <form className="space-y-6 relative z-10" onSubmit={handleSignup}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className={`block text-[9px] font-bold uppercase tracking-[0.2em] ml-1 ${isDark ? 'text-slate-500' : 'text-black'}`}>Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full input-glass px-5 py-3.5 rounded-xl font-medium focus:outline-none text-xs transition-all ${isDark ? 'text-white placeholder-slate-800 focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(0,242,255,0.1)]' : 'text-black placeholder-slate-400 focus:border-emerald-500 focus:shadow-[0_0_20px_rgba(16,185,129,0.1)]'}`}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className={`block text-[9px] font-bold uppercase tracking-[0.2em] ml-1 ${isDark ? 'text-slate-500' : 'text-black'}`}>Target Role</label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className={`w-full input-glass px-5 py-3.5 rounded-xl font-medium focus:outline-none text-xs transition-all ${isDark ? 'text-white placeholder-slate-800 focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(0,242,255,0.1)]' : 'text-black placeholder-slate-400 focus:border-emerald-500 focus:shadow-[0_0_20px_rgba(16,185,129,0.1)]'}`}
                  placeholder="Software Engineer"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className={`block text-[9px] font-bold uppercase tracking-[0.2em] ml-1 ${isDark ? 'text-slate-500' : 'text-black'}`}>Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full input-glass px-6 py-4 rounded-xl font-medium focus:outline-none text-sm transition-all ${isDark ? 'text-white placeholder-slate-800 focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(0,242,255,0.1)]' : 'text-black placeholder-slate-400 focus:border-emerald-500 focus:shadow-[0_0_20px_rgba(16,185,129,0.1)]'}`}
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className={`block text-[9px] font-bold uppercase tracking-[0.2em] ml-1 ${isDark ? 'text-slate-500' : 'text-black'}`}>Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full input-glass px-6 py-4 rounded-xl font-medium focus:outline-none text-sm transition-all ${isDark ? 'text-white placeholder-slate-800 focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(0,242,255,0.1)]' : 'text-black placeholder-slate-400 focus:border-emerald-500 focus:shadow-[0_0_20px_rgba(16,185,129,0.1)]'}`}
                placeholder="••••••••"
              />
            </div>

            {msg && (
              <div className={`p-4 rounded-xl text-[10px] font-bold flex items-center animate-shake ${msg.includes("success") ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'}`}>
                <div className={`w-1 h-1 rounded-full mr-2 animate-pulse ${msg.includes("success") ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                {msg}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full btn-action py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center group ${isDark ? '' : 'before:bg-gradient-to-r before:from-emerald-400 before:to-emerald-600 hover:border-emerald-500'}`}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <span className="flex items-center">
                  Sign Up <ChevronRightIcon className="ml-2 w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <p className="text-center mt-8 text-[11px] text-slate-500 font-medium tracking-wide">
          Already synced? <Link to="/login" className={`font-bold transition-colors ${isDark ? 'text-white hover:text-cyan-400' : 'text-slate-900 hover:text-emerald-600'}`}>Login to Account</Link>
        </p>
      </div>
    </div>
  );
}
