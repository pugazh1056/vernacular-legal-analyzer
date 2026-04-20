"use client";

import { useCallback, useState } from "react";

const INPUT_ID = "legal-analyser-file-input";

type UploadZoneProps = {
  uploading: boolean;
  /** Shown below the drop zone with `role="alert"` when non-empty. */
  uploadError: string | null;
  onFileSelected: (file: File) => void;
  disabled?: boolean;
};

export function UploadSkeleton() {
  return (
    <div className="mt-4 space-y-2" aria-hidden>
      <div className="h-3 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      <div className="h-3 w-[92%] animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      <div className="h-3 w-4/5 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      <div className="h-3 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
    </div>
  );
}

export function UploadZone({
  uploading,
  uploadError,
  onFileSelected,
  disabled = false,
}: UploadZoneProps) {
  const [dragOver, setDragOver] = useState(false);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files[0];
      if (f && !disabled && !uploading) onFileSelected(f);
    },
    [disabled, uploading, onFileSelected]
  );

  const onFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f) onFileSelected(f);
      e.target.value = "";
    },
    [onFileSelected]
  );

  const busy = uploading || disabled;

  return (
    <>
      <div
        role="button"
        tabIndex={busy ? -1 : 0}
        aria-busy={uploading}
        aria-disabled={busy}
        onKeyDown={(e) => {
          if (busy) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            document.getElementById(INPUT_ID)?.click();
          }
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          if (!busy) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className={`rounded-xl border-2 border-dashed px-6 py-14 text-center transition-colors ${
          dragOver && !busy
            ? "border-[var(--accent)] bg-slate-50 dark:bg-slate-800/50"
            : "border-slate-300 bg-[var(--card)] dark:border-slate-600"
        } ${busy ? "pointer-events-none opacity-60" : ""}`}
      >
        <input
          id={INPUT_ID}
          type="file"
          accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
          className="sr-only"
          onChange={onFileInput}
          disabled={busy}
          aria-label="Choose document file"
        />
        <p className="text-slate-700 dark:text-slate-200">
          {uploading ? (
            "Analysing…"
          ) : (
            <>
              Drag and drop a file here, or{" "}
              <label
                htmlFor={INPUT_ID}
                className="cursor-pointer font-semibold text-[var(--accent)] underline-offset-2 hover:underline dark:text-sky-400"
              >
                browse
              </label>
            </>
          )}
        </p>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          PDF, DOCX, or TXT — max 15 MB
        </p>
      </div>
      {uploading && <UploadSkeleton />}
      {uploadError ? (
        <p className="mt-3 text-sm text-red-700 dark:text-red-400" role="alert">
          {uploadError}
        </p>
      ) : null}
    </>
  );
}
