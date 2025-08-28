// SKILLFORGE/src/pages/Home.jsx
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Brain, FileText, TrendingUp, Sparkles } from "lucide-react";
import illustration from "../assets/img.png";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-black text-gray-900 dark:text-white transition-all duration-300">
      
      {/* ✅ Hero Section */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-20 gap-10">
        
        {/* Left Section */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 max-w-xl text-center md:text-left"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-snug">
            Build Your Future with
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">
              {" "}AI-Powered Career Guidance
            </span>
          </h1>
          <p className="mb-8 text-lg md:text-xl text-gray-700 dark:text-gray-300">
            Personalized learning roadmaps, resume optimization, and smart career insights — 
            all powered by AI.
          </p>

          <div className="flex flex-col md:flex-row items-center gap-4 justify-center md:justify-start">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/login")}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:opacity-90 transition"
            >
              🚀 Get Started
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/dashboard")}
              className="px-6 py-3 rounded-lg border-2 border-blue-600 text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-50 dark:hover:bg-gray-800 transition"
            >
              View Dashboard
            </motion.button>
          </div>
        </motion.div>

        {/* Right Illustration */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 flex justify-center"
        >
          <img
            src={illustration}
            alt="Career Illustration"
            className="w-full max-w-md drop-shadow-2xl rounded-xl"
          />
        </motion.div>
      </div>

      {/* ✅ Features Section */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12">
          Why Choose <span className="text-blue-600">SkillForge</span>?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center transition"
          >
            <Brain className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-3">AI Career Planner</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Get personalized learning paths based on your interests and goals.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center"
          >
            <FileText className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-3">Smart Resume Analyzer</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Optimize your resume with actionable AI suggestions and ATS score.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center"
          >
            <TrendingUp className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-3">Progress Tracking</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Track your roadmap progress and career readiness in real-time.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ✅ Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-14 mt-16 text-center"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          Ready to Supercharge Your Career?
        </h2>
        <button
          onClick={() => navigate("/register")}
          className="px-8 py-3 bg-white text-blue-700 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition"
        >
          Start Now – It’s Free!
        </button>
      </motion.div>
    </div>
  );
};

export default Home;
