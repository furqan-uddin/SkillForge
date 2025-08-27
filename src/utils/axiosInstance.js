// src/utils/axiosInstance.js
// src/utils/axiosInstance.js
import axios from "axios";
import { isTokenExpired } from "./authHelper";
import { toast } from "react-hot-toast";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Attach token if present & not expired
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && !isTokenExpired(token)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Centralized 401 handling: clean localStorage and redirect to login (keeps same UX as original)
API.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      toast.error("Session expired. Please log in again.");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default API;
