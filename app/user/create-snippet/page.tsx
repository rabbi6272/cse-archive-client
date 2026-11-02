import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonClasses } from "@/components/ui";
import { CreateSnippetForm } from "@/features/codelibrary/CreateSnippetForm";

export const metadata: Metadata = { title: "Share a snippet", robots: { index: false } };

// Server component; only the form is client code.
export default function CreateSnippetPage() {
  return (
    <div className="page-container py-8 md:py-12">
      <div className="mx-auto max-w-3xl">
        <Link href="/codelibrary" className={buttonClasses("ghost", "sm")}>
          <ArrowLeft className="size-4" aria-hidden />
          Code Library
        </Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink md:text-4xl">Share a snippet</h1>
        <p className="mt-2 mb-8 text-ink-soft">
          Your own code only, no AI-generated content. Others can copy it, with credit to you.
        </p>
        <div className="rounded-card border border-hairline bg-canvas p-6 motion-safe:animate-pop-in md:p-8">
          <CreateSnippetForm />
        </div>
      </div>
    </div>
  );
}
