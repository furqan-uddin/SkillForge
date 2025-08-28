// ✅ SKILLFORGE/src/components/WeekAccordion.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, CheckCircle } from "lucide-react";

const WeekAccordion = ({ week, steps }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden"
    >
      {/* Week Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center px-5 py-4 text-left text-lg font-semibold text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
      >
        <div className="flex items-center gap-2">
          {isOpen && <CheckCircle className="w-5 h-5 text-green-500" />}
          {week}
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-blue-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {/* Steps */}
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="px-6 pb-4 list-disc space-y-2 text-gray-800 dark:text-gray-200"
          >
            {steps.map((step, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm leading-relaxed"
              >
                {step}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default WeekAccordion;
