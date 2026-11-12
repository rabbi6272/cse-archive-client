import { NextResponse, type NextRequest } from "next/server";

// Cheap first gate for /admin/* sub-pages: no __session cookie means not signed in, so send the
// visitor to the login page. The real role check (admin / super_admin) happens on the server in
// each admin page and Server Action via features/admin/session.ts.
export function proxy(request: NextRequest) {
  if (request.cookies.get("__session")?.value) return NextResponse.next();
  const login = new URL("/user/login", request.url);
  login.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(login);
}

export const config = { matcher: ["/admin/:path+"] };
