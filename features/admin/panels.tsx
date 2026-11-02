import type { ReactNode } from "react";
import { MapPin, Users } from "lucide-react";
import { Badge, Card, EmptyState } from "@/components/ui";
import { formatTimeAgo } from "@/lib/PresenceTracker";
import { alumniData } from "@/features/alumni/data";
import { AlumniForm } from "./AlumniForm";
import { DriveControls } from "./DriveControls";
import { getDbAlumni, getDriveStatus, getSessions, toMs, type DriveStatus } from "./data";

// Server components for each admin tab. Data is fetched on the server per request (no-store).

function ErrorNote({ children }: { children: ReactNode }) {
  return <p className="rounded-button bg-error/10 px-3 py-2 text-sm text-error">{children}</p>;
}

function Row({ label, children, stacked }: { label: string; children: ReactNode; stacked?: boolean }) {
  return (
    <div className={stacked ? "flex flex-col gap-1" : "flex justify-between gap-3"}>
      <dt className="text-steel">{label}</dt>
      <dd className={stacked ? "text-ink" : "text-right text-ink"}>{children}</dd>
    </div>
  );
}

export async function DrivePanel() {
  let status: DriveStatus | null = null;
  let error = "";
  try {
    status = await getDriveStatus();
  } catch (err) {
    error = err instanceof Error ? err.message : "Drive server unreachable.";
  }
  const watch = status?.watch;

  return (
    <div className="flex flex-col gap-5">
      {error && <ErrorNote>Couldn&apos;t load status: {error}</ErrorNote>}
      <div className="grid gap-5 md:grid-cols-3">
        <Card>
          <h2 className="mb-3 font-semibold text-ink">Cache</h2>
          <dl className="flex flex-col gap-2 text-sm">
            <Row label="Tag">
              <span className="font-mono">{status?.cache?.tag ?? "—"}</span>
            </Row>
            <Row label="Fallback TTL">{(status?.cache?.revalidateFallbackSeconds ?? 0) / 3600} h</Row>
            <Row label="Invalidation" stacked>
              {status?.cache?.invalidation ?? "—"}
            </Row>
          </dl>
        </Card>
        <Card>
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="font-semibold text-ink">Watch channel</h2>
            <Badge tone={!watch ? "yellow" : watch.expired ? "rose" : "mint"} shape="pill">
              {!watch ? "No watch" : watch.expired ? "Expired" : "Active"}
            </Badge>
          </div>
          <dl className="flex flex-col gap-2 text-sm">
            <Row label="Channel ID">
              <span className="font-mono text-xs break-all">{watch?.channelId ?? "—"}</span>
            </Row>
            <Row label="Expiration">{watch?.expiration ? new Date(watch.expiration).toLocaleString() : "—"}</Row>
            <Row label="Page token">
              <span className={status?.pageToken === "present" ? "text-success" : "text-error"}>
                {status?.pageToken ?? "—"}
              </span>
            </Row>
            <Row label="Last webhook">
              {status?.lastNotification ? new Date(status.lastNotification).toLocaleString() : "never"}
            </Row>
          </dl>
        </Card>
        <Card>
          <h2 className="mb-3 font-semibold text-ink">Actions</h2>
          <DriveControls />
        </Card>
      </div>
    </div>
  );
}

export async function AlumniPanel() {
  const added = await getDbAlumni().catch(() => null);
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <Card variant="feature">
        <AlumniForm />
      </Card>
      <aside aria-labelledby="db-alumni">
        <h2 id="db-alumni" className="mb-1 font-semibold text-ink">
          Added here ({added?.length ?? "?"})
        </h2>
        <p className="mb-3 text-sm text-ink-soft">Plus {alumniData.length} built-in alumni.</p>
        {added === null ? (
          <ErrorNote>Couldn&apos;t read the alumni list.</ErrorNote>
        ) : (
          <div className="rounded-card border border-hairline bg-canvas">
            {added.length === 0 ? (
              <EmptyState icon={<MapPin />} title="None yet" className="py-8" />
            ) : (
              <ul className="divide-y divide-hairline">
                {added.map((a) => (
                  <li key={a.id} className="px-4 py-3">
                    <p className="font-medium text-ink">{a.name}</p>
                    <p className="text-[13px] text-steel">
                      {[a.series && `${a.series} series`, a.country].filter(Boolean).join(" · ")}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}

const statusTone = { active: "mint", disconnected: "yellow", ended: "neutral" } as const;

function duration(start: Parameters<typeof toMs>[0], end: Parameters<typeof toMs>[0]) {
  const from = toMs(start);
  if (!from) return "Unknown";
  const minutes = Math.floor(((toMs(end) || Date.now()) - from) / 60000);
  return minutes >= 60 ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` : `${minutes}m`;
}

export async function SessionsPanel() {
  const sessions = await getSessions().catch(() => null);
  if (sessions === null) return <ErrorNote>Couldn&apos;t read sessions.</ErrorNote>;

  return (
    <div className="overflow-hidden rounded-card border border-hairline bg-canvas">
      {sessions.length === 0 ? (
        <EmptyState icon={<Users />} title="No session data" />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <caption className="border-b border-hairline px-5 py-3 text-left text-steel">
              {sessions.length} sessions, most recent activity first. Reload the tab for the latest.
            </caption>
            <thead className="bg-surface text-[11px] font-semibold tracking-wider text-steel uppercase">
              <tr>
                {["User", "Roll", "Status", "Started", "Duration", "Current page", "Last activity", "Session"].map((h) => (
                  <th key={h} scope="col" className="px-5 py-3 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {sessions.map((s, i) => (
                <tr key={`${s.roll}-${s.sessionId}-${i}`} className="hover:bg-surface-soft">
                  <td className="px-5 py-3 font-medium whitespace-nowrap text-ink">{s.name ?? "—"}</td>
                  <td className="px-5 py-3 whitespace-nowrap text-ink-soft tabular-nums">{s.roll}</td>
                  <td className="px-5 py-3">
                    <Badge shape="pill" tone={statusTone[s.status as keyof typeof statusTone] ?? "rose"} className="text-[11px]">
                      {s.status ?? "unknown"}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap text-ink-soft">{formatTimeAgo(s.startTime)}</td>
                  <td className="px-5 py-3 whitespace-nowrap text-ink-soft">{duration(s.startTime, s.endTime)}</td>
                  <td className="max-w-48 truncate px-5 py-3 text-ink-soft">{s.currentPage ?? "—"}</td>
                  <td className="px-5 py-3 whitespace-nowrap text-ink-soft">{formatTimeAgo(s.lastActivity)}</td>
                  <td className="px-5 py-3 font-mono text-xs text-steel">{s.sessionId?.slice(-8) ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
