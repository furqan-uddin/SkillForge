//src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-bg-gray-100 dark:bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="flex items-center space-x-2">
        <span className="text-2xl font-bold dark:text-bg-gray-100">SkillForge</span>
      </div>
      <div className="hidden md:flex space-x-6 dark:text-white">
        <Link to="/" className="hover:text-blue-500">Home</Link>
        <Link to="/dashboard" className="hover:text-blue-500">Dashboard</Link>
        <Link to="/career-form" className="hover:text-blue-500">Career Form</Link>
        <Link to="/ai-roadmap" className="hover:text-blue-500">AI Roadmap</Link>
        {/* <a href="#" className="hover:text-blue-500">Home</a> */}
        {/* <a href="#" className="hover:text-blue-500">Dashboard</a> */}
        {/* <a href="#" className="hover:text-blue-500">Roadmap</a> */}
        <a href="#" className="hover:text-blue-500">Resume Analyzer</a>
        <a href="#" className="hover:text-blue-500">Login</a>
      </div>
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        <button className="md:hidden" onClick={toggleMenu}>
          {isOpen ? <X className="text-black dark:text-white" /> : <Menu className="text-black dark:text-white" />}
        </button>
      </div>
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white dark:bg-gray-900 shadow-md md:hidden flex flex-col space-y-4 p-4">
            <Link to="/" className="hover:text-blue-500">Home</Link>
            <Link to="/dashboard" className="hover:text-blue-500">Dashboard</Link>
            <Link to="/career-form" className="hover:text-blue-500">Career Form</Link>
          {/* <a href="#" className="hover:text-blue-500">Home</a> */}
          {/* <a href="#" className="hover:text-blue-500">Dashboard</a> */}
          <a href="#" className="hover:text-blue-500">Roadmap</a>
          <a href="#" className="hover:text-blue-500">Resume Analyzer</a>
          <a href="#" className="hover:text-blue-500">Login</a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
