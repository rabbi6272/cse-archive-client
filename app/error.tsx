"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ui";

// Catches errors thrown while rendering any page below the root layout.
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="page-container flex min-h-[calc(100dvh-4rem)] items-center justify-center">
      <ErrorState
        description="This page failed to load. Try again, or come back in a moment."
        onRetry={reset}
      />
    </div>
  );
}
