# AGENTS.md

## Cursor Cloud specific instructions

### Service overview

This is a single Next.js 16 (App Router) portfolio website. No database, Docker, or external services are required for local development. All external dependencies (GitHub API, SearXNG, Docker socket proxy, Prometheus) have built-in fallbacks/demo data.

### Running the application

- `npm run dev` starts the dev server on `http://localhost:3000`.
- See `README.md` for env-driven configuration; the site works with zero `.env.local` configuration.

### Lint

- `npm run lint` calls `next lint --max-warnings=0`, but `next lint` was removed in Next.js 16. The project has ESLint 10 + `eslint-config-next` 16.1.6 configured in `eslint.config.mjs`, but running `npx eslint .` currently hits a circular-reference error in `@eslint/eslintrc`'s FlatCompat. This is a **pre-existing upstream issue** and not a Cloud environment problem.

### Build

- `npm run build` works and produces a standalone build via Turbopack.

### Important caveats

- The environment's default `NODE_ENV=production` causes `npm install` to skip devDependencies. The update script unsets `NODE_ENV` before installing. If you reinstall manually, use `NODE_ENV=development npm install` or `unset NODE_ENV && npm install`.
- The `/projects` (Contributions) page shows zeros without network access to the GitHub API (rate-limited to 60 req/hr without `GITHUB_TOKEN`).
