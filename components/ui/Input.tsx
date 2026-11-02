"use client";

import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { Search } from "lucide-react";
import { cn } from "./cn";

const fieldClasses = cn(
  "block w-full rounded-button border bg-canvas px-4 text-base text-ink placeholder:text-ink-faint transition-colors",
  "border-hairline-strong focus:border-primary focus:outline-2 focus:-outline-offset-1 focus:outline-primary",
  "aria-invalid:border-error aria-invalid:focus:outline-error",
  "disabled:cursor-not-allowed disabled:bg-surface disabled:text-ink-faint",
);

type FieldProps = {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
};

// Wires label, hint and error to the control by id, so screen readers announce them.
function Field({
  id,
  label,
  hint,
  error,
  children,
}: FieldProps & { id: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
        </label>
      )}
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-[13px] text-error">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="text-[13px] text-steel">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

function describedBy(id: string, { hint, error }: FieldProps) {
  return error ? `${id}-error` : hint ? `${id}-hint` : undefined;
}

export function Input({
  label,
  hint,
  error,
  id,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & FieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <Field id={inputId} label={label} hint={hint} error={error}>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(inputId, { hint, error })}
        className={cn(fieldClasses, "h-11", className)}
        {...props}
      />
    </Field>
  );
}

export function Textarea({
  label,
  hint,
  error,
  id,
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & FieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <Field id={inputId} label={label} hint={hint} error={error}>
      <textarea
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(inputId, { hint, error })}
        className={cn(fieldClasses, "min-h-28 py-3", className)}
        {...props}
      />
    </Field>
  );
}

export function Select({
  label,
  hint,
  error,
  id,
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & FieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <Field id={inputId} label={label} hint={hint} error={error}>
      <select
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(inputId, { hint, error })}
        className={cn(fieldClasses, "h-11 cursor-pointer pr-8", className)}
        {...props}
      >
        {children}
      </select>
    </Field>
  );
}

export function SearchInput({
  className,
  "aria-label": ariaLabel = "Search",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={cn("relative", className)}>
      <Search
        // Fixed offset, not top-1/2: (44px input - 16px icon) / 2. Stays centred if the wrapper is stretched by a grid/flex parent.
        className="pointer-events-none absolute top-3.5 left-3.5 size-4 text-steel"
        aria-hidden
      />
      <input
        type="search"
        aria-label={ariaLabel}
        className={cn(fieldClasses, "h-11 border-hairline bg-surface pl-10")}
        {...props}
      />
    </div>
  );
}
