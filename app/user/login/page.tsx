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
export default async function LoginPage({ searchParams: _searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const session = await getSession();

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
