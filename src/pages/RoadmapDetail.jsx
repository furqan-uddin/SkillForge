import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import API from "../utils/axiosInstance";
import ProgressWeekAccordion from "../components/ProgressWeekAccordion";
import { Loader2, ArrowLeft, Layers, CheckCircle } from "lucide-react";

const RoadmapDetail = () => {
  const { roadmapId } = useParams();
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch the specific roadmap from the API
  const fetchRoadmap = async () => {
    try {
      const res = await API.get(`/roadmaps/${roadmapId}`);
      // Fallback to res.data in case the response structure is inconsistent
      setRoadmap(res.data.roadmap || res.data);
    } catch (err) {
      console.error("Error fetching roadmap:", err);
      toast.error("❌ Failed to load roadmap");
    } finally {
      setLoading(false);
    }
  };

  // Fetch the roadmap when the component mounts or the ID changes
  useEffect(() => {
    fetchRoadmap();
  }, [roadmapId]);

  // Watch for progress reaching 100% and show a congratulatory toast
  useEffect(() => {
    if (roadmap && roadmap.progress === 100) {
      toast.success("🎉 Congratulations! You have completed this roadmap.", {
        duration: 2500,
      });
    }
  }, [roadmap?.progress]);

  // Show a full-page loading spinner while data is being fetched
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <Loader2 className="animate-spin w-12 h-12 text-blue-600 dark:text-blue-400" />
      </div>
    );
  }

  // Handle the case where the roadmap is not found
  if (!roadmap) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300">
        <Layers className="w-16 h-16 text-gray-400 mb-4" />
        <p className="text-xl font-semibold mb-2">Roadmap Not Found</p>
        <p className="text-sm">The requested roadmap could not be loaded. It may have been deleted.</p>
        <button
          onClick={() => navigate("/my-roadmaps")}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors"
        >
          Go Back to My Roadmaps
        </button>
      </div>
    );
  }

  const weeksArray = roadmap.weeks || [];
  const progress = roadmap.progress || 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white py-10 px-4 font-sans">
      <Toaster position="top-center" />
      <div className="max-w-4xl mx-auto">
        {/* Back button with improved styling */}
        <button
          onClick={() => navigate("/my-roadmaps")}
          className="flex items-center gap-2 mb-8 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to My Roadmaps</span>
        </button>

        {/* Main content card with enhanced shadow and rounded corners */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl transition-all duration-300">
          
          {/* Page header with dynamic icon and improved typography */}
          <div className="flex items-center justify-center gap-4 mb-3">
            <div className="p-3 rounded-full"
                 style={{
                   backgroundColor: progress === 100 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                 }}>
              {progress === 100 ? (
                <CheckCircle className="w-8 h-8 text-green-500" />
              ) : (
                <Layers className="w-8 h-8 text-blue-500" />
              )}
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-800 dark:text-white">
              {roadmap.interest} Roadmap
            </h1>
          </div>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Your detailed plan to achieve mastery in your selected area.
          </p>

          {/* Progress bar with smooth animation and bold percentage */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2">
            <div
              className="h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${progress || 0}%`,
                backgroundColor: progress === 100 ? '#22c55e' : '#3b82f6',
              }}
            />
          </div>
          <p className="text-center font-bold text-sm mb-8">
            {progress}% Completed
          </p>

          {/* Weeks Accordion */}
          <ProgressWeekAccordion
            weeks={weeksArray}
            roadmapId={roadmap._id}
            onUpdate={(updated) => setRoadmap(updated)}
          />
        </div>
      </div>
    </div>
  );
};

export default RoadmapDetail;
