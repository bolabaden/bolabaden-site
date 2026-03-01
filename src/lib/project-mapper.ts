/**
 * Maps GitHub repositories to curated project metadata.
 * Keeps lightweight, stable fields only.
 */

import { Project } from "./types";
import { EnhancedGitHubRepo } from "./github-enhanced";
import { config } from "./config";

interface ProjectMetadata {
  featured?: boolean;
  customTitle?: string;
  customDescription?: string;
  customTechnologies?: string[];
  customCategory?: Project["category"];
  liveUrl?: string;
}

export const PROJECT_METADATA: Record<string, ProjectMetadata> = {
  "bolabaden-infra": {
    featured: true,
    customTitle: "Bolabaden Infrastructure",
  },
  "bolabaden-site": {
    featured: true,
    customTitle: "Bolabaden NextJS Website",
    liveUrl: config.SITE_URL,
  },
  cloudcradle: {
    featured: true,
  },
  "ai-researchwizard": {
    featured: true,
    customTitle: "AI Research Wizard",
    liveUrl: config.getSubdomainUrl("gptr"),
  },
  constellation: {
    featured: true,
  },
  llm_fallbacks: {
    featured: false,
    customTitle: "LLM Fallbacks",
  },
};

export function enrichProject(project: Project): Project {
  const metadata = PROJECT_METADATA[project.id];

  if (!metadata) {
    return project;
  }

  return {
    ...project,
    ...(metadata.customTitle && { title: metadata.customTitle }),
    ...(metadata.customDescription && {
      description: metadata.customDescription,
    }),
    ...(metadata.customTechnologies && {
      technologies: metadata.customTechnologies,
    }),
    ...(metadata.customCategory && { category: metadata.customCategory }),
    ...(metadata.liveUrl && { liveUrl: metadata.liveUrl }),
    featured: metadata.featured ?? project.featured,
  };
}

/**
 * Check if a project should be excluded from display
 * Filters out forks, archived repos, and low-quality repos.
 */
export function shouldIncludeProject(
  repo: EnhancedGitHubRepo,
  options: {
    includeForks?: boolean;
    includeArchived?: boolean;
    minStars?: number;
  } = {},
): boolean {
  const {
    includeForks = false,
    includeArchived = false,
    minStars = 0,
  } = options;

  if (repo.disabled) {
    return false;
  }

  if (repo.archived && !includeArchived) {
    return false;
  }

  if (repo.fork && !includeForks) {
    return false;
  }

  if (repo.stargazers_count < minStars) {
    return false;
  }

  if (!repo.description && repo.stargazers_count === 0) {
    return false;
  }

  return true;
}
