
import React, { useEffect, useState } from "react";

const THEME_KEY = "skillgap_theme";

const ThemeToggle = () => {
  const [dark, setDark] = useState(() => {
    try {
      const s = localStorage.getItem(THEME_KEY);
      if (s) return s === "dark";
      // fallback: system preference
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
  }, [dark]);

  return (

    ""
  );
};

export default ThemeToggle;
