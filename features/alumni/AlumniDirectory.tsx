import { ChevronDown, ExternalLink } from "lucide-react";
import { Badge, cn, focusRing } from "@/components/ui";
import { alumniData, badgeLabels } from "./data";

// Server-rendered list of the same alumni as the map, grouped by country:
// readable without the map, by keyboard and screen readers, and by search engines.
export function AlumniDirectory() {
  const byCountry = Object.entries(
    alumniData.reduce<Record<string, typeof alumniData>>((acc, a) => {
      (acc[a.country] ??= []).push(a);
      return acc;
    }, {}),
  ).sort((a, b) => b[1].length - a[1].length);

  return (
    <div className="divide-y divide-hairline rounded-card border border-hairline bg-canvas">
      {byCountry.map(([country, people]) => (
        <details key={country} className="group">
          <summary
            className={cn(
              "flex cursor-pointer list-none items-center justify-between gap-4 rounded-card px-5 py-4 font-semibold text-ink [&::-webkit-details-marker]:hidden",
              focusRing,
            )}
          >
            <span>
              {country} <span className="ml-1 text-sm font-normal text-steel">{people.length}</span>
            </span>
            <ChevronDown
              className="size-5 shrink-0 text-steel transition-transform group-open:rotate-180 motion-reduce:transition-none"
              aria-hidden
            />
          </summary>
          <ul className="grid gap-x-6 gap-y-4 px-5 pb-5 sm:grid-cols-2">
            {[...people]
              .sort((a, b) => a.series.localeCompare(b.series) || a.name.localeCompare(b.name))
              .map((a) => {
                const badges = (a.badges ?? "").split(",").map((b) => b.trim()).filter(Boolean);
                return (
                  <li key={a.Id ?? a.name} className="flex flex-col gap-1">
                    <span className="font-medium text-ink">
                      {a.linkedinurl ? (
                        <a
                          href={a.linkedinurl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn("inline-flex items-center gap-1 rounded-sm hover:text-link", focusRing)}
                        >
                          {a.name}
                          <ExternalLink className="size-3.5" aria-label="LinkedIn profile" />
                        </a>
                      ) : (
                        a.name
                      )}
                    </span>
                    <span className="text-sm text-ink-soft">
                      {[a.optional, `${a.series} series`].filter(Boolean).join(" · ")}
                    </span>
                    <span className="text-[13px] text-steel">{a.address}</span>
                    {badges.length > 0 && (
                      <span className="mt-1 flex flex-wrap gap-1">
                        {badges.map((b) => (
                          <Badge key={b} tone="sky" className="text-[11px]">
                            {badgeLabels[b] ?? b}
                          </Badge>
                        ))}
                      </span>
                    )}
                  </li>
                );
              })}
          </ul>
        </details>
      ))}
    </div>
  );
}
