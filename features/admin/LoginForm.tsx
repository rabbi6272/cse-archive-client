"use client";

import { useActionState } from "react";
import { Button, Input } from "@/components/ui";
import { login } from "./actions";

export function AdminLoginForm() {
  const [state, action, pending] = useActionState(login, null);
  return (
    <form
      action={action}
      className="flex flex-col gap-4 rounded-card border border-hairline bg-canvas p-6 motion-safe:animate-dialog-in"
    >
      <Input
        label="Admin password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        autoFocus
        error={state?.ok === false ? state.message : undefined}
      />
      <Button type="submit" loading={pending} className="self-end">
        Log in
      </Button>
      <p className="text-xs text-steel">Checked on the server. Your session lasts 8 hours.</p>
    </form>
  );
}
