"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { cn, focusRing, SearchInput } from "@/components/ui";

// Search and language filter as URL params (?q=&lang=). The server page does the filtering,
// so results are shareable and this is the only client code in the list.
export function Filters({ languages }: { languages: { name: string; count: number }[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const lang = params.get("lang") ?? "";
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  function update(next: Record<string, string>) {
    const sp = new URLSearchParams(params);
    for (const [k, v] of Object.entries(next)) {
      if (v) sp.set(k, v);
      else sp.delete(k);
    }
    sp.delete("page"); // new filter, back to page 1
    const qs = sp.toString();
    startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
  }

  // Debounce typing so every keystroke isn't a server render.
  function onSearch(value: string) {
    setQuery(value);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => update({ q: value.trim() }), 300);
  }
  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <SearchInput
        value={query}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search snippets by title, description or tag"
        aria-label="Search snippets"
        className="flex-1"
      />
      <div className="relative flex items-center gap-2">
        <select
          value={lang}
          onChange={(e) => update({ lang: e.target.value })}
          aria-label="Filter by language"
          className={cn(
            "h-11 w-full rounded-button border border-hairline bg-surface px-3 text-base text-ink sm:w-48",
            focusRing,
          )}
        >
          <option value="">All languages</option>
          {languages.map((l) => (
            <option key={l.name} value={l.name}>
              {l.name} ({l.count})
            </option>
          ))}
        </select>
        <Loader2
          className={cn("size-4 shrink-0 animate-spin text-steel transition-opacity", !pending && "opacity-0")}
          aria-hidden
        />
        <span className="sr-only" aria-live="polite">
          {pending ? "Updating results" : ""}
        </span>
      </div>
    </div>
  );
}
