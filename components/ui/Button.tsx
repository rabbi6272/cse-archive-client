import type { ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn, focusRing } from "./cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "dark" | "link" | "danger";
export type ButtonSize = "md" | "sm";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary-pressed active:bg-primary-pressed",
  secondary: "border border-hairline-strong text-ink hover:bg-surface",
  ghost: "text-ink hover:bg-surface",
  // ink/canvas swap in dark mode, so this is black-on-light and light-on-dark
  dark: "bg-ink text-canvas hover:opacity-90",
  link: "text-link underline-offset-4 hover:underline",
  danger: "bg-error text-white hover:opacity-90",
};

const sizes: Record<ButtonSize, string> = {
  md: "h-10 px-[18px] text-sm",
  sm: "h-8 px-3 text-[13px]",
};

// For links styled as buttons: <Link className={buttonClasses("secondary")}>.
export function buttonClasses(variant: ButtonVariant = "primary", size: ButtonSize = "md") {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-button font-medium whitespace-nowrap transition-colors",
    "disabled:pointer-events-none disabled:opacity-50",
    variant !== "link" && sizes[size],
    variants[variant],
    focusRing,
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(buttonClasses(variant, size), className)}
      {...props}
    >
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
}
