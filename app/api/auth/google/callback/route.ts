import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { authApi, safeNext, sessionCookie, type AuthResult } from "@/features/auth/server";
import { callbackUri, OAUTH_COOKIE } from "@/features/auth/google";

const hash = (s: string) => createHash("sha256").update(s).digest();

// Checks the OAuth state here, then lets the auth service (cse-archive-server) exchange the code and
// sign the existing account in. The session cookie it returns is set on this site's domain.
export async function GET(request: NextRequest) {
  const done = (url: string, session?: { value: string; maxAge: number }) => {
    const res = NextResponse.redirect(new URL(url, request.url));
    if (session) res.cookies.set(sessionCookie(session));
    res.cookies.delete({ name: OAUTH_COOKIE, path: "/api/auth/google" });
    return res;
  };

  let saved: { state?: string; verifier?: string; next?: string } = {};
  try {
    saved = JSON.parse(request.cookies.get(OAUTH_COOKIE)?.value ?? "{}");
  } catch {}
  const state = request.nextUrl.searchParams.get("state") ?? "";
  const code = request.nextUrl.searchParams.get("code");
  if (!code || !saved.state || !saved.verifier || !timingSafeEqual(hash(state), hash(saved.state))) {
    console.error("[auth] google -> state-mismatch");
    return done("/user/login?authError=google");
  }

  try {
    const result = await authApi<AuthResult>("/google/exchange", {
      code,
      verifier: saved.verifier,
      redirectUri: callbackUri(request.url),
    });
    if (!result.ok) {
      const known = ["claim", "no-profile", "no-account", "unavailable"];
      return done(`/user/login?authError=${known.includes(result.code) ? result.code : "google"}`);
    }
    return done(`/user/login?google=1&next=${encodeURIComponent(safeNext(saved.next))}`, result.session);
  } catch (err) {
    console.error("[auth] google exchange failed", err);
    return done("/user/login?authError=google");
  }
}
