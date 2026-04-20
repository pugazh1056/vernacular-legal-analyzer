export const THEME_STORAGE_KEY = "legal-analyser-theme";

export type ThemePreference = "light" | "dark";

export function getStoredTheme(): ThemePreference | null {
  if (typeof window === "undefined") return null;
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    if (v === "dark" || v === "light") return v;
  } catch {
    /* ignore */
  }
  return null;
}

export function applyThemeClass(theme: ThemePreference): void {
  document.documentElement.classList.toggle("dark", theme === "dark");
}
