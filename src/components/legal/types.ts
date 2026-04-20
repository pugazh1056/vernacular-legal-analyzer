import type { AnalysisResult } from "@/lib/analysis-schema";

export type TabId = "summary" | "clauses" | "risks";

export type ChatMessage = { role: "user" | "assistant"; text: string };

export type UploadAnalyzeResponse = {
  error?: string;
  sessionId?: string;
  analysis?: AnalysisResult;
  preview?: string;
  previewLength?: number;
  documentLength?: number;
  /** BCP-47 style code used for analysis and chat output. */
  preferredLanguage?: string;
};
