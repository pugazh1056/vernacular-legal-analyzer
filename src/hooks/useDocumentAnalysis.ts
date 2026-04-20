"use client";

import { useCallback, useState } from "react";
import type { AnalysisResult } from "@/lib/analysis-schema";
import type { UploadAnalyzeResponse } from "@/components/legal/types";
import { incrementDocsAnalyzed } from "@/lib/dashboard-stats";
import { addDocumentToHistory } from "@/lib/document-history";

export function useDocumentAnalysis() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [documentLength, setDocumentLength] = useState<number | null>(null);
  const [previewTruncated, setPreviewTruncated] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [preferredOutputLanguage, setPreferredOutputLanguage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const reset = useCallback(() => {
    setSessionId(null);
    setAnalysis(null);
    setPreview(null);
    setDocumentLength(null);
    setPreviewTruncated(false);
    setUploadError(null);
    setPreferredOutputLanguage(null);
    setFileName(null);
  }, []);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  const uploadFile = useCallback(async (file: File, preferredLanguage: string, role?: string) => {
    setUploadError(null);
    setUploading(true);
    try {
      // 1. Upload and Parse document (FastAPI)
      const formData = new FormData();
      formData.set("file", file);
      
      const uploadRes = await fetch(`${API_BASE}/api/upload`, {
        method: "POST",
        body: formData,
      });
      
      if (!uploadRes.ok) {
        throw new Error("Failed to upload document.");
      }
      const uploadData = await uploadRes.json();
      
      // 2. Transmit to LLM Analysis (FastAPI)
      const analyzeRes = await fetch(`${API_BASE}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
           session_id: uploadData.sessionId,
           language: preferredLanguage,
           role: role || "business"
        }),
      });
      
      if (!analyzeRes.ok) {
         throw new Error("Analysis failed to complete.");
      }
      const analysisData = await analyzeRes.json();

      setSessionId(uploadData.sessionId);
      setAnalysis(analysisData);
      setFileName(file.name);
      setPreferredOutputLanguage(preferredLanguage);
      setPreview(uploadData.preview || null);
      setDocumentLength(uploadData.documentLength || null);
      const truncated = uploadData.previewLength < uploadData.documentLength;
      setPreviewTruncated(truncated);
      incrementDocsAnalyzed();
      
      // Add to document history
      addDocumentToHistory(file.name, role || "Unknown", uploadData.sessionId);
    } catch (e: any) {
      setUploadError(e.message || "Network error. Try again.");
    } finally {
      setUploading(false);
    }
  }, [API_BASE]);

  return {
    sessionId,
    analysis,
    preview,
    documentLength,
    previewTruncated,
    uploadError,
    uploading,
    uploadFile,
    reset,
    preferredOutputLanguage,
    fileName,
  };
}
