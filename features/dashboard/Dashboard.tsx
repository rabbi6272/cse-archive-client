"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CldImage } from "next-cloudinary";
import toast from "react-hot-toast";
import { AlertCircle, ChevronDown, Code2, History, Pencil, Plus, Trash2 } from "lucide-react";
import { CodeSnippetHelper } from "@/helpers/CodeSnippetHelper";
import { getUserDisplayRole } from "@/lib/auth-utils";
import AuthUtils from "@/lib/auth-utils-secure";
import {
  awardSnippetNutrinos,
  getUserNutrinos,
  getUserNutrinosHistory,
  recordDailyVisit,
} from "@/lib/nutrinos-system";
import NotificationCenter from "@/app/user/dashboard/components/NotificationCenter";
import ActiveUsersIndicator from "@/app/components/ui/ActiveUsersIndicator";
import { Badge, Button, buttonClasses, cn, EmptyState, Input, Modal, Skeleton, Textarea } from "@/components/ui";
import { refreshSnippets } from "@/features/codelibrary/actions";
import { CodeBlock } from "@/features/codelibrary/CodeBlock";

const PER_PAGE = 5;

type User = { roll: string; name: string; profilePictureUrl?: string };
type Snippet = {
  id: string;
  rollNumber: string;
  title?: string;
  description?: string;
  codeSnippet?: string;
  code?: string;
  language?: string;
  date?: string;
};
type Nutrinos = { totalNutrinos: number; rank: string; level: number };
type HistoryEntry = { id: string; reason?: unknown; timestamp: string | number; nutrinos: number };

const helper = new CodeSnippetHelper();

export function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [snippets, setSnippets] = useState<Snippet[] | null>(null);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<{ id: string; title: string; description: string; codeSnippet: string } | null>(
    null,
  );
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState<Snippet | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [nutrinos, setNutrinos] = useState<Nutrinos>({ totalNutrinos: 0, rank: "Newbie", level: 1 });
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);

  async function loadNutrinos(roll: string) {
    try {
      setNutrinos((await getUserNutrinos(roll)) as Nutrinos); // JSDoc in nutrinos-system.js says Object
      setHistory(await getUserNutrinosHistory(roll, 5));
    } catch (err) {
      console.error("Error loading Nutrinos data:", err);
    }
  }

  useEffect(() => {
    const data = AuthUtils.isAuthenticated() ? (AuthUtils.getUserData() as User | null) : null;
    if (!data) {
      router.push("/user/login");
      return;
    }
    setUser(data);
    helper
      .readAllByRoll(data.roll)
      .then((list: Snippet[]) => setSnippets(list))
      .catch((err: unknown) => {
        console.error("Error loading snippets:", err);
        setError("Failed to load your snippets. Please try again.");
        setSnippets([]);
      });
    loadNutrinos(data.roll);
    recordDailyVisit(data.roll);
  }, [router]);

  async function saveEdit() {
    if (!user || !editing || !snippets) return;
    setSaving(true);
    try {
      const stored = snippets.find((s) => s.id === editing.id);
      const { id, ...changes } = editing;
      await helper.update(user.roll, { ...stored, ...changes, updatedAt: new Date().toISOString() });
      setSnippets(snippets.map((s) => (s.id === id ? { ...s, ...changes } : s)));
      setEditing(null);
      await awardSnippetNutrinos.edit(user.roll, id);
      await loadNutrinos(user.roll);
      refreshSnippets().catch(() => {});
      toast.success("Snippet updated! +1.5 Nutrinos earned.");
    } catch (err) {
      console.error("Error updating snippet:", err);
      toast.error("Failed to update snippet. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  // Fixed: this used to call helper.update() with a function, which always threw "Snippet not found",
  // yet still deducted the Nutrinos. Now the snippet is removed first and points only change on success.
  async function confirmDelete() {
    if (!user || !toDelete || !snippets) return;
    setDeleting(true);
    try {
      await helper.remove(toDelete.id);
      const next = snippets.filter((s) => s.id !== toDelete.id);
      setSnippets(next);
      setPage((p) => Math.min(p, Math.max(1, Math.ceil(next.length / PER_PAGE))));
      setToDelete(null);
      await awardSnippetNutrinos.delete(user.roll, toDelete.id);
      await loadNutrinos(user.roll);
      refreshSnippets().catch(() => {});
      toast.success("Snippet deleted. 3 Nutrinos deducted.");
    } catch (err) {
      console.error("Error deleting snippet:", err);
      toast.error("Failed to delete snippet. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  if (!user) {
    return (
      <div className="flex flex-col gap-4" aria-busy="true">
        <Skeleton className="h-32" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  const pageCount = Math.max(1, Math.ceil((snippets?.length ?? 0) / PER_PAGE));
  const shown = (snippets ?? []).slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="flex flex-col gap-6">
      {/* Profile */}
      <section className="rounded-card border border-hairline bg-canvas p-5 motion-safe:animate-pop-in md:p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="flex items-center gap-4">
            {user.profilePictureUrl ? (
              <CldImage
                width={80}
                height={80}
                src={user.profilePictureUrl}
                alt=""
                loading="eager"
                className="size-20 shrink-0 rounded-full border border-hairline object-cover"
              />
            ) : (
              <span className="flex size-20 shrink-0 items-center justify-center rounded-full bg-tint-lavender text-2xl font-semibold text-charcoal">
                {user.name.charAt(0)}
              </span>
            )}
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-semibold tracking-tight text-ink">{user.name}</h1>
              <p className="mt-0.5 text-sm text-steel">
                Roll {user.roll} · {snippets?.length ?? "…"} {snippets?.length === 1 ? "snippet" : "snippets"}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Badge tone="lavender">{getUserDisplayRole(user)}</Badge>
                <Badge tone="sky">{nutrinos.rank}</Badge>
                <Badge tone="mint">Level {nutrinos.level}</Badge>
              </div>
            </div>
          </div>
          {/* Still the old components (they open chat, which waits for the chat split). */}
          <div className="flex items-start gap-3">
            <ActiveUsersIndicator showDetails className="shrink-0" />
            <NotificationCenter userRoll={user.roll} />
          </div>
        </div>

        {/* Nutrinos */}
        <div className="mt-5 rounded-button bg-surface p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-steel">Nutrinos</p>
              <p className="text-2xl font-semibold text-ink tabular-nums">{nutrinos.totalNutrinos.toFixed(2)}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              aria-expanded={historyOpen}
              aria-controls="nutrinos-history"
              onClick={() => setHistoryOpen((o) => !o)}
            >
              <History className="size-4" aria-hidden />
              Recent activity
              <ChevronDown
                className={cn("size-4 transition-transform motion-reduce:transition-none", historyOpen && "rotate-180")}
                aria-hidden
              />
            </Button>
          </div>
          <div
            id="nutrinos-history"
            inert={!historyOpen}
            className={cn(
              "grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none",
              historyOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
            )}
          >
            <div className="overflow-hidden">
              {history.length === 0 ? (
                <p className="pt-4 text-sm text-steel">No Nutrinos activity yet.</p>
              ) : (
                <ul className="mt-4 divide-y divide-hairline">
                  {history.map((h) => (
                    <li key={h.id} className="flex items-center justify-between gap-3 py-2">
                      <span className="min-w-0">
                        <span className="block truncate text-sm text-ink">
                          {typeof h.reason === "string" ? h.reason : "Activity completed"}
                        </span>
                        <span className="text-xs text-steel">{new Date(h.timestamp).toLocaleDateString()}</span>
                      </span>
                      <span
                        className={cn(
                          "text-sm font-semibold tabular-nums",
                          h.nutrinos >= 0 ? "text-success" : "text-error",
                        )}
                      >
                        {h.nutrinos >= 0 ? "+" : ""}
                        {h.nutrinos.toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Snippets */}
      <section aria-labelledby="my-snippets" className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <h2 id="my-snippets" className="text-xl font-semibold tracking-tight text-ink">
            Your snippets
          </h2>
          <Link href="/user/create-snippet" className={buttonClasses("primary", "sm")}>
            <Plus className="size-4" aria-hidden />
            New snippet
          </Link>
        </div>

        {error && (
          <p role="alert" className="flex items-center gap-2 rounded-button bg-error/10 px-3 py-2 text-sm text-error">
            <AlertCircle className="size-4 shrink-0" aria-hidden />
            {error}
          </p>
        )}

        {snippets === null ? (
          <div className="flex flex-col gap-4" aria-busy="true">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
        ) : snippets.length === 0 ? (
          <div className="rounded-card border border-hairline bg-canvas">
            <EmptyState
              icon={<Code2 />}
              title="No snippets yet"
              description="Share your first snippet with other RUET CSE students."
              action={
                <Link href="/user/create-snippet" className={buttonClasses("primary")}>
                  Share a snippet
                </Link>
              }
            />
          </div>
        ) : (
          <ul className="flex flex-col gap-4">
            {shown.map((s) => (
              <li
                key={s.id}
                className="rounded-card border border-hairline bg-canvas p-5 motion-safe:animate-pop-in md:p-6"
              >
                {editing?.id === s.id ? (
                  <div className="flex flex-col gap-4">
                    <Input
                      label="Title"
                      value={editing.title}
                      onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                    />
                    <Textarea
                      label="Description"
                      rows={3}
                      value={editing.description}
                      onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                    />
                    <Textarea
                      label="Code"
                      rows={12}
                      spellCheck={false}
                      className="font-mono text-sm"
                      value={editing.codeSnippet}
                      onChange={(e) => setEditing({ ...editing, codeSnippet: e.target.value })}
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="secondary" onClick={() => setEditing(null)} disabled={saving}>
                        Cancel
                      </Button>
                      <Button onClick={saveEdit} loading={saving}>
                        Save changes
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        {s.language && <Badge tone="sky">{s.language}</Badge>}
                        <h3 className="mt-2 text-lg font-semibold text-ink">
                          <Link href={`/codelibrary/${s.id}`} className="hover:text-link hover:underline">
                            {s.title}
                          </Link>
                        </h3>
                        {s.description && <p className="mt-1 text-ink-soft">{s.description}</p>}
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label={`Edit ${s.title}`}
                          onClick={() =>
                            setEditing({
                              id: s.id,
                              title: s.title ?? "",
                              description: s.description ?? "",
                              codeSnippet: s.codeSnippet ?? s.code ?? "",
                            })
                          }
                        >
                          <Pencil className="size-4" aria-hidden />
                          <span className="hidden sm:inline">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label={`Delete ${s.title}`}
                          onClick={() => setToDelete(s)}
                          className="text-error"
                        >
                          <Trash2 className="size-4" aria-hidden />
                          <span className="hidden sm:inline">Delete</span>
                        </Button>
                      </div>
                    </div>
                    <div className="mt-4">
                      <CodeBlock
                        code={s.codeSnippet ?? s.code ?? ""}
                        language={s.language ?? ""}
                        snippetId={s.id}
                        rollNumber={s.rollNumber}
                      />
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}

        {pageCount > 1 && (
          <nav aria-label="Snippet pages" className="flex items-center justify-between gap-3">
            <Button variant="secondary" disabled={page === 1} onClick={() => setPage(page - 1)}>
              Previous
            </Button>
            <span className="text-sm text-steel">
              Page {page} of {pageCount}
            </span>
            <Button variant="secondary" disabled={page === pageCount} onClick={() => setPage(page + 1)}>
              Next
            </Button>
          </nav>
        )}
      </section>

      <Modal
        open={toDelete !== null}
        onClose={() => !deleting && setToDelete(null)}
        title="Delete this snippet?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setToDelete(null)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete} loading={deleting}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-ink-soft">
          &ldquo;{toDelete?.title}&rdquo; will be removed from the code library. You&apos;ll lose 3 Nutrinos.
        </p>
      </Modal>
    </div>
  );
}
