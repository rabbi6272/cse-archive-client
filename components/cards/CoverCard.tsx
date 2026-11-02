import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge, buttonClasses, cn } from "@/components/ui";
import type { Resource } from "./data";

export function ResourceCard({ resource, priority }: { resource: Resource; priority?: boolean }) {
  const { title, description, image, links } = resource;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-card border border-hairline bg-canvas transition-[box-shadow,translate] duration-200 hover:shadow-card motion-safe:hover:-translate-y-0.5">
      <Image
        src={image}
        alt=""
        placeholder="blur"
        priority={priority}
        sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
        className="aspect-[16/9] w-full object-cover"
      />
      <div className="flex flex-1 flex-col gap-3 p-6">
        <h2 className="text-xl font-semibold tracking-tight text-ink">{title}</h2>
        <p className="flex-1 leading-relaxed text-ink-soft">{description}</p>

        <ul className="mt-2 flex flex-wrap gap-2">
          {links.map((link) => (
            <li key={link.label} className="min-w-28 flex-1">
              {link.href ? (
                <Link
                  href={link.href}
                  aria-label={`${title}: ${link.label}`}
                  className={cn(buttonClasses("primary"), "w-full")}
                >
                  {link.label}
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              ) : (
                <span
                  className={cn(
                    "flex h-10 w-full items-center justify-center gap-2 rounded-button border border-dashed border-hairline-strong px-3 text-sm text-steel",
                  )}
                >
                  {link.label}
                  <Badge tone="neutral" className="text-[11px]">
                    Coming soon
                  </Badge>
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
