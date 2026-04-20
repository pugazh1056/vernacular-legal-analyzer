"use client";

import { AuthProvider } from "@/context/AuthContext";
import { LegalFlowProvider } from "@/context/LegalFlowContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LegalFlowProvider>{children}</LegalFlowProvider>
    </AuthProvider>
  );
}
