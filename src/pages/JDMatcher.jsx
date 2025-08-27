import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Percent, Tag, Link as LinkIcon, Loader2, ArrowLeft } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import API from "../utils/axiosInstance";

const JDMatcher = () => {
  const [jdText, setJdText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [noResume, setNoResume] = useState(false);
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
      if (err.response?.data?.message?.includes("No resume")) {
        setNoResume(true);
      } else {
        toast.error(err.response?.data?.message || "Failed to match JD. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-4 flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </button>

        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-6 h-6 text-blue-500" />
          <h1 className="text-xl font-bold">Resume ↔ Job Description Match</h1>
        </div>

        {noResume ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">No resume found. Please upload your resume first.</p>
            <button
              onClick={() => navigate("/resume-analyzer")}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Go to Resume Analyzer
            </button>
          </div>
        ) : (
          <form onSubmit={handleMatch} className="space-y-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-300">
              Using your uploaded resume from Resume Analyzer.{" "}
              <button
                type="button"
                onClick={() => navigate("/resume-analyzer")}
                className="text-blue-600 underline"
              >
                Upload new resume
              </button>
            </div>

            <div>
              <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block">Paste job description</label>
              <textarea
                rows={8}
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste the job description here..."
                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LinkIcon className="w-4 h-4" />}
              {loading ? "Matching..." : "Match JD"}
            </button>
          </form>
        )}

        {result && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3">
              <Percent className="w-6 h-6 text-green-500" />
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-300">Match Score</div>
                <div className="text-3xl font-bold">{result.matchScore ?? 0}%</div>
              </div>
            </div>

            <div>
              <div className="text-sm mb-2">Missing Keywords</div>
              <div className="flex flex-wrap gap-2">
                {(result.missingKeywords || []).length > 0 ? (
                  result.missingKeywords.map((k, i) => (
                    <span key={i} className="px-3 py-1 bg-red-100 dark:bg-red-600 text-red-700 dark:text-white rounded-full text-sm">
                      <Tag className="inline mr-1" /> {k}
                    </span>
                  ))
                ) : (
                  <div>No missing keywords — great match!</div>
                )}
              </div>
            </div>

            <div>
              <div className="text-sm mb-2">Suggestions</div>
              <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-200">
                {(result.suggestions || []).map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JDMatcher;
