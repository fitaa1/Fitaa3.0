import { createContext, useContext, useEffect, useState } from "react";

interface ThemeContextValue {
  isDark: boolean;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({ isDark: false, toggle: () => {} });

const STORAGE_KEY = "fitaa-theme-v2";
const deviceQuery = () => window.matchMedia?.("(prefers-color-scheme: dark)");

function savedTheme(): "dark" | "light" | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "dark" || v === "light" ? v : null;
  } catch {
    return null; /* storage blocked (private mode) */
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  /* index.html already applied the right class before first paint; start from it. */
  const [isDark, setIsDark] = useState<boolean>(() =>
    document.documentElement.classList.contains("dark"),
  );

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", isDark);
    root.style.colorScheme = isDark ? "dark" : "light";
  }, [isDark]);

  /* Follow the device setting live, until the visitor picks a theme themselves. */
  useEffect(() => {
    const mq = deviceQuery();
    if (!mq || savedTheme()) return;
    const onChange = (e: MediaQueryListEvent) => {
      if (!savedTheme()) setIsDark(e.matches);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const toggle = () =>
    setIsDark((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
      } catch {
        /* storage blocked: theme still applies for this visit */
      }
      return next;
    });

  return <ThemeContext.Provider value={{ isDark, toggle }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
