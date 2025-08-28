// SKILLFORGE/src/pages/ResumeAnalyzer.jsx
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  Upload,
  CheckCircle,
  Loader2,
  Lightbulb,
  XCircle,
} from "lucide-react";
import API from "../utils/axiosInstance";

const ResumeAnalyzer = () => {
  const [resumeText, setResumeText] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleFileChange = (e) => {
    if (resumeText.trim()) {
      toast.error("❌ Clear pasted text first to upload a file!");
      return;
    }
    setFile(e.target.files[0]);
    toast.success(`📄 Selected: ${e.target.files[0].name}`);
  };

  const clearFile = () => {
    setFile(null);
    toast("🗑 File removed, you can paste text now.");
  };

  const clearText = () => {
    setResumeText("");
    toast("🗑 Text cleared, you can upload file now.");
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim() && !file) {
      toast.error("⚠️ Please paste text or upload a resume file!");
      return;
    }
    if (!file && resumeText.trim().split(/\s+/).length < 50) {
      toast.error("❌ Please provide at least 50 words.");
      return;
    }

    try {
      setLoading(true);
      let res;
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        res = await API.post("/analyze-resume", formData);
      } else {
        res = await API.post("/analyze-resume", { text: resumeText });
      }

      if (!res.data.suggestions?.length) {
        toast.error("❌ No meaningful suggestions found.");
        setAnalysis(null);
        return;
      }

      setAnalysis({
        score: res.data.score,
        suggestions: res.data.suggestions,
      });

      toast.success("✅ Resume analyzed successfully!");
    } catch (error) {
      console.error("Error analyzing resume:", error);
      toast.error("❌ Failed to analyze resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-black text-gray-900 dark:text-white flex justify-center py-6 px-4 sm:px-6">
      <Toaster position="top-center" reverseOrder={false} />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl p-5 sm:p-8 border border-gray-200/40 dark:border-gray-700/40"
      >
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600 mb-3">
          Resume Analyzer
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 text-sm sm:text-base max-w-md mx-auto">
          Upload your resume <strong>(PDF/Word)</strong> or paste its content below for instant AI feedback.
        </p>

        {/* Upload Area */}
        <label
          className={`flex flex-col items-center justify-center w-full h-28 sm:h-32 border-2 border-dashed rounded-xl cursor-pointer transition mb-5 sm:mb-6 p-3 text-center ${
            resumeText
              ? "opacity-40 cursor-not-allowed"
              : "bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600"
          }`}
        >
          <Upload className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400 mb-2" />
          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate max-w-[90%]">
            {file ? `📄 ${file.name}` : "Drag & drop or click to upload"}
          </span>
          <input
            type="file"
            accept=".pdf, .docx"
            className="hidden"
            onChange={handleFileChange}
            disabled={resumeText.trim()}
          />
        </label>

        {file && (
          <button
            onClick={clearFile}
            className="w-full mb-5 flex items-center justify-center gap-2 text-xs sm:text-sm text-red-600 hover:text-red-800 transition"
          >
            <XCircle className="w-4 h-4" /> Remove File
          </button>
        )}

        {/* OR Divider */}
        <div className="flex items-center my-4 sm:my-6">
          <div className="flex-grow h-px bg-gray-300 dark:bg-gray-600"></div>
          <span className="px-2 sm:px-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            OR
          </span>
          <div className="flex-grow h-px bg-gray-300 dark:bg-gray-600"></div>
        </div>

        {/* Text Area */}
        <textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          rows={5}
          className="w-full p-3 sm:p-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-sm sm:text-base text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3 disabled:opacity-40 resize-none"
          placeholder="Paste your resume text here..."
          disabled={file}
        />

        {resumeText.trim() && (
          <button
            onClick={clearText}
            className="w-full mb-5 flex items-center justify-center gap-2 text-xs sm:text-sm text-red-600 hover:text-red-800 transition"
          >
            <XCircle className="w-4 h-4" /> Clear Text
          </button>
        )}

        {/* Analyze Button */}
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full flex justify-center items-center gap-3 bg-blue-600 text-white py-2.5 sm:py-3 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-60 text-sm sm:text-base shadow-md"
        >
          {loading ? (
            <Loader2 className="animate-spin w-5 h-5 sm:w-6 sm:h-6" />
          ) : (
            <>
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>Analyze Resume</span>
            </>
          )}
        </button>

        {/* Results */}
        {analysis && (
          <div className="mt-8 sm:mt-10">
            {/* Score Ring */}
            <div className="flex flex-col items-center mb-6 sm:mb-8">
              <div className="relative w-32 sm:w-40 md:w-48 aspect-square">
                <svg viewBox="0 0 128 128" className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    strokeWidth="10"
                    stroke="currentColor"
                    className="text-gray-300 dark:text-gray-700"
                    fill="transparent"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    strokeWidth="10"
                    strokeLinecap="round"
                    fill="transparent"
                    stroke="currentColor"
                    className={`${
                      analysis.score > 75
                        ? "text-green-500"
                        : analysis.score > 50
                        ? "text-yellow-400"
                        : "text-red-500"
                    }`}
                    strokeDasharray={2 * Math.PI * 58}
                    strokeDashoffset={2 * Math.PI * 58 * (1 - analysis.score / 100)}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-lg sm:text-2xl md:text-3xl font-bold">
                  {analysis.score}%
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mt-2 text-sm sm:text-base">
                Resume Score
              </p>
            </div>

            {/* Suggestions */}
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" /> Suggestions
            </h2>

            <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-50 via-white to-blue-50 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700 rounded-xl shadow-md border border-gray-200 dark:border-gray-600 max-h-64 sm:max-h-72 overflow-y-auto">
              <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed">
                {analysis.suggestions.map((s, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="hover:bg-blue-100 dark:hover:bg-gray-600 p-2 rounded transition-all"
                  >
                    {s}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ResumeAnalyzer;
