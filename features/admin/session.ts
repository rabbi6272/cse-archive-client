import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// Admin auth: one shared password (the ADMIN_SECRET env var, also the Drive server's admin secret),
// checked on the server. A successful login sets an httpOnly cookie "<expiry>.<hmac>" signed with the
// same secret, so changing ADMIN_SECRET logs every admin out.

const COOKIE = "admin_session";
const MAX_AGE_S = 8 * 60 * 60;

function secret(): string {
  const s = process.env.ADMIN_SECRET;
  if (!s) throw new Error("ADMIN_SECRET is not set; the admin page can't authenticate anyone.");
  return s;
}

const sign = (expiry: string) => createHmac("sha256", secret()).update(`admin:${expiry}`).digest("hex");

// Hash both sides first so lengths match for timingSafeEqual.
function safeEqual(a: string, b: string) {
  return timingSafeEqual(createHash("sha256").update(a).digest(), createHash("sha256").update(b).digest());
}

export function checkPassword(password: string): boolean {
  return safeEqual(password, secret());
}

export async function startSession() {
  const expiry = String(Date.now() + MAX_AGE_S * 1000);
  (await cookies()).set(COOKIE, `${expiry}.${sign(expiry)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin",
    maxAge: MAX_AGE_S,
  });
}

export async function endSession() {
  (await cookies()).delete({ name: COOKIE, path: "/admin" });
}

export const SESSION_COOKIE = COOKIE;

// Shared by isAdmin() and proxy.ts.
export function verifySession(value: string | undefined): boolean {
  if (!value) return false;
  const [expiry, mac] = value.split(".");
  if (!expiry || !mac || Number(expiry) < Date.now()) return false;
  return safeEqual(mac, sign(expiry));
}

export async function isAdmin(): Promise<boolean> {
  return verifySession((await cookies()).get(COOKIE)?.value);
}

// Every admin Server Action calls this first: actions are public endpoints, whatever page shows them.
export async function requireAdmin() {
  if (!(await isAdmin())) throw new Error("Not authorized");
}
