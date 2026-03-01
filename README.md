# bolabaden.org

Personal portfolio site for Boden Crouch. Built with Next.js App Router and Tailwind CSS to showcase projects, guides, and ongoing work.

## Features

- Portfolio-focused homepage with projects, guides, and about section
- Dedicated Projects and Guides pages
- Dynamic error pages for common HTTP statuses
- Dark-first visual system with responsive layout

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Docker for production containerization

## Project Structure

```shell
.
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── error/[status]/        # Dynamic error pages API
│   │   ├── error-pages/
│   │   │   ├── 404/
│   │   │   └── 500/
│   │   ├── guides/                    # Guides landing page
│   │   ├── projects/                  # Projects landing page
│   │   ├── about/                     # About page
│   │   ├── contact/                   # Contact page
│   │   ├── globals.css                # Global styles
│   │   ├── layout.tsx                 # Root layout
│   │   └── page.tsx                   # Homepage
│   ├── components/
│   │   ├── Logo.tsx                   # Wordmark logo
│   │   ├── Navbar.tsx                 # Navigation
│   │   └── SiteFooter.tsx             # Footer
│   └── lib/                           # Shared config/data helpers
├── Dockerfile
├── docker-compose.override.yml
└── next.config.ts
```

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Configuration

This site is now env-driven with safe defaults, including page metadata, homepage blocks, nav labels, OG copy, and fallback data models.

1. Copy `.env.example` to `.env.local`
2. Change only the keys you want to personalize
3. Use JSON override vars (for example `NEXT_PUBLIC_HOME_HUB_CARDS_JSON`) to swap entire content modules without code edits

Most-used variables:

- `NEXT_PUBLIC_OWNER_NAME`, `NEXT_PUBLIC_JOB_TITLE`, `NEXT_PUBLIC_BIO`
- `NEXT_PUBLIC_SITE_NAME`, `NEXT_PUBLIC_SITE_DOMAIN`, `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_GITHUB_OWNER`, `NEXT_PUBLIC_GITHUB_USERS`
- `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_LOCATION`, `NEXT_PUBLIC_TIMEZONE`
- `NEXT_PUBLIC_NAV_ITEMS_JSON`, `NEXT_PUBLIC_EMBED_SERVICES_JSON`
- `NEXT_PUBLIC_HOME_HUB_CARDS_JSON`, `NEXT_PUBLIC_HOME_EXPLORE_LANES_JSON`, `NEXT_PUBLIC_HOME_FUTURE_PLACEHOLDERS_JSON`
- `NEXT_PUBLIC_HOME_LAYOUT_SECTIONS_JSON`, `NEXT_PUBLIC_HOME_EMBEDS_MODE`
- `NEXT_PUBLIC_ABOUT_LAYOUT_SECTIONS_JSON`, `NEXT_PUBLIC_ABOUT_EMBEDS_MODE`
- `NEXT_PUBLIC_FALLBACK_PROJECTS_JSON`, `NEXT_PUBLIC_TECH_STACK_JSON`, `NEXT_PUBLIC_CONTACT_INFO_JSON`
- `NEXT_PUBLIC_SEARXNG_URL`, `NEXT_PUBLIC_SEARXNG_SEARCH_PATH`, `SEARXNG_FALLBACK_ENABLED`
- `GUIDES_DIR`

### Homepage Builder (Config-Driven)

The home route (`/`) supports a builder-style layout controlled via env JSON, so you can reorder, hide, or relabel sections without touching code.

- `NEXT_PUBLIC_HOME_LAYOUT_SECTIONS_JSON` controls **order + visibility + labels**
- `NEXT_PUBLIC_HOME_EMBEDS_MODE` controls embeds hero style (`hero` or `default`)
- `NEXT_PUBLIC_HOME_HUB_CARDS_JSON` controls card grid content/icons/CTAs
- `NEXT_PUBLIC_HOME_EXPLORE_LANES_JSON` controls explore lane content/icons/CTAs
- `NEXT_PUBLIC_HOME_FUTURE_PLACEHOLDERS_JSON` controls future placeholder list

Example:

```env
NEXT_PUBLIC_HOME_EMBEDS_MODE=hero
NEXT_PUBLIC_HOME_LAYOUT_SECTIONS_JSON=[{"id":"embeds","label":"Start","enabled":true,"order":1},{"id":"home-hub","label":"Main","enabled":true,"order":2},{"id":"explore-lanes","label":"Paths","enabled":true,"order":3},{"id":"future-blocks","label":"Roadmap","enabled":false,"order":4}]
NEXT_PUBLIC_HOME_HUB_CARDS_JSON=[{"title":"About","description":"Profile and portfolio details","href":"/about","icon":"compass","cta":"Open"},{"title":"Projects","description":"Build catalog","href":"/projects","icon":"blocks","cta":"Browse"}]
```

Supported `HOME_HUB_CARDS_JSON` icons: `compass`, `dashboard`, `code`, `book`, `blocks`

Supported `HOME_EXPLORE_LANES_JSON` icons: `rocket`, `workflow`, `layers`, `cpu`

### About Page Builder (Config-Driven)

The about route (`/about`) also supports builder-style section control via env JSON.

- `NEXT_PUBLIC_ABOUT_LAYOUT_SECTIONS_JSON` controls **order + visibility + labels**
- `NEXT_PUBLIC_ABOUT_EMBEDS_MODE` controls embeds mode on About (`default` or `hero`)
- `NEXT_PUBLIC_ABOUT_EMBEDS_FALLBACK_TITLE` controls embeds section error fallback title

Example:

```env
NEXT_PUBLIC_ABOUT_EMBEDS_MODE=default
NEXT_PUBLIC_ABOUT_LAYOUT_SECTIONS_JSON=[{"id":"hero","label":"Overview","enabled":true,"order":1},{"id":"projects","label":"Projects","enabled":true,"order":2},{"id":"guides","label":"Guides","enabled":true,"order":3},{"id":"embeds","label":"Live Services","enabled":false,"order":4},{"id":"about","label":"About","enabled":true,"order":5},{"id":"contact","label":"Contact","enabled":true,"order":6}]
```

## Guides as Markdown

Guides are loaded from markdown files at runtime.

- Bundled fallback guides live in `src/content/guides/*.md`
- If `GUIDES_DIR` exists, guides are loaded from there instead
- If `GUIDES_DIR` does not exist, bundled fallback guides are used

For custom guides, mount a host folder to `/app/guides` and set `GUIDES_DIR=/app/guides`.
File names determine guide titles on the site via normalized title case (for example, `vs-code-ai-workflow-guide.md` becomes `VS Code AI Workflow Guide`).

## Docker + Traefik

The provided docker-compose override contains Traefik labels for main routing and error middleware. Update the hostnames and IPs to match your environment.

The compose file now passes `NEXT_PUBLIC_SEARXNG_URL`, `NEXT_PUBLIC_SEARXNG_SEARCH_PATH`, and `SEARXNG_FALLBACK_ENABLED` into both build args and runtime env with defaults, so you can override these before deployment without code changes.

Search behavior uses `/api/searx/search` as a resolver endpoint: it checks the configured SearXNG target first and automatically redirects to the public instance when the configured one responds with errors or is unavailable (unless fallback is disabled).

## Error Pages

Dynamic error page HTML is generated in `src/app/api/error/[status]/route.ts` and can be used as a middleware target for reverse proxies.

## License

Personal portfolio site. All rights reserved.
