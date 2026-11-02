import Link from "next/link";
import { Copy } from "lucide-react";
import { Badge, cn, focusRing } from "@/components/ui";
import { CodeBlock } from "./CodeBlock";
import { authorName, formatDate } from "./format";
import { LikeButton } from "./LikeButton";
import type { CodeSnippet } from "./server";

// Server component; LikeButton and CodeBlock's copy button are the client islands.
export function SnippetCard({ snippet }: { snippet: CodeSnippet }) {
  const date = formatDate(snippet.date);

  return (
    <article className="rounded-card border border-hairline bg-canvas p-5 transition-shadow duration-200 hover:shadow-card md:p-6">
      <div className="flex items-center justify-between gap-3">
        {snippet.language && <Badge tone="sky">{snippet.language}</Badge>}
        {date && (
          <time dateTime={snippet.date} className="text-[13px] text-steel">
            {date}
          </time>
        )}
      </div>

      <h2 className="mt-3 text-lg font-semibold tracking-tight text-ink">
        <Link
          href={`/codelibrary/${snippet.id}`}
          className={cn("rounded-sm hover:text-link hover:underline underline-offset-4", focusRing)}
        >
          {snippet.title}
        </Link>
      </h2>
      {snippet.description && <p className="mt-1 leading-relaxed text-ink-soft">{snippet.description}</p>}

      <div className="mt-4">
        <CodeBlock
          code={snippet.code}
          language={snippet.language}
          snippetId={snippet.id}
          rollNumber={snippet.rollNumber}
        />
      </div>

      <footer className="mt-4 flex items-center justify-between gap-3 text-sm">
        <span className="min-w-0 truncate text-ink-soft">
          <span className="font-medium text-ink">{authorName(snippet.rollNumber)}</span>{" "}
          <span className="text-steel">({snippet.rollNumber})</span>
        </span>
        <div className="flex shrink-0 items-center gap-1">
          <span className="inline-flex items-center gap-1.5 px-2 text-steel" title="Copies">
            <Copy className="size-4" aria-hidden />
            <span className="tabular-nums">{snippet.copiesCount}</span>
            <span className="sr-only">copies</span>
          </span>
          <LikeButton
            snippetId={snippet.id}
            rollNumber={snippet.rollNumber}
            initialCount={snippet.likesCount}
          />
        </div>
      </footer>
    </article>
  );
}
