import { useEffect, useState } from "react";

function useTheme() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme !== null) {
      return JSON.parse(savedTheme);
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(darkMode));
  }, [darkMode]);

  function toggleTheme() {
    setDarkMode((prevDarkMode) => !prevDarkMode);
  }

  return {
    darkMode,
    toggleTheme,
  };
}

export default useTheme;
