import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useRef, useEffect, createContext } from "react";

import careerMindLogo from "../assets/careermind.png"; 


// Temporary AuthContext to avoid errors
const AuthContext = createContext({
  isLoggedIn: true,
  logout: () => {
    console.warn("Mock logout function called.");
  },
});

export default function Navbar() {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
    navigate("/login");
  };

  const handleProfileClick = () => setIsDropdownOpen(!isDropdownOpen);

  const handleNavigate = (path) => {
    setIsDropdownOpen(false);
    navigate(path);
  };

  // SVG Icon
  const ProfileIcon = (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );

  return (
    <nav className="bg-violet-600 text-white p-2 flex justify-between items-center shadow-lg">

      {/* LOGO SECTION */}
      <div className="flex items-center text-violet-600">
        <Link to="/" className="flex items-center ">
          <img
            src={careerMindLogo}
            alt="CareerMind AI Logo"
            className="h-14 w-auto bg-transparent  p-1 rounded-full shadow-md"
          />
          <h1 className="ml-2 flex items-center gap-1 gradient-move font-bold ">
  CareerWizard AI
</h1>
        </Link>
      </div>

      {/* RIGHT SIDE - AUTH / PROFILE */}
      <div className="space-x-4 flex items-center">
        {!isLoggedIn ? (
          <>
            <Link
              to="/login"
              className="py-2 px-3 rounded-lg text-white font-medium hover:bg-violet-700 transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="py-2 px-3 rounded-lg bg-white text-violet-600 font-medium hover:bg-violet-100 shadow-md transition"
            >
              Signup
            </Link>
          </>
        ) : (
          <div className="relative" ref={dropdownRef}>
            
            {/* PROFILE BUTTON */}
            <button
              onClick={handleProfileClick}
              title="Profile Menu"
              className="p-2 rounded-full text-violet-600 bg-white hover:bg-gray-100 transition shadow-md focus:outline-none focus:ring-2 focus:ring-white"
            >
              <ProfileIcon />
            </button>

            {/* DROPDOWN */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-10 border border-gray-200">

                {/* Profile Nav */}
                <button
                  onClick={() => handleNavigate("/profile")}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-violet-50 hover:text-violet-600 flex items-center space-x-2 transition"
                >
                  <ProfileIcon className="h-5 w-5" />
                  <span>Profile</span>
                </button>

                <div className="border-t border-gray-100 my-1"></div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center space-x-2 transition"
                >
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span>Logout</span>
                </button>

              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
