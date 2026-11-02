import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/features/auth/LoginForm";

export const metadata: Metadata = {
  title: "Log in",
  robots: { index: false },
};

// Server component; only the form is client code.
export default function LoginPage() {
  return (
    <div className="page-container flex min-h-[calc(100dvh-4rem)] items-center justify-center py-12">
      <div className="w-full max-w-md rounded-card border border-hairline bg-canvas p-6 shadow-card motion-safe:animate-dialog-in md:p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Log in</h1>
        <p className="mt-1 mb-6 text-sm text-ink-soft">Use your RUET CSE Archive account.</p>
        <LoginForm />
        <p className="mt-6 text-center text-sm text-ink-soft">
          Don&apos;t have an account?{" "}
          <Link
            href="https://students.ruetcsearchive.app/profiles/create"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-link hover:underline"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
