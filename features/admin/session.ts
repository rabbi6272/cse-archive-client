import "server-only";
import { getSession, type Viewer } from "@/features/auth/server";
import { hasRole, type Role } from "@/features/auth/roles";

// Admin access is role-based: the signed-in account's role (student < admin < super_admin) comes
// from cse-archive-server, which reads it from MongoDB on every session check. Roles are granted
// manually in the database. The old shared ADMIN_SECRET password login is gone; ADMIN_SECRET is
// now only the server-to-server credential for the Drive admin API (features/admin/data.ts).

export async function currentAdmin(min: Role = "admin"): Promise<Viewer | null> {
  const viewer = await getSession();
  return viewer && hasRole(viewer, min) ? viewer : null;
}

export async function isAdmin(min: Role = "admin"): Promise<boolean> {
  return (await currentAdmin(min)) !== null;
}

// Every admin Server Action calls this first: actions are public endpoints, whatever page shows them.
export async function requireAdmin(min: Role = "admin"): Promise<Viewer> {
  const viewer = await currentAdmin(min);
  if (!viewer) throw new Error("Not authorized");
  return viewer;
}
