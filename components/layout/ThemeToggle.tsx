"use client";

import { useEffect, useState } from "react";
import { MorphIcon } from "morphicons/react";
import { Moon, Sun } from "lucide";
import { cn, focusRing } from "@/components/ui";

// Flips light/dark and remembers the choice in localStorage.theme. Until the first click the
// inline script in app/layout.tsx follows the OS setting. The icon morphs between sun and moon.
export function ThemeToggle({ className }: { className?: string }) {
  // null until mounted (the server can't know the theme); MorphIcon then shows the first icon
  // without animating.
  const [dark, setDark] = useState<boolean | null>(null);

  // Watch the <html> class so every toggle instance (navbar and mobile menu) and OS theme
  // changes stay in sync.
  useEffect(() => {
    const html = document.documentElement;
    const sync = () => setDark(html.classList.contains("dark"));
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  function toggle() {
    const next = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // storage blocked: the theme still applies for this page view
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark theme"
      aria-pressed={dark ?? undefined}
      title="Toggle dark theme"
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-button text-ink-soft hover:bg-surface hover:text-ink",
        focusRing,
        className,
      )}
    >
      <MorphIcon icon={dark === null ? undefined : dark ? Moon : Sun} size={18} reducedMotion="user" />
    </button>
  );
}
