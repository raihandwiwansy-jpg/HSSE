'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(isDark: boolean) {
  const root = document.documentElement;
  if (isDark) {
    root.classList.add('dark');
    root.style.colorScheme = 'dark';
  } else {
    root.classList.remove('dark');
    root.style.colorScheme = 'light';
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  const resolveAndApply = useCallback((t: Theme) => {
    const isDark =
      t === 'dark' ||
      (t === 'system' && typeof window !== 'undefined' && getSystemTheme() === 'dark');
    setResolvedTheme(isDark ? 'dark' : 'light');
    applyTheme(isDark);
  }, []);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? (localStorage.getItem('theme') as Theme | null) : null;
    if (saved && ['light', 'dark', 'system'].includes(saved)) {
      setThemeState(saved);
      resolveAndApply(saved);
    } else {
      resolveAndApply('system');
    }
  }, [resolveAndApply]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (theme === 'system') {
        resolveAndApply('system');
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme, resolveAndApply]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    resolveAndApply(theme);
  }, [theme, resolveAndApply]);

  const setTheme = useCallback((t: Theme) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', t);
    }
    setThemeState(t);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
