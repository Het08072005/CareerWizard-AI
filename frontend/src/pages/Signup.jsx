import { useState, useContext } from "react";
import { signup as signupService } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; 

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); 

  const handleSignup = async () => {
    try {
      const res = await signupService(username, email, password);

      // Update context & localStorage
      login(res.data.token, { id: res.data.user_id, name: res.data.name });

      setMsg(res.data.message);

      navigate("/"); 
    } catch (err) {
      setMsg(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="flex mb-6">
        <button
          onClick={() => navigate("/login")} 
          className="flex-1 flex items-center justify-center py-2 px-4 mr-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition duration-300 border border-gray-200"
        >
          Login
        </button>
        
        <button
          className="flex-1 flex items-center justify-center py-2 px-4 ml-2 bg-violet-600 text-white font-semibold rounded-lg shadow-md hover:bg-violet-700 transition duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
          Sign Up
        </button>
      </div>

      <label htmlFor="name-input" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
      <input
        id="name-input"
        type="text"
        placeholder="Your Full Name"
        className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-violet-500 focus:border-violet-500 placeholder-gray-400"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <label htmlFor="email-input" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
      <input
        id="email-input"
        type="email"
        placeholder="you@example.com"
        className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-violet-500 focus:border-violet-500 placeholder-gray-400"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label htmlFor="password-input" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
      <input
        id="password-input"
        type="password"
        placeholder="••••••••"
        className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:ring-violet-500 focus:border-violet-500 placeholder-gray-400"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleSignup} 
        className="w-full bg-violet-600 text-white p-3 rounded-lg font-semibold hover:bg-violet-700 transition duration-300 shadow-md"
      >
        Confirm Sign Up
      </button>

      {msg && <p className={`mt-4 text-sm text-center ${msg.includes('success') ? 'text-green-500' : 'text-red-500'}`}>{msg}</p>}
    </div>
  );
}
