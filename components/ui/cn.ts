// shortcut: plain join, no tailwind-merge — a className passed in can't reliably override a
// conflicting base class (e.g. two paddings). Add tailwind-merge if that starts biting.
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

// Shared keyboard focus ring for every interactive element.
export const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";
