"use client";

import type { RefObject } from "react";
import { FIXED_DISCLAIMER } from "@/lib/constants";
import type { ChatMessage } from "./types";

type ChatPanelProps = {
  messages: ChatMessage[];
  chatInput: string;
  onChatInputChange: (value: string) => void;
  onSend: () => void;
  chatLoading: boolean;
  chatError: string | null;
  disabled: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  /** Shown under the intro when set (e.g. answer language for this session). */
  outputLanguageLabel?: string | null;
};

export function ChatPanel({
  messages,
  chatInput,
  onChatInputChange,
  onSend,
  chatLoading,
  chatError,
  disabled,
  inputRef,
  outputLanguageLabel,
}: ChatPanelProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-[var(--card)] p-6 shadow-sm dark:border-slate-600">
      <h2 className="mb-1 text-lg font-medium text-slate-900 dark:text-slate-100">
        Ask about this document
      </h2>
      {outputLanguageLabel ? (
        <p className="mb-2 text-xs font-medium text-[var(--accent)] dark:text-sky-400">
          Replies will be written in {outputLanguageLabel}.
        </p>
      ) : null}
      <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
        Answers use only the uploaded file. {FIXED_DISCLAIMER}
      </p>
      <div className="mb-4 max-h-72 min-h-[4.5rem] space-y-3 overflow-y-auto rounded-lg bg-slate-50 p-3 dark:bg-slate-900/50">
        {messages.length === 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-400">No messages yet.</p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`rounded-lg px-3 py-2 text-sm ${
              m.role === "user"
                ? "ml-4 sm:ml-8 bg-[var(--accent)] text-white"
                : "mr-4 sm:mr-8 bg-white text-slate-800 shadow-sm dark:bg-slate-800 dark:text-slate-100"
            }`}
          >
            <span className="block text-[10px] font-semibold uppercase opacity-80">
              {m.role === "user" ? "You" : "Assistant"}
            </span>
            <span className="whitespace-pre-wrap">{m.text}</span>
          </div>
        ))}
      </div>
      {chatError && (
        <p className="mb-2 text-sm text-red-700 dark:text-red-400" role="alert">
          {chatError}
        </p>
      )}
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          ref={inputRef}
          type="text"
          value={chatInput}
          onChange={(e) => onChatInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void onSend();
            }
          }}
          placeholder="e.g. What is the notice period for termination?"
          className="min-h-11 min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-[var(--accent)] focus:border-transparent focus:ring-2 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          disabled={chatLoading || disabled}
        />
        <button
          type="button"
          onClick={() => void onSend()}
          disabled={chatLoading || disabled || !chatInput.trim()}
          className="min-h-11 shrink-0 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {chatLoading ? "…" : "Send"}
        </button>
      </div>
    </section>
  );
}
