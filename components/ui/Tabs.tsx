"use client";

import { useRef, type KeyboardEvent } from "react";
import { cn, focusRing } from "./cn";

type Tab<T extends string> = { value: T; label: string };

type TabsProps<T extends string> = {
  tabs: Tab<T>[];
  value: T;
  onChange: (value: T) => void;
  // "pill" for top-level switching, "underline" for in-page sections
  variant?: "pill" | "underline";
  "aria-label": string;
  className?: string;
};

// Controlled tab list. Renders only the tabs; the caller renders the active panel.
// Arrow keys, Home and End move between tabs (WAI-ARIA tabs pattern).
export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  variant = "pill",
  className,
  ...aria
}: TabsProps<T>) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  function onKeyDown(e: KeyboardEvent, index: number) {
    const last = tabs.length - 1;
    const next =
      e.key === "ArrowRight" ? (index === last ? 0 : index + 1)
      : e.key === "ArrowLeft" ? (index === 0 ? last : index - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    onChange(tabs[next].value);
    refs.current[next]?.focus();
  }

  return (
    <div
      role="tablist"
      aria-label={aria["aria-label"]}
      className={cn(
        "flex gap-2 overflow-x-auto",
        variant === "underline" && "gap-0 border-b border-hairline",
        className,
      )}
    >
      {tabs.map((tab, i) => {
        const active = tab.value === value;
        return (
          <button
            key={tab.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(tab.value)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cn(
              "text-sm font-medium whitespace-nowrap transition-colors",
              focusRing,
              variant === "pill"
                ? cn(
                    "h-9 rounded-full border px-4",
                    active
                      ? "border-ink bg-ink text-canvas"
                      : "border-hairline text-steel hover:text-ink",
                  )
                : cn(
                    "-mb-px border-b-2 px-4 py-3",
                    active ? "border-ink text-ink" : "border-transparent text-steel hover:text-ink",
                  ),
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
