const STATS_KEY = "legal-analyser-dashboard-stats";

export type DashboardStats = {
  docsAnalyzed: number;
  questionsAsked: number;
  lastActiveAt: number;
};

const defaultStats = (): DashboardStats => ({
  docsAnalyzed: 0,
  questionsAsked: 0,
  lastActiveAt: Date.now(),
});

function read(): DashboardStats {
  if (typeof window === "undefined") return defaultStats();
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return defaultStats();
    const p = JSON.parse(raw) as Partial<DashboardStats>;
    return {
      docsAnalyzed: typeof p.docsAnalyzed === "number" ? p.docsAnalyzed : 0,
      questionsAsked: typeof p.questionsAsked === "number" ? p.questionsAsked : 0,
      lastActiveAt: typeof p.lastActiveAt === "number" ? p.lastActiveAt : Date.now(),
    };
  } catch {
    return defaultStats();
  }
}

function notifyStatsChanged(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("legal-analyser-stats-changed"));
  }
}

function write(s: DashboardStats): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
  notifyStatsChanged();
}

export function getDashboardStats(): DashboardStats {
  return read();
}

export function touchDashboardActivity(): DashboardStats {
  const s = read();
  s.lastActiveAt = Date.now();
  write(s);
  return s;
}

export function incrementDocsAnalyzed(): DashboardStats {
  const s = read();
  s.docsAnalyzed += 1;
  s.lastActiveAt = Date.now();
  write(s);
  return s;
}

export function incrementQuestionsAsked(): DashboardStats {
  const s = read();
  s.questionsAsked += 1;
  s.lastActiveAt = Date.now();
  write(s);
  return s;
}

export function formatLastActiveLabel(ts: number): string {
  const diff = Date.now() - ts;
  const sec = Math.floor(diff / 1000);
  const min = Math.floor(diff / 60000);
  if (sec < 60) return "Last active: just now";
  if (min < 60) return `Last active: ${min} min ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `Last active: ${h} hr ago`;
  return "Last active: earlier";
}
