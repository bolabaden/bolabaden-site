'use server'

import { NextResponse } from 'next/server'
import { fetchComprehensiveStats } from '@/lib/github-profile'

/**
 * GET /api/github/[username]/stats
 * Returns all public GitHub metrics for a user:
 * - Profile info
 * - PRs authored (own + external repos)
 * - Issues submitted (own + external repos)
 * - PR reviews given
 * - Contribution calendar
 * - Language aggregate across all repos
 * - Organization memberships
 * - Event-based activity summary
 * - Repo summary (total stars, forks, etc.)
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ username: string }> }
) {
  const { username } = await context.params

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 })
  }

  const stats = await fetchComprehensiveStats(username)

  if (!stats) {
    return NextResponse.json(
      { error: 'Failed to fetch GitHub stats', username },
      { status: 502 }
    )
  }

  return NextResponse.json(stats, {
    headers: {
      // Allow caching for 15 minutes; stale for up to 1 hour
      'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=3600',
    },
  })
}
