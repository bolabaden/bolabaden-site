# Design Comparison (Docker Reference vs Current)

## Source of truth used
- Docker image: `bolabaden/bolabaden-site:latest`
- Extracted with `docker cp` into `.docker-reference/app`
- Reference analysis target: `.docker-reference/app/.next/server/app/*`

## High-confidence differences observed

### Legacy (docker image)
- Uses a classic **primary/secondary** visual language (`bg-primary`, `text-primary-foreground`, `bg-secondary/50`)
- Includes **glass card** styling (`glass hover:bg-white/10`)
- Uses stronger motion depth (`hover:shadow-xl`, `hover:scale-105`)
- Contains older route/content traces (`/dashboard`, `infrastructure`, `cloud`)

### Current (repo)
- Uses **slate + emerald** dark palette and calmer contrast
- Uses content model: Home / Projects / Guides / About / Contact
- Rebranded content and naming already aligned to bolabaden

## Changes implemented to bridge both
- Added runtime design switch: `legacy` (default Docker baseline) and `modern` (expansion layer)
- Added a toggle in navbar on desktop and mobile
- Added persistent preference via `localStorage` (`design-theme`)
- Added comprehensive CSS override layer for legacy theme in `src/app/globals.css`
- Preserved current implementation snapshot in `design-backups/modern-2026-02-24/`

## Docker-Baseline Enforcement (current state)
- Baseline mode is now Docker-first by default (`legacy` is the startup default).
- Modern styling is treated as an expansion layer (`Modern+` toggle).
- Docker route parity added:
	- `/dashboard` now exists and renders the main dashboard/home experience.
	- `/api/services` now exists for API compatibility.
- Current build includes all Docker baseline routes plus expanded routes (`/about`, `/projects`).

## Notes
- Legacy mode intentionally matches visual style primitives from the docker image while keeping current content and route model.
- This avoids reintroducing old cloud/infrastructure branding and route structure.

## Runtime Stability Note (`Cannot find module './447.js'`)
- Root cause: stale/inconsistent `.next` server chunk graph (usually from deleting/rebuilding artifacts while dev server is still running on Windows).
- Recovery sequence used:
	1. Stop all running `node`/`next` processes.
	2. Delete `.next`, `out`, and `.turbo`.
	3. Rebuild with `npm run build`.
	4. Restart dev with `npm run dev`.
- Verification: route smoke checks returned `200` for `/`, `/about`, `/projects`, `/contact`, and error pages after reset.