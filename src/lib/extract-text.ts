import mammoth from "mammoth";
import { ALLOWED_MIME_TYPES, MAX_FILE_BYTES } from "./constants";

export class ExtractError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "UNSUPPORTED_TYPE"
      | "FILE_TOO_LARGE"
      | "EMPTY_TEXT"
      | "PARSE_FAILED"
  ) {
    super(message);
    this.name = "ExtractError";
  }
}

function assertAllowedType(mime: string): void {
  if (!ALLOWED_MIME_TYPES.has(mime)) {
    throw new ExtractError(
      "Unsupported file type. Use PDF, DOCX, or TXT.",
      "UNSUPPORTED_TYPE"
    );
  }
}

function assertSize(size: number): void {
  if (size > MAX_FILE_BYTES) {
    throw new ExtractError(
      `File exceeds maximum size of ${Math.floor(MAX_FILE_BYTES / (1024 * 1024))} MB.`,
      "FILE_TOO_LARGE"
    );
  }
}

function normalizeText(text: string): string {
  return text.replace(/\u0000/g, "").trim();
}

export async function extractTextFromBuffer(
  buffer: Buffer,
  mimeType: string,
  byteLength: number
): Promise<string> {
  assertSize(byteLength);
  assertAllowedType(mimeType);

  let raw: string;

  try {
    if (mimeType === "text/plain") {
      raw = buffer.toString("utf8");
    } else if (
      mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({ buffer });
      raw = result.value;
    } else if (mimeType === "application/pdf") {
      const pdfParse = (await import("pdf-parse")).default;
      const data = await pdfParse(buffer);
      raw = data.text ?? "";
    } else {
      throw new ExtractError("Unsupported file type.", "UNSUPPORTED_TYPE");
    }
  } catch (e) {
    if (e instanceof ExtractError) throw e;
    throw new ExtractError(
      e instanceof Error ? e.message : "Failed to read document.",
      "PARSE_FAILED"
    );
  }

  const text = normalizeText(raw);
  if (!text) {
    throw new ExtractError(
      "No readable text was found in this file.",
      "EMPTY_TEXT"
    );
  }

  return text;
}
