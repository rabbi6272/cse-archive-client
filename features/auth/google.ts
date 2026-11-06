import "server-only";

// Shared by the Google start/callback routes. The OAuth work itself runs in cse-archive-server.
export const OAUTH_COOKIE = "__g_oauth";

// Google sends the user back here, so it must be registered on the OAuth client:
// <site>/api/auth/google/callback for every site base.
export const callbackUri = (requestUrl: string) =>
  `${process.env.NEXT_PUBLIC_SITE_URL ?? new URL(requestUrl).origin}/api/auth/google/callback`;
