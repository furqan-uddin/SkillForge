// SKILLFORGE/src/pages/Home.jsx
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Brain, FileText, TrendingUp, Sparkles } from "lucide-react";
import illustration from "../assets/img.png"
const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white transition-all duration-300">
      {/* ✅ Hero Section */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-16">
        {/* Left Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 max-w-xl text-center md:text-left"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-snug">
            Build Your Future with
            <span className="text-blue-500"> AI-Powered Career Guidance</span>
          </h1>
          <p className="mb-8 text-lg md:text-xl text-gray-700 dark:text-gray-300">
            Personalized learning roadmaps, resume optimization, and smart career insights — all driven by advanced AI.
          </p>
          <div className="flex flex-col md:flex-row items-center gap-4 justify-center md:justify-start">
            <button
              onClick={() => navigate("/career-form")}
              className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow-md"
            >
              🚀 Get Started
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-6 py-3 rounded-lg border border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-gray-800 transition"
            >
              View Dashboard
            </button>
          </div>
        </motion.div>

        {/* Right Illustration */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 mt-10 md:mt-0 flex justify-center"
        >
          <img
            src={illustration}
            alt="Career Illustration"
            className="w-full max-w-md drop-shadow-lg rounded-lg"
          />
        </motion.div>
      </div>

      {/* ✅ Features Section */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-12">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200 mb-10">
          Why Choose <span className="text-blue-500">SkillForge</span>?
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center"
          >
            <Brain className="w-10 h-10 text-purple-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">AI Career Planner</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Get personalized learning paths based on your interests and goals.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center"
          >
            <FileText className="w-10 h-10 text-green-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">Smart Resume Analyzer</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Optimize your resume with actionable AI suggestions and ATS score.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center"
          >
            <TrendingUp className="w-10 h-10 text-blue-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">Progress Tracking</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Track your roadmap progress and career readiness in real-time.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ✅ Call to Action */}
      <div className="bg-blue-700 text-white py-10 mt-10 text-center">
        <h2 className="text-2xl font-semibold mb-4">
          Ready to Supercharge Your Career?
        </h2>
        <button
          onClick={() => navigate("/career-form")}
          className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition"
        >
          Start Now – It’s Free!
        </button>
      </div>
    </div>
  );
};

export default Home;
