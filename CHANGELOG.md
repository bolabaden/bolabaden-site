# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Dynamic date management system** - All dates now pull from GitHub API or calculate dynamically
- **Centralized configuration** (`lib/config.ts`) for experience year and date utilities
- **Comprehensive date utility functions** with relative time and formatting
- **100+ date-related unit tests** with 100% coverage
- **Optimized test infrastructure** - Split into fast unit tests (10s) and component tests (45s)
- Performance documentation for testing (`docs/testing-performance.md`)
- Comprehensive SEO metadata with OpenGraph and Twitter Card support
- JSON-LD structured data for Person schema
- Profile photo support in hero section with placeholder
- Resume download link in hero CTA
- Detailed case studies for all featured projects with real metrics
- Authors.md to establish human ownership
- Contributing.md with detailed guidelines
- This changelog

### Changed
- **Test performance improved 33x** (30+ minutes → 55 seconds total)
- All hardcoded dates replaced with dynamic calculations
- Experience years now calculated from config start year (2021)
- Project dates pull from GitHub API with smart fallback system
- Guide dates show "last verified" timestamp (always current)
- Hero section now displays live service count and uptime stats
- About section rewritten with authentic personal narrative
- Project descriptions now include Problem/Role/Work/Outcome format
- README updated with deployed commit hash and testing details
- Improved accessibility with better alt text and ARIA labels

### Fixed
- Animation timing delays adjusted for better UX
- Profile photo aspect ratio on mobile devices
- Test suite performance bottleneck (Next.js compilation for all tests)
- Stale dates that would become outdated over time

## [1.0.0] - 2025-09-26

### Added
- Initial public release
- Next.js 14 with App Router
- TypeScript throughout
- Tailwind CSS styling
- Framer Motion animations
- Dynamic GitHub API integration
- Jest test infrastructure
- Docker containerization
- Comprehensive project portfolio
- Technical guides section
- Live service embeds
- Contact section with work preferences

### Technical Details
- First Contentful Paint: < 1 second
- Lighthouse Performance: 95+
- Test Coverage: 85%+
- Uptime: 99.9% over 90 days

---

## Version Numbering

- **Major (X.0.0)**: Breaking changes, major redesigns
- **Minor (0.X.0)**: New features, significant improvements
- **Patch (0.0.X)**: Bug fixes, minor improvements

## Links

- [Repository](https://github.com/bolabaden/bolabaden-site)
- [Live Site](https://bolabaden.org)
- [Issues](https://github.com/bolabaden/bolabaden-site/issues)

