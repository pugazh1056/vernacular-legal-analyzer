"use client";

import { useEffect, useState } from "react";
import {
  THEME_STORAGE_KEY,
  applyThemeClass,
  type ThemePreference,
} from "@/lib/theme";

function readInitial(): ThemePreference {
  if (typeof window === "undefined") return "light";
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    if (v === "dark" || v === "light") return v;
  } catch {
    /* ignore */
  }
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemePreference>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTheme(readInitial());
  }, []);

  const toggle = () => {
    const next: ThemePreference = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyThemeClass(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="rounded-lg border border-slate-300 bg-[var(--card)] px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
      aria-label={mounted && theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
    >
      {mounted && theme === "dark" ? "Light mode" : "Dark mode"}
    </button>
  );
}
