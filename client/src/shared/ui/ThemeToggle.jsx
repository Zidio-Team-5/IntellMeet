import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../theme/ThemeContext.jsx";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--card)] text-[var(--text-secondary)] transition-colors duration-150 hover:bg-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--border-hover)]"
    >
      {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  );
}