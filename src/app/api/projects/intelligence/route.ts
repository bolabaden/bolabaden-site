import { NextResponse } from "next/server";
import {
  fetchCommitActivity,
  fetchLanguageStats,
  type EnhancedGitHubRepo,
} from "@/lib/github-enhanced";
import { config } from "@/lib/config";

/**
 * GET /api/projects/intelligence
 * Curated portfolio intelligence: discover, filter, score, rank all repositories.
 *
 * CONTEXT: Portfolio/Flex-Focused Curated Feed
 * Advanced filtering (relationship: owned/contributed/forked, type: repo/gist, category)
 * with multi-axis quality scoring (activity, language, stars, community).
 * Returns ALL matched repos ranked by composite score for portfolio discovery.
 *
 * Used by: AboutProjectsSection (portfolio feature + all projects display on /about)
 * Data flows: filter GitHub repos → composite scoring → ranked portfolio feed
 */

export const revalidate = 900;

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

interface GitHubRepoOwner {
  login: string;
  type: "User" | "Organization";
}

interface GitHubRepoApi extends EnhancedGitHubRepo {
  owner: GitHubRepoOwner;
  subscribers_count?: number;
}

interface GitHubEventRepo {
  name: string;
}

interface GitHubEvent {
  type: string;
  repo?: GitHubEventRepo;
}

interface GitHubGistFile {
  filename?: string;
  language?: string;
  size?: number;
}

interface GitHubGistApi {
  id: string;
  description: string | null;
  html_url: string;
  created_at: string;
  updated_at: string;
  comments: number;
  public: boolean;
  files: Record<string, GitHubGistFile>;
  owner?: {
    login?: string;
  };
  forks?: unknown[];
}

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
  languages: Record<string, number>;
  topics: string[];
  createdAt: string;
  updatedAt: string;
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

function getGitHubHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };

  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function githubFetch<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, {
      headers: getGitHubHeaders(),
      next: { revalidate },
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

async function fetchUserOwnedRepos(username: string): Promise<GitHubRepoApi[]> {
  const repos: GitHubRepoApi[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore && page <= 5) {
    const data = await githubFetch<GitHubRepoApi[]>(
      `https://api.github.com/users/${username}/repos?type=owner&per_page=100&page=${page}&sort=updated`,
    );

    if (!Array.isArray(data) || data.length === 0) {
      break;
    }

    repos.push(...data.filter((repo) => !repo.private && !repo.disabled));
    hasMore = data.length === 100;
    page += 1;
  }

  return repos;
}

async function fetchUserPublicEvents(username: string): Promise<GitHubEvent[]> {
  const first = await githubFetch<GitHubEvent[]>(
    `https://api.github.com/users/${username}/events/public?per_page=100&page=1`,
  );
  const second = await githubFetch<GitHubEvent[]>(
    `https://api.github.com/users/${username}/events/public?per_page=100&page=2`,
  );

  return [
    ...(Array.isArray(first) ? first : []),
    ...(Array.isArray(second) ? second : []),
  ];
}

function extractContributedRepoNames(
  events: GitHubEvent[],
  username: string,
): string[] {
  const contributionEvents = new Set([
    "PushEvent",
    "PullRequestEvent",
    "PullRequestReviewEvent",
    "IssuesEvent",
    "IssueCommentEvent",
    "CommitCommentEvent",
  ]);

  const repoNames = new Set<string>();
  const normalizedUser = username.toLowerCase();

  for (const event of events) {
    if (!event.repo?.name || !contributionEvents.has(event.type)) {
      continue;
    }

    const [owner] = event.repo.name.split("/");
    if (!owner || owner.toLowerCase() === normalizedUser) {
      continue;
    }

    repoNames.add(event.repo.name.toLowerCase());
  }

  return Array.from(repoNames);
}

async function fetchRepoByFullName(
  fullName: string,
): Promise<GitHubRepoApi | null> {
  return githubFetch<GitHubRepoApi>(`https://api.github.com/repos/${fullName}`);
}

async function fetchUserGists(username: string): Promise<GitHubGistApi[]> {
  const first = await githubFetch<GitHubGistApi[]>(
    `https://api.github.com/users/${username}/gists?per_page=100&page=1`,
  );
  const second = await githubFetch<GitHubGistApi[]>(
    `https://api.github.com/users/${username}/gists?per_page=100&page=2`,
  );

  const merged = [
    ...(Array.isArray(first) ? first : []),
    ...(Array.isArray(second) ? second : []),
  ];

  return merged.filter((gist) => gist.public !== false);
}

function inferUseCase(
  language: string | null,
  topics: string[],
  description: string,
): UseCase {
  const lang = (language || "").toLowerCase();
  const desc = description.toLowerCase();
  const topicSet = new Set(topics.map((topic) => topic.toLowerCase()));

  if (
    ["ai", "ml", "llm", "rag", "openai", "machine-learning"].some((tag) =>
      topicSet.has(tag),
    ) ||
    ["llm", "machine learning", "neural", "ai"].some((term) =>
      desc.includes(term),
    )
  ) {
    return "ai-ml";
  }

  if (
    ["kubernetes", "terraform", "docker", "infrastructure", "devops"].some(
      (tag) => topicSet.has(tag),
    ) ||
    ["kubernetes", "terraform", "infrastructure", "homelab"].some((term) =>
      desc.includes(term),
    )
  ) {
    return "infrastructure";
  }

  if (
    ["security", "auth", "encryption", "zero-trust"].some((tag) =>
      topicSet.has(tag),
    ) ||
    ["security", "authentication", "authorization", "oauth"].some((term) =>
      desc.includes(term),
    )
  ) {
    return "security";
  }

  if (
    ["data", "analytics", "etl", "warehouse"].some((tag) =>
      topicSet.has(tag),
    ) ||
    ["data pipeline", "analytics", "dataset"].some((term) =>
      desc.includes(term),
    )
  ) {
    return "data";
  }

  if (
    ["frontend", "ui", "nextjs", "react"].some((tag) => topicSet.has(tag)) ||
    ["typescript", "javascript"].includes(lang)
  ) {
    return "frontend";
  }

  if (
    ["api", "backend", "service"].some((tag) => topicSet.has(tag)) ||
    ["go", "rust", "python", "java", "c#"].includes(lang)
  ) {
    return "backend";
  }

  if (
    ["cli", "tooling", "developer-tools", "sdk"].some((tag) =>
      topicSet.has(tag),
    ) ||
    ["tool", "cli", "sdk"].some((term) => desc.includes(term))
  ) {
    return "developer-tools";
  }

  if (
    ["workflow", "automation", "actions", "bot"].some((tag) =>
      topicSet.has(tag),
    ) ||
    ["automation", "workflow"].some((term) => desc.includes(term))
  ) {
    return "automation";
  }

  if (
    ["platform", "ops", "sre"].some((tag) => topicSet.has(tag)) ||
    ["platform", "operations"].some((term) => desc.includes(term))
  ) {
    return "platform";
  }

  if (
    ["research", "experiment"].some((tag) => topicSet.has(tag)) ||
    ["research", "experiment"].some((term) => desc.includes(term))
  ) {
    return "research";
  }

  return "other";
}

function calculateRecentCommits(
  weeks: Array<{ week: number; total: number }>,
): number {
  const thirtyOneDaysAgo = Date.now() - 31 * 24 * 60 * 60 * 1000;

  return weeks
    .filter((week) => week.week * 1000 >= thirtyOneDaysAgo)
    .reduce((sum, week) => sum + week.total, 0);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function computeScores(input: {
  stars: number;
  forks: number;
  watchers: number;
  recentCommits: number;
  totalCommits: number;
  sizeKb: number;
  codeBytes: number;
  pushedAt: string;
}): {
  popularityScore: number;
  activityScore: number;
  codeScore: number;
  compositeScore: number;
} {
  const daysSincePush = Math.max(
    0,
    Math.floor(
      (Date.now() - new Date(input.pushedAt).getTime()) / (1000 * 60 * 60 * 24),
    ),
  );

  const popularityRaw =
    input.stars * 8 +
    input.forks * 5 +
    input.watchers * 2 +
    Math.log1p(input.stars) * 12;
  const popularityScore = clamp(popularityRaw, 0, 100);

  const activityRaw =
    100 -
    daysSincePush * 1.4 +
    Math.log1p(input.recentCommits) * 18 +
    Math.log1p(input.totalCommits) * 6;
  const activityScore = clamp(activityRaw, 0, 100);

  const codeRaw =
    Math.log1p(input.sizeKb) * 10 + Math.log1p(input.codeBytes) * 4;
  const codeScore = clamp(codeRaw, 0, 100);

  const compositeScore = clamp(
    popularityScore * 0.45 + activityScore * 0.35 + codeScore * 0.2,
    0,
    100,
  );

  return {
    popularityScore: round(popularityScore),
    activityScore: round(activityScore),
    codeScore: round(codeScore),
    compositeScore: round(compositeScore),
  };
}

async function buildRepositoryItem(
  repo: GitHubRepoApi,
  relationship: Relationship,
  sourceUser: string,
): Promise<IntelligenceItem> {
  const [owner, repoName] = repo.full_name.split("/");

  const [commitWeeks, languages] = await Promise.all([
    fetchCommitActivity(owner, repoName),
    fetchLanguageStats(owner, repoName),
  ]);

  const totalCommits = commitWeeks.reduce((sum, week) => sum + week.total, 0);
  const recentCommits = calculateRecentCommits(commitWeeks);
  const codeBytes = Object.values(languages).reduce(
    (sum, bytes) => sum + bytes,
    0,
  );

  const scores = computeScores({
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    watchers: repo.watchers_count + (repo.subscribers_count || 0),
    recentCommits,
    totalCommits,
    sizeKb: repo.size,
    codeBytes,
    pushedAt: repo.pushed_at || repo.updated_at,
  });

  return {
    id: `repo-${repo.full_name.toLowerCase()}`,
    title: repo.name,
    description: repo.description || "No description provided.",
    url: repo.html_url,
    type: "repository",
    relationship,
    owner: repo.owner.login,
    ownerType: repo.owner.type === "Organization" ? "organization" : "user",
    sourceUser,
    useCase: inferUseCase(
      repo.language,
      repo.topics || [],
      repo.description || "",
    ),
    language: repo.language,
    languages,
    topics: repo.topics || [],
    createdAt: repo.created_at,
    updatedAt: repo.updated_at,
    pushedAt: repo.pushed_at || repo.updated_at,
    ...scores,
    metrics: {
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      watchers: repo.watchers_count + (repo.subscribers_count || 0),
      openIssues: repo.open_issues_count,
      sizeKb: repo.size,
      codeBytes,
      totalCommits,
      recentCommits,
    },
  };
}

function buildGistItem(
  gist: GitHubGistApi,
  sourceUser: string,
): IntelligenceItem {
  const files = Object.values(gist.files || {});
  const codeBytes = files.reduce((sum, file) => sum + (file.size || 0), 0);
  const language = files.find((file) => file.language)?.language || null;
  const primaryFilename = files.find((file) => file.filename)?.filename;
  const relationship: Relationship = "owned";

  const scores = computeScores({
    stars: 0,
    forks: Array.isArray(gist.forks) ? gist.forks.length : 0,
    watchers: 0,
    recentCommits: 0,
    totalCommits: 0,
    sizeKb: Math.round(codeBytes / 1024),
    codeBytes,
    pushedAt: gist.updated_at,
  });

  return {
    id: `gist-${gist.id}`,
    title: primaryFilename || gist.id,
    description: gist.description || "Public gist snippet",
    url: gist.html_url,
    type: "gist",
    relationship,
    owner: gist.owner?.login || sourceUser,
    ownerType: "user",
    sourceUser,
    useCase: inferUseCase(
      language,
      [],
      gist.description || primaryFilename || "",
    ),
    language,
    languages: language && codeBytes > 0 ? { [language]: codeBytes } : {},
    topics: [],
    createdAt: gist.created_at,
    updatedAt: gist.updated_at,
    pushedAt: gist.updated_at,
    ...scores,
    metrics: {
      stars: 0,
      forks: Array.isArray(gist.forks) ? gist.forks.length : 0,
      watchers: 0,
      openIssues: 0,
      sizeKb: Math.round(codeBytes / 1024),
      codeBytes,
      totalCommits: 0,
      recentCommits: 0,
      comments: gist.comments,
      fileCount: files.length,
    },
  };
}

export async function GET() {
  try {
    const usernames = Array.from(
      new Set(
        config.GITHUB_USERNAMES.map((entry) => entry.trim()).filter(Boolean),
      ),
    );

    if (usernames.length === 0) {
      return NextResponse.json({
        items: [],
        lastUpdated: new Date().toISOString(),
      });
    }

    const ownedReposByUser = await Promise.all(
      usernames.map(async (username) => ({
        username,
        repos: await fetchUserOwnedRepos(username),
      })),
    );

    const eventsByUser = await Promise.all(
      usernames.map(async (username) => ({
        username,
        events: await fetchUserPublicEvents(username),
      })),
    );

    const contributedRepoByUser = await Promise.all(
      eventsByUser.map(async ({ username, events }) => {
        const repoNames = extractContributedRepoNames(events, username);
        const repos = await Promise.all(
          repoNames
            .slice(0, 50)
            .map((fullName) => fetchRepoByFullName(fullName)),
        );

        return {
          username,
          repos: repos.filter((repo): repo is GitHubRepoApi => Boolean(repo)),
        };
      }),
    );

    const repoMap = new Map<
      string,
      { repo: GitHubRepoApi; relationship: Relationship; sourceUser: string }
    >();

    for (const { username, repos } of ownedReposByUser) {
      for (const repo of repos) {
        const relationship: Relationship = repo.fork ? "forked" : "owned";
        repoMap.set(repo.full_name.toLowerCase(), {
          repo,
          relationship,
          sourceUser: username,
        });
      }
    }

    for (const { username, repos } of contributedRepoByUser) {
      for (const repo of repos) {
        const key = repo.full_name.toLowerCase();
        if (repoMap.has(key)) {
          continue;
        }

        repoMap.set(key, {
          repo,
          relationship: repo.fork ? "forked" : "contributed",
          sourceUser: username,
        });
      }
    }

    const gistByUser = await Promise.all(
      usernames.map(async (username) => ({
        username,
        gists: await fetchUserGists(username),
      })),
    );

    const repositoryItems = await Promise.all(
      Array.from(repoMap.values()).map(({ repo, relationship, sourceUser }) =>
        buildRepositoryItem(repo, relationship, sourceUser),
      ),
    );

    const gistItems = gistByUser.flatMap(({ username, gists }) =>
      gists.map((gist) => buildGistItem(gist, username)),
    );

    const items = [...repositoryItems, ...gistItems].sort(
      (a, b) => b.compositeScore - a.compositeScore,
    );

    const summary = {
      total: items.length,
      repositories: repositoryItems.length,
      gists: gistItems.length,
      owned: items.filter((item) => item.relationship === "owned").length,
      contributed: items.filter((item) => item.relationship === "contributed")
        .length,
      forked: items.filter((item) => item.relationship === "forked").length,
      organizations: new Set(
        items
          .filter((item) => item.ownerType === "organization")
          .map((item) => item.owner.toLowerCase()),
      ).size,
      owners: new Set(items.map((item) => item.owner.toLowerCase())).size,
    };

    const filters = {
      relationships: Array.from(
        new Set(items.map((item) => item.relationship)),
      ),
      ownerTypes: Array.from(new Set(items.map((item) => item.ownerType))),
      useCases: Array.from(new Set(items.map((item) => item.useCase))),
      types: Array.from(new Set(items.map((item) => item.type))),
      owners: Array.from(new Set(items.map((item) => item.owner))).sort(
        (a, b) => a.localeCompare(b),
      ),
    };

    return NextResponse.json({
      users: usernames,
      summary,
      filters,
      items,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to build project intelligence:", error);

    return NextResponse.json(
      {
        error: "Failed to build project intelligence",
        items: [],
        summary: {
          total: 0,
          repositories: 0,
          gists: 0,
          owned: 0,
          contributed: 0,
          forked: 0,
          organizations: 0,
          owners: 0,
        },
      },
      { status: 500 },
    );
  }
}
