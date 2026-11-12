"use server";

import { revalidatePath } from "next/cache";
import { alumniData, badgeLabels } from "@/features/alumni/data";
import { validateAlumnus, type AlumnusInput } from "./alumni";
import { getDbAlumni, pushAlumnus, runDriveAction, type DriveAction } from "./data";
import { logoutAction } from "@/features/auth/actions";
import { requireAdmin } from "./session";

export type ActionState = { ok?: boolean; message?: string } | null;

export async function logout() {
  await logoutAction();
  revalidatePath("/admin");
}

const DRIVE_ACTIONS: DriveAction[] = ["setup", "revalidate", "delete", "renew", "status"];

export async function driveAction(_: ActionState, form: FormData): Promise<ActionState> {
  await requireAdmin("super_admin");
  const action = String(form.get("action")) as DriveAction;
  if (!DRIVE_ACTIONS.includes(action)) return { ok: false, message: "Unknown action." };
  try {
    const message = await runDriveAction(action, {
      warm: form.get("warm") === "on",
      clearMeta: form.get("clearMeta") === "on",
    });
    revalidatePath("/admin");
    return { ok: true, message };
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : "Drive server error." };
  }
}

export async function addAlumnus(_: ActionState, form: FormData): Promise<ActionState> {
  const admin = await requireAdmin("admin");
  const str = (k: string) => String(form.get(k) ?? "").trim();
  const input: AlumnusInput = {
    name: str("name"),
    dept: str("dept"),
    series: str("series"),
    optional: str("optional"),
    address: str("address"),
    country: str("country"),
    badges: form.getAll("badges").map(String),
    linkedinurl: str("linkedinurl"),
    longitude: str("longitude"),
    latitude: str("latitude"),
  };
  const problem = validateAlumnus(input, Object.keys(badgeLabels));
  if (problem) return { ok: false, message: problem };

  try {
    // Ids look like "0x2a3"; avoid clashing with static and database alumni.
    const taken = new Set([...alumniData.map((a) => a.Id), ...(await getDbAlumni()).map((a) => a.Id)]);
    let id = "";
    for (let i = 0; i < 100 && (!id || taken.has(id)); i++)
      id = `0x${(Math.floor(Math.random() * 0xffff) + 0x200).toString(16)}`;

    const { longitude, latitude, badges, ...rest } = input;
    await pushAlumnus({
      ...rest,
      badges: badges.join(","),
      Id: id,
      coordinates: [Number(longitude), Number(latitude)],
      type: "Point",
      addedBy: admin.uid,
      addedByName: admin.name || admin.email,
      dateAdded: new Date().toISOString(),
    });
    revalidatePath("/admin");
    return { ok: true, message: `Added ${input.name}. They now appear on the Global RUET map.` };
  } catch (err) {
    console.error("addAlumnus failed:", err);
    return { ok: false, message: "Couldn't save. Please try again." };
  }
}
