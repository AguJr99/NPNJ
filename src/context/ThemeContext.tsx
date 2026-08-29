import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeMode = 'light' | 'dark';
export type ThemePreference = 'system' | 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  themePreference: ThemePreference;
  setThemePreference: (pref: ThemePreference) => void;
  toggleTheme: () => void;
  isDark: boolean;
  lightLogoUrl: string;
  darkLogoUrl: string;
  currentLogoUrl: string;
}

export const LOGO_LIGHT_URL = "https://drive.google.com/thumbnail?id=1SNYDAboBD9vP0PzVujqFPq5d7UMmEF3u&sz=w800";
export const LOGO_DARK_URL = "https://drive.google.com/thumbnail?id=11D2087BrLkq2atuQejP3ak6F37Vg2fX8&sz=w800";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('npnj_theme_preference') as ThemePreference;
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        return saved;
      }
    }
    return 'system';
  });

  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Listen to system theme changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemPrefersDark(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Compute active theme
  const resolvedTheme: ThemeMode = themePreference === 'system'
    ? (systemPrefersDark ? 'dark' : 'light')
    : themePreference;

  // Apply theme to document element
  useEffect(() => {
    const root = document.documentElement;
    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
    }
  }, [resolvedTheme]);

  const setThemePreference = (pref: ThemePreference) => {
    setThemePreferenceState(pref);
    try {
      localStorage.setItem('npnj_theme_preference', pref);
    } catch (e) {
      console.error('Failed to save theme preference to localStorage', e);
    }
  };

  const toggleTheme = () => {
    // If currently dark, toggle to light; if currently light, toggle to dark
    const nextTheme: ThemeMode = resolvedTheme === 'dark' ? 'light' : 'dark';
    setThemePreference(nextTheme);
  };

  const isDark = resolvedTheme === 'dark';
  const currentLogoUrl = isDark ? LOGO_DARK_URL : LOGO_LIGHT_URL;

  return (
    <ThemeContext.Provider
      value={{
        theme: resolvedTheme,
        themePreference,
        setThemePreference,
        toggleTheme,
        isDark,
        lightLogoUrl: LOGO_LIGHT_URL,
        darkLogoUrl: LOGO_DARK_URL,
        currentLogoUrl
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
