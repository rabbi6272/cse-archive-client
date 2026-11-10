"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchDriveFolder, type DriveFolderData } from "./api";

export const DRIVE_FOLDER_QUERY_KEY = "drive-folder";

export const driveFolderQueryKey = (folderId: string) =>
  [DRIVE_FOLDER_QUERY_KEY, folderId] as const;

export function driveFolderQueryOptions(folderId: string) {
  return {
    queryKey: driveFolderQueryKey(folderId),
    queryFn: () => fetchDriveFolder(folderId),
    staleTime: 1000 * 60 * 15, // 15 minutes fresh in client cache
    gcTime: 1000 * 60 * 60, // keep unused data in memory for 1 hour
    enabled: Boolean(folderId),
  };
}

export function useDriveFolder(folderId: string, initialData?: DriveFolderData) {
  return useQuery({
    ...driveFolderQueryOptions(folderId),
    ...(initialData ? { initialData } : {}),
  });
}

export function usePrefetchDriveFolder() {
  const queryClient = useQueryClient();
  return (folderId: string) => {
    if (!folderId) return;
    queryClient.prefetchQuery(driveFolderQueryOptions(folderId));
  };
}
