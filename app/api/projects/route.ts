'use server'

import { NextResponse } from 'next/server'
import { projects as staticProjects } from '@/lib/data'
import { getRepoStats, fetchMultipleRepos } from '@/lib/github'
import { Project } from '@/lib/types'

/**
 * Enrich projects with realtime GitHub data
 */
async function enrichProjectsWithGitHubData(): Promise<Project[]> {
  // Fetch all GitHub repos in parallel
  const githubUrls = staticProjects
    .filter(p => p.githubUrl)
    .map(p => p.githubUrl!)
  
  const repoStats = await fetchMultipleRepos(githubUrls)
  
  // Create a map of githubUrl to stats for quick lookup
  const statsMap = new Map<string, typeof repoStats[0]>()
  githubUrls.forEach((url, index) => {
    statsMap.set(url, repoStats[index])
  })
  
  // Enrich projects with realtime data
  return staticProjects.map(project => {
    if (!project.githubUrl) {
      return project
    }
    
    const stats = statsMap.get(project.githubUrl)
    
    if (!stats) {
      // If GitHub fetch failed, return project as-is with current date as fallback
      return {
        ...project,
        updatedAt: new Date(), // Fallback to current date
      }
    }
    
    // Update with realtime data from GitHub
    return {
      ...project,
      updatedAt: stats.updatedAt,
      createdAt: stats.createdAt,
    }
  })
}

/**
 * GET /api/projects
 * Returns all projects with realtime GitHub data
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    const category = searchParams.get('category')
    
    // Fetch enriched projects
    let projects = await enrichProjectsWithGitHubData()
    
    // Apply filters
    if (featured === 'true') {
      projects = projects.filter(p => p.featured)
    }
    
    if (category && category !== 'all') {
      projects = projects.filter(p => p.category === category)
    }
    
    return NextResponse.json({
      projects,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Failed to fetch projects:', error)
    
    // Return static data as fallback
    return NextResponse.json({
      projects: staticProjects,
      lastUpdated: new Date().toISOString(),
      error: 'Failed to fetch realtime data, using cached data',
    }, { status: 500 })
  }
}

