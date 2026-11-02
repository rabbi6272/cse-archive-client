# Project Restructure Plan

How to reorganize ruet-cse-archive by feature, and the order to do it in.

## Current problems

1. **Code for one feature is spread over 5 folders.** The code library alone lives in `app/codelibrary/components/`, `lib/codelibrary/`, `utils/CodelibraryDB.ts`, `helpers/CodeSnippetHelper.js` and `types/comment.ts`. Nothing tells you where new code should go.
2. **The folder names overlap.** `lib/`, `lib/helper/`, `utils/`, `helpers/` and `db/` all mean "shared code". `db/students_info.js` is static data, while `utils/*DB` is database setup.
3. **`app/components/` mixes shared and single-use components.** Chat (`user/P2PChat.jsx`), the homepage and the alumni map sit beside truly shared UI (`ui/`).
4. **Two auth modules exist side by side.** `lib/auth-utils.js` (3 imports) and `lib/auth-utils-secure.js` (24 imports).
5. **Some files are too big.** `P2PChat.jsx` is 2,517 lines and `GroupChat.jsx` 2,492, and they likely repeat a lot of each other. `CommentSection.tsx` (844 lines) and `PollComponent.jsx` (867 lines) are also large.
6. **There is code to delete.** `app/components/home/slideshow.jsx` is never imported. `lib/firebase-url-obfuscator.js` and `lib/firebase-storage-cleaner.js` protect nothing, because Firebase web config is public by design.
7. **JavaScript and TypeScript are mixed with no rule.** The newer Drive and code library code is `.ts`, the older code is `.jsx`.
8. **The app uses 4 separate Firebase projects:**

   | Service | Project | Database |
   |---|---|---|
   | Main app (chat, presence, notifications) | `cse-archive-codes` | Realtime DB |
   | Users / login | `ruet-cse-24` | Firestore |
   | Comments | `cse-archive-comments` | Realtime DB |
   | Code library | set in env vars | Firestore |

   Each project signs the visitor in separately, so the same person has a different user ID in each one. Security rules can only check "someone is signed in" (`auth != null`), and the server (`lib/firebase-admin.ts`) can reach only one of the projects.

## Security issues (fix first)

- **The main Realtime Database is open to everyone (most urgent).** Found 2026-11-02: unauthenticated REST requests to `https://cse-archive-codes-default-rtdb.firebaseio.com/<path>.json` can read *and delete* any path (chats, notifications, `userNutrinos`, `presence`, `activeSessions`). The rules actually deployed don't match `database.rules.json`, which requires `auth != null`. Deploy the repo's rules (`firebase deploy --only database`), then check that a request with no `?auth=` gets 401.
- **Anyone can read every user's pincode.** `app/components/user/Login.jsx` looks up the user record in the browser and compares `pincode` to the typed password on the client, so the browser must be allowed to read the user records.
- ~~**Admin access is only checked in the browser.**~~ **Fixed 2026-11-02:** all admin tools are on one page, `/admin`. Login checks `ADMIN_SECRET` on the server and sets an httpOnly HMAC-signed cookie (`features/admin/session.ts`). `proxy.ts` guards every `/admin/*` path, and each admin Server Action calls `requireAdmin()`. Drive actions call the Drive server with `ADMIN_SECRET` from the server. Alumni input is validated on the server (`features/admin/alumni.ts`, tested in `alumni.test.ts`). The hard-coded password `bittoismad` is gone from the client. Remaining gap: the Realtime DB itself is still open (see the first item), and after its rules are locked down the admin page needs `CODES_DATABASE_AUTH` for its server-side REST calls.

## Target structure

```
app/                         # routes only: page.tsx, layout.tsx, route.ts. Thin, they call into features/
  (public)/                  # home, alumni, resources, shelf, contact-help, drive
  (user)/user/...            # login, dashboard, notifications, create-snippet
  admin/...                  # protected by middleware.ts
  codelibrary/...
  api/...                    # statistics, plus new auth/login and admin/*

features/                    # one folder per product area, owns everything it needs
  auth/          components/ hooks/ server.ts service.ts
  codelibrary/   components/ hooks/ db.ts seo.ts types.ts
  comments/      components/ hooks/ db.ts types.ts
  chat/          components/ (shared ChatWindow, MessageList, Composer) hooks/ db.ts
  presence/      PresenceTracker.ts components/
  notifications/ components/ hooks/ sound.ts title.ts
  polls/         components/ db.ts
  drive/         components/ (the API, cache and webhook live in ../cse-archive-server/; see drive-cache-system.md)
  alumni/        data.ts components/ (LeafletMap)
  developers/    utils.ts components/
  home/          components/ (hero, features, faq, footer, apk-download)

components/                  # truly shared UI only: navbar, ui/, providers/, seo
lib/                         # infrastructure only
  firebase/client.ts         # one initializeApp; exports db (RTDB), firestore, auth
  firebase/admin.ts
  redis.ts
  seo-config.ts
data/                        # static data: students_info, resources, shelf
middleware.ts                # route guard for admin and user pages, via a session cookie
```

### Rules

- **`app/` holds routes only.** A page imports from `features/` and stays under about 100 lines.
- **Features don't import from each other's internals.** Code that two features need moves to `components/` or `lib/`.
- **One way to connect to Firebase.** All of it goes through `lib/firebase/client.ts`.
- **Anything that checks secrets or roles runs on the server.** That covers login, admin actions and pincode checks, in API routes or server actions behind `middleware.ts`.
- **New files are `.ts`/`.tsx`.** Convert old files when you touch them. Don't rewrite everything at once.

## Order of work

Each step can ship on its own.

1. **Fix the security issues.** Move login to Firebase Auth (email/password) or a server route, and make the Firestore rules deny clients access to `pincode`. Check admin roles on the server in `middleware.ts`, not against a list in the page.
2. **Delete dead code.** Remove `slideshow.jsx`, `lib/helper/ultimate.js` (nothing imports it), the obfuscator and storage cleaner, and whichever of the two `auth-utils` files you are dropping.
3. **Merge the shared-code folders.** `utils/`, `helpers/`, `lib/helper/` and `db/` go into `lib/` and `data/`. This is mostly moving files and updating imports.
4. **Move one feature into `features/`.** Start with the code library, since its code is already mostly together, and use it as the pattern for the rest.
5. **Split up chat.** Pull the parts P2P and group chat share into `features/chat/components/`. This should remove most of the ~5,000 lines.
6. **Merge the Firebase projects into one.** Use one project with one sign-in: Realtime DB for chat, presence and comments, Firestore for the code library and users. Skip this step only if you need the extra free-tier limits that separate projects give, and if you outgrow the free tier, the Blaze (pay-as-you-go) plan is likely cheaper than keeping four projects in sync.
7. **Convert to TypeScript gradually,** as files are touched.

## Not yet checked

- The current Firestore security rules.
- Firebase usage and billing numbers, which would show whether the extra free-tier limits from separate projects are needed at all.
