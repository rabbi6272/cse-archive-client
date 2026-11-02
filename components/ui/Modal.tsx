"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn, focusRing } from "./cn";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

// Native <dialog>: the browser handles focus trapping, Esc, inert background and returning focus.
export function Modal({ open, onClose, title, children, footer, className }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      // Esc fires "cancel"; let the parent own the open state instead of the browser.
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      // A click on the dialog element itself (not its content) is a click on the backdrop.
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className={cn(
        "m-auto w-[calc(100%-2rem)] max-w-lg rounded-card border border-hairline bg-canvas p-0 text-ink shadow-modal",
        "backdrop:bg-black/50",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4 border-b border-hairline px-6 py-4">
        <h2 id={titleId} className="text-lg font-semibold">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className={cn("-m-1.5 rounded-button p-1.5 text-steel hover:bg-surface hover:text-ink", focusRing)}
        >
          <X className="size-5" aria-hidden />
        </button>
      </div>
      <div className="px-6 py-5">{children}</div>
      {footer && (
        <div className="flex justify-end gap-2 border-t border-hairline px-6 py-4">{footer}</div>
      )}
    </dialog>
  );
}
