"use client";

import { useRouter } from "next/navigation";
import { useLegalFlow, type UserRole } from "@/context/LegalFlowContext";

const ROLES: { id: UserRole; title: string; description: string }[] = [
  {
    id: "business",
    title: "Business owner",
    description: "Contracts, vendor agreements, and commercial documents.",
  },
  {
    id: "individual",
    title: "Individual",
    description: "Leases, employment paperwork, and personal agreements.",
  },
];

export default function RolePage() {
  const router = useRouter();
  const { setRole } = useLegalFlow();

  const choose = (id: UserRole) => {
    setRole(id);
    router.push("/dashboard");
  };

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">
        How will you use this?
      </h1>
      <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">
        Choose the option that best describes you. You can change this anytime by starting again from the home page.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {ROLES.map(({ id, title, description }) => (
          <button
            key={id}
            type="button"
            onClick={() => choose(id)}
            className="min-h-[11rem] rounded-xl border-2 border-slate-200 bg-[var(--card)] p-6 text-left shadow-sm transition-colors hover:border-[var(--accent)] hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800/50"
          >
            <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {title}
            </span>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {description}
            </p>
            <span className="mt-4 inline-block text-sm font-medium text-[var(--accent)] dark:text-sky-400">
              Continue →
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
