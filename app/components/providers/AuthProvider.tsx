"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import AuthUtils from "@/lib/auth-utils-secure";
import FirebaseAuthService from "@/lib/firebase-auth-service";
import { getViewerAction, logoutAction } from "@/features/auth/actions";
import type { Viewer } from "@/features/auth/server";
import { hasRole, type Role } from "@/features/auth/roles";

// Server-driven auth state. The source of truth is the HttpOnly __session cookie, verified by
// cse-archive-server; the viewer comes from the server (initialViewer from a server component, or
// getViewerAction()). There is no Firebase Auth listener in the browser.

export interface AuthUser {
  email?: string;
  roll?: string;
  name?: string;
  profilePictureUrl?: string;
  [key: string]: unknown;
}

export interface AuthContextType {
  viewer: Viewer | null;
  /** Display copy kept for older code that still reads localStorage.user (AuthUtils). */
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasRole: (min: Role) => boolean;
  signOut: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function rememberViewer(v: Viewer) {
  AuthUtils.setUserData({
    email: v.email,
    roll: v.roll,
    name: v.name,
    profilePictureUrl: v.profilePictureUrl,
    expiry: Date.now() + 5 * 24 * 60 * 60 * 1000, // matches the 5-day session cookie
  });
}

export function AuthProvider({
  initialViewer,
  children,
}: {
  /** Pass `await getSession()` from a server layout to skip the client round-trip. */
  initialViewer?: Viewer | null;
  children: ReactNode;
}) {
  const [viewer, setViewer] = useState<Viewer | null>(initialViewer ?? null);
  const [isLoading, setIsLoading] = useState(initialViewer === undefined);

  const refreshAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      const v = await getViewerAction();
      setViewer(v);
      if (v) rememberViewer(v);
      else AuthUtils.logout();
    } catch (error) {
      console.error("[auth] refresh failed:", error);
      setViewer(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialViewer === undefined) {
      void refreshAuth();
    } else if (initialViewer) {
      rememberViewer(initialViewer);
    }
  }, [initialViewer, refreshAuth]);

  const signOut = useCallback(async () => {
    try {
      await logoutAction();
      await FirebaseAuthService.signOut(); // anonymous data-access auth, not user login
    } catch (error) {
      console.error("[auth] sign out error:", error);
    } finally {
      AuthUtils.logout();
      setViewer(null);
    }
  }, []);

  const value: AuthContextType = {
    viewer,
    user: viewer
      ? { email: viewer.email, roll: viewer.roll, name: viewer.name, profilePictureUrl: viewer.profilePictureUrl }
      : null,
    isAuthenticated: viewer !== null,
    isLoading,
    hasRole: (min) => hasRole(viewer, min),
    signOut,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
