'use server'

import { NextResponse } from 'next/server'
import { projects as staticProjects } from '@/lib/data'
import { getEnhancedRepoStats, parseGitHubUrl } from '@/lib/github-enhanced'
import { Project } from '@/lib/types'

/**
 * GET /api/projects/enhanced
 * Returns projects with comprehensive GitHub data including commit graphs
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    const category = searchParams.get('category')
    
    // Fetch enhanced stats for all projects with GitHub URLs in parallel
    const enhancedProjectsPromises = staticProjects.map(async (project) => {
      if (!project.githubUrl) {
        return { project, stats: null }
      }

      const stats = await getEnhancedRepoStats(project.githubUrl)
      
      // Update project dates with GitHub data if available
      const updatedProject: Project = stats
        ? {
            ...project,
            updatedAt: stats.lastPush,
            createdAt: stats.createdAt,
          }
        : project

      return {
        project: updatedProject,
        stats,
      }
    })

    const enhancedProjects = await Promise.all(enhancedProjectsPromises)
    
    // Apply filters
    let filteredProjects = enhancedProjects
    
    if (featured === 'true') {
      filteredProjects = filteredProjects.filter(ep => ep.project.featured)
    }
    
    if (category && category !== 'all') {
      filteredProjects = filteredProjects.filter(ep => ep.project.category === category)
    }
    
    return NextResponse.json({
      projects: filteredProjects.map(ep => ep.project),
      githubStats: Object.fromEntries(
        filteredProjects
          .filter(ep => ep.stats)
          .map(ep => [ep.project.id, ep.stats])
      ),
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Failed to fetch enhanced projects:', error)
    
    // Return static data as fallback
    return NextResponse.json({
      projects: staticProjects,
      githubStats: {},
      lastUpdated: new Date().toISOString(),
      error: 'Failed to fetch realtime GitHub data, using cached data',
    }, { status: 500 })
  }
}

