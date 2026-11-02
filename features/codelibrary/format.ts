import { getStudentName } from "@/lib/students-loader";

export const authorName = (roll: string) => getStudentName(roll) as string;

const dateFormat = new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" });

export function formatDate(date: string): string | null {
  const d = new Date(date);
  return Number.isNaN(d.getTime()) ? null : dateFormat.format(d);
}
