import { useState } from "react";
import {
  Loader2,
  MessageCircle,
  ArrowLeft,
  Lightbulb,
  UserCheck,
  ChevronDown,
  Info,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import API from "../utils/axiosInstance";

const InterviewPrep = () => {
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [openIndexes, setOpenIndexes] = useState([]);
  const navigate = useNavigate();

  const toggleOpen = (index) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleGenerate = async (e) => {
    e?.preventDefault();
    if (!role.trim()) {
      toast.error("Please enter a target role (e.g., SDE, Frontend).");
      return;
    }
    try {
      setLoading(true);
      setQuestions([]);
      const { data } = await API.post("/interview", { role });

      console.log("[Interview] API /interview response:", data);

      const incoming = data?.questions || [];
      if (!Array.isArray(incoming) || incoming.length === 0) {
        toast.error(
          "❌ No questions returned. Try again or adjust the role wording."
        );
        return;
      }

      const normalized = incoming.map((q) =>
        typeof q === "string"
          ? { question: q, answer: "" }
          : {
              question: q.question ?? q.q ?? "",
              answer: q.answer ?? q.a ?? q.response ?? "",
            }
      );

      const valid = normalized.filter(
        (x) => x.question && x.question.trim().length > 0
      );
      if (!valid.length) {
        console.error(
          "[Interview] Normalized but no valid question texts:",
          normalized
        );
        toast.error("❌ AI returned invalid questions. Try again.");
        return;
      }

      setQuestions(valid);
      setOpenIndexes([]); // reset open state
    } catch (err) {
      console.error("[Interview] generate error:", err);
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to generate questions.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.95 },
    show: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 text-gray-900 dark:text-gray-100 font-sans transition-colors">
      <Toaster />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xl border border-gray-200 dark:border-gray-800"
      >
        <motion.button
          onClick={() => navigate("/dashboard")}
          whileHover={{ x: -6 }}
          className="mb-6 flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span className="font-medium">Back to Dashboard</span>
        </motion.button>

        <div className="flex items-center gap-4 mb-3">
          <div className="bg-blue-100 dark:bg-blue-700 p-3 rounded-full">
            <MessageCircle className="w-6 h-6 text-blue-600 dark:text-blue-300" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-gray-800 dark:text-white">
            AI Interview Prep
          </h1>
        </div>

        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-2xl">
          Generate practice interview questions for any professional role.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="p-4 mb-8 bg-blue-50 dark:bg-blue-900 rounded-xl text-sm text-blue-800 dark:text-blue-200 flex items-start gap-2 border border-blue-200 dark:border-blue-700"
        >
          <Lightbulb className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-500 dark:text-blue-200" />
          <p>
            Our AI generates{" "}
            <span className="font-semibold">practice questions</span> with
            reference answers tailored to your chosen role. For best results,
            ensure your resume is uploaded on your profile to provide more
            context.
          </p>
        </motion.div>

        <form
          onSubmit={handleGenerate}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g., Software Engineer - Backend"
            className="flex-1 px-5 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-gray-400 dark:placeholder-gray-600"
          />
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold flex items-center justify-center gap-2 shadow-md transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="truncate">Generating...</span>
              </>
            ) : (
              <>
                <UserCheck className="w-5 h-5" />
                Generate Questions
              </>
            )}
          </motion.button>
        </form>

        <AnimatePresence mode="wait">
          {!questions.length ? (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center p-12 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700"
            >
              <MessageCircle className="mx-auto w-16 h-16 text-gray-400 dark:text-gray-600 mb-6" />
              <h3 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-200">
                Ready to Practice?
              </h3>
              <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
                Enter a professional role above and click{" "}
                <span className="font-semibold">"Generate Questions"</span> to
                start your mock interview.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="questions-list"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-4"
            >
              {questions.map((q, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition"
                >
                  {/* Question header */}
                  <button
                    onClick={() => toggleOpen(i)}
                    className="w-full flex items-center justify-between text-left px-4 py-3 sm:px-6 sm:py-4 focus:outline-none"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-blue-100 dark:bg-blue-700 text-blue-600 dark:text-blue-200 font-bold rounded-full">
                        {i + 1}
                      </div>
                      <p className="font-medium text-gray-800 dark:text-gray-200 text-sm sm:text-base">
                        {q.question}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 p-2 -m-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                      {openIndexes.includes(i) ? (
                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                          Hide Answer
                        </span>
                      ) : (
                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                          View Answer
                        </span>
                      )}
                      <motion.span
                        animate={{ rotate: openIndexes.includes(i) ? 180 : 0 }}
                        className="text-blue-500 dark:text-blue-400 ml-1"
                      >
                        <ChevronDown className="w-5 h-5" />
                      </motion.span>
                    </div>
                  </button>

                  {/* Answer panel */}
                  <AnimatePresence>
                    {openIndexes.includes(i) && q.answer && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-4 pb-4 sm:px-6 sm:pb-5"
                      >
                        <div className="mt-2 p-4 bg-white dark:bg-gray-900 rounded-lg border border-blue-200 dark:border-blue-700 shadow-inner">
                          <span className="block font-semibold text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-2">
                            <Info className="w-4 h-4" />
                            Suggested Answer
                          </span>
                          <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                            {q.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default InterviewPrep;
