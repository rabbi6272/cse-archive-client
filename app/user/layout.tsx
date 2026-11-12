import type { ReactNode } from "react";
import { AuthProvider } from "@/app/components/providers/AuthProvider";
import { getSession } from "@/features/auth/server";

// /user/* reads the server-verified session once per request and hands it to the client tree.
export default async function UserLayout({ children }: { children: ReactNode }) {
  const viewer = await getSession();
  return <AuthProvider initialViewer={viewer}>{children}</AuthProvider>;
}
