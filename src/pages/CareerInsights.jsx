import { useEffect, useState } from "react";
import { Lightbulb, Award, Target } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import API from "../utils/axiosInstance";

const CareerInsights = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get("/dashboard");
        setDashboard(res.data);
      } catch (err) {
        // ignore errors (401 handled globally)
      }
    };
    fetchDashboard();
  }, []);

  const handleGetInsights = async () => {
    try {
      setLoading(true);
      setInsights(null);
      const body = {
        resumeScore: dashboard?.resumeScore ?? 0,
        interests: dashboard?.interests ?? [],
        streaks: dashboard?.currentStreak ?? 0,
        progress: dashboard?.roadmapProgress ?? 0,
      };
      const { data } = await API.post("/insights", body);
      setInsights(data);
    } catch (err) {
      console.error("Insights error:", err);
      toast.error("Failed to fetch insights.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 text-gray-900 dark:text-white">
      <Toaster position="top-center" />
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <Lightbulb className="w-6 h-6 text-yellow-500" />
          <h1 className="text-xl font-bold">Personalized Career Insights</h1>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Generate role suggestions, certifications, and priority skills based
            on your profile.
          </p>
        </div>

        <div className="flex gap-3 mb-4">
          <button
            onClick={handleGetInsights}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
          >
            {loading ? "Loading..." : <Target className="w-4 h-4" />}{" "}
            {loading ? "Getting insights..." : "Get Insights"}
          </button>
        </div>

        {insights && (
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-purple-500" />
                <div className="font-semibold">Suggested Roles</div>
              </div>
              <ul className="list-disc list-inside text-sm mt-2">
                {(insights.roles || []).map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="font-semibold">Certifications</div>
              </div>
              <ul className="list-disc list-inside text-sm mt-2">
                {(insights.certifications || []).map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-blue-500" />
                <div className="font-semibold">Priority Skills</div>
              </div>
              <ul className="list-disc list-inside text-sm mt-2">
                {(insights.prioritySkills || []).map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {!insights && (
          <div className="mt-6 text-center text-sm text-gray-500">
            Click "Get Insights" to generate personalized career guidance.
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerInsights;
