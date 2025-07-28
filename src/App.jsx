// SKILLFORGE/src/App.jsx
// React & Hooks
import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// UI & Notifications
import toast, { Toaster } from "react-hot-toast";

// Utils & Helpers
import { isTokenExpired, logoutUser } from "./utils/authHelper";

// Components
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import CareerForm from "./pages/CareerForm";
import AIRoadmap from "./pages/AIRoadmap";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import Profile from "./pages/Profile";

function App() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && isTokenExpired(token)) {
      toast.error("Session expired. Please log in again.");
      logoutUser(); // ✅ Now logoutUser will directly redirect without useNavigate
    }
  }, []);

  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/career-form"
          element={
            <ProtectedRoute>
              <CareerForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-roadmap"
          element={
            <ProtectedRoute>
              <AIRoadmap />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resume-analyzer"
          element={
            <ProtectedRoute>
              <ResumeAnalyzer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
