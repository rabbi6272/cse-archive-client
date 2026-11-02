import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn, focusRing } from "@/components/ui";
import { SectionHeading } from "./SectionHeading";

function InlineLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className={cn("rounded-sm font-medium text-link hover:underline", focusRing)}>
      {children}
    </Link>
  );
}

const faqs: { question: string; answer: ReactNode }[] = [
  {
    question: "How will this site be beneficial?",
    answer: (
      <>
        No more wasting time searching for PDFs or videos. We bring your essential study materials
        together in one place to keep you focused and curious. Explore the{" "}
        <InlineLink href="/shelf">Book Shelf</InlineLink> for more.
      </>
    ),
  },
  {
    question: "How will the Code Library help me?",
    answer: (
      <>
        It sparks the curiosity to learn something new and the creativity to build something that
        stands out. Explore the <InlineLink href="/codelibrary">Code Library</InlineLink>, where
        learners debug and grow together.
      </>
    ),
  },
  {
    question: "What's in the Alumni section?",
    answer: (
      <>
        It connects you with RUET CSE graduates, sharing their experiences, career journeys and
        advice for current students. Read their stories in{" "}
        <InlineLink href="/alumni">Alumni</InlineLink> and build your network.
      </>
    ),
  },
  {
    question: "Who are we?",
    answer: (
      <>
        A group of <InlineLink href="/contact&help/developers">RUET CSE students</InlineLink> who
        love programming and helping others. We want to make learning easier and more accessible
        for everyone.
      </>
    ),
  },
];

// Native <details> accordion: keyboard and screen-reader support without JS.
export function FAQSection() {
  return (
    <section aria-labelledby="faq-heading" className="page-container py-16 md:py-24">
      <SectionHeading id="faq-heading" eyebrow="Good to know" title="Frequently asked questions" />

      <div className="mx-auto max-w-3xl border-t border-hairline">
        {faqs.map((faq) => (
          <details key={faq.question} className="group border-b border-hairline">
            <summary
              className={cn(
                "flex cursor-pointer list-none items-center justify-between gap-4 rounded-button py-5 text-lg font-semibold text-ink [&::-webkit-details-marker]:hidden",
                focusRing,
              )}
            >
              {faq.question}
              <ChevronDown
                className="size-5 shrink-0 text-steel transition-transform group-open:rotate-180 motion-reduce:transition-none"
                aria-hidden
              />
            </summary>
            <p className="pb-6 leading-relaxed text-ink-soft">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
