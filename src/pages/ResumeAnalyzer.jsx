// SKILLFORGE/src/pages/ResumeAnalyzer.jsx
import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Upload, FileText, CheckCircle, Loader2, Lightbulb } from "lucide-react";

const ResumeAnalyzer = () => {
  const [resumeText, setResumeText] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    toast.success(`Selected file: ${e.target.files[0].name}`);
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim() && !file) {
      toast.error("⚠️ Please paste text or upload a resume file!");
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
        res = await axios.post("http://localhost:5000/api/analyze-resume", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await axios.post("http://localhost:5000/api/analyze-resume", {
          text: resumeText,
          userId,
        });
      }

      setAnalysis(res.data);
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
          Upload your resume (PDF/Word) or paste its content below to get instant analysis.
        </p>

        {/* ✅ Drag & Drop Style File Upload */}
        <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-xl cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition mb-4">
          <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-1" />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {file ? `📄 ${file.name}` : "Drag & drop or click to upload"}
          </span>
          <input type="file" accept=".pdf, .docx" className="hidden" onChange={handleFileChange} />
        </label>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">
          OR paste your resume text
        </p>

        {/* ✅ Resume Textarea */}
        <textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          rows={6}
          placeholder="Paste your resume text here..."
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />

        {/* ✅ Analyze Button */}
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
        >
          {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>

        {/* ✅ Show Analysis Result */}
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
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" /> Suggestions
            </h2>
            <div className="space-y-3">
              {analysis.suggestions.map((s, i) => (
                <div
                  key={i}
                  className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-gray-200 flex items-start gap-2"
                >
                  <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-1" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeAnalyzer;

