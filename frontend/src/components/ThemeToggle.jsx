import { useTheme } from "../context/themeContext";

function ThemeToggle({ floating = false }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className={floating ? "theme-toggle floating" : "theme-toggle"}
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? "☀ Light" : "🌙 Dark"}
    </button>
  );
}

export default ThemeToggle;