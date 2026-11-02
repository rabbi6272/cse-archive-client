import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div role="status" className="flex min-h-[calc(100dvh-4rem)] items-center justify-center">
      <Loader2 className="size-8 animate-spin text-primary motion-reduce:animate-none" aria-hidden />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
