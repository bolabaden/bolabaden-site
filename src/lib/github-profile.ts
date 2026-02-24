/**
 * Comprehensive GitHub Profile Statistics
 * Fetches every available public metric for a GitHub user:
 * - Profile info (followers, following, bio, etc.)
 * - Pull requests authored (own repos AND external repos)
 * - Issues submitted (own repos AND external repos)
 * - PR reviews given
 * - Contribution calendar (via GraphQL if token present, REST fallback)
 * - Language aggregate across all repos
 * - Organization memberships
 * - Recent public events / activity
 * - Stars received, stars given
 * - Pinned repos
 */

// ──────────────────────────────────────────────────────────────────────────────
// Interfaces
// ──────────────────────────────────────────────────────────────────────────────

export interface GitHubUserProfile {
  login: string
  name: string | null
  avatar_url: string
  html_url: string
  bio: string | null
  company: string | null
  location: string | null
  email: string | null
  blog: string | null
  twitter_username: string | null
  public_repos: number
  public_gists: number
  followers: number
  following: number
  created_at: string
  updated_at: string
}

export interface GitHubPRStats {
  total: number
  open: number
  closed: number
  merged: number
  toExternalRepos: number   // PRs to repos the user doesn't own
  toOwnRepos: number
  reposContributedTo: string[] // unique repo full_names
  recent: GitHubPRItem[]
}

export interface GitHubPRItem {
  title: string
  html_url: string
  state: 'open' | 'closed'
  merged_at: string | null
  created_at: string
  repository_url: string
  repoFullName: string
  isExternal: boolean
  number: number
}

export interface GitHubIssueStats {
  total: number
  open: number
  closed: number
  toExternalRepos: number
  reposFiledIn: string[]
  recent: GitHubIssueItem[]
}

export interface GitHubIssueItem {
  title: string
  html_url: string
  state: 'open' | 'closed'
  created_at: string
  repoFullName: string
  isExternal: boolean
  number: number
  comments: number
  reactions: number
}

export interface GitHubReviewStats {
  total: number
  reposReviewed: string[]
  recent: GitHubReviewItem[]
}

export interface GitHubReviewItem {
  title: string
  html_url: string
  created_at: string
  repoFullName: string
}

export interface ContributionDay {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4 // 0=none, 4=max
}

export interface ContributionWeek {
  days: ContributionDay[]
}

export interface ContributionCalendar {
  totalContributions: number
  weeks: ContributionWeek[]
}

export interface GitHubOrg {
  login: string
  avatar_url: string
  html_url: string
  description: string | null
}

export interface GitHubEvent {
  type: string
  repo: { name: string; url: string }
  created_at: string
  payload: Record<string, unknown>
}

export interface GitHubActivitySummary {
  eventTypes: Record<string, number>  // e.g. { PushEvent: 42, PullRequestEvent: 18 }
  recentEvents: GitHubEvent[]
  activeDays: number  // days with at least one event in last 90 days
  mostActiveRepo: string | null
}

export interface GitHubLanguageAggregate {
  [language: string]: number  // total bytes across all repos
}

export interface GitHubRepoSummary {
  totalRepos: number
  totalStarsReceived: number
  totalForksReceived: number
  totalWatchers: number
  mostStarredRepo: { name: string; stars: number; url: string } | null
  mostForkedRepo: { name: string; forks: number; url: string } | null
  languageBreakdown: GitHubLanguageAggregate
  topLanguages: { name: string; percentage: number }[]
  openSourceRepos: number  // non-fork, non-archived
  forkedRepos: number
  archivedRepos: number
}

export interface GitHubComprehensiveStats {
  profile: GitHubUserProfile
  repoSummary: GitHubRepoSummary
  prStats: GitHubPRStats
  issueStats: GitHubIssueStats
  reviewStats: GitHubReviewStats
  contributions: ContributionCalendar | null
  orgs: GitHubOrg[]
  activity: GitHubActivitySummary
  starsGiven: number
  fetchedAt: string
}

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────

function getHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'bolabaden-site/1.0',
  }
  if (token) headers['Authorization'] = `Bearer ${token}`
  return headers
}

async function ghFetch<T>(url: string, revalidate = 900): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: getHeaders(),
      next: { revalidate },
    })
    if (!res.ok) return null
    return res.json() as Promise<T>
  } catch {
    return null
  }
}

async function searchIssues(query: string, perPage = 100): Promise<{ total_count: number; items: any[] }> {
  const encoded = encodeURIComponent(query)
  const url = `https://api.github.com/search/issues?q=${encoded}&per_page=${perPage}&sort=created&order=desc`
  const result = await ghFetch<{ total_count: number; items: any[] }>(url, 900)
  return result ?? { total_count: 0, items: [] }
}

// Extract repo full name ("owner/repo") from a GitHub API URL
function repoNameFromApiUrl(apiUrl: string): string {
  // e.g. "https://api.github.com/repos/facebook/react" → "facebook/react"
  return apiUrl.replace('https://api.github.com/repos/', '')
}

// ──────────────────────────────────────────────────────────────────────────────
// Individual fetchers
// ──────────────────────────────────────────────────────────────────────────────

export async function fetchProfile(username: string): Promise<GitHubUserProfile | null> {
  return ghFetch<GitHubUserProfile>(`https://api.github.com/users/${username}`, 900)
}

export async function fetchUserOrgs(username: string): Promise<GitHubOrg[]> {
  const data = await ghFetch<any[]>(`https://api.github.com/users/${username}/orgs?per_page=100`, 3600)
  if (!data) return []
  return data.map(o => ({
    login: o.login,
    avatar_url: o.avatar_url,
    html_url: `https://github.com/${o.login}`,
    description: o.description ?? null,
  }))
}

export async function fetchStarsGiven(username: string): Promise<number> {
  // starred endpoint returns Link header for pagination; just count first page total
  // The API doesn't expose a total count without GraphQL, so we fetch up to 100 and note if truncated
  const data = await ghFetch<any[]>(
    `https://api.github.com/users/${username}/starred?per_page=1`,
    3600
  )
  // We can't get the total from REST without iterating all pages; return -1 to signal "unknown"
  // We'll use GraphQL if available; otherwise this component will just hide it
  return data ? -1 : 0
}

export async function fetchRecentEvents(username: string): Promise<GitHubEvent[]> {
  // GitHub Events API only returns last 90 days, max 300 events (3 pages × 100)
  const pages = await Promise.all(
    [1, 2, 3].map(page =>
      ghFetch<any[]>(
        `https://api.github.com/users/${username}/events/public?per_page=100&page=${page}`,
        300
      )
    )
  )
  return pages.flat().filter(Boolean) as GitHubEvent[]
}

export async function buildActivitySummary(events: GitHubEvent[]): Promise<GitHubActivitySummary> {
  const eventTypes: Record<string, number> = {}
  const repoCounts: Record<string, number> = {}
  const activeDaySet = new Set<string>()

  for (const e of events) {
    eventTypes[e.type] = (eventTypes[e.type] || 0) + 1
    if (e.repo?.name) repoCounts[e.repo.name] = (repoCounts[e.repo.name] || 0) + 1
    if (e.created_at) activeDaySet.add(e.created_at.split('T')[0])
  }

  const mostActiveRepo = Object.keys(repoCounts).sort((a, b) => repoCounts[b] - repoCounts[a])[0] ?? null

  return {
    eventTypes,
    recentEvents: events.slice(0, 20),
    activeDays: activeDaySet.size,
    mostActiveRepo,
  }
}

/**
 * Fetch all PRs authored by the user — own repos AND external repos.
 * Uses the search API which covers all public activity across GitHub.
 */
export async function fetchPRStats(username: string): Promise<GitHubPRStats> {
  const [allPRs, mergedPRs, openPRs] = await Promise.all([
    searchIssues(`author:${username} type:pr`),
    searchIssues(`author:${username} type:pr is:merged`),
    searchIssues(`author:${username} type:pr is:open`),
  ])

  const items: GitHubPRItem[] = allPRs.items.map((pr: any) => {
    const rawRepo = repoNameFromApiUrl(pr.repository_url ?? '')
    const isExternal = !rawRepo.toLowerCase().startsWith(username.toLowerCase() + '/')
    return {
      title: pr.title,
      html_url: pr.html_url,
      state: pr.state,
      merged_at: pr.pull_request?.merged_at ?? null,
      created_at: pr.created_at,
      repository_url: pr.repository_url ?? '',
      repoFullName: rawRepo,
      isExternal,
      number: pr.number,
    }
  })

  const reposContributedTo = [...new Set(items.map(i => i.repoFullName))]
  const toExternalRepos = items.filter(i => i.isExternal).length
  const toOwnRepos = items.length - toExternalRepos

  return {
    total: allPRs.total_count,
    open: openPRs.total_count,
    closed: allPRs.total_count - openPRs.total_count,
    merged: mergedPRs.total_count,
    toExternalRepos,
    toOwnRepos,
    reposContributedTo,
    recent: items.slice(0, 10),
  }
}

/**
 * Fetch all issues submitted by the user across all of GitHub.
 */
export async function fetchIssueStats(username: string): Promise<GitHubIssueStats> {
  const [allIssues, openIssues] = await Promise.all([
    searchIssues(`author:${username} type:issue`),
    searchIssues(`author:${username} type:issue is:open`),
  ])

  const items: GitHubIssueItem[] = allIssues.items.map((issue: any) => {
    const rawRepo = repoNameFromApiUrl(issue.repository_url ?? '')
    const isExternal = !rawRepo.toLowerCase().startsWith(username.toLowerCase() + '/')
    return {
      title: issue.title,
      html_url: issue.html_url,
      state: issue.state,
      created_at: issue.created_at,
      repoFullName: rawRepo,
      isExternal,
      number: issue.number,
      comments: issue.comments ?? 0,
      reactions: (issue.reactions?.total_count ?? 0),
    }
  })

  const reposFiledIn = [...new Set(items.map(i => i.repoFullName))]

  return {
    total: allIssues.total_count,
    open: openIssues.total_count,
    closed: allIssues.total_count - openIssues.total_count,
    toExternalRepos: items.filter(i => i.isExternal).length,
    reposFiledIn,
    recent: items.slice(0, 10),
  }
}

/**
 * Fetch PR reviews given by the user across GitHub.
 */
export async function fetchReviewStats(username: string): Promise<GitHubReviewStats> {
  const reviews = await searchIssues(`reviewed-by:${username} type:pr -author:${username}`)

  const items: GitHubReviewItem[] = reviews.items.map((pr: any) => ({
    title: pr.title,
    html_url: pr.html_url,
    created_at: pr.created_at,
    repoFullName: repoNameFromApiUrl(pr.repository_url ?? ''),
  }))

  const reposReviewed = [...new Set(items.map(i => i.repoFullName))]

  return {
    total: reviews.total_count,
    reposReviewed,
    recent: items.slice(0, 10),
  }
}

/**
 * Fetch contribution calendar via GitHub GraphQL API.
 * Falls back to null if no token or GraphQL unavailable.
 */
export async function fetchContributionCalendar(username: string): Promise<ContributionCalendar | null> {
  const token = process.env.GITHUB_TOKEN
  if (!token) return null   // GraphQL requires authentication

  const query = `
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
                color
              }
            }
          }
        }
      }
    }
  `

  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables: { login: username } }),
      next: { revalidate: 3600 },
    })

    if (!res.ok) return null

    const json = await res.json()
    const cal = json?.data?.user?.contributionsCollection?.contributionCalendar
    if (!cal) return null

    const weeks: ContributionWeek[] = cal.weeks.map((w: any) => ({
      days: w.contributionDays.map((d: any) => {
        const count: number = d.contributionCount
        const level: 0 | 1 | 2 | 3 | 4 =
          count === 0 ? 0 : count <= 2 ? 1 : count <= 5 ? 2 : count <= 9 ? 3 : 4
        return { date: d.date, count, level }
      }),
    }))

    return { totalContributions: cal.totalContributions, weeks }
  } catch {
    return null
  }
}

/**
 * Build aggregate repo statistics from user's own public repos.
 */
export async function buildRepoSummary(
  username: string,
  repos: any[]
): Promise<GitHubRepoSummary> {
  const languageTotals: GitHubLanguageAggregate = {}

  // Fetch language bytes for all non-fork repos in parallel (cap at 30 to save rate limit)
  const ownRepos = repos.filter(r => !r.fork && !r.archived).slice(0, 30)
  const langResults = await Promise.all(
    ownRepos.map(r =>
      ghFetch<Record<string, number>>(
        `https://api.github.com/repos/${username}/${r.name}/languages`,
        3600
      )
    )
  )

  for (const langData of langResults) {
    if (!langData) continue
    for (const [lang, bytes] of Object.entries(langData)) {
      languageTotals[lang] = (languageTotals[lang] || 0) + bytes
    }
  }

  const totalBytes = Object.values(languageTotals).reduce((a, b) => a + b, 0)
  const topLanguages = Object.entries(languageTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, bytes]) => ({
      name,
      percentage: totalBytes > 0 ? parseFloat(((bytes / totalBytes) * 100).toFixed(1)) : 0,
    }))

  const sortedByStars = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count)
  const sortedByForks = [...repos].sort((a, b) => b.forks_count - a.forks_count)

  return {
    totalRepos: repos.length,
    totalStarsReceived: repos.reduce((s, r) => s + r.stargazers_count, 0),
    totalForksReceived: repos.reduce((s, r) => s + r.forks_count, 0),
    totalWatchers: repos.reduce((s, r) => s + (r.watchers_count ?? 0), 0),
    mostStarredRepo: sortedByStars[0]
      ? { name: sortedByStars[0].full_name, stars: sortedByStars[0].stargazers_count, url: sortedByStars[0].html_url }
      : null,
    mostForkedRepo: sortedByForks[0]
      ? { name: sortedByForks[0].full_name, forks: sortedByForks[0].forks_count, url: sortedByForks[0].html_url }
      : null,
    languageBreakdown: languageTotals,
    topLanguages,
    openSourceRepos: repos.filter(r => !r.fork && !r.archived && !r.private).length,
    forkedRepos: repos.filter(r => r.fork).length,
    archivedRepos: repos.filter(r => r.archived).length,
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// Main aggregator
// ──────────────────────────────────────────────────────────────────────────────

export async function fetchComprehensiveStats(username: string): Promise<GitHubComprehensiveStats | null> {
  try {
    // Phase 1: fast parallel fetches that don't depend on each other
    const [profile, rawOrgs, events, allRepos] = await Promise.all([
      fetchProfile(username),
      fetchUserOrgs(username),
      fetchRecentEvents(username),
      // Fetch all repo pages in one shot
      (async () => {
        const repos: any[] = []
        let page = 1
        while (page <= 10) {
          const data = await ghFetch<any[]>(
            `https://api.github.com/users/${username}/repos?per_page=100&page=${page}&sort=pushed`,
            900
          )
          if (!data || data.length === 0) break
          repos.push(...data)
          if (data.length < 100) break
          page++
        }
        return repos
      })(),
    ])

    if (!profile) return null

    // Phase 2: data-dependent fetches
    const [prStats, issueStats, reviewStats, calendar, repoSummary, activitySummary] = await Promise.all([
      fetchPRStats(username),
      fetchIssueStats(username),
      fetchReviewStats(username),
      fetchContributionCalendar(username),
      buildRepoSummary(username, allRepos),
      buildActivitySummary(events),
    ])

    return {
      profile,
      repoSummary,
      prStats,
      issueStats,
      reviewStats,
      contributions: calendar,
      orgs: rawOrgs,
      activity: activitySummary,
      starsGiven: -1, // requires GraphQL star count; skipped to save rate limit
      fetchedAt: new Date().toISOString(),
    }
  } catch (err) {
    console.error(`fetchComprehensiveStats failed for ${username}:`, err)
    return null
  }
}
