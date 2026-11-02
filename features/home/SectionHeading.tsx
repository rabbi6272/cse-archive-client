import type { ReactNode } from "react";

// Eyebrow + heading + intro shared by the home page sections.
export function SectionHeading({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center">
      <p className="text-[11px] font-semibold tracking-[0.2em] text-link uppercase sm:text-sm">
        {eyebrow}
      </p>
      <h2 id={id} className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        {title}
      </h2>
      {children && <p className="mt-3 text-ink-soft">{children}</p>}
    </div>
  );
}
