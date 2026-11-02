import type { Metadata } from "next";
import { avengeance } from "@/app/fonts";
import { groupDevelopersByRole } from "@/lib/developer.utils";
import { DeveloperCard } from "@/features/developers/DeveloperCard";
import { developers } from "@/features/developers/data";

export const metadata: Metadata = {
  title: "Contributors",
  description: "The RUET CSE students who build, review and maintain the RUET CSE Archive.",
};

// Section titles for the groups from groupDevelopersByRole, in display order.
const sections: [group: string, title: string][] = [
  ["Frontend & Backend Developers", "Developers"],
  ["Security", "Security"],
  ["Code Reviewers & Testers", "Code Reviewers & Testers"],
  ["Resource Management", "Resource Management"],
];

export default function DevelopersPage() {
  const groups = groupDevelopersByRole(developers);

  return (
    <div className="page-container py-12 md:py-16">
      <header className="mx-auto mb-12 max-w-2xl text-center">
        <h1 className={`${avengeance.className} text-5xl font-normal tracking-wide text-ink lg:text-7xl`}>
          The Avengers
        </h1>
        <p className="mt-4 text-lg text-ink-soft">
          RUET CSE students who build, review and maintain the archive.
        </p>
      </header>

      <div className="flex flex-col gap-14">
        {sections.map(([group, title]) => {
          const members = groups[group] ?? [];
          if (members.length === 0) return null;
          const id = `team-${group.replace(/\W+/g, "-").toLowerCase()}`;
          return (
            <section key={group} aria-labelledby={id}>
              <h2 id={id} className="mb-5 flex items-baseline gap-3 text-2xl font-semibold tracking-tight text-ink">
                {title}
                <span className="text-sm font-normal text-steel">{members.length}</span>
              </h2>
              <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {members.map((developer) => (
                  <li key={developer.name} className="reveal">
                    <DeveloperCard developer={developer} />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
