import { useState } from "react";
import { register } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { ChevronRightIcon } from "../components/ui/Icons";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-black text-slate-200 flex items-center justify-center p-6 pt-32 relative overflow-hidden font-sans">
      <div className="nebula-bg"></div>

      <div className="w-full max-w-[480px] relative z-10 animate-reveal-up">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white tracking-tight font-display mb-2 uppercase">Create Profile</h2>
          <p className="text-slate-500 font-medium text-xs tracking-wide">Enter your details to create an account.</p>
        </div>

        {/* Form Card */}
        <div className="glass-card p-10 md:p-12 rounded-3xl relative overflow-hidden transition-all duration-500 hover:border-white/20">
          <div className="shimmer-sweep opacity-30"></div>

          <form className="space-y-6 relative z-10" onSubmit={handleSignup}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full input-glass px-5 py-3.5 rounded-xl text-white font-medium focus:outline-none placeholder-slate-800 text-xs transition-all"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Target Role</label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full input-glass px-5 py-3.5 rounded-xl text-white font-medium focus:outline-none placeholder-slate-800 text-xs transition-all"
                  placeholder="Developer"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Secure Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full input-glass px-6 py-4 rounded-xl text-white font-medium focus:outline-none placeholder-slate-800 text-sm transition-all"
                placeholder="identity@wizard.system"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Access Key</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full input-glass px-6 py-4 rounded-xl text-white font-medium focus:outline-none placeholder-slate-800 text-sm transition-all"
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
              className="w-full btn-action py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center group"
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
          Already synced? <Link to="/login" className="text-white font-bold hover:text-fuchsia-400 transition-colors">Resume Session</Link>
        </p>
      </div>
    </div>
  );
}
