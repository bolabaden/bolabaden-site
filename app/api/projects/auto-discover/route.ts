'use server'

import { NextResponse } from 'next/server'
import { fetchAllUserRepos, EnhancedGitHubRepo } from '@/lib/github-enhanced'
import { Project } from '@/lib/types'

/**
 * Automatically map GitHub repository to project category
 * Based on topics, language, and description
 */
function inferCategory(repo: EnhancedGitHubRepo): Project['category'] {
  const topics = repo.topics.map(t => t.toLowerCase())
  const desc = (repo.description || '').toLowerCase()
  const lang = (repo.language || '').toLowerCase()
  
  // AI/ML detection
  if (
    topics.some(t => ['ai', 'ml', 'llm', 'machine-learning', 'gpt', 'openai'].includes(t)) ||
    desc.includes('ai') || desc.includes('llm') || desc.includes('gpt')
  ) {
    return 'ai-ml'
  }
  
  // Infrastructure detection
  if (
    topics.some(t => ['infrastructure', 'devops', 'kubernetes', 'docker', 'terraform', 'iac'].includes(t)) ||
    desc.includes('infrastructure') || desc.includes('kubernetes') || desc.includes('terraform')
  ) {
    return 'infrastructure'
  }
  
  // Frontend detection
  if (
    lang.includes('typescript') || lang.includes('javascript') ||
    topics.some(t => ['react', 'nextjs', 'vue', 'frontend', 'ui'].includes(t)) ||
    desc.includes('website') || desc.includes('frontend')
  ) {
    return 'frontend'
  }
  
  // Backend detection
  if (
    lang.includes('python') || lang.includes('go') || lang.includes('rust') ||
    topics.some(t => ['backend', 'api', 'server'].includes(t)) ||
    desc.includes('api') || desc.includes('backend')
  ) {
    return 'backend'
  }
  
  // Database detection
  if (
    topics.some(t => ['database', 'sql', 'nosql', 'mongodb', 'postgres'].includes(t)) ||
    desc.includes('database')
  ) {
    return 'database'
  }
  
  // Security detection
  if (
    topics.some(t => ['security', 'auth', 'encryption'].includes(t)) ||
    desc.includes('security') || desc.includes('auth')
  ) {
    return 'security'
  }
  
  // Default to devops
  return 'devops'
}

/**
 * Convert GitHub repo to Project interface
 */
function repoToProject(repo: EnhancedGitHubRepo): Project {
  // Determine if this should be featured based on activity and stars
  const isFeatured = 
    repo.stargazers_count >= 1 || // Has stars
    !repo.fork || // Not a fork
    repo.topics.length > 0 // Has topics (shows curation)
  
  // Extract tech stack from topics and language
  const technologies = [
    repo.language,
    ...repo.topics.slice(0, 5), // Limit to 5 topics
  ].filter(Boolean) as string[]
  
  return {
    id: repo.name.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
    title: repo.name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
    description: repo.description || 'No description available',
    technologies,
    category: inferCategory(repo),
    status: repo.archived ? 'archived' : 'active',
    githubUrl: repo.html_url,
    liveUrl: repo.homepage || undefined,
    featured: isFeatured,
    createdAt: new Date(repo.created_at),
    updatedAt: new Date(repo.pushed_at || repo.updated_at),
  }
}

/**
 * GET /api/projects/auto-discover
 * Automatically discover and create project cards from GitHub repositories
 * 
 * Query params:
 * - users: comma-separated GitHub usernames (default: bolabaden,th3w1zard1)
 * - includeArchived: include archived repos (default: false)
 * - minStars: minimum stars to include (default: 0)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const usersParam = searchParams.get('users') || 'bolabaden,th3w1zard1'
    const includeArchived = searchParams.get('includeArchived') === 'true'
    const minStars = parseInt(searchParams.get('minStars') || '0', 10)
    
    const usernames = usersParam.split(',').map(u => u.trim()).filter(Boolean)
    
    // Fetch all repos from all specified users
    const allRepos = await fetchAllUserRepos(usernames)
    
    // Apply filters
    let filteredRepos = allRepos
    
    if (!includeArchived) {
      filteredRepos = filteredRepos.filter(r => !r.archived)
    }
    
    if (minStars > 0) {
      filteredRepos = filteredRepos.filter(r => r.stargazers_count >= minStars)
    }
    
    // Convert repos to Project format
    const projects = filteredRepos.map(repoToProject)
    
    // Sort by last push (most recent first)
    const sortedProjects = projects.sort((a, b) => {
      return b.updatedAt.getTime() - a.updatedAt.getTime()
    })
    
    return NextResponse.json({
      projects: sortedProjects,
      count: sortedProjects.length,
      users: usernames,
      filters: {
        includeArchived,
        minStars,
      },
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Failed to auto-discover projects:', error)
    
    return NextResponse.json({
      error: 'Failed to discover projects',
      projects: [],
      count: 0,
    }, { status: 500 })
  }
}

