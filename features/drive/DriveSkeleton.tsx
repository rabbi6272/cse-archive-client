import { Skeleton } from "@/components/ui";

const ROWS = 7;

// Shown while loading a folder (either during SSR transition or TanStack Query client fetch).
export function DriveSkeleton() {
  return (
    <div className="page-container py-8 md:py-12">
      <div className="mx-auto max-w-4xl" aria-busy="true" aria-label="Loading folder">
        <Skeleton className="mt-12 h-9 w-2/3" />
        <Skeleton className="mt-3 mb-6 h-4 w-32" />
        <ul className="rounded-card border border-hairline bg-canvas">
          {Array.from({ length: ROWS }, (_, i) => (
            <li key={i} className="flex items-center gap-3 border-b border-hairline px-4 py-4 last:border-b-0">
              <Skeleton className="size-5 shrink-0" />
              <Skeleton className="h-4" style={{ width: `${40 + ((i * 17) % 45)}%` }} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
