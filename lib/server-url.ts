// Origin of cse-archive-server (auth, drive, admin APIs). Single source: NEXT_PUBLIC_SERVER_URL.
export const SERVER_URL = (process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3005").replace(/\/+$/, "");
