"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { ExternalLink, X } from "lucide-react";
import { buttonClasses, cn, focusRing } from "@/components/ui";
import type { DriveFile } from "./api";

// The open preview lives in ?preview=<id>. Next.js syncs history.pushState with
// useSearchParams, so opening it needs no server round trip, the phone's Back
// button closes it, and the URL can be shared.
let openedByPush = false;

function setPreviewParam(fileId: string | null) {
  const url = new URL(window.location.href);
  if (fileId) {
    url.searchParams.set("preview", fileId);
    window.history.pushState(null, "", url);
    openedByPush = true;
  } else if (openedByPush) {
    openedByPush = false;
    window.history.back();
  } else {
    url.searchParams.delete("preview");
    window.history.replaceState(null, "", url);
  }
}

export function PreviewButton({
  fileId,
  className,
  children,
}: {
  fileId: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <button type="button" onClick={() => setPreviewParam(fileId)} className={className}>
      {children}
    </button>
  );
}

// Full-size Google Drive preview on a native <dialog>: Esc closes it and focus is trapped
// without manual listeners (page scroll is locked by the dialog rule in globals.css).
export function FilePreview({ files }: { files: Pick<DriveFile, "id" | "name" | "webViewLink">[] }) {
  const ref = useRef<HTMLDialogElement>(null);
  const previewId = useSearchParams().get("preview");
  const file = files.find((f) => f.id === previewId) ?? null;
  const close = () => setPreviewParam(null);

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
        close();
      }}
      onClick={(e) => e.target === e.currentTarget && close()}
      // Full screen: easier to read documents than a centred box.
      className="m-0 h-dvh max-h-none w-dvw max-w-none overflow-hidden bg-canvas p-0 text-ink backdrop:bg-black/60 motion-safe:animate-dialog-in"
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
              onClick={close}
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
