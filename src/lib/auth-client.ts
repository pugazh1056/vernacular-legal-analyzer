export const AUTH_USERS_KEY = "legal-analyser-auth-users";
export const AUTH_SESSION_KEY = "legal-analyser-auth-session";

export type StoredUser = {
  email: string;
  passwordHash: string;
  /** Display username; missing on legacy accounts. */
  username?: string;
};

export type AuthSession = {
  email: string;
  username?: string;
};

export async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

export function loadUsers(): StoredUser[] {
  return readJson<StoredUser[]>(AUTH_USERS_KEY, []);
}

export function saveUsers(users: StoredUser[]): void {
  writeJson(AUTH_USERS_KEY, users);
}

export function loadSession(): AuthSession | null {
  const s = readJson<AuthSession | null>(AUTH_SESSION_KEY, null);
  if (s && typeof s.email === "string") return s;
  return null;
}

/** 2–32 chars: letters, numbers, underscore, hyphen; must start with letter or number. */
export const USERNAME_REGEX = /^[a-zA-Z0-9][a-zA-Z0-9_-]{1,31}$/;

export function normalizeUsernameKey(raw: string): string {
  return raw.trim().toLowerCase();
}

export function displayNameFallbackFromEmail(email: string): string {
  const local = email.split("@")[0]?.trim() || "there";
  return local
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function saveSession(session: AuthSession): void {
  writeJson(AUTH_SESSION_KEY, session);
}

export function clearSession(): void {
  try {
    localStorage.removeItem(AUTH_SESSION_KEY);
  } catch {
    /* ignore */
  }
}

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
