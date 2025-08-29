import { useEffect, useState } from "react";
import {
  Lightbulb,
  ArrowLeft,
  BrainCircuit,
  ChevronDown,
  Briefcase,
  Star,
  Zap,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import API from "../utils/axiosInstance";

const CareerInsights = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState(null);
  const [isDataPanelOpen, setIsDataPanelOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get("/dashboard");
        setDashboard(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        toast.error("Failed to load profile data. Try refreshing.");
      }
    };
    fetchDashboard();
  }, []);

  const handleGetInsights = async () => {
    if (!dashboard) {
      toast.error("Please wait until your profile data is loaded.");
      return;
    }

    try {
      setLoading(true);
      setInsights(null);

      const body = {
        resumeScore: dashboard?.resumeScore ?? 0,
        interests:
          dashboard?.interests?.length > 0 ? dashboard.interests : ["General"],
        streaks: dashboard?.currentStreak ?? 0,
        progress: dashboard?.roadmapProgress ?? 0,
      };

      const { data } = await API.post("/insights", body);
      setInsights(data);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to fetch insights.");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.98 },
    show: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 py-12 px-4 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
      <Toaster position="top-center" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xl border border-gray-200 dark:border-gray-800"
      >
        {/* Back button */}
        <motion.button
          onClick={() => navigate("/dashboard")}
          whileHover={{ x: -6 }}
          className="mb-6 flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span className="font-medium">Back to Dashboard</span>
        </motion.button>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
          <div className="bg-blue-100 dark:bg-blue-700 p-3 rounded-full">
            <Lightbulb className="w-7 h-7 text-blue-600 dark:text-blue-200" />
          </div>
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-gray-800 dark:text-white">
              Personalized Career Insights
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-2xl">
              Get role suggestions, certifications, and priority skills tailored
              to your profile.
            </p>
          </div>
        </div>

        {/* Data Panel */}
        {dashboard && (
          <div className="mb-8">
            <div
              className="flex items-center justify-between p-4 cursor-pointer rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setIsDataPanelOpen(!isDataPanelOpen)}
            >
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-semibold text-sm">
                <BrainCircuit className="w-4 h-4" />
                <span>Data Used to Generate Insights</span>
              </div>
              <motion.div
                animate={{ rotate: isDataPanelOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </motion.div>
            </div>

            <AnimatePresence>
              {isDataPanelOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="p-4 bg-gray-50 dark:bg-gray-800 border-x border-b border-gray-200 dark:border-gray-700 rounded-b-xl overflow-hidden"
                >
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-center gap-2">
                      <Zap className="w-3 h-3 text-blue-500" />
                      Resume Score:{" "}
                      <span className="font-bold text-gray-800 dark:text-gray-100">
                        {dashboard.resumeScore}
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Zap className="w-3 h-3 text-blue-500" />
                      Roadmap Progress:{" "}
                      <span className="font-bold text-gray-800 dark:text-gray-100">
                        {dashboard.roadmapProgress}%
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Zap className="w-3 h-3 text-blue-500" />
                      Current Streak:{" "}
                      <span className="font-bold text-gray-800 dark:text-gray-100">
                        {dashboard.currentStreak} days
                      </span>
                    </li>
                    <li className="md:col-span-2 flex items-center gap-2">
                      <Zap className="w-3 h-3 text-blue-500" />
                      Interests:{" "}
                      <span className="font-medium text-gray-700 dark:text-gray-200">
                        {dashboard.interests?.join(", ") || "Not set"}
                      </span>
                    </li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Action Button */}
        <motion.button
          onClick={handleGetInsights}
          disabled={loading || !dashboard}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full sm:w-auto mb-10 px-8 py-3 bg-blue-600 text-white rounded-full font-semibold flex items-center justify-center gap-3 shadow-lg hover:bg-blue-700 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <BrainCircuit className="w-5 h-5" />
          )}
          {loading ? "Generating Insights..." : "Generate My Insights"}
        </motion.button>

        {/* Insights Grid */}
        <AnimatePresence mode="wait">
          {insights ? (
            <motion.div
              key="insights-grid"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {/* Roles */}
              {insights.roles && (
                <motion.div
                  key="roles"
                  variants={itemVariants}
                  className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-100 dark:bg-blue-700 p-2 rounded-lg">
                      <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
                      Suggested Roles
                    </h3>
                  </div>
                  <ul className="space-y-4 text-sm">
                    {insights.roles.map((r, idx) => (
                      <li key={idx}>
                        <p className="font-bold text-gray-800 dark:text-gray-200">
                          {r.role}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 mt-0.5">
                          {r.description}
                        </p>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Certifications */}
              {insights.certifications && (
                <motion.div
                  key="certifications"
                  variants={itemVariants}
                  className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-green-100 dark:bg-green-700 p-2 rounded-lg">
                      <Star className="w-5 h-5 text-green-600 dark:text-green-300" />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
                      Certifications
                    </h3>
                  </div>
                  <ul className="space-y-4 text-sm">
                    {insights.certifications.map((c, idx) => (
                      <li key={idx}>
                        <p className="font-bold text-gray-800 dark:text-gray-200">
                          {c.certification}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 mt-0.5">
                          {c.provider}
                        </p>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Priority Skills */}
              {insights.prioritySkills && (
                <motion.div
                  key="skills"
                  variants={itemVariants}
                  className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-yellow-100 dark:bg-yellow-700 p-2 rounded-lg">
                      <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-300" />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
                      Priority Skills
                    </h3>
                  </div>
                  <ul className="space-y-3 text-sm">
                    {insights.prioritySkills.map((s, idx) => (
                      <li key={idx} className="text-gray-800 dark:text-gray-200">
                        {s}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </motion.div>
          ) : (
            /* Empty State */
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center p-12 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700"
            >
              <BrainCircuit className="mx-auto w-16 h-16 text-gray-400 dark:text-gray-600 mb-6" />
              <h3 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-200">
                Unlock Your Career Potential
              </h3>
              <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
                Click the <span className="font-semibold">"Generate My Insights"</span> button above
                to receive personalized recommendations based on your profile and progress.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default CareerInsights;
