import "server-only";
import { cache } from "react";
import { cookies, headers } from "next/headers";
import { SERVER_URL } from "@/lib/server-url";
import type { Role } from "./roles";

// Thin client for the auth module in cse-archive-server (/api/v1/auth/*). That server checks
// passwords, does the Google exchange and mints Firebase session cookies for the shared accounts.
// This site only stores the session as an HttpOnly cookie on its own domain: a cookie set by the
// Render domain would be a blocked third-party cookie. No Firebase Auth runs in the browser.

const AUTH_API = SERVER_URL;
const COOKIE = "__session";

export type { Role } from "./roles";
export { hasRole, isAdmin, isSuperAdmin } from "./roles";

export type Viewer = {
  uid: string;
  email: string;
  emailVerified: boolean;
  role: Role;
  roll: string;
  series: string;
  name: string;
  profilePictureUrl: string;
  hasProfile: boolean;
};

export type SessionPayload = { value: string; maxAge: number };

export type AuthFailureCode =
  | "invalid"
  | "claim"
  | "no-profile"
  | "no-account"
  | "rate_limited"
  | "throttled"
  | "exists"
  | "series-closed"
  | "bad-series"
  | "roll-held"
  | "unavailable"
  | "not-configured"
  | "error";

export type AuthResult =
  | { ok: true; viewer: Viewer; session: SessionPayload; email: string; emailVerified: boolean }
  | { ok: false; code: AuthFailureCode; message?: string };

/** End-user IP so the auth server's brute-force limits apply per visitor, not per Vercel egress IP. */
async function forwardedFor(): Promise<string | undefined> {
  try {
    const h = await headers();
    return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || undefined;
  } catch {
    return undefined; // outside a request scope
  }
}

/**
 * Server-to-server call to /api/v1/auth. AUTH_SERVICE_SECRET must match the server's.
 * Returns the parsed JSON body for any HTTP status so error codes (invalid, claim,
 * rate_limited, …) reach the UI. Throws only on network failure / non-JSON responses.
 */
export async function authApi<T>(path: string, body?: Record<string, unknown>): Promise<T> {
  const ip = await forwardedFor();
  const res = await fetch(`${AUTH_API}/api/v1/auth${path}`, {
    method: body ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${process.env.AUTH_SERVICE_SECRET}`,
      "Content-Type": "application/json",
      ...(ip ? { "X-Forwarded-For": ip } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const data = (await res.json().catch(() => null)) as T | null;
  if (data === null) throw new Error(`auth service ${path}: HTTP ${res.status} (non-JSON)`);
  return data;
}

export function sessionCookie(session: SessionPayload) {
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

export async function setSession(session: SessionPayload) {
  (await cookies()).set(sessionCookie(session));
}

export async function readSessionCookie(): Promise<string | undefined> {
  return (await cookies()).get(COOKIE)?.value;
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

// Verified on the auth service (revocation-checked), once per request.
export const getSession = cache(async (): Promise<Viewer | null> => {
  const value = await readSessionCookie();
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
    const res = await fetch(`${AUTH_API}/api/v1/auth/config`, {
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
