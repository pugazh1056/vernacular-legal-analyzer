"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AuthFormShell } from "@/components/auth/AuthFormShell";
import { EMAIL_REGEX, USERNAME_REGEX } from "@/lib/auth-client";

export default function SignupPage() {
  const router = useRouter();
  const { user, ready, signup } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!ready || !user) return;
    router.replace("/role");
  }, [ready, user, router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!USERNAME_REGEX.test(username.trim())) {
      setError(
        "Username must be 2–32 characters, start with a letter or number, and use only letters, numbers, underscores, or hyphens."
      );
      return;
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setPending(true);
    try {
      const result = await signup(email, password, username);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      router.replace("/role");
    } finally {
      setPending(false);
    }
  };

  return (
    <AuthFormShell
      title="Create an account"
      subtitle="Sign up to use the analyser. Credentials are stored locally in your browser for this demo — not a production auth system."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-[var(--accent)] underline-offset-2 hover:underline dark:text-sky-400">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={(e) => void onSubmit(e)} className="space-y-4">
        {error ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-200" role="alert">
            {error}
          </p>
        ) : null}
        <div>
          <label htmlFor="signup-username" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Username
          </label>
          <input
            id="signup-username"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={2}
            maxLength={32}
            className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-[var(--accent)] focus:border-transparent focus:ring-2 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            placeholder="e.g. tarunya_sree"
          />
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            2–32 characters: letters, numbers, underscores, or hyphens. Shown in your dashboard greeting.
          </p>
        </div>
        <div>
          <label htmlFor="signup-email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Email
          </label>
          <input
            id="signup-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-[var(--accent)] focus:border-transparent focus:ring-2 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>
        <div>
          <label htmlFor="signup-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Password
          </label>
          <input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-[var(--accent)] focus:border-transparent focus:ring-2 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          />
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">At least 8 characters.</p>
        </div>
        <div>
          <label htmlFor="signup-confirm" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Confirm password
          </label>
          <input
            id="signup-confirm"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-[var(--accent)] focus:border-transparent focus:ring-2 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="min-h-11 w-full rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {pending ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthFormShell>
  );
}
