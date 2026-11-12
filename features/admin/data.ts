import "server-only";
import { SERVER_URL } from "@/lib/server-url";

// Server-side access for the admin page. Nothing here runs in the browser, so ADMIN_SECRET and any
// database credential stay on the server.

// ─── Drive server admin API (cse-archive-server) ─────────────────────────────

export type DriveAction = "setup" | "revalidate" | "delete" | "renew" | "status";

export type DriveStatus = {
  cache?: { tag?: string; revalidateFallbackSeconds?: number; invalidation?: string } | null;
  watch?: { channelId?: string | null; resourceId?: string | null; expiration?: string | null; expired?: boolean } | null;
  pageToken?: "present" | "missing";
  lastNotification?: string | null;
};

type DriveResponse = { ok?: boolean; action?: DriveAction; details?: Record<string, unknown>; status?: DriveStatus; error?: string };

async function driveAdmin<T>(method: "GET" | "POST", body?: Record<string, unknown>): Promise<T> {
  const base = SERVER_URL;
  let res = await fetch(`${base}/api/v1/drive/admin`, {
    method,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.ADMIN_SECRET}` },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  if (res.status === 404) {
    res = await fetch(`${base}/api/drive/admin`, {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.ADMIN_SECRET}` },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
  }

  const data = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) throw new Error(data.error || `Drive server: HTTP ${res.status}`);
  return data;
}

export const getDriveStatus = () => driveAdmin<DriveStatus>("GET");

export async function runDriveAction(action: DriveAction, opts: { warm?: boolean; clearMeta?: boolean }) {
  const body: Record<string, unknown> = { action };
  if (action === "revalidate") body.warm = opts.warm;
  if (action === "delete") body.clearMeta = opts.clearMeta;
  const data = await driveAdmin<DriveResponse>("POST", body);
  return summarize(data);
}

function summarize(data: DriveResponse): string {
  const d = data.details ?? {};
  const bits: string[] = [];
  if (d.pageToken) bits.push(`pageToken: ${d.pageToken}`);
  if (d.watch) {
    const w = d.watch as { created?: boolean; renewed?: boolean };
    bits.push(w.created !== undefined ? `watch ${w.created ? "created" : "exists"}` : "watch ok");
    if (w.renewed !== undefined) bits.push(w.renewed ? "renewed" : "watch unchanged");
  }
  if (d.warmedFolder) bits.push("root re-warmed");
  if (d.invalidated) bits.push("invalidated");
  if (d.metaCleared) bits.push("metadata cleared");
  return `${data.action ?? "done"}: ${bits.join(", ") || "ok"}`;
}

// ─── Main Realtime DB (cse-archive-codes) over REST ──────────────────────────

const DB_URL = "https://cse-archive-codes-default-rtdb.firebaseio.com";

// shortcut: today the database rules allow unauthenticated access, so no credential is needed.
// Once the repo's rules (auth != null) are deployed, set CODES_DATABASE_AUTH to an ID token or
// legacy database secret with admin rights, or these calls will get 401.
function dbUrl(path: string) {
  const auth = process.env.CODES_DATABASE_AUTH;
  return `${DB_URL}/${path}.json${auth ? `?auth=${encodeURIComponent(auth)}` : ""}`;
}

async function dbGet<T>(path: string): Promise<T | null> {
  const res = await fetch(dbUrl(path), { cache: "no-store" });
  if (!res.ok) throw new Error(`Realtime DB read ${path}: HTTP ${res.status}`);
  return (await res.json()) as T | null;
}

export type DbAlumnus = {
  id: string;
  name?: string;
  series?: string;
  country?: string;
  addedByName?: string;
  dateAdded?: string;
  Id?: string;
};

export async function getDbAlumni(): Promise<DbAlumnus[]> {
  const data = (await dbGet<Record<string, Omit<DbAlumnus, "id">>>("alumni")) ?? {};
  return Object.entries(data).map(([id, a]) => ({ id, ...a }));
}

export async function pushAlumnus(record: Record<string, unknown>) {
  const res = await fetch(dbUrl("alumni"), { method: "POST", body: JSON.stringify(record), cache: "no-store" });
  if (!res.ok) throw new Error(`Realtime DB write alumni: HTTP ${res.status}`);
}

type Timestamp = number | { seconds: number } | undefined;
export type Session = {
  roll: string;
  name?: string;
  status?: string;
  sessionId?: string;
  currentPage?: string;
  startTime?: Timestamp;
  endTime?: Timestamp;
  lastActivity?: Timestamp;
};

// Sessions store either epoch ms or Firestore-style { seconds }.
export const toMs = (t: Timestamp) => (typeof t === "number" ? t : t?.seconds ? t.seconds * 1000 : 0);

export async function getSessions(): Promise<Session[]> {
  const data = (await dbGet<Record<string, Omit<Session, "roll">>>("activeSessions")) ?? {};
  return Object.entries(data)
    .map(([roll, s]) => ({ roll, ...s }))
    .sort((a, b) => toMs(b.lastActivity) - toMs(a.lastActivity));
}
