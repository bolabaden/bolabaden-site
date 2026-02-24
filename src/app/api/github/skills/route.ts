import { NextResponse } from 'next/server'
import { fetchAllUserRepos, EnhancedGitHubRepo } from '@/lib/github-enhanced'
import { config } from '@/lib/config'
import { TechStack } from '@/lib/types'

/**
 * Map GitHub language to a skill category
 */
function inferCategory(language: string): TechStack['category'] {
  const map: Record<string, TechStack['category']> = {
    // Frontend
    TypeScript: 'frontend',
    JavaScript: 'frontend',
    HTML: 'frontend',
    CSS: 'frontend',
    SCSS: 'frontend',
    Vue: 'frontend',
    Svelte: 'frontend',

    // Backend
    Python: 'backend',
    Go: 'backend',
    Rust: 'backend',
    Java: 'backend',
    'C#': 'backend',
    Ruby: 'backend',
    PHP: 'backend',
    Kotlin: 'backend',
    Swift: 'backend',
    C: 'backend',
    'C++': 'backend',

    // Infrastructure / DevOps
    HCL: 'infrastructure',
    Shell: 'devops',
    Dockerfile: 'devops',
    Makefile: 'devops',
    Nix: 'devops',
    PowerShell: 'devops',
    Batchfile: 'devops',

    // Database
    PLpgSQL: 'database',
    PLSQL: 'database',

    // AI/ML
    Jupyter: 'ai-ml',
  }

  return map[language] ?? 'backend'
}

/**
 * Estimate proficiency level from bytes of code across all repos
 */
function inferLevel(totalBytes: number, repoCount: number): TechStack['level'] {
  if (totalBytes > 500_000 || repoCount >= 5) return 'expert'
  if (totalBytes > 100_000 || repoCount >= 3) return 'advanced'
  if (totalBytes > 20_000 || repoCount >= 2) return 'intermediate'
  return 'beginner'
}

/**
 * Estimate years of experience for a language from the oldest repo that uses it 
 */
function yearsFromOldestRepo(repos: EnhancedGitHubRepo[], language: string): number {
  const now = new Date()
  let oldest = now

  for (const repo of repos) {
    if (repo.language === language) {
      const created = new Date(repo.created_at)
      if (created < oldest) oldest = created
    }
  }

  const years = (now.getTime() - oldest.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
  return Math.max(1, Math.round(years * 10) / 10)
}

/**
 * GET /api/github/skills
 * 
 * Dynamically aggregate language data across all repos for the configured
 * GitHub usernames and return TechStack-compatible skill entries.
 *
 * Query params:
 *  - users:  comma-separated usernames (default: config.GITHUB_USERNAMES)
 *  - limit:  max skills returned        (default: 20)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const usersParam = searchParams.get('users')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 50)

    const usernames = usersParam
      ? usersParam.split(',').map(u => u.trim()).filter(Boolean)
      : config.GITHUB_USERNAMES

    const repos = await fetchAllUserRepos(usernames)

    // Aggregate bytes per language and count repos that use it
    const languageBytes: Record<string, number> = {}
    const languageRepoCount: Record<string, number> = {}

    for (const repo of repos) {
      if (repo.archived || repo.fork) continue
      if (repo.language) {
        languageBytes[repo.language] = (languageBytes[repo.language] || 0) + repo.size * 1024
        languageRepoCount[repo.language] = (languageRepoCount[repo.language] || 0) + 1
      }
    }

    // Build TechStack array sorted by total bytes desc
    const skills: TechStack[] = Object.entries(languageBytes)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([language, bytes]) => ({
        name: language,
        category: inferCategory(language),
        level: inferLevel(bytes, languageRepoCount[language] || 0),
        yearsOfExperience: yearsFromOldestRepo(repos, language),
        description: `Used across ${languageRepoCount[language]} ${languageRepoCount[language] === 1 ? 'repository' : 'repositories'}`,
      }))

    return NextResponse.json({
      skills,
      count: skills.length,
      users: usernames,
      totalRepos: repos.filter(r => !r.archived && !r.fork).length,
      lastUpdated: new Date().toISOString(),
    }, {
      headers: {
        'Cache-Control': `public, s-maxage=${config.CACHE_DURATION.SKILLS}, stale-while-revalidate=${config.CACHE_DURATION.SKILLS * 2}`,
      },
    })
  } catch (error) {
    console.error('Failed to aggregate GitHub skills:', error)
    return NextResponse.json(
      { error: 'Failed to fetch skills', skills: [], count: 0 },
      { status: 500 },
    )
  }
}
