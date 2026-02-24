/**
 * GitHub API service for fetching repository data
 */

// Re-export parseGitHubUrl from the enhanced module to avoid duplication
import { parseGitHubUrl } from './github-enhanced'
export { parseGitHubUrl }

export interface GitHubRepo {
  name: string
  full_name: string
  description: string
  created_at: string
  updated_at: string
  pushed_at: string
  stargazers_count: number
  watchers_count: number
  forks_count: number
  open_issues_count: number
  language: string
  topics: string[]
  html_url: string
  homepage: string | null
  archived: boolean
}

export interface GitHubRepoStats {
  updatedAt: Date
  createdAt: Date
  stars: number
  forks: number
  openIssues: number
  language: string
  topics: string[]
}

/**
 * Fetch repository data from GitHub API
 * @param owner - Repository owner (username or organization)
 * @param repo - Repository name
 * @returns Repository data or null if not found
 */
export async function fetchGitHubRepo(
  owner: string,
  repo: string
): Promise<GitHubRepo | null> {
  try {
    const token = process.env.GITHUB_TOKEN
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      {
        headers,
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    )

    if (!response.ok) {
      console.error(`GitHub API error for ${owner}/${repo}: ${response.status}`)
      return null
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(`Failed to fetch GitHub repo ${owner}/${repo}:`, error)
    return null
  }
}

/**
 * Get repository statistics from GitHub
 * @param githubUrl - GitHub repository URL
 * @returns Repository stats or null if not found
 */
export async function getRepoStats(githubUrl: string): Promise<GitHubRepoStats | null> {
  const parsed = parseGitHubUrl(githubUrl)
  
  if (!parsed) {
    return null
  }

  const repo = await fetchGitHubRepo(parsed.owner, parsed.repo)
  
  if (!repo) {
    return null
  }

  return {
    updatedAt: new Date(repo.pushed_at || repo.updated_at),
    createdAt: new Date(repo.created_at),
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    openIssues: repo.open_issues_count,
    language: repo.language,
    topics: repo.topics || [],
  }
}

/**
 * Fetch multiple repositories in parallel
 * @param githubUrls - Array of GitHub repository URLs
 * @returns Array of repository stats (null for failed fetches)
 */
export async function fetchMultipleRepos(
  githubUrls: string[]
): Promise<(GitHubRepoStats | null)[]> {
  return Promise.all(githubUrls.map(url => getRepoStats(url)))
}

