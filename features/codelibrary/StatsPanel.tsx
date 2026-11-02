"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui";

// The stats sidebar reads the whole Nutrinos tree from Realtime DB and draws a chart.js chart,
// so it stays client-only and loads after the page.
// shortcut: StatisticsSidebar.jsx itself still has the old styling; restyle it when it's next touched.
const StatisticsSidebar = dynamic(() => import("@/app/codelibrary/components/StatisticsSidebar"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-20" />
      <Skeleton className="h-40" />
      <Skeleton className="h-40" />
    </div>
  ),
});

// Only mounts at lg+ (where the sidebar is visible), so phones don't download chart.js or the data.
export function StatsPanel() {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = matchMedia("(min-width: 1024px)");
    setWide(mq.matches);
    const onChange = () => setWide(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return wide ? <StatisticsSidebar /> : null;
}
