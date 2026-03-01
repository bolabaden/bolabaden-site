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

export function ProjectsSection() {
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
        // Use auto-discover for fully dynamic project loading from GitHub
        const response = await fetch(
          "/api/projects/auto-discover?includeArchived=false&minStars=0",
        );

        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }

        const data = await response.json();

        // Convert date strings back to Date objects
        const projectsWithDates = data.projects.map((p: any) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt),
        }));

        // Fetch enhanced stats in a single request and merge by project ID
        let enhancedStats: Record<string, EnhancedRepoStats> = {};
        try {
          const statsRes = await fetch("/api/projects/enhanced");
          if (statsRes.ok) {
            const statsData = await statsRes.json();
            enhancedStats = statsData.githubStats || {};
          }
        } catch {
          // Continue without enhanced stats
        }

        // Match enhanced stats to auto-discovered projects by GitHub URL
        const processedStats: Record<string, EnhancedRepoStats> = {};
        for (const project of projectsWithDates) {
          // Direct ID match first (works for static projects)
          if (enhancedStats[project.id]) {
            processedStats[project.id] = enhancedStats[project.id];
            continue;
          }
          // Fallback: match by GitHub URL suffix (repo name)
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

        setProjects(projectsWithDates);
        setGithubStats(processedStats);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
        setError("Using cached data");
        // Keep using fallback projects
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  // Intelligent sorting function
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
          // Sort by most recent push or update
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

  // Score projects across multiple quality signals and feature only top tier.
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
      title="Public Tools & Services"
      subtitle="All services are live, self-hosted, and available for public use. Click to explore."
      background="default"
    >
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">
            Loading realtime project data...
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
          {/* Featured Projects */}
          {featuredProjects.length > 0 && (
            <div className="mb-16">
              <h3 className="text-2xl font-semibold mb-8 text-center">
                Featured Projects
              </h3>
              <div className="grid grid-cols-1 items-start md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProjects.map((project) => (
                  <EnhancedProjectCard
                    key={project.id}
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

          {/* Filter & Sort Bar */}
          <div className="mb-8 space-y-4">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveFilter(category)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize",
                    activeFilter === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/50 text-secondary-foreground hover:bg-secondary/70",
                  )}
                >
                  {category === "all"
                    ? "All Projects"
                    : category.replace("-", " & ")}
                </button>
              ))}
            </div>

            {/* Sort Options */}
            <div className="flex items-center justify-center gap-2 text-sm">
              <ArrowUpDown
                className="h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
              <span className="text-muted-foreground">Sort by:</span>
              <div className="flex gap-2">
                <button
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

          {/* All Projects Grid */}
          <div className="grid grid-cols-1 items-start md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {filteredProjects.map((project) => (
              <EnhancedProjectCard
                key={project.id}
                project={project}
                githubStats={githubStats[project.id]}
                CategoryIcon={CategoryIcon}
                StatusBadge={StatusBadge}
              />
            ))}
          </div>

          {/* GitHub CTA */}
          <div className="text-center">
            <div className="glass rounded-lg p-8 max-w-2xl mx-auto">
              <Github className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-4">
                Open Source Contributions
              </h3>
              <p className="text-muted-foreground mb-6">
                All projects are open source and available on GitHub. Feel free
                to contribute, fork, or use them as inspiration for your own
                projects.
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
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 glass hover:bg-white/10 transition-colors rounded-lg"
                >
                  <Code className="h-4 w-4" />
                  Collaborate
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </Section>
  );
}
