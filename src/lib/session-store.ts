const TTL_MS = 2 * 60 * 60 * 1000;

type Entry = {
  text: string;
  preferredLanguage: string;
  expiresAt: number;
};

const sessions = new Map<string, Entry>();

function pruneExpired(): void {
  const now = Date.now();
  for (const [id, entry] of sessions) {
    if (entry.expiresAt <= now) sessions.delete(id);
  }
}

export function saveDocumentSession(
  sessionId: string,
  text: string,
  preferredLanguage: string
): void {
  pruneExpired();
  sessions.set(sessionId, {
    text,
    preferredLanguage,
    expiresAt: Date.now() + TTL_MS,
  });
}

export function getDocumentSession(
  sessionId: string
): { text: string; preferredLanguage: string } | null {
  pruneExpired();
  const entry = sessions.get(sessionId);
  if (!entry || entry.expiresAt <= Date.now()) {
    if (entry) sessions.delete(sessionId);
    return null;
  }
  return {
    text: entry.text,
    preferredLanguage: entry.preferredLanguage || "en-US",
  };
}
