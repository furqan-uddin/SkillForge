import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import API from "../utils/axiosInstance";
import { Loader2, Trash2, Eye, Map, Layers } from "lucide-react";

const MyRoadmaps = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

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
    if (
      window.confirm(
        "Are you sure you want to delete this roadmap? This action cannot be undone."
      )
    ) {
      try {
        setDeletingId(id);
        await API.delete(`/roadmaps/${id}`);
        setRoadmaps((prev) => prev.filter((r) => r._id !== id));
        toast.success("🗑️ Roadmap deleted successfully");
      } catch (err) {
        console.error("Error deleting roadmap:", err);
        toast.error("❌ Failed to delete roadmap");
      } finally {
        setDeletingId(null);
      }
    }
  };

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // Variants for the container to control staggering
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Variants for individual roadmap cards, matching the Dashboard's entry animation
  const itemVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.95 },
    show: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white py-10 px-4">
      <Toaster position="top-center" />
      <div className="max-w-5xl mx-auto">
        {/* Page header with motion animation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-4 mb-8"
        >
          <div className="bg-blue-100 dark:bg-blue-700 p-3 rounded-full">
            <Layers className="w-8 h-8 text-blue-600 dark:text-blue-300" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-800 dark:text-white">
            My Roadmaps
          </h1>
        </motion.div>

        <AnimatePresence mode="wait">
          {roadmaps.length === 0 ? (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
              className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-gray-800 rounded-3xl shadow-xl border-dashed border-2 border-gray-300 dark:border-gray-700"
            >
              <Map className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" />
              <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                No roadmaps saved yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                Start your journey by generating a personalized roadmap from the
                "AI Roadmap" page.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="roadmap-list"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {roadmaps.map((roadmap) => (
                  <motion.div
                    key={roadmap._id}
                    variants={itemVariants}
                    exit="exit"
                    whileHover={{ scale: 1.03 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 transition"
                  >
                    <h2 className="text-xl font-bold mb-2 truncate text-gray-800 dark:text-gray-100">
                      {roadmap.interest}
                    </h2>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Progress:
                      </span>
                      <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        {roadmap.progress || 0}%
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-6">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${roadmap.progress || 0}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-end gap-3">
                      <Link
                        to={`/roadmap/${roadmap._id}`}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors"
                      >
                        <Eye className="w-4 h-4" /> View
                      </Link>
                      <button
                        onClick={() => handleDelete(roadmap._id)}
                        disabled={deletingId === roadmap._id}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-full text-sm font-semibold hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {deletingId === roadmap._id ? (
                          <Loader2 className="animate-spin w-4 h-4" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                        Delete
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MyRoadmaps;
