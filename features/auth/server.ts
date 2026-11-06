import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";

// Thin client for the auth service in cse-archive-server (src/auth/). That server checks passwords,
// does the Google exchange and mints Firebase session cookies for the ruet-cse-24 accounts (the same
// ones the profile site uses). This site only stores the session as an HttpOnly cookie on its own
// domain: a cookie set by the Render domain would be a blocked third-party cookie.

const AUTH_API = `${process.env.AUTH_API_URL ?? process.env.NEXT_PUBLIC_DRIVE_API_URL}/api/auth`;
const COOKIE = "__session";

export type Viewer = { uid: string; email: string; roll: string; name: string; profilePictureUrl: string };
export type AuthResult =
  | { ok: true; viewer: Viewer; session: { value: string; maxAge: number } }
  | { ok: false; code: "invalid" | "claim" | "no-profile" | "no-account" | "throttled" | "error" | "not-configured" };

// Server-to-server call; AUTH_SERVICE_SECRET must match the one set on Render.
export async function authApi<T>(path: string, body?: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${AUTH_API}${path}`, {
    method: body ? "POST" : "GET",
    headers: { Authorization: `Bearer ${process.env.AUTH_SERVICE_SECRET}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`auth service ${path}: HTTP ${res.status}`);
  return (await res.json()) as T;
}

export function sessionCookie(session: { value: string; maxAge: number }) {
  return {
    name: COOKIE,
    value: session.value,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const, // lax, not strict: the Google callback arrives as a cross-site redirect
    path: "/",
    maxAge: session.maxAge,
  };
}

export async function setSession(session: { value: string; maxAge: number }) {
  (await cookies()).set(sessionCookie(session));
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

// Verified on the auth service (revocation-checked), once per request.
export const getSession = cache(async (): Promise<Viewer | null> => {
  const value = (await cookies()).get(COOKIE)?.value;
  if (!value) return null;
  try {
    const res = await authApi<{ ok: boolean; viewer?: Viewer }>("/session", { session: value });
    return res.ok ? (res.viewer ?? null) : null;
  } catch (err) {
    console.error("[auth] session check failed", err);
    return null;
  }
});

// Whether to show "Continue with Google". Cached and time-boxed so a sleeping auth server can't
// stall the login page; on any failure the button is just hidden.
export async function googleEnabled(): Promise<boolean> {
  try {
    const res = await fetch(`${AUTH_API}/config`, {
      headers: { Authorization: `Bearer ${process.env.AUTH_SERVICE_SECRET}` },
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(2000),
    });
    return res.ok && ((await res.json()) as { google?: boolean }).google === true;
  } catch {
    return false;
  }
}

// Only same-site paths, so ?next= can't send someone to another site after login.
export function safeNext(next: unknown): string {
  const s = typeof next === "string" ? next : "";
  return s.startsWith("/") && !s.startsWith("//") && !s.startsWith("/\\") ? s : "/user/dashboard";
}
