import Link from "next/link";
import { ArrowRight, BookOpen, Code2, FolderOpen, GraduationCap, type LucideIcon } from "lucide-react";
import { Card, cn, focusRing, type CardTint } from "@/components/ui";
import { revealDelay } from "./reveal";
import { SectionHeading } from "./SectionHeading";

const features: {
  href: string;
  icon: LucideIcon;
  tint: CardTint;
  title: string;
  description: string;
}[] = [
  {
    href: "/resources",
    icon: FolderOpen,
    tint: "sky",
    title: "Study Resources",
    description:
      "Everything else CSE students lean on: slides, references and materials across years and subjects.",
  },
  {
    href: "/shelf",
    icon: BookOpen,
    tint: "peach",
    title: "Book Shelf",
    description:
      "Curated notes, PDFs and reading materials organized by topic, gathered so you don't hunt across the web.",
  },
  {
    href: "/codelibrary",
    icon: Code2,
    tint: "mint",
    title: "Code Library",
    description:
      "A growing set of reusable code snippets and solutions. Learn from peers and contribute your own.",
  },
  {
    href: "/alumni",
    icon: GraduationCap,
    tint: "lavender",
    title: "Alumni Network",
    description:
      "Stories and advice from RUET CSE graduates: career journeys and lessons from people who've walked the path.",
  },
];

export function FeaturesList() {
  return (
    <section aria-labelledby="features-heading" className="page-container py-16 md:py-24">
      <SectionHeading id="features-heading" eyebrow="What you'll find" title="Everything CSE lives here">
        Four corners of the archive, each built to get you from curious to productive faster.
      </SectionHeading>

      <ul className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 md:gap-5">
        {features.map(({ href, icon: Icon, tint, title, description }, i) => (
          <li key={href} className="reveal" style={revealDelay(i * 100)}>
            <Link href={href} className={cn("group block h-full rounded-card", focusRing)}>
              <Card variant="feature" tint={tint} interactive className="h-full">
                <Icon className="size-7" aria-hidden />
                <h3 className="mt-5 text-xl font-semibold">{title}</h3>
                <p className="mt-2 leading-relaxed">{description}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold">
                  Open {title}
                  <ArrowRight
                    className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                    aria-hidden
                  />
                </span>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
