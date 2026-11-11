"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Eye, EyeOff } from "lucide";
import { MorphIcon } from "morphicons/react";
import AuthUtils from "@/lib/auth-utils-secure";
import { Button, cn, focusRing, Input } from "@/components/ui";
import { clientLogin, clientGoogleLogin } from "./clientAuth";
import { getViewerAction } from "./actions";
import { PROFILE_SITE } from "./links";
import type { Viewer } from "./server";

const AUTH_ERRORS: Record<string, string> = {
  google: "Google sign-in didn't go through. Please try again.",
  "no-account": "No RUET CSE account uses that Google email. Create one on the profile site first.",
  claim: "Your account needs to be reclaimed with an email link first.",
  "no-profile": "Your account has no profile yet. Create it first.",
};

// Display-only copy for the features that still read localStorage.user (AuthUtils).
// The session itself is the HttpOnly cookie set by the server; this copy grants nothing.
function rememberViewer(v: Viewer) {
  AuthUtils.setUserData({
    email: v.email,
    roll: v.roll,
    name: v.name,
    profilePictureUrl: v.profilePictureUrl,
    expiry: Date.now() + 5 * 24 * 60 * 60 * 1000, // matches the 5-day session cookie
  });
}

// resume: the server already sees a session (Google redirect, or a returning visitor whose
// localStorage copy is gone); finish by fetching the profile instead of asking again.
export function LoginForm({ resume = false }: { resume?: boolean }) {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [errorState, setErrorState] = useState<{ code: string; message: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [finishing, setFinishing] = useState(resume);

  useEffect(() => {
    if (!resume) return;
    getViewerAction().then((viewer) => {
      if (!viewer) return setFinishing(false);
      rememberViewer(viewer);
      router.replace(next.startsWith("/") && !next.startsWith("//") ? next : "/user/dashboard");
    });
  }, [resume, next, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setErrorState(null);

    const result = await clientLogin(email, password, next);
    setPending(false);

    if (result && result.ok) {
      rememberViewer(result.viewer);
      router.replace(result.next);
    } else if (result) {
      setErrorState({ code: result.code, message: result.message });
    }
  }

  async function handleGoogleClick() {
    setPending(true);
    setErrorState(null);
    const result = await clientGoogleLogin(next);
    setPending(false);

    if (result && result.ok) {
      rememberViewer(result.viewer);
      router.replace(result.next);
    } else if (result) {
      setErrorState({ code: result.code, message: result.message });
    }
  }

  const errorCode = errorState ? errorState.code : params.get("authError");
  const errorText = errorState ? errorState.message : AUTH_ERRORS[params.get("authError") ?? ""];

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={handleGoogleClick}
        disabled={pending || finishing}
        className="flex h-11 w-full items-center justify-center gap-3 rounded-button border border-hairline-strong text-sm font-medium text-ink transition-colors hover:bg-surface disabled:opacity-50"
      >
        <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A10.5 10.5 0 0 0 12 1 11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
        </svg>
        Continue with Google
      </button>

      <div className="my-1 flex items-center gap-3 text-xs text-steel">
        <span className="h-px flex-1 bg-hairline" />
        or with email
        <span className="h-px flex-1 bg-hairline" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="student@ruet.ac.bd"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="relative">
          <Input
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            className="pr-12"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className={cn(
              "absolute right-1 bottom-0.5 inline-flex size-10 items-center justify-center rounded-button text-steel hover:text-ink",
              focusRing,
            )}
          >
            <MorphIcon icon={showPassword ? EyeOff : Eye} size={16} reducedMotion="user" />
          </button>
        </div>

        {errorText && (
          <div
            role="alert"
            className="flex flex-col gap-1 rounded-button bg-error/10 px-3 py-2 text-sm text-error motion-safe:animate-pop-in"
          >
            <p className="flex items-center gap-2">
              <AlertCircle className="size-4 shrink-0" aria-hidden />
              {errorText}
            </p>
            {errorCode === "claim" && (
              <a href={`${PROFILE_SITE}/profiles/claim`} className="pl-6 font-medium underline">
                Reclaim my profile
              </a>
            )}
            {(errorCode === "no-profile" || errorCode === "no-account") && (
              <a href={`${PROFILE_SITE}/profiles/create`} className="pl-6 font-medium underline">
                Create my profile
              </a>
            )}
            {(errorCode === "invalid" || errorCode === "throttled") && (
              <a href={`${PROFILE_SITE}/profiles/forgot-password`} className="pl-6 font-medium underline">
                Reset my password
              </a>
            )}
          </div>
        )}

        <Button type="submit" loading={pending || finishing} className="mt-2 w-full">
          {finishing ? "Finishing sign-in…" : pending ? "Logging in…" : "Log in"}
        </Button>
        <Link
          href={`${PROFILE_SITE}/profiles/forgot-password`}
          className="self-center text-sm text-link hover:underline"
        >
          Forgot password?
        </Link>
      </form>
    </div>
  );
}
