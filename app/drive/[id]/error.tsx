"use client";

import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ErrorState } from "@/components/ui";

export default function DriveError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const router = useRouter();
  const [retrying, startRetry] = useTransition();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="page-container py-8 md:py-12">
      <div className="mx-auto max-w-4xl rounded-card border border-hairline bg-canvas">
        <ErrorState
          title="Couldn't load this folder"
          description={retrying ? "Retrying…" : "The Drive server didn't respond. Try again in a moment."}
          // reset() alone re-renders with the cached error; refresh() refetches on the server
          onRetry={() => startRetry(() => {
            router.refresh();
            reset();
          })}
        />
      </div>
    </div>
  );
}
