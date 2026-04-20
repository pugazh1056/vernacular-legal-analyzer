"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, FileText, Settings, Users, ShieldAlert } from "lucide-react";

const routes = [
  {
    label: "Overview",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Documents",
    icon: FileText,
    href: "/results",
    color: "text-violet-500",
  },
  {
    label: "Risk Alerts",
    icon: ShieldAlert,
    href: "/dashboard#risks",
    color: "text-amber-500",
  },
  {
    label: "Team",
    icon: Users,
    href: "/dashboard#team",
    color: "text-emerald-500",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/role",
    color: "text-slate-500",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#faf7f2] dark:bg-slate-900 border-r border-amber-100 dark:border-slate-800 text-slate-800 dark:text-slate-200">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <div className="relative w-8 h-8 mr-4 bg-[#c9a227] rounded flex items-center justify-center text-white font-bold shadow">
            LA
          </div>
          <h1 className="text-xl font-bold tracking-tight">Legal AI</h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-slate-900 hover:bg-slate-200 dark:hover:text-white dark:hover:bg-slate-800 rounded-lg transition",
                pathname === route.href ? "bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-white" : "text-slate-600 dark:text-slate-400"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}