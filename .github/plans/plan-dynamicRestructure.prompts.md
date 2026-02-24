# Plan: Dynamic, DRY, SEO-First Site Chrome

Refactor the app so global chrome (persistent embedded "ResearchWizard" iframe + searxng search bar + navbar) lives in the root layout, eliminating the "menu disappears" bug and making all routes consistent. Replace hardcoded homepage "cards"/skills with GitHub-derived data (languages + rough "years used"), cached server-side via the GitHub GraphQL API using a token. Fix dead links by actually implementing `/about`, `/services`, `/contact`, and add `not-found`, `robots`, and `sitemap` for SSR/SEO. DRY will be enforced by centralizing navigation/content definitions and using shared section components rather than duplicating JSX across pages.

## Steps

### 1. Establish "single source of truth" config

1. Create a small site config module (e.g. `src/lib/site.ts`) containing:
   - Navigation items (Home/About/Services/Contact)
   - External base URLs via env (ResearchWizard, SearxNG)
   - Any labels/CTAs currently duplicated across pages
2. Update [src/components/Navbar.tsx](src/components/Navbar.tsx) to consume config instead of its internal hardcoded `navigation` array.

### 2. Make header + embed persistent across the whole site (fix disappearing menu)

1. Move chrome into [src/app/layout.tsx](src/app/layout.tsx): render a single shared header that includes:
   - SearxNG search bar above the menu/buttons
   - Navbar
   - The always-on embedded iframe panel (defaulting to ResearchWizard)
2. Refactor [src/components/IframeWrapper.tsx](src/components/IframeWrapper.tsx) into a "controlled" component that accepts `src` + callbacks so the search bar can update the iframe URL without page navigation.
3. Remove per-page Navbar usage from [src/app/page.tsx](src/app/page.tsx) so it can't diverge again.

### 3. Implement missing routes to eliminate dead links (and improve SEO)

1. Add pages:
   - [src/app/about/page.tsx](src/app/about/page.tsx)
   - [src/app/services/page.tsx](src/app/services/page.tsx)
   - [src/app/contact/page.tsx](src/app/contact/page.tsx)
2. Convert duplicated sections (hero/services/about/footer blocks) into shared components (e.g. `src/components/sections/*`) so content isn't repeated between Home/About/Services.
3. Add [src/app/not-found.tsx](src/app/not-found.tsx) so 404s render with the same global chrome and clear navigation back to real pages.

### 4. GitHub-driven skills + "years used" (dynamic cards)

1. Add a server-side GitHub client module (e.g. `src/lib/github.ts`) using GitHub GraphQL with `GITHUB_TOKEN` + `GITHUB_USERNAME=bolabaden`.
2. Create a single cached "skills summary" fetch that pulls:
   - Owned repos + contributed repos
   - Languages per repo (with sizes) + `createdAt`/`pushedAt`
   - Aggregate language sizes across repos
3. Derive a skill list:
   - Compute "first seen year" as earliest repo `createdAt` among repos where the language appears (approximation that avoids expensive per-commit scanning)
   - Compute "years used" as `(currentYear - firstSeenYear + 1)`
   - Select top N dynamically (e.g., up to 6; fewer if data is sparse)
4. Replace hardcoded homepage "cards" in [src/app/page.tsx](src/app/page.tsx) with a dynamic list generated from the fetched skills summary (with a safe fallback to a small default set if GitHub is unavailable/rate-limited).

### 5. SearxNG search bar behavior ("always searches within searxng")

1. Implement the search bar as a form that, on submit, updates the embedded iframe `src` to `${SEARXNG_URL}/search?q=...` (exact path configurable if your instance differs).
2. Keep it SSR-friendly by rendering the form server-side, but handling the iframe update client-side in the shared header controller component.

### 6. SSR/SEO upgrades (minimal, high-impact)

1. Add [src/app/sitemap.ts](src/app/sitemap.ts) to emit URLs for `/`, `/about`, `/services`, `/contact`.
2. Add [src/app/robots.ts](src/app/robots.ts) with a sitemap link.
3. Expand metadata:
   - Keep global defaults in [src/app/layout.tsx](src/app/layout.tsx)
   - Add per-page metadata exports in each page for better titles/descriptions.
4. Fix error UX consistency:
   - Add [src/app/error.tsx](src/app/error.tsx) (client error boundary) so runtime errors don't drop the site chrome.
   - Fix the server-component event handler bug in [src/app/error-pages/500/page.tsx](src/app/error-pages/500/page.tsx) (either make it a Client Component or replace the button with a normal link).

### 7. Embed API robustness (optional but strongly related to "works everywhere")

1. Revisit [src/app/api/embed/route.ts](src/app/api/embed/route.ts) headers: `X-Frame-Options: SAMEORIGIN` will likely break cross-subdomain framing; prefer relying on CSP `frame-ancestors` instead (or make this configurable).
2. Keep `/api/embed` and `/api/error/*` behavior intact for Traefik use, but align branding/navigation with the shared config to stay DRY.

## Verification

- Run `npm test` only if present; otherwise:
- `npm run build` to catch Server/Client component boundary issues (especially error pages + shared chrome).
- Manual checks:
  - Visit `/`, `/about`, `/services`, `/contact` and confirm the embedded iframe + search + navbar never disappear.
  - Submit a search: iframe switches to SearxNG results.
  - Kill GitHub token / simulate 403: site still renders with fallback cards.
  - Confirm sitemap/robots endpoints load: `/sitemap.xml`, `/robots.txt`.
  - Click every nav link and any footer CTA: no dead routes.

## Decisions

- **GitHub data source**: use `bolabaden` with a GitHub token via env var.
- **SearxNG search UX**: search bar updates the top embedded iframe to SearxNG results.
- **Embed default**: ResearchWizard homepage.
- **Site structure**: implement Home + About + Services + Contact (no dead links).
