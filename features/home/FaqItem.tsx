"use client";

import { useId, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn, focusRing } from "@/components/ui";

// Accordion item that animates open and closed in every browser: the panel's grid row goes
// 0fr -> 1fr. (<details> can only animate in recent Chrome.) The answer is server-rendered children.
export function FaqItem({ question, children }: { question: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <div className="border-b border-hairline">
      <h3>
        <button
          type="button"
          id={`${id}-q`}
          aria-expanded={open}
          aria-controls={`${id}-a`}
          onClick={() => setOpen((o) => !o)}
          className={cn(
            "flex w-full items-center justify-between gap-4 rounded-button py-5 text-left text-lg font-semibold text-ink",
            focusRing,
          )}
        >
          {question}
          <ChevronDown
            className={cn(
              "size-5 shrink-0 text-steel transition-transform duration-300 motion-reduce:transition-none",
              open && "rotate-180",
            )}
            aria-hidden
          />
        </button>
      </h3>
      <div
        id={`${id}-a`}
        role="region"
        aria-labelledby={`${id}-q`}
        // inert keeps links in a closed answer out of the tab order and the accessibility tree
        inert={!open}
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <p className="pb-6 leading-relaxed text-ink-soft">{children}</p>
        </div>
      </div>
    </div>
  );
}
