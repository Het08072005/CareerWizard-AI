import { useState, useContext } from "react";
import { login as loginService } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/authContextValue";
import "../css/Home.css";

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
      login(res.data.token, { id: res.data.user_id, name: res.data.name, email: res.data.email, role: res.data.role });
      navigate("/");
    } catch (err) {
      setMsg(
        err.response?.data?.detail ||
        err.response?.data?.error ||
        "Backend unreachable. Check backend server and database connection."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="home-container auth-page">
      <div className="auth-left">
        <Link to="/" className="auth-logo">Career<em>Wizard</em></Link>
        <div className="auth-quote">
          Unlock your true potential,<br />
          <em>one step at a time.</em>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-header">
            <h2 className="auth-title">Sign in</h2>
            <p className="auth-subtitle">Please enter your details to sign in.</p>
          </div>

          <form className="auth-form" onSubmit={handleLogin}>
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
              <div className="auth-error">
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
              ) : "Sign in"}
            </button>
          </form>

          <div className="auth-footer">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
