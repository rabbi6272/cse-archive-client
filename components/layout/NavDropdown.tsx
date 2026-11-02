"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { cn, focusRing } from "@/components/ui";
import type { NavGroup } from "./nav-links";

export const navItemClasses = cn(
  "inline-flex h-9 items-center gap-1 rounded-button px-3 text-sm font-medium text-ink-soft transition-colors",
  "hover:bg-surface hover:text-ink aria-[current=page]:text-ink",
  focusRing,
);

// Click/Enter to open (the old menus opened on hover only, which keyboards couldn't reach).
// Closes on Esc, a click outside, focus leaving the menu, or navigation.
export function NavDropdown({ group }: { group: NavGroup }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative"
      onBlur={(e) => {
        if (!ref.current?.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((o) => !o)}
        className={navItemClasses}
      >
        {group.label}
        <ChevronDown
          className={cn("size-4 transition-transform", open && "rotate-180")}
          aria-hidden
        />
      </button>
      {open && (
        <ul
          id={menuId}
          className="absolute top-full left-0 z-50 mt-2 min-w-48 rounded-card border border-hairline bg-canvas p-1.5 shadow-modal"
        >
          {group.items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                {...(item.external && { target: "_blank", rel: "noopener noreferrer" })}
                className={cn(
                  "block rounded-button px-3 py-2 text-sm text-ink-soft hover:bg-surface hover:text-ink",
                  focusRing,
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
