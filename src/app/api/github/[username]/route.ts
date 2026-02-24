'use server'

import { NextResponse } from 'next/server'
import { fetchUserRepos, fetchAllUserRepos } from '@/lib/github-enhanced'

/**
 * GET /api/github/[username]
 * Fetches all public repositories for a GitHub user
 * 
 * Query params:
 * - include: comma-separated list of additional usernames to fetch
 */
export async function GET(
  request: Request,
  context: { params: Promise<{ username: string }> }
) {
  const params = await context.params
  try {
    const { searchParams } = new URL(request.url)
    const includeUsers = searchParams.get('include')?.split(',').filter(Boolean) || []
    
    // Combine main username with additional usernames
    const allUsernames = [params.username, ...includeUsers]
    
    // Fetch all repos in parallel
    const repos = await fetchAllUserRepos(allUsernames)
    
    // Filter out archived repos by default (can be overridden)
    const includeArchived = searchParams.get('archived') === 'true'
    const filteredRepos = includeArchived 
      ? repos 
      : repos.filter(r => !r.archived)
    
    // Sort by last push (most recent first)
    const sortedRepos = filteredRepos.sort((a, b) => {
      return new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime()
    })
    
    return NextResponse.json({
      repos: sortedRepos,
      count: sortedRepos.length,
      users: allUsernames,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error(`Failed to fetch repos for user ${params.username}:`, error)
    
    return NextResponse.json({
      error: 'Failed to fetch repositories',
      repos: [],
      count: 0,
    }, { status: 500 })
  }
}

