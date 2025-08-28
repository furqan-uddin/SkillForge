//SKILLFORGE/src/components/ThemeToggle.jsx
import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      whileHover={{ rotate: 10 }}
      onClick={toggleTheme}
      className="p-2 rounded-full transition-all duration-300 bg-gray-200 dark:bg-gray-700 hover:shadow-lg"
    >
      {theme === "light" ? (
        <Moon className="text-gray-800 w-5 h-5" />
      ) : (
        <Sun className="text-yellow-400 w-5 h-5" />
      )}
    </motion.button>
  );
};
