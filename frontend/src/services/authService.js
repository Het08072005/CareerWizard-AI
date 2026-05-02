import api from "../api/axiosClient";

export const signup = (name, email, password, role) =>
  api.post("/auth/signup", { name, email, password, role });

export const register = signup; // Alias to match my import

export const login = (email, password) =>
  api.post("/auth/login", { email, password });
