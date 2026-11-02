"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast";
import AuthUtils from "@/lib/auth-utils-secure";
import { Button, cn, focusRing, Input } from "@/components/ui";

// Same sign-in flow as before; only the UI changed.
// shortcut: the pincode is compared in the browser, so clients can read every user's pincode.
// Fix this with the server-side login in docs/restructure-plan.md step 1, not here.
export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (AuthUtils.isAuthenticated()) router.push("/user/dashboard");
    // Start App Check (reCAPTCHA) on page load, as the old form did, so it has a token by submit time.
    import("@/utils/UsersDB");
  }, [router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Dynamic import keeps Firebase out of the page's first download (already loading since mount).
      const [{ UsersDB, USERS_COLLECTION }, { collection, getDocs, limit, query, where }] = await Promise.all([
        import("@/utils/UsersDB"),
        import("firebase/firestore"),
      ]);
      const snap = await getDocs(
        query(collection(UsersDB, USERS_COLLECTION), where("email", "==", email.trim().toLowerCase()), limit(1)),
      );
      // Firestore user documents: fullName, email, roll, pincode, profilePicture.url
      const user = snap.empty ? null : snap.docs[0].data();

      if (!user) return setError("No account found with that email.");
      if (String(user.pincode || "") !== password) return setError("Incorrect password.");

      const stored = AuthUtils.setUserData({
        email: user.email,
        roll: user.roll,
        name: user.fullName,
        profilePictureUrl: user.profilePicture?.url,
        expiry: Date.now() + 24 * 60 * 60 * 1000,
      });
      if (!stored) {
        const { default: FirebaseAuthService } = await import("@/lib/firebase-auth-service");
        await FirebaseAuthService.signOut();
        return setError("Couldn't save your session. Check that cookies and site data are allowed.");
      }

      toast.success("Login successful!");
      router.push("/user/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Email"
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
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          {showPassword ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
        </button>
      </div>

      {error && (
        <p role="alert" className="flex items-center gap-2 rounded-button bg-error/10 px-3 py-2 text-sm text-error motion-safe:animate-pop-in">
          <AlertCircle className="size-4 shrink-0" aria-hidden />
          {error}
        </p>
      )}

      <Button type="submit" loading={loading} className="mt-2 w-full">
        {loading ? "Logging in…" : "Log in"}
      </Button>
    </form>
  );
}
