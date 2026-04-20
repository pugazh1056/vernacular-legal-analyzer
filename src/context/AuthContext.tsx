"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  clearSession,
  displayNameFallbackFromEmail,
  EMAIL_REGEX,
  loadSession,
  loadUsers,
  normalizeEmail,
  normalizeUsernameKey,
  saveSession,
  saveUsers,
  sha256Hex,
  USERNAME_REGEX,
  type AuthSession,
} from "@/lib/auth-client";

export type AuthUser = { email: string; username: string };

type AuthContextValue = {
  user: AuthUser | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<{ ok: true } | { ok: false; message: string }>;
  signup: (
    email: string,
    password: string,
    username: string
  ) => Promise<{ ok: true } | { ok: false; message: string }>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function resolveUsername(email: string, session: AuthSession, record: { username?: string } | undefined): string {
  if (session.username?.trim()) return session.username.trim();
  if (record?.username?.trim()) return record.username.trim();
  return displayNameFallbackFromEmail(email);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = loadSession();
    if (!session) {
      setReady(true);
      return;
    }
    const users = loadUsers();
    const record = users.find((u) => u.email === session.email);
    const username = resolveUsername(session.email, session, record);
    setUser({ email: session.email, username });
    if (!session.username || session.username !== username) {
      saveSession({ email: session.email, username });
    }
    setReady(true);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const normalized = normalizeEmail(email);
    if (!normalized || !EMAIL_REGEX.test(normalized)) {
      return { ok: false as const, message: "Enter a valid email address." };
    }
    const hash = await sha256Hex(password);
    const users = loadUsers();
    const match = users.find((u) => u.email === normalized && u.passwordHash === hash);
    if (!match) {
      return { ok: false as const, message: "Invalid email or password." };
    }
    const username =
      match.username?.trim() || displayNameFallbackFromEmail(normalized);
    const session: AuthSession = { email: normalized, username };
    saveSession(session);
    setUser({ email: normalized, username });
    return { ok: true as const };
  }, []);

  const signup = useCallback(async (email: string, password: string, usernameRaw: string) => {
    const normalized = normalizeEmail(email);
    if (!normalized || !EMAIL_REGEX.test(normalized)) {
      return { ok: false as const, message: "Enter a valid email address." };
    }
    if (password.length < 8) {
      return { ok: false as const, message: "Password must be at least 8 characters." };
    }
    const username = usernameRaw.trim();
    if (!USERNAME_REGEX.test(username)) {
      return {
        ok: false as const,
        message:
          "Username must be 2–32 characters, start with a letter or number, and use only letters, numbers, underscores, or hyphens.",
      };
    }
    const users = loadUsers();
    if (users.some((u) => u.email === normalized)) {
      return { ok: false as const, message: "An account with this email already exists." };
    }
    const key = normalizeUsernameKey(username);
    if (
      users.some(
        (u) => u.username && normalizeUsernameKey(u.username) === key
      )
    ) {
      return { ok: false as const, message: "That username is already taken." };
    }
    const passwordHash = await sha256Hex(password);
    saveUsers([...users, { email: normalized, passwordHash, username }]);
    const session: AuthSession = { email: normalized, username };
    saveSession(session);
    setUser({ email: normalized, username });
    return { ok: true as const };
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, ready, login, signup, logout }),
    [user, ready, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
