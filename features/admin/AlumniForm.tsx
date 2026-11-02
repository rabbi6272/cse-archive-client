"use client";

import { startTransition, useActionState, useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, UserPlus } from "lucide-react";
import { Button, cn, Input, Select, Textarea } from "@/components/ui";
import { badgeLabels } from "@/features/alumni/data";
import { addAlumnus } from "./actions";
import { DEPARTMENTS } from "./alumni";

// Validated again on the server (addAlumnus); the browser checks are only for convenience.
export function AlumniForm() {
  const [state, submit, pending] = useActionState(addAlumnus, null);
  const [formKey, setFormKey] = useState(0);

  // Clear the fields after a successful add.
  useEffect(() => {
    if (state?.ok) setFormKey((k) => k + 1);
  }, [state]);

  return (
    <form
      key={formKey}
      // onSubmit, not action=: React resets action forms after every submit, which would wipe the
      // fields on a validation error. They're cleared only after a successful add (formKey above).
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(() => submit(data));
      }}
      className="flex flex-col gap-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="Full name" name="name" required />
        <Select label="Department" name="dept" defaultValue="CSE">
          {DEPARTMENTS.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </Select>
        <Input label="Series" name="series" placeholder="e.g. 2019" required />
        <Input label="LinkedIn URL" name="linkedinurl" type="url" placeholder="https://www.linkedin.com/in/…" />
        <Input label="Address" name="address" placeholder="City, State/Province" required />
        <Input label="Country" name="country" required />
        <Input label="Longitude" name="longitude" type="number" step="any" placeholder="e.g. -74.0060" required />
        <Input
          label="Latitude"
          name="latitude"
          type="number"
          step="any"
          placeholder="e.g. 40.7128"
          hint="Right-click a place in Google Maps to copy its coordinates."
          required
        />
      </div>

      <fieldset>
        <legend className="mb-1.5 text-sm font-medium text-ink">Badges</legend>
        <div className="flex flex-wrap gap-2">
          {Object.entries(badgeLabels).map(([key, label]) => (
            <label key={key} className="cursor-pointer">
              <input type="checkbox" name="badges" value={key} className="peer sr-only" />
              <span
                className={cn(
                  "inline-flex h-9 items-center rounded-full border border-hairline px-4 text-sm font-medium text-steel transition-colors hover:text-ink",
                  "peer-checked:border-ink peer-checked:bg-ink peer-checked:text-canvas",
                  "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary",
                )}
              >
                {label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <Textarea label="Details" name="optional" rows={3} placeholder="Current position, company, achievements…" />

      {state?.message && (
        <p
          role={state.ok ? "status" : "alert"}
          className={cn(
            "flex items-center gap-2 rounded-button px-3 py-2 text-sm motion-safe:animate-pop-in",
            state.ok ? "bg-success/10 text-success" : "bg-error/10 text-error",
          )}
        >
          {state.ok ? (
            <CheckCircle2 className="size-4 shrink-0" aria-hidden />
          ) : (
            <AlertCircle className="size-4 shrink-0" aria-hidden />
          )}
          {state.message}
        </p>
      )}

      <Button type="submit" loading={pending} className="self-end">
        <UserPlus className="size-4" aria-hidden />
        Add alumnus
      </Button>
    </form>
  );
}
