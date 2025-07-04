//src/pages/AIRoadmap.jsx
import { useState } from "react";

const AIRoadmap = () => {
  const [roadmap, setRoadmap] = useState([]);
  const [loading, setLoading] = useState(false);

  const sampleRoadmap = [
    { week: 1, topic: "Learn HTML & CSS basics" },
    { week: 2, topic: "Master JavaScript fundamentals" },
    { week: 3, topic: "Understand React basics and component structure" },
    { week: 4, topic: "Explore Backend with Node.js & Express" },
    { week: 5, topic: "Learn MongoDB & Database Integration" },
    { week: 6, topic: "Build Projects & Revise Concepts" },
  ];

  const handleGenerateRoadmap = () => {
    setLoading(true);
    setTimeout(() => {
      setRoadmap(sampleRoadmap);
      setLoading(false);
    }, 1500); // simulate API delay
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 dark:bg-gray-800 dark:text-white">
      <h2 className="text-3xl font-bold mb-6">AI-Powered Learning Roadmap</h2>
      <button
        onClick={handleGenerateRoadmap}
        className="px-6 py-3 mb-8 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        {loading ? "Generating..." : "Generate Roadmap"}
      </button>

      {roadmap.length > 0 && (
        <div className="space-y-4 w-full max-w-md">
          {roadmap.map((step) => (
            <div
              key={step.week}
              className="p-4 border border-gray-300 rounded dark:border-gray-700"
            >
              <h3 className="font-semibold">Week {step.week}</h3>
              <p>{step.topic}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIRoadmap;
