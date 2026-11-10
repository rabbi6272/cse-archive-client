import { redirect } from "next/navigation";
import { ROOT_FOLDER_ID } from "@/features/drive";

export default function DriveRootPage() {
  redirect(`/drive/${ROOT_FOLDER_ID}`);
}
