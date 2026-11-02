import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FolderOpen } from "lucide-react";
import { buttonClasses, EmptyState } from "@/components/ui";
import { getDriveFolder, isFolder } from "@/features/drive/api";
import { FilePreview } from "@/features/drive/FilePreview";
import { FileRow } from "@/features/drive/FileRow";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const data = await getDriveFolder(id).catch(() => null);
  const name = data?.currentFolder?.name ?? "Drive";
  return {
    title: name,
    description: `Lecture notes, slides, question papers and other files in ${name}.`,
  };
}

// Server component: the folder is fetched and rendered on the server. Errors go to ./error.tsx,
// the wait shows ./loading.tsx, and only the preview dialog runs on the client.
export default async function DrivePage({ params }: Props) {
  const { id } = await params;
  const data = await getDriveFolder(id);

  // Folders first, then files, each in the API's order.
  const files = [...data.files.filter(isFolder), ...data.files.filter((f) => !isFolder(f))];
  const folderCount = files.filter(isFolder).length;
  const fileCount = files.length - folderCount;

  return (
    <div className="page-container py-8 md:py-12">
      <div className="mx-auto max-w-4xl">
        {data.parentFolderId && (
          <Link href={`/drive/${data.parentFolderId}`} className={buttonClasses("ghost", "sm")}>
            <ArrowLeft className="size-4" aria-hidden />
            Back
          </Link>
        )}

        <header className="mt-3 mb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-ink md:text-4xl">
            {data.currentFolder?.name ?? "Drive Files"}
          </h1>
          {files.length > 0 && (
            <p className="mt-2 text-sm text-steel">
              {folderCount} {folderCount === 1 ? "folder" : "folders"} · {fileCount}{" "}
              {fileCount === 1 ? "file" : "files"}
            </p>
          )}
        </header>

        <div className="rounded-card border border-hairline bg-canvas motion-safe:animate-pop-in">
          {files.length === 0 ? (
            <EmptyState
              icon={<FolderOpen />}
              title="This folder is empty"
              description="Nothing has been uploaded here yet."
            />
          ) : (
            <ul>
              {files.map((file) => (
                <FileRow key={file.id} file={file} />
              ))}
            </ul>
          )}
        </div>

        <Suspense fallback={null}>
          <FilePreview
          files={files
            .filter((f) => !isFolder(f))
            .map(({ id, name, webViewLink }) => ({ id, name, webViewLink }))}
          />
        </Suspense>
      </div>
    </div>
  );
}
