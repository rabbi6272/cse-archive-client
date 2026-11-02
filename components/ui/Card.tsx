import type { HTMLAttributes } from "react";
import { cn } from "./cn";

export type CardTint = "peach" | "rose" | "mint" | "lavender" | "sky" | "yellow";

const tints: Record<CardTint, string> = {
  peach: "bg-tint-peach",
  rose: "bg-tint-rose",
  mint: "bg-tint-mint",
  lavender: "bg-tint-lavender",
  sky: "bg-tint-sky",
  yellow: "bg-tint-yellow",
};

type CardProps = HTMLAttributes<HTMLDivElement> & {
  // "feature" gets more padding; a tint replaces the border with a pastel background
  variant?: "base" | "feature";
  tint?: CardTint;
  interactive?: boolean;
};

export function Card({ variant = "base", tint, interactive, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card",
        variant === "feature" ? "p-8" : "p-6",
        tint ? cn(tints[tint], "text-charcoal") : "border border-hairline bg-canvas text-ink",
        interactive && "transition-shadow hover:shadow-card",
        className,
      )}
      {...props}
    />
  );
}
