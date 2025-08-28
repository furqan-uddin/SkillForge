import { useEffect, useState } from "react";
import { Lightbulb, Award, Target, ArrowLeft } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import API from "../utils/axiosInstance";

const CareerInsights = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get("/dashboard");
        setDashboard(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
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
      console.error(err);
      toast.error("Failed to fetch insights.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Overall container with a subtle background gradient for a softer look
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 py-10 px-4 text-gray-900 dark:text-gray-100 font-sans">
      <Toaster position="top-center" />
      
      {/* Main content card with enhanced shadow and rounded corners */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-2xl transition-all duration-300">

        {/* Back Button with a more prominent hover effect */}
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-6 flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span className="font-medium">Back to Dashboard</span>
        </button>

        {/* Header section with a more visually appealing layout */}
        <div className="flex items-center gap-4 mb-3">
          <div className="bg-yellow-100 dark:bg-yellow-700 p-3 rounded-full">
            <Lightbulb className="w-6 h-6 text-yellow-500 dark:text-yellow-200" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Personalized Career Insights</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl">
          Generate professional role suggestions, certifications, and priority skills based on your profile's data.
        </p>

        {/* Action button with a dynamic loading state and hover animation */}
        <button
          onClick={handleGetInsights}
          disabled={loading}
          className="mb-8 px-8 py-3 bg-blue-600 text-white rounded-full font-semibold flex items-center gap-2 hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <Target className="w-5 h-5" />
          )}
          {loading ? "Loading Insights..." : "Generate My Insights"}
        </button>

        {insights ? (
          // Content sections with improved card design and spacing
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Suggested Roles card */}
            {insights.roles && (
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-purple-100 dark:bg-purple-700 p-2 rounded-lg">
                    <Award className="w-5 h-5 text-purple-600 dark:text-purple-300" />
                  </div>
                  <div className="font-semibold text-lg">Suggested Roles</div>
                </div>
                <ul className="list-disc list-inside text-sm space-y-3">
                  {(insights.roles || []).map((r, i) => (
                    <li key={i}>
                      <span className="font-bold">{r.role}</span>
                      <span className="text-gray-600 dark:text-gray-400">: {r.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Certifications card */}
            {insights.certifications && (
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-100 dark:bg-green-700 p-2 rounded-lg">
                    <Award className="w-5 h-5 text-green-600 dark:text-green-300" />
                  </div>
                  <div className="font-semibold text-lg">Certifications</div>
                </div>
                <ul className="list-disc list-inside text-sm space-y-3">
                  {(insights.certifications || []).map((c, i) => (
                    <li key={i}>
                      <span className="font-bold">{c.certification}</span>
                      <span className="text-gray-600 dark:text-gray-400"> from {c.provider}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Priority Skills card */}
            {insights.prioritySkills && (
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-100 dark:bg-blue-700 p-2 rounded-lg">
                    <Target className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div className="font-semibold text-lg">Priority Skills</div>
                </div>
                <ul className="list-disc list-inside text-sm space-y-3">
                  {(insights.prioritySkills || []).map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          // A more engaging and centered empty state
          <div className="flex flex-col items-center justify-center p-10 bg-gray-50 dark:bg-gray-800 rounded-2xl border-dashed border-2 border-gray-300 dark:border-gray-700">
            <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Ready for some guidance?</h3>
            <p className="text-gray-500 text-center">
              Click the "Generate My Insights" button above to get personalized career path recommendations and skill suggestions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerInsights;
