import { useState } from "react";
import { Loader2, MessageCircle, Check, ArrowLeft } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import API from "../utils/axiosInstance";

const InterviewPrep = () => {
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [prepared, setPrepared] = useState({});
  const navigate = useNavigate();

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
      setQuestions(data.questions || []);
      setPrepared({});
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to generate questions.");
    } finally {
      setLoading(false);
    }
  };

  const togglePrepared = (i) => setPrepared((p) => ({ ...p, [i]: !p[i] }));

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 text-gray-900 dark:text-white">
      <Toaster position="top-center" />
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">

        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-4 flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </button>

        <div className="flex items-center gap-3 mb-4">
          <MessageCircle className="w-6 h-6 text-blue-500" />
          <h1 className="text-xl font-bold">AI Interview Prep</h1>
        </div>

        <form onSubmit={handleGenerate} className="flex gap-3 mb-4">
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g., Software Engineer - Backend"
            className="flex-1 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {loading ? "Generating..." : "Generate"}
          </button>
        </form>

        {!questions.length ? (
          <div className="text-center text-gray-500">Enter role and generate mock interview questions.</div>
        ) : (
          <div className="space-y-3">
            {questions.map((q, i) => (
              <div key={i} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg flex items-start justify-between hover:shadow-md transition">
                <div className="flex-1">
                  <div className="text-sm text-gray-700 dark:text-gray-200">{q}</div>
                </div>
                <button
                  onClick={() => togglePrepared(i)}
                  className={`ml-4 px-3 py-1 rounded-lg text-sm ${
                    prepared[i]
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200"
                  }`}
                >
                  {prepared[i] ? "Prepared" : "Mark Ready"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewPrep;
