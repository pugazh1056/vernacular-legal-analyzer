"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getDocumentHistory,
  removeDocumentFromHistory,
  type DocumentHistoryItem,
} from "@/lib/document-history";
import { SkeletonDocumentCard } from "./Skeleton";

function IconDocument({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}

function IconTrash({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  );
}

function IconArrowRight({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  );
}

function formatTimeAgo(isoDate: string): string {
  const now = Date.now();
  const past = new Date(isoDate).getTime();
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(isoDate).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

type DocumentCardProps = {
  item: DocumentHistoryItem;
  onRemove: (id: string) => void;
  onOpen: (sessionId: string) => void;
};

function DocumentCard({ item, onRemove, onOpen }: DocumentCardProps) {
  const [removing, setRemoving] = useState(false);

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRemoving(true);
    setTimeout(() => onRemove(item.id), 150);
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border border-slate-200 bg-[var(--card)] p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-600 ${
        removing ? "scale-95 opacity-0" : ""
      }`}
      style={{ transition: "all 0.15s ease-in-out" }}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-slate-900 dark:text-slate-100">
            {item.fileName}
          </h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {formatTimeAgo(item.analyzedAt)}
          </p>
        </div>
        <button
          type="button"
          onClick={handleRemove}
          className="rounded-lg p-1.5 text-slate-400 opacity-0 transition-all duration-200 hover:bg-red-50 hover:text-red-600 hover:scale-110 group-hover:opacity-100 dark:hover:bg-red-950/30 dark:hover:text-red-400"
          aria-label="Remove from history"
        >
          <IconTrash className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2.5 py-1 text-xs font-medium text-sky-700 dark:bg-sky-950/50 dark:text-sky-300">
          <IconDocument className="h-3.5 w-3.5" />
          {item.role}
        </span>
      </div>

      <button
        type="button"
        onClick={() => onOpen(item.sessionId)}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--accent)] px-3 py-2 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:gap-3"
      >
        Open Analysis
        <IconArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
      </button>
    </div>
  );
}

export function RecentDocuments() {
  const router = useRouter();
  const [history, setHistory] = useState<DocumentHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setHistory(getDocumentHistory());
    setLoading(false);

    const onChange = (e: Event) => {
      const customEvent = e as CustomEvent<DocumentHistoryItem[]>;
      setHistory(customEvent.detail || getDocumentHistory());
    };

    window.addEventListener("legal-analyser-history-changed", onChange);
    return () => window.removeEventListener("legal-analyser-history-changed", onChange);
  }, []);

  const handleRemove = (id: string) => {
    removeDocumentFromHistory(id);
  };

  const handleOpen = (sessionId: string) => {
    router.push("/results");
  };

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SkeletonDocumentCard />
        <SkeletonDocumentCard />
        <SkeletonDocumentCard />
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-12 text-center dark:border-slate-600 dark:bg-slate-800/30">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700">
          <IconDocument className="h-8 w-8 text-slate-400 dark:text-slate-500" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
          No recent documents
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Your analyzed documents will appear here for quick access
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Recent Documents
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {history.length} {history.length === 1 ? "document" : "documents"}
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {history.map((item) => (
          <DocumentCard
            key={item.id}
            item={item}
            onRemove={handleRemove}
            onOpen={handleOpen}
          />
        ))}
      </div>
    </div>
  );
}
