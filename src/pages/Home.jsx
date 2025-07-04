//src/pages/Home.jsx
const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center dark:bg-gray-800 dark:text-white transition-all duration-300">
      <h1 className="text-4xl md:text-5xl font-bold mb-6">
        Unlock Your Career Potential with <span className="text-blue-500">AI-Powered Planning</span>
      </h1>
      <p className="mb-8 text-lg md:text-xl max-w-2xl">
        Get personalized learning roadmaps, resume reviews, and smart career guidance—all powered by cutting-edge AI.
      </p>
      <button className="px-6 py-3 rounded bg-blue-600 text-white hover:bg-blue-700 transition">
        Get Started
      </button>
      <img
        src="https://undraw.co/api/illustrations/fe8eeaa3-0b46-45f3-8663-e54e3fb8c056" // Sample Illustration URL
        alt="Career Illustration"
        className="mt-10 w-full max-w-md"
      />
    </div>
  );
};

export default Home;
