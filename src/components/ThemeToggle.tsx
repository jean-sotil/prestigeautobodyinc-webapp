'use client';

import { useEffect, useState } from 'react';
import { SunIcon, MoonIcon } from '@/components/ui/Icons';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
      .matches
      ? 'dark'
      : 'light';
    const initialTheme = savedTheme || systemTheme;

    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <button
        className="p-2 rounded-md bg-gray-100 text-gray-600 transition-colors min-w-[44px] min-h-[44px]"
        aria-label="Toggle theme"
      >
        <SunIcon size={20} />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 transition-colors min-w-[44px] min-h-[44px]"
      aria-label={
        theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
      }
    >
      {theme === 'light' ? (
        <SunIcon size={20} ariaLabel="Light mode" />
      ) : (
        <MoonIcon size={20} ariaLabel="Dark mode" />
      )}
    </button>
  );
}
