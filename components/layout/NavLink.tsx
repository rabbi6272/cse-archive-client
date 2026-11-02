"use client";

import type { ComponentProps } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// The only client part of a top-level nav link: marking the current section.
export function NavLink({ href, ...props }: ComponentProps<typeof Link> & { href: string }) {
  const pathname = usePathname();
  return (
    <Link href={href} aria-current={pathname.startsWith(href) ? "page" : undefined} {...props} />
  );
}
