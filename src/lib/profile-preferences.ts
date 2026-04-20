const PROFILE_LANGUAGE_KEY = "legal-analyser-profile-language";

export const LANGUAGE_OPTIONS = [
  { value: "en-US", label: "English (US)" },
  { value: "en-GB", label: "English (UK)" },
  { value: "hi", label: "Hindi" },
  { value: "ta", label: "Tamil" },
] as const;

export const OUTPUT_LANGUAGE_CODES = LANGUAGE_OPTIONS.map((o) => o.value);

const ALLOWED_LANG = new Set<string>(OUTPUT_LANGUAGE_CODES);

/** Valid codes for API / FormData (defaults to en-US). */
export function parseOutputLanguageCode(raw: unknown): string {
  if (typeof raw === "string" && ALLOWED_LANG.has(raw)) return raw;
  return "en-US";
}

export function getLanguageOptionLabel(code: string): string {
  const o = LANGUAGE_OPTIONS.find((x) => x.value === code);
  return o?.label ?? code;
}

export const PREFERENCES_CHANGED_EVENT = "legal-analyser-preferences-changed";

export function notifyPreferencesChanged(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(PREFERENCES_CHANGED_EVENT));
  }
}

export function getStoredProfileLanguage(): string {
  if (typeof window === "undefined") return "en-US";
  try {
    const v = localStorage.getItem(PROFILE_LANGUAGE_KEY);
    if (v && LANGUAGE_OPTIONS.some((o) => o.value === v)) return v;
  } catch {
    /* ignore */
  }
  return "en-US";
}

export function setStoredProfileLanguage(value: string): void {
  try {
    localStorage.setItem(PROFILE_LANGUAGE_KEY, value);
  } catch {
    /* ignore */
  }
  notifyPreferencesChanged();
}
