import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, CheckSquare, Square } from "lucide-react";
import toast from "react-hot-toast";
import API from "../utils/axiosInstance";

const ProgressWeekAccordion = ({ weeks, roadmapId, onUpdate }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleComplete = async (weekIndex, stepIndex, step) => {
    try {
      const res = await API.patch(`/roadmaps/${roadmapId}/step`, {
        weekIndex,
        stepIndex,
        completed: !step.completed,
      });
      onUpdate(res.data.roadmap);
      toast.success(!step.completed ? "✅ Marked complete" : "❌ Marked incomplete");
    } catch (err) {
      console.error("Error updating step:", err);
      toast.error("❌ Failed to update step");
    }
  };

  return (
    <div className="space-y-4">
      {weeks.map((week, i) => (
        <div
          key={i}
          className="border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden"
        >
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex justify-between items-center bg-gray-100 dark:bg-gray-700 px-4 py-3 font-semibold text-left"
          >
            {week.title || `Week ${i + 1}`}
            {openIndex === i ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
          {openIndex === i && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 space-y-3"
            >
              {(week.steps || []).length > 0 ? (
                week.steps.map((step, j) => (
                  <div
                    key={j}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    onClick={() => toggleComplete(i, j, step)}
                  >
                    {step.completed ? (
                      <CheckSquare className="text-green-600" />
                    ) : (
                      <Square className="text-gray-400" />
                    )}
                    <span
                      className={
                        step.completed
                          ? "line-through text-gray-500"
                          : "text-gray-800 dark:text-gray-200"
                      }
                    >
                      {step.text}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No steps for this week.</p>
              )}
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProgressWeekAccordion;
