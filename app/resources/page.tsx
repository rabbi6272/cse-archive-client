import type { Metadata } from "next";
import { ResourceCard } from "@/features/resources/ResourceCard";
import { resources } from "@/features/resources/data";

const title = "Academic Resources";
const description =
  "Access comprehensive study materials, course resources, and academic guides for all years of your CSE journey at RUET.";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["RUET", "CSE", "academic resources", "study materials", "computer science", "engineering"],
  openGraph: { title: `${title} | RUET CSE Archive`, description, type: "website" },
  twitter: { card: "summary_large_image", title: `${title} | RUET CSE Archive`, description },
};

export default function ResourcesPage() {
  return (
    <div className="page-container py-12 md:py-16">
      <header className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
        <h1 className="text-4xl font-semibold tracking-tight text-ink md:text-5xl">
          Academic Resources
        </h1>
        <p className="mt-4 text-lg text-ink-soft">
          Study materials, course resources and guides for every year of your CSE journey at RUET.
        </p>
      </header>

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {resources.map((resource, i) => (
          <li key={resource.title}>
            <ResourceCard resource={resource} priority={i < 3} />
          </li>
        ))}
      </ul>
    </div>
  );
}
