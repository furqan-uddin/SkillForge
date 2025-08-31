// src/utils/axiosInstance.js
import axios from "axios";
// The new AuthContext will handle token expiration and user state.
// We no longer need to import isTokenExpired.
// import { isTokenExpired } from "./authHelper";
import { toast } from "react-hot-toast";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Attach token if present. The AuthProvider is now responsible for handling token expiration.
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    // We only check for the presence of the token here.
    // The AuthContext will have already ensured it's valid.
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Centralized 401 handling: clean localStorage and redirect to login
API.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      toast.error("Session expired. Please log in again.");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Redirect to login.
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default API;
