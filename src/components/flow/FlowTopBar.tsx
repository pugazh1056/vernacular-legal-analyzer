"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLegalFlow } from "@/context/LegalFlowContext";
import { ThemeToggle } from "@/components/legal/ThemeToggle";

type FlowTopBarProps = {
  showHome?: boolean;
};

export function FlowTopBar({ showHome = true }: FlowTopBarProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { reset } = useLegalFlow();

  const onLogout = () => {
    reset();
    logout();
    router.push("/");
  };

  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-6 dark:border-slate-700">
      <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2">
        {showHome ? (
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 underline-offset-2 hover:text-slate-900 hover:underline dark:text-slate-400 dark:hover:text-slate-100"
          >
            Home
          </Link>
        ) : null}
        {user ? (
          <span className="truncate text-sm text-slate-500 dark:text-slate-400" title={user.email}>
            {user.username}
          </span>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {user ? (
          <button
            type="button"
            onClick={onLogout}
            className="min-h-10 rounded-lg border border-slate-300 bg-[var(--card)] px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Log out
          </button>
        ) : null}
        <ThemeToggle />
      </div>
    </div>
  );
}
