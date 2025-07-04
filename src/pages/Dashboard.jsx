//src/pages/Dashboard.jsx
const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center dark:bg-gray-800 dark:text-white transition">
      <h1 className="text-4xl font-bold mb-4">Welcome to Your Dashboard</h1>
      <p className="mb-6 text-lg">
        Track your progress, explore your personalized roadmap, and unlock new skills.
      </p>
      <button className="px-6 py-3 rounded bg-blue-600 text-white hover:bg-blue-700 transition">
        Explore Roadmap
      </button>
    </div>
  );
};

export default Dashboard;
