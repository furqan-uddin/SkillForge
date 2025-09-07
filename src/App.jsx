// SKILLFORGE/src/App.jsx
// React & Hooks
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// UI & Notifications
import { Toaster } from "react-hot-toast";

// Context
import { AuthProvider } from "./contexts/AuthContext";

// Components
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import MyRoadmaps from "./pages/MyRoadmaps";
import AIRoadmap from "./pages/AIRoadmap";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import Profile from "./pages/Profile";
import RoadmapDetail from "./pages/RoadmapDetail";
import JDMatcher from "./pages/JDMatcher";
import InterviewPrep from "./pages/InterviewPrep";
import SkillGap from "./pages/SkillGap";
import CareerInsights from "./pages/CareerInsights";

function App() {
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
          path="/jd-matcher"
          element={
            <ProtectedRoute>
              <JDMatcher />
            </ProtectedRoute>
          }
        />
        <Route
          path="/interview-prep"
          element={
            <ProtectedRoute>
              <InterviewPrep />
            </ProtectedRoute>
          }
        />
        <Route
          path="/skill-gap"
          element={
            <ProtectedRoute>
              <SkillGap />
            </ProtectedRoute>
          }
        />
        <Route
          path="/career-insights"
          element={
            <ProtectedRoute>
              <CareerInsights />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
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
          path="/my-roadmaps"
          element={
            <ProtectedRoute>
              <MyRoadmaps />
            </ProtectedRoute>
          }
        />
        <Route
          path="/roadmap/:roadmapId"
          element={
            <ProtectedRoute>
              <RoadmapDetail />
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
