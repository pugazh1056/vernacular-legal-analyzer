"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AuthFormShell } from "@/components/auth/AuthFormShell";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, ready, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const nextRaw = searchParams.get("next");
  const nextPath =
    nextRaw && nextRaw.startsWith("/") && !nextRaw.startsWith("//")
      ? nextRaw
      : "/role";

  useEffect(() => {
    if (!ready || !user) return;
    router.replace(nextPath);
  }, [ready, user, router, nextPath]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const result = await login(email, password);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      router.replace(nextPath);
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="space-y-4">
      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-200" role="alert">
          {error}
        </p>
      ) : null}
      <div>
        <label htmlFor="login-email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-[var(--accent)] focus:border-transparent focus:ring-2 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
        />
      </div>
      <div>
        <label htmlFor="login-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Password
        </label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-[var(--accent)] focus:border-transparent focus:ring-2 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="min-h-11 w-full rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

function LoginFallback() {
  return <p className="text-center text-sm text-slate-500 dark:text-slate-400">Loading…</p>;
}

export default function LoginPage() {
  return (
    <AuthFormShell
      title="Sign in"
      subtitle="Use the account you created. Your session is stored on this device only (demo auth)."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-[var(--accent)] underline-offset-2 hover:underline dark:text-sky-400">
            Sign up
          </Link>
        </>
      }
    >
      <Suspense fallback={<LoginFallback />}>
        <LoginForm />
      </Suspense>
    </AuthFormShell>
  );
}
