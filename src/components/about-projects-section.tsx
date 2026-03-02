"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Github,
  Code,
  Zap,
  Server,
  Brain,
  Network,
  Database,
  Shield,
  Loader2,
  ArrowUpDown,
  Star as StarIcon,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { Section } from "./section";
import { EnhancedProjectCard } from "./enhanced-project-card";
import { projects as fallbackProjects } from "@/lib/data";
import { Project } from "@/lib/types";
import { EnhancedRepoStats } from "@/lib/github-enhanced";
import { config } from "@/lib/config";
import {
  scoreProjectQuality,
  selectFeaturedProjectIds,
} from "@/lib/project-quality";
import { cn } from "@/lib/utils";

const StatusBadge = ({ status }: { status: Project["status"] }) => {
  const statusConfig = {
    active: {
      color: "bg-green-500/20 text-green-400",
      label: "Active Development",
    },
    completed: { color: "bg-blue-500/20 text-blue-400", label: "Completed" },
    archived: { color: "bg-gray-500/20 text-gray-400", label: "Archived" },
  };

  const { color, label } = statusConfig[status];

  return (
    <span className={cn("px-2 py-1 rounded-full text-xs font-medium", color)}>
      {label}
    </span>
  );
};

const CategoryIcon = ({ category }: { category: string }) => {
  const icons = {
    infrastructure: Server,
    "ai-ml": Brain,
    networking: Network,
    database: Database,
    security: Shield,
    frontend: Code,
    backend: Code,
    devops: Zap,
  };

  const Icon = icons[category as keyof typeof icons] || Code;

  return <Icon className="h-5 w-5" aria-hidden="true" />;
};

type SortOption = "recent" | "stars" | "name" | "commits";

/**
 * ABOUT-ONLY Projects Section
 * Portfolio-focused project showcase emphasizing production-ready work
 * Main site uses ProjectsSection for dynamic discovery of all contributions
 */
export function AboutProjectsSection() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  const [githubStats, setGithubStats] = useState<
    Record<string, EnhancedRepoStats>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        const response = await fetch(
          "/api/projects/auto-discover?includeArchived=false&minStars=0",
        );

        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }

        const data = (await response.json()) as {
          projects: Array<
            Omit<Project, "createdAt" | "updatedAt"> & {
              createdAt: string;
              updatedAt: string;
            }
          >;
        };

        const projectsWithDates = data.projects.map((p) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt),
        }));

        const seenIds = new Set<string>();
        const deduplicatedProjects = projectsWithDates.filter((project) => {
          if (seenIds.has(project.id)) {
            console.warn(
              `[AboutProjectsSection] Duplicate project ID filtered: ${project.id}`,
              project.githubUrl || "no URL",
            );
            return false;
          }
          seenIds.add(project.id);
          return true;
        });

        let enhancedStats: Record<string, EnhancedRepoStats> = {};
        try {
          const statsRes = await fetch("/api/projects/enhanced");
          if (statsRes.ok) {
            const statsData = (await statsRes.json()) as {
              githubStats?: Record<string, EnhancedRepoStats>;
            };
            enhancedStats = statsData.githubStats || {};
          }
        } catch {
          // Continue without enhanced stats
        }

        const processedStats: Record<string, EnhancedRepoStats> = {};
        for (const project of deduplicatedProjects) {
          if (enhancedStats[project.id]) {
            processedStats[project.id] = enhancedStats[project.id];
            continue;
          }
          if (project.githubUrl) {
            const repoName = project.githubUrl.split("/").pop()?.toLowerCase();
            for (const [id, stats] of Object.entries(enhancedStats)) {
              if (id.toLowerCase() === repoName) {
                processedStats[project.id] = stats;
                break;
              }
            }
          }
        }

        setProjects(deduplicatedProjects);
        setGithubStats(processedStats);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch about projects:", err);
        setError("Using cached data");
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  const sortProjects = (projectList: Project[]) => {
    return [...projectList].sort((a, b) => {
      const statsA = githubStats[a.id];
      const statsB = githubStats[b.id];

      switch (sortBy) {
        case "stars":
          return (statsB?.stars || 0) - (statsA?.stars || 0);

        case "commits":
          return (statsB?.totalCommits || 0) - (statsA?.totalCommits || 0);

        case "name":
          return a.title.localeCompare(b.title);

        case "recent":
        default:
          const dateA = statsA?.lastPush || a.updatedAt;
          const dateB = statsB?.lastPush || b.updatedAt;
          return new Date(dateB).getTime() - new Date(dateA).getTime();
      }
    });
  };

  const categories = [
    "all",
    ...Array.from(new Set(projects.map((p) => p.category))),
  ];
  const filteredProjects = sortProjects(
    activeFilter === "all"
      ? projects
      : projects.filter((project) => project.category === activeFilter),
  );

  const scoredProjects = projects.map((project) => ({
    project,
    score: scoreProjectQuality(project, githubStats[project.id]).score,
  }));

  const featuredIds = new Set(
    selectFeaturedProjectIds(
      scoredProjects.map(({ project, score }) => ({
        id: project.id,
        score,
        archived: project.status === "archived",
      })),
      {
        minScore: 60,
        maxFeatured: 6,
        maxRatio: 0.35,
      },
    ),
  );

  const featuredProjects = sortProjects(
    scoredProjects
      .filter(({ project }) => featuredIds.has(project.id))
      .map(({ project, score }) => ({ ...project, qualityScore: score })),
  ).slice(0, 6);

  return (
    <Section
      id="projects"
      title="Portfolio Projects"
      subtitle="Production and enterprise-relevant work used to demonstrate engineering scope, systems thinking, and delivery quality."
      background="default"
    >
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">
            Loading realtime portfolio data...
          </span>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-400 text-sm text-center">
          {error}
        </div>
      )}

      {!loading && (
        <>
          {featuredProjects.length > 0 && (
            <div className="mb-16">
              <h3 className="text-2xl font-semibold mb-8 text-center">
                Featured Portfolio Work
              </h3>
              <div className="grid grid-cols-1 items-start md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProjects.map((project, index) => (
                  <EnhancedProjectCard
                    key={`featured-${project.id}-${index}`}
                    project={project}
                    featured
                    githubStats={githubStats[project.id]}
                    CategoryIcon={CategoryIcon}
                    StatusBadge={StatusBadge}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="mb-8 space-y-4">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveFilter(category)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize",
                    activeFilter === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/50 text-secondary-foreground hover:bg-secondary/70",
                  )}
                >
                  {category === "all"
                    ? "All Portfolio Projects"
                    : category.replace("-", " & ")}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-center gap-2 text-sm flex-wrap">
              <ArrowUpDown
                className="h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
              <span className="text-muted-foreground">Sort by:</span>
              <div className="flex gap-2 flex-wrap justify-center">
                <button
                  type="button"
                  onClick={() => setSortBy("recent")}
                  className={cn(
                    "inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                    sortBy === "recent"
                      ? "bg-primary/20 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5",
                  )}
                >
                  <TrendingUp className="h-3 w-3" />
                  Recent Activity
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy("stars")}
                  className={cn(
                    "inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                    sortBy === "stars"
                      ? "bg-primary/20 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5",
                  )}
                >
                  <StarIcon className="h-3 w-3" />
                  Most Stars
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy("commits")}
                  className={cn(
                    "inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                    sortBy === "commits"
                      ? "bg-primary/20 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5",
                  )}
                >
                  <Calendar className="h-3 w-3" />
                  Most Commits
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 items-start md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {filteredProjects.map((project, index) => (
              <EnhancedProjectCard
                key={`${project.id}-${index}`}
                project={project}
                githubStats={githubStats[project.id]}
                CategoryIcon={CategoryIcon}
                StatusBadge={StatusBadge}
              />
            ))}
          </div>

          <div className="text-center">
            <div className="glass rounded-lg p-8 max-w-2xl mx-auto">
              <Github className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-4">Portfolio Source</h3>
              <p className="text-muted-foreground mb-6">
                This portfolio section focuses on enterprise-relevant execution,
                architecture depth, and operational outcomes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={config.GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Github className="h-4 w-4" />
                  View GitHub Profile
                </Link>
                <Link
                  href="/about#contact"
                  className="inline-flex items-center gap-2 px-6 py-3 glass hover:bg-white/10 transition-colors rounded-lg"
                >
                  <Code className="h-4 w-4" />
                  Discuss Enterprise Fit
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </Section>
  );
}
