import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    FileText,
    TrendingUp,
    Flame,
    List,
    ArrowRight,
    Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../utils/axiosInstance";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

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

    // Helper function to get full Tailwind class strings
    // This is necessary because Tailwind's JIT compiler needs to see the full class name
    // in the source code. It cannot parse dynamic strings like `bg-${tool.color}-600`.
    const getButtonClasses = (color) => {
        switch (color) {
            case "indigo":
                return "bg-indigo-600 hover:bg-indigo-700";
            case "orange":
                return "bg-orange-600 hover:bg-orange-700";
            case "pink":
                return "bg-pink-600 hover:bg-pink-700";
            case "purple":
                return "bg-purple-600 hover:bg-purple-700";
            default:
                return "bg-gray-600 hover:bg-gray-700";
        }
    };

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                // Original API call to get dashboard data
                const res = await API.get("/dashboard");
                setDashboard(res.data);
            } catch (error) {
                console.error("Error fetching dashboard:", error);
                // Handle the case where the API call fails by setting a default state
                setDashboard({
                    resumeScore: 0,
                    roadmapProgress: 0,
                    interests: ["Data Science", "Web Development", "UI/UX Design"],
                    currentStreak: 0,
                    longestStreak: 0,
                });
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full"
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-950 text-gray-900 dark:text-white py-12 px-6">
            <div className="max-w-6xl mx-auto">
                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.7 }}
                    className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mb-4"
                >
                    My Career Hub
                </motion.h1>
                <p className="text-center text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12">
                    Track your progress and explore AI-powered tools for your career
                    growth. 🚀
                </p>

                {/* Stats Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Resume Score */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl shadow-xl p-6 flex flex-col items-center border border-gray-200/40 dark:border-gray-700/40 transition"
                    >
                        <div className="w-24 h-24 mb-4">
                            <CircularProgressbar
                                value={dashboard.resumeScore}
                                text={`${dashboard.resumeScore}%`}
                                styles={buildStyles({
                                    pathColor: "#22c55e",
                                    textColor: "#22c55e",
                                    trailColor: "#e5e7eb",
                                })}
                            />
                        </div>
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <FileText className="text-green-500 w-5 h-5" /> Resume Score
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">ATS Optimized</p>
                    </motion.div>

                    {/* Roadmap Progress */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl shadow-xl p-6 flex flex-col items-center border border-gray-200/40 dark:border-gray-700/40 transition"
                    >
                        <div className="w-24 h-24 mb-4">
                            <CircularProgressbar
                                value={dashboard.roadmapProgress}
                                text={`${dashboard.roadmapProgress}%`}
                                styles={buildStyles({
                                    pathColor: "#3b82f6",
                                    textColor: "#3b82f6",
                                    trailColor: "#e5e7eb",
                                })}
                            />
                        </div>
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <TrendingUp className="text-blue-500 w-5 h-5" /> Roadmap Progress
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">Completed so far</p>
                    </motion.div>

                    {/* Learning Streak */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl shadow-xl p-6 flex flex-col items-center border border-gray-200/40 dark:border-gray-700/40 transition"
                    >
                        <Flame className="text-red-500 w-12 h-12 mb-3 animate-pulse" />
                        <h2 className="text-lg font-semibold">Learning Streak</h2>
                        <p className="text-3xl font-bold">{dashboard.currentStreak} 🔥</p>
                        <p className="text-sm text-gray-500">Current streak (days)</p>
                        <p className="text-xs text-gray-400 mt-1">
                            Longest: {dashboard.longestStreak} days
                        </p>
                    </motion.div>
                </div>

                {/* Career Interests */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg p-6 mt-14 border border-gray-200/40 dark:border-gray-700/40"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <List className="text-yellow-500 w-6 h-6" />
                        <h2 className="text-xl font-semibold">Your Career Interests</h2>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {dashboard.interests.length > 0 ? (
                            dashboard.interests.map((interest, idx) => (
                                <motion.span
                                    key={idx}
                                    whileHover={{ scale: 1.1 }}
                                    className="px-4 py-1.5 bg-gradient-to-r from-indigo-100 to-blue-100 text-blue-700 dark:from-indigo-600 dark:to-blue-600 dark:text-white rounded-full text-sm shadow-md flex items-center gap-1"
                                >
                                    <Sparkles className="w-3 h-3 text-yellow-400" />
                                    {interest}
                                </motion.span>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm italic">
                                ✨ No interests saved yet. Add some in your profile to see them
                                here!
                            </p>
                        )}
                    </div>
                </motion.div>

                {/* Preparation Tools */}
                <div className="mt-16">
                    <h2 className="text-2xl font-semibold mb-8 text-center">
                        Preparation Tools
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {[
                            {
                                title: "JD Matcher",
                                desc: "Match your resume against job descriptions and identify missing skills.",
                                color: "indigo",
                                path: "/jd-matcher",
                            },
                            {
                                title: "Interview Prep",
                                desc: "Practice AI-generated interview questions tailored to your career path.",
                                color: "orange",
                                path: "/interview-prep",
                            },
                            {
                                title: "Skill Gap Analyzer",
                                desc: "Compare your skills with market demand and get learning suggestions.",
                                color: "pink",
                                path: "/skill-gap",
                            },
                            {
                                title: "Career Insights",
                                desc: "Explore AI-powered career paths, salaries, and growth opportunities.",
                                color: "purple",
                                path: "/career-insights",
                            },
                        ].map((tool, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ scale: 1.03 }}
                                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-2xl shadow-xl border border-gray-200/40 dark:border-gray-700/40 p-6 flex flex-col justify-between"
                            >
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">{tool.title}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                        {tool.desc}
                                    </p>
                                </div>
                                <button
                                    onClick={() => navigate(tool.path)}
                                    className={`flex items-center gap-2 px-5 py-2 text-white rounded-full shadow-md transition ${getButtonClasses(tool.color)}`}
                                >
                                    Open Tool <ArrowRight size={16} />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
