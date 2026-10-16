import { createContext, useContext, useEffect, useState } from "react";

interface ThemeContextValue {
  isDark: boolean;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({ isDark: true, toggle: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("fitaa-theme");
      if (saved) return saved === "dark";
    } catch {
      /* storage blocked (private mode): fall back to dark */
    }
    return true;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    try {
      localStorage.setItem("fitaa-theme", isDark ? "dark" : "light");
    } catch {
      /* storage blocked: theme still applies for this visit */
    }
  }, [isDark]);

  const toggle = () => setIsDark((prev) => !prev);

  return <ThemeContext.Provider value={{ isDark, toggle }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
