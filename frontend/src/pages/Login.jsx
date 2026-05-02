import { useState, useContext } from "react";
import { login as loginService } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ChevronRightIcon } from "../components/ui/Icons";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMsg("");
    try {
      const res = await loginService(email, password);
      login(res.data.token, { id: res.data.user_id, name: res.data.name });
      navigate("/");
    } catch (err) {
      setMsg(err.response?.data?.detail || err.response?.data?.error || "Credentials rejected.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-slate-200 flex items-center justify-center p-6 pt-32 relative overflow-hidden font-sans">
      <div className="nebula-bg"></div>

      <div className="w-full max-w-[400px] relative z-10 animate-reveal-up">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white tracking-tight font-display mb-2 uppercase">System Login</h2>
          <p className="text-slate-500 font-medium text-xs tracking-wide">Enter credentials to proceed.</p>
        </div>

        {/* Form Card */}
        <div className="glass-card p-10 md:p-12 rounded-3xl relative overflow-hidden transition-all duration-500 hover:border-white/20">
          <div className="shimmer-sweep opacity-30"></div>

          <form className="space-y-8 relative z-10" onSubmit={handleLogin}>
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
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-[10px] font-bold flex items-center animate-shake">
                <div className="w-1 h-1 rounded-full bg-rose-500 mr-2 animate-pulse"></div>
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
                  Login <ChevronRightIcon className="ml-2 w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <p className="text-center mt-8 text-[11px] text-slate-500 font-medium tracking-wide">
          New operative? <Link to="/signup" className="text-white font-bold hover:text-cyan-400 transition-colors">Initialize Account</Link>
        </p>
      </div>
    </div>
  );
}
