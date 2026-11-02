"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import AuthUtils from "@/lib/auth-utils-secure";
import { cn, focusRing } from "@/components/ui";
import { incrementLikes } from "./mutations";

// One like per browser (remembered in localStorage, as before). Needs a signed-in user.
export function LikeButton({
  snippetId,
  rollNumber,
  initialCount,
}: {
  snippetId: string;
  rollNumber: string;
  initialCount: number;
}) {
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [popKey, setPopKey] = useState(0);
  const storageKey = `liked_${snippetId}`;

  useEffect(() => {
    try {
      setLiked(localStorage.getItem(storageKey) === "true");
    } catch {}
  }, [storageKey]);

  async function like() {
    if (!AuthUtils.isAuthenticated()) {
      router.push("/user/login");
      return;
    }
    if (liked) return;

    setLiked(true);
    setCount((c) => c + 1);
    setPopKey((k) => k + 1);
    try {
      localStorage.setItem(storageKey, "true");
      await incrementLikes(rollNumber, snippetId);
    } catch (err) {
      console.error("Like failed:", err);
      setLiked(false);
      setCount((c) => c - 1);
      try {
        localStorage.removeItem(storageKey);
      } catch {}
    }
  }

  return (
    <button
      type="button"
      onClick={like}
      aria-pressed={liked}
      aria-label={liked ? `Liked, ${count} likes` : `Like, ${count} likes`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-button px-2 py-1 text-sm font-medium transition-colors",
        liked ? "text-error" : "text-steel hover:text-error",
        focusRing,
      )}
    >
      <Heart
        key={popKey}
        className={cn("size-4", liked && "fill-current", popKey > 0 && "motion-safe:animate-like-pop")}
        aria-hidden
      />
      <span className="tabular-nums">{count}</span>
    </button>
  );
}
