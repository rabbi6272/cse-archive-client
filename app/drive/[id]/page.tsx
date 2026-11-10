import type { Metadata } from "next";
import { getDriveFolder, DriveView } from "@/features/drive";

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

export default async function DrivePage({ params }: Props) {
  const { id } = await params;
  const initialData = await getDriveFolder(id).catch(() => null);
  return <DriveView folderId={id} initialData={initialData ?? undefined} />;
}
