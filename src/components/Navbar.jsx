import { Link, useLocation, useNavigate } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, X, User, ChevronDown, LogOut, LayoutDashboard, Compass, BookOpen, FileText } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const { user, isAuthenticated, logout } = useAuth();

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
    logout();
    navigate("/login");
  };

  const navLinkClass = (path) =>
    `flex items-center gap-2 transition duration-200 px-3 py-1 rounded-md ${
      location.pathname === path
        ? "text-white bg-blue-600 dark:bg-blue-500 font-semibold shadow-md"
        : "text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
    }`;

  const getNavLinks = () => {
    const commonLinks = [
      { to: "/", name: "Home", icon: null },
    ];

    const authLinks = [
      { to: "/dashboard", name: "Dashboard", icon: <LayoutDashboard size={16} /> },
      { to: "/ai-roadmap", name: "AI Roadmap", icon: <Compass size={16} /> },
      { to: "/my-roadmaps", name: "My Roadmaps", icon: <BookOpen size={16} /> },
      { to: "/resume-analyzer", name: "Resume Analyzer", icon: <FileText size={16} /> },
    ];

    const guestLinks = [
      { to: "/login", name: "Login", icon: null },
      { to: "/register", name: "Register", icon: null },
    ];

    return isAuthenticated ? [...commonLinks, ...authLinks] : [...commonLinks, ...guestLinks];
  };

  const navLinks = getNavLinks();

  // New mobile menu close handler
  const handleMobileLinkClick = () => {
    setIsOpen(false);
  };

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
      <div className="hidden md:flex items-center space-x-2">
        {navLinks.map((link) => (
          <Link key={link.to} to={link.to} className={navLinkClass(link.to)}>
            {link.icon}
            <span>{link.name}</span>
          </Link>
        ))}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {isAuthenticated && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 bg-blue-600 text-white dark:bg-blue-500 px-3 py-1.5 rounded-lg hover:shadow-lg transition transform hover:scale-105"
            >
              <User className="w-4 h-4 text-white" />
              <span className="text-sm font-medium">
                {user?.name || "User"}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-white transition-transform ${
                  dropdownOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-2 z-50 origin-top-right"
                >
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition"
                  >
                    <User size={16} /> Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-left text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-700 transition"
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
        <button className="md:hidden p-2 rounded-md transition-colors hover:bg-gray-200 dark:hover:bg-gray-700" onClick={() => setIsOpen(!isOpen)}>
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
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.3 }}
            className="absolute top-16 left-0 w-full bg-white dark:bg-gray-900 shadow-lg md:hidden flex flex-col space-y-4 p-4 z-40"
          >
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} onClick={handleMobileLinkClick} className={navLinkClass(link.to)}>
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
            {isAuthenticated && (
              <button
                onClick={() => {
                  handleLogout();
                  handleMobileLinkClick();
                }}
                className="w-full flex items-center gap-2 px-3 py-1 rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 transition-colors"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;