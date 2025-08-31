import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Loader2,
  CheckCircle,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import API from "../utils/axiosInstance";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Updated email validation to only accept @gmail.com
  const isValidEmail = (email) => /^[^\s@]+@gmail\.com$/.test(email);

  const isValidPassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    // Updated toast message for the new validation rule
    if (!isValidEmail(formData.email)) {
      toast.error(
        "Please enter a valid email address from the @gmail.com domain."
      );
      return;
    }
    if (!isValidPassword(formData.password)) {
      toast.error(
        "Password must be 6+ chars, include 1 uppercase, 1 lowercase, 1 number, and 1 special character."
      );
      return;
    }

    try {
      setLoading(true);
      await API.post("/auth/register", formData);
      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Registration failed. Try again!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-black text-gray-900 dark:text-white flex items-center justify-center py-6 px-4 sm:px-6">
      <Toaster position="top-center" />
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl p-5 sm:p-8 border border-gray-200/40 dark:border-gray-700/40"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600 mb-3">
          Create an Account
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 text-sm sm:text-base max-w-md mx-auto">
          Join SkillForge and unlock your career potential.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <div className="relative mt-1">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
              />
              <User
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                size={20}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address
            </label>
            <div className="relative mt-1">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="yourname@gmail.com"
                className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
              />
              <Mail
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                size={20}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Must be 6+ chars, include 1 uppercase, 1 lowercase, 1 number, and
              1 special symbol.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-3 bg-blue-600 text-white py-2.5 sm:py-3 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-60 text-sm sm:text-base shadow-md"
          >
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5 sm:w-6 sm:h-6" />
            ) : (
              <>
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                <span>Register</span>
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"
          >
            Login here
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
