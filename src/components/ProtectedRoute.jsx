// SKILLFORGE/src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { isTokenExpired } from "../utils/authHelper";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token || isTokenExpired(token)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white px-4 py-10">
        <h2 className="text-3xl font-semibold text-red-600 dark:text-red-400 mb-2">
          🔒 Access Denied
        </h2>
        <p className="text-center max-w-md text-gray-700 dark:text-gray-300 mb-6">
          You must be logged in to access this page. Please log in to continue.
        </p>
        <Navigate to="/login" replace />
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
