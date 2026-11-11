"use client";

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  type Auth,
} from "firebase/auth";
import { establishSessionFromIdTokenAction, logoutAction, type LoginState } from "./actions";

// Unified Firebase project for RUET CSE student accounts
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCxod-eup82Oy_Od04YLHs7iOQdFGBmEHU",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "ruet-cse-24.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "ruet-cse-24",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:45659772253:web:963ee9de7794ee482d84b4",
};

function getAuthApp(): FirebaseApp {
  const name = "ruet-cse-auth";
  const existing = getApps().find((a) => a.name === name);
  return existing ?? initializeApp(firebaseConfig, name);
}

let authInstance: Auth | null = null;
export function getClientAuth(): Auth {
  if (!authInstance && typeof window !== "undefined") {
    authInstance = getAuth(getAuthApp());
  }
  return authInstance!;
}

const googleProvider = new GoogleAuthProvider();

/**
 * Client-side Firebase sign-in with email & password.
 * Authenticates directly with Firebase on the client, then establishes session with the server.
 */
export async function clientLogin(
  email: string,
  pass: string,
  next?: string,
): Promise<LoginState> {
  const auth = getClientAuth();
  try {
    const cred = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), pass);
    const idToken = await cred.user.getIdToken();
    return establishSessionFromIdTokenAction(idToken, next);
  } catch (err: any) {
    console.error("[clientAuth] Firebase login failed:", err);
    const code = err?.code || "";
    let message = "Incorrect email or password.";
    if (code === "auth/too-many-requests") {
      message = "Too many attempts. Wait a few minutes or reset your password.";
    }
    return { ok: false, code: "invalid", message };
  }
}

/**
 * Client-side "Continue with Google" popup sign-in.
 */
export async function clientGoogleLogin(next?: string): Promise<LoginState> {
  const auth = getClientAuth();
  try {
    const cred = await signInWithPopup(auth, googleProvider);
    const idToken = await cred.user.getIdToken();
    return establishSessionFromIdTokenAction(idToken, next);
  } catch (err: any) {
    console.error("[clientAuth] Google popup failed:", err);
    return {
      ok: false,
      code: "google",
      message: "Google sign-in didn't go through. Please try again.",
    };
  }
}

/**
 * Client-side sign out from Firebase and server session.
 */
export async function clientLogout(): Promise<void> {
  const auth = getClientAuth();
  try {
    if (auth) await firebaseSignOut(auth).catch(() => {});
    await logoutAction();
  } catch (err) {
    console.error("[clientAuth] Logout failed:", err);
  }
}
