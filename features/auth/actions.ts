"use server";

import {
  authApi,
  endSession,
  getSession,
  readSessionCookie,
  safeNext,
  setSession,
  type AuthResult,
  type Viewer,
} from "./server";

// All auth runs on cse-archive-server via these Server Actions. Credentials go
// browser -> this Next.js server -> auth server; no Firebase SDK in the browser.

export type LoginState =
  | { ok: true; viewer: Viewer; next: string }
  | { ok: false; code: string; message: string }
  | null;

export type ForgotState = { ok: true; message: string } | { ok: false; code: string; message: string } | null;

const MESSAGES: Record<string, string> = {
  invalid: "Incorrect email or password.",
  claim: "Your account needs to be reclaimed with an email link first.",
  "no-profile": "Your account has no profile yet. Create it first.",
  rate_limited: "Too many failed attempts. Wait 15 minutes, or reset your password.",
  throttled: "Too many attempts. Wait a few minutes, or reset your password.",
  exists: "An account already exists with this email. Log in instead.",
  "series-closed": "Sign-up is closed for this series.",
  "bad-series": "That roll number doesn't belong to this series.",
  "roll-held": "That roll number is already registered.",
};
const UNAVAILABLE = "Sign-in is unavailable right now. Please try again.";

function fail(result: { code: string; message?: string }): LoginState {
  return { ok: false, code: result.code, message: MESSAGES[result.code] ?? result.message ?? UNAVAILABLE };
}

function validCredentials(email: string, password: string) {
  return email.includes("@") && email.length <= 254 && password.length > 0 && password.length <= 1024;
}

export async function signInAction(email: string, password: string, next?: string): Promise<LoginState> {
  email = email.trim().toLowerCase();
  if (!validCredentials(email, password)) return { ok: false, code: "invalid", message: "Enter your email and password." };

  try {
    const result = await authApi<AuthResult>("/signin", { email, password });
    if (!result.ok) return fail(result);
    await setSession(result.session);
    return { ok: true, viewer: result.viewer, next: safeNext(next) };
  } catch (err) {
    console.error("[auth] signin -> auth service failed", err);
    return { ok: false, code: "error", message: UNAVAILABLE };
  }
}

/** `useActionState`-compatible form of signInAction. */
export async function loginAction(_: LoginState, form: FormData): Promise<LoginState> {
  return signInAction(String(form.get("email") ?? ""), String(form.get("password") ?? ""), String(form.get("next") ?? ""));
}

export async function signUpAction(
  email: string,
  password: string,
  next?: string,
  series = process.env.SIGNUP_SERIES ?? "24",
): Promise<LoginState> {
  email = email.trim().toLowerCase();
  if (!validCredentials(email, password)) return { ok: false, code: "invalid", message: "Enter your email and password." };
  if (password.length < 8) return { ok: false, code: "invalid", message: "Use at least 8 characters for your password." };

  try {
    const result = await authApi<AuthResult>("/signup", { series, email, password });
    if (!result.ok) return fail(result);
    await setSession(result.session);
    return { ok: true, viewer: result.viewer, next: safeNext(next) };
  } catch (err) {
    console.error("[auth] signup -> auth service failed", err);
    return { ok: false, code: "error", message: "Sign-up is unavailable right now. Please try again." };
  }
}

export async function forgotPasswordAction(email: string): Promise<ForgotState> {
  email = email.trim().toLowerCase();
  if (!email.includes("@")) return { ok: false, code: "invalid", message: "Enter a valid email address." };
  try {
    await authApi<{ ok: boolean }>("/forgot", { email });
  } catch (err) {
    console.error("[auth] forgot -> auth service failed", err);
    return { ok: false, code: "error", message: "Couldn't send the reset email right now. Please try again." };
  }
  // Uniform response whether or not the account exists (anti-enumeration).
  return { ok: true, message: "If an account exists for that email, a reset link is on its way." };
}

export async function logoutAction() {
  const value = await readSessionCookie();
  if (value) {
    await authApi("/signout", { session: value }).catch((err) => console.error("[auth] signout failed", err));
  }
  await endSession();
}

// After the Google redirect (or for a returning visitor): the browser still needs the display copy.
export async function getViewerAction(): Promise<Viewer | null> {
  return getSession();
}
