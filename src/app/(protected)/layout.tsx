"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardTop } from "@/components/dashboard/DashboardTop";

export default function ProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AuthGuard>
      <div className="h-full relative flex bg-slate-50 dark:bg-slate-950">
        <div className="hidden h-full md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-[80]">
          <Sidebar />
        </div>
        <main className="md:pl-64 flex-1 h-full overflow-y-auto">
          <DashboardTop />
          <div className="p-4 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
