import Image from "next/image";
import Link from "next/link";
import { cn, focusRing } from "@/components/ui";
import { AccountButton } from "./AccountButton";
import { MobileMenu } from "./MobileMenu";
import { NavDropdown, navItemClasses } from "./NavDropdown";
import { NavLink } from "./NavLink";
import { ThemeToggle } from "./ThemeToggle";
import { isGroup, navEntries } from "./nav-links";

// Server component: sticky 64px bar; links collapse into MobileMenu below lg (1024px).
// Interactive pieces (NavLink, NavDropdown, ThemeToggle, AccountButton, MobileMenu) are client islands.
export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-canvas/90 backdrop-blur-md">
      <div className="page-container flex h-16 items-center justify-between gap-4">
        <Link href="/" className={cn("shrink-0 rounded-button", focusRing)}>
          <Image src="/images/logo.png" alt="RUET CSE Archive home" width={71} height={40} priority />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navEntries.map((entry) => (
              <li key={entry.label}>
                {isGroup(entry) ? (
                  <NavDropdown group={entry} />
                ) : (
                  <NavLink href={entry.href} className={navItemClasses}>
                    {entry.label}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          <AccountButton />
        </div>

        <div className="lg:hidden">
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
