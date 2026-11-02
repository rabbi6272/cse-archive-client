import Link from "next/link";
import { buttonClasses } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="page-container flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center gap-4 py-16 text-center">
      <p className="font-mono text-sm font-semibold text-link">404</p>
      <h1 className="text-4xl font-semibold tracking-tight text-ink md:text-5xl">Page not found</h1>
      <p className="max-w-md text-ink-soft">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        <Link href="/" className={buttonClasses("primary")}>
          Go home
        </Link>
        <Link href="/resources" className={buttonClasses("secondary")}>
          Browse resources
        </Link>
      </div>
    </div>
  );
}
