// src/pages/Dashboard.jsx

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, TrendingUp, Flame, List } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../utils/axiosInstance";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState({
    resumeScore: 0,
    roadmapProgress: 0,
    interests: [],
    currentStreak: 0,
    longestStreak: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get("/dashboard");
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
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-blue-600 dark:text-blue-400 mb-10">
          My Career Hub
        </h1>

        {/* ✅ Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Resume Score */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 flex flex-col items-center">
            <FileText className="text-green-500 w-8 h-8 mb-3" />
            <h2 className="text-lg font-semibold mb-2">Resume Score</h2>
            <p className="text-2xl font-bold">{dashboard.resumeScore}%</p>
            <p className="text-sm text-gray-500 mt-1">ATS Optimized</p>
          </div>

          {/* Roadmap Progress */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 flex flex-col items-center">
            <TrendingUp className="text-blue-500 w-8 h-8 mb-3" />
            <h2 className="text-lg font-semibold mb-2">Roadmap Progress</h2>
            <p className="text-2xl font-bold">{dashboard.roadmapProgress}%</p>
            <p className="text-sm text-gray-500 mt-1">Completed so far</p>
          </div>

          {/* Learning Streak */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 flex flex-col items-center">
            <Flame className="text-red-500 w-8 h-8 mb-3" />
            <h2 className="text-lg font-semibold mb-2">Learning Streak</h2>
            <p className="text-2xl font-bold">{dashboard.currentStreak} 🔥</p>
            <p className="text-sm text-gray-500">Current streak (days)</p>
            <p className="text-xs text-gray-400 mt-1">
              Longest: {dashboard.longestStreak} days
            </p>
          </div>
        </div>

        {/* ✅ Career Interests */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mt-8">
          <div className="flex items-center gap-2 mb-4">
            <List className="text-yellow-500 w-5 h-5" />
            <h2 className="text-lg font-semibold">Your Career Interests</h2>
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
              <p className="text-gray-500 text-sm">No interests saved yet.</p>
            )}
          </div>
        </div>

        {/* ✅ Preparation Tools */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Preparation Tools
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* JD Matcher */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
              <h3 className="text-xl font-semibold mb-2">JD Matcher</h3>
              <p className="text-sm text-gray-500 mb-4">
                Match your resume against job descriptions and identify missing
                skills.
              </p>
              <button
                onClick={() => navigate("/jd-matcher")}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
              >
                Open Tool
              </button>
            </div>

            {/* Interview Prep */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
              <h3 className="text-xl font-semibold mb-2">Interview Prep</h3>
              <p className="text-sm text-gray-500 mb-4">
                Practice AI-generated interview questions tailored to your
                career path.
              </p>
              <button
                onClick={() => navigate("/interview-prep")}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg"
              >
                Open Tool
              </button>
            </div>

            {/* Skill Gap Analyzer */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
              <h3 className="text-xl font-semibold mb-2">Skill Gap Analyzer</h3>
              <p className="text-sm text-gray-500 mb-4">
                Compare your skills with market demand and get learning
                suggestions.
              </p>
              <button
                onClick={() => navigate("/skill-gap")}
                className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg"
              >
                Open Tool
              </button>
            </div>

            {/* Career Insights */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
              <h3 className="text-xl font-semibold mb-2">Career Insights</h3>
              <p className="text-sm text-gray-500 mb-4">
                Explore AI-powered career paths, salaries, and growth
                opportunities.
              </p>
              <button
                onClick={() => navigate("/career-insights")}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
              >
                Open Tool
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
