import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { PropsWithChildren } from "react";

export const THEME_STORAGE_KEY = "tool-management-theme";
export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
} as const;

type ThemeMode = (typeof THEMES)[keyof typeof THEMES];

interface ThemeContextValue {
  theme: ThemeMode;
  isDark: boolean;
  setTheme: React.Dispatch<React.SetStateAction<ThemeMode>>;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const applyThemeClass = (theme: ThemeMode): void => {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.classList.remove(THEMES.LIGHT, THEMES.DARK);
  document.documentElement.classList.add(theme);
  document.documentElement.style.colorScheme = theme;
};

const getStoredTheme = (): ThemeMode => {
  if (typeof window === "undefined") {
    return THEMES.LIGHT;
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  return storedTheme === THEMES.DARK ? THEMES.DARK : THEMES.LIGHT;
};

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [theme, setTheme] = useState<ThemeMode>(() => getStoredTheme());

  useEffect(() => {
    applyThemeClass(theme);
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK));
  };

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      isDark: theme === THEMES.DARK,
      setTheme,
      toggleTheme,
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
};
