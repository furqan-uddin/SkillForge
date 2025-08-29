import { useEffect, useState } from "react";
import {
  Loader2,
  Search,
  ArrowLeft,
  Info,
  Layers,
  Link,
  BookOpen,
  ChevronDown,
  CloudUpload,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import API from "../utils/axiosInstance";

const SkillGap = () => {
  const [interestsInput, setInterestsInput] = useState("");
  const [availableInterests, setAvailableInterests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [noResume, setNoResume] = useState(false);
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/profile/me");
        setAvailableInterests(res.data?.interests || []);
      } catch {
        // silent fail - not blocking page load
      }
    };
    fetchProfile();
  }, []);

  const handleAnalyze = async (e) => {
    e?.preventDefault();

    const interests = (interestsInput || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (interests.length === 0) {
      toast.error("Please enter at least one interest to analyze.");
      return;
    }

    try {
      setLoading(true);
      setResult(null);
      const { data } = await API.post("/skill-gap", { interests });
      setResult(data);
      setNoResume(false);
    } catch (err) {
      if (err.response?.data?.message?.includes("No resume")) {
        setNoResume(true);
      } else {
        toast.error(err.response?.data?.message || "Failed to analyze skill gap.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.95 },
    show: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 py-8 md:py-12 px-4 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
      <Toaster position="top-center" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-2xl p-6 lg:p-10 shadow-lg transition-all duration-500 border border-gray-200 dark:border-gray-800"
      >
        {/* Back Button */}
        <motion.button
          onClick={() => navigate("/dashboard")}
          whileHover={{ x: -8 }}
          className="mb-6 md:mb-8 flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span className="font-medium">Back to Dashboard</span>
        </motion.button>

        {/* Header + Upload Button */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="bg-emerald-100 dark:bg-emerald-700 p-3 rounded-full">
              <Layers className="w-6 h-6 text-emerald-600 dark:text-emerald-300" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-gray-800 dark:text-white">
                Skill Gap Analysis
              </h1>
              <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-1 max-w-2xl">
                Identify missing skills to fill the gap between your resume and your career interests.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate("/resume-analyzer")}
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900 min-w-[150px]"
          >
            <CloudUpload className="w-4 h-4" />
            Upload new resume
          </button>
        </div>

        {/* Info Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div
            onClick={() => setIsInfoPanelOpen(!isInfoPanelOpen)}
            className="flex items-center justify-between p-4 cursor-pointer rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-semibold text-sm">
              <Info className="w-4 h-4" />
              <span>How Skill Gap Analysis Works</span>
            </div>
            <motion.div
              animate={{ rotate: isInfoPanelOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </motion.div>
          </div>
          <AnimatePresence>
            {isInfoPanelOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="p-4 bg-gray-50 dark:bg-gray-800 border-x border-b border-gray-200 dark:border-gray-700 rounded-b-lg overflow-hidden"
              >
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  We analyze your uploaded resume and compare it to the interests you
                  provide to identify missing skills and suggest relevant resources.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Conditional Content */}
        <AnimatePresence mode="wait">
          {noResume ? (
            // No Resume State
            <motion.div
              key="no-resume"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-10 px-6 bg-red-50 dark:bg-red-900 rounded-2xl border-2 border-dashed border-red-300 dark:border-red-700"
            >
              <div className="bg-red-100 dark:bg-red-700 p-4 rounded-full mx-auto w-fit mb-4">
                <Info className="w-8 h-8 text-red-600 dark:text-red-200" />
              </div>
              <p className="text-red-600 dark:text-red-300 mb-4 font-semibold text-lg">
                No resume found. Please upload one to begin your analysis.
              </p>
              <motion.button
                onClick={() => navigate("/resume-analyzer")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold transition-colors flex items-center justify-center gap-2 mx-auto"
              >
                <CloudUpload className="w-5 h-5" />
                Go to Resume Analyzer
              </motion.button>
            </motion.div>
          ) : (
            // Analysis Form
            <motion.div
              key="analysis-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <form onSubmit={handleAnalyze} className="space-y-4">
                <div>
                  <label
                    htmlFor="interests-input"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block"
                  >
                    Interests (comma separated)
                  </label>
                  <input
                    id="interests-input"
                    value={interestsInput}
                    onChange={(e) => setInterestsInput(e.target.value)}
                    placeholder={
                      availableInterests.length
                        ? `e.g., ${availableInterests.join(", ")}`
                        : "e.g., Fullstack, Cloud"
                    }
                    className="w-full px-5 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-gray-400 dark:placeholder-gray-600"
                  />
                </div>
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Analyze Skill Gap
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              key="results"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0 }}
              className="mt-12 space-y-6"
            >
              {/* Missing Skills */}
              <motion.div
                variants={itemVariants}
                className="p-4 sm:p-6 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-rose-100 dark:bg-rose-700 p-2 rounded-lg">
                    <Info className="w-5 h-5 text-rose-600 dark:text-rose-300" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">
                    Missing Skills
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {(result.missingSkills || []).length > 0 ? (
                    result.missingSkills.map((s, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 sm:px-4 sm:py-2 bg-rose-50 dark:bg-rose-900 text-rose-800 dark:text-rose-200 rounded-full text-xs sm:text-sm font-medium"
                      >
                        {s}
                      </span>
                    ))
                  ) : (
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900 rounded-xl text-emerald-800 dark:text-emerald-200 w-full text-center">
                      <p className="font-semibold">
                        No major skill gaps detected. You're on track! 🚀
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Recommended Resources */}
              <motion.div
                variants={itemVariants}
                className="p-4 sm:p-6 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-100 dark:bg-blue-700 p-2 rounded-lg">
                    <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">
                    Recommended Resources
                  </h2>
                </div>
                <div className="space-y-4">
                  {(result.resources || []).length > 0 ? (
                    result.resources.map((r, i) => (
                      <motion.a
                        key={i}
                        href={r.link}
                        target="_blank"
                        rel="noreferrer"
                        whileHover={{ y: -3, scale: 1.01 }}
                        className="block p-4 sm:p-5 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 flex items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-700 text-blue-600 dark:text-blue-200">
                            <Link className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          <div>
                            <p className="font-semibold text-base sm:text-lg text-gray-800 dark:text-white hover:underline transition-colors">
                              {r.skill}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                              {r.link}
                            </p>
                          </div>
                        </div>
                      </motion.a>
                    ))
                  ) : (
                    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-500 dark:text-gray-400 w-full text-center">
                      No resources recommended at this time.
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SkillGap;
