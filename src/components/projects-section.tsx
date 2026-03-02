"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpDown,
  ArrowUpRight,
  Calendar,
  ExternalLink,
  FileCode2,
  Filter,
  Flame,
  FolderGit2,
  GitCommitHorizontal,
  GitFork,
  Github,
  Loader2,
  Star,
  Users,
  Waves,
} from "lucide-react";
import { Section } from "./section";
import { config } from "@/lib/config";

type Relationship = "owned" | "contributed" | "forked";
type OwnerType = "user" | "organization";
type WorkType = "repository" | "gist";
type UseCase =
  | "infrastructure"
  | "ai-ml"
  | "platform"
  | "automation"
  | "developer-tools"
  | "frontend"
  | "backend"
  | "data"
  | "security"
  | "research"
  | "other";

type SortOption =
  | "composite"
  | "stars"
  | "commits"
  | "recent"
  | "code"
  | "activity";

interface IntelligenceItem {
  id: string;
  title: string;
  description: string;
  url: string;
  type: WorkType;
  relationship: Relationship;
  owner: string;
  ownerType: OwnerType;
  sourceUser: string;
  useCase: UseCase;
  language: string | null;
  pushedAt: string;
  popularityScore: number;
  activityScore: number;
  codeScore: number;
  compositeScore: number;
  metrics: {
    stars: number;
    forks: number;
    watchers: number;
    openIssues: number;
    sizeKb: number;
    codeBytes: number;
    totalCommits: number;
    recentCommits: number;
    comments?: number;
    fileCount?: number;
  };
}

interface IntelligenceResponse {
  users: string[];
  summary: {
    total: number;
    repositories: number;
    gists: number;
    owned: number;
    contributed: number;
    forked: number;
    organizations: number;
    owners: number;
  };
  filters: {
    relationships: Relationship[];
    ownerTypes: OwnerType[];
    useCases: UseCase[];
    types: WorkType[];
    owners: string[];
  };
  items: IntelligenceItem[];
  lastUpdated: string;
}

const useCaseLabels: Record<UseCase, string> = {
  infrastructure: "Infrastructure",
  "ai-ml": "AI / ML",
  platform: "Platform",
  automation: "Automation",
  "developer-tools": "Developer Tools",
  frontend: "Frontend",
  backend: "Backend",
  data: "Data",
  security: "Security",
  research: "Research",
  other: "Other",
};

const relationshipLabels: Record<Relationship, string> = {
  owned: "Owned",
  contributed: "Contributed",
  forked: "Forked",
};

function formatAgo(dateInput: string): string {
  const date = new Date(dateInput);
  const diffMs = Date.now() - date.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (days <= 0) return "today";
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}

function normalizeSize(kb: number): string {
  if (kb >= 1024 * 1024) {
    return `${(kb / (1024 * 1024)).toFixed(1)} GB`;
  }
  if (kb >= 1024) {
    return `${(kb / 1024).toFixed(1)} MB`;
  }
  return `${kb.toFixed(0)} KB`;
}

export function ProjectsSection() {
  const [sortBy, setSortBy] = useState<SortOption>("composite");
  const [relationshipFilter, setRelationshipFilter] = useState<
    Relationship | "all"
  >("all");
  const [ownerTypeFilter, setOwnerTypeFilter] = useState<OwnerType | "all">(
    "all",
  );
  const [typeFilter, setTypeFilter] = useState<WorkType | "all">("all");
  const [useCaseFilter, setUseCaseFilter] = useState<UseCase | "all">("all");
  const [ownerFilter, setOwnerFilter] = useState<string>("all");
  const [intelligence, setIntelligence] = useState<IntelligenceResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchIntelligence() {
      try {
        setLoading(true);
        const response = await fetch("/api/projects/intelligence");

        if (!response.ok) {
          throw new Error("Failed to fetch contribution intelligence");
        }

        const data = (await response.json()) as IntelligenceResponse;
        setIntelligence(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch contribution intelligence:", err);
        setError("Unable to load dynamic contribution data.");
      } finally {
        setLoading(false);
      }
    }

    fetchIntelligence();
  }, []);

  const filteredItems = useMemo(() => {
    const source = intelligence?.items ?? [];

    const filtered = source.filter((item) => {
      if (
        relationshipFilter !== "all" &&
        item.relationship !== relationshipFilter
      )
        return false;
      if (ownerTypeFilter !== "all" && item.ownerType !== ownerTypeFilter)
        return false;
      if (typeFilter !== "all" && item.type !== typeFilter) return false;
      if (useCaseFilter !== "all" && item.useCase !== useCaseFilter)
        return false;
      if (ownerFilter !== "all" && item.owner !== ownerFilter) return false;
      return true;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "composite":
          return b.compositeScore - a.compositeScore;
        case "stars":
          return b.metrics.stars - a.metrics.stars;
        case "commits":
          return b.metrics.totalCommits - a.metrics.totalCommits;
        case "code":
          return b.metrics.codeBytes - a.metrics.codeBytes;
        case "activity":
          return b.activityScore - a.activityScore;
        case "recent":
        default:
          return (
            new Date(b.pushedAt).getTime() - new Date(a.pushedAt).getTime()
          );
      }
    });
  }, [
    intelligence,
    ownerFilter,
    ownerTypeFilter,
    relationshipFilter,
    sortBy,
    typeFilter,
    useCaseFilter,
  ]);

  const summary = intelligence?.summary;

  return (
    <Section
      id="projects"
      title="Contributions & Gists"
      subtitle="Main-site discovery view of open-source contributions, repository activity, and public code artifacts ranked dynamically by impact and recency."
      background="default"
    >
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">
            Building contribution intelligence...
          </span>
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/35 bg-red-500/10 p-3 text-center text-sm text-red-300">
          {error}
        </div>
      )}

      {!loading && intelligence && (
        <>
          <div className="mb-8 rounded-xl border border-border bg-secondary/20 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Waves className="h-4 w-4 text-primary" />
                Ranked from configured users: {intelligence.users.join(", ")}
              </div>
              <div className="text-xs text-muted-foreground">
                Updated {formatAgo(intelligence.lastUpdated)}
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
              <div className="rounded-lg border border-border bg-background/50 p-3">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-lg font-semibold">{summary?.total ?? 0}</p>
              </div>
              <div className="rounded-lg border border-border bg-background/50 p-3">
                <p className="text-xs text-muted-foreground">Repos</p>
                <p className="text-lg font-semibold">
                  {summary?.repositories ?? 0}
                </p>
              </div>
              <div className="rounded-lg border border-border bg-background/50 p-3">
                <p className="text-xs text-muted-foreground">Gists</p>
                <p className="text-lg font-semibold">{summary?.gists ?? 0}</p>
              </div>
              <div className="rounded-lg border border-border bg-background/50 p-3">
                <p className="text-xs text-muted-foreground">Owned</p>
                <p className="text-lg font-semibold">{summary?.owned ?? 0}</p>
              </div>
              <div className="rounded-lg border border-border bg-background/50 p-3">
                <p className="text-xs text-muted-foreground">Contributed</p>
                <p className="text-lg font-semibold">
                  {summary?.contributed ?? 0}
                </p>
              </div>
              <div className="rounded-lg border border-border bg-background/50 p-3">
                <p className="text-xs text-muted-foreground">Forked</p>
                <p className="text-lg font-semibold">{summary?.forked ?? 0}</p>
              </div>
              <div className="rounded-lg border border-border bg-background/50 p-3">
                <p className="text-xs text-muted-foreground">Owners</p>
                <p className="text-lg font-semibold">{summary?.owners ?? 0}</p>
              </div>
              <div className="rounded-lg border border-border bg-background/50 p-3">
                <p className="text-xs text-muted-foreground">Orgs</p>
                <p className="text-lg font-semibold">
                  {summary?.organizations ?? 0}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8 rounded-xl border border-border bg-secondary/15 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" />
              Dynamic filters
            </div>

            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              <select
                aria-label="Filter by relationship"
                value={relationshipFilter}
                onChange={(event) =>
                  setRelationshipFilter(
                    event.target.value as Relationship | "all",
                  )
                }
                className="h-9 rounded-md border border-border bg-background px-3 text-sm"
              >
                <option value="all">All relationships</option>
                {intelligence.filters.relationships.map((value) => (
                  <option key={value} value={value}>
                    {relationshipLabels[value]}
                  </option>
                ))}
              </select>

              <select
                aria-label="Filter by owner type"
                value={ownerTypeFilter}
                onChange={(event) =>
                  setOwnerTypeFilter(event.target.value as OwnerType | "all")
                }
                className="h-9 rounded-md border border-border bg-background px-3 text-sm"
              >
                <option value="all">All owner types</option>
                {intelligence.filters.ownerTypes.map((value) => (
                  <option key={value} value={value}>
                    {value === "organization" ? "Organization" : "User"}
                  </option>
                ))}
              </select>

              <select
                aria-label="Filter by artifact type"
                value={typeFilter}
                onChange={(event) =>
                  setTypeFilter(event.target.value as WorkType | "all")
                }
                className="h-9 rounded-md border border-border bg-background px-3 text-sm"
              >
                <option value="all">All artifact types</option>
                {intelligence.filters.types.map((value) => (
                  <option key={value} value={value}>
                    {value === "repository" ? "Repositories" : "Gists"}
                  </option>
                ))}
              </select>

              <select
                aria-label="Filter by use case"
                value={useCaseFilter}
                onChange={(event) =>
                  setUseCaseFilter(event.target.value as UseCase | "all")
                }
                className="h-9 rounded-md border border-border bg-background px-3 text-sm"
              >
                <option value="all">All use cases</option>
                {intelligence.filters.useCases.map((value) => (
                  <option key={value} value={value}>
                    {useCaseLabels[value]}
                  </option>
                ))}
              </select>

              <select
                aria-label="Filter by owner"
                value={ownerFilter}
                onChange={(event) => setOwnerFilter(event.target.value)}
                className="h-9 rounded-md border border-border bg-background px-3 text-sm"
              >
                <option value="all">All owners</option>
                {intelligence.filters.owners.map((owner) => (
                  <option key={owner} value={owner}>
                    {owner}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                <select
                  aria-label="Sort contributions"
                  value={sortBy}
                  onChange={(event) =>
                    setSortBy(event.target.value as SortOption)
                  }
                  className="h-9 w-full bg-transparent text-sm outline-none"
                >
                  <option value="composite">Best overall</option>
                  <option value="stars">Most stars</option>
                  <option value="commits">Most commits</option>
                  <option value="recent">Most recent</option>
                  <option value="code">Largest code footprint</option>
                  <option value="activity">Highest activity</option>
                </select>
              </div>
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              Showing {filteredItems.length} of {intelligence.items.length}{" "}
              items
            </p>
          </div>

          {filteredItems.length === 0 && (
            <div className="rounded-xl border border-border bg-secondary/20 p-10 text-center text-muted-foreground">
              No matches for the selected filters.
            </div>
          )}

          {filteredItems.length > 0 && (
            <div className="mb-12 grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
              {filteredItems.map((item) => (
                <article
                  key={item.id}
                  className="rounded-xl border border-border bg-background/80 p-5 transition-colors hover:border-primary/40"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <div className="mb-2 flex flex-wrap gap-1.5">
                        <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                          {relationshipLabels[item.relationship]}
                        </span>
                        <span className="rounded-full border border-border bg-secondary/40 px-2 py-0.5 text-[11px] text-muted-foreground">
                          {item.type === "repository" ? "Repository" : "Gist"}
                        </span>
                        <span className="rounded-full border border-border bg-secondary/40 px-2 py-0.5 text-[11px] text-muted-foreground">
                          {item.ownerType === "organization" ? "Org" : "User"}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground leading-tight">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.owner} · {useCaseLabels[item.useCase]}
                      </p>
                    </div>
                    <Link
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-md border border-border p-2 text-muted-foreground transition-colors hover:text-foreground hover:border-primary/40"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </div>

                  <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">
                    {item.description}
                  </p>

                  <div className="mb-4 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-md border border-border bg-secondary/25 p-2">
                      <p className="text-muted-foreground">Composite</p>
                      <p className="font-semibold">{item.compositeScore}</p>
                    </div>
                    <div className="rounded-md border border-border bg-secondary/25 p-2">
                      <p className="text-muted-foreground">Popularity</p>
                      <p className="font-semibold">{item.popularityScore}</p>
                    </div>
                    <div className="rounded-md border border-border bg-secondary/25 p-2">
                      <p className="text-muted-foreground">Activity</p>
                      <p className="font-semibold">{item.activityScore}</p>
                    </div>
                    <div className="rounded-md border border-border bg-secondary/25 p-2">
                      <p className="text-muted-foreground">Code score</p>
                      <p className="font-semibold">{item.codeScore}</p>
                    </div>
                  </div>

                  <div className="mb-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3.5 w-3.5" />
                      {item.metrics.stars}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <GitFork className="h-3.5 w-3.5" />
                      {item.metrics.forks}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <GitCommitHorizontal className="h-3.5 w-3.5" />
                      {item.metrics.totalCommits}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Flame className="h-3.5 w-3.5" />
                      {item.metrics.recentCommits}/mo
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <FolderGit2 className="h-3.5 w-3.5" />
                      {normalizeSize(item.metrics.sizeKb)}
                    </span>
                    {item.type === "gist" && (
                      <span className="inline-flex items-center gap-1">
                        <FileCode2 className="h-3.5 w-3.5" />
                        {item.metrics.fileCount ?? 0} files
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatAgo(item.pushedAt)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      {item.language || "No primary language"}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Users className="h-3.5 w-3.5" />
                      Source: {item.sourceUser}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="text-center">
            <div className="mx-auto max-w-3xl rounded-xl border border-border bg-secondary/20 p-7">
              <h3 className="mb-3 text-2xl font-semibold">
                Portfolio evidence lives in About
              </h3>
              <p className="mb-6 text-muted-foreground">
                This main page is for broad discovery and quick navigation. For
                curated enterprise-ready portfolio proof and deeper narrative,
                use the About workspace.
              </p>
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/about#projects"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <ArrowUpRight className="h-4 w-4" />
                  Open About Portfolio
                </Link>
                <Link
                  href={config.GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-foreground transition-colors hover:border-primary/40"
                >
                  <Github className="h-4 w-4" />
                  Open GitHub
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </Section>
  );
}
