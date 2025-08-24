import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import API from "../utils/axiosInstance";
import ProgressWeekAccordion from "../components/ProgressWeekAccordion";
import { Loader2, RefreshCcw, ArrowLeft } from "lucide-react";

const RoadmapDetail = () => {
  const { roadmapId } = useParams();
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRoadmap = async () => {
    try {
      const res = await API.get(`/roadmaps/${roadmapId}`);
      setRoadmap(res.data.roadmap || res.data);
    } catch (err) {
      console.error("Error fetching roadmap:", err);
      toast.error("❌ Failed to load roadmap");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, [roadmapId]);

  const handleRegenerate = async () => {
    if (!roadmap) return;
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <span>⚠️ Regenerating will erase your progress. Continue?</span>
          <div className="flex gap-3 justify-center mt-2">
            <button
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  setLoading(true);
                  const res = await API.post("/roadmaps/regenerate", {
                    interest: roadmap.interest,
                    roadmapId: roadmap._id,
                  });
                  setRoadmap(res.data.roadmap);
                  toast.success("✅ Roadmap regenerated successfully!");
                } catch (err) {
                  console.error("Error regenerating roadmap:", err);
                  toast.error("❌ Failed to regenerate roadmap");
                } finally {
                  setLoading(false);
                }
              }}
            >
              Yes
            </button>
            <button
              className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-black dark:text-white rounded hover:bg-gray-400"
              onClick={() => toast.dismiss(t.id)}
            >
              No
            </button>
          </div>
        </div>
      ),
      { duration: 5000 }
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-6 h-6 text-blue-600" />
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="text-center text-gray-600 dark:text-gray-300 mt-10">
        No roadmap found.
      </div>
    );
  }

  const weeksArray = roadmap.weeks || [];
  const progress = roadmap.progress || 0;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white py-10 px-4">
      <Toaster position="top-center" />
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center text-blue-600 dark:text-blue-400 mb-4">
          {roadmap.interest} Roadmap
        </h1>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-6">
          <div
            className="bg-blue-600 h-4 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-center mb-6">{progress}% Completed</p>

        {/* Weeks */}
        <ProgressWeekAccordion
          weeks={weeksArray}
          roadmapId={roadmap._id}
          onUpdate={(updated) => setRoadmap(updated)}
        />

        {/* Actions */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => navigate("/my-roadmaps")}
            className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
          >
            <ArrowLeft className="w-5 h-5" /> Back
          </button>

          <button
            onClick={handleRegenerate}
            disabled={loading}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-60"
          >
            <RefreshCcw className="w-5 h-5" />
            {loading ? "Regenerating..." : "Regenerate"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoadmapDetail;
