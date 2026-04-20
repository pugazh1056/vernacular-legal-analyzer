"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLegalFlow } from "@/context/LegalFlowContext";
import { ResultsExperience } from "@/components/flow/ResultsExperience";

export default function ResultsPage() {
  const router = useRouter();
  const { roleHydrated, role, analysis, sessionId } = useLegalFlow();

  useEffect(() => {
    if (!roleHydrated) return;
    if (!role) {
      router.replace("/role");
      return;
    }
    if (!analysis || !sessionId) {
      router.replace("/dashboard");
    }
  }, [roleHydrated, role, analysis, sessionId, router]);

  if (!roleHydrated || !role || !analysis || !sessionId) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <p className="text-center text-slate-600 dark:text-slate-400">Loading…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <ResultsExperience />
    </div>
  );
}
