import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buttonClasses, cn } from "@/components/ui";

// Server component: plain links, keeping the current filters.
export function Pagination({
  page,
  pageCount,
  params,
}: {
  page: number;
  pageCount: number;
  params: Record<string, string | undefined>;
}) {
  if (pageCount <= 1) return null;

  const href = (p: number) => {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v && k !== "page") sp.set(k, v);
    if (p > 1) sp.set("page", String(p));
    const qs = sp.toString();
    return `/codelibrary${qs ? `?${qs}` : ""}`;
  };
  const disabled = "pointer-events-none opacity-40";

  return (
    <nav aria-label="Pagination" className="flex items-center justify-between gap-3">
      <Link
        href={href(page - 1)}
        aria-disabled={page <= 1}
        tabIndex={page <= 1 ? -1 : undefined}
        className={cn(buttonClasses("secondary"), page <= 1 && disabled)}
      >
        <ChevronLeft className="size-4" aria-hidden />
        Newer
      </Link>
      <span className="text-sm text-steel">
        Page {page} of {pageCount}
      </span>
      <Link
        href={href(page + 1)}
        aria-disabled={page >= pageCount}
        tabIndex={page >= pageCount ? -1 : undefined}
        className={cn(buttonClasses("secondary"), page >= pageCount && disabled)}
      >
        Older
        <ChevronRight className="size-4" aria-hidden />
      </Link>
    </nav>
  );
}
