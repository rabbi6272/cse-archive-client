"use client";

import { useActionState, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button, cn, Modal } from "@/components/ui";
import { driveAction } from "./actions";

const ACTIONS = [
  { action: "setup", label: "Set up watch & page token" },
  { action: "revalidate", label: "Revalidate cache", variant: "secondary" },
  { action: "renew", label: "Renew watch", variant: "secondary" },
] as const;

// Buttons submit to the driveAction Server Action; "Delete cache" asks first.
export function DriveControls() {
  const [state, submit, pending] = useActionState(driveAction, null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const deleteRef = useRef<HTMLButtonElement>(null);

  return (
    <form ref={formRef} action={submit} className="flex flex-col gap-2">
      {ACTIONS.map((a) => (
        <Button
          key={a.action}
          type="submit"
          name="action"
          value={a.action}
          variant={"variant" in a ? a.variant : "primary"}
          disabled={pending}
          className="w-full"
        >
          {a.label}
        </Button>
      ))}
      <Button variant="danger" disabled={pending} className="w-full" onClick={() => setConfirmDelete(true)}>
        Delete cache
      </Button>
      {/* The confirm dialog submits through this hidden button so the form carries action=delete. */}
      <button ref={deleteRef} type="submit" name="action" value="delete" hidden />

      <label className="mt-2 flex items-center justify-between gap-3 text-sm text-ink-soft">
        Re-warm root folder on revalidate
        <input type="checkbox" name="warm" defaultChecked className="size-4 accent-primary" />
      </label>
      <label className="flex items-center justify-between gap-3 text-sm text-ink-soft">
        Clear metadata on delete
        <input type="checkbox" name="clearMeta" className="size-4 accent-primary" />
      </label>

      <Button type="submit" name="action" value="status" variant="ghost" size="sm" disabled={pending} className="mt-1 self-end">
        <RefreshCw className={cn("size-4", pending && "animate-spin")} aria-hidden />
        Refresh status
      </Button>

      {state?.message && (
        <p
          role={state.ok ? "status" : "alert"}
          className={cn(
            "rounded-button px-3 py-2 text-sm motion-safe:animate-pop-in",
            state.ok ? "bg-success/10 text-success" : "bg-error/10 text-error",
          )}
        >
          {state.message}
        </p>
      )}

      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Delete all Drive caches?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setConfirmDelete(false);
                formRef.current?.requestSubmit(deleteRef.current);
              }}
            >
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-ink-soft">
          This invalidates every cached Drive folder. If &ldquo;Clear metadata on delete&rdquo; is ticked, it also
          permanently clears the watch and page-token metadata.
        </p>
      </Modal>
    </form>
  );
}
