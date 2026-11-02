import type { Metadata } from "next";
import { AlumniDirectory } from "@/features/alumni/AlumniDirectory";
import { AlumniMap } from "@/features/alumni/AlumniMap";
import { alumniData } from "@/features/alumni/data";

const title = "Alumni Network - Connect with RUET CSE Graduates";
const description =
  "Connect with RUET CSE alumni worldwide. Explore career paths, get mentorship, and discover job opportunities from successful CSE graduates working in top tech companies.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "RUET CSE Alumni",
    "Alumni Network",
    "CSE Graduates",
    "Career Guidance",
    "Mentorship",
    "Job Opportunities",
    "Tech Companies",
    "Professional Network",
    "RUET Alumni",
    "Computer Science Alumni",
    "Software Engineers",
    "Tech Careers",
  ],
  openGraph: {
    title: `${title} | RUET CSE Archive`,
    description:
      "Connect with RUET CSE alumni worldwide. Explore career paths, get mentorship, and discover job opportunities from successful CSE graduates.",
    url: "https://csearchive.vercel.app/alumni",
    images: [{ url: "/images/alumni-og-image.png", width: 1200, height: 630, alt: "RUET CSE Alumni Network" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | RUET CSE Archive`,
    description:
      "Connect with RUET CSE alumni worldwide. Explore career paths, get mentorship, and discover job opportunities from successful CSE graduates.",
    images: ["/images/alumni-twitter-image.png"],
  },
  alternates: { canonical: "https://csearchive.vercel.app/alumni" },
};

// Server component; only the Leaflet map is client code.
export default function AlumniPage() {
  const countries = new Set(alumniData.map((a) => a.country)).size;
  const series = alumniData.map((a) => Number(a.series)).filter(Number.isFinite);
  const stats = [
    { value: alumniData.length, label: "alumni listed" },
    { value: countries, label: "countries" },
    { value: `${Math.min(...series)}–${Math.max(...series)}`, label: "series" },
  ];

  return (
    <div className="page-container py-12 md:py-16">
      <header className="mx-auto mb-10 max-w-2xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-ink md:text-5xl">Global RUET</h1>
        <p className="mt-4 text-lg text-ink-soft">
          Where RUET CSE graduates are working and studying around the world. Select a marker to zoom in.
        </p>
        <dl className="mx-auto mt-8 grid max-w-lg grid-cols-3 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse items-center gap-1">
              <dt className="text-xs text-steel sm:text-sm">{s.label}</dt>
              <dd className="text-xl font-semibold whitespace-nowrap text-ink sm:text-2xl md:text-3xl">{s.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <div className="h-[60vh] min-h-96 overflow-hidden rounded-card border border-hairline shadow-card motion-safe:animate-pop-in">
        <AlumniMap />
      </div>

      <section aria-labelledby="directory-heading" className="mx-auto mt-14 max-w-4xl">
        <h2 id="directory-heading" className="mb-5 text-2xl font-semibold tracking-tight text-ink">
          Alumni by country
        </h2>
        <AlumniDirectory />
      </section>
    </div>
  );
}
