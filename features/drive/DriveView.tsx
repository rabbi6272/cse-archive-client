"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, FolderOpen, RefreshCw } from "lucide-react";
import { buttonClasses, EmptyState, ErrorState, cn } from "@/components/ui";
import { isFolder, type DriveFolderData } from "./api";
import { FilePreview } from "./FilePreview";
import { FileRow } from "./FileRow";
import { DriveSkeleton } from "./DriveSkeleton";
import { useDriveFolder, usePrefetchDriveFolder } from "./queries";

interface DriveViewProps {
  folderId: string;
  initialData?: DriveFolderData;
}

export function DriveView({ folderId, initialData }: DriveViewProps) {
  const { data, isLoading, isError, error, isFetching, refetch } = useDriveFolder(
    folderId,
    initialData,
  );
  const prefetch = usePrefetchDriveFolder();

  // Keep page title in sync on client-side folder transitions
  useEffect(() => {
    if (data?.currentFolder?.name) {
      document.title = `${data.currentFolder.name} | RUET CSE Archive`;
    }
  }, [data?.currentFolder?.name]);

  if (isLoading && !data) {
    return <DriveSkeleton />;
  }

  if (isError && !data) {
    return (
      <div className="page-container py-8 md:py-12">
        <div className="mx-auto max-w-4xl rounded-card border border-hairline bg-canvas">
          <ErrorState
            title="Couldn't load this folder"
            description={
              error instanceof Error
                ? error.message
                : "The Drive server didn't respond. Try again in a moment."
            }
            onRetry={() => refetch()}
          />
        </div>
      </div>
    );
  }

  const files = [
    ...(data?.files || []).filter(isFolder),
    ...(data?.files || []).filter((f) => !isFolder(f)),
  ];
  const folderCount = files.filter(isFolder).length;
  const fileCount = files.length - folderCount;

  return (
    <div className="page-container py-8 md:py-12">
      <div className="mx-auto max-w-4xl">
        {data?.parentFolderId && (
          <Link
            href={`/drive/${data.parentFolderId}`}
            className={buttonClasses("ghost", "sm")}
            onMouseEnter={() => prefetch(data.parentFolderId!)}
            onFocus={() => prefetch(data.parentFolderId!)}
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back
          </Link>
        )}

        <header className="mt-3 mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-ink md:text-4xl">
              {data?.currentFolder?.name ?? "Drive Files"}
            </h1>
            {files.length > 0 && (
              <p className="mt-2 text-sm text-steel">
                {folderCount} {folderCount === 1 ? "folder" : "folders"} · {fileCount}{" "}
                {fileCount === 1 ? "file" : "files"}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            title="Refresh folder"
            aria-label="Refresh folder"
            disabled={isFetching}
            className={cn(buttonClasses("ghost", "sm"), "text-steel hover:text-ink")}
          >
            <RefreshCw className={cn("size-4", isFetching && "animate-spin")} aria-hidden />
            <span className="hidden sm:inline">Refresh</span>
          </button>
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
