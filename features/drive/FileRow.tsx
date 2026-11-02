import Link from "next/link";
import {
  ChevronRight,
  Download,
  File,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileVideo,
  Folder,
  Presentation,
  type LucideIcon,
} from "lucide-react";
import { cn, focusRing } from "@/components/ui";
import { isFolder, type DriveFile } from "./api";

function fileIcon(mimeType: string): { icon: LucideIcon; className: string } {
  if (mimeType.includes("folder")) return { icon: Folder, className: "text-link" };
  if (mimeType.includes("pdf")) return { icon: FileText, className: "text-error" };
  if (mimeType.includes("spreadsheetml")) return { icon: FileSpreadsheet, className: "text-success" };
  if (mimeType.includes("presentationml")) return { icon: Presentation, className: "text-warning" };
  if (mimeType.includes("documentml")) return { icon: FileText, className: "text-link" };
  if (mimeType.startsWith("image/")) return { icon: FileImage, className: "text-ink-soft" };
  if (mimeType.startsWith("video/")) return { icon: FileVideo, className: "text-ink-soft" };
  return { icon: File, className: "text-ink-soft" };
}

const sizeFormat = new Intl.NumberFormat("en", { maximumFractionDigits: 1 });
function formatSize(bytes?: string) {
  const n = Number(bytes);
  if (!bytes || !Number.isFinite(n)) return null;
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(Math.floor(Math.log(Math.max(n, 1)) / Math.log(1024)), units.length - 1);
  return `${sizeFormat.format(n / 1024 ** i)} ${units[i]}`;
}

const dateFormat = new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" });

// One row: folders link to their own /drive/<id> URL, files open the preview.
export function FileRow({ file, onPreview }: { file: DriveFile; onPreview: (file: DriveFile) => void }) {
  const folder = isFolder(file);
  const { icon: Icon, className: iconClass } = fileIcon(file.mimeType);
  const meta = [
    formatSize(file.size),
    file.modifiedTime && dateFormat.format(new Date(file.modifiedTime)),
  ].filter(Boolean);

  const body = (
    <>
      <Icon className={cn("size-5 shrink-0", iconClass)} aria-hidden />
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium text-ink">{file.name}</span>
        {meta.length > 0 && (
          <span className="block text-[13px] text-steel">{meta.join(" · ")}</span>
        )}
      </span>
      {folder && <ChevronRight className="size-4 shrink-0 text-steel" aria-hidden />}
    </>
  );
  const mainClasses = cn(
    "flex min-w-0 flex-1 items-center gap-3 rounded-button px-3 py-3 text-left hover:bg-surface",
    focusRing,
  );

  return (
    <li className="flex items-center gap-1 border-b border-hairline px-1 last:border-b-0 md:px-2">
      {folder ? (
        <Link href={`/drive/${file.id}`} className={mainClasses}>
          {body}
        </Link>
      ) : (
        <button type="button" onClick={() => onPreview(file)} className={mainClasses}>
          {body}
        </button>
      )}
      {file.webContentLink && (
        <a
          href={file.webContentLink}
          aria-label={`Download ${file.name}`}
          title="Download"
          className={cn(
            "inline-flex size-10 shrink-0 items-center justify-center rounded-button text-steel hover:bg-surface hover:text-ink",
            focusRing,
          )}
        >
          <Download className="size-4" aria-hidden />
        </a>
      )}
    </li>
  );
}
