"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn, focusRing } from "@/components/ui";
import { incrementCopies } from "./mutations";

export function CopyButton({
  code,
  snippetId,
  rollNumber,
  className,
}: {
  code: string;
  snippetId: string;
  rollNumber: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      // Counting is best effort; a failed write shouldn't look like a failed copy.
      incrementCopies(rollNumber, snippetId).catch((err) => console.error("Copy count failed:", err));
    } catch (err) {
      console.error("Copy failed:", err);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-button border border-white/15 bg-white/10 px-2.5 text-xs font-medium text-white backdrop-blur transition-colors hover:bg-white/20",
        focusRing,
        className,
      )}
    >
      {copied ? (
        <Check className="size-3.5 motion-safe:animate-pop-in" aria-hidden />
      ) : (
        <Copy className="size-3.5" aria-hidden />
      )}
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}
