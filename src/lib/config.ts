/**
 * Application configuration — SINGLE SOURCE OF TRUTH
 * Every site-wide value lives here. Components import from config, never hardcode.
 */

type GenericRecord = Record<string, unknown>;

export type NavigationItem = {
  href: string;
  label: string;
};

export type HomeHubCard = {
  title: string;
  description: string;
  href: string;
  icon: "compass" | "dashboard" | "code" | "book" | "blocks";
  cta: string;
};

export type HomeExploreLane = {
  title: string;
  description: string;
  href: string;
  icon: "rocket" | "workflow" | "layers" | "cpu";
  cta: string;
};

export type ShowcaseItem = {
  id: string;
  title: string;
  description?: string;
  type: "link" | "embed" | "iframe" | "text";
  href?: string;
  src?: string;
  icon?: string;
  color?: string;
  aspectRatio?: "auto" | "square" | "video" | "wide";
};

export type HomeLayoutSectionId =
  | "embeds"
  | "showcase"
  | "home-hub"
  | "explore-lanes"
  | "future-blocks";

export type HomeLayoutSection = {
  id: HomeLayoutSectionId;
  label: string;
  enabled: boolean;
  order: number;
};

export type AboutLayoutSectionId =
  | "hero"
  | "embeds"
  | "projects"
  | "guides"
  | "github-stats"
  | "about"
  | "contact";

export type AboutLayoutSection = {
  id: AboutLayoutSectionId;
  label: string;
  enabled: boolean;
  order: number;
};

export type TocConfigItem = {
  id: string;
  label: string;
};

function envString(name: string, defaultValue: string): string {
  const raw = process.env[name];
  if (raw === undefined) return defaultValue;
  const normalized = raw.trim();
  return normalized.length > 0 ? normalized : defaultValue;
}

function envNumber(name: string, defaultValue: number): number {
  const raw = process.env[name];
  if (raw === undefined) return defaultValue;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : defaultValue;
}

function envCsv(name: string, defaultValues: string[]): string[] {
  const raw = process.env[name];
  if (!raw) return defaultValues;
  const parsed = raw
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
  return parsed.length > 0 ? parsed : defaultValues;
}

function isRecord(value: unknown): value is GenericRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function envJson<T>(name: string, defaultValue: T): T {
  const raw = process.env[name];
  if (!raw) return defaultValue;

  try {
    const parsed = JSON.parse(raw) as unknown;

    if (Array.isArray(defaultValue)) {
      return (Array.isArray(parsed) ? parsed : defaultValue) as T;
    }

    if (isRecord(defaultValue)) {
      return (isRecord(parsed) ? parsed : defaultValue) as T;
    }

    return (parsed ?? defaultValue) as T;
  } catch {
    return defaultValue;
  }
}

function envFlag(name: string, defaultValue: boolean = true): boolean {
  const raw = process.env[name];
  if (raw === undefined) return defaultValue;
  const normalized = raw.toString().trim().toLowerCase();
  return !["false", "0", "no", "off"].includes(normalized);
}

export const config = {
  /** Owner / personal identity */
  OWNER_NAME: envString("NEXT_PUBLIC_OWNER_NAME", "Boden Crouch"),
  JOB_TITLE: envString("NEXT_PUBLIC_JOB_TITLE", "Infrastructure Engineer"),
  JOB_SUBTITLE: envString(
    "NEXT_PUBLIC_JOB_SUBTITLE",
    "Self-taught infrastructure engineer & software developer",
  ),
  BIO: envString(
    "NEXT_PUBLIC_BIO",
    "I design, deploy, and maintain complex technical systems, create open source projects, and share technical knowledge. Open to remote opportunities.",
  ),

  /** Contact */
  CONTACT_EMAIL: envString(
    "NEXT_PUBLIC_CONTACT_EMAIL",
    "boden.crouch@gmail.com",
  ),
  LINKEDIN_URL: envString(
    "NEXT_PUBLIC_LINKEDIN_URL",
    "https://linkedin.com/in/boden-crouch-555897193/",
  ),

  /** Site / domain */
  SITE_PROTOCOL: envString("NEXT_PUBLIC_SITE_PROTOCOL", "https"),
  SITE_DOMAIN: envString("NEXT_PUBLIC_SITE_DOMAIN", "bolabaden.org"),
  SITE_NAME: envString("NEXT_PUBLIC_SITE_NAME", "bolabaden.org"),
  SEARXNG_PUBLIC_URL: envString(
    "NEXT_PUBLIC_SEARXNG_PUBLIC_URL",
    "https://searx.be",
  ),
  SEARXNG_SEARCH_PATH: envString("NEXT_PUBLIC_SEARXNG_SEARCH_PATH", "/search"),
  RESUME_PATH: envString("NEXT_PUBLIC_RESUME_PATH", "/Boden_Crouch_Resume.pdf"),

  /** GitHub */
  GITHUB_OWNER: envString("NEXT_PUBLIC_GITHUB_OWNER", "bolabaden"),
  /** Comma-separated list of GitHub usernames whose repos are aggregated */
  GITHUB_USERNAMES: envCsv("NEXT_PUBLIC_GITHUB_USERS", [
    "bolabaden",
    "th3w1zard1",
  ]),

  /** Experience */
  EXPERIENCE_START_YEAR: Math.floor(
    envNumber("NEXT_PUBLIC_EXPERIENCE_START_YEAR", 2021),
  ),

  /** Location / timezone (shown in contact & footer) */
  LOCATION: envString("NEXT_PUBLIC_LOCATION", "Remote"),
  TIMEZONE: envString("NEXT_PUBLIC_TIMEZONE", "UTC-6 (Central)"),

  /** Site-wide copy and metadata */
  HTML_LANG: envString("NEXT_PUBLIC_HTML_LANG", "en"),
  SITE_SECTION_LABEL: envString(
    "NEXT_PUBLIC_SITE_SECTION_LABEL",
    "Independent Web Hub",
  ),
  SITE_META_DESCRIPTION: envString(
    "NEXT_PUBLIC_SITE_META_DESCRIPTION",
    "Independent web hub for guides, projects, live services, and evolving digital spaces.",
  ),
  SITE_META_KEYWORDS: envCsv("NEXT_PUBLIC_SITE_META_KEYWORDS", [
    "developer website",
    "guides",
    "projects",
    "independent web hub",
    "self-hosted services",
    "docker",
    "kubernetes",
    "automation",
    "tooling",
  ]),
  SITE_OG_DESCRIPTION: envString(
    "NEXT_PUBLIC_SITE_OG_DESCRIPTION",
    "Explore guides, projects, live dashboards, and future web spaces.",
  ),
  SITE_JSONLD_DESCRIPTION: envString(
    "NEXT_PUBLIC_SITE_JSONLD_DESCRIPTION",
    "Independent web hub featuring guides, projects, service dashboards, and future creative spaces.",
  ),

  /** Home page */
  HOME_PAGE_TITLE: envString("NEXT_PUBLIC_HOME_PAGE_TITLE", "Home — Web Hub"),
  HOME_PAGE_DESCRIPTION: envString(
    "NEXT_PUBLIC_HOME_PAGE_DESCRIPTION",
    "Live service window first, then a modular web hub for projects, guides, dashboards, and future spaces.",
  ),
  HOME_PAGE_KEYWORDS: envCsv("NEXT_PUBLIC_HOME_PAGE_KEYWORDS", [
    "dashboard hub",
    "guides",
    "home",
    "independent web hub",
    "modular homepage",
    "projects",
    "service window",
  ]),
  HOME_HUB_TITLE: envString("NEXT_PUBLIC_HOME_HUB_TITLE", "Web Hub"),
  HOME_HUB_SUBTITLE: envString(
    "NEXT_PUBLIC_HOME_HUB_SUBTITLE",
    "A modular homepage that routes to focused areas while keeping room for future additions.",
  ),
  HOME_HUB_INTRO: envString(
    "NEXT_PUBLIC_HOME_HUB_INTRO",
    "This entry page is intentionally broad: monitor live systems, navigate to focused pages, and expand into new content without restructuring the whole site.",
  ),
  HOME_HUB_CARDS: envJson<HomeHubCard[]>("NEXT_PUBLIC_HOME_HUB_CARDS_JSON", [
    {
      title: "About",
      description:
        "Detailed profile, full portfolio sections, and complete technical background.",
      href: "/about",
      icon: "compass",
      cta: "Open About Space",
    },
    {
      title: "Service Dashboard",
      description:
        "Operational view of infrastructure and self-hosted services in one place.",
      href: "/dashboard",
      icon: "dashboard",
      cta: "Open Monitoring",
    },
    {
      title: "Projects",
      description:
        "Public tools, demos, and production-oriented builds grouped in one view.",
      href: "/projects",
      icon: "blocks",
      cta: "Open Projects",
    },
    {
      title: "Technical Guides",
      description:
        "Long-form walkthroughs, references, and practical implementation guides.",
      href: "/guides",
      icon: "book",
      cta: "Read Guides",
    },
  ]),
  HOME_LAYOUT_SECTIONS: envJson<HomeLayoutSection[]>(
    "NEXT_PUBLIC_HOME_LAYOUT_SECTIONS_JSON",
    [
      { id: "showcase", label: "Showcase", enabled: true, order: 1 },
      { id: "embeds", label: "Live Services", enabled: true, order: 2 },
      { id: "home-hub", label: "Hub", enabled: false, order: 3 },
      { id: "explore-lanes", label: "Explore", enabled: false, order: 4 },
      { id: "future-blocks", label: "Future", enabled: false, order: 5 },
    ],
  ),
  HOME_SHOWCASE_TITLE: envString(
    "NEXT_PUBLIC_HOME_SHOWCASE_TITLE",
    "Creative Space",
  ),
  HOME_SHOWCASE_SUBTITLE: envString(
    "NEXT_PUBLIC_HOME_SHOWCASE_SUBTITLE",
    "Games, experiments, tools, and cool things I'm building or hosting.",
  ),
  HOME_SHOWCASE_ITEMS: envJson<ShowcaseItem[]>(
    "NEXT_PUBLIC_HOME_SHOWCASE_ITEMS_JSON",
    [
      {
        id: "coming-soon-1",
        title: "WebAssembly Game",
        description: "Interactive game or demo (coming soon)",
        type: "text",
        color: "from-blue-600/20 to-cyan-600/20",
      },
      {
        id: "coming-soon-2",
        title: "Flash Archive",
        description: "Preserved classic games (coming soon)",
        type: "text",
        color: "from-orange-600/20 to-red-600/20",
      },
      {
        id: "coming-soon-3",
        title: "Cool Project",
        description: "Something awesome (coming soon)",
        type: "text",
        color: "from-purple-600/20 to-pink-600/20",
      },
      {
        id: "coming-soon-4",
        title: "Custom Space",
        description: "What's next?",
        type: "text",
        color: "from-green-600/20 to-emerald-600/20",
      },
    ],
  ),
  HOME_EMBEDS_MODE: envString("NEXT_PUBLIC_HOME_EMBEDS_MODE", "default"),
  HOME_EMBEDS_FALLBACK_TITLE: envString(
    "NEXT_PUBLIC_HOME_EMBEDS_FALLBACK_TITLE",
    "Live services",
  ),
  HOME_TOC_ITEMS: envJson<TocConfigItem[]>("NEXT_PUBLIC_HOME_TOC_ITEMS_JSON", [
    { id: "showcase", label: "Showcase" },
    { id: "embeds", label: "Live Services" },
    { id: "home-hub", label: "Hub" },
    { id: "explore-lanes", label: "Explore" },
    { id: "future-blocks", label: "Future" },
  ]),
  HOME_EXPLORE_TITLE: envString(
    "NEXT_PUBLIC_HOME_EXPLORE_TITLE",
    "Explore Lanes",
  ),
  HOME_EXPLORE_SUBTITLE: envString(
    "NEXT_PUBLIC_HOME_EXPLORE_SUBTITLE",
    "Pick a direction based on what you want to do right now.",
  ),
  HOME_EXPLORE_LANES: envJson<HomeExploreLane[]>(
    "NEXT_PUBLIC_HOME_EXPLORE_LANES_JSON",
    [
      {
        title: "Build Track",
        description:
          "Go from concept to shipped features using the active project lanes.",
        href: "/projects",
        icon: "rocket",
        cta: "Explore",
      },
      {
        title: "Operate Track",
        description:
          "Observe service health, uptime, and live runtime behavior in one place.",
        href: "/dashboard",
        icon: "cpu",
        cta: "Explore",
      },
      {
        title: "Learn Track",
        description:
          "Use practical guides to implement repeatable infrastructure workflows.",
        href: "/guides",
        icon: "workflow",
        cta: "Explore",
      },
      {
        title: "Profile Track",
        description:
          "Explore complete context, background, and detailed portfolio scope.",
        href: "/about",
        icon: "layers",
        cta: "Explore",
      },
    ],
  ),
  HOME_FUTURE_TITLE: envString(
    "NEXT_PUBLIC_HOME_FUTURE_TITLE",
    "Future Spaces",
  ),
  HOME_FUTURE_SUBTITLE: envString(
    "NEXT_PUBLIC_HOME_FUTURE_SUBTITLE",
    "Intentional placeholders so this homepage can evolve beyond a standard portfolio format.",
  ),
  HOME_FUTURE_BADGE: envString("NEXT_PUBLIC_HOME_FUTURE_BADGE", "Idea Sandbox"),
  HOME_FUTURE_PLACEHOLDERS: envJson<string[]>(
    "NEXT_PUBLIC_HOME_FUTURE_PLACEHOLDERS_JSON",
    [
      "Release Notes Stream (Placeholder)",
      "Field Reports / Build Logs (Placeholder)",
      "Tool Directory (Placeholder)",
      "Mini Apps Shelf (Placeholder)",
      "Learning Paths (Placeholder)",
      "Community Updates (Placeholder)",
      "Monthly Snapshot (Placeholder)",
      "Public Experiments Lab (Placeholder)",
    ],
  ),

  /** Page metadata */
  CONTACT_PAGE_TITLE: envString("NEXT_PUBLIC_CONTACT_PAGE_TITLE", "Contact"),
  CONTACT_PAGE_DESCRIPTION: envString(
    "NEXT_PUBLIC_CONTACT_PAGE_DESCRIPTION",
    "Get in touch to start a conversation, ask questions, or discuss potential collaboration.",
  ),
  DASHBOARD_PAGE_TITLE: envString(
    "NEXT_PUBLIC_DASHBOARD_PAGE_TITLE",
    "Dashboard — Live Services",
  ),
  DASHBOARD_PAGE_DESCRIPTION: envString(
    "NEXT_PUBLIC_DASHBOARD_PAGE_DESCRIPTION",
    "Live embedded views of self-hosted services including AI Research Wizard, SearXNG, and Homepage Dashboard.",
  ),
  PROJECTS_PAGE_TITLE: envString("NEXT_PUBLIC_PROJECTS_PAGE_TITLE", "Projects"),
  PROJECTS_PAGE_DESCRIPTION: envString(
    "NEXT_PUBLIC_PROJECTS_PAGE_DESCRIPTION",
    "Explore public tools, infrastructure services, and production-focused engineering projects.",
  ),
  GUIDES_PAGE_TITLE: envString(
    "NEXT_PUBLIC_GUIDES_PAGE_TITLE",
    "Technical Guides",
  ),
  GUIDES_PAGE_DESCRIPTION: envString(
    "NEXT_PUBLIC_GUIDES_PAGE_DESCRIPTION",
    "Browse detailed technical guides on Kubernetes, Docker, Terraform, and infrastructure engineering.",
  ),
  GUIDES_INDEX_SECTION_TITLE: envString(
    "NEXT_PUBLIC_GUIDES_INDEX_SECTION_TITLE",
    "All Guides",
  ),
  GUIDES_INDEX_SECTION_SUBTITLE: envString(
    "NEXT_PUBLIC_GUIDES_INDEX_SECTION_SUBTITLE",
    "Browse detailed technical guides.",
  ),
  GUIDES_INDEX_CARD_CTA: envString(
    "NEXT_PUBLIC_GUIDES_INDEX_CARD_CTA",
    "Read Guide →",
  ),
  GUIDE_NOT_FOUND_TITLE: envString(
    "NEXT_PUBLIC_GUIDE_NOT_FOUND_TITLE",
    "Guide Not Found",
  ),
  GUIDE_BACK_TO_INDEX_LABEL: envString(
    "NEXT_PUBLIC_GUIDE_BACK_TO_INDEX_LABEL",
    "← All Guides",
  ),

  /** Navigation */
  NAV_ITEMS: envJson<NavigationItem[]>("NEXT_PUBLIC_NAV_ITEMS_JSON", [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/guides", label: "Guides" },
    { href: "/contact", label: "Contact" },
  ]),
  NAV_FUTURE_PLACEHOLDERS: envJson<string[]>(
    "NEXT_PUBLIC_NAV_FUTURE_PLACEHOLDERS_JSON",
    ["Labs (Soon)", "Notes (Soon)"],
  ),
  NAV_SEARCH_TAG: envString("NEXT_PUBLIC_NAV_SEARCH_TAG", "SearXNG"),
  NAV_SEARCH_FORM_ARIA: envString(
    "NEXT_PUBLIC_NAV_SEARCH_FORM_ARIA",
    "SearXNG search",
  ),
  NAV_SEARCH_INPUT_PLACEHOLDER: envString(
    "NEXT_PUBLIC_NAV_SEARCH_INPUT_PLACEHOLDER",
    "Search with SearXNG…",
  ),
  NAV_SEARCH_INPUT_ARIA: envString(
    "NEXT_PUBLIC_NAV_SEARCH_INPUT_ARIA",
    "Search with SearXNG",
  ),
  NAV_SEARCH_BUTTON_LABEL: envString(
    "NEXT_PUBLIC_NAV_SEARCH_BUTTON_LABEL",
    "Search",
  ),
  NAV_ABOUT_BUTTON_LABEL: envString(
    "NEXT_PUBLIC_NAV_ABOUT_BUTTON_LABEL",
    "About",
  ),

  /** About page TOC */
  ABOUT_LAYOUT_SECTIONS: envJson<AboutLayoutSection[]>(
    "NEXT_PUBLIC_ABOUT_LAYOUT_SECTIONS_JSON",
    [
      { id: "hero", label: "Overview", enabled: true, order: 1 },
      { id: "embeds", label: "Live Services", enabled: true, order: 2 },
      { id: "projects", label: "Projects", enabled: true, order: 3 },
      { id: "guides", label: "Guides", enabled: true, order: 4 },
      { id: "github-stats", label: "GitHub Stats", enabled: true, order: 5 },
      { id: "about", label: "About", enabled: true, order: 6 },
      { id: "contact", label: "Contact", enabled: true, order: 7 },
    ],
  ),
  ABOUT_EMBEDS_MODE: envString("NEXT_PUBLIC_ABOUT_EMBEDS_MODE", "default"),
  ABOUT_EMBEDS_FALLBACK_TITLE: envString(
    "NEXT_PUBLIC_ABOUT_EMBEDS_FALLBACK_TITLE",
    "Live services section failed to load",
  ),
  ABOUT_TOC_ITEMS: envJson<TocConfigItem[]>(
    "NEXT_PUBLIC_ABOUT_TOC_ITEMS_JSON",
    [
      { id: "hero", label: "Overview" },
      { id: "embeds", label: "Live Services" },
      { id: "projects", label: "Projects" },
      { id: "guides", label: "Guides" },
      { id: "github-stats", label: "GitHub Stats" },
      { id: "about", label: "About" },
      { id: "contact", label: "Contact" },
    ],
  ),

  /** Embed services — always present */
  EMBED_SERVICES: [
    ...envJson("NEXT_PUBLIC_EMBED_SERVICES_JSON", [
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
    ]),
  ],

  /** Cache durations (seconds) */
  CACHE_DURATION: {
    GITHUB_REPOS: envNumber("CACHE_DURATION_GITHUB_REPOS", 300),
    PROJECTS: envNumber("CACHE_DURATION_PROJECTS", 60),
    GUIDES: envNumber("CACHE_DURATION_GUIDES", 3600),
    SKILLS: envNumber("CACHE_DURATION_SKILLS", 3600),
  },

  /** OpenGraph image copy */
  OG_HOME_TITLE: envString("NEXT_PUBLIC_OG_HOME_TITLE", "Independent Web Hub"),
  OG_HOME_SUBTITLE: envString("NEXT_PUBLIC_OG_HOME_SUBTITLE", "Home"),
  OG_HOME_DESCRIPTION: envString(
    "NEXT_PUBLIC_OG_HOME_DESCRIPTION",
    "Explore guides, projects, dashboards, and future spaces.",
  ),
  OG_ABOUT_TITLE: envString("NEXT_PUBLIC_OG_ABOUT_TITLE", "About & Portfolio"),
  OG_ABOUT_SUBTITLE: envString(
    "NEXT_PUBLIC_OG_ABOUT_SUBTITLE",
    envString("NEXT_PUBLIC_OWNER_NAME", "Boden Crouch"),
  ),
  OG_ABOUT_DESCRIPTION: envString(
    "NEXT_PUBLIC_OG_ABOUT_DESCRIPTION",
    "Projects, live services, technical guides, and engineering background.",
  ),
  OG_CONTACT_TITLE: envString("NEXT_PUBLIC_OG_CONTACT_TITLE", "Contact"),
  OG_CONTACT_SUBTITLE: envString(
    "NEXT_PUBLIC_OG_CONTACT_SUBTITLE",
    "Start a Conversation",
  ),
  OG_CONTACT_DESCRIPTION: envString(
    "NEXT_PUBLIC_OG_CONTACT_DESCRIPTION",
    "Reach out for questions, collaboration, or project discussions.",
  ),
  OG_DASHBOARD_TITLE: envString(
    "NEXT_PUBLIC_OG_DASHBOARD_TITLE",
    "Service Dashboard",
  ),
  OG_DASHBOARD_SUBTITLE: envString(
    "NEXT_PUBLIC_OG_DASHBOARD_SUBTITLE",
    "Live Infrastructure Views",
  ),
  OG_DASHBOARD_DESCRIPTION: envString(
    "NEXT_PUBLIC_OG_DASHBOARD_DESCRIPTION",
    "Real-time service visibility for self-hosted platforms and operations.",
  ),
  OG_GUIDES_TITLE: envString("NEXT_PUBLIC_OG_GUIDES_TITLE", "Technical Guides"),
  OG_GUIDES_SUBTITLE: envString(
    "NEXT_PUBLIC_OG_GUIDES_SUBTITLE",
    "Practical Infrastructure Knowledge",
  ),
  OG_GUIDES_DESCRIPTION: envString(
    "NEXT_PUBLIC_OG_GUIDES_DESCRIPTION",
    "Kubernetes, Docker, Terraform, VS Code workflows, and production patterns.",
  ),
  OG_PROJECTS_TITLE: envString("NEXT_PUBLIC_OG_PROJECTS_TITLE", "Projects"),
  OG_PROJECTS_SUBTITLE: envString(
    "NEXT_PUBLIC_OG_PROJECTS_SUBTITLE",
    "Public Tools & Services",
  ),
  OG_PROJECTS_DESCRIPTION: envString(
    "NEXT_PUBLIC_OG_PROJECTS_DESCRIPTION",
    "Production-minded engineering projects with open-source visibility.",
  ),

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
    const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
    if (explicit) return explicit.replace(/\/+$/, "");
    return `${this.SITE_PROTOCOL}://${this.SITE_DOMAIN}`;
  },
  get GITHUB_URL() {
    return `https://github.com/${this.GITHUB_OWNER}`;
  },
  get SEARXNG_URL() {
    return envString("NEXT_PUBLIC_SEARXNG_URL", this.SEARXNG_PUBLIC_URL);
  },
  get SEARXNG_FALLBACK_ENABLED() {
    return (
      envFlag("SEARXNG_FALLBACK_ENABLED", true) &&
      envFlag("NEXT_PUBLIC_SEARXNG_FALLBACK_ENABLED", true)
    );
  },
  getSubdomainUrl(sub: string) {
    return `${this.SITE_PROTOCOL}://${sub}.${this.SITE_DOMAIN}`;
  },
  getRouteUrl(pathname: string) {
    if (!pathname || pathname === "/") return this.SITE_URL;
    return `${this.SITE_URL}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
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
 * Normalized section structure used by pages for layout configuration
 */
export type NormalizedSection<TId extends string = string> = {
  id: TId;
  label: string;
  enabled: boolean;
  order: number;
};

/**
 * Generic builder for configuring page layout sections.
 * Validates, normalizes, and sorts sections from config with fallback to legacy or defaults.
 *
 * @param layoutConfig - Array from config (HOME_LAYOUT_SECTIONS, ABOUT_LAYOUT_SECTIONS, etc.)
 * @param validIds - Set of valid section IDs for this page
 * @param labelFallbacks - Map of ID → fallback label when config label is empty
 * @param legacyFallback - Optional function to build fallback sections if layoutConfig is empty.
 *                         If not provided, uses all validIds with fallback labels.
 */
export function buildConfiguredSections<TId extends string>(
  layoutConfig: Array<{ id: unknown; label?: string; enabled?: boolean; order?: number }>,
  validIds: Set<TId>,
  labelFallbacks: Record<TId, string>,
  legacyFallback?: (fallbackIds: TId[]) => NormalizedSection<TId>[],
): NormalizedSection<TId>[] {
  const fromLayout = layoutConfig
    .filter(
      (section): section is typeof section & { id: TId } =>
        validIds.has(section.id as TId),
    )
    .map((section) => ({
      id: section.id,
      label: section.label?.toString().trim() || labelFallbacks[section.id],
      enabled: Boolean(section.enabled),
      order: Number.isFinite(section.order as number) ? (section.order as number) : 999,
    }))
    .sort((a, b) => a.order - b.order);

  if (fromLayout.length > 0) return fromLayout;

  // Use legacy fallback if provided, otherwise return all valid IDs with fallback labels
  if (legacyFallback) {
    return legacyFallback(Array.from(validIds));
  }

  const fallbackIds = Array.from(validIds);
  return fallbackIds.map((id, index) => ({
    id,
    label: labelFallbacks[id],
    enabled: true,
    order: index + 1,
  }));
}

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
