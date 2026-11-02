"use client";

import { Moon, Sun } from "lucide-react";
import { cn, focusRing } from "@/components/ui";

// Flips light/dark and remembers the choice in localStorage.theme. Until the first click the
// inline script in app/layout.tsx follows the OS setting. The icon is picked by CSS (dark:),
// so it always matches the page and needs no state or hydration step.
export function ThemeToggle({ className }: { className?: string }) {
  function toggle() {
    const dark = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {
      // storage blocked: the theme still applies for this page view
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark theme"
      title="Toggle dark theme"
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-button text-ink-soft hover:bg-surface hover:text-ink",
        focusRing,
        className,
      )}
    >
      <Sun className="size-[18px] dark:hidden" aria-hidden />
      <Moon className="hidden size-[18px] dark:block" aria-hidden />
    </button>
  );
}
