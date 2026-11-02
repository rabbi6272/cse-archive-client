# UI/UX Upgrade Plan

How to move the client to the design system in [`DESIGN.md`](../DESIGN.md), and the order to do it in.

## Read this first: adapt DESIGN.md, don't copy Notion

`DESIGN.md` is an analysis of Notion's marketing site. Use its *system*: the token scale, 8px buttons and 12px cards, quiet hairline borders, pastel tinted cards, 4px spacing grid and type scale. Don't use its *brand*:

- **Font:** "Notion Sans" is Notion's own typeface. Use **Inter**, which `app/fonts.js` already loads.
- **Primary color:** the Notion purple `#5645d4` is Notion's signature color. Pick our own. Our existing navy `#071a26` (the dark background and `theme-color`) already fits the `brand-navy` role, so keep it. Choose one primary accent (for example a blue or teal from our logo) and run it through a contrast check.
- **Dark mode:** DESIGN.md has no dark tokens (see its "Known Gaps"), but the site uses `dark:` 1,041 times. We have to define the dark values ourselves.

These are settled in [Phase 0](#phase-0-decisions-done-2026-11-02) at the end of this doc.

## Where we are now

| Area | Current state |
|---|---|
| Styling | Tailwind v4, one 966-line `app/globals.css`. The `@theme` block only holds animations, with no color, radius or font tokens. |
| Colors | Raw Tailwind palette: `gray` 1,765 uses, `blue` 422, `indigo` 182, `red` 176, `green` 140, plus hardcoded hex like `bg-[#071a26]` (18). 50 gradients. |
| Fonts | 8 fonts defined in `app/fonts.js` (Inter, Lato, Nunito, DM Sans, Space Grotesk, JetBrains Mono, plus 2 local display fonts), and Orbitron and Fira Code loaded from Google Fonts in `layout.jsx`. Body text uses DM Sans. |
| Icons | Font Awesome 6 from a CDN `<link>`, 189 class uses. |
| Radius | No rule. `rounded-lg` and `rounded-full` 198 each, `rounded` 59, `rounded-md` 30, `rounded-xl` 26, `rounded-2xl` 12. |
| Dark mode | Follows the OS through Tailwind's default `prefers-color-scheme`. Users can't switch it. |
| States | One global `app/loading.jsx` and `not-found.jsx`. Only Drive has a skeleton. No `error.jsx`. One `alert()` left; elsewhere `react-hot-toast`. |
| Accessibility | 27 `outline-none` and only 6 `focus-visible:` styles, so keyboard focus is mostly invisible. About 11 `<img>`/`<Image>` with no `alt`. |
| Shared UI | No button, card, input or badge component. Every page styles its own. |

## Steps

Each step can ship on its own. Do them in order: steps 1–3 make every later step a matter of swapping class names.

### 1. Define the tokens

Put the DESIGN.md tokens into the `@theme` block in `app/globals.css`, so Tailwind generates classes from them (`bg-primary`, `text-ink`, `border-hairline`, `rounded-card`):

- **Colors:** `primary` (+ pressed), `brand-navy` (`#071a26`), `canvas`, `surface`, `surface-soft`, `hairline` (+ soft and strong), the text ramp (`ink`, `charcoal`, `slate`, `steel`, `stone`, `muted`), the 6 `card-tint-*` pastels, and `success` / `warning` / `error`.
- **Dark mode:** a second set of values for the same names under a `.dark` selector. Switch to a class-based dark variant (`@custom-variant dark (&:where(.dark, .dark *))`) so users can choose.
- **Radius:** `--radius-button: 8px`, `--radius-card: 12px`, plus `full` for pills and badges.
- **Shadows:** the 4 elevation levels from DESIGN.md.
- **Font:** moved to step 2. `font-sans` and `font-mono` are already used in 5 places, so setting them would change those now.

Nothing on screen changes in this step.

**Done (2026-11-02).** Tokens are in `app/globals.css`: CSS variables on `:root` and `.dark`, mapped through `@theme inline`. An inline script in `app/layout.jsx` sets `.dark` on `<html>` before paint, from `localStorage.theme` or the OS setting. DESIGN.md's `slate` and `stone` are named `ink-soft` and `ink-faint`, because Tailwind already has `slate-*` and `stone-*` scales. Side effect: the `.dark .hljs` and `.dark .ai-chat-container` rules in `globals.css`, which never matched before, now apply in dark mode.

### 2. Cut fonts and icons

- Set `--font-sans` (Inter) and `--font-mono` (JetBrains Mono) in `@theme`, and put the font variables on `<html>`.
- Use Inter for all UI text, and one mono font for code. Remove the other 6 font definitions and the Orbitron `<link>`. Keep a local display font only if the logo needs it.
- Replace the Font Awesome CDN stylesheet with an icon library that ships only the icons you use (for example `lucide-react`). It's 189 uses. Do it page by page in step 5, but add the library now.

This removes several font downloads and a render-blocking CSS file from every page.

**Done (2026-11-02), except swapping the icons.** `app/fonts.js` exports only Inter and JetBrains Mono. Their variables are on `<html>`, and `--font-sans` / `--font-mono` in `@theme` point at them, so every page inherits Inter. Removed: the per-component Lato, Nunito, Inter and Avengeance classes, the Space Grotesk headings on the homepage, the Orbitron/Fira Code `<link>` in `layout.jsx` and the `@import` in `not-found.jsx`, the never-loaded Montserrat rules, and 4 of the 5 files in `public/fonts/`. Exception: `AvengeanceHeroicAvengerItalic.otf` is kept as the display font for the developers page heading ("The Avengers"). `lucide-react` is installed. Font Awesome stays loaded until step 5 replaces its 189 uses page by page.

### 3. Build the shared components

In `components/ui/` (the shared folder from [restructure-plan.md](restructure-plan.md)), built only on the step 1 tokens. Every one of them needs a visible `focus-visible` ring and a disabled state.

| Component | From DESIGN.md | Replaces |
|---|---|---|
| `Button` (primary, secondary, ghost, dark, link) | `button-*` | The hand-styled buttons on every page |
| `Card` (base, feature, tinted) | `card-base`, `card-feature`, `card-feature-*` | Resource, shelf, snippet and alumni cards |
| `Input`, `Textarea`, `SearchInput` | `text-input`, `search-pill` | Login, create-snippet and admin forms |
| `Badge` / `Tag` | `badge-*`, `badge-tag-*` | Role badges, course tags |
| `Tabs` (pill and underline) | `pill-tab`, `segmented-tab` | Dashboard and code library tabs |
| `Skeleton`, `EmptyState`, `ErrorState` | — | Ad-hoc spinners and blank screens |
| `Modal` | elevation level 4 | `ChatModals`, poll modals, Drive preview |

**Done (2026-11-02).** In `components/ui/`, imported as `import { Button, Card } from "@/components/ui"`. `Button` also exports `buttonClasses()` for links styled as buttons. `Input` and `Textarea` take `label`, `hint` and `error` props, wired up for screen readers. `Modal` uses the native `<dialog>`, which handles focus trapping, Esc and returning focus. `Tabs` supports arrow keys, Home and End. The preview page is `/dev/ui` (404 in production), with a theme toggle.

Add a `/dev/ui` page that renders every variant in light and dark. Remove it from the production build, or put it behind the admin check once that check runs on the server.

### 4. Redo the layout shell

- **Navbar:** a sticky 64px white bar with a `hairline` bottom border (navy in dark mode) and a hamburger menu below 1024px. Add a light/dark/system theme switch.
- **Footer:** link columns, collapsing to an accordion on mobile.
- **Page container:** 1280px max width with 32px gutters (16px on mobile), and the DESIGN.md section spacing (64px / 96px).
- **Page states:** add `error.tsx` next to `loading.tsx`, and give `not-found.tsx` the new look.

**Done (2026-11-02).** All in TypeScript, in `components/layout/`:
- `Navbar` replaces `app/components/home/navbar/*` and `app/mainPage.jsx`. It's solid all the time now (the old bar was see-through until you scrolled). The links come from one list in `nav-links.ts`. Dropdowns open on click and close on Esc or a click outside (the old ones opened on hover only, so keyboards couldn't reach them). Below 1024px a `MobileMenu` drawer on `<dialog>` takes over. `ThemeToggle` cycles system → light → dark and saves the choice in `localStorage.theme`. `AccountButton` is the old login button without the shine effect.
- `Footer` replaces `app/components/home/footer.jsx`. It's still only on the home page: moving it into the layout would put it under full-height pages like chat. Its 3 columns of 2 links fit in a 2-column grid on mobile, so there's no accordion.
- `page-container` (in `globals.css`) is the 1280px / 16–32px gutter wrapper. Use it on every page in step 5.
- `app/error.tsx` is new; `loading.tsx` and `not-found.tsx` are rewritten. The layout has a "Skip to content" link to `#main`.
- `layout.jsx` and `page.jsx` are now `.tsx`. The old navbar CSS is removed (`.dropdown`, `.mobile-navbar`, `.shiny-text` and their keyframes).
- Not changed: the `<body>` background is still `bg-gray-100 dark:bg-[#071a26f1]`, so pages that haven't been moved over keep their look. Change it to tokens once step 5 is done.
- Found: `globals.css` overrides Tailwind's `.animate-pulse` and `@keyframes pulse` (the code library relies on that), so `Skeleton` uses its own `animate-skeleton`.

### 5. Move pages over, by traffic

Swap each page to the shared components and tokens, and replace Font Awesome icons as you go. Each page is one PR. Suggested order (check Vercel Analytics to confirm which pages get the most visits):

1. **Home** (`app/page.jsx`): navy hero band, a primary + secondary CTA pair, features as tinted cards, FAQ as `faq-accordion-item`. **Done (2026-11-02):** the sections now live in `features/home/`. `app/components/home/` is gone, including the unused `slideshow.jsx` and `hero-blur-text.jsx`. The FAQ uses native `<details>`, the hero photo overlaps the navy band, and `.reveal` respects reduced motion. Added: an `on-dark` `Button` variant and an `on-navy-accent` color token (9.8:1 on navy).
2. **Resources and Drive:** cards for courses, a cleaner file list, Drive skeleton made with the shared `Skeleton`, empty-folder and error states. **Done (2026-11-02):** in `features/resources/` and `features/drive/`. Resources renders on the server; semesters without a link show "Coming soon" instead of a toast, and it no longer imports Firebase. Each Drive folder has its own URL (`/drive/<id>`), so refresh, browser Back and sharing keep your place. File names are keyboard-reachable buttons, rows show size and date, and the preview is a `<dialog>`. Added: a global scroll lock for open modal dialogs. Deleted: `app/components/resources/`, `app/drive/metadata.js` (unused), the old Drive skeleton/modal and their CSS.
3. **Code library** (list and `[id]`): `SearchInput`, tag badges, snippet cards, a code block on the mono font. **Done (2026-11-02):** in `features/codelibrary/`. List and detail pages are server components. `server.ts` reads Firestore over REST after an anonymous sign-in (the rules need auth, and the admin SDK is for another project), cached for 2 minutes. Search, language and page are URL params (`?q=&lang=&page=`), filtered on the server. Syntax highlighting runs on the server (no highlight.js in the browser). Long code uses a CSS-only "Show all lines" toggle. Client islands: `Filters`, `LikeButton`, `CopyButton`, and the stats sidebar (only mounted at lg+). Like/copy counts now increment the value stored in Firestore. Detail pages have real titles and descriptions. **Bug fixed:** `lib/codelibrary/seo.ts` read Firestore without signing in, so the sitemap and RSS feed were empty; they now list all snippets. Left alone: `StatisticsSidebar.jsx` (old styling) and the comment feature (`CommentSection.tsx`, `commentActions.ts`, `useComments.ts`), which isn't rendered yet. It will be connected later, see [comments-plan.md](comments-plan.md).
4. **Shelf, Alumni, Developers:** card grids. Alumni keeps the Leaflet map with the new card style. **Done (2026-11-02):** all three are server components.
   - **Shelf:** shares `components/cards/CoverCard.tsx` with Resources.
   - **Developers:** `features/developers/`. Cards hide `#` placeholder links, and the brand icons are inline SVGs (`components/icons/BrandIcons.tsx`, since lucide v1 has no brand logos).
   - **Alumni:** `features/alumni/`. The page and a server-rendered "Alumni by country" directory are server components; only the Leaflet map (`MapView.tsx`, loaded with `ssr: false`) runs in the browser. **Bug fixed:** CARTO basemap tiles now require an API key, so every tile showed "API KEY REQUIRED"; the map now uses Esri World Street Map tiles. Popups follow the theme.
   - Deleted the old shelf/alumni/profile-card components (including the unused `profileCard.jsx`) and their CSS. Added `@types/leaflet`.
5. **User area** (login, dashboard, notifications, create-snippet): forms on `Input` / `Button` with inline validation instead of `alert()`.
6. **Chat:** only after step 5 of the restructure plan splits `P2PChat.jsx` and `GroupChat.jsx` (~5,000 lines). Restyling them before that means doing the work twice.
7. **Admin pages:** last, since only admins see them.

Rule while moving pages: no new raw palette classes (`bg-gray-100`, `text-blue-600`) or hex values. Only tokens.

### 6. Accessibility pass

- Every interactive element shows a focus ring. Remove `outline-none` unless the element sets its own `focus-visible` style.
- `alt` text on every image (empty `alt=""` for decorative ones), and `aria-label` on icon-only buttons.
- Contrast: body text at 4.5:1 or better in both themes. Check the pastel tints with `charcoal` text, and `steel`/`stone` text on `surface`.
- Touch targets at least 44px on mobile (DESIGN.md already sizes buttons and inputs at 40–44px).
- Respect `prefers-reduced-motion`: turn off the `.reveal` scroll animations and the glow/pulse keyframes for those users.

### 7. Clean up

- Delete the `globals.css` rules nothing uses any more (glow, shimmer and pulse keyframes, the `.outer-div` flip-card rules, old variables in `:root`) as each page stops using them.
- Remove unused font files from `public/fonts/` and fonts left in `app/fonts.js`.
- Add a lint check (ESLint rule or a simple grep in CI) that fails on `bg-[#`, `text-[#` and raw palette classes in new code.

## How to check each step

- Compare screenshots of the page before and after, in light and dark mode, at 375px, 768px and 1280px wide.
- Run Lighthouse on the page: Accessibility should not drop, and should reach 95+ by step 6.
- Use the page with the keyboard only: every action reachable, focus always visible.

## Phase 0: decisions (done 2026-11-02)

| Decision | Choice | Why |
|---|---|---|
| Primary accent | **Blue `#2563eb`** (pressed `#1d4ed8`) | Already the homepage accent (`blue-600`) and the favicon color. White text on it is 5.17:1. |
| Brand navy | **`#071a26`** | Already the dark background and `theme-color`. |
| Fonts | **Inter only**, plus **JetBrains Mono** for code | No display font. Removes Lato, Nunito, DM Sans, Space Grotesk, Orbitron, Fira Code and the 2 local fonts. |
| Icons | **lucide-react** | Outline style fits DESIGN.md. Only imported icons ship. |
| Chat | **Wait** for restructure step 5 (chat split) | Avoids restyling 5,000 lines twice. |

### Color tokens

Contrast is checked against WCAG AA (4.5:1 for normal text). Values that differ from DESIGN.md are marked *.

| Token | Light | Dark | Use |
|---|---|---|---|
| `primary` | `#2563eb`* | `#2563eb` | Main buttons, active tab, focus ring |
| `primary-pressed` | `#1d4ed8`* | `#1d4ed8` | Pressed state |
| `link` | `#2563eb`* | `#60a5fa` | Inline links (5.17 / 6.97) |
| `brand-navy` | `#071a26`* | `#071a26` | Hero band |
| `canvas` | `#ffffff` | `#071a26` | Page background |
| `surface` | `#f6f5f4` | `#0c2433` | Section backgrounds, inputs at rest |
| `surface-soft` | `#fafaf9` | `#0a1f2c` | Quieter sections |
| `hairline` | `#e5e3df` | `#1e3a4c` | Borders, dividers |
| `hairline-strong` | `#c8c4be` | `#2c4a5e` | Input borders |
| `ink` | `#1a1a1a` | `#f1f5f9` | Headings, body |
| `charcoal` | `#37352f` | `#e2e8f0` | Text on tinted cards |
| `ink-soft` (DESIGN.md `slate`) | `#5d5b54` | `#b4c0cc` | Secondary text |
| `steel` | `#696762`* | `#8b9bab` | Tertiary text, footer links (≥5.19 / ≥5.60) |
| `ink-faint` (DESIGN.md `stone`) | `#a4a097` | `#6b7d8f` | **Disabled and decorative only.** Fails AA as text (2.39–4.18). |
| `error` | `#c92a2a`* | `#f87171` | Errors (≥5.01 / ≥5.77) |
| `success` | `#15803d`* | `#4ade80` | Success |
| `warning` | `#c2410c`* | `#fb923c` | Warnings |
| `tint-peach` | `#ffe8d4` | `#3b2618` | Tinted cards. `charcoal` text on every tint is ≥9.5:1 in both themes. |
| `tint-rose` | `#fde0ec` | `#3a1d2c` | |
| `tint-mint` | `#d9f3e1` | `#14301f` | |
| `tint-lavender` | `#e6e0f5` | `#251f3d` | |
| `tint-sky` | `#dcecfa` | `#132b42` | |
| `tint-yellow` | `#fef7d6` | `#33300f` | |

DESIGN.md's `success` and `warning` (`#1aae39`, `#dd5b00`) fail AA as text on white, so they're darkened. Its `brand-*` accent colors (pink, orange, purple, teal) aren't carried over, because the tints cover decorative color.
