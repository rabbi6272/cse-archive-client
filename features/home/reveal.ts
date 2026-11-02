import type { CSSProperties } from "react";

// Stagger for the .reveal scroll animation in globals.css (used by browsers without scroll timelines).
export const revealDelay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;
