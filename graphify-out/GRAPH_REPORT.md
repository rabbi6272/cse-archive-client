# Graph Report - ruet-cse-archive  (2026-11-01)

## Corpus Check
- 147 files · ~91,973 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .ttf 3, .otf 2, (none) 1)

## Summary
- 868 nodes · 1854 edges · 47 communities (31 shown, 16 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 26 edges (avg confidence: 0.83)
- Token cost: 71,126 input · 0 output

## Community Hubs (Navigation)
- Admin Panel Pages
- Code Library UI
- Drive Admin API
- Firebase Init & Assistant
- Code Library Data Hook
- P2P Chat
- Statistics & Dashboard
- Authentication Workflow
- User Presence Tracking
- Resources Section
- Notion Design Tokens
- Runtime Dependencies
- Developers Page
- Firebase Obfuscation
- Dev Dependencies
- Alumni Map
- TypeScript Config
- Shelf Section
- Homepage Sections
- Navbar & Fonts
- PWA Manifest
- Drive File Viewer
- App Providers
- Notification Sound
- Page Title Manager
- ESLint Config
- SEO Helpers
- Drive Admin Page
- NPM Scripts
- Hero Blur Animation
- JS Path Config
- Redis Client
- Prism & ReactDOM
- Next Config
- Drive Metadata
- Firebase Admin Dep
- Google APIs Dep
- Highlight.js Dep
- Cloudinary Dep
- Speed Insights Dep
- PostCSS Config
- Vercel Cron
- Auth Utils Exports

## God Nodes (most connected - your core abstractions)
1. `react` - 51 edges
2. `next` - 48 edges
3. `firebase` - 33 edges
4. `AuthUtils` - 30 edges
5. `Notion Design System Analysis` - 19 edges
6. `Google Drive Cache System` - 18 edges
7. `compilerOptions` - 17 edges
8. `CommentSection()` - 15 edges
9. `presenceTracker` - 15 edges
10. `POST()` - 14 edges

## Surprising Connections (you probably didn't know these)
- `Google Site Verification File` --conceptually_related_to--> `Google Drive changes.watch`  [AMBIGUOUS]
  public/google21acdf70eb8d3f70.html → docs/drive-cache-system.md
- `UserActivityTracker()` --calls--> `formatTimeAgo()`  [EXTRACTED]
  app/admin/users/satealltime/page.jsx → lib/PresenceTracker.js
- `fetchCodeSnap()` --calls--> `CodeSnippetHelper`  [EXTRACTED]
  app/codelibrary/[id]/page.tsx → helpers/CodeSnippetHelper.js
- `getNameFromRoll()` --calls--> `getStudentName()`  [EXTRACTED]
  app/codelibrary/components/commentActions.ts → lib/students-loader.js
- `notify()` --calls--> `ensureCodelibraryAuth()`  [EXTRACTED]
  app/codelibrary/components/commentActions.ts → utils/CodelibraryDB.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Direct Login Authentication Flow** — docs_authentication_workflow_login_component, docs_authentication_workflow_users_node, docs_authentication_workflow_email_password_login, docs_authentication_workflow_firebaseauthservice, docs_authentication_workflow_anonymous_firebase_auth, docs_authentication_workflow_authutils, docs_authentication_workflow_local_session [EXTRACTED 1.00]
- **Drive Webhook Invalidation Flow** — docs_drive_cache_system_changes_watch, docs_drive_cache_system_api_drive_webhook, docs_drive_cache_system_webhook_validation, docs_drive_cache_system_changes_list, docs_drive_cache_system_page_token, docs_drive_cache_system_revalidate_tag, docs_drive_cache_system_unstable_cache [EXTRACTED 1.00]
- **Notion Hero Band Composition** — design_hero_band_dark, design_brand_navy, design_button_primary, design_button_secondary_on_dark, design_workspace_mockup_card [EXTRACTED 1.00]

## Communities (47 total, 16 thin omitted)

### Community 0 - "Admin Panel Pages"
Cohesion: 0.06
Nodes (37): AUTHORIZED_ADMINS, AdminMaintainPage(), ResourceCard(), HighlightCode(), HighlightCodeProps, useComments(), CodeSnapPage(), CodeSnippetDetail (+29 more)

### Community 1 - "Code Library UI"
Cohesion: 0.06
Nodes (56): CodeDisplay(), CodeDisplayProps, CodeLibraryBody(), StatisticsSidebar, CodeLibraryHeader(), createCommentActions(), generateId(), getNameFromRoll() (+48 more)

### Community 2 - "Drive Admin API"
Cohesion: 0.07
Nodes (54): AdminAction, AdminStatus, buildStatus(), ensureWatchEnv(), GET(), POST(), unauthorized(), VALID_ACTIONS (+46 more)

### Community 3 - "Firebase Init & Assistant"
Cohesion: 0.05
Nodes (18): getFirebaseDatabase(), initFirebaseApp(), ac_config, AssistantMessage, codelib_config, custom_config, CustomBuilder, detectThreadName() (+10 more)

### Community 4 - "Code Library Data Hook"
Cohesion: 0.09
Nodes (32): flattenDocs(), mergeById(), normalizeLanguage(), patchSnippetInFirestore(), useCodeLibrary(), fetchPage(), loadMore(), UseCodeLibraryReturn (+24 more)

### Community 5 - "P2P Chat"
Cohesion: 0.08
Nodes (37): P2PChatContext, useP2PChat(), EMOJI_CATEGORIES, EmojiPanel(), EMOJI_REACTIONS, getUserName(), MessageReactions(), detectLinks() (+29 more)

### Community 6 - "Statistics & Dashboard"
Cohesion: 0.10
Nodes (31): GET(), processNutrinosData(), StatisticsSidebar(), getNameFromRoll, Dashboard(), Page(), codeReviewers, getCurrentUser() (+23 more)

### Community 7 - "Authentication Workflow"
Cohesion: 0.13
Nodes (32): Firebase Anonymous Auth Session, Authentication Workflow, AuthProvider (AuthProvider.jsx), AuthUtils (lib/auth-utils-secure.js), Email/Password Direct Login, Firebase Client Setup (lib/firebase.js), FirebaseAuthService (lib/firebase-auth-service.js), Old Custom Token Route (removed) (+24 more)

### Community 8 - "User Presence Tracking"
Cohesion: 0.13
Nodes (9): UserActivityTracker(), ActiveUsersIndicator(), ActiveUsersList(), formatTimeAgo(), presenceTracker, updateCurrentPage(), useActiveSessions(), useActiveUsers() (+1 more)

### Community 9 - "Resources Section"
Cohesion: 0.13
Nodes (12): ResourceCardLinks(), ResourceCard(), ResourcesGridOptimized(), resourceImages, resourcesData, resourcesMetadata, ResourcesHeader(), Loading() (+4 more)

### Community 10 - "Notion Design Tokens"
Cohesion: 0.14
Nodes (24): badge-popular, Brand Navy (#0a1530), button-primary, button-secondary, button-secondary-on-dark, card-feature (pastel variants), card-feature-yellow-bold, Pastel Card Tints (+16 more)

### Community 11 - "Runtime Dependencies"
Cohesion: 0.09
Nodes (23): dependencies, chart.js@^4.5.0, date-fns@^4.1.0, firebase@^12.0.0, @google/generative-ai@^0.24.1, leaflet@^1.9.4, next@^16.2.2, postcss@^8.5.6 (+15 more)

### Community 12 - "Developers Page"
Cohesion: 0.11
Nodes (5): Developer, Developers(), staticDevelopers, ProfileCard, groupDevelopersByRole()

### Community 13 - "Firebase Obfuscation"
Cohesion: 0.20
Nodes (4): initializeFirebaseObfuscation(), firebaseCleaner, FirebaseStorageCleaner, FirebaseURLObfuscator

### Community 14 - "Dev Dependencies"
Cohesion: 0.13
Nodes (21): devDependencies, eslint@^9, eslint-config-next@15.3.5, tailwindcss@^4.1.11, @tailwindcss/postcss@^4.1.11, @types/node@^25.6.0, @types/react@^19.2.14, @types/react-dom@^19.2.3 (+13 more)

### Community 15 - "Alumni Map"
Cohesion: 0.19
Nodes (15): Alumni(), metadata, alumniData, Leafletmap(), MapContainer, Marker, Popup, TileLayer (+7 more)

### Community 16 - "TypeScript Config"
Cohesion: 0.10
Nodes (20): compilerOptions, allowJs, checkJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+12 more)

### Community 17 - "Shelf Section"
Cohesion: 0.14
Nodes (7): ShelfCardLinks(), ShelfCard(), shelfData, ShelfGrid(), ShelfHeader(), metadata, Shelf()

### Community 18 - "Homepage Sections"
Cohesion: 0.19
Nodes (10): ApkDownload(), FAQSection(), features, FeaturesList(), FooterComponent(), HeroImage(), HeroSection(), stats (+2 more)

### Community 19 - "Navbar & Fonts"
Cohesion: 0.19
Nodes (11): DesktopNavbarLinks(), MobileNavbarLinks(), Navbar(), ProfileCardProps, avegance, avengero, inter, jetbrainsMono (+3 more)

### Community 20 - "PWA Manifest"
Cohesion: 0.12
Nodes (15): background_color, categories, description, dir, display, icons, lang, name (+7 more)

### Community 21 - "Drive File Viewer"
Cohesion: 0.23
Nodes (11): DriveFilePreviewModal(), DriveFilePreviewModalProps, DriveViewSkeleton(), SkeletonRow(), DriveFile, DriveFolderData, DrivePage(), fetchDriveFiles() (+3 more)

### Community 22 - "App Providers"
Cohesion: 0.24
Nodes (8): P2PChatProvider(), Providers(), FirebaseObfuscationInit(), NoSSR(), dmSans, spaceGrotesk, metadata, RootLayout()

### Community 25 - "ESLint Config"
Cohesion: 0.25
Nodes (6): compat, __dirname, eslintConfig, __filename, @eslint/eslintrc@^3, @eslint/eslintrc

### Community 26 - "SEO Helpers"
Cohesion: 0.43
Nodes (3): SEOComponent(), generateWebsiteStructuredData(), seoConfig

### Community 27 - "Drive Admin Page"
Cohesion: 0.40
Nodes (5): AdminAction, AdminResponse, AdminStatus, detailsSummary(), DriveAdminPage()

### Community 28 - "NPM Scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, start, test-api-rotation

### Community 29 - "Hero Blur Animation"
Cohesion: 0.50
Nodes (4): buildKeyframes(), HeroBlurText(), framer-motion@^12.23.3, framer-motion

### Community 30 - "JS Path Config"
Cohesion: 0.40
Nodes (4): compilerOptions, jsx, paths, $schema

### Community 31 - "Redis Client"
Cohesion: 0.50
Nodes (3): getKv(), getRedisClient(), redis

### Community 32 - "Prism & ReactDOM"
Cohesion: 0.33
Nodes (4): prismjs@^1.30.0, react-dom@^19.0.0, prismjs, react-dom

## Ambiguous Edges - Review These
- `Google Drive changes.watch` → `Google Site Verification File`  [AMBIGUOUS]
  public/google21acdf70eb8d3f70.html · relation: conceptually_related_to

## Knowledge Gaps
- **7 isolated node(s):** `{
  getUserData,
  isAuthenticated,
  getUserRoll,
  getUserEmail,
  getUserName,
  isAdmin,
  logout,
  isSessionValid,
  refreshSession,
  setUserData,
  getStorageInfo,
}`, `Spacing System (4px base)`, `Responsive Breakpoints & Collapsing Strategy`, `Iteration Guide`, `button-secondary` (+2 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 241 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `Admin Panel Pages` to `Drive Admin API`, `Statistics & Dashboard`, `Resources Section`, `Runtime Dependencies`, `Developers Page`, `Dev Dependencies`, `Alumni Map`, `Shelf Section`, `Homepage Sections`, `Navbar & Fonts`, `Drive File Viewer`, `SEO Helpers`, `Drive Admin Page`?**
  _High betweenness centrality (0.227) - this node is a cross-community bridge._
- **What connects `{
  getUserData,
  isAuthenticated,
  getUserRoll,
  getUserEmail,
  getUserName,
  isAdmin,
  logout,
  isSessionValid,
  refreshSession,
  setUserData,
  getStorageInfo,
}`, `Spacing System (4px base)`, `Responsive Breakpoints & Collapsing Strategy` to the rest of the system?**
  _7 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Admin Panel Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.0584385226741468 - nodes in this community are weakly interconnected._
- **Why does `firebase` connect `Admin Panel Pages` to `Code Library UI`, `Firebase Init & Assistant`, `Code Library Data Hook`, `P2P Chat`, `Statistics & Dashboard`, `User Presence Tracking`, `Resources Section`, `Runtime Dependencies`, `Dev Dependencies`, `Alumni Map`?**
  _High betweenness centrality (0.181) - this node is a cross-community bridge._
- **Should `Code Library UI` be split into smaller, more focused modules?**
  _Cohesion score 0.0554954954954955 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Admin Panel Pages` to `Code Library UI`, `Code Library Data Hook`, `P2P Chat`, `Statistics & Dashboard`, `User Presence Tracking`, `Resources Section`, `Runtime Dependencies`, `Dev Dependencies`, `Alumni Map`, `Navbar & Fonts`, `Drive File Viewer`, `App Providers`, `Drive Admin Page`, `Hero Blur Animation`?**
  _High betweenness centrality (0.167) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Google Drive changes.watch` and `Google Site Verification File`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._