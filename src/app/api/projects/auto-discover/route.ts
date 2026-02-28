"use server";

import { NextResponse } from "next/server";
import { fetchAllUserRepos, EnhancedGitHubRepo } from "@/lib/github-enhanced";
import { enrichProject, shouldIncludeProject } from "@/lib/project-mapper";
import {
  scoreRepositoryQuality,
  selectFeaturedProjectIds,
} from "@/lib/project-quality";
import { Project } from "@/lib/types";
import { config } from "@/lib/config";

/**
 * Automatically map GitHub repository to project category
 * Based on topics, language, and description
 */
function inferCategory(repo: EnhancedGitHubRepo): Project["category"] {
  const topics = repo.topics.map((t) => t.toLowerCase());
  const desc = (repo.description || "").toLowerCase();
  const lang = (repo.language || "").toLowerCase();

  // AI/ML detection
  if (
    topics.some((t) =>
      ["ai", "ml", "llm", "machine-learning", "gpt", "openai"].includes(t),
    ) ||
    desc.includes("ai") ||
    desc.includes("llm") ||
    desc.includes("gpt")
  ) {
    return "ai-ml";
  }

  // Infrastructure detection
  if (
    topics.some((t) =>
      [
        "infrastructure",
        "devops",
        "kubernetes",
        "docker",
        "terraform",
        "iac",
      ].includes(t),
    ) ||
    desc.includes("infrastructure") ||
    desc.includes("kubernetes") ||
    desc.includes("terraform")
  ) {
    return "infrastructure";
  }

  // Frontend detection
  if (
    lang.includes("typescript") ||
    lang.includes("javascript") ||
    topics.some((t) =>
      ["react", "nextjs", "vue", "frontend", "ui"].includes(t),
    ) ||
    desc.includes("website") ||
    desc.includes("frontend")
  ) {
    return "frontend";
  }

  // Backend detection
  if (
    lang.includes("python") ||
    lang.includes("go") ||
    lang.includes("rust") ||
    topics.some((t) => ["backend", "api", "server"].includes(t)) ||
    desc.includes("api") ||
    desc.includes("backend")
  ) {
    return "backend";
  }

  // Database detection
  if (
    topics.some((t) =>
      ["database", "sql", "nosql", "mongodb", "postgres"].includes(t),
    ) ||
    desc.includes("database")
  ) {
    return "database";
  }

  // Security detection
  if (
    topics.some((t) => ["security", "auth", "encryption"].includes(t)) ||
    desc.includes("security") ||
    desc.includes("auth")
  ) {
    return "security";
  }

  // Default to devops
  return "devops";
}

/**
 * Convert GitHub repo to Project interface
 */
function repoToProject(repo: EnhancedGitHubRepo): Project {
  // Extract tech stack from topics and language
  const technologies = [
    repo.language,
    ...repo.topics.slice(0, 5), // Limit to 5 topics
  ].filter(Boolean) as string[];

  return {
    id: repo.name.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
    title: repo.name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    description: repo.description || "No description available",
    technologies,
    category: inferCategory(repo),
    status: repo.archived ? "archived" : "active",
    githubUrl: repo.html_url,
    liveUrl: repo.homepage || undefined,
    featured: false,
    createdAt: new Date(repo.created_at),
    updatedAt: new Date(repo.pushed_at || repo.updated_at),
  };
}

/**
 * GET /api/projects/auto-discover
 * Automatically discover and create project cards from GitHub repositories
 *
 * Query params:
 * - users: comma-separated GitHub usernames (default: from config.GITHUB_USERNAMES)
 * - includeArchived: include archived repos (default: false)
 * - minStars: minimum stars to include (default: 0)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const usersParam =
      searchParams.get("users") || config.GITHUB_USERNAMES.join(",");
    const includeArchived = searchParams.get("includeArchived") === "true";
    const minStars = parseInt(searchParams.get("minStars") || "0", 10);

    const usernames = usersParam
      .split(",")
      .map((u) => u.trim())
      .filter(Boolean);

    // Fetch all repos from all specified users
    const allRepos = await fetchAllUserRepos(usernames);

    // Apply intelligent filtering
    const filteredRepos = allRepos.filter((repo) =>
      shouldIncludeProject(repo, {
        includeArchived,
        includeForks: false, // Never include forks by default
        minStars,
      }),
    );

    // Convert repos to Project format and enrich with metadata
    const scoredProjects = filteredRepos.map((repo) => {
      const qualityScore = scoreRepositoryQuality(repo).score;
      const project = enrichProject(repoToProject(repo));
      return {
        ...project,
        qualityScore,
      };
    });

    // Feature only the top quality projects (capped ratio + minimum threshold)
    const featuredIds = new Set(
      selectFeaturedProjectIds(
        scoredProjects.map((project) => ({
          id: project.id,
          score: project.qualityScore ?? 0,
          archived: project.status === "archived",
        })),
        {
          minScore: 58,
          maxFeatured: 6,
          maxRatio: 0.35,
        },
      ),
    );

    const projects = scoredProjects.map((project) => ({
      ...project,
      featured: featuredIds.has(project.id),
    }));

    // Sort by last push (most recent first)
    const sortedProjects = projects.sort((a, b) => {
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    });

    return NextResponse.json({
      projects: sortedProjects,
      count: sortedProjects.length,
      users: usernames,
      filters: {
        includeArchived,
        minStars,
      },
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to auto-discover projects:", error);

    return NextResponse.json(
      {
        error: "Failed to discover projects",
        projects: [],
        count: 0,
      },
      { status: 500 },
    );
  }
}
