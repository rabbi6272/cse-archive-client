import { NextResponse, type NextRequest } from "next/server";
import { callbackUri, OAUTH_COOKIE } from "@/features/auth/google";
import { authApi, safeNext } from "@/features/auth/server";

// The auth service (cse-archive-server) builds the Google URL with state + PKCE; this route keeps
// state and verifier in a short-lived HttpOnly cookie on this site's domain for the callback.
export async function GET(request: NextRequest) {
  try {
    const start = await authApi<{ ok: boolean; url?: string; state?: string; verifier?: string }>("/google/start", {
      redirectUri: callbackUri(request.url),
    });
    if (!start.ok || !start.url) throw new Error("google not configured");

    const res = NextResponse.redirect(start.url);
    res.cookies.set(
      OAUTH_COOKIE,
      JSON.stringify({ state: start.state, verifier: start.verifier, next: safeNext(request.nextUrl.searchParams.get("next")) }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/api/auth/google",
        maxAge: 600,
      },
    );
    return res;
  } catch (err) {
    console.error("[auth] google start failed", err);
    return NextResponse.redirect(new URL("/user/login?authError=google", request.url));
  }
}
