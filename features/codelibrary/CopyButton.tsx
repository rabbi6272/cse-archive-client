"use client";

import { useState } from "react";
import { MorphIcon } from "morphicons/react";
import { Check, Copy } from "lucide";
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
      <MorphIcon icon={copied ? Check : Copy} size={14} reducedMotion="user" />
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}
