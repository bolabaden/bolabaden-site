import { EnhancedGitHubRepo, EnhancedRepoStats } from "./github-enhanced";
import { Project } from "./types";

export interface QualityFactor {
  key: string;
  label: string;
  weight: number;
  score: number;
}

export interface QualityScoreResult {
  score: number;
  factors: QualityFactor[];
}

export interface FeaturedSelectionInput {
  id: string;
  score: number;
  archived?: boolean;
}

export interface FeaturedSelectionOptions {
  minScore?: number;
  maxFeatured?: number;
  maxRatio?: number;
}

const DAY_MS = 24 * 60 * 60 * 1000;

function clamp01(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

function logNormalize(value: number, pivot: number): number {
  if (value <= 0 || pivot <= 0) return 0;
  return clamp01(Math.log1p(value) / Math.log1p(pivot));
}

function recencyScore(date: Date | string): number {
  const timestamp = new Date(date).getTime();
  if (!Number.isFinite(timestamp)) return 0;

  const days = (Date.now() - timestamp) / DAY_MS;

  if (days <= 7) return 1;
  if (days <= 30) return 0.9;
  if (days <= 90) return 0.7;
  if (days <= 180) return 0.45;
  if (days <= 365) return 0.25;
  return 0.1;
}

function average(scores: number[]): number {
  if (scores.length === 0) return 0;
  return scores.reduce((sum, value) => sum + value, 0) / scores.length;
}

function computeWeightedScore(factors: QualityFactor[]): QualityScoreResult {
  const totalWeight = factors.reduce((sum, factor) => sum + factor.weight, 0);
  if (totalWeight <= 0) {
    return { score: 0, factors };
  }

  const weighted = factors.reduce(
    (sum, factor) => sum + clamp01(factor.score) * factor.weight,
    0,
  );

  return {
    score: Math.round((weighted / totalWeight) * 100),
    factors,
  };
}

export function scoreRepositoryQuality(
  repo: EnhancedGitHubRepo,
): QualityScoreResult {
  const now = Date.now();
  const createdAt = new Date(repo.created_at).getTime();
  const repoAgeDays = Number.isFinite(createdAt)
    ? Math.max(0, (now - createdAt) / DAY_MS)
    : 0;

  const popularityBase = repo.stargazers_count + repo.forks_count;
  const issuesPressure =
    popularityBase <= 0
      ? repo.open_issues_count > 0
        ? 0.55
        : 0.8
      : clamp01(1 - repo.open_issues_count / (popularityBase + 20));

  const curationSignals = [
    repo.description ? 1 : 0,
    repo.homepage ? 1 : 0,
    repo.has_wiki ? 1 : 0,
    repo.has_pages ? 1 : 0,
  ];

  const productSignals = [
    repo.license ? 1 : 0,
    repo.has_issues ? 1 : 0,
    repo.has_projects ? 1 : 0,
    repo.has_downloads ? 1 : 0,
  ];

  const factors: QualityFactor[] = [
    {
      key: "stars",
      label: "Popularity (stars)",
      weight: 0.16,
      score: logNormalize(repo.stargazers_count, 150),
    },
    {
      key: "forks",
      label: "Adoption (forks)",
      weight: 0.1,
      score: logNormalize(repo.forks_count, 60),
    },
    {
      key: "watchers",
      label: "Follower interest",
      weight: 0.05,
      score: logNormalize(repo.watchers_count, 120),
    },
    {
      key: "activity",
      label: "Recent activity",
      weight: 0.16,
      score: recencyScore(repo.pushed_at),
    },
    {
      key: "issue-health",
      label: "Issue pressure",
      weight: 0.09,
      score: issuesPressure,
    },
    {
      key: "maturity",
      label: "Maturity",
      weight: 0.08,
      score: clamp01(repoAgeDays / 365),
    },
    {
      key: "curation",
      label: "Documentation + discoverability",
      weight: 0.08,
      score: average(curationSignals),
    },
    {
      key: "technical-depth",
      label: "Technical depth",
      weight: 0.12,
      score: average([
        logNormalize(repo.topics.length, 8),
        repo.language ? 1 : 0,
        logNormalize(repo.size, 60_000),
      ]),
    },
    {
      key: "product-readiness",
      label: "Product readiness",
      weight: 0.08,
      score: average(productSignals),
    },
    {
      key: "stability",
      label: "Repository stability",
      weight: 0.08,
      score: average([
        repo.fork ? 0.2 : 1,
        repo.archived ? 0 : 1,
        repo.disabled ? 0 : 1,
        repo.private ? 0 : 1,
      ]),
    },
  ];

  return computeWeightedScore(factors);
}

export function scoreProjectQuality(
  project: Project,
  stats?: EnhancedRepoStats | null,
): QualityScoreResult {
  const hasStats = Boolean(stats);

  const factors: QualityFactor[] = [
    {
      key: "stars",
      label: "Popularity (stars)",
      weight: 0.14,
      score: stats ? logNormalize(stats.stars, 150) : 0,
    },
    {
      key: "forks",
      label: "Adoption (forks)",
      weight: 0.08,
      score: stats ? logNormalize(stats.forks, 60) : 0,
    },
    {
      key: "total-commits",
      label: "Commit depth",
      weight: 0.16,
      score: stats ? logNormalize(stats.totalCommits, 500) : 0,
    },
    {
      key: "recent-commits",
      label: "Commit cadence",
      weight: 0.14,
      score: stats ? logNormalize(stats.recentCommitsCount, 60) : 0,
    },
    {
      key: "last-push",
      label: "Freshness",
      weight: 0.12,
      score: stats
        ? recencyScore(stats.lastPush)
        : recencyScore(project.updatedAt),
    },
    {
      key: "contributors",
      label: "Contributor breadth",
      weight: 0.1,
      score: stats ? logNormalize(stats.contributorCount, 10) : 0,
    },
    {
      key: "issue-health",
      label: "Maintenance health",
      weight: 0.08,
      score: stats
        ? clamp01(1 - stats.openIssues / (stats.totalCommits + 25))
        : 0.6,
    },
    {
      key: "technical-signal",
      label: "Technical signal",
      weight: 0.06,
      score: average([
        logNormalize(project.technologies.length, 10),
        stats ? logNormalize(Object.keys(stats.languages).length, 8) : 0.4,
      ]),
    },
    {
      key: "quality-metadata",
      label: "Metadata completeness",
      weight: 0.06,
      score: average([
        project.description ? 1 : 0,
        project.technologies.length > 0 ? 1 : 0,
        project.githubUrl ? 1 : 0,
        project.liveUrl ? 1 : 0,
      ]),
    },
    {
      key: "stability",
      label: "Repository stability",
      weight: 0.06,
      score: stats
        ? average([stats.isArchived ? 0 : 1, stats.isFork ? 0.2 : 1])
        : project.status === "archived"
          ? 0
          : 0.9,
    },
  ];

  const result = computeWeightedScore(factors);

  if (!hasStats) {
    // Avoid over-confident scores when we only have partial local metadata
    return {
      ...result,
      score: Math.round(result.score * 0.75),
    };
  }

  return result;
}

export function selectFeaturedProjectIds(
  projects: FeaturedSelectionInput[],
  options: FeaturedSelectionOptions = {},
): string[] {
  if (projects.length === 0) {
    return [];
  }

  const minScore = options.minScore ?? 60;
  const maxRatio = options.maxRatio ?? 0.35;
  const maxFeatured = options.maxFeatured ?? 6;

  const ranked = [...projects]
    .filter((project) => !project.archived)
    .sort((a, b) => b.score - a.score);

  const ratioCap = Math.max(1, Math.ceil(ranked.length * maxRatio));
  const hardCap = Math.max(1, Math.min(maxFeatured, ratioCap));
  const selected = ranked
    .filter((project) => project.score >= minScore)
    .slice(0, hardCap);

  if (selected.length > 0) {
    return selected.map((project) => project.id);
  }

  // Graceful fallback: if nothing hits threshold, feature the best one only.
  return ranked.slice(0, 1).map((project) => project.id);
}
