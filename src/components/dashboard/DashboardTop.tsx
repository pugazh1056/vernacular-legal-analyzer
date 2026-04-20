"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLegalFlow } from "@/context/LegalFlowContext";
import { ThemeToggle } from "@/components/legal/ThemeToggle";
import { ProfileDetailsModal } from "@/components/dashboard/ProfileDetailsModal";
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";

function timeGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function DashboardTop() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { reset } = useLegalFlow();
  const [profileOpen, setProfileOpen] = useState(false);

  const name = user?.username?.trim() || "there";

  const onLogout = () => {
    reset();
    logout();
    router.push("/");
  };

  return (
    <>
      <ProfileDetailsModal open={profileOpen} onClose={() => setProfileOpen(false)} />
      <div className="w-full sticky top-0 z-50 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 h-16 flex items-center shadow-sm">
        <div className="flex w-full items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {timeGreeting()},{" "}
              <span className="font-semibold text-slate-900 dark:text-slate-100">{name}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setProfileOpen(true)}
              className="text-slate-700 dark:text-slate-300"
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-red-900/50 dark:hover:bg-red-950/30 dark:hover:text-red-400"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
