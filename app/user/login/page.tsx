import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "@/features/auth/LoginForm";
import { PROFILE_SITE } from "@/features/auth/links";
import { getSession, googleEnabled } from "@/features/auth/server";

export const metadata: Metadata = {
  title: "Log in",
  robots: { index: false },
};

// Server component; the form is the client island. Sign-in runs in cse-archive-server
// (src/auth/), against the same accounts as the profile site.
export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const [session, google, { next }] = await Promise.all([getSession(), googleEnabled(), searchParams]);

  return (
    <div className="page-container flex min-h-[calc(100dvh-4rem)] items-center justify-center py-12">
      <div className="w-full max-w-md rounded-card border border-hairline bg-canvas p-6 shadow-card motion-safe:animate-dialog-in md:p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Log in</h1>
        <p className="mt-1 mb-6 text-sm text-ink-soft">
          Use the same account as the{" "}
          <a href={PROFILE_SITE} className="font-medium text-link hover:underline">
            RUET CSE 24 profile site
          </a>
          .
        </p>

        {google && (
          <>
            <a
              href={`/api/auth/google/start${next ? `?next=${encodeURIComponent(next)}` : ""}`}
              className="flex h-11 w-full items-center justify-center gap-3 rounded-button border border-hairline-strong text-sm font-medium text-ink transition-colors hover:bg-surface"
            >
              <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A10.5 10.5 0 0 0 12 1 11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
              </svg>
              Continue with Google
            </a>
            <div className="my-5 flex items-center gap-3 text-xs text-steel">
              <span className="h-px flex-1 bg-hairline" />
              or with email
              <span className="h-px flex-1 bg-hairline" />
            </div>
          </>
        )}

        <Suspense>
          <LoginForm resume={session !== null} />
        </Suspense>

        <p className="mt-6 text-center text-sm text-ink-soft">
          Haven&apos;t claimed your old profile?{" "}
          <a href={`${PROFILE_SITE}/profiles/claim`} className="font-medium text-link hover:underline">
            Claim it
          </a>
          . New here?{" "}
          <a href={`${PROFILE_SITE}/profiles/create`} className="font-medium text-link hover:underline">
            Create a profile
          </a>
          .
        </p>
      </div>
    </div>
  );
}
