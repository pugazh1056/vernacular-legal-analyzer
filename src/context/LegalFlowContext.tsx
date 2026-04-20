"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useDocumentAnalysis } from "@/hooks/useDocumentAnalysis";

export type UserRole = "business" | "individual";

const ROLE_STORAGE_KEY = "legal-analyser-role";

type AnalysisApi = ReturnType<typeof useDocumentAnalysis>;

type LegalFlowContextValue = AnalysisApi & {
  role: UserRole | null;
  roleHydrated: boolean;
  setRole: (role: UserRole) => void;
};

const LegalFlowContext = createContext<LegalFlowContextValue | null>(null);

export function LegalFlowProvider({ children }: { children: React.ReactNode }) {
  const analysisApi = useDocumentAnalysis();
  const [role, setRoleState] = useState<UserRole | null>(null);
  const [roleHydrated, setRoleHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(ROLE_STORAGE_KEY);
      if (raw === "business" || raw === "individual") {
        setRoleState(raw);
      }
    } catch {
      /* ignore */
    }
    setRoleHydrated(true);
  }, []);

  const setRole = useCallback((r: UserRole) => {
    setRoleState(r);
    try {
      sessionStorage.setItem(ROLE_STORAGE_KEY, r);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(
    () => ({
      ...analysisApi,
      role,
      setRole,
      roleHydrated,
    }),
    [analysisApi, role, setRole, roleHydrated]
  );

  return (
    <LegalFlowContext.Provider value={value}>{children}</LegalFlowContext.Provider>
  );
}

export function useLegalFlow() {
  const ctx = useContext(LegalFlowContext);
  if (!ctx) {
    throw new Error("useLegalFlow must be used within LegalFlowProvider");
  }
  return ctx;
}
