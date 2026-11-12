import Link from "next/link";
import { Button } from "@/components/ui";

// Shown on /admin when the visitor isn't an admin. Admin access comes from the account's role,
// granted manually in the database, so there is no separate admin password.
export function AdminLoginForm({ signedIn }: { signedIn: boolean }) {
  return (
    <div className="flex flex-col gap-4 rounded-card border border-hairline bg-canvas p-6 motion-safe:animate-dialog-in">
      {signedIn ? (
        <p className="text-sm text-ink-soft">
          Your account doesn&apos;t have admin access. Ask a super admin to grant it.
        </p>
      ) : (
        <>
          <p className="text-sm text-ink-soft">Log in with an admin account to continue.</p>
          <Link href="/user/login?next=/admin" className="self-end">
            <Button type="button">Log in</Button>
          </Link>
        </>
      )}
    </div>
  );
}
