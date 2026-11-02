import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/features/admin/session";

// Guards every /admin/* path with the ADMIN_SECRET session (see features/admin/session.ts), so admin
// pages added later are protected without extra code. /admin itself stays open: it's the login form,
// and it checks the session itself before rendering any admin content. Admin Server Actions also
// re-check with requireAdmin().
export function proxy(request: NextRequest) {
  if (verifySession(request.cookies.get(SESSION_COOKIE)?.value)) return NextResponse.next();
  return NextResponse.redirect(new URL("/admin", request.url));
}

export const config = { matcher: ["/admin/:path+"] };
