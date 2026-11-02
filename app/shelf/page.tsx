import type { Metadata } from "next";
import { CoverCard } from "@/components/cards/CoverCard";
import { shelf } from "@/features/shelf/data";

const title = "Digital Book Shelf";
const description =
  "Browse our curated collection of programming books, technical guides, and educational resources for computer science students at RUET.";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["RUET", "CSE", "programming books", "technical books", "computer science", "bookshelf"],
  openGraph: { title: `${title} | RUET CSE Archive`, description, type: "website" },
  twitter: { card: "summary_large_image", title: `${title} | RUET CSE Archive`, description },
};

export default function ShelfPage() {
  return (
    <div className="page-container py-12 md:py-16">
      <header className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
        <h1 className="text-4xl font-semibold tracking-tight text-ink md:text-5xl">{title}</h1>
        <p className="mt-4 text-lg text-ink-soft">
          Textbooks, reference material and study resources for Computer Science &amp; Engineering students at RUET.
        </p>
      </header>

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {shelf.map((item, i) => (
          <li key={item.title} className="reveal">
            <CoverCard {...item} priority={i < 4} />
          </li>
        ))}
      </ul>
    </div>
  );
}
