"use client";

import Link from "next/link";

function IconUpload({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
  );
}

function IconHistory({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function IconBookOpen({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}

function IconSparkles({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}

type ActionCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  color: "blue" | "green" | "purple" | "amber";
};

const colorClasses = {
  blue: {
    bg: "bg-blue-100 dark:bg-blue-950/40",
    icon: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
    hover: "hover:border-blue-300 dark:hover:border-blue-700",
  },
  green: {
    bg: "bg-emerald-100 dark:bg-emerald-950/40",
    icon: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-800",
    hover: "hover:border-emerald-300 dark:hover:border-emerald-700",
  },
  purple: {
    bg: "bg-purple-100 dark:bg-purple-950/40",
    icon: "text-purple-600 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-800",
    hover: "hover:border-purple-300 dark:hover:border-purple-700",
  },
  amber: {
    bg: "bg-amber-100 dark:bg-amber-950/40",
    icon: "text-amber-600 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-800",
    hover: "hover:border-amber-300 dark:hover:border-amber-700",
  },
};

function ActionCard({ icon, title, description, href, color }: ActionCardProps) {
  const colors = colorClasses[color];

  return (
    <Link
      href={href}
      className={`group block rounded-xl border-2 ${colors.border} ${colors.hover} bg-[var(--card)] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
    >
      <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${colors.bg} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
        <div className={colors.icon}>{icon}</div>
      </div>
      <h3 className="mb-2 text-lg font-semibold text-slate-900 transition-colors duration-200 group-hover:text-slate-700 dark:text-slate-100 dark:group-hover:text-slate-200">
        {title}
      </h3>
      <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
    </Link>
  );
}

export function QuickActions() {
  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-slate-100">
        Quick Actions
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ActionCard
          icon={<IconUpload className="h-6 w-6" />}
          title="Upload Document"
          description="Analyze a new legal document"
          href="/dashboard"
          color="blue"
        />
        <ActionCard
          icon={<IconHistory className="h-6 w-6" />}
          title="View History"
          description="Access your previous analyses"
          href="#recent-documents"
          color="green"
        />
        <ActionCard
          icon={<IconBookOpen className="h-6 w-6" />}
          title="Help Center"
          description="Learn how to use the tool"
          href="#help"
          color="purple"
        />
        <ActionCard
          icon={<IconSparkles className="h-6 w-6" />}
          title="What's New"
          description="See the latest features"
          href="#updates"
          color="amber"
        />
      </div>
    </div>
  );
}
