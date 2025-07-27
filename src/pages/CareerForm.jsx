// SKILLFORGE/src/pages/CareerForm.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Plus, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const CareerForm = () => {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [originalInterests, setOriginalInterests] = useState([]); // ✅ For detecting unsaved changes
  const [loading, setLoading] = useState(false);
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

  // ✅ Fetch saved interests
  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/auth/get-interests", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSelectedInterests(res.data.interests || []);
        setOriginalInterests(res.data.interests || []); // ✅ store original for comparison
      } catch (error) {
        console.error("Error fetching interests:", error);
        toast.error("❌ Failed to fetch interests");
      }
    };
    fetchInterests();
  }, []);

  // ✅ Check if there are unsaved changes
  const hasUnsavedChanges = JSON.stringify(selectedInterests) !== JSON.stringify(originalInterests);

  // ✅ Warn user before leaving if unsaved changes exist
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // ✅ Toggle Predefined Interest (Only updates local state)
  const toggleInterest = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  // ✅ Add Custom Interest
  const addCustomInterest = () => {
    const trimmed = customInterest.trim();
    if (!trimmed) return;
    if (selectedInterests.includes(trimmed)) {
      toast.error("⚠️ Interest already selected!");
      return;
    }
    setSelectedInterests((prev) => [...prev, trimmed]);
    setCustomInterest("");
    toast.success(`✅ Added: ${trimmed}`);
  };

  // ✅ Auto-save when removing an interest
  const removeInterest = async (interest) => {
    const updated = selectedInterests.filter((i) => i !== interest);
    setSelectedInterests(updated);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/auth/save-interests",
        { interests: updated },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`❌ Removed: ${interest}`);
      setOriginalInterests(updated); // ✅ Keep backend & original synced after removal
    } catch (error) {
      console.error("Error removing interest:", error);
      toast.error("❌ Failed to save changes!");
    }
  };

  // ✅ Save Interests (for additions or edits)
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/auth/save-interests",
        { interests: selectedInterests },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("✅ Interests saved successfully!");
      setOriginalInterests(selectedInterests); // ✅ Sync original after saving
    } catch (error) {
      console.error("Error saving interests:", error);
      toast.error("❌ Failed to save interests!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex justify-center py-10 px-4">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="max-w-xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-600 dark:text-blue-400">
          Select Your Career Interests
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
          Choose from the list or add your own interests.
        </p>

        {/* ✅ Predefined Interests */}
        <div className="flex flex-wrap gap-3 mb-6">
          {availableInterests.map((interest, index) => (
            <button
              key={index}
              onClick={() => toggleInterest(interest)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedInterests.includes(interest)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-600"
              }`}
            >
              {interest}
            </button>
          ))}
        </div>

        {/* ✅ Add Custom Interest */}
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

        {/* ✅ Display Selected Interests */}
        {selectedInterests.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedInterests.map((interest, index) => (
              <div
                key={index}
                className="flex items-center gap-1 bg-blue-100 dark:bg-gray-700 text-blue-700 dark:text-gray-200 px-3 py-1 rounded-full text-sm"
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

        {/* ✅ Save Button */}
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

        {/* ✅ Go to AI Roadmap Button */}
        <button
          onClick={() => navigate("/ai-roadmap")}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Go to AI Roadmap →
        </button>
      </div>
    </div>
  );
};

export default CareerForm;

