export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  webContentLink?: string;
  // bytes, as a string (Drive API); absent for folders and Google Docs
  size?: string;
  modifiedTime?: string;
}

export interface DriveFolderData {
  files: DriveFile[];
  parentFolderId: string | null;
  currentFolder: { id: string; name: string } | null;
}

export const isFolder = (file: DriveFile) => file.mimeType.includes("folder");

// The Drive API runs on the separate server in cse-archive-server/ (see docs/drive-cache-system.md).
export async function fetchDriveFolder(folderId: string): Promise<DriveFolderData> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_DRIVE_API_URL}/api/drive`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folderId }),
  });

  const data = (await response.json().catch(() => ({}))) as Partial<DriveFolderData> & {
    error?: string;
  };
  if (!response.ok || data.error) {
    throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
  }
  return data as DriveFolderData;
}
