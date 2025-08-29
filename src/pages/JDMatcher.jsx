import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Percent,
  Tag,
  Loader2,
  ArrowLeft,
  Info,
  ChevronDown,
  CloudUpload,
  Tally4,
  Layers,
  BookOpen,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import API from "../utils/axiosInstance";

const JDMatcher = () => {
  const [jdText, setJdText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [noResume, setNoResume] = useState(false);
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false);
  const navigate = useNavigate();

  const handleMatch = async (e) => {
    e?.preventDefault();
    if (!jdText.trim()) {
      toast.error("Please paste the job description.");
      return;
    }
    try {
      setLoading(true);
      setResult(null);
      const { data } = await API.post("/match-jd", { jdText });
      setResult(data);
      setNoResume(false);
    } catch (err) {
      if (err.response?.data?.message?.includes("No resume")) setNoResume(true);
      else toast.error(err.response?.data?.message || "Failed to match JD. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.95 },
    show: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 py-12 px-4 text-gray-900 dark:text-gray-100 transition-colors">
      <Toaster position="top-center" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xl border border-gray-200 dark:border-gray-800"
      >
        {/* Back Button */}
        <motion.button
          onClick={() => navigate("/dashboard")}
          whileHover={{ x: -6 }}
          className="mb-6 flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span className="font-medium">Back to Dashboard</span>
        </motion.button>

        {/* Header + Resume Upload */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 dark:bg-blue-700 p-3 rounded-full">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-gray-800 dark:text-white">
                Resume ↔ Job Match
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-2xl">
                See how well your resume aligns with a specific job description.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate("/resume-analyzer")}
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
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
            className="flex items-center justify-between p-4 cursor-pointer rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={() => setIsInfoPanelOpen(!isInfoPanelOpen)}
          >
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-semibold text-sm">
              <Info className="w-4 h-4" />
              <span>How JD Match Works</span>
            </div>
            <motion.div animate={{ rotate: isInfoPanelOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
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
                className="p-4 bg-gray-50 dark:bg-gray-800 border-x border-b border-gray-200 dark:border-gray-700 rounded-b-xl text-xs text-gray-600 dark:text-gray-400"
              >
                We calculate a <b>Match Score</b> by analyzing your uploaded resume
                against the job description you provide. The score is based on
                overlapping keywords, required skills, and relevance to the role.
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Form or No Resume */}
        <AnimatePresence mode="wait">
          {noResume ? (
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
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold flex items-center justify-center gap-2 mx-auto shadow-md"
              >
                <CloudUpload className="w-5 h-5" />
                Go to Resume Analyzer
              </motion.button>
            </motion.div>
          ) : (
            <motion.form
              key="analysis-form"
              onSubmit={handleMatch}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <label
                htmlFor="jd-text"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 block"
              >
                Paste job description
              </label>
              <textarea
                id="jd-text"
                rows={8}
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste the job description here..."
                className="w-full px-5 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 dark:placeholder-gray-600"
              />
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-full font-semibold flex items-center justify-center gap-2 shadow-md hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Matching...
                  </>
                ) : (
                  <>
                    <Tally4 className="w-5 h-5" />
                    Match JD
                  </>
                )}
              </motion.button>
            </motion.form>
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
              className="mt-12 space-y-10"
            >
              {/* Match Score */}
              <motion.div
                variants={itemVariants}
                className="p-6 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-100 dark:bg-blue-700 p-2 rounded-lg">
                    <Percent className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Match Score
                  </h2>
                </div>
                <div className="text-5xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
                  {result.matchScore ?? 0}%
                </div>
              </motion.div>

              {/* Missing Keywords */}
              <motion.div
                variants={itemVariants}
                className="p-6 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-rose-100 dark:bg-rose-700 p-2 rounded-lg">
                    <Layers className="w-5 h-5 text-rose-600 dark:text-rose-300" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Missing Keywords
                  </h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  {(result.missingKeywords || []).length > 0 ? (
                    result.missingKeywords.map((k, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 bg-rose-50 dark:bg-rose-900 text-rose-800 dark:text-rose-200 rounded-full text-sm font-medium flex items-center gap-1"
                      >
                        <Tag className="w-4 h-4" /> {k}
                      </span>
                    ))
                  ) : (
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900 rounded-xl text-emerald-800 dark:text-emerald-200 w-full text-center">
                      <p className="font-semibold">
                        No missing keywords found. You're a perfect match! ✨
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Suggestions */}
              <motion.div
                variants={itemVariants}
                className="p-6 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-100 dark:bg-green-700 p-2 rounded-lg">
                    <BookOpen className="w-5 h-5 text-green-600 dark:text-green-300" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Suggestions
                  </h2>
                </div>
                <ul className="space-y-3 text-gray-700 dark:text-gray-200">
                  {(result.suggestions || []).length > 0 ? (
                    result.suggestions.map((s, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-green-500 dark:text-green-400">•</span>
                        <span>{s}</span>
                      </li>
                    ))
                  ) : (
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900 rounded-xl text-emerald-800 dark:text-emerald-200 w-full text-center">
                      <p className="font-semibold">
                        Your resume is already highly optimized. Great job! 👍
                      </p>
                    </div>
                  )}
                </ul>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default JDMatcher;
