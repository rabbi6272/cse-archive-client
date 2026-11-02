import { unstable_cache } from "next/cache";
import { normalizeSnippets, type DecodedSnippet } from "@/lib/codelibrary/snippetIdentity";

// Server-side reads of the code library Firestore over its REST API.
// The rules require request.auth != null, and the admin SDK in lib/firebase-admin.ts is for a
// different project, so the server signs in anonymously like a browser visitor does.

const API_KEY = process.env.NEXT_PUBLIC_CODELIBRARY_FIREBASE_API_KEY;
const PROJECT_ID = process.env.NEXT_PUBLIC_CODELIBRARY_FIREBASE_PROJECT_ID;
const COLLECTION = "codelibrary";

export type CodeSnippet = DecodedSnippet & {
  title: string;
  description: string;
  code: string;
  language: string; // display label, e.g. "C++"
  date: string;
  likesCount: number;
  copiesCount: number;
  tags: string[];
};

// One anonymous user per server instance per hour, not per request.
let token: { value: string; expires: number } | null = null;

async function getIdToken(): Promise<string> {
  if (token && token.expires > Date.now()) return token.value;
  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ returnSecureToken: true }),
    cache: "no-store",
  });
  const body = (await res.json()) as { idToken?: string; expiresIn?: string; error?: { message: string } };
  if (!body.idToken) throw new Error(`Code library sign-in failed: ${body.error?.message ?? res.status}`);
  // Refresh a minute before Firebase expires it (expiresIn is seconds, normally 3600).
  token = { value: body.idToken, expires: Date.now() + (Number(body.expiresIn ?? 3600) - 60) * 1000 };
  return token.value;
}

type FirestoreValue = {
  stringValue?: string;
  integerValue?: string;
  doubleValue?: number;
  booleanValue?: boolean;
  timestampValue?: string;
  nullValue?: null;
  arrayValue?: { values?: FirestoreValue[] };
  mapValue?: { fields?: Record<string, FirestoreValue> };
};

// Firestore REST wraps every value in its type ({ stringValue: "x" }); unwrap to plain JS.
function decode(value: FirestoreValue): unknown {
  if (value.arrayValue) return (value.arrayValue.values ?? []).map(decode);
  if (value.mapValue) return decodeFields(value.mapValue.fields);
  if (value.integerValue !== undefined) return Number(value.integerValue);
  if (value.stringValue !== undefined) return value.stringValue;
  if (value.doubleValue !== undefined) return value.doubleValue;
  if (value.booleanValue !== undefined) return value.booleanValue;
  if (value.timestampValue !== undefined) return value.timestampValue;
  return null;
}

function decodeFields(fields: Record<string, FirestoreValue> = {}): Record<string, unknown> {
  return Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, decode(v)]));
}

async function fetchAllSnippets(): Promise<CodeSnippet[]> {
  const idToken = await getIdToken();
  const snippets: CodeSnippet[] = [];
  let pageToken = "";

  do {
    const url = new URL(
      `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${COLLECTION}`,
    );
    url.searchParams.set("pageSize", "300");
    if (pageToken) url.searchParams.set("pageToken", pageToken);

    const res = await fetch(url, { headers: { Authorization: `Bearer ${idToken}` }, cache: "no-store" });
    if (!res.ok) throw new Error(`Code library read failed: HTTP ${res.status}`);
    const body = (await res.json()) as {
      documents?: { name: string; fields?: Record<string, FirestoreValue> }[];
      nextPageToken?: string;
    };

    for (const doc of body.documents ?? []) {
      const roll = doc.name.split("/").pop() ?? "";
      const data = decodeFields(doc.fields);
      // Each roll document holds a `snippets` array; very old documents are a single snippet.
      const raw = Array.isArray(data.snippets) ? data.snippets : [{ ...data, id: data.id ?? roll }];
      for (const s of normalizeSnippets(raw, roll)) {
        snippets.push({
          ...s,
          title: s.title ?? "Untitled snippet",
          description: s.description ?? "",
          code: s.codeSnippet ?? s.code ?? "",
          codeSnippet: undefined,
          language: s.language === "js" ? "JavaScript" : (s.language ?? ""),
          date: s.date ?? "",
          likesCount: s.likesCount ?? 0,
          copiesCount: s.copiesCount ?? 0,
          tags: Array.isArray(s.tags) ? s.tags : [],
          // Comments aren't shown here and can be large; don't ship them to the page.
          comments: undefined,
        });
      }
    }
    pageToken = body.nextPageToken ?? "";
  } while (pageToken);

  return snippets.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
}

// Cached for 2 minutes across requests: new snippets, likes and copies can take that long to show.
export const getSnippets = unstable_cache(fetchAllSnippets, ["codelibrary-snippets"], {
  revalidate: 120,
  tags: ["codelibrary"],
});

export async function getSnippet(id: string): Promise<CodeSnippet | null> {
  return (await getSnippets()).find((s) => s.id === id) ?? null;
}
