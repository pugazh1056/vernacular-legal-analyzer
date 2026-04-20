import Link from "next/link";
import { ThemeToggle } from "@/components/legal/ThemeToggle";
import { Scale } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex flex-wrap items-center justify-end gap-3 px-4 py-4 sm:px-8">
        <Link
          href="/login"
          className="min-h-10 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Log in
        </Link>
        <Link
          href="/signup"
          className="min-h-10 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90"
        >
          Sign up
        </Link>
        <ThemeToggle />
      </header>
      <main className="flex flex-1 flex-col items-center justify-center px-4 pb-24 pt-8 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <Scale className="h-10 w-10 text-[var(--accent)] sm:h-12 sm:w-12" />
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl dark:text-slate-100">
              Legal document analyser
            </h1>
          </div>
          <p className="mt-6 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            Upload a contract or agreement for AI-assisted summary, risk highlights, and clause review — then ask
            follow-up questions scoped to your file.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex min-h-12 min-w-[12rem] items-center justify-center rounded-xl bg-[var(--accent)] px-8 py-3 text-base font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
            >
              Get started
            </Link>
            <Link
              href="/login"
              className="inline-flex min-h-12 min-w-[12rem] items-center justify-center rounded-xl border border-slate-300 bg-[var(--card)] px-8 py-3 text-base font-semibold text-slate-800 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              Log in
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
