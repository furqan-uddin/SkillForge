// SKILLFORGE/src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuth(!!token);
  }, []);

  if (!isAuth) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-6">
        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-3">
          🔒 Access Denied
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6 text-center">
          You need to be logged in to access this page.
        </p>
        <button
          onClick={() => (window.location.href = "/login")}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
