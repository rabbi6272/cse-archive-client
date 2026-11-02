import type { Metadata } from "next";
import { Dashboard } from "@/features/dashboard/Dashboard";

export const metadata: Metadata = { title: "Dashboard", robots: { index: false } };

// Server component shell; the dashboard needs the signed-in user from localStorage, so it's a client island.
export default function DashboardPage() {
  return (
    <div className="page-container py-8 md:py-12">
      <div className="mx-auto max-w-4xl">
        <Dashboard />
      </div>
    </div>
  );
}
