import { useEffect, useState } from "react";
import { Loader2, Search, BookOpen, ArrowLeft } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import API from "../utils/axiosInstance";

const SkillGap = () => {
  const [interestsInput, setInterestsInput] = useState("");
  const [availableInterests, setAvailableInterests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [noResume, setNoResume] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/profile/me");
        setAvailableInterests(res.data?.interests || []);
      } catch (err) {}
    };
    fetchProfile();
  }, []);

  const handleAnalyze = async (e) => {
    e?.preventDefault();
    const interests = (interestsInput || "").split(",").map(s => s.trim()).filter(Boolean);

    try {
      setLoading(true);
      setResult(null);
      const { data } = await API.post("/skill-gap", { interests });
      setResult(data);
      setNoResume(false);
    } catch (err) {
      if (err.response?.data?.message?.includes("No resume")) setNoResume(true);
      else toast.error(err.response?.data?.message || "Failed to analyze skill gap.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 text-gray-900 dark:text-white">
      <Toaster position="top-center" />
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">

        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-4 flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </button>

        <div className="flex items-center gap-3 mb-4">
          <Search className="w-6 h-6 text-blue-500" />
          <h1 className="text-xl font-bold">Skill Gap Analysis</h1>
        </div>

        {noResume ? (
          <div className="text-center py-8 bg-red-50 dark:bg-red-900 rounded-lg">
            <p className="text-red-600 dark:text-red-300 mb-4 font-semibold">No resume found. Please upload your resume first.</p>
            <button
              onClick={() => navigate("/resume-analyzer")}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Go to Resume Analyzer
            </button>
          </div>
        ) : (
          <form onSubmit={handleAnalyze} className="space-y-4">
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
              <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block">Interests (comma separated)</label>
              <input
                value={interestsInput}
                onChange={(e) => setInterestsInput(e.target.value)}
                placeholder={availableInterests.length ? `Try: ${availableInterests.join(", ")}` : "e.g., Fullstack, Cloud"}
                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <BookOpen className="w-4 h-4" />}
              {loading ? "Analyzing..." : "Analyze Skill Gap"}
            </button>
          </form>
        )}

        {result && (
          <div className="mt-6 space-y-6">
            <div>
              <div className="text-sm mb-2 font-semibold">Missing Skills</div>
              <div className="flex flex-wrap gap-2">
                {(result.missingSkills || []).length > 0
                  ? result.missingSkills.map((s, i) => (
                      <span key={i} className="px-3 py-1 bg-red-100 dark:bg-red-600 text-red-700 dark:text-white rounded-full text-sm shadow-sm">{s}</span>
                    ))
                  : <div className="text-gray-500 dark:text-gray-300">No major gaps detected.</div>}
              </div>
            </div>

            <div>
              <div className="text-sm mb-2 font-semibold">Recommended Resources</div>
              <div className="space-y-2">
                {(result.resources || []).map((r, i) => (
                  <a key={i} href={r.link} target="_blank" rel="noreferrer" className="block p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:shadow-md transition">
                    <div className="font-semibold">{r.skill}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-300 truncate">{r.link}</div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillGap;
