import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Copy, User } from "lucide-react";
import { Badge, buttonClasses } from "@/components/ui";
import { CodeBlock } from "@/features/codelibrary/CodeBlock";
import { authorName, formatDate } from "@/features/codelibrary/format";
import { LikeButton } from "@/features/codelibrary/LikeButton";
import { getSnippet } from "@/features/codelibrary/server";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const snippet = await getSnippet((await params).id);
  if (!snippet) return { title: "Snippet not found" };
  const description =
    snippet.description || `${snippet.language} code snippet by ${authorName(snippet.rollNumber)}.`;
  return {
    title: `${snippet.title} (${snippet.language}) · Code Library`,
    description,
    openGraph: { title: snippet.title, description, type: "article" },
  };
}

// Server component: rendered with the snippet already in the HTML (it used to load in the browser).
export default async function SnippetPage({ params }: Props) {
  const snippet = await getSnippet((await params).id);
  if (!snippet) notFound();
  const date = formatDate(snippet.date);

  return (
    <div className="page-container py-8 md:py-12">
      <div className="mx-auto max-w-4xl">
        <Link href="/codelibrary" className={buttonClasses("ghost", "sm")}>
          <ArrowLeft className="size-4" aria-hidden />
          Code Library
        </Link>

        <header className="mt-4 mb-8 motion-safe:animate-pop-in">
          <div className="flex flex-wrap items-center gap-2">
            {snippet.language && <Badge tone="sky">{snippet.language}</Badge>}
            {snippet.difficulty && <Badge tone="mint">{snippet.difficulty}</Badge>}
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl">{snippet.title}</h1>
          {snippet.description && (
            <p className="mt-3 text-lg leading-relaxed text-ink-soft">{snippet.description}</p>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-steel">
            <span className="inline-flex items-center gap-1.5">
              <User className="size-4" aria-hidden />
              <span className="text-ink">{authorName(snippet.rollNumber)}</span> ({snippet.rollNumber})
            </span>
            {date && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="size-4" aria-hidden />
                <time dateTime={snippet.date}>{date}</time>
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Copy className="size-4" aria-hidden />
              {snippet.copiesCount} copies
            </span>
            <LikeButton snippetId={snippet.id} rollNumber={snippet.rollNumber} initialCount={snippet.likesCount} />
          </div>

          {snippet.tags.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {snippet.tags.map((tag) => (
                <li key={tag}>
                  <Badge>#{tag}</Badge>
                </li>
              ))}
            </ul>
          )}
        </header>

        <CodeBlock
          code={snippet.code || "No code available"}
          language={snippet.language}
          snippetId={snippet.id}
          rollNumber={snippet.rollNumber}
          collapsible={false}
        />
      </div>
    </div>
  );
}
