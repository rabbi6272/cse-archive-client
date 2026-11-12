import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { Button, cn, focusRing, Skeleton } from "@/components/ui";
import { logout } from "@/features/admin/actions";

import { AdminShell } from "@/features/admin/AdminShell";
import { AdminLoginForm } from "@/features/admin/LoginForm";
import { AlumniPanel, DrivePanel, SessionsPanel } from "@/features/admin/panels";
import { getSession } from "@/features/auth/server";
import { hasRole, type Role } from "@/features/auth/roles";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

const ALL_TABS = [
  { id: "drive", label: "Drive cache", description: "Webhook watch, cache invalidation and Drive metadata.", min: "super_admin" },
  { id: "alumni", label: "Alumni", description: "Add alumni to the Global RUET map.", min: "admin" },
  { id: "sessions", label: "Sessions", description: "Every user session and its latest activity.", min: "admin" },
] as const satisfies ReadonlyArray<{ id: string; label: string; description: string; min: Role }>;
type TabId = (typeof ALL_TABS)[number]["id"];

// The single admin page. The account's role is checked on the server before anything renders, and
// every admin action re-checks it (features/admin/actions.ts), so nothing here relies on the browser.
export default async function AdminPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const viewer = await getSession();
  if (!hasRole(viewer, "admin")) {
    return (
      <AdminShell title="Admin" narrow>
        <AdminLoginForm signedIn={viewer !== null} />
      </AdminShell>
    );
  }

  const TABS = ALL_TABS.filter((t) => hasRole(viewer, t.min));
  const requested = (await searchParams).tab;
  const tab = TABS.find((t) => t.id === requested) ?? TABS[0]!;
  const Panel = { drive: DrivePanel, alumni: AlumniPanel, sessions: SessionsPanel }[tab.id as TabId];

  return (
    <AdminShell
      title="Admin"
      description={tab.description}
      actions={
        <form action={logout}>
          <Button type="submit" variant="ghost" size="sm">
            <LogOut className="size-4" aria-hidden />
            Log out
          </Button>
        </form>
      }
    >
      <nav aria-label="Admin sections" className="flex gap-2 overflow-x-auto">
        {TABS.map((t) => (
          <Link
            key={t.id}
            href={`/admin?tab=${t.id}`}
            aria-current={t.id === tab.id ? "page" : undefined}
            className={cn(
              "inline-flex h-9 items-center rounded-full border px-4 text-sm font-medium whitespace-nowrap transition-colors",
              t.id === tab.id ? "border-ink bg-ink text-canvas" : "border-hairline text-steel hover:text-ink",
              focusRing,
            )}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      <Suspense
        key={tab.id}
        fallback={
          <div className="flex flex-col gap-4" aria-busy="true">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
        }
      >
        <Panel />
      </Suspense>
    </AdminShell>
  );
}
