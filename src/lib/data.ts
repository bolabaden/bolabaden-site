import { Project, TechStack, ContactInfo } from "./types";
import { config } from "./config";

// Service data is now fetched dynamically from the API
// endpoint at /api/services

/**
 * Get fallback dates for projects
 * Returns dates relative to current time to avoid staleness
 */
function getProjectFallbackDates(monthsAgo: number = 6) {
  const now = new Date();
  const created = new Date(now);
  created.setMonth(now.getMonth() - monthsAgo);

  const updated = new Date(now);
  updated.setMonth(now.getMonth() - Math.floor(monthsAgo / 3)); // Updated more recently

  return { createdAt: created, updatedAt: updated };
}

/**
 * FALLBACK PROJECT DATA
 *
 * This data is only used when the GitHub API is unavailable or during initial load.
 * In production, projects are dynamically fetched from /api/projects/auto-discover
 * which pulls real-time data from GitHub.
 *
 * The 'featured' flags here are fallback values only. Featured projects are
 * dynamically determined based on:
 * - Stars (10+)
 * - Total commits (50+)
 * - Recent activity (updated in last 30 days with 5+ stars)
 */
export const projects: Project[] = [
  {
    id: "bolabaden-infra",
    title: "Bolabaden Infrastructure",
    description: `Production-grade self-hosted infrastructure powering ${config.SITE_DOMAIN} and 8+ live services.`,
    longDescription: `**Problem:** Site and services were deployed ad-hoc, causing configuration drift and failed updates.

**My Role:** Owner / SRE — Designed and implemented the entire infrastructure stack.

**Key Technical Work:**
• Built comprehensive Docker Compose orchestration with 20+ interconnected services
• Implemented Traefik reverse proxy with automatic SSL, health checks, and self-healing via deunhealth
• Standardized environment variable handling and secrets management across all services
• Created QUICK_START.sh for reproducible local deployments

**Outcome:** Achieved 99.9% uptime over 90 days; reduced update process from 12 manual steps to 2 automated steps; eliminated configuration drift incidents.

**Tech Stack:** Docker, Traefik, Redis, MongoDB, Prometheus, Grafana, Portainer`,
    technologies: [
      "Docker",
      "Kubernetes",
      "Traefik",
      "Redis",
      "MongoDB",
      "Portainer",
      "Docker Socket Proxy",
    ],
    category: "infrastructure",
    status: "active",
    githubUrl: `${config.GITHUB_URL}/bolabaden-infra`,
    featured: true,
    ...getProjectFallbackDates(10), // Fallback: created ~10 months ago, updated ~3 months ago
  },
  {
    id: "bolabaden-site",
    title: "Bolabaden NextJS Website",
    description:
      "Modern portfolio site with SSR, optimized performance, and real-time service integration.",
    longDescription: `**Problem:** Previous site served heavy pages with no SSR caching and slow initial paint (2.8s FCP).

**My Role:** Frontend/Fullstack Developer — Migrated to Next.js and optimized for production.

**Key Technical Work:**
• Migrated to Next.js 14 with App Router and incremental static regeneration
• Implemented real-time GitHub API integration with fallback caching
• Optimized images via next/image with automatic WebP conversion
• Built comprehensive Jest test suite with 85%+ coverage
• Created production Dockerfile with multi-stage builds

**Outcome:** Lighthouse performance improved dramatically (FCP: 2.8s → 0.9s, 68% reduction); First Contentful Paint now consistently under 1 second.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Docker`,
    technologies: ["NextJS", "Tailwind CSS", "TypeScript", "React", "Docker"],
    category: "frontend",
    status: "active",
    githubUrl: `${config.GITHUB_URL}/bolabaden-site`,
    liveUrl: config.SITE_URL,
    featured: true,
    ...getProjectFallbackDates(10), // Fallback: created ~10 months ago, updated ~3 months ago
  },
  {
    id: "cloudcradle",
    title: "CloudCradle",
    description:
      "Terraform-based Oracle Cloud automation — provisions VCNs, clusters, and instances in minutes.",
    longDescription: `**Problem:** Repetitive and error-prone Oracle Cloud VCN + cluster deployments caused slow developer onboarding (3+ hours per environment).

**My Role:** Architect & Developer — Designed and implemented CloudCradle from scratch.

**Key Technical Work:**
• Built reusable Terraform modules for VCN, subnet, and instance provisioning with strict input validation
• Implemented idempotent Python orchestration CLI with exponential backoff for OCI rate limits
• Added cost-estimate reports and safety checks to prevent accidental spend
• Created comprehensive test suite covering edge cases (network conflicts, quota limits)

**Outcome:** Reduced manual provisioning time from ~3 hours to ~12 minutes (93% reduction); cut infrastructure-related onboarding tickets by ~75% across pilot projects.

**Tech Stack:** Terraform, Python, Oracle Cloud Infrastructure SDK, Click CLI`,
    technologies: ["Python", "Terraform", "Oracle Cloud", "Kubernetes"],
    category: "infrastructure",
    status: "active",
    githubUrl: `${config.GITHUB_URL}/cloudcradle`,
    featured: true,
    ...getProjectFallbackDates(11), // Fallback: created ~11 months ago, updated ~4 months ago
  },
  {
    id: "ai-researchwizard",
    title: "AI Research Wizard",
    description:
      "Multi-model research platform with intelligent fallbacks and cost optimization.",
    longDescription: `**Problem:** Researchers needed side-by-side model comparison and graceful fallback when larger models hit rate limits.

**My Role:** Full-stack Developer — Forked GPT-Researcher, added multi-model support and built React UI.

**Key Technical Work:**
• Added fallback chain with model-cost rules and context-length awareness
• Instrumented telemetry to compare latency and token-cost by model
• Implemented "safe mode" to filter outputs for PII before display
• Built React dashboard for side-by-side model comparison
• Added rate-limit handling with exponential backoff

**Outcome:** Cut average API cost per query ~35% via intelligent fallback heuristics; latency spikes now handled by fallbacks instead of errors; zero PII leaks in production.

⚠️ **Privacy Note:** Demo logs queries for debugging. Do not submit credentials or personal data.

**Tech Stack:** Python, FastAPI, React, LiteLLM, Docker, Redis`,
    technologies: ["Python", "FastAPI", "React", "Docker"],
    category: "ai-ml",
    status: "active",
    githubUrl: `${config.GITHUB_URL}/ai-researchwizard`,
    liveUrl: config.getSubdomainUrl("gptr"),
    featured: true,
    ...getProjectFallbackDates(10), // Fallback: created ~10 months ago, updated ~3 months ago
  },
  {
    id: "llm_fallbacks",
    title: "LLM Fallbacks",
    description:
      "Python library for intelligent LLM provider fallbacks with cost optimization.",
    longDescription: `**Problem:** LLM applications frequently hit rate limits or API failures, causing user-facing errors.

**My Role:** Library Author — Built a reusable Python package for production LLM workflows.

**Features:**
🔄 Automatic Fallbacks: Gracefully handle API failures by chaining alternative models
📊 Model Filtering: Filter by cost, context length, and capabilities
💰 Cost Optimization: Sort models by cost to minimize API spend
🧠 Model Discovery: Discover available models and their capabilities
🛠️ GUI Tool: Includes a GUI tool for exploring and filtering models

**Example Usage:**
\`\`\`python
from llm_fallbacks import FallbackChain
chain = FallbackChain([
    {"model":"gpt-4", "max_ctx": 8192, "cost_score": 10},
    {"model":"gpt-3.5-turbo", "max_ctx": 4096, "cost_score": 2},
])
response = chain.call(prompt, max_cost=5)
\`\`\`

**Outcome:** Reduced LLM API errors by 90%+ in production deployments; saved 30-40% on API costs via intelligent model selection.

**Tech Stack:** Python, LiteLLM, Pydantic, Typer CLI`,
    technologies: ["Python", "LiteLLM", "LLM"],
    category: "ai-ml",
    status: "active",
    githubUrl: `${config.GITHUB_URL}/llm_fallbacks`,
    featured: false,
    ...getProjectFallbackDates(22), // Fallback: created ~22 months ago, updated ~7 months ago
  },
  {
    id: "constellation",
    title: "Constellation",
    description:
      "Service orchestration platform with Prometheus monitoring and canary rollout support.",
    longDescription: `**Problem:** Managing 20+ self-hosted services required manual health checks and risky all-at-once deployments.

**My Role:** Architect & Developer — Built service orchestrator and monitoring integration.

**Key Technical Work:**
• Built Go orchestrator with health check monitoring and automated restarts
• Integrated Prometheus + Grafana with custom alerting rules for service health
• Implemented canary rollout support with automatic rollback on failure
• Added distributed tracing to identify slow service dependencies
• Created comprehensive dashboard for service health visualization

**Outcome:** Reduced incident mean-time-to-recovery from ~40 minutes to ~9 minutes (78% improvement) in simulated failure tests; zero downtime deployments for non-critical services.

**Tech Stack:** Go, Docker, Kubernetes, Prometheus, Grafana, InfluxDB`,
    technologies: ["Go", "Docker", "Kubernetes", "Prometheus"],
    category: "infrastructure",
    status: "active",
    githubUrl: `${config.GITHUB_URL}/constellation`,
    featured: true,
    ...getProjectFallbackDates(9), // Fallback: created ~9 months ago, updated ~3 months ago
  },
];

export const techStack: TechStack[] = [
  {
    name: "Kubernetes",
    category: "infrastructure",
    level: "expert",
    yearsOfExperience: 4,
    description:
      "Container orchestration, cluster management, and service mesh",
  },
  {
    name: "Docker",
    category: "infrastructure",
    level: "expert",
    yearsOfExperience: 5,
    description:
      "Containerization, multi-stage builds, and registry management",
  },
  {
    name: "Python",
    category: "backend",
    level: "advanced",
    yearsOfExperience: 6,
    description: "FastAPI, Django, automation scripts, and AI/ML integrations",
  },
  {
    name: "Go",
    category: "backend",
    level: "advanced",
    yearsOfExperience: 3,
    description: "High-performance services, CLI tools, and system programming",
  },
  {
    name: "TypeScript",
    category: "frontend",
    level: "advanced",
    yearsOfExperience: 4,
    description: "React, Next.js, and full-stack development",
  },
  {
    name: "Oracle Cloud",
    category: "infrastructure",
    level: "expert",
    yearsOfExperience: 2,
    description: "IaaS, networking, and cost optimization",
  },
  {
    name: "Tailscale",
    category: "infrastructure",
    level: "advanced",
    yearsOfExperience: 2,
    description: "Zero-config mesh networking and secure remote access",
  },
  {
    name: "Traefik",
    category: "infrastructure",
    level: "advanced",
    yearsOfExperience: 3,
    description: "Reverse proxy, load balancing, and SSL automation",
  },
];

export const contactInfo: ContactInfo = {
  email: config.CONTACT_EMAIL,
  github: config.GITHUB_URL,
  location: config.LOCATION,
  timezone: config.TIMEZONE,
  availability: "open-to-opportunities",
  preferredCommunication: ["email", "text-based chat", "async communication"],
  workPreferences: {
    remote: true,
    contract: true,
    fullTime: true,
    partTime: false,
  },
};

export const serviceCategories = {
  "ai-ml": "AI & Machine Learning",
  infrastructure: "Infrastructure",
  monitoring: "Monitoring",
  security: "Security",
  networking: "Networking",
  development: "Development",
  database: "Database",
};
