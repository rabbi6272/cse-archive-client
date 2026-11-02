"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AuthUtils from "@/lib/auth-utils-secure";
import { useNotificationCount } from "@/lib/useNotificationCount";
import { NotificationBadge } from "@/app/components/ui/NotificationBadge";
import { buttonClasses, cn } from "@/components/ui";

// "Login", or "Dashboard" with the unread notification count once signed in.
export function AccountButton({ className }: { className?: string }) {
  const [roll, setRoll] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = () =>
      setRoll(AuthUtils.isAuthenticated() ? (AuthUtils.getUserData()?.roll ?? null) : null);
    checkAuth();
    // Catch a logout in another tab.
    const id = setInterval(checkAuth, 30000);
    return () => clearInterval(id);
  }, []);

  const { unreadCount, isLoading, error } = useNotificationCount(roll, true, true);

  return roll ? (
    <Link href="/user/dashboard" className={cn(buttonClasses("primary"), "relative", className)}>
      Dashboard
      {!isLoading && !error && <NotificationBadge count={unreadCount} />}
    </Link>
  ) : (
    <Link href="/user/login" className={cn(buttonClasses("primary"), className)}>
      Login
    </Link>
  );
}
