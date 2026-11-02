"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { cn, focusRing } from "@/components/ui";

type Theme = "light" | "dark" | "system";

const order: Theme[] = ["system", "light", "dark"];
const icons = { light: Sun, dark: Moon, system: Monitor };

// Same rule as the inline script in app/layout.tsx, which applies it before paint.
function apply(theme: Theme) {
  const dark =
    theme === "dark" ||
    (theme === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
}

function readTheme(): Theme {
  try {
    const t = localStorage.getItem("theme");
    return t === "light" || t === "dark" ? t : "system";
  } catch {
    return "system";
  }
}

// Cycles system → light → dark.
export function ThemeToggle({ className }: { className?: string }) {
  // null until mounted: the server can't know the stored theme
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => setTheme(readTheme()), []);

  function next() {
    const t = order[(order.indexOf(theme ?? "system") + 1) % order.length];
    try {
      if (t === "system") localStorage.removeItem("theme");
      else localStorage.setItem("theme", t);
    } catch {
      // storage blocked: the theme still applies for this page view
    }
    apply(t);
    setTheme(t);
  }

  const Icon = icons[theme ?? "system"];
  return (
    <button
      type="button"
      onClick={next}
      aria-label={`Theme: ${theme ?? "system"}. Change theme`}
      title={`Theme: ${theme ?? "system"}`}
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-button text-ink-soft hover:bg-surface hover:text-ink",
        focusRing,
        className,
      )}
    >
      <Icon className={cn("size-[18px]", !theme && "opacity-0")} aria-hidden />
    </button>
  );
}
