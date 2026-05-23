import { useState } from "react";
import { register } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import "../css/Home.css";

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
    <div className="home-container auth-page">
      <div className="auth-left">
        <Link to="/" className="auth-logo">Career<em>Wizard</em></Link>
        <div className="auth-quote">
          Your future starts here.<br />
          <em>Build it with AI.</em>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card" style={{ maxWidth: '480px' }}>
          <div className="auth-header">
            <h2 className="auth-title">Create an account</h2>
            <p className="auth-subtitle">Please enter your details to create an account.</p>
          </div>

          <form className="auth-form" onSubmit={handleSignup}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="auth-field">
                <label className="auth-label">Full name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="auth-input"
                  placeholder="John Doe"
                />
              </div>
              <div className="auth-field">
                <label className="auth-label">Target role</label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="auth-input"
                  placeholder="Software Engineer"
                />
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
                placeholder="you@example.com"
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
                placeholder="••••••••"
              />
            </div>

            {msg && (
              <div className={msg.includes("success") ? "auth-success" : "auth-error"}>
                {msg}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="auth-btn"
            >
              {isLoading ? (
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <g fill="currentColor">
                    <rect className="spinner_S1WN" x="11" y="1" width="2" height="5" rx="1"/>
                    <rect className="spinner_S1WN spinner_b2T7" x="11" y="1" width="2" height="5" rx="1" transform="rotate(30 12 12)"/>
                    <rect className="spinner_S1WN spinner_YRVV" x="11" y="1" width="2" height="5" rx="1" transform="rotate(60 12 12)"/>
                    <rect className="spinner_S1WN spinner_c9oY" x="11" y="1" width="2" height="5" rx="1" transform="rotate(90 12 12)"/>
                    <rect className="spinner_S1WN spinner_grm3" x="11" y="1" width="2" height="5" rx="1" transform="rotate(120 12 12)"/>
                    <rect className="spinner_S1WN spinner_KFRN" x="11" y="1" width="2" height="5" rx="1" transform="rotate(150 12 12)"/>
                    <rect className="spinner_S1WN" x="11" y="1" width="2" height="5" rx="1" transform="rotate(180 12 12)"/>
                    <rect className="spinner_S1WN spinner_b2T7" x="11" y="1" width="2" height="5" rx="1" transform="rotate(210 12 12)"/>
                    <rect className="spinner_S1WN spinner_YRVV" x="11" y="1" width="2" height="5" rx="1" transform="rotate(240 12 12)"/>
                    <rect className="spinner_S1WN spinner_c9oY" x="11" y="1" width="2" height="5" rx="1" transform="rotate(270 12 12)"/>
                    <rect className="spinner_S1WN spinner_grm3" x="11" y="1" width="2" height="5" rx="1" transform="rotate(300 12 12)"/>
                    <rect className="spinner_S1WN spinner_KFRN" x="11" y="1" width="2" height="5" rx="1" transform="rotate(330 12 12)"/>
                  </g>
                </svg>
              ) : "Create account"}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
