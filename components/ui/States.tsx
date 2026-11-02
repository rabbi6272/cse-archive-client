import type { HTMLAttributes, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { cn } from "./cn";
import { Button } from "./Button";

// Placeholder block while content loads. Size it with className (e.g. "h-4 w-32").
export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden
      className={cn("animate-skeleton rounded-button bg-surface motion-reduce:animate-none", className)}
      {...props}
    />
  );
}

type StateProps = {
  title: ReactNode;
  description?: ReactNode;
  className?: string;
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: StateProps & { icon?: ReactNode; action?: ReactNode }) {
  return (
    <div className={cn("flex flex-col items-center gap-3 px-6 py-12 text-center", className)}>
      {icon && <div className="text-ink-faint [&_svg]:size-10">{icon}</div>}
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      {description && <p className="max-w-sm text-sm text-ink-soft">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description,
  onRetry,
  className,
}: Partial<StateProps> & { onRetry?: () => void }) {
  return (
    <div
      role="alert"
      className={cn("flex flex-col items-center gap-3 px-6 py-12 text-center", className)}
    >
      <AlertTriangle className="size-10 text-error" aria-hidden />
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      {description && <p className="max-w-sm text-sm text-ink-soft">{description}</p>}
      {onRetry && (
        <Button variant="secondary" onClick={onRetry} className="mt-2">
          Try again
        </Button>
      )}
    </div>
  );
}
