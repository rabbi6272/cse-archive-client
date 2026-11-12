// Role hierarchy mirrored from cse-archive-server: student < admin < super_admin.
// UI checks here are for display only; the server enforces every role gate.

export type Role = "student" | "admin" | "super_admin";

const ROLE_RANK: Record<Role, number> = { student: 0, admin: 1, super_admin: 2 };

export function hasRole(viewer: { role?: Role } | null | undefined, min: Role): boolean {
  const role = viewer?.role;
  return Boolean(role && role in ROLE_RANK && ROLE_RANK[role] >= ROLE_RANK[min]);
}

export const isAdmin = (viewer: { role?: Role } | null | undefined) => hasRole(viewer, "admin");
export const isSuperAdmin = (viewer: { role?: Role } | null | undefined) => hasRole(viewer, "super_admin");
