"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, FolderOpen } from "lucide-react";
import {
  buttonClasses,
  EmptyState,
  ErrorState,
  Skeleton,
} from "@/components/ui";
import {
  fetchDriveFolder,
  isFolder,
  type DriveFile,
} from "@/features/drive/api";
import { FilePreview } from "@/features/drive/FilePreview";
import { FileRow } from "@/features/drive/FileRow";

const SKELETON_ROWS = 7;

export default function DrivePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [preview, setPreview] = useState<DriveFile | null>(null);

  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ["drive", id],
    queryFn: () => fetchDriveFolder(id),
  });

  // Folders first, then files, each in the API's order.
  const files = useMemo(() => {
    const all = data?.files ?? [];
    return [...all.filter(isFolder), ...all.filter((f) => !isFolder(f))];
  }, [data]);
  const folderCount = files.filter(isFolder).length;

  return (
    <div className="page-container py-8 md:py-12">
      <div className="mx-auto max-w-4xl">
        {data?.parentFolderId && (
          <Link
            href={`/drive/${data.parentFolderId}`}
            className={buttonClasses("ghost", "sm")}
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back
          </Link>
        )}

        <header className="mt-3 mb-6">
          {isLoading ? (
            <Skeleton className="h-9 w-2/3" />
          ) : (
            <h1 className="text-3xl font-semibold tracking-tight text-ink md:text-4xl">
              {data?.currentFolder?.name ?? "Drive Files"}
            </h1>
          )}
          {data && files.length > 0 && (
            <p className="mt-2 text-sm text-steel">
              {folderCount} {folderCount === 1 ? "folder" : "folders"} ·{" "}
              {files.length - folderCount}{" "}
              {files.length - folderCount === 1 ? "file" : "files"}
            </p>
          )}
        </header>

        <div className="rounded-card border border-hairline bg-canvas">
          {isLoading ? (
            <ul aria-busy="true" aria-label="Loading files">
              {Array.from({ length: SKELETON_ROWS }, (_, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 border-b border-hairline px-4 py-4 last:border-b-0"
                >
                  <Skeleton className="size-5 shrink-0" />
                  <Skeleton
                    className="h-4"
                    style={{ width: `${40 + ((i * 17) % 45)}%` }}
                  />
                </li>
              ))}
            </ul>
          ) : error ? (
            <ErrorState
              title="Couldn't load this folder"
              description={isRefetching ? "Retrying…" : error.message}
              onRetry={() => refetch()}
            />
          ) : files.length === 0 ? (
            <EmptyState
              icon={<FolderOpen />}
              title="This folder is empty"
              description="Nothing has been uploaded here yet."
            />
          ) : (
            <ul>
              {files.map((file) => (
                <FileRow key={file.id} file={file} onPreview={setPreview} />
              ))}
            </ul>
          )}
        </div>

        <FilePreview file={preview} onClose={() => setPreview(null)} />
      </div>
    </div>
  );
}
