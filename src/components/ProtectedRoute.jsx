// SKILLFORGE/src/components/ProtectedRoute.jsx
import { Navigate,useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext"; // Import the custom hook

const ProtectedRoute = ({ children }) => {
  const navigate=useNavigate();
  const { isAuthenticated } = useAuth(); // Get the authentication status from the context

  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white px-4 py-10"
      >
        <h2 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
          🔒 Access Denied
        </h2>
        <p className="text-center max-w-md text-gray-600 dark:text-gray-300 mb-6">
          You must be logged in to access this page. Please log in to continue.
        </p>
        {/* <Navigate to="/login" replace /> */}
        <button onClick={()=>navigate("/login")} className="flex items-center justify-center gap-2 w-full sm:w-1/2 bg-blue-200 dark:bg-blue-500 text-gray-700 dark:text-gray-200 py-3 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-600 transition">Go to Login</button>
      </motion.div>
    );
  }

  return children;
};

export default ProtectedRoute;