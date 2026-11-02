import "highlight.js/styles/github-dark.css";
import { cn } from "@/components/ui";
import { CopyButton } from "./CopyButton";
import { highlight } from "./highlight";

const PREVIEW_LINES = 20;

// Server component. Long code is clipped to ~20 lines with a CSS-only "Show all" toggle
// (a visually hidden checkbox), so the only client JS here is the copy button.
export function CodeBlock({
  code,
  language,
  snippetId,
  rollNumber,
  collapsible = true,
}: {
  code: string;
  language: string;
  snippetId: string;
  rollNumber: string;
  collapsible?: boolean;
}) {
  const lines = code.split("\n").length;
  const clip = collapsible && lines > PREVIEW_LINES;
  const toggleId = `expand-${snippetId}`;

  return (
    <div className="relative overflow-hidden rounded-button bg-code-bg text-sm">
      <CopyButton code={code} snippetId={snippetId} rollNumber={rollNumber} className="absolute top-2 right-2 z-10" />
      {clip && <input type="checkbox" id={toggleId} className="peer sr-only" />}
      <pre
        className={cn(
          "overflow-x-auto font-mono leading-relaxed",
          clip && "max-h-[30rem] overflow-y-hidden peer-checked:max-h-none",
        )}
      >
        {/* highlight() returns hljs output, which escapes the code */}
        <code
          className={`hljs language-${language.toLowerCase()} !bg-transparent !p-4`}
          dangerouslySetInnerHTML={{ __html: highlight(code, language) }}
        />
      </pre>
      {clip && (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-10 h-16 bg-gradient-to-t from-code-bg peer-checked:hidden"
          />
          <label
            htmlFor={toggleId}
            className="flex h-10 cursor-pointer items-center justify-center border-t border-white/10 text-xs font-medium text-white/80 hover:text-white peer-focus-visible:outline-2 peer-focus-visible:-outline-offset-2 peer-focus-visible:outline-primary peer-checked:[&>.less]:inline peer-checked:[&>.more]:hidden"
          >
            <span className="more">Show all {lines} lines</span>
            <span className="less hidden">Show less</span>
          </label>
        </>
      )}
    </div>
  );
}
