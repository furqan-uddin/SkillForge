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
        <Loader2 className="animate-spin w-6 h-6 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white py-10 px-4">
      <Toaster position="top-center" />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-blue-600 dark:text-blue-400 mb-8">
          📚 My Roadmaps
        </h1>

        {roadmaps.length === 0 ? (
          <p className="text-center text-gray-500">No roadmaps saved yet.</p>
        ) : (
          <div className="grid gap-4">
            {roadmaps.map((roadmap) => (
              <div
                key={roadmap._id}
                className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md flex justify-between items-center"
              >
                <div>
                  <h2 className="text-xl font-semibold">{roadmap.interest}</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Progress: {roadmap.progress || 0}%
                  </p>
                </div>
                <div className="flex gap-3">
                  <Link
                    to={`/roadmap/${roadmap._id}`}
                    className="flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
                  >
                    <Eye className="w-4 h-4" /> View
                  </Link>
                  <button
                    onClick={() => handleDelete(roadmap._id)}
                    className="flex items-center gap-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700"
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
