import Image from "next/image";
import Link from "next/link";
import { cn, focusRing } from "@/components/ui";

type FooterLink = { label: string; href: string; external?: boolean };

const columns: { title: string; links: FooterLink[] }[] = [
  {
    title: "About",
    links: [
      { label: "RUET", href: "https://www.ruet.ac.bd/", external: true },
      { label: "RUET CSE", href: "https://www.cse.ruet.ac.bd/", external: true },
    ],
  },
  {
    title: "Follow us",
    links: [
      { label: "Facebook", href: "https://www.facebook.com/RUETOfficial/", external: true },
      { label: "Discord", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms & Conditions", href: "#" },
    ],
  },
];

const linkClasses = cn("rounded-sm text-sm text-steel hover:text-ink hover:underline", focusRing);

export function Footer() {
  return (
    <footer className="border-t border-hairline bg-canvas">
      <div className="page-container flex flex-col gap-10 py-12 md:flex-row md:justify-between md:py-16">
        <div className="flex items-center gap-4">
          <Image src="/images/lg/ruet.png" alt="RUET logo" width={56} height={56} />
          <Image src="/images/logo.png" alt="RUET CSE Archive logo" width={100} height={56} />
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-16">
          {columns.map((col) => (
            <div key={col.title}>
              <h2 className="mb-4 text-[11px] font-semibold tracking-widest text-ink uppercase">
                {col.title}
              </h2>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      {...(link.external && { target: "_blank", rel: "noopener noreferrer" })}
                      className={linkClasses}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-hairline">
        <p className="page-container py-6 text-center text-sm text-steel">
          © 2025{" "}
          <Link href="/contact&help/developers" className={linkClasses}>
            Avengers - CSE&apos;24
          </Link>
        </p>
      </div>
    </footer>
  );
}
