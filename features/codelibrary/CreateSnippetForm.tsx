"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import toast from "react-hot-toast";
import { CodeSnippetHelper } from "@/helpers/CodeSnippetHelper";
import AuthUtils from "@/lib/auth-utils-secure";
import { addNutrinos } from "@/lib/nutrinos-system";
import {
  Badge,
  Button,
  cn,
  focusRing,
  Input,
  Select,
  Textarea,
} from "@/components/ui";
import { refreshSnippets } from "./actions";

const LANGUAGES = [
  "JavaScript",
  "Python",
  "Java",
  "C",
  "C++",
  "C#",
  "PHP",
  "Dart",
  "R",
  "SQL",
];
const YEARS = [
  { value: "1st", label: "1st year" },
  { value: "2nd", label: "2nd year" },
  { value: "3rd", label: "3rd year" },
  { value: "4th", label: "4th year" },
];

type Form = {
  title: string;
  description: string;
  language: string;
  codeSnippet: string;
  rollNumber: string;
  difficulty: string;
  tags: string[];
  isPublic: boolean;
  date: string;
};

// Same submission as before (CodeSnippetHelper + Nutrinos); new UI, and the code library
// cache is refreshed so the snippet shows up immediately.
export function CreateSnippetForm() {
  const router = useRouter();
  const [form, setForm] = useState<Form>({
    title: "",
    description: "",
    language: "",
    codeSnippet: "",
    rollNumber: "",
    difficulty: "beginner", // stored when no year is picked, as before
    tags: [],
    isPublic: true,
    date: "",
  });
  const [tagInput, setTagInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const user = AuthUtils.isAuthenticated() ? AuthUtils.getUserData() : null;
    if (!user) {
      router.push("/user/login");
      return;
    }
    setForm((f) => ({
      ...f,
      rollNumber: user.roll,
      date: new Date().toISOString(),
    }));
  }, [router]);

  const set = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  function addTag() {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag))
      setForm((f) => ({ ...f, tags: [...f.tags, tag] }));
    setTagInput("");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.rollNumber) return router.push("/user/login");

    setSubmitting(true);
    try {
      const helper = new CodeSnippetHelper({
        ...form,
        comments: [],
        createdAt: new Date().toISOString(),
      });
      const { message, error } = await helper.push(form.rollNumber);
      if (error) {
        toast.error(message || "Failed to submit snippet. Please try again.");
        return;
      }

      try {
        await addNutrinos(
          form.rollNumber,
          "snippet_add",
          "Code Snippet Added",
          {
            title: form.title,
            language: form.language,
          },
        );
      } catch (err) {
        console.error("Failed to award Nutrinos points:", err);
      }
      await refreshSnippets().catch((err) =>
        console.error("Cache refresh failed:", err),
      );

      toast.success(message || "Snippet submitted successfully!");
      router.push("/user/dashboard");
    } catch (err) {
      console.error("Submission error:", err);
      toast.error("Failed to submit snippet. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Input
        label="Title"
        name="title"
        value={form.title}
        onChange={set}
        required
        placeholder="A descriptive title for your snippet"
      />
      <Textarea
        label="Description"
        name="description"
        value={form.description}
        onChange={set}
        required
        rows={4}
        placeholder="What the code does, how it works, and when to use it"
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Input
          label="Roll number"
          name="rollNumber"
          value={form.rollNumber}
          readOnly
          disabled
          hint="From your account"
        />
        <Select
          label="Language"
          name="language"
          value={form.language}
          onChange={set}
          required
        >
          <option value="">Select a language</option>
          {LANGUAGES.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </Select>
      </div>

      <fieldset>
        <legend className="mb-1.5 text-sm font-medium text-ink">Year</legend>
        <div className="flex flex-wrap gap-2">
          {YEARS.map((y) => (
            <label key={y.value} className="cursor-pointer">
              <input
                type="radio"
                name="difficulty"
                value={y.value}
                checked={form.difficulty === y.value}
                onChange={set}
                className="peer sr-only"
              />
              <span
                className={cn(
                  "inline-flex h-9 items-center rounded-full border border-hairline px-4 text-sm font-medium text-steel transition-colors",
                  "peer-checked:border-ink peer-checked:bg-ink peer-checked:text-canvas hover:text-ink",
                  "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary",
                )}
              >
                {y.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-2">
        <Input
          label="Tags"
          hint="Optional. Press Enter to add."
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag();
            }
          }}
          placeholder="e.g. recursion"
        />
        <Button
          variant="secondary"
          onClick={addTag}
          disabled={!tagInput.trim()}
          className="self-start"
        >
          <Plus className="size-4" aria-hidden />
          Add tag
        </Button>
        {form.tags.length > 0 && (
          <ul className="flex flex-wrap gap-2" aria-label="Tags">
            {form.tags.map((tag) => (
              <li key={tag} className="motion-safe:animate-pop-in">
                <Badge tone="sky" className="gap-1 py-1 pr-1">
                  #{tag}
                  <button
                    type="button"
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        tags: f.tags.filter((t) => t !== tag),
                      }))
                    }
                    aria-label={`Remove tag ${tag}`}
                    className={cn(
                      "rounded-sm p-0.5 hover:bg-black/10",
                      focusRing,
                    )}
                  >
                    <X className="size-3.5" aria-hidden />
                  </button>
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Textarea
        label="Code"
        name="codeSnippet"
        value={form.codeSnippet}
        onChange={set}
        required
        rows={14}
        spellCheck={false}
        placeholder="// Paste your code here"
        className="font-mono text-sm"
      />

      <Button type="submit" loading={submitting} className="self-end">
        {submitting ? "Submitting…" : "Share snippet"}
      </Button>
    </form>
  );
}
