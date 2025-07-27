// SKILLFORGE/src/pages/AIRoadmap.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Loader2, RefreshCw, CheckCircle } from "lucide-react";

const AIRoadmap = () => {
  const [interests, setInterests] = useState([]);
  const [roadmap, setRoadmap] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Fetch saved interests
  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/auth/get-interests", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInterests(res.data.interests || []);
      } catch (error) {
        console.error("Error fetching interests:", error);
      }
    };
    fetchInterests();
  }, []);

  // ✅ Generate Roadmap (Convert to Array for Timeline)
  const generateRoadmap = async () => {
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/generate-roadmap", {
        interests,
      });

      // ✅ Split roadmap text into steps (Week-wise)
      const steps = res.data.roadmap
        .split("\n")
        .filter((line) => line.trim() !== "");
      setRoadmap(steps);
    } catch (error) {
      console.error("Error generating roadmap:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex justify-center py-10 px-4">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-600 dark:text-blue-400">
          AI-Powered Learning Roadmap
        </h1>

        {/* ✅ No Interests Saved */}
        {interests.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-3">
              You haven't added any interests yet.
            </p>
            <button
              onClick={() => navigate("/career-form")}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Go to Career Form
            </button>
          </div>
        ) : (
          <>
            {/* ✅ Interests Display */}
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">Your Interests:</h2>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* ✅ Generate Button */}
            <button
              onClick={generateRoadmap}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition mb-4"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" /> Generating...
                </>
              ) : roadmap.length > 0 ? (
                <>
                  <RefreshCw className="w-5 h-5" /> Regenerate Roadmap
                </>
              ) : (
                "Generate Roadmap"
              )}
            </button>

            {/* ✅ Roadmap Timeline */}
            {roadmap.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-4 text-blue-600 dark:text-blue-400">
                  Your Personalized Roadmap:
                </h3>
                <div className="relative pl-4 border-l-2 border-blue-400">
                  {roadmap.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="mb-4 flex items-start gap-3"
                    >
                      <CheckCircle className="text-green-500 w-5 h-5 mt-1" />
                      <p className="text-gray-800 dark:text-gray-200 text-sm">
                        <strong>{step.split(":")[0]}:</strong>{" "}
                        {step.split(":")[1] || ""}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AIRoadmap;
