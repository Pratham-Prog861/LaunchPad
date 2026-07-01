# LaunchPad — LaunchPad Implementation Plan

Build a production-grade, schema-driven CMS ("LaunchPad") on an existing Next.js 15 + TypeScript + Tailwind CSS + shadcn/ui + Clerk scaffold. The Stitch UI/UX from the **"LaunchPad"** project is the single source of truth for all design decisions.

## Stitch Design System Summary

The Stitch project defines 9 screens:

| #   | Screen Title        | Purpose                                                                   |
| --- | ------------------- | ------------------------------------------------------------------------- |
| 1   | **Login**           | Clerk-powered sign-in page                                                |
| 2   | **Dashboard**       | Overview: recent pages, quick actions, activity feed                      |
| 3   | **Pages**           | Page list with status chips (Draft/Published), search, filters            |
| 4   | **Studio Editor**   | WYSIWYG-lite editor: section list, add/reorder/edit Hero & CTA            |
| 5   | **Preview**         | Full rendered page preview at `/preview/[slug]`                           |
| 6   | **Publish Dialog**  | Deterministic SemVer bump selector (Patch/Minor/Major) with release notes |
| 7   | **Role Management** | RBAC management UI: Viewer, Editor, Publisher                             |
| 8   | **Releases**        | Immutable release history with snapshot viewer                            |
| 9   | **Settings**        | Contentful integration, environment configuration                         |

**Design tokens** (from Stitch `designTheme`):

- **Primary**: `#4F46E5` (Indigo) — actions, focus rings, accents
- **Font**: Inter for all UI; JetBrains Mono for code/IDs
- **Radii**: 8px (rounded-lg) for standard components, 12-16px for cards/containers
- **Surface hierarchy**: White `#FFFFFF` canvas, `#F9FAFB` sidebars, `#E5E7EB` borders
- **Spacing**: 8px grid, generous whitespace
- **Elevation**: Tonal layers + low-contrast outlines; ambient shadows on hover only

---

## User Review Required

> [!IMPORTANT]
> **Contentful CMS**: This plan implements a Contentful adapter with support for both published and draft content. You will need to provide your Contentful Space ID and API tokens (Delivery + Preview). They will go in `.env.local`. If you don't have a Contentful space yet, the adapter will fall back to in-memory mock data so you can still develop and test.

> [!IMPORTANT]
> **Clerk Roles**: The plan creates three custom roles in Clerk: `org:viewer`, `org:editor`, `org:publisher`. These map to the RBAC requirements (Viewer, Editor, Publisher). This requires Organizations to be enabled in your Clerk dashboard. The implementation will use the Clerk CLI to verify configuration.

> [!WARNING]
> **Database**: Draft persistence and release snapshots are stored via a JSON-file-based adapter during development. For production, you'd swap to a proper database (Postgres/Turso). The adapter pattern makes this a clean swap. Is this acceptable, or do you want a real database from day one?

## Open Questions

> [!IMPORTANT]
> **Contentful Content Model**: Do you already have a Contentful space with content types for `Page`, `HeroSection`, and `CtaSection`? If not, the plan includes creating mock adapters that simulate the Contentful API shape so development can proceed immediately.

> [!IMPORTANT]
> **Vercel Project**: Do you have an existing Vercel project linked, or should the plan include `vercel link` setup? The deployment configuration will be created regardless.

---

## Proposed Changes

The implementation is organized into 8 phases, each building on the previous.

---

### Phase 1 — Foundation & Design System

Set up the design tokens, install required dependencies, and configure the theme to match the Stitch design system exactly.

#### [MODIFY] [globals.css](file:///c:/Users/Pratham/Desktop/Development/launchpad/src/app/globals.css)

- Override CSS variables to match Stitch Indigo design tokens
- Primary colors mapped to `#4F46E5` / Indigo palette
- Surface hierarchy: white canvas, gray-50 sidebar, gray-200 borders
- Add Inter + JetBrains Mono font imports

#### [MODIFY] [layout.tsx](file:///c:/Users/Pratham/Desktop/Development/launchpad/src/app/layout.tsx)

- Update metadata (title: "LaunchPad", description)
- Configure `ClerkProvider` with `appearance` prop for shadcn theme
- Add JetBrains Mono font import
- Add proper `<html lang="en">` with correct classes

#### [MODIFY] [package.json](file:///c:/Users/Pratham/Desktop/Development/launchpad/package.json)

- Add dependencies: `zod`, `@reduxjs/toolkit`, `react-redux`, `contentful`, `semver`, `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`, `uuid`, `@clerk/ui`
- Add devDependencies: `@playwright/test`, `axe-playwright`, `@types/uuid`, `@types/semver`

#### Install shadcn components via CLI:

```bash
pnpm dlx shadcn@latest add card dialog badge tabs separator skeleton alert avatar dropdown-menu input textarea select scroll-area tooltip sheet sidebar table
```

---

### Phase 2 — Schema-Driven Renderer & Section Registry

#### [NEW] [src/lib/schemas/sections.ts](file:///c:/Users/Pratham/Desktop/Development/launchpad/src/lib/schemas/sections.ts)

- Zod schemas for `HeroSection` (title, subtitle, ctaText, ctaUrl, backgroundImage)
- Zod schemas for `CtaSection` (heading, description, primaryAction, secondaryAction)
- `PageSchema` wrapping an array of discriminated union sections
- `SectionType` enum with strict typing

#### [NEW] [src/lib/schemas/page.ts](file:///c:/Users/Pratham/Desktop/Development/launchpad/src/lib/schemas/page.ts)

- `PageMetadata` schema (slug, title, status, version, createdAt, updatedAt)
- `DraftPage` schema (metadata + sections array)
- `Release` schema (version, snapshot, publishedAt, publishedBy, releaseNotes)

#### [NEW] [src/lib/registry/section-registry.ts](file:///c:/Users/Pratham/Desktop/Development/launchpad/src/lib/registry/section-registry.ts)

- Type-safe section registry mapping `SectionType` → `{ component, editor, schema, defaultProps }`
- `registerSection()` and `getSection()` functions
- Registration of Hero and CTA sections

#### [NEW] [src/components/sections/hero-section.tsx](file:///c:/Users/Pratham/Desktop/Development/launchpad/src/components/sections/hero-section.tsx)

- Render component for Hero section with full Stitch styling
- Accessible: proper heading hierarchy, alt text, focus management

#### [NEW] [src/components/sections/cta-section.tsx](file:///c:/Users/Pratham/Desktop/Development/launchpad/src/components/sections/cta-section.tsx)

- Render component for CTA section with proper action buttons
- WCAG AAA contrast ratios

#### [NEW] [src/components/renderer/page-renderer.tsx](file:///c:/Users/Pratham/Desktop/Development/launchpad/src/components/renderer/page-renderer.tsx)

- Takes a validated `PageSection[]` and renders via registry lookup
- Zod validation at render boundary
- Error boundary per section

---

### Phase 3 — Contentful Adapter

#### [NEW] [src/lib/adapters/types.ts](file:///c:/Users/Pratham/Desktop/Development/launchpad/src/lib/adapters/types.ts)

- `CmsAdapter` interface: `getPage(slug, preview?)`, `listPages()`, `getPageVersions(slug)`
- Decoupled from Contentful specifics — any CMS can implement this

#### [NEW] [src/lib/adapters/contentful-adapter.ts](file:///c:/Users/Pratham/Desktop/Development/launchpad/src/lib/adapters/contentful-adapter.ts)

- Contentful Delivery + Preview API client
- `preview: true` → uses Preview API (draft content), `false` → Delivery API (published)
- Maps Contentful entries to Zod-validated section schemas
- Environment-based configuration via `CONTENTFUL_SPACE_ID`, `CONTENTFUL_DELIVERY_TOKEN`, `CONTENTFUL_PREVIEW_TOKEN`

#### [NEW] [src/lib/adapters/mock-adapter.ts](file:///c:/Users/Pratham/Desktop/Development/launchpad/src/lib/adapters/mock-adapter.ts)

- In-memory mock implementation of `CmsAdapter`
- Provides realistic sample data for development without Contentful credentials
- Automatically selected when Contentful env vars are missing

#### [NEW] [src/lib/adapters/index.ts](file:///c:/Users/Pratham/Desktop/Development/launchpad/src/lib/adapters/index.ts)

- Factory function that returns Contentful or Mock adapter based on env vars

---

### Phase 4 — Redux Toolkit State Management

#### [NEW] [src/lib/store/store.ts](file:///c:/Users/Pratham/Desktop/Development/launchpad/src/lib/store/store.ts)

- Configure Redux store with three slices
- Type-safe hooks: `useAppDispatch`, `useAppSelector`

#### [NEW] [src/lib/store/slices/draft-page-slice.ts](file:///c:/Users/Pratham/Desktop/Development/launchpad/src/lib/store/slices/draft-page-slice.ts)

- `draftPage` slice: sections array, metadata, dirty flag
- Actions: `addSection`, `removeSection`, `reorderSections`, `updateSectionProps`, `setPage`, `resetDraft`
- Selectors: `selectSections`, `selectMetadata`, `selectIsDirty`

#### [NEW] [src/lib/store/slices/ui-slice.ts](file:///c:/Users/Pratham/Desktop/Development/launchpad/src/lib/store/slices/ui-slice.ts)

- `ui` slice: activePanel, selectedSectionId, isPreviewMode, isSaving
- Actions for panel toggling, section selection, preview mode

#### [NEW] [src/lib/store/slices/publish-slice.ts](file:///c:/Users/Pratham/Desktop/Development/launchpad/src/lib/store/slices/publish-slice.ts)

- `publish` slice: currentVersion, releases array, isPublishing
- Async thunks for publish flow
- Selectors for release history

#### [NEW] [src/lib/store/provider.tsx](file:///c:/Users/Pratham/Desktop/Development/launchpad/src/lib/store/provider.tsx)

- `StoreProvider` client component wrapping `<Provider>`

---

### Phase 5 — Routes, Pages & WYSIWYG-lite Editor

#### [MODIFY] [src/app/page.tsx](file:///c:/Users/Pratham/Desktop/Development/launchpad/src/app/page.tsx)

- Replace default Next.js page with Dashboard (matching Stitch "Dashboard" screen)
- Recent pages grid, quick actions, activity feed
- Protected by Clerk middleware (already configured)

#### [NEW] [src/app/(dashboard)/layout.tsx](<file:///c:/Users/Pratham/Desktop/Development/launchpad/src/app/(dashboard)/layout.tsx>)

- Dashboard layout with sidebar navigation (Pages, Releases, Roles, Settings)
- Uses shadcn Sidebar component
- Matches Stitch sidebar design (fixed-width, `#F9FAFB` bg, Indigo active indicator)

#### [NEW] [src/app/(dashboard)/pages/page.tsx](<file:///c:/Users/Pratham/Desktop/Development/launchpad/src/app/(dashboard)/pages/page.tsx>)

- Pages list matching Stitch "Pages" screen
- Status badges (Draft/Published), search, filters
- Create new page CTA

#### [NEW] [src/app/(dashboard)/releases/page.tsx](<file:///c:/Users/Pratham/Desktop/Development/launchpad/src/app/(dashboard)/releases/page.tsx>)

- Release history matching Stitch "Releases" screen
- Immutable release snapshots with version numbers
- Diff viewer between versions

#### [NEW] [src/app/(dashboard)/roles/page.tsx](<file:///c:/Users/Pratham/Desktop/Development/launchpad/src/app/(dashboard)/roles/page.tsx>)

- Role management UI matching Stitch "Role Management" screen
- Viewer/Editor/Publisher role descriptions and assignment

#### [NEW] [src/app/(dashboard)/settings/page.tsx](<file:///c:/Users/Pratham/Desktop/Development/launchpad/src/app/(dashboard)/settings/page.tsx>)

- Settings page matching Stitch "Settings" screen
- Contentful integration config, environment display

#### [NEW] [src/app/studio/[slug]/page.tsx](file:///c:/Users/Pratham/Desktop/Development/launchpad/src/app/studio/[slug]/page.tsx)

- Studio editor matching Stitch "Studio Editor" screen
- Left panel: section list with drag-and-drop reorder (@dnd-kit)
- Center: live preview of rendered page
- Right panel: property editor for selected section (Hero/CTA props)
- Top toolbar: Save Draft, Preview, Publish buttons
- RBAC: only `org:editor` and `org:publisher` roles can access

#### [NEW] [src/app/preview/[slug]/page.tsx](file:///c:/Users/Pratham/Desktop/Development/launchpad/src/app/preview/[slug]/page.tsx)

- Full-page preview matching Stitch "Preview" screen
- Renders draft content via PageRenderer
- Top bar with "Back to Editor" and "Publish" buttons
- RBAC: accessible to all authenticated users

#### [NEW] [src/components/editor/section-list.tsx](file:///c:/Users/Pratham/Desktop/Development/launchpad/src/components/editor/section-list.tsx)

- Sortable section list using @dnd-kit
- Add section button with section type picker
- Delete/duplicate section controls

#### [NEW] [src/components/editor/property-editor.tsx](file:///c:/Users/Pratham/Desktop/Development/launchpad/src/components/editor/property-editor.tsx)

- Dynamic form generated from Zod schema of selected section
- Auto-saves to Redux draft state
- Validates inputs against Zod schema in real-time

#### [NEW] [src/components/editor/publish-dialog.tsx](file:///c:/Users/Pratham/Desktop/Development/launchpad/src/components/editor/publish-dialog.tsx)

- Matches Stitch "Publish Dialog" screen
- SemVer bump selector (Patch/Minor/Major) with explanations
- Release notes textarea
- Deterministic version calculation from current version
- RBAC: only `org:publisher` role can confirm publish

---

### Phase 6 — Draft Persistence & Publish Flow

#### [NEW] [src/lib/persistence/types.ts](file:///c:/Users/Pratham/Desktop/Development/launchpad/src/lib/persistence/types.ts)

- `PersistenceAdapter` interface: `saveDraft`, `loadDraft`, `listDrafts`, `saveRelease`, `listReleases`, `getRelease`

#### [NEW] [src/lib/persistence/file-adapter.ts](file:///c:/Users/Pratham/Desktop/Development/launchpad/src/lib/persistence/file-adapter.ts)

- JSON-file-based persistence for development
- Drafts stored as `data/drafts/[slug].json`
- Releases stored as `data/releases/[slug]/[version].json`

#### [NEW] [src/app/api/drafts/[slug]/route.ts](file:///c:/Users/Pratham/Desktop/Development/launchpad/src/app/api/drafts/[slug]/route.ts)

- `GET`: Load draft for slug (RBAC: any authenticated user)
- `PUT`: Save/update draft (RBAC: `org:editor` or `org:publisher`)
- Zod validation of request body
- Server-side `auth()` checks

#### [NEW] [src/app/api/publish/[slug]/route.ts](file:///c:/Users/Pratham/Desktop/Development/launchpad/src/app/api/publish/[slug]/route.ts)

- `POST`: Publish draft → immutable release
- RBAC: only `org:publisher`
- Deterministic SemVer: reads current version, bumps by requested type
- Creates immutable snapshot (deep clone of draft at publish time)
- Idempotent: same draft content + version type = same version number
- Returns the new `Release` object

#### [NEW] [src/app/api/releases/[slug]/route.ts](file:///c:/Users/Pratham/Desktop/Development/launchpad/src/app/api/releases/[slug]/route.ts)

- `GET`: List all releases for a slug (with pagination)
- `GET /[version]`: Get specific release snapshot

---

### Phase 7 — Server-Side RBAC with Clerk

#### [MODIFY] [src/proxy.ts](file:///c:/Users/Pratham/Desktop/Development/launchpad/src/proxy.ts)

- Add public routes: `/preview/:slug` (still auth-gated, but Viewer+ can access)
- Keep `/sign-in`, `/sign-up` public
- All other routes require authentication

#### [NEW] [src/lib/auth/rbac.ts](file:///c:/Users/Pratham/Desktop/Development/launchpad/src/lib/auth/rbac.ts)

- `requireRole(role)` — server-side helper using `auth().protect()`
- `hasRole(role)` — boolean check using `auth().has()`
- Role constants: `ROLES.VIEWER`, `ROLES.EDITOR`, `ROLES.PUBLISHER`
- Permission hierarchy: Publisher > Editor > Viewer

#### [NEW] [src/lib/auth/with-rbac.ts](file:///c:/Users/Pratham/Desktop/Development/launchpad/src/lib/auth/with-rbac.ts)

- Higher-order function for API route handlers
- `withRbac(handler, { requiredRole })` — wraps handler with auth + role check
- Returns 401 if unauthenticated, 403 if insufficient role

---

### Phase 8 — Testing, CI & Deployment

#### [NEW] [playwright.config.ts](file:///c:/Users/Pratham/Desktop/Development/launchpad/playwright.config.ts)

- Playwright configuration targeting localhost:3000
- Axe accessibility integration
- Multiple browser targets (Chromium, Firefox, WebKit)

#### [NEW] [tests/e2e/accessibility.spec.ts](file:///c:/Users/Pratham/Desktop/Development/launchpad/tests/e2e/accessibility.spec.ts)

- Axe-core accessibility tests on all routes
- WCAG 2.2 AAA checks
- Keyboard navigation tests
- Screen reader compatibility tests

#### [NEW] [tests/e2e/studio-editor.spec.ts](file:///c:/Users/Pratham/Desktop/Development/launchpad/tests/e2e/studio-editor.spec.ts)

- Section add/reorder/edit flow
- Draft save/load persistence
- Publish flow with SemVer validation

#### [NEW] [tests/e2e/rbac.spec.ts](file:///c:/Users/Pratham/Desktop/Development/launchpad/tests/e2e/rbac.spec.ts)

- Role-based access control tests using Clerk testing helpers
- Viewer can view but not edit
- Editor can edit but not publish
- Publisher can do everything

#### [NEW] [.github/workflows/ci.yml](file:///c:/Users/Pratham/Desktop/Development/launchpad/.github/workflows/ci.yml)

- Triggered on push to `main` and PRs
- Steps: lint, type-check, build, Playwright tests
- Caches `node_modules` and `.next`
- Uploads test artifacts

#### [NEW] [vercel.json](file:///c:/Users/Pratham/Desktop/Development/launchpad/vercel.json)

- Build command, output directory, environment variables
- Rewrites/redirects for clean URLs
- Headers for security (CSP, HSTS, X-Frame-Options)

---

## File Structure Summary

```
src/
├── app/
│   ├── (dashboard)/
│   │   ├── layout.tsx           # Sidebar + main area
│   │   ├── pages/page.tsx       # Pages list
│   │   ├── releases/page.tsx    # Release history
│   │   ├── roles/page.tsx       # RBAC management
│   │   └── settings/page.tsx    # Configuration
│   ├── studio/[slug]/page.tsx   # WYSIWYG-lite editor
│   ├── preview/[slug]/page.tsx  # Page preview
│   ├── api/
│   │   ├── drafts/[slug]/route.ts
│   │   ├── publish/[slug]/route.ts
│   │   └── releases/[slug]/route.ts
│   ├── sign-in/...              # Existing
│   ├── sign-up/...              # Existing
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Dashboard (redirect to /pages)
│   └── globals.css
├── components/
│   ├── ui/                      # shadcn components
│   ├── sections/
│   │   ├── hero-section.tsx
│   │   └── cta-section.tsx
│   ├── editor/
│   │   ├── section-list.tsx
│   │   ├── property-editor.tsx
│   │   └── publish-dialog.tsx
│   ├── renderer/
│   │   └── page-renderer.tsx
│   └── layout/
│       ├── app-sidebar.tsx
│       └── top-bar.tsx
├── lib/
│   ├── schemas/
│   │   ├── sections.ts
│   │   └── page.ts
│   ├── registry/
│   │   └── section-registry.ts
│   ├── adapters/
│   │   ├── types.ts
│   │   ├── contentful-adapter.ts
│   │   ├── mock-adapter.ts
│   │   └── index.ts
│   ├── persistence/
│   │   ├── types.ts
│   │   └── file-adapter.ts
│   ├── store/
│   │   ├── store.ts
│   │   ├── provider.tsx
│   │   └── slices/
│   │       ├── draft-page-slice.ts
│   │       ├── ui-slice.ts
│   │       └── publish-slice.ts
│   ├── auth/
│   │   ├── rbac.ts
│   │   └── with-rbac.ts
│   └── utils.ts                 # Existing
├── proxy.ts                     # Updated middleware
tests/
├── e2e/
│   ├── accessibility.spec.ts
│   ├── studio-editor.spec.ts
│   └── rbac.spec.ts
.github/workflows/ci.yml
playwright.config.ts
vercel.json
data/                            # Git-ignored, dev persistence
├── drafts/
└── releases/
```

---

## Verification Plan

### Automated Tests

```bash
# TypeScript type checking
pnpm tsc --noEmit

# ESLint
pnpm lint

# Build verification
pnpm build

# Playwright E2E + accessibility
pnpm exec playwright test

# Individual test suites
pnpm exec playwright test tests/e2e/accessibility.spec.ts
pnpm exec playwright test tests/e2e/studio-editor.spec.ts
pnpm exec playwright test tests/e2e/rbac.spec.ts
```

### Manual Verification

- Visual comparison of each screen against Stitch screenshots
- Verify all RBAC flows: Viewer → cannot edit, Editor → cannot publish, Publisher → full access
- Test SemVer determinism: same content + same bump type → same version
- Test idempotent publishing: re-publishing same content → no duplicate release
- Verify draft persistence across page refreshes
- Test keyboard navigation throughout the app
- Screen reader walkthrough (NVDA/VoiceOver)
- Run Lighthouse accessibility audit targeting 100 score

### CI Verification

- Push to branch, verify GitHub Actions workflow runs green
- Verify Vercel deployment configuration is valid
