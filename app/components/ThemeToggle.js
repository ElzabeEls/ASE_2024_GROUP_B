"use client";
import { useEffect, useState } from "react";

/**
 * A component to toggle between dark and light themes.
 *
 * @function ThemeToggle
 * @returns {JSX.Element} The button that switches between dark and light modes.
 */
const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Ensure that localStorage is only accessed on the client side.
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      const prefersDark = savedTheme ? savedTheme === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDarkMode(prefersDark);
      document.documentElement.classList.toggle("dark", prefersDark);
    }
  }, []);

  useEffect(() => {
    // Update theme in localStorage and the document class.
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 bg-gray-200 rounded dark:bg-gray-800"
      aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"} // Accessible label
    >
      {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    </button>
  );
};

export default ThemeToggle;
