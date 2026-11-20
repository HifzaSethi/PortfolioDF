import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

export type DfTheme = 'day' | 'night';

const STORAGE_KEY = 'df-theme';

interface ThemeContextValue {
  theme: DfTheme;
  setTheme: (theme: DfTheme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function syncThemeMeta(theme: DfTheme) {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', theme);
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (meta) {
    meta.content = theme === 'night' ? '#010102' : '#F4F1EA';
  }
}

function readInitialTheme(): DfTheme {
  if (typeof document !== 'undefined') {
    const attr = document.documentElement.getAttribute('data-theme');
    if (attr === 'day' || attr === 'night') return attr;
  }
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'day') return 'day';
  } catch {
    // Ignore storage access errors
  }
  return 'night';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<DfTheme>(readInitialTheme);

  const setTheme = useCallback((next: DfTheme) => {
    setThemeState(next);
    syncThemeMeta(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore storage access errors
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'day' ? 'night' : 'day');
  }, [theme, setTheme]);

  useEffect(() => {
    syncThemeMeta(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}
