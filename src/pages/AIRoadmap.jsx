// SKILLFORGE/src/pages/AIRoadmap.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, RefreshCw, Save, Brain } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import WeekAccordion from "../components/WeekAccordion";
import API from "../utils/axiosInstance";

const AIRoadmap = () => {
  const [interestInput, setInterestInput] = useState("");
  const [generatedInterest, setGeneratedInterest] = useState("");
  const [weeks, setWeeks] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const generate = async ({ force = false } = {}) => {
    const interest = (interestInput || generatedInterest || "").trim();
    if (!interest) {
      toast.error("❌ Please enter an interest to generate a roadmap.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await API.post("/generate-roadmap", { interests: [interest] });
      const roadmap = data?.roadmaps?.[interest];

      if (!roadmap || Object.keys(roadmap).length === 0) {
        toast.error("❌ Could not generate roadmap. Try a different interest.");
        return;
      }

      setGeneratedInterest(interest);
      setWeeks(roadmap);

      toast.success(force ? "🔄 Roadmap regenerated successfully!" : "✅ Roadmap generated!");
      if (force) setInterestInput("");
    } catch (err) {
      console.error("generate error:", err);
      toast.error("❌ Failed to generate roadmap. Try again!");
    } finally {
      setLoading(false);
    }
  };

  const saveRoadmap = async () => {
    if (!generatedInterest || !weeks) {
      toast.error("⚠️ Nothing to save yet.");
      return;
    }
    try {
      setLoading(true);
      await API.post("/roadmaps", {
        interest: generatedInterest,
        weeks,
      });

      toast.success("💾 Roadmap saved to your account!");
      setInterestInput("");
    } catch (err) {
      console.error("save error:", err);
      toast.error("❌ Failed to save roadmap.");
    } finally {
      setLoading(false);
    }
  };

  const confirmRegenerate = () => {
    const interest = (interestInput || generatedInterest || "").trim();
    if (!interest) {
      toast.error("⚠️ Please enter an interest first.");
      return;
    }

    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="text-sm">
            Regenerating <b>{interest}</b> will reset your progress for this roadmap.
          </p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                await generate({ force: true });
              }}
              className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white"
            >
              Regenerate
            </button>
          </div>
        </div>
      ),
      { duration: 6000 }
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex justify-center py-8 sm:py-10 px-3 sm:px-4">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-blue-600 dark:text-blue-400 flex items-center gap-2">
            <Brain className="w-6 h-6 sm:w-7 sm:h-7" />
            AI Learning Roadmap
          </h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-xs sm:text-sm px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition self-start sm:self-auto"
          >
            Dashboard
          </button>
        </div>

        {/* Input card */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 sm:p-5 mb-6 shadow-inner">
          <label className="block text-sm font-medium mb-2">Enter an interest</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={interestInput}
              onChange={(e) => setInterestInput(e.target.value)}
              placeholder="e.g., Web Development"
              className="flex-1 p-2.5 sm:p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => generate()}
              disabled={loading}
              className="px-4 sm:px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center justify-center gap-2 transition text-sm sm:text-base"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>
          {generatedInterest && (
            <p className="text-xs sm:text-sm mt-3 text-gray-600 dark:text-gray-300">
              Showing roadmap for: <b>{generatedInterest}</b>
            </p>
          )}
        </div>

        {/* Action buttons */}
        {weeks && (
          <div className="flex flex-col sm:flex-row gap-3 mb-6 justify-center">
            <button
              onClick={saveRoadmap}
              disabled={loading}
              className="flex-1 sm:flex-none px-4 sm:px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium flex items-center justify-center gap-2 transition text-sm sm:text-base"
            >
              <Save className="w-4 h-4" />
              Save Roadmap
            </button>
            <button
              onClick={confirmRegenerate}
              disabled={loading}
              className="flex-1 sm:flex-none px-4 sm:px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium flex items-center justify-center gap-2 transition text-sm sm:text-base"
            >
              <RefreshCw className="w-4 h-4" />
              Regenerate
            </button>
          </div>
        )}

        {/* Roadmap content */}
        {weeks ? (
          <div className="space-y-3 sm:space-y-4">
            {Object.entries(weeks).map(([week, steps], idx) => (
              <WeekAccordion
                key={idx}
                week={week}
                steps={Array.isArray(steps) ? steps : []}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 py-8">
            ✨ Generate a roadmap to see weekly learning steps here.
          </div>
        )}
      </div>
    </div>
  );
};

export default AIRoadmap;
