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

## Docker + Traefik

The provided docker-compose override contains Traefik labels for main routing and error middleware. Update the hostnames and IPs to match your environment.

## Error Pages

Dynamic error page HTML is generated in `src/app/api/error/[status]/route.ts` and can be used as a middleware target for reverse proxies.

## License

Personal portfolio site. All rights reserved.
