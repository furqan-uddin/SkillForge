import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, CheckCircle, Loader2 } from "lucide-react";
import API from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isValidEmail(formData.email)) {
            toast.error("Please enter a valid email address");
            return;
        }
        if (!formData.password.trim()) {
            toast.error("Password is required");
            return;
        }

        try {
            setLoading(true);
            const res = await API.post("/auth/login", formData);
            login(res.data.user, res.data.token);
            toast.success("Login successful!");
            navigate("/dashboard");
        } catch (error) {
            console.error("Login error:", error);
            toast.error(error.response?.data?.message || "Login failed! Try again.");
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
                    Welcome Back
                </h1>
                <p className="text-center text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 text-sm sm:text-base max-w-md mx-auto">
                    Login to continue your journey with SkillForge.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="yourname@gmail.com"
                            className="mt-1 w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
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
                    </div>

                    <div className="text-right">
                        <p
                            onClick={() => navigate("/reset-password")}
                            className="text-blue-600 dark:text-blue-400 text-sm hover:underline cursor-pointer mt-2"
                        >
                            Forgot Password?
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
                                <span>Login</span>
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-6">
                    Don’t have an account?{" "}
                    <span
                        onClick={() => navigate("/register")}
                        className="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"
                    >
                        Register here
                    </span>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
