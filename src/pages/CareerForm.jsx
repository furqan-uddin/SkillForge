// ✅ SKILLFORGE/src/pages/CareerForm.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { isTokenExpired, logoutUser } from "../utils/authHelper";
import API from "../utils/axiosInstance";

const CareerForm = () => {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [originalInterests, setOriginalInterests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingInterests, setLoadingInterests] = useState(true);
  const [customInterest, setCustomInterest] = useState("");
  const navigate = useNavigate();

  const availableInterests = [
    "Web Development",
    "Data Science",
    "Artificial Intelligence",
    "Cloud Computing",
    "Cybersecurity",
    "Mobile App Development",
    "UI/UX Design",
    "Blockchain",
  ];

  const isValidCustomInterest = (interest) => {
    const bannedWords = [
      "asdf",
      "qwerty",
      "123",
      "nothing",
      "random",
      "na",
      "idk",
      "timepass",
      "unknown",
    ];
    if (interest.length < 3) return false;
    if (/^[0-9]+$/.test(interest)) return false;
    if (bannedWords.includes(interest.toLowerCase())) return false;
    if (!/^[a-zA-Z\s\-\/\&]+$/.test(interest)) return false; // ✅ Now supports / and &
    return true;
  };

  // ✅ Fetch saved interests
  useEffect(() => {
    const fetchInterests = async () => {
      try {
        setLoadingInterests(true);
        const token = localStorage.getItem("token");

        if (!token || isTokenExpired(token)) {
          toast.error("Session expired. Please log in again.");
          logoutUser(navigate);
          return;
        }

        const { data } = await API.get("/auth/get-interests");
        setSelectedInterests(data.interests || []);
        setOriginalInterests(data.interests || []);
      } catch {
        toast.error("❌ Failed to fetch interests");
      } finally {
        setLoadingInterests(false);
      }
    };

    fetchInterests();
  }, [navigate]);

  const hasUnsavedChanges =
    JSON.stringify(selectedInterests) !== JSON.stringify(originalInterests);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () =>
      window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const toggleInterest = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const addCustomInterest = () => {
    const trimmed = customInterest.trim();
    if (!trimmed) return;

    if (!isValidCustomInterest(trimmed)) {
      toast.error("⚠️ Enter a valid and meaningful interest.");
      setCustomInterest("");
      return;
    }

    const normalized = trimmed.replace(/\s+/g, " ").replace(/\//g, "&"); // ✅ Convert / to &
    if (
      selectedInterests.some(
        (i) => i.toLowerCase() === normalized.toLowerCase()
      )
    ) {
      toast.error("⚠️ Interest already selected!");
      return;
    }

    setSelectedInterests((prev) => [...prev, normalized]);
    setCustomInterest("");
    toast.success(`✅ Added: ${normalized}`);
  };

  const removeInterest = (interest) => {
    setSelectedInterests((prev) => prev.filter((i) => i !== interest));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token || isTokenExpired(token)) {
        toast.error("Session expired. Please log in again.");
        logoutUser(navigate);
        return;
      }

      const normalized = [
        ...new Set(
          selectedInterests.map((i) =>
            i.trim().replace(/\s+/g, " ").replace(/\//g, "&") // ✅ Normalize before saving
          )
        ),
      ];

      const res = await API.post("/auth/save-interests",{ interests: normalized });

      toast.success("✅ Interests saved successfully!");
      setOriginalInterests(res.data.interests);
    } catch (error) {
      console.error("Error saving interests:", error);
      toast.error(
        error.response?.data?.message || "❌ Failed to save interests!"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingInterests) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 dark:text-gray-300">
        Loading your interests...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex justify-center py-10 px-4">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="max-w-xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl font-extrabold mb-4 text-center text-blue-600 dark:text-blue-400">
          🎯 Career Interests
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
          Select from popular options or add your own <strong>valid</strong>{" "}
          interests.
        </p>

        {/* Predefined Interests */}
        <div className="flex flex-wrap gap-3 mb-6 justify-center">
          {availableInterests.map((interest, index) => (
            <button
              key={index}
              onClick={() => toggleInterest(interest)}
              className={`px-4 py-2 rounded-full text-sm font-medium shadow-md transform transition-all ${
                selectedInterests.includes(interest)
                  ? "bg-blue-600 text-white shadow-blue-300 scale-105"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-600"
              }`}
            >
              {interest}
            </button>
          ))}
        </div>

        {/* Add Custom Interest */}
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            value={customInterest}
            onChange={(e) => setCustomInterest(e.target.value)}
            placeholder="Type your custom interest..."
            className="flex-1 p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addCustomInterest}
            className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-1"
          >
            <Plus size={16} /> Add
          </button>
        </div>

        {/* Selected Interests */}
        {selectedInterests.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedInterests.map((interest, index) => (
              <div
                key={index}
                className="flex items-center gap-1 bg-blue-100 dark:bg-gray-700 text-blue-700 dark:text-gray-200 px-3 py-1 rounded-full text-sm shadow"
              >
                {interest}
                <button
                  onClick={() => removeInterest(interest)}
                  className="ml-1 text-red-500 hover:text-red-700"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={handleSubmit}
          disabled={!hasUnsavedChanges || loading}
          className={`w-full py-2 rounded-lg transition mb-3 ${
            hasUnsavedChanges
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-400 text-gray-200 cursor-not-allowed"
          }`}
        >
          {loading ? "Saving..." : "Save Interests"}
        </button>

        {/* Go to AI Roadmap */}
        <button
          onClick={() => navigate("/ai-roadmap")}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2 rounded-lg hover:from-blue-600 hover:to-blue-800 transition shadow-md"
        >
          Go to AI Roadmap →
        </button>
      </div>
    </div>
  );
};

export default CareerForm;
