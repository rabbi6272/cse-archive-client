"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { getDatabase, off, onValue, ref } from "firebase/database";
import { AtSign, Bell, BellOff, Lock, MessageSquare, Reply, type LucideIcon } from "lucide-react";
// Side effect: initializes the default Firebase app that getDatabase() below uses.
import "@/lib/firebase";
import { getStudentName } from "@/lib/students-loader";
import { buttonClasses, cn, EmptyState, Skeleton } from "@/components/ui";

type Notification = {
  id: string;
  type?: string;
  read?: boolean;
  createdAt?: string;
  message?: string;
  commentText?: string;
  snippetTitle?: string;
  snippetAuthor?: string;
  fromUserName?: string;
  fromUserRoll?: string;
};

const types: Record<string, { icon: LucideIcon; className: string }> = {
  comment: { icon: MessageSquare, className: "bg-tint-mint" },
  reply: { icon: Reply, className: "bg-tint-sky" },
  mention: { icon: AtSign, className: "bg-tint-lavender" },
};

function timeAgo(date?: string) {
  try {
    return formatDistanceToNow(new Date(date ?? ""), { addSuffix: true });
  } catch {
    return "some time ago";
  }
}

function headline(n: Notification) {
  const from = n.fromUserName || getStudentName(n.fromUserRoll ?? "");
  const title = n.snippetTitle || "Untitled code";
  const author = n.snippetAuthor ? getStudentName(n.snippetAuthor) : "someone";
  switch (n.type) {
    case "comment":
      return `${from} commented on your code "${title}"`;
    case "reply":
      return `${from} replied to your comment on ${author}'s code "${title}"`;
    case "mention":
      return `${from} mentioned you in ${author}'s code "${title}"`;
    default:
      return n.message || "New notification";
  }
}

// Live list from Realtime DB notifications/<roll>; the signed-in user comes from localStorage.
export function NotificationList() {
  const [roll, setRoll] = useState<string | null | undefined>(undefined); // undefined = not checked yet
  const [items, setItems] = useState<Notification[] | null>(null);

  useEffect(() => {
    try {
      setRoll(JSON.parse(localStorage.getItem("user") ?? "null")?.roll ?? null);
    } catch {
      setRoll(null);
    }
  }, []);

  useEffect(() => {
    if (!roll) return;
    const notificationsRef = ref(getDatabase(), `notifications/${roll}`);
    const listener = onValue(notificationsRef, (snap) => {
      const data = (snap.val() ?? {}) as Record<string, Omit<Notification, "id">>;
      setItems(
        Object.entries(data)
          .map(([id, n]) => ({ id, ...n }))
          .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()),
      );
    }, (err) => {
      // e.g. permission denied: show the empty state instead of loading forever
      console.error("Notifications listener error:", err);
      setItems([]);
    });
    return () => off(notificationsRef, "value", listener);
  }, [roll]);

  if (roll === null) {
    return (
      <EmptyState
        icon={<Lock />}
        title="Log in to see your notifications"
        action={
          <Link href="/user/login" className={buttonClasses("primary")}>
            Log in
          </Link>
        }
      />
    );
  }

  if (roll === undefined || items === null) {
    return (
      <ul aria-busy="true" aria-label="Loading notifications">
        {[0, 1, 2].map((i) => (
          <li key={i} className="flex gap-3 border-b border-hairline p-5 last:border-b-0">
            <Skeleton className="size-10 shrink-0 rounded-full" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-24" />
            </div>
          </li>
        ))}
      </ul>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<BellOff />}
        title="You're all caught up"
        description="Comments, replies and mentions on your code will show up here."
      />
    );
  }

  return (
    <>
      <p className="border-b border-hairline px-5 py-3 text-sm text-steel">
        {getStudentName(roll)} ({roll}) · {items.length} notifications · updates live
      </p>
      <ul>
        {items.map((n) => {
          const { icon: Icon, className } = types[n.type ?? ""] ?? { icon: Bell, className: "bg-surface" };
          return (
            <li
              key={n.id}
              className={cn(
                "flex gap-3 border-b border-hairline p-5 last:border-b-0 motion-safe:animate-pop-in",
                !n.read && "bg-tint-sky/40",
              )}
            >
              <span
                className={cn("flex size-10 shrink-0 items-center justify-center rounded-full text-charcoal", className)}
              >
                <Icon className="size-4" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-ink">{headline(n)}</p>
                {n.commentText && (
                  <blockquote className="mt-2 rounded-button bg-surface px-3 py-2 text-sm text-ink-soft">
                    “{n.commentText}”
                  </blockquote>
                )}
                <p className="mt-2 flex items-center gap-2 text-[13px] text-steel">
                  <time dateTime={n.createdAt}>{timeAgo(n.createdAt)}</time>
                  {!n.read && (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-white">New</span>
                  )}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
