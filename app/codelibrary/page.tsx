import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Plus, SearchX } from "lucide-react";
import { buttonClasses, EmptyState } from "@/components/ui";
import { Filters } from "@/features/codelibrary/Filters";
import { Pagination } from "@/features/codelibrary/Pagination";
import { getSnippets } from "@/features/codelibrary/server";
import { SnippetCard } from "@/features/codelibrary/SnippetCard";
import { StatsPanel } from "@/features/codelibrary/StatsPanel";

const title = "Code Library - Programming Solutions & Examples";
const description =
  "Explore our comprehensive code library with programming solutions, algorithms, data structures, and code examples for CSE students. Find implementation guides and best practices.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "Code Library",
    "Programming Solutions",
    "Algorithms",
    "Data Structures",
    "C++ Code",
    "Python Code",
    "Java Code",
    "JavaScript",
    "Programming Examples",
    "CSE Code",
    "RUET Programming",
    "Code Snippets",
    "Software Development",
  ],
  openGraph: {
    title: `${title} | RUET CSE Archive`,
    description:
      "Explore our comprehensive code library with programming solutions, algorithms, data structures, and code examples for CSE students.",
    url: "https://csearchive.vercel.app/codelibrary",
    images: [{ url: "/images/codelibrary-og-image.png", width: 1200, height: 630, alt: "RUET CSE Code Library" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | RUET CSE Archive`,
    description:
      "Explore our comprehensive code library with programming solutions, algorithms, data structures, and code examples for CSE students.",
    images: ["/images/codelibrary-twitter-image.png"],
  },
  alternates: { canonical: "https://csearchive.vercel.app/codelibrary" },
};

const PER_PAGE = 10;

type SearchParams = { q?: string; lang?: string; page?: string };

// Server component: fetches every snippet (cached), filters and paginates on the server.
// Client islands: Filters, each card's like/copy buttons, and the stats sidebar.
export default async function CodeLibraryPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const q = params.q?.trim().toLowerCase() ?? "";
  const lang = params.lang ?? "";
  const all = await getSnippets();

  const languages = Object.entries(
    all.reduce<Record<string, number>>((acc, s) => {
      if (s.language) acc[s.language] = (acc[s.language] ?? 0) + 1;
      return acc;
    }, {}),
  )
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const filtered = all.filter(
    (s) =>
      (!lang || s.language.toLowerCase() === lang.toLowerCase()) &&
      (!q ||
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q))),
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const page = Math.min(Math.max(1, Number(params.page) || 1), pageCount);
  const shown = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="page-container py-12 md:py-16">
      <header className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
        <h1 className="text-4xl font-semibold tracking-tight text-ink md:text-5xl">Code Snippets Gallery</h1>
        <p className="mt-4 text-lg text-ink-soft">
          Useful snippets written by RUET CSE students, never AI-generated. Use anything you like, and credit the
          author.
        </p>
        <Link href="/user/create-snippet" className={`${buttonClasses("primary")} mt-6`}>
          <Plus className="size-4" aria-hidden />
          Share a snippet
        </Link>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <section aria-label="Snippets" className="flex min-w-0 flex-col gap-5">
          <Suspense>
            <Filters languages={languages} />
          </Suspense>

          <p className="text-sm text-steel" aria-live="polite">
            {filtered.length === all.length
              ? `${all.length} snippets`
              : `${filtered.length} of ${all.length} snippets`}
          </p>

          {shown.length === 0 ? (
            <div className="rounded-card border border-hairline bg-canvas">
              <EmptyState
                icon={<SearchX />}
                title="No snippets match"
                description="Try a different search, or clear the filters."
                action={
                  <Link href="/codelibrary" className={buttonClasses("secondary")}>
                    Clear filters
                  </Link>
                }
              />
            </div>
          ) : (
            <ul className="flex flex-col gap-5">
              {shown.map((snippet) => (
                <li key={snippet.id} className="reveal">
                  <SnippetCard snippet={snippet} />
                </li>
              ))}
            </ul>
          )}

          <Pagination page={page} pageCount={pageCount} params={params} />
        </section>

        <aside aria-labelledby="stats-heading" className="hidden lg:block">
          <div className="sticky top-24">
            <h2 id="stats-heading" className="text-lg font-semibold text-ink">
              Community stats
            </h2>
            <p className="mt-1 mb-4 text-sm text-ink-soft">Top contributors and activity trends</p>
            <StatsPanel />
          </div>
        </aside>
      </div>
    </div>
  );
}
