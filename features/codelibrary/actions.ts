"use server";

import { updateTag } from "next/cache";

// Called after a snippet is shared, so the list and its pages show it at once
// instead of after the 2-minute cache in server.ts expires.
export async function refreshSnippets() {
  updateTag("codelibrary");
}
