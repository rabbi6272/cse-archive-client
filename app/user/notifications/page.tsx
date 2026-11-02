import type { Metadata } from "next";
import { NotificationList } from "@/features/notifications/NotificationList";

export const metadata: Metadata = { title: "Notifications", robots: { index: false } };

// Server component; the live list is the client island.
export default function NotificationsPage() {
  return (
    <div className="page-container py-8 md:py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-ink md:text-4xl">Notifications</h1>
        <p className="mt-2 mb-8 text-ink-soft">Comments, replies and mentions on your code.</p>
        <div className="overflow-hidden rounded-card border border-hairline bg-canvas">
          <NotificationList />
        </div>
      </div>
    </div>
  );
}
