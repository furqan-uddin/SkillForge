// SKILLFORGE/src/pages/MyRoadmaps.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import API from "../utils/axiosInstance";
import { Loader2, Trash2, Eye } from "lucide-react";

const MyRoadmaps = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRoadmaps = async () => {
    try {
      const res = await API.get("/roadmaps");
      // <-- FIX: use the array inside res.data.roadmaps (fall back to empty array)
      setRoadmaps(res.data.roadmaps || []);
    } catch (err) {
      console.error("Error fetching roadmaps:", err);
      toast.error("❌ Failed to load roadmaps");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/roadmaps/${id}`);
      setRoadmaps((prev) => prev.filter((r) => r._id !== id));
      toast.success("🗑️ Roadmap deleted");
    } catch (err) {
      console.error("Error deleting roadmap:", err);
      toast.error("❌ Failed to delete roadmap");
    }
  };

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:to-black text-gray-900 dark:text-white py-10 px-4">
      <Toaster position="top-center" />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-blue-600 dark:text-blue-400 mb-8">
          📚 My Roadmaps
        </h1>

        {roadmaps.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p className="text-lg">✨ No roadmaps saved yet.</p>
            <p className="text-sm mt-2">Generate and save one from the AI Roadmap page.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {roadmaps.map((roadmap) => (
              <div
                key={roadmap._id}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-5 rounded-xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 truncate">
                    {roadmap.interest}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    Progress: {roadmap.progress || 0}%
                  </p>
                </div>

                <div className="flex gap-3 items-center">
                  <Link
                    to={`/roadmap/${roadmap._id}`}
                    className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-sm"
                  >
                    <Eye className="w-4 h-4" /> View
                  </Link>

                  <button
                    onClick={() => handleDelete(roadmap._id)}
                    className="flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 text-sm"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRoadmaps;
