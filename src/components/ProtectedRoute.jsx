// SKILLFORGE/src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white px-4 py-10">
        <h2 className="text-3xl font-semibold text-red-600 dark:text-red-400 mb-2">
          🔒 Access Denied
        </h2>
        <p className="text-center max-w-md text-gray-700 dark:text-gray-300 mb-6">
          You must be logged in to access this page. Please log in to continue.
        </p>
        <a
          href="/login"
          className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200"
        >
          Go to Login
        </a>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
