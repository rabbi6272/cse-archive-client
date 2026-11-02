"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Leaflet touches window on import, so the whole map loads in the browser only.
export const AlumniMap = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => (
    <div className="flex size-full items-center justify-center bg-surface" role="status">
      <Loader2 className="size-6 animate-spin text-steel motion-reduce:animate-none" aria-hidden />
      <span className="sr-only">Loading map…</span>
    </div>
  ),
});
