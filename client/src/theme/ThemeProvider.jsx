import { useEffect, useMemo, useState, useCallback } from "react";
import { ThemeContext } from "./ThemeContext.jsx";
import { STORAGE_KEYS } from "../shared/utils/constants.js";

const systemPrefersDark = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches;

const resolve = (mode) => (mode === "system" ? (systemPrefersDark() ? "dark" : "light") : mode);

export function ThemeProvider({ children }) {
  // `mode` is the user's choice: light | dark | system. `theme` is what's applied.
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved === "light" || saved === "dark" || saved === "system") return saved;
    return "system";
  });

  const [theme, setTheme] = useState(() => resolve(localStorage.getItem(STORAGE_KEYS.THEME) || "system"));

  // Apply resolved theme + persist the chosen mode.
  useEffect(() => {
    const applied = resolve(mode);
    setTheme(applied);
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(applied);
    localStorage.setItem(STORAGE_KEYS.THEME, mode);
  }, [mode]);

  // When in system mode, follow OS changes live.
  useEffect(() => {
    if (mode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const applied = systemPrefersDark() ? "dark" : "light";
      setTheme(applied);
      const root = document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(applied);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [mode]);

  const toggleTheme = useCallback(
    () => setMode(resolve(mode) === "dark" ? "light" : "dark"),
    [mode]
  );

  // Backward-compatible: setTheme(value) used by older callers maps to setMode.
  const value = useMemo(
    () => ({ mode, theme, setMode, setTheme: setMode, toggleTheme }),
    [mode, theme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export default ThemeProvider;
