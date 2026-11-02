import type { HTMLAttributes } from "react";
import { cn } from "./cn";
import type { CardTint } from "./Card";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  // "primary" is a solid blue status pill; a tint gives a soft tag (charcoal text, ≥9.5:1 contrast)
  tone?: "primary" | "neutral" | CardTint;
  // "pill" for status, "tag" for labels like course codes
  shape?: "pill" | "tag";
};

const tones = {
  primary: "bg-primary text-white",
  neutral: "bg-surface text-ink-soft border border-hairline",
  peach: "bg-tint-peach text-charcoal",
  rose: "bg-tint-rose text-charcoal",
  mint: "bg-tint-mint text-charcoal",
  lavender: "bg-tint-lavender text-charcoal",
  sky: "bg-tint-sky text-charcoal",
  yellow: "bg-tint-yellow text-charcoal",
} as const;

export function Badge({ tone = "neutral", shape = "tag", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-[13px] leading-5 font-semibold whitespace-nowrap",
        shape === "pill" ? "rounded-full px-2.5 py-0.5" : "rounded-md px-2 py-0.5",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
