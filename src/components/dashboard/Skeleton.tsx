/**
 * Skeleton loading components for better UX with shimmer effects
 */

type SkeletonProps = {
  className?: string;
};

export function SkeletonBox({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-700 ${className}`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent dark:via-slate-500/20" />
    </div>
  );
}

export function SkeletonText({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`relative overflow-hidden rounded bg-slate-200 dark:bg-slate-700 ${className}`}
      style={{ height: "1em" }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent dark:via-slate-500/20" />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-amber-100/80 bg-white p-6 shadow-sm dark:border-slate-600 dark:bg-slate-800/80">
      <div className="relative mx-auto mb-3 h-12 w-12 overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-700">
        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent dark:via-slate-500/20" />
      </div>
      <SkeletonText className="mx-auto mb-2 h-8 w-16" />
      <SkeletonText className="mx-auto h-4 w-32" />
    </div>
  );
}

export function SkeletonDocumentCard() {
  return (
    <div className="rounded-xl border border-slate-200 bg-[var(--card)] p-4 shadow-sm dark:border-slate-600">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex-1">
          <SkeletonText className="mb-2 h-5 w-3/4" />
          <SkeletonText className="h-4 w-1/2" />
        </div>
        <SkeletonBox className="h-8 w-8 rounded-lg" />
      </div>
      <div className="flex gap-2">
        <SkeletonBox className="h-6 w-20 rounded-full" />
        <SkeletonBox className="h-6 w-24 rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonStats() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}
