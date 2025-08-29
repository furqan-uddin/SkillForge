import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
    Upload,
    CheckCircle,
    Loader2,
    Lightbulb,
    XCircle,
    FileText,
} from "lucide-react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import API from "../utils/axiosInstance";

const ResumeAnalyzer = () => {
    const [resumeText, setResumeText] = useState("");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null);

    // Handles file selection, preventing file upload if text is present
    const handleFileChange = (e) => {
        if (resumeText.trim()) {
            toast.error("❌ Clear pasted text first to upload a file!");
            e.target.value = null; // Clear the input so user can try again
            return;
        }
        setFile(e.target.files[0]);
        toast.success(`📄 Selected: ${e.target.files[0].name}`);
    };

    // Clears the selected file
    const clearFile = () => {
        setFile(null);
        toast("🗑 File removed, you can paste text now.");
    };

    // Clears the pasted text
    const clearText = () => {
        setResumeText("");
        toast("🗑 Text cleared, you can upload file now.");
    };

    // Main function to trigger the analysis API call
    const handleAnalyze = async () => {
        // Validation checks
        if (!resumeText.trim() && !file) {
            toast.error("⚠️ Please paste text or upload a resume file!");
            return;
        }
        if (!file && resumeText.trim().split(/\s+/).length < 50) {
            toast.error("❌ The provided text is too short. Please provide at least 50 words.");
            return;
        }

        try {
            setLoading(true);
            setAnalysis(null); // Clear previous analysis results

            let res;
            if (file) {
                // Prepare form data for file upload
                const formData = new FormData();
                formData.append("file", file);
                res = await API.post("/analyze-resume", formData);
            } else {
                // Send plain text for analysis
                res = await API.post("/analyze-resume", { text: resumeText });
            }

            // Check for valid suggestions in the response
            if (!res.data.suggestions?.length) {
                toast.error("❌ No meaningful suggestions found. Try a different resume.");
                setAnalysis(null);
                return;
            }

            // Update state with the new analysis
            setAnalysis({
                score: res.data.score,
                suggestions: res.data.suggestions,
            });

            toast.success("✅ Resume analyzed successfully!");
        } catch (error) {
            console.error("Error analyzing resume:", error);
            toast.error("❌ Failed to analyze resume. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-black text-gray-900 dark:text-white flex justify-center py-6 px-4 sm:px-6">
            <Toaster position="top-center" />

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

                {/* Results Section */}
                <AnimatePresence>
                    {analysis && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="mt-12 p-6 sm:p-8 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700"
                        >
                            {/* Score Display (Updated) */}
                            <div className="flex flex-col items-center justify-center gap-4 mb-6">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
                                    Resume Score
                                </h2>
                                <div className="w-32 h-32">
                                    <CircularProgressbar
                                        value={analysis.score}
                                        text={`${analysis.score}%`}
                                        styles={buildStyles({
                                            pathColor: analysis.score > 75 ? '#22c55e' : analysis.score > 50 ? '#eab308' : '#ef4444',
                                            textColor: analysis.score > 75 ? '#22c55e' : analysis.score > 50 ? '#eab308' : '#ef4444',
                                            trailColor: '#e5e7eb',
                                            strokeLinecap: 'round',
                                            pathTransitionDuration: 0.5,
                                        })}
                                    />
                                </div>
                            </div>

                            {/* Suggestions List */}
                            <div>
                                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-800 dark:text-white">
                                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                                    Suggestions for Improvement
                                </h3>
                                <ul className="space-y-4">
                                    {analysis.suggestions.map((s, i) => (
                                        <motion.li
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1, duration: 0.3 }}
                                            className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
                                        >
                                            <p className="text-sm text-gray-800 dark:text-gray-200">
                                                {s}
                                            </p>
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default ResumeAnalyzer;
