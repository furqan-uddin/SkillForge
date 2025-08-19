// SKILLFORGE/src/components/Navbar.jsx
// src/components/Navbar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, X, User, ChevronDown, LogOut, LayoutDashboard } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Read user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    // Close dropdown if click outside
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    // Listen for cross-tab storage events (other tabs)
    const onStorage = (e) => {
      if (e.key === "user" || e.key === "token") {
        const su = localStorage.getItem("user");
        setUser(su ? JSON.parse(su) : null);
      }
    };
    window.addEventListener("storage", onStorage);

    // Listen for same-tab auth broadcasts from authHelper.loginUser / logoutUser
    const onAuthBroadcast = () => {
      const su = localStorage.getItem("user");
      setUser(su ? JSON.parse(su) : null);
    };
    window.addEventListener("skillforge-auth", onAuthBroadcast);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("skillforge-auth", onAuthBroadcast);
    };
  }, []);

  const handleLogout = () => {
    // keep behavior exactly as original: remove localStorage items, navigate to login
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    // broadcast so other components can react
    window.dispatchEvent(new Event("skillforge-auth"));
    navigate("/login");
  };

  const navLinkClass = (path) =>
    `transition hover:text-blue-500 ${
      location.pathname === path ? "text-blue-600 font-semibold" : "text-gray-700 dark:text-gray-200"
    }`;

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
      {/* Brand */}
      <div onClick={() => navigate("/")} className="text-2xl font-bold text-blue-600 cursor-pointer hover:text-blue-700 transition">
        SkillForge
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-6">
        <Link to="/" className={navLinkClass("/")}>Home</Link>

        {user && (
          <>
            <Link to="/career-form" className={navLinkClass("/career-form")}>Career Form</Link>
            <Link to="/ai-roadmap" className={navLinkClass("/ai-roadmap")}>AI Roadmap</Link>
            <Link to="/resume-analyzer" className={navLinkClass("/resume-analyzer")}>Resume Analyzer</Link>
          </>
        )}

        {!user && (
          <>
            <Link to="/login" className={navLinkClass("/login")}>Login</Link>
            <Link to="/register" className={navLinkClass("/register")}>Register</Link>
          </>
        )}
      </div>

      {/* Right-side: Dropdown + Theme + Mobile Toggle */}
      <div className="flex items-center gap-4">
        {user && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              <User className="w-4 h-4 text-gray-700 dark:text-white" />
              <span className="text-sm text-gray-700 dark:text-gray-200 font-medium">{user.name}</span>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${dropdownOpen ? "rotate-180" : "rotate-0"}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50 animate-fade-in">
                <button onClick={() => { navigate("/profile"); setDropdownOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200">
                  <User size={16} /> Profile
                </button>
                <button onClick={() => { navigate("/dashboard"); setDropdownOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200">
                  <LayoutDashboard size={16} /> Dashboard
                </button>
                <button onClick={() => handleLogout()} className="w-full flex items-center gap-2 px-4 py-2 text-left text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-700">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        )}

        <ThemeToggle />

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="text-black dark:text-white" /> : <Menu className="text-black dark:text-white" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white dark:bg-gray-900 shadow-md md:hidden flex flex-col space-y-4 p-4 z-40">
          <Link to="/" className={navLinkClass("/")}>Home</Link>

          {user && (
            <>
              <Link to="/career-form" className={navLinkClass("/career-form")}>Career Form</Link>
              <Link to="/ai-roadmap" className={navLinkClass("/ai-roadmap")}>AI Roadmap</Link>
              <Link to="/resume-analyzer" className={navLinkClass("/resume-analyzer")}>Resume Analyzer</Link>
              <button onClick={() => { handleLogout(); setIsOpen(false); }} className="text-left text-red-600 dark:text-red-400 hover:text-red-500 transition">Logout</button>
            </>
          )}

          {!user && (
            <>
              <Link to="/login" className={navLinkClass("/login")}>Login</Link>
              <Link to="/register" className={navLinkClass("/register")}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
