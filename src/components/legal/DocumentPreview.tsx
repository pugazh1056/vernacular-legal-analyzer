"use client";

type DocumentPreviewProps = {
  preview: string;
  truncated: boolean;
  documentLength: number | null;
};

export function DocumentPreview({
  preview,
  truncated,
  documentLength,
}: DocumentPreviewProps) {
  if (!preview) return null;

  return (
    <section className="mb-6 rounded-xl border border-slate-200 bg-[var(--card)] p-4 shadow-sm dark:border-slate-600">
      <details className="group">
        <summary className="cursor-pointer list-none font-medium text-slate-900 dark:text-slate-100 [&::-webkit-details-marker]:hidden">
          <span className="inline-flex items-center gap-2">
            <span aria-hidden>▸</span>
            <span className="group-open:hidden">Show document preview</span>
            <span className="hidden group-open:inline">Hide document preview</span>
          </span>
        </summary>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          {truncated && documentLength != null
            ? `Excerpt of the uploaded file (full ${documentLength.toLocaleString()} characters are used for Q&A).`
            : "Text extracted from your upload. Q&A uses the full document stored for this session."}
        </p>
        <pre className="mt-3 max-h-48 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-slate-50 p-3 text-xs text-slate-800 dark:bg-slate-900 dark:text-slate-200">
          {preview}
        </pre>
      </details>
    </section>
  );
}
