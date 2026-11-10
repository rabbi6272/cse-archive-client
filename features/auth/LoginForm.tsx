"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Eye, EyeOff } from "lucide";
import { MorphIcon } from "morphicons/react";
import { toast } from "react-hot-toast";
import AuthUtils from "@/lib/auth-utils-secure";
import { Button, cn, focusRing, Input } from "@/components/ui";
import { getViewerAction, loginAction, type LoginState } from "./actions";
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
  const [state, submit, pending] = useActionState<LoginState, FormData>(loginAction, null);
  const [showPassword, setShowPassword] = useState(false);
  const [finishing, setFinishing] = useState(resume);

  // Password sign-in succeeded: store the display copy and leave.
  useEffect(() => {
    if (!state?.ok) return;
    rememberViewer(state.viewer);
    router.replace(state.next);
  }, [state, router]);

  useEffect(() => {
    if (!resume) return;
    getViewerAction().then((viewer) => {
      if (!viewer) return setFinishing(false);
      rememberViewer(viewer);
      router.replace(next.startsWith("/") && !next.startsWith("//") ? next : "/user/dashboard");
    });
  }, [resume, next, router]);

  const errorCode = state && !state.ok ? state.code : params.get("authError");
  const errorText = state && !state.ok ? state.message : AUTH_ERRORS[params.get("authError") ?? ""];

  return (
    <form
      // onSubmit, not action=: React resets action forms after submit, which would clear the email
      // on a wrong password.
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(() => submit(data));
      }}
      className="flex flex-col gap-4"
    >
      <input type="hidden" name="next" value={next} />
      <Input label="Email" name="email" type="email" autoComplete="email" placeholder="student@ruet.ac.bd" required />

      <div className="relative">
        <Input
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          className="pr-12"
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
  );
}
