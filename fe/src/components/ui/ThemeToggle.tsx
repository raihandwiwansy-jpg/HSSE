'use client';

import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useState, useEffect } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-[108px] h-9 bg-gray-105 dark:bg-gray-800 animate-pulse rounded-2xl" />
    );
  }

  const themeOptions = [
    { value: 'light' as const, icon: Sun, label: 'Light' },
    { value: 'dark' as const, icon: Moon, label: 'Dark' },
    { value: 'system' as const, icon: Monitor, label: 'System' },
  ];

  const activeIndex = themeOptions.findIndex((o) => o.value === theme);

  return (
    <div className="relative flex items-center bg-gray-100 dark:bg-gray-800/80 rounded-2xl p-1 gap-0.5 border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300">
      {/* Sliding indicator */}
      <div
        className="absolute top-1 bottom-1 rounded-xl transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-0 shadow-sm"
        style={{
          width: `calc(${100 / themeOptions.length}% - 2px)`,
          left: `calc(${(100 / themeOptions.length) * (activeIndex >= 0 ? activeIndex : 2)}% + 1px)`,
          background: 'linear-gradient(135deg, #1A365D, #2B4C7E)',
        }}
      />
      {themeOptions.map((opt) => {
        const Icon = opt.icon;
        const isActive = theme === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => setTheme(opt.value)}
            className={`relative z-10 flex items-center justify-center w-8 h-7 rounded-xl transition-all duration-300 ${
              isActive
                ? 'text-white scale-110 drop-shadow-sm'
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:scale-105'
            }`}
            title={opt.label}
          >
            <Icon
              size={14}
              strokeWidth={isActive ? 2.5 : 1.8}
              className="transition-all duration-500"
            />
          </button>
        );
      })}
    </div>
  );
}
