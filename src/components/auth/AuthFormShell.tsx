import Link from "next/link";
import { ThemeToggle } from "@/components/legal/ThemeToggle";

type AuthFormShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
};

export function AuthFormShell({ title, subtitle, children, footer }: AuthFormShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between gap-3 px-4 py-4 sm:px-8">
        <Link
          href="/"
          className="text-sm font-medium text-slate-600 underline-offset-2 hover:text-slate-900 hover:underline dark:text-slate-400 dark:hover:text-slate-100"
        >
          Home
        </Link>
        <ThemeToggle />
      </header>
      <main className="flex flex-1 flex-col items-center justify-center px-4 pb-16 pt-4 sm:px-6">
        <div className="w-full max-w-md rounded-xl border border-slate-200 bg-[var(--card)] p-8 shadow-sm dark:border-slate-600">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            {title}
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-8 border-t border-slate-200 pt-6 text-center text-sm text-slate-600 dark:border-slate-600 dark:text-slate-400">
            {footer}
          </div>
        </div>
      </main>
    </div>
  );
}
