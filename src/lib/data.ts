import { Project, TechStack, ContactInfo } from "./types";
import { config, envJson } from "./config";

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
const defaultProjects: Project[] = [
  {
    id: "bolabaden-infra",
    title: "Bolabaden Infrastructure",
    description: `Production-grade self-hosted infrastructure powering ${config.SITE_DOMAIN} and 8+ live services.`,
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
    technologies: ["Go", "Docker", "Kubernetes", "Prometheus"],
    category: "infrastructure",
    status: "active",
    githubUrl: `${config.GITHUB_URL}/constellation`,
    featured: true,
    ...getProjectFallbackDates(9), // Fallback: created ~9 months ago, updated ~3 months ago
  },
];

export const projects: Project[] = envJson<Project[]>(
  "NEXT_PUBLIC_FALLBACK_PROJECTS_JSON",
  defaultProjects,
);

const defaultTechStack: TechStack[] = [
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

export const techStack: TechStack[] = envJson<TechStack[]>(
  "NEXT_PUBLIC_TECH_STACK_JSON",
  defaultTechStack,
);

const defaultContactInfo: ContactInfo = {
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

export const contactInfo: ContactInfo = envJson<ContactInfo>(
  "NEXT_PUBLIC_CONTACT_INFO_JSON",
  defaultContactInfo,
);

export const serviceCategories = envJson<Record<string, string>>(
  "NEXT_PUBLIC_SERVICE_CATEGORIES_JSON",
  {
    "ai-ml": "AI & Machine Learning",
    infrastructure: "Infrastructure",
    monitoring: "Monitoring",
    security: "Security",
    networking: "Networking",
    development: "Development",
    database: "Database",
  },
);
