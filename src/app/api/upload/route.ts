import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { analyzeDocument } from "@/lib/openai-analyze";
import { extractTextFromBuffer, ExtractError } from "@/lib/extract-text";
import { saveDocumentSession } from "@/lib/session-store";
import { ALLOWED_MIME_TYPES, MAX_FILE_BYTES, TEXT_PREVIEW_MAX_CHARS } from "@/lib/constants";
import { parseOutputLanguageCode } from "@/lib/profile-preferences";

export const runtime = "nodejs";

function resolveMimeType(file: File): string {
  const type = file.type?.trim();
  if (type && type !== "application/octet-stream") return type;
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf")) return "application/pdf";
  if (name.endsWith(".docx")) {
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  }
  if (name.endsWith(".txt")) return "text/plain";
  return type || "application/octet-stream";
}

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Missing file field." }, { status: 400 });
  }

  const preferredLanguage = parseOutputLanguageCode(formData.get("preferredLanguage"));

  if (file.size > MAX_FILE_BYTES) {
    return NextResponse.json(
      {
        error: `File exceeds maximum size of ${Math.floor(MAX_FILE_BYTES / (1024 * 1024))} MB.`,
        code: "FILE_TOO_LARGE",
      },
      { status: 413 }
    );
  }

  const mimeType = resolveMimeType(file);
  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    return NextResponse.json(
      {
        error: "Unsupported file type. Use PDF, DOCX, or TXT.",
        code: "UNSUPPORTED_TYPE",
      },
      { status: 415 }
    );
  }
  const buffer = Buffer.from(await file.arrayBuffer());

  let text: string;
  try {
    text = await extractTextFromBuffer(buffer, mimeType, file.size);
  } catch (e) {
    if (e instanceof ExtractError) {
      const status =
        e.code === "FILE_TOO_LARGE"
          ? 413
          : e.code === "UNSUPPORTED_TYPE"
            ? 415
            : e.code === "EMPTY_TEXT"
              ? 422
              : 400;
      return NextResponse.json({ error: e.message, code: e.code }, { status });
    }
    throw e;
  }

  let analysis;
  try {
    analysis = await analyzeDocument(text, preferredLanguage);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Analysis failed.";
    return NextResponse.json({ error: message, code: "ANALYSIS_FAILED" }, { status: 502 });
  }

  const sessionId = randomUUID();
  saveDocumentSession(sessionId, text, preferredLanguage);

  const preview =
    text.length > TEXT_PREVIEW_MAX_CHARS
      ? `${text.slice(0, TEXT_PREVIEW_MAX_CHARS)}…`
      : text;

  return NextResponse.json({
    sessionId,
    analysis,
    preview,
    previewLength: preview.length,
    documentLength: text.length,
    preferredLanguage,
  });
}
