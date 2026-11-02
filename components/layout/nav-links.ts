export type NavLink = { label: string; href: string; external?: boolean };
export type NavGroup = { label: string; items: NavLink[] };
export type NavEntry = NavLink | NavGroup;

export const isGroup = (entry: NavEntry): entry is NavGroup => "items" in entry;

// One list for the desktop bar and the mobile menu.
export const navEntries: NavEntry[] = [
  { label: "Resources", href: "/resources" },
  { label: "Book Shelf", href: "/shelf" },
  { label: "Code Library", href: "/codelibrary" },
  { label: "Global Ruet", href: "/alumni" },
  {
    label: "Contact & Help",
    items: [
      { label: "Official Website", href: "https://www.ruet.ac.bd/", external: true },
      {
        label: "Facebook Page",
        href: "https://www.facebook.com/profile.php?id=61594261050819",
        external: true,
      },
      { label: "Contributors", href: "/contact&help/developers" },
    ],
  },
  {
    label: "Apps",
    items: [{ label: "RUET CSE 24", href: "https://students.ruetcsearchive.app/", external: true }],
  },
];
