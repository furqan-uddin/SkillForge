import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, RefreshCw, Save, Brain, Lightbulb } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import WeekAccordion from "../components/WeekAccordion";
import API from "../utils/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";

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

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent default form submission behavior
      generate();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-black text-gray-900 dark:text-white flex justify-center py-10 px-4 transition-all duration-300">

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-blue-600 dark:text-blue-400 flex items-center gap-2">
            <Brain className="w-7 h-7" />
            AI Learning Roadmap
          </h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            ← Dashboard
          </button>
        </div>

        {/* Input card */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 mb-6 shadow-inner">
          <label htmlFor="interest-input" className="block text-sm font-medium mb-2">Enter an interest</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="interest-input"
              type="text"
              value={interestInput}
              onChange={(e) => setInterestInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g., Web Development"
              className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => generate()}
              disabled={loading}
              className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center justify-center gap-2 transition text-sm sm:text-base shadow"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>
          {generatedInterest && (
            <p className="text-sm mt-3 text-gray-600 dark:text-gray-300">
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
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium flex items-center justify-center gap-2 transition text-sm sm:text-base shadow"
            >
              <Save className="w-4 h-4" />
              Save Roadmap
            </button>
            <button
              onClick={confirmRegenerate}
              disabled={loading}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium flex items-center justify-center gap-2 transition text-sm sm:text-base shadow"
            >
              <RefreshCw className="w-4 h-4" />
              Regenerate
            </button>
          </div>
        )}

        {/* Roadmap content */}
        <AnimatePresence mode="wait">
          {weeks ? (
            <motion.div
              key="roadmap"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4 shadow-inner"
            >
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
                Your AI-Generated Roadmap
              </h2>
              {Object.entries(weeks).map(([week, steps], idx) => (
                <WeekAccordion
                  key={idx}
                  week={week}
                  steps={Array.isArray(steps) ? steps : []}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-sm text-gray-500 dark:text-gray-400 py-10"
            >
              ✨ Generate a roadmap to see weekly learning steps here.
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AIRoadmap;
