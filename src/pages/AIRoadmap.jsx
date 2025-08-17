// ✅ SKILLFORGE/src/pages/AIRoadmap.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Loader2, RefreshCw, ArrowLeft } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { isTokenExpired, logoutUser } from "../utils/authHelper";
import WeekAccordion from "../components/WeekAccordion"; // ✅ Import accordion component

const AIRoadmap = () => {
  const [interests, setInterests] = useState([]);
  const [roadmaps, setRoadmaps] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Fetch saved interests
  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token || isTokenExpired(token)) {
          toast.error("Session expired. Please log in again.");
          logoutUser(navigate);
          return;
        }

        const res = await axios.get(
          "http://localhost:5000/api/auth/get-interests",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setInterests(res.data.interests || []);
      } catch (error) {
        console.error("Error fetching interests:", error);
        toast.error("❌ Failed to fetch interests");
      }
    };
    fetchInterests();
  }, [navigate]);

  // ✅ Generate roadmaps
  const generateRoadmaps = async () => {
    if (interests.length === 0) {
      toast.error("No interests found. Please add interests first.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token || isTokenExpired(token)) {
        toast.error("Session expired. Please log in again.");
        logoutUser(navigate);
        return;
      }

      const res = await axios.post(
        "http://localhost:5000/api/generate-roadmap",
        { interests },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRoadmaps(res.data.roadmaps);
      toast.success("✅ Roadmaps generated successfully!");
    } catch (error) {
      console.error("Error generating roadmaps:", error);
      toast.error("❌ Failed to generate roadmaps");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex justify-center py-10 px-4">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="max-w-3xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate("/career-form")}
            className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            <ArrowLeft size={18} /> Back
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">
            🤖 AI Learning Roadmap
          </h1>
        </div>

        {/* ✅ No Interests Saved */}
        {interests.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-600 dark:text-gray-300 mb-3 text-sm sm:text-base">
              You haven't added any interests yet.
            </p>
            <button
              onClick={() => navigate("/career-form")}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition shadow-md"
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
                    className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm shadow-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* ✅ Generate Button */}
            <button
              onClick={generateRoadmaps}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2 rounded-lg hover:from-blue-600 hover:to-blue-800 transition shadow-md mb-6"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" /> Generating...
                </>
              ) : Object.keys(roadmaps).length > 0 ? (
                <>
                  <RefreshCw className="w-5 h-5" /> Regenerate Roadmaps
                </>
              ) : (
                "Generate Roadmaps"
              )}
            </button>

            {/* ✅ Roadmaps Accordion Style */}
            {Object.keys(roadmaps).length > 0 && (
              <div className="space-y-10">
                {Object.entries(roadmaps).map(([interest, weeks], idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-br from-blue-50 dark:from-gray-800 to-white dark:to-gray-900 p-6 rounded-xl shadow-lg border dark:border-gray-700"
                  >
                    <h3 className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-6">
                      {interest} Roadmap
                    </h3>

                    <div className="space-y-4">
                      {Object.entries(weeks).map(([week, steps], weekIdx) => (
                        <WeekAccordion
                          key={weekIdx}
                          week={week}
                          steps={steps}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AIRoadmap;
