import Link from "next/link";

const stats = [
  { value: "50+", label: "code snippets" },
  { value: "25+", label: "PDF resources" },
  { value: "150+", label: "alumni network" },
];

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="w-full px-6 sm:px-8 mx-auto max-w-6xl flex flex-col items-center text-center pt-24 sm:pt-32 pb-10"
    >
      {/* Eyebrow */}
      <p
        className="reveal text-xs sm:text-base font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400"
        style={{ "--reveal-delay": "0ms" }}
      >
        RUET · Department of Computer Science &amp; Engineering
      </p>

      {/* Headline */}
      <h1
        id="hero-heading"
        className="reveal mt-4 text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 tracking-tight"
        style={{ "--reveal-delay": "200ms" }}
      >
        Complete CSE Resources
      </h1>

      {/* Stats — the hero thesis */}
      <dl className="mt-10 grid grid-cols-3 gap-6 sm:gap-12 w-full max-w-2xl mx-auto">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="reveal flex flex-col items-center gap-1"
            style={{ "--reveal-delay": `${i * 100}ms` }}
          >
            <dd className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 leading-none">
              {stat.value}
            </dd>
            <dt className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
              {stat.label}
            </dt>
          </div>
        ))}
      </dl>

      {/* Description */}
      <p
        className="reveal mt-6 max-w-2xl text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed"
        style={{ "--reveal-delay": "300ms" }}
      >
        A growing archive of study notes, code libraries and alumni guidance,
        maintained by RUET CSE students and organized for the students who
        come after them.
      </p>

      {/* CTA */}
      <div
        className="reveal mt-10 flex flex-col sm:flex-row items-center gap-4"
        style={{ "--reveal-delay": "400ms" }}
      >
        <Link
          href="/resources"
          className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-blue-600 text-white text-base font-semibold hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
        >
          Browse study resources
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
            />
          </svg>
        </Link>
        <Link
          href="/codelibrary"
          className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-gray-400 dark:border-gray-600 text-gray-900 dark:text-gray-100 text-base font-semibold hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          Open the code library
        </Link>
      </div>
    </section>
  );
}
