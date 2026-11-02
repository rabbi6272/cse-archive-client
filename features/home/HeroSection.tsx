import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonClasses } from "@/components/ui";
import campus from "@/public/images/slideshow/image0.jpg";
import { revealDelay } from "./reveal";

const stats = [
  { value: "50+", label: "code snippets" },
  { value: "25+", label: "PDF resources" },
  { value: "150+", label: "alumni network" },
];

// Navy band with the headline; the campus photo overlaps its bottom edge (DESIGN.md hero-band-dark).
export function HeroSection() {
  return (
    <section aria-labelledby="hero-heading">
      <div className="bg-brand-navy pt-20 pb-40 text-white sm:pt-28 md:pb-56">
        <div className="page-container flex flex-col items-center text-center">
          <p
            className="reveal text-[11px] font-semibold tracking-[0.2em] text-on-navy-accent uppercase sm:text-sm"
            style={revealDelay(0)}
          >
            RUET · Department of Computer Science &amp; Engineering
          </p>

          <h1
            id="hero-heading"
            className="reveal mt-4 text-4xl leading-[1.05] font-semibold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
            style={revealDelay(150)}
          >
            Complete CSE Resources
          </h1>

          <p
            className="reveal mt-6 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg"
            style={revealDelay(250)}
          >
            A growing archive of study notes, code libraries and alumni guidance, maintained by RUET
            CSE students and organized for the students who come after them.
          </p>

          <div
            className="reveal mt-10 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center"
            style={revealDelay(350)}
          >
            <Link href="/resources" className={buttonClasses("primary")}>
              Browse study resources
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link href="/codelibrary" className={buttonClasses("on-dark")}>
              Open the code library
            </Link>
          </div>

          <dl className="mt-14 grid w-full max-w-2xl grid-cols-3 gap-4 sm:gap-12">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="reveal flex flex-col-reverse items-center gap-1"
                style={revealDelay(400 + i * 100)}
              >
                <dt className="text-xs text-white/70 sm:text-sm">{stat.label}</dt>
                <dd className="text-3xl leading-none font-semibold md:text-4xl">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="page-container -mt-28 md:-mt-40">
        <Image
          src={campus}
          alt="RUET CSE campus"
          priority
          sizes="(min-width: 1280px) 1216px, 100vw"
          className="reveal mx-auto h-auto w-full max-w-5xl rounded-card border border-hairline object-cover shadow-mockup"
        />
      </div>
    </section>
  );
}
