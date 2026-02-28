/**
 * Application configuration — SINGLE SOURCE OF TRUTH
 * Every site-wide value lives here. Components import from config, never hardcode.
 */

function envFlag(name: string, defaultValue: boolean = true): boolean {
  const raw = process.env[name];
  if (raw === undefined) return defaultValue;
  const normalized = raw.toString().trim().toLowerCase();
  return !["false", "0", "no", "off"].includes(normalized);
}

export const config = {
  /** Owner / personal identity */
  OWNER_NAME: process.env.NEXT_PUBLIC_OWNER_NAME || "Boden Crouch",
  JOB_TITLE: process.env.NEXT_PUBLIC_JOB_TITLE || "Infrastructure Engineer",
  JOB_SUBTITLE:
    process.env.NEXT_PUBLIC_JOB_SUBTITLE ||
    "Self-taught infrastructure engineer & software developer",
  BIO:
    process.env.NEXT_PUBLIC_BIO ||
    "I design, deploy, and maintain complex technical systems, create open source projects, and share technical knowledge. Open to remote opportunities.",

  /** Contact */
  CONTACT_EMAIL:
    process.env.NEXT_PUBLIC_CONTACT_EMAIL || "boden.crouch@gmail.com",
  LINKEDIN_URL:
    process.env.NEXT_PUBLIC_LINKEDIN_URL ||
    "https://linkedin.com/in/boden-crouch-555897193/",

  /** Site / domain */
  SITE_DOMAIN: process.env.NEXT_PUBLIC_SITE_DOMAIN || "bolabaden.org",
  SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME || "bolabaden.org",
  SEARXNG_PUBLIC_URL: "https://searx.be",
  SEARXNG_SEARCH_PATH: process.env.NEXT_PUBLIC_SEARXNG_SEARCH_PATH || "/search",
  RESUME_PATH:
    process.env.NEXT_PUBLIC_RESUME_PATH || "/Boden_Crouch_Resume.pdf",

  /** GitHub */
  GITHUB_OWNER: process.env.NEXT_PUBLIC_GITHUB_OWNER || "bolabaden",
  /** Comma-separated list of GitHub usernames whose repos are aggregated */
  GITHUB_USERNAMES: (
    process.env.NEXT_PUBLIC_GITHUB_USERS || "bolabaden,th3w1zard1"
  )
    .split(",")
    .map((u) => u.trim())
    .filter(Boolean),

  /** Experience */
  EXPERIENCE_START_YEAR: parseInt(
    process.env.NEXT_PUBLIC_EXPERIENCE_START_YEAR || "2021",
    10,
  ),

  /** Location / timezone (shown in contact & footer) */
  LOCATION: process.env.NEXT_PUBLIC_LOCATION || "Remote",
  TIMEZONE: process.env.NEXT_PUBLIC_TIMEZONE || "UTC-6 (Central)",

  /** Embed services — always present */
  EMBED_SERVICES: [
    {
      id: "AI-ResearchWizard",
      name: "AI Research Wizard",
      description: "AI-powered multi-model research platform",
      subdomain: "gptr",
    },
    {
      id: "SearXNG",
      name: "SearXNG",
      description: "Privacy-respecting metasearch engine",
      subdomain: "searxng",
    },
    {
      id: "homepage",
      name: "Homepage Dashboard",
      description: "Comprehensive dashboard for all self-hosted services",
      subdomain: "homepage",
    },
  ],

  /** Cache durations (seconds) */
  CACHE_DURATION: {
    GITHUB_REPOS: 300,
    PROJECTS: 60,
    GUIDES: 3600,
    SKILLS: 3600,
  },

  /** Homepage section toggles */
  get HOME_LIVE_SERVICES_ENABLED() {
    return envFlag("HOME_LIVE_SERVICES_ENABLED", true);
  },
  get HOME_PROJECTS_ENABLED() {
    return envFlag("HOME_PROJECTS_ENABLED", true);
  },
  get HOME_GUIDES_ENABLED() {
    return envFlag("HOME_GUIDES_ENABLED", true);
  },
  get HOME_GITHUB_STATS_ENABLED() {
    return envFlag("HOME_GITHUB_STATS_ENABLED", true);
  },
  get HOME_ABOUT_ENABLED() {
    return envFlag("HOME_ABOUT_ENABLED", true);
  },
  get HOME_CONTACT_ENABLED() {
    return envFlag("HOME_CONTACT_ENABLED", true);
  },

  /** Computed helpers — call as functions */
  get SITE_URL() {
    return `https://${this.SITE_DOMAIN}`;
  },
  get GITHUB_URL() {
    return `https://github.com/${this.GITHUB_OWNER}`;
  },
  get SEARXNG_URL() {
    return process.env.NEXT_PUBLIC_SEARXNG_URL || this.SEARXNG_PUBLIC_URL;
  },
  get SEARXNG_FALLBACK_ENABLED() {
    return (
      envFlag("SEARXNG_FALLBACK_ENABLED", true) &&
      envFlag("NEXT_PUBLIC_SEARXNG_FALLBACK_ENABLED", true)
    );
  },
  getSubdomainUrl(sub: string) {
    return `https://${sub}.${this.SITE_DOMAIN}`;
  },
  getSearxngSearchResolverUrl(query: string) {
    return `/api/searx/search?q=${encodeURIComponent(query)}`;
  },
  getSearxngSearchUrl(query: string) {
    const baseUrl = this.SEARXNG_URL.replace(/\/+$/, "");
    const rawPath = this.SEARXNG_SEARCH_PATH.trim();
    const searchPath = rawPath
      ? rawPath.startsWith("/")
        ? rawPath
        : `/${rawPath}`
      : "/search";
    return `${baseUrl}${searchPath}?q=${encodeURIComponent(query)}`;
  },
  getFallbackDates: () => {
    const now = new Date();
    const sixMonthsAgo = new Date(now);
    sixMonthsAgo.setMonth(now.getMonth() - 6);
    return { createdAt: sixMonthsAgo, updatedAt: now };
  },
} as const;

/**
 * Calculate years of experience from start year
 */
export function getYearsOfExperience(): number {
  const currentYear = new Date().getFullYear();
  return Math.max(0, currentYear - config.EXPERIENCE_START_YEAR);
}

/**
 * Get a human-readable relative time string.
 * Accepts a Date object, an ISO string, or null/undefined.
 * JSON-deserialising an API response turns Date fields into strings,
 * so always coerce to Date before calling any Date methods.
 */
export function getRelativeTime(
  date: Date | string | null | undefined,
): string {
  if (!date) return "unknown";
  const d = date instanceof Date ? date : new Date(date as string);
  if (isNaN(d.getTime())) return "unknown";
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;

  const years = Math.floor(diffDays / 365);
  return years === 1 ? "1 year ago" : `${years} years ago`;
}

/**
 * Format date for display.
 * Accepts a Date object, an ISO string, or null/undefined.
 */
export function formatDate(
  date: Date | string | null | undefined,
  format: "short" | "long" | "iso" = "short",
): string {
  if (!date) return "unknown";
  const d = date instanceof Date ? date : new Date(date as string);
  if (isNaN(d.getTime())) return "unknown";
  switch (format) {
    case "short":
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    case "long":
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    case "iso":
      return d.toISOString();
    default:
      return d.toLocaleDateString();
  }
}
