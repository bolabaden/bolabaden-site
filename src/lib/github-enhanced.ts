/**
 * Enhanced GitHub API service with commit activity, stats, and rich data
 * Fetches comprehensive repository information for dynamic project cards
 */

export interface GitHubCommitActivity {
  week: number; // Unix timestamp
  total: number; // Total commits this week
  days: number[]; // Commits per day (Sun-Sat)
}

export interface GitHubLanguageStats {
  [language: string]: number; // Bytes of code
}

export interface GitHubContributor {
  login: string;
  contributions: number;
  avatar_url: string;
}

export interface EnhancedGitHubRepo {
  // Basic info
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;

  // Dates
  created_at: string;
  updated_at: string;
  pushed_at: string;

  // Stats
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  size: number;

  // Content
  language: string | null;
  topics: string[];
  license: { name: string; spdx_id: string } | null;

  // Status
  archived: boolean;
  disabled: boolean;
  private: boolean;
  fork: boolean;

  // Activity indicators
  has_issues: boolean;
  has_projects: boolean;
  has_downloads: boolean;
  has_wiki: boolean;
  has_pages: boolean;
}

export interface CommitGraphData {
  date: string;
  count: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isCommitActivityArray(
  value: unknown,
): value is GitHubCommitActivity[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        isRecord(item) &&
        typeof item.week === "number" &&
        typeof item.total === "number" &&
        Array.isArray(item.days),
    )
  );
}

function isContributorsArray(value: unknown): value is GitHubContributor[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        isRecord(item) &&
        typeof item.login === "string" &&
        typeof item.contributions === "number" &&
        typeof item.avatar_url === "string",
    )
  );
}

export interface EnhancedRepoStats {
  // Basic stats
  updatedAt: Date;
  createdAt: Date;
  lastPush: Date;
  stars: number;
  forks: number;
  openIssues: number;
  size: number;

  // Language stats
  primaryLanguage: string | null;
  languages: GitHubLanguageStats;
  topics: string[];

  // Activity data
  commitActivity: CommitGraphData[]; // Last 52 weeks
  totalCommits: number;
  recentCommitsCount: number; // Last 30 days

  // Contributors
  contributorCount: number;
  topContributors: GitHubContributor[];

  // Metadata
  license: string | null;
  isArchived: boolean;
  isFork: boolean;
  hasIssues: boolean;
}

/**
 * Fetch all public repositories for a GitHub user
 * @param username - GitHub username
 * @returns Array of repository data
 */
export async function fetchUserRepos(
  username: string,
): Promise<EnhancedGitHubRepo[]> {
  try {
    const token = process.env.GITHUB_TOKEN;
    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const repos: EnhancedGitHubRepo[] = [];
    let page = 1;
    let hasMore = true;

    // Fetch all pages (max 100 per page)
    while (hasMore && page <= 10) {
      // Safety limit of 10 pages (1000 repos)
      const response = await fetch(
        `https://api.github.com/users/${username}/repos?per_page=100&page=${page}&sort=updated`,
        {
          headers,
          next: { revalidate: 300 }, // Cache for 5 minutes
        },
      );

      if (!response.ok) {
        console.error(
          `GitHub API error for user ${username}: ${response.status}`,
        );
        break;
      }

      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        hasMore = false;
        break;
      }

      repos.push(...data);
      page++;
      hasMore = data.length === 100; // Continue if we got a full page
    }

    return repos;
  } catch (error) {
    console.error(`Failed to fetch repos for user ${username}:`, error);
    return [];
  }
}

/**
 * Fetch commit activity for a repository (last 52 weeks)
 * @param owner - Repository owner
 * @param repo - Repository name
 * @returns Array of weekly commit data
 */
export async function fetchCommitActivity(
  owner: string,
  repo: string,
): Promise<GitHubCommitActivity[]> {
  try {
    const token = process.env.GITHUB_TOKEN;
    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/stats/commit_activity`,
      {
        headers,
        next: { revalidate: 3600 }, // Cache for 1 hour
      },
    );

    if (!response.ok) {
      return [];
    }

    const data: unknown = await response.json();
    return isCommitActivityArray(data) ? data : [];
  } catch (error) {
    console.error(
      `Failed to fetch commit activity for ${owner}/${repo}:`,
      error,
    );
    return [];
  }
}

/**
 * Fetch language statistics for a repository
 * @param owner - Repository owner
 * @param repo - Repository name
 * @returns Language stats (bytes per language)
 */
export async function fetchLanguageStats(
  owner: string,
  repo: string,
): Promise<GitHubLanguageStats> {
  try {
    const token = process.env.GITHUB_TOKEN;
    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/languages`,
      {
        headers,
        next: { revalidate: 3600 }, // Cache for 1 hour
      },
    );

    if (!response.ok) {
      return {};
    }

    const data: unknown = await response.json();
    return isRecord(data) ? (data as GitHubLanguageStats) : {};
  } catch (error) {
    console.error(`Failed to fetch languages for ${owner}/${repo}:`, error);
    return {};
  }
}

/**
 * Fetch top contributors for a repository
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param limit - Max contributors to return
 * @returns Array of contributors
 */
export async function fetchContributors(
  owner: string,
  repo: string,
  limit: number = 5,
): Promise<GitHubContributor[]> {
  try {
    const token = process.env.GITHUB_TOKEN;
    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contributors?per_page=${limit}`,
      {
        headers,
        next: { revalidate: 3600 }, // Cache for 1 hour
      },
    );

    if (!response.ok) {
      return [];
    }

    const data: unknown = await response.json();
    if (!isContributorsArray(data)) {
      return [];
    }

    return data.slice(0, limit);
  } catch (error) {
    console.error(`Failed to fetch contributors for ${owner}/${repo}:`, error);
    return [];
  }
}

/**
 * Parse GitHub URL to extract owner and repo
 */
export function parseGitHubUrl(
  githubUrl: string,
): { owner: string; repo: string } | null {
  try {
    const url = new URL(githubUrl);
    const parts = url.pathname.split("/").filter(Boolean);

    if (parts.length >= 2 && url.hostname === "github.com") {
      return {
        owner: parts[0],
        repo: parts[1],
      };
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Convert commit activity to graph data
 * @param activity - GitHub commit activity array
 * @returns Formatted data for visualization
 */
export function transformCommitActivityToGraph(
  activity: GitHubCommitActivity[],
): CommitGraphData[] {
  if (!Array.isArray(activity)) {
    return [];
  }

  return activity.map((week) => ({
    date: new Date(week.week * 1000).toISOString().split("T")[0],
    count: week.total,
  }));
}

/**
 * Calculate recent commit count (last 30 days)
 * @param activity - GitHub commit activity array
 * @returns Number of commits in last 30 days
 *
 * Note: GitHub's commit_activity uses weekly buckets (starting Sunday),
 * so we include any week that falls within or touches the 30-day window.
 * This is more inclusive to avoid missing commits near the boundary.
 */
export function calculateRecentCommits(
  activity: GitHubCommitActivity[],
): number {
  if (!Array.isArray(activity)) {
    return 0;
  }

  // Use 31 days to be inclusive of boundary weeks
  // GitHub commit activity is weekly, not daily, so we need to account for week alignment
  const thirtyOneDaysAgo = Date.now() - 31 * 24 * 60 * 60 * 1000;

  return activity
    .filter((week) => week.week * 1000 >= thirtyOneDaysAgo)
    .reduce((sum, week) => sum + week.total, 0);
}

/**
 * Get enhanced repository statistics with rich data
 * @param githubUrl - GitHub repository URL
 * @returns Comprehensive repository stats
 */
export async function getEnhancedRepoStats(
  githubUrl: string,
): Promise<EnhancedRepoStats | null> {
  const parsed = parseGitHubUrl(githubUrl);

  if (!parsed) {
    return null;
  }

  const { owner, repo } = parsed;

  try {
    // Fetch all data in parallel for speed
    const [repoData, commitActivity, languages, contributors] =
      await Promise.all([
        fetch(`https://api.github.com/repos/${owner}/${repo}`, {
          headers: getHeaders(),
          next: { revalidate: 300 },
        }).then((r) => (r.ok ? r.json() : null)),
        fetchCommitActivity(owner, repo),
        fetchLanguageStats(owner, repo),
        fetchContributors(owner, repo, 5),
      ]);

    if (!isRecord(repoData)) {
      return null;
    }

    const commitGraph = transformCommitActivityToGraph(commitActivity);
    const recentCommits = calculateRecentCommits(commitActivity);
    const totalCommits = commitActivity.reduce(
      (sum, week) => sum + week.total,
      0,
    );
    const topics = Array.isArray(repoData.topics)
      ? repoData.topics.filter(
          (topic): topic is string => typeof topic === "string",
        )
      : [];
    const licenseName =
      isRecord(repoData.license) && typeof repoData.license.name === "string"
        ? repoData.license.name
        : null;

    return {
      updatedAt: new Date(String(repoData.updated_at ?? Date.now())),
      createdAt: new Date(String(repoData.created_at ?? Date.now())),
      lastPush: new Date(String(repoData.pushed_at ?? Date.now())),
      stars:
        typeof repoData.stargazers_count === "number"
          ? repoData.stargazers_count
          : 0,
      forks:
        typeof repoData.forks_count === "number" ? repoData.forks_count : 0,
      openIssues:
        typeof repoData.open_issues_count === "number"
          ? repoData.open_issues_count
          : 0,
      size: typeof repoData.size === "number" ? repoData.size : 0,
      primaryLanguage:
        typeof repoData.language === "string" ? repoData.language : null,
      languages,
      topics,
      commitActivity: commitGraph,
      totalCommits,
      recentCommitsCount: recentCommits,
      contributorCount: contributors.length,
      topContributors: contributors,
      license: licenseName,
      isArchived: repoData.archived === true,
      isFork: repoData.fork === true,
      hasIssues: repoData.has_issues === true,
    };
  } catch (error) {
    console.error(`Failed to fetch enhanced stats for ${githubUrl}:`, error);
    return null;
  }
}

/**
 * Get headers for GitHub API requests
 */
function getHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Fetch all repositories for multiple GitHub users
 * @param usernames - Array of GitHub usernames
 * @returns Combined array of all repositories
 */
export async function fetchAllUserRepos(
  usernames: string[],
): Promise<EnhancedGitHubRepo[]> {
  const results = await Promise.all(
    usernames.map((username) => fetchUserRepos(username)),
  );

  return results.flat();
}
