// SKILLFORGE/src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FileText, TrendingUp, List, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState({
    resumeScore: 0,
    roadmapProgress: 0,
    interests: [],
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDashboard(res.data);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700 dark:text-gray-200">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-blue-600 dark:text-blue-400 mb-8">
          My Career Dashboard
        </h1>

        {/* ✅ Grid Layout */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* ✅ Resume Score */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 flex flex-col items-center">
            <FileText className="text-blue-500 w-8 h-8 mb-3" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Resume Score
            </h2>
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  className="text-gray-300 dark:text-gray-700"
                  strokeWidth="6"
                  fill="transparent"
                />
                <motion.circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  className="text-green-500"
                  strokeWidth="6"
                  strokeLinecap="round"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 40}
                  strokeDashoffset={2 * Math.PI * 40}
                  animate={{
                    strokeDashoffset:
                      (2 * Math.PI * 40 * (100 - dashboard.resumeScore)) / 100,
                  }}
                  transition={{ duration: 1 }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-gray-700 dark:text-gray-200">
                {dashboard.resumeScore}%
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Optimized for ATS
            </p>
          </div>

          {/* ✅ AI Roadmap Progress */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 flex flex-col items-center">
            <TrendingUp className="text-purple-500 w-8 h-8 mb-3" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              AI Roadmap Progress
            </h2>
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  className="text-gray-300 dark:text-gray-700"
                  strokeWidth="6"
                  fill="transparent"
                />
                <motion.circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  className="text-blue-500"
                  strokeWidth="6"
                  strokeLinecap="round"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 40}
                  strokeDashoffset={2 * Math.PI * 40}
                  animate={{
                    strokeDashoffset:
                      (2 * Math.PI * 40 * (100 - dashboard.roadmapProgress)) / 100,
                  }}
                  transition={{ duration: 1 }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-gray-700 dark:text-gray-200">
                {dashboard.roadmapProgress}%
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Completed so far
            </p>
          </div>
        </div>

        {/* ✅ Career Interests */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mt-6">
          <div className="flex items-center gap-2 mb-4">
            <List className="text-yellow-500 w-5 h-5" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Your Career Interests
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {dashboard.interests.length > 0 ? (
              dashboard.interests.map((interest, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-white rounded-full text-sm"
                >
                  {interest}
                </span>
              ))
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                No interests saved yet.
              </p>
            )}
          </div>
        </div>

        {/* ✅ Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/resume-analyzer")}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <RefreshCw size={16} /> Re-analyze Resume
            </button>
            <button
              onClick={() => navigate("/ai-roadmap")}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <TrendingUp size={16} /> View AI Roadmap
            </button>
            <button
              onClick={() => navigate("/career-form")}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
            >
              <List size={16} /> Update Interests
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

