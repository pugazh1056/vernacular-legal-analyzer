/** Max upload size (bytes). */
export const MAX_FILE_BYTES = 15 * 1024 * 1024;

export const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
]);

/** Truncated preview length returned to the client (not full text). */
export const TEXT_PREVIEW_MAX_CHARS = 2000;

export const FIXED_DISCLAIMER =
  "This output is for informational purposes only and does not constitute legal advice. Consult a qualified attorney for legal matters.";
