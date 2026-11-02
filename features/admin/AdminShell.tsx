import type { ReactNode } from "react";
import { Badge, cn } from "@/components/ui";

// Shared frame for admin pages: title, optional description and header actions.
export function AdminShell({
  title,
  description,
  actions,
  narrow,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  narrow?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="page-container py-8 md:py-12">
      <div className={cn("mx-auto flex flex-col gap-6", narrow ? "max-w-md" : "max-w-6xl")}>
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Badge tone="lavender" className="mb-2">
              Admin
            </Badge>
            <h1 className="text-3xl font-semibold tracking-tight text-ink">{title}</h1>
            {description && <p className="mt-1 text-ink-soft">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </header>
        {children}
      </div>
    </div>
  );
}
