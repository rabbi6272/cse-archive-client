"use client";

import { useState, type ReactNode } from "react";
import { FolderOpen, Moon, Plus, Sun } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  Input,
  Modal,
  SearchInput,
  Skeleton,
  Tabs,
  Textarea,
} from "@/components/ui";

const tints = ["peach", "rose", "mint", "lavender", "sky", "yellow"] as const;

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xs font-semibold tracking-widest text-steel uppercase">{title}</h2>
      {children}
    </section>
  );
}

export function Gallery() {
  const [modalOpen, setModalOpen] = useState(false);
  const [pill, setPill] = useState<"all" | "notes" | "slides">("all");
  const [line, setLine] = useState<"overview" | "files">("overview");

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-12 bg-canvas px-4 py-10 text-ink md:px-8">
      <header className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-tight">UI components</h1>
        {/* Not persisted: only flips the class for checking both themes. */}
        <Button
          variant="secondary"
          onClick={() => document.documentElement.classList.toggle("dark")}
        >
          <Sun className="size-4 dark:hidden" aria-hidden />
          <Moon className="hidden size-4 dark:block" aria-hidden />
          Toggle theme
        </Button>
      </header>

      <Section title="Button">
        <div className="flex flex-wrap items-center gap-3">
          <Button>
            <Plus className="size-4" aria-hidden />
            Primary
          </Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="dark">Dark</Button>
          <Button variant="link">Link</Button>
          <Button loading>Saving</Button>
          <Button disabled>Disabled</Button>
          <Button size="sm">Small</Button>
          <Button size="sm" variant="secondary">
            Small secondary
          </Button>
        </div>
      </Section>

      <Section title="Card">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <h3 className="font-semibold">Base card</h3>
            <p className="mt-1 text-sm text-ink-soft">Hairline border on canvas.</p>
          </Card>
          <Card variant="feature" interactive>
            <h3 className="font-semibold">Feature, interactive</h3>
            <p className="mt-1 text-sm text-ink-soft">More padding, shadow on hover.</p>
          </Card>
          {tints.map((tint) => (
            <Card key={tint} tint={tint}>
              <h3 className="font-semibold capitalize">{tint}</h3>
              <p className="mt-1 text-sm">Charcoal text on the {tint} tint.</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Input">
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Roll number" placeholder="2103001" hint="7 digits" />
          <Input label="Pincode" type="password" defaultValue="123" error="Wrong pincode" />
          <Input label="Disabled" disabled defaultValue="Can't edit" />
          <SearchInput placeholder="Search snippets" />
          <Textarea label="Description" placeholder="What does this snippet do?" className="md:col-span-2" />
        </div>
      </Section>

      <Section title="Badge">
        <div className="flex flex-wrap gap-2">
          <Badge tone="primary" shape="pill">
            New
          </Badge>
          <Badge>Neutral</Badge>
          {tints.map((tint) => (
            <Badge key={tint} tone={tint}>
              CSE 21{tints.indexOf(tint)}3
            </Badge>
          ))}
        </div>
      </Section>

      <Section title="Tabs">
        <Tabs
          aria-label="File type"
          value={pill}
          onChange={setPill}
          tabs={[
            { value: "all", label: "All" },
            { value: "notes", label: "Notes" },
            { value: "slides", label: "Slides" },
          ]}
        />
        <Tabs
          variant="underline"
          aria-label="Section"
          value={line}
          onChange={setLine}
          tabs={[
            { value: "overview", label: "Overview" },
            { value: "files", label: "Files" },
          ]}
        />
      </Section>

      <Section title="Loading, empty and error states">
        <Card className="flex flex-col gap-3">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </Card>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <EmptyState
              icon={<FolderOpen />}
              title="This folder is empty"
              description="Nothing has been uploaded here yet."
              action={<Button variant="secondary">Go back</Button>}
            />
          </Card>
          <Card>
            <ErrorState description="Couldn't load the Drive folder." onRetry={() => {}} />
          </Card>
        </div>
      </Section>

      <Section title="Modal">
        <div>
          <Button onClick={() => setModalOpen(true)}>Open modal</Button>
        </div>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Delete snippet?"
          footer={
            <>
              <Button variant="secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setModalOpen(false)}>Delete</Button>
            </>
          }
        >
          <p className="text-sm text-ink-soft">
            This removes the snippet and its comments. Press Esc or click outside to close.
          </p>
        </Modal>
      </Section>
    </main>
  );
}
