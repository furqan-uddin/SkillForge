import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { Eye, EyeOff, Mail, Lock, Loader2, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const ResetPassword = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // ✅ Email Validation
    const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);

    // ✅ Password Validation
    const validatePassword = (password) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(password);

    // ✅ Handle Reset
    const handleReset = async (e) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            toast.error("Enter a valid Gmail address!");
            return;
        }
        if (!validatePassword(password)) {
            toast.error(
                "Password must be 6+ chars, 1 upper, 1 lower, 1 digit & 1 special char!"
            );
            return;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        try {
            setLoading(true);
            // Simulating an API call to reset password
            await new Promise((resolve) => setTimeout(resolve, 1500));
            toast.success("Password reset successfully! Please login.");
            navigate("/login");
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong!");
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
                    Reset Password
                </h1>
                <p className="text-center text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 text-sm sm:text-base max-w-md mx-auto">
                    Enter your registered email and new password to reset it.
                </p>

                <form onSubmit={handleReset} className="space-y-4">
                    {/* ✅ Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Email Address
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your registered email"
                                className="w-full p-3 pr-12 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            />
                            <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" size={20} />
                        </div>
                    </div>

                    {/* ✅ New Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter new password"
                                className="w-full p-3 pr-12 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* ✅ Confirm New Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Re-enter new password"
                                className="w-full p-3 pr-12 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300"
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* ✅ Reset Button */}
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
                                <span>Reset Password</span>
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-6">
                    Back to{" "}
                    <span
                        onClick={() => navigate("/login")}
                        className="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"
                    >
                        Login
                    </span>
                </p>
            </motion.div>
        </div>
    );
};

export default ResetPassword;
