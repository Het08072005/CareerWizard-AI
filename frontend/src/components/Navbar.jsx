import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { isLoggedIn, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
    navigate("/login");
  };

  const ProfileIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-500 ${scrolled ? 'bg-black/60 backdrop-blur-xl py-2.5 border-b border-white/5 shadow-2xl' : 'bg-transparent py-4'}`}>
      <div className="max-w-[1440px] mx-auto px-4 flex justify-between items-center h-full">

        {/* BRAND */}
        <Link to="/" className="group flex items-center relative z-10 py-1">
          <h1 className="text-xl md:text-2xl font-light tracking-[-0.05em] text-slate-400 transition-all duration-700 group-hover:text-white group-hover:tracking-normal relative">
            career<span className="font-semibold text-white ml-0.5 tracking-tight group-hover:brand-gradient-text transition-all duration-700">wizard</span>
            <div className="absolute -inset-x-4 -inset-y-1 bg-white/[0.03] blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 rounded-lg"></div>
            <span className="absolute -right-3 -top-1 text-[8px] font-black tracking-widest text-cyan-500 opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:translate-x-1">AI</span>
          </h1>
        </Link>

        {/* NAVIGATION */}
        <div className="flex items-center space-x-8">
          {!isLoggedIn ? (
            <div className="flex items-center space-x-8">
              <Link to="/login" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors">Login</Link>
              <Link to="/signup" className="px-6 py-2.5 rounded-full bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-cyan-400 transition-all hover:translate-y-[-2px] shadow-2xl">
                Get Started
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-6">
              <Link to="/overview" className="hidden md:block text-xs font-bold tracking-widest text-slate-400 hover:text-cyan-400 transition-colors uppercase">System Dashboard</Link>

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 hover:opacity-100 transition-opacity"></div>
                  <ProfileIcon className="w-5 h-5 text-slate-300" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 top-12 w-56 glass-card rounded-2xl py-2 overflow-hidden animate-reveal-up border border-white/10">
                    <div className="px-4 py-3 border-b border-white/5">
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Logged in as</p>
                      <p className="text-sm font-bold text-white truncate">{user?.name || 'System User'}</p>
                    </div>
                    <button onClick={() => { navigate("/profile"); setIsDropdownOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-cyan-400 transition-colors">Account Config</button>
                    <button onClick={() => { navigate("/overview"); setIsDropdownOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-cyan-400 transition-colors">Core Interface</button>
                    <div className="border-t border-white/5 mt-1 pt-1">
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-500/5 transition-colors">Disconnect</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Animated bottom border */}
      <div className="absolute bottom-0 left-0 w-full h-[1px]">
        <div className="w-full h-full bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent animate-shimmer-fast"></div>
        <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent blur-[2px] transition-opacity duration-700 ${scrolled ? 'opacity-100' : 'opacity-40'}`}></div>
      </div>
    </nav>
  );
}
