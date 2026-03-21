import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const THEME_STORAGE_KEY = 'tool-management-theme';
const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
};

const ThemeContext = createContext(null);

const applyThemeClass = (theme) => {
  if (typeof document === 'undefined') {
    return;
  }

  document.documentElement.classList.remove(THEMES.LIGHT, THEMES.DARK);
  document.documentElement.classList.add(theme);
  document.documentElement.style.colorScheme = theme;
};

const getStoredTheme = () => {
  if (typeof window === 'undefined') {
    return THEMES.LIGHT;
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  return storedTheme === THEMES.DARK ? THEMES.DARK : THEMES.LIGHT;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => getStoredTheme());

  useEffect(() => {
    applyThemeClass(theme);
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK));
  };

  const value = useMemo(
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

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return context;
};

export { THEMES, THEME_STORAGE_KEY };
