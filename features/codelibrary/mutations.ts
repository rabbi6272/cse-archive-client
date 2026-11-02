"use client";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { CodelibraryDB, COLLECTION, ensureCodelibraryAuth } from "@/utils/CodelibraryDB";
import { matchesSnippetId, type SnippetLike } from "@/lib/codelibrary/snippetIdentity";

// Read-modify-write one snippet inside its roll document (1 read + 1 write).
// The updater gets the stored snippet, so counts increment what Firestore has now,
// not the possibly stale number the page was rendered with.
async function patchSnippet(
  rollNumber: string,
  snippetId: string,
  updater: (stored: SnippetLike) => SnippetLike,
): Promise<void> {
  await ensureCodelibraryAuth();
  const rollRef = doc(CodelibraryDB, COLLECTION, rollNumber);
  const snap = await getDoc(rollRef);
  if (!snap.exists()) return;

  const data = snap.data();
  const snippets = (Array.isArray(data.snippets) ? data.snippets : []).map((item: SnippetLike) =>
    matchesSnippetId(item, snippetId, rollNumber) ? updater(item) : item,
  );
  await updateDoc(rollRef, { snippets, updatedAt: new Date().toISOString() });
}

export const incrementLikes = (rollNumber: string, snippetId: string) =>
  patchSnippet(rollNumber, snippetId, (s) => ({ ...s, likesCount: (s.likesCount ?? 0) + 1 }));

export const incrementCopies = (rollNumber: string, snippetId: string) =>
  patchSnippet(rollNumber, snippetId, (s) => ({ ...s, copiesCount: (s.copiesCount ?? 0) + 1 }));
