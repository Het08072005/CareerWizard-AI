import { useState, useEffect } from "react";
import api from "../api/axiosClient";
import { AuthContext } from './authContextValue';

const readStoredUser = () => {
  try {
    const token = localStorage.getItem('token');
    const saved = localStorage.getItem('user');
    return token && saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readStoredUser);
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(readStoredUser()));
  const [profile, setProfile] = useState(null);

  // LOGIN
  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setIsLoggedIn(true);
    setUser(userData);
  };

  // LOGOUT

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    setProfile(null);
  };

 
  // FETCH PROFILE FROM BACKEND
  
  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchProfile = async () => {
      try {
        const res = await api.get("/profile/");
        setProfile(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setProfile(null);
      }
    };

    fetchProfile();
  }, [isLoggedIn]);


  // UPDATE PROFILE
 
  const updateProfile = async (formData) => {
    try {
      const res = await api.put("/profile/", formData);
      const updatedProfile = res.data.profile || res.data;

      setProfile(updatedProfile);

      // Optionally update user state if name/email changed
      setUser((prev) => ({ ...prev, ...updatedProfile }));

      return updatedProfile;
    } catch (err) {
      console.error("Update profile error:", err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        user,
        profile,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
