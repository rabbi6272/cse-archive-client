import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge, buttonClasses, cn } from "@/components/ui";

// A link without href is shown as "coming soon".
export type CoverLink = { label: string; href?: string };

// Image card with link buttons; used by Resources and the Book Shelf. Server component.
export function CoverCard({
  title,
  description,
  image,
  links,
  priority,
}: {
  title: string;
  description?: string;
  image: StaticImageData;
  links: CoverLink[];
  priority?: boolean;
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-card border border-hairline bg-canvas transition-[box-shadow,translate] duration-200 hover:shadow-card motion-safe:hover:-translate-y-0.5">
      <div className="overflow-hidden">
        <Image
          src={image}
          alt=""
          placeholder="blur"
          priority={priority}
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
          className="aspect-[16/9] w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <h2 className="text-xl font-semibold tracking-tight text-ink">{title}</h2>
        {description && <p className="flex-1 leading-relaxed text-ink-soft">{description}</p>}

        <ul className="mt-auto flex flex-wrap gap-2 pt-2">
          {links.map((link) => (
            <li key={link.label} className="min-w-fit flex-1">
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
                <span className="flex h-10 w-full items-center justify-center gap-2 rounded-button border border-dashed border-hairline-strong px-3 text-sm whitespace-nowrap text-steel">
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
