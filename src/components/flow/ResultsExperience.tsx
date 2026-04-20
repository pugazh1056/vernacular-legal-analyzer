"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLegalFlow } from "@/context/LegalFlowContext";
import { useChat } from "@/hooks/useChat";
import { AnalysisPanel } from "@/components/legal/AnalysisPanel";
import { ChatPanel } from "@/components/legal/ChatPanel";
import { DocumentPreview } from "@/components/legal/DocumentPreview";
import type { TabId } from "@/components/legal/types";
import { getLanguageOptionLabel } from "@/lib/profile-preferences";

export function ResultsExperience() {
  const router = useRouter();
  const [tab, setTab] = useState<TabId>("summary");
  const resultsRef = useRef<HTMLDivElement>(null);
  const lastScrolledSessionRef = useRef<string | null>(null);

  const {
    sessionId,
    analysis,
    preview,
    documentLength,
    previewTruncated,
    reset,
    preferredOutputLanguage,
  } = useLegalFlow();

  const outputLangLabel =
    preferredOutputLanguage != null
      ? getLanguageOptionLabel(preferredOutputLanguage)
      : null;

  const {
    messages,
    chatInput,
    setChatInput,
    chatLoading,
    chatError,
    sendChat,
    inputRef,
  } = useChat(sessionId);

  useEffect(() => {
    if (!analysis || !sessionId) return;
    if (lastScrolledSessionRef.current === sessionId) return;
    lastScrolledSessionRef.current = sessionId;
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [analysis, sessionId]);

  const onNewUpload = useCallback(() => {
    reset();
    setTab("summary");
    lastScrolledSessionRef.current = null;
    router.push("/dashboard");
  }, [reset, router]);

  if (!analysis) return null;

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Your results
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            Summary, risk highlights, and key clauses — then ask follow-up questions.
            {outputLangLabel ? (
              <span className="mt-1 block text-sm font-medium text-[var(--accent)] dark:text-sky-400">
                Analysis and chat output language: {outputLangLabel}
              </span>
            ) : null}
          </p>
        </div>
        <button
          type="button"
          onClick={onNewUpload}
          className="min-h-11 rounded-lg border border-slate-300 bg-[var(--card)] px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Upload another document
        </button>
      </div>

      <div ref={resultsRef}>
        {preview ? (
          <DocumentPreview
            preview={preview}
            truncated={previewTruncated}
            documentLength={documentLength}
          />
        ) : null}
        <AnalysisPanel analysis={analysis} tab={tab} onTabChange={setTab} />
      </div>

      <div className="mt-10">
        <ChatPanel
          messages={messages}
          chatInput={chatInput}
          onChatInputChange={setChatInput}
          onSend={() => void sendChat()}
          chatLoading={chatLoading}
          chatError={chatError}
          disabled={!sessionId}
          inputRef={inputRef}
          outputLanguageLabel={outputLangLabel}
        />
      </div>
    </>
  );
}
