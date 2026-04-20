/**
 * Document History Storage
 * Tracks recently analyzed documents for quick access
 */

const STORAGE_KEY = "legal-analyser-document-history";
const MAX_HISTORY_ITEMS = 10;

export type DocumentHistoryItem = {
  id: string;
  fileName: string;
  role: string;
  analyzedAt: string; // ISO timestamp
  sessionId: string;
};

function getHistoryStorage(): DocumentHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function setHistoryStorage(items: DocumentHistoryItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(
      new CustomEvent("legal-analyser-history-changed", { detail: items })
    );
  } catch {
    // Silently fail if storage is full or unavailable
  }
}

export function addDocumentToHistory(
  fileName: string,
  role: string,
  sessionId: string
): void {
  const item: DocumentHistoryItem = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    fileName,
    role,
    analyzedAt: new Date().toISOString(),
    sessionId,
  };

  const current = getHistoryStorage();
  const updated = [item, ...current].slice(0, MAX_HISTORY_ITEMS);
  setHistoryStorage(updated);
}

export function getDocumentHistory(): DocumentHistoryItem[] {
  return getHistoryStorage();
}

export function clearDocumentHistory(): void {
  setHistoryStorage([]);
}

export function removeDocumentFromHistory(id: string): void {
  const current = getHistoryStorage();
  const updated = current.filter((item) => item.id !== id);
  setHistoryStorage(updated);
}
