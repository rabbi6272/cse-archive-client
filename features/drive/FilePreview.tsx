"use client";

import { useEffect, useRef } from "react";
import { ExternalLink, X } from "lucide-react";
import { buttonClasses, cn, focusRing } from "@/components/ui";
import type { DriveFile } from "./api";

// Full-size Google Drive preview on a native <dialog>: Esc closes it and focus is trapped
// without manual listeners (page scroll is locked by the dialog rule in globals.css).
export function FilePreview({ file, onClose }: { file: DriveFile | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (file && !dialog.open) dialog.showModal();
    if (!file && dialog.open) dialog.close();
  }, [file]);

  return (
    <dialog
      ref={ref}
      aria-label={file ? `Preview: ${file.name}` : "Preview"}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="m-auto h-[92dvh] max-h-none w-[min(72rem,calc(100%-1rem))] max-w-none overflow-hidden rounded-card border border-hairline bg-canvas p-0 text-ink shadow-modal backdrop:bg-black/60"
    >
      {file && (
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-2 border-b border-hairline px-4 py-2">
            <h2 className="min-w-0 flex-1 truncate text-sm font-semibold">{file.name}</h2>
            {file.webViewLink && (
              <a
                href={file.webViewLink}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses("ghost", "sm")}
              >
                <ExternalLink className="size-4" aria-hidden />
                <span className="hidden sm:inline">Open in Drive</span>
              </a>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close preview"
              className={cn(
                "inline-flex size-9 items-center justify-center rounded-button text-steel hover:bg-surface hover:text-ink",
                focusRing,
              )}
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>
          <iframe
            src={`https://drive.google.com/file/d/${file.id}/preview`}
            title={file.name}
            allow="autoplay"
            className="w-full flex-1"
          />
        </div>
      )}
    </dialog>
  );
}
