import { Link, useLocation, useNavigate } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, X, User, ChevronDown, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Use the useAuth hook to get the user and authentication status
  const { user, isAuthenticated, logout } = useAuth();
  
  // This useEffect handles the dropdown menu closing when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout(); // Calls the centralized logout function from the context
    navigate("/login");
  };

  const navLinkClass = (path) =>
    `transition duration-200 hover:text-blue-500 hover:dark:text-blue-500 ${
      location.pathname === path
        ? "text-blue-600 dark:text-blue-400 font-semibold"
        : "text-gray-700 dark:text-gray-200"
    }`;

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-between px-6 py-4 bg-white/90 dark:bg-gray-900 shadow-lg backdrop-blur-md sticky top-0 z-50"
    >
      {/* Logo */}
      <div
        onClick={() => navigate("/")}
        className="text-2xl font-extrabold text-blue-600 cursor-pointer hover:scale-105 transition-transform"
      >
        SkillForge
      </div>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center space-x-6">
        <Link to="/" className={navLinkClass("/")}>
          Home
        </Link>
        
        {/* Use isAuthenticated from the context */}
        {isAuthenticated && (
          <>
            <Link to="/dashboard" className={navLinkClass("/dashboard")}>
              Dashboard
            </Link>
            <Link to="/ai-roadmap" className={navLinkClass("/ai-roadmap")}>
              AI Roadmap
            </Link>
            <Link to="/my-roadmaps" className={navLinkClass("/my-roadmaps")}>
              My Roadmaps
            </Link>
            <Link to="/resume-analyzer" className={navLinkClass("/resume-analyzer")}>
              Resume Analyzer
            </Link>
          </>
        )}

        {/* Use isAuthenticated from the context */}
        {!isAuthenticated && (
          <>
            <Link to="/login" className={navLinkClass("/login")}>
              Login
            </Link>
            <Link to="/register" className={navLinkClass("/register")}>
              Register
            </Link>
          </>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Use isAuthenticated from the context */}
        {isAuthenticated && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg hover:shadow-md transition"
            >
              <User className="w-4 h-4 text-gray-700 dark:text-white" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {user?.name}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform ${
                  dropdownOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-2 z-50"
                >
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-left text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-700"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
        <ThemeToggle />
        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? (
            <X className="text-black dark:text-white" />
          ) : (
            <Menu className="text-black dark:text-white" />
          )}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
            className="absolute top-16 left-0 w-full bg-white dark:bg-gray-900 shadow-lg md:hidden flex flex-col space-y-4 p-4 z-40"
          >
            <Link to="/" className={navLinkClass("/")}>
              Home
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className={navLinkClass("/dashboard")}>
                  Dashboard
                </Link>
                <Link to="/ai-roadmap" className={navLinkClass("/ai-roadmap")}>
                  AI Roadmap
                </Link>
                <Link to="/my-roadmaps" className={navLinkClass("/my-roadmaps")}>
                  My Roadmaps
                </Link>
                <Link to="/resume-analyzer" className={navLinkClass("/resume-analyzer")}>
                  Resume Analyzer
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="text-left text-red-600 dark:text-red-400 hover:text-red-500 transition"
                >
                  Logout
                </button>
              </>
            )}
            {!isAuthenticated && (
              <>
                <Link to="/login" className={navLinkClass("/login")}>
                  Login
                </Link>
                <Link to="/register" className={navLinkClass("/register")}>
                  Register
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
