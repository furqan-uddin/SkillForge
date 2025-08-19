// SKILLFORGE/src/pages/ResumeAnalyzer.jsx
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  Upload,
  FileText,
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

  // ✅ File Change (Mutually Exclusive)
  const handleFileChange = (e) => {
    if (resumeText.trim()) {
      toast.error("❌ Clear pasted text first to upload a file!");
      return;
    }
    setFile(e.target.files[0]);
    toast.success(`Selected file: ${e.target.files[0].name}`);
  };

  const clearFile = () => {
    setFile(null);
    toast("🗑 File removed, you can paste text now.");
  };

  const clearText = () => {
    setResumeText("");
    toast("🗑 Text cleared, you can upload file now.");
  };

  // ✅ Clean & Format Suggestions
  // ✅ Clean & Format Suggestions (fixed for both string & array)
const formatSuggestions = (rawText) => {
  if (!rawText) return [];

  // ✅ Convert arrays to string first
  let text =
    Array.isArray(rawText) ? rawText.join(" ") : rawText.toString();

  // ✅ Remove any "Here are X suggestions" intro
  let cleaned = text
    .replace(/Here are.*suggestions.*:/i, "")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // ✅ Split into meaningful suggestion parts
  let parts = cleaned
    .split(/(?=\*\*.*?\*\*:)|(?=\d+\.\s)|(?=\d+\:\s)/g)
    .map((p) => p.trim())
    .filter((p) => p.length > 5);

  return parts.map((p) =>
    p.replace(
      /\*\*(.*?)\*\*/g,
      "<strong class='font-semibold text-blue-600 dark:text-blue-400'>$1</strong>"
    )
  );
};


  // ✅ Analyze Resume
  const handleAnalyze = async () => {
    if (!resumeText.trim() && !file) {
      toast.error("⚠️ Please paste text or upload a resume file!");
      return;
    }

    // ✅ Word count validation
    const textToCheck = resumeText.trim();
    if (!file && textToCheck.split(/\s+/).length < 50) {
      toast.error("❌ Please provide a detailed resume (at least 50 words).");
      return;
    }

    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?._id || user?.id;

      let res;
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("userId", userId);
        res = await API.post("/analyze-resume",formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        res = await API.post("/analyze-resume", {text: resumeText,userId,});
      }

      if (!res.data.suggestions || res.data.suggestions.length === 0) {
        toast.error("❌ No meaningful suggestions found. Try refining your resume.");
        setAnalysis(null);
        return;
      }

      setAnalysis({
        score: res.data.score,
        suggestions: formatSuggestions(res.data.suggestions),
      });

      toast.success("✅ Resume analyzed successfully!");
    } catch (error) {
      console.error("Error analyzing resume:", error);
      toast.error("❌ Failed to analyze resume. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex justify-center py-10 px-4">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center text-blue-600 dark:text-blue-400 mb-4">
          Resume Analyzer
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
          Upload your resume (PDF/Word) <strong>OR</strong> paste its content
          below.
        </p>

        {/* ✅ File Upload */}
        <label
          className={`flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-xl cursor-pointer transition mb-4 ${
            resumeText
              ? "opacity-40 cursor-not-allowed"
              : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
          }`}
        >
          <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-1" />
          <span className="text-sm text-gray-600 dark:text-gray-300">
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
            className="w-full mb-4 flex items-center justify-center gap-2 text-sm text-red-600 hover:text-red-800"
          >
            <XCircle className="w-4 h-4" /> Remove File
          </button>
        )}

        {/* ✅ OR Text Area */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">
          OR paste your resume text
        </p>

        <textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          rows={6}
          placeholder="Paste your resume text here..."
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 disabled:opacity-40"
          disabled={file}
        />

        {resumeText.trim() && (
          <button
            onClick={clearText}
            className="w-full mb-4 flex items-center justify-center gap-2 text-sm text-red-600 hover:text-red-800"
          >
            <XCircle className="w-4 h-4" /> Clear Text
          </button>
        )}

        {/* ✅ Analyze Button */}
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="animate-spin w-5 h-5" />
          ) : (
            <CheckCircle className="w-5 h-5" />
          )}
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>

        {/* ✅ Analysis Result */}
        {analysis && (
          <div className="mt-8">
            {/* ✅ Circular Score */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-28 h-28">
                <svg className="w-28 h-28 transform -rotate-90">
                  <circle
                    className="text-gray-300 dark:text-gray-700"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="48"
                    cx="56"
                    cy="56"
                  />
                  <circle
                    className="text-blue-600 dark:text-blue-400"
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 48}`}
                    strokeDashoffset={`${
                      2 * Math.PI * 48 * (1 - analysis.score / 100)
                    }`}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="48"
                    cx="56"
                    cy="56"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-xl font-bold">
                  {analysis.score}%
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mt-2">
                Resume Score
              </p>
            </div>

            {/* ✅ Suggestions */}
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" /> Suggestions to
              Improve
            </h2>

            <div className="space-y-3">
              {analysis.suggestions.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 bg-gradient-to-r from-blue-50 to-white dark:from-gray-700 dark:to-gray-600 rounded-xl shadow flex items-start gap-3 border border-gray-200 dark:border-gray-600"
                >
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1" />
                  <p
                    className="text-gray-800 dark:text-gray-200 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: s }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
