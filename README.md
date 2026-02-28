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

Environment variables:

- `GITHUB_TOKEN` - GitHub token for repository data
- `GITHUB_USERNAME` - GitHub username to analyze (default: `bolabaden`)
- `NEXT_PUBLIC_SITE_URL` - Canonical site URL for metadata and sitemap
- `NEXT_PUBLIC_CONTACT_EMAIL` - Contact email (default: `hello@bolabaden.org`)
- `NEXT_PUBLIC_SEARXNG_URL` - Full SearXNG base URL for the top search bar (default: `https://searx.be`)
- `NEXT_PUBLIC_SEARXNG_SEARCH_PATH` - Search path appended to SearXNG base URL (default: `/search`)
- `SEARXNG_FALLBACK_ENABLED` - Enables automatic fallback to public SearXNG when the configured instance returns errors/unavailable (`true` by default, set to `false`/`0`/`off` to disable)
- `GUIDES_DIR` - Optional absolute/relative directory containing custom `.md` guides (default: `./guides` in local runtime, `/app/guides` in docker-compose override)
- `HOME_LIVE_SERVICES_ENABLED` - Toggle live services section on homepage (`true` default)
- `HOME_PROJECTS_ENABLED` - Toggle projects section on homepage (`true` default)
- `HOME_GUIDES_ENABLED` - Toggle guides section on homepage (`true` default)
- `HOME_GITHUB_STATS_ENABLED` - Toggle GitHub stats section on homepage (`true` default)
- `HOME_ABOUT_ENABLED` - Toggle about section on homepage (`true` default)
- `HOME_CONTACT_ENABLED` - Toggle contact section on homepage (`true` default)

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
