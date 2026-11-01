# Google Drive Service

The Drive API, cache, Google webhook and watch-renewal cron run in a separate Bun + Hono server, [`cse-archive-server/`](../../cse-archive-server/), on Render. Its [README](../../cse-archive-server/README.md) covers the architecture, endpoints, env vars, deployment, cron jobs and troubleshooting.

This site only calls that server from the browser:

| File | Calls |
|---|---|
| `app/drive/[id]/page.tsx` | `POST {NEXT_PUBLIC_DRIVE_API_URL}/api/drive` |
| `app/admin/drive/page.tsx` | `GET/POST {NEXT_PUBLIC_DRIVE_API_URL}/api/drive/admin` |

## Env (Vercel)

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_DRIVE_API_URL` | `https://cse-archive-server.onrender.com` (no trailing slash) |

The Drive server's `ALLOWED_ORIGIN` must be this site's origin, or the browser blocks the requests (CORS).
