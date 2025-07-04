//src/components/ThemeToggle.jsx
import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded transition-all duration-300 bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
    >
      {theme === "light" ? <Moon /> : <Sun />}
    </button>
  );
};
