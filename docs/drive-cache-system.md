# Google Drive Service

The Drive API, cache, Google webhook and watch-renewal cron run in a separate Bun + Hono server, [`cse-archive-server/`](../../cse-archive-server/), on Render. Its [README](../../cse-archive-server/README.md) covers the architecture, endpoints, env vars, deployment, cron jobs and troubleshooting.

This site calls that server from the browser and caches folder data using TanStack React Query:

| File | Calls / Usage |
|---|---|
| `features/drive/queries.ts` | `useDriveFolder` hook with TanStack React Query (`staleTime: 15m`, `gcTime: 1h`) |
| `features/drive/api.ts` | `fetchDriveFolder` (`POST {NEXT_PUBLIC_DRIVE_API_URL}/api/drive`) |
| `app/drive/[id]/page.tsx` | Renders `DriveView` (client-side query) & `generateMetadata` (server-side) |
| `app/drive/page.tsx` | Redirects `/drive` to root folder ID |
| `features/drive/FileRow.tsx` | Prefetches folder data on hover / focus for instant transitions |
| `app/admin/page.tsx` | Drive admin cache status & management |

## Env (Vercel)

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_DRIVE_API_URL` | `https://cse-archive-server.onrender.com` (no trailing slash) |

The Drive server's `ALLOWED_ORIGIN` must be this site's origin, or the browser blocks the requests (CORS).
