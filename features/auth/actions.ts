"use server";

import { authApi, endSession, getSession, safeNext, setSession, type AuthResult, type Viewer } from "./server";

export type LoginState =
  | { ok: true; viewer: Viewer; next: string }
  | { ok: false; code: string; message: string }
  | null;

const MESSAGES: Record<string, string> = {
  invalid: "Incorrect email or password.",
  claim: "Your account needs to be reclaimed with an email link first.",
  "no-profile": "Your account has no profile yet. Create it first.",
  throttled: "Too many attempts. Wait a few minutes, or reset your password.",
};

export async function establishSessionFromIdTokenAction(
  idToken: string,
  nextUrl?: string,
): Promise<LoginState> {
  try {
    const result = await authApi<{
      ok: boolean;
      viewer?: Viewer;
      session?: { value: string; maxAge: number };
      code?: string;
    }>("/session", { idToken });

    if (!result.ok || !result.session || !result.viewer) {
      return {
        ok: false,
        code: result.code ?? "error",
        message:
          result.code === "claim"
            ? "Your account needs to be reclaimed with an email link first."
            : "Failed to establish session.",
      };
    }

    await setSession(result.session);
    return { ok: true, viewer: result.viewer, next: safeNext(nextUrl) };
  } catch (err) {
    console.error("[auth] establishSessionFromIdToken failed:", err);
    return { ok: false, code: "error", message: "Failed to establish session." };
  }
}

export async function loginAction(_: LoginState, form: FormData): Promise<LoginState> {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  if (!email.includes("@") || email.length > 254 || !password || password.length > 1024)
    return { ok: false, code: "invalid", message: "Enter your email and password." };

  try {
    const result = await authApi<AuthResult>("/login", { email, password });
    if (!result.ok)
      return { ok: false, code: result.code, message: MESSAGES[result.code] ?? "Sign-in is unavailable right now. Please try again." };
    await setSession(result.session);
    return { ok: true, viewer: result.viewer, next: safeNext(form.get("next")) };
  } catch (err) {
    console.error("[auth] login -> auth service failed", err);
    return { ok: false, code: "error", message: "Sign-in is unavailable right now. Please try again." };
  }
}

export async function logoutAction() {
  await endSession();
}

// After the Google redirect (or for a returning visitor): the browser still needs the display copy.
export async function getViewerAction(): Promise<Viewer | null> {
  return getSession();
}
