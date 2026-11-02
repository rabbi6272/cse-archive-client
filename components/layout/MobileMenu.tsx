"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { cn, focusRing } from "@/components/ui";
import { AccountButton } from "./AccountButton";
import { ThemeToggle } from "./ThemeToggle";
import { isGroup, navEntries } from "./nav-links";

const rowClasses = cn(
  "flex w-full items-center justify-between rounded-button px-3 py-3 text-base font-medium text-ink hover:bg-surface",
  focusRing,
);

// Side drawer on a native <dialog>: focus stays inside while open, Esc closes it.
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const ref = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className={cn(
          "inline-flex size-10 items-center justify-center rounded-button text-ink hover:bg-surface",
          focusRing,
        )}
      >
        <Menu className="size-6" aria-hidden />
      </button>

      <dialog
        ref={ref}
        aria-label="Menu"
        onCancel={(e) => {
          e.preventDefault();
          setOpen(false);
        }}
        onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        className="m-0 ml-auto h-dvh max-h-none w-[min(20rem,100%)] bg-canvas p-0 text-ink shadow-modal backdrop:bg-black/50 motion-safe:animate-drawer-in"
      >
        <div className="flex h-full flex-col p-4">
          <div className="mb-2 flex items-center justify-between">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className={cn(
                "inline-flex size-10 items-center justify-center rounded-button text-ink-soft hover:bg-surface hover:text-ink",
                focusRing,
              )}
            >
              <X className="size-6" aria-hidden />
            </button>
          </div>

          <nav aria-label="Main" className="flex-1 overflow-y-auto">
            <ul className="flex flex-col gap-1">
              {navEntries.map((entry) =>
                isGroup(entry) ? (
                  <li key={entry.label}>
                    <button
                      type="button"
                      aria-expanded={expanded === entry.label}
                      onClick={() => setExpanded((e) => (e === entry.label ? null : entry.label))}
                      className={rowClasses}
                    >
                      {entry.label}
                      <ChevronDown
                        className={cn(
                          "size-4 text-steel transition-transform",
                          expanded === entry.label && "rotate-180",
                        )}
                        aria-hidden
                      />
                    </button>
                    {expanded === entry.label && (
                      <ul className="ml-3 border-l border-hairline pl-2">
                        {entry.items.map((item) => (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              {...(item.external && { target: "_blank", rel: "noopener noreferrer" })}
                              onClick={() => setOpen(false)}
                              className={cn(rowClasses, "text-sm text-ink-soft")}
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ) : (
                  <li key={entry.href}>
                    <Link
                      href={entry.href}
                      aria-current={pathname.startsWith(entry.href) ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      className={cn(rowClasses, "aria-[current=page]:bg-surface")}
                    >
                      {entry.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <AccountButton className="mt-4 w-full" />
        </div>
      </dialog>
    </>
  );
}
