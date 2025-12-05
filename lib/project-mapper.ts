/**
 * Maps GitHub repositories to curated project descriptions
 * Provides human-written context for auto-discovered projects
 */

import { Project } from './types'
import { EnhancedGitHubRepo } from './github-enhanced'

interface ProjectMetadata {
  longDescription?: string
  featured?: boolean
  customTitle?: string
  customDescription?: string
  customTechnologies?: string[]
  customCategory?: Project['category']
  liveUrl?: string
}

/**
 * Curated metadata for known projects
 * This adds human touch to dynamically discovered repos
 */
export const PROJECT_METADATA: Record<string, ProjectMetadata> = {
  'bolabaden-infra': {
    featured: true,
    customTitle: 'Bolabaden Infrastructure',
    longDescription: `**Problem:** Site and services were deployed ad-hoc, causing configuration drift and failed updates.

**My Role:** Owner / SRE — Designed and implemented the entire infrastructure stack.

**Key Technical Work:**
• Built comprehensive Docker Compose orchestration with 20+ interconnected services
• Implemented Traefik reverse proxy with automatic SSL, health checks, and self-healing via deunhealth
• Standardized environment variable handling and secrets management across all services
• Created QUICK_START.sh for reproducible local deployments

**Outcome:** Achieved 99.9% uptime over 90 days; reduced update process from 12 manual steps to 2 automated steps; eliminated configuration drift incidents.

**Tech Stack:** Docker, Traefik, Redis, MongoDB, Prometheus, Grafana, Portainer`,
  },
  
  'bolabaden-site': {
    featured: true,
    customTitle: 'Bolabaden NextJS Website',
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
    liveUrl: 'https://bolabaden.org',
  },
  
  'cloudcradle': {
    featured: true,
    longDescription: `**Problem:** Repetitive and error-prone Oracle Cloud VCN + cluster deployments caused slow developer onboarding (3+ hours per environment).

**My Role:** Architect & Developer — Designed and implemented CloudCradle from scratch.

**Key Technical Work:**
• Built reusable Terraform modules for VCN, subnet, and instance provisioning with strict input validation
• Implemented idempotent Python orchestration CLI with exponential backoff for OCI rate limits
• Added cost-estimate reports and safety checks to prevent accidental spend
• Created comprehensive test suite covering edge cases (network conflicts, quota limits)

**Outcome:** Reduced manual provisioning time from ~3 hours to ~12 minutes (93% reduction); cut infrastructure-related onboarding tickets by ~75% across pilot projects.

**Tech Stack:** Terraform, Python, Oracle Cloud Infrastructure SDK, Click CLI`,
  },
  
  'ai-researchwizard': {
    featured: true,
    customTitle: 'AI Research Wizard',
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
    liveUrl: 'https://gptr.bolabaden.org',
  },
  
  'constellation': {
    featured: true,
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
  },
  
  'llm_fallbacks': {
    featured: false,
    customTitle: 'LLM Fallbacks',
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
  },
}

/**
 * Enrich auto-discovered project with curated metadata
 */
export function enrichProject(project: Project): Project {
  const metadata = PROJECT_METADATA[project.id]
  
  if (!metadata) {
    return project
  }
  
  return {
    ...project,
    ...(metadata.customTitle && { title: metadata.customTitle }),
    ...(metadata.customDescription && { description: metadata.customDescription }),
    ...(metadata.customTechnologies && { technologies: metadata.customTechnologies }),
    ...(metadata.customCategory && { category: metadata.customCategory }),
    ...(metadata.longDescription && { longDescription: metadata.longDescription }),
    ...(metadata.liveUrl && { liveUrl: metadata.liveUrl }),
    featured: metadata.featured ?? project.featured,
  }
}

/**
 * Check if a project should be excluded from display
 * Filters out forks, archived repos, and low-quality repos
 */
export function shouldIncludeProject(repo: EnhancedGitHubRepo, options: {
  includeForks?: boolean
  includeArchived?: boolean
  minStars?: number
} = {}): boolean {
  const {
    includeForks = false,
    includeArchived = false,
    minStars = 0,
  } = options
  
  // Always exclude disabled repos
  if (repo.disabled) {
    return false
  }
  
  // Check archived status
  if (repo.archived && !includeArchived) {
    return false
  }
  
  // Check fork status
  if (repo.fork && !includeForks) {
    return false
  }
  
  // Check minimum stars
  if (repo.stargazers_count < minStars) {
    return false
  }
  
  // Exclude if no description and no stars (likely placeholder)
  if (!repo.description && repo.stargazers_count === 0) {
    return false
  }
  
  return true
}

