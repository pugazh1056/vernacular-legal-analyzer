"use client";

import { useEffect, useState } from "react";
import { getDocumentHistory, type DocumentHistoryItem } from "@/lib/document-history";

function IconCheckCircle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  );
}

type TimelineEvent = {
  id: string;
  type: "analysis" | "milestone";
  title: string;
  description: string;
  timestamp: string;
  color: "green" | "blue" | "purple";
};

function formatTimelineDate(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  
  if (isToday) {
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  }
  
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();
  
  if (isYesterday) {
    return "Yesterday, " + date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  }
  
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

const colorClasses = {
  green: "bg-emerald-500 dark:bg-emerald-400",
  blue: "bg-sky-500 dark:bg-sky-400",
  purple: "bg-purple-500 dark:bg-purple-400",
};

function convertHistoryToEvents(history: DocumentHistoryItem[]): TimelineEvent[] {
  const events: TimelineEvent[] = history.map((item) => ({
    id: item.id,
    type: "analysis" as const,
    title: "Document analyzed",
    description: `${item.fileName} (${item.role})`,
    timestamp: item.analyzedAt,
    color: "green" as const,
  }));

  // Add milestone events
  if (history.length >= 5) {
    const fifthDoc = history[history.length - 5];
    events.push({
      id: `milestone-5`,
      type: "milestone",
      title: "🎉 5 documents analyzed!",
      description: "You're getting the hang of it",
      timestamp: fifthDoc.analyzedAt,
      color: "blue",
    });
  }

  if (history.length >= 10) {
    const tenthDoc = history[history.length - 10];
    events.push({
      id: `milestone-10`,
      type: "milestone",
      title: "🚀 10 documents milestone!",
      description: "You're a power user now",
      timestamp: tenthDoc.analyzedAt,
      color: "purple",
    });
  }

  // Sort by timestamp descending
  return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function ActivityTimeline() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);

  useEffect(() => {
    const history = getDocumentHistory();
    setEvents(convertHistoryToEvents(history));

    const onChange = () => {
      const updated = getDocumentHistory();
      setEvents(convertHistoryToEvents(updated));
    };

    window.addEventListener("legal-analyser-history-changed", onChange);
    return () => window.removeEventListener("legal-analyser-history-changed", onChange);
  }, []);

  if (events.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-slate-100">
        Activity Timeline
      </h2>
      <div className="relative rounded-xl border border-slate-200 bg-[var(--card)] p-6 shadow-sm dark:border-slate-600">
        <div className="space-y-4">
          {events.slice(0, 8).map((event, index) => (
            <div key={event.id} className="relative flex gap-4">
              {/* Timeline line */}
              {index < events.slice(0, 8).length - 1 && (
                <div className="absolute left-[11px] top-6 h-full w-0.5 bg-slate-200 dark:bg-slate-700" />
              )}

              {/* Icon */}
              <div className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${colorClasses[event.color]}`}>
                <IconCheckCircle className="h-4 w-4 text-white" />
              </div>

              {/* Content */}
              <div className="flex-1 pb-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {event.title}
                    </p>
                    <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
                      {event.description}
                    </p>
                  </div>
                  <time className="shrink-0 text-xs text-slate-500 dark:text-slate-500">
                    {formatTimelineDate(event.timestamp)}
                  </time>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {events.length > 8 && (
          <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-500">
            +{events.length - 8} more activities
          </p>
        )}
      </div>
    </div>
  );
}
