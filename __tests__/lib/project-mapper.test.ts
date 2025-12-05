import { enrichProject, shouldIncludeProject, PROJECT_METADATA } from '@/lib/project-mapper'
import { Project } from '@/lib/types'
import { EnhancedGitHubRepo } from '@/lib/github-enhanced'

describe('enrichProject', () => {
  const baseProject: Project = {
    id: 'test-project',
    title: 'Test Project',
    description: 'A test project',
    technologies: ['TypeScript'],
    category: 'frontend',
    status: 'active',
    githubUrl: 'https://github.com/user/test-project',
    featured: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-01'),
  }

  it('should return project unchanged if no metadata exists', () => {
    const result = enrichProject(baseProject)
    expect(result).toEqual(baseProject)
  })

  it('should enrich project with custom title', () => {
    const project = { ...baseProject, id: 'bolabaden-infra' }
    const result = enrichProject(project)
    
    expect(result.title).toBe('Bolabaden Infrastructure')
  })

  it('should enrich project with longDescription', () => {
    const project = { ...baseProject, id: 'cloudcradle' }
    const result = enrichProject(project)
    
    expect(result.longDescription).toContain('**Problem:**')
    expect(result.longDescription).toContain('93% reduction')
  })

  it('should mark featured projects as featured', () => {
    const project = { ...baseProject, id: 'bolabaden-site' }
    const result = enrichProject(project)
    
    expect(result.featured).toBe(true)
  })

  it('should add liveUrl when specified', () => {
    const project = { ...baseProject, id: 'bolabaden-site' }
    const result = enrichProject(project)
    
    expect(result.liveUrl).toBe('https://bolabaden.org')
  })

  it('should preserve existing data when enriching', () => {
    const project = { ...baseProject, id: 'bolabaden-infra' }
    const result = enrichProject(project)
    
    expect(result.id).toBe(project.id)
    expect(result.githubUrl).toBe(project.githubUrl)
    expect(result.status).toBe(project.status)
  })
})

describe('shouldIncludeProject', () => {
  const createMockRepo = (overrides: Partial<EnhancedGitHubRepo> = {}): EnhancedGitHubRepo => ({
    name: 'test-repo',
    full_name: 'user/test-repo',
    description: 'Test repository',
    html_url: 'https://github.com/user/test-repo',
    homepage: null,
    created_at: '2024-01-01',
    updated_at: '2024-12-01',
    pushed_at: '2024-12-01',
    stargazers_count: 0,
    watchers_count: 0,
    forks_count: 0,
    open_issues_count: 0,
    size: 1000,
    language: 'TypeScript',
    topics: [],
    license: null,
    archived: false,
    disabled: false,
    private: false,
    fork: false,
    has_issues: true,
    has_projects: true,
    has_downloads: true,
    has_wiki: true,
    has_pages: false,
    ...overrides,
  })

  it('should include normal repositories', () => {
    const repo = createMockRepo()
    expect(shouldIncludeProject(repo)).toBe(true)
  })

  it('should exclude disabled repositories', () => {
    const repo = createMockRepo({ disabled: true })
    expect(shouldIncludeProject(repo)).toBe(false)
  })

  it('should exclude archived repos by default', () => {
    const repo = createMockRepo({ archived: true })
    expect(shouldIncludeProject(repo)).toBe(false)
  })

  it('should include archived repos when specified', () => {
    const repo = createMockRepo({ archived: true })
    expect(shouldIncludeProject(repo, { includeArchived: true })).toBe(true)
  })

  it('should exclude forks by default', () => {
    const repo = createMockRepo({ fork: true })
    expect(shouldIncludeProject(repo)).toBe(false)
  })

  it('should include forks when specified', () => {
    const repo = createMockRepo({ fork: true })
    expect(shouldIncludeProject(repo, { includeForks: true })).toBe(true)
  })

  it('should exclude repos below minimum stars', () => {
    const repo = createMockRepo({ stargazers_count: 2 })
    expect(shouldIncludeProject(repo, { minStars: 5 })).toBe(false)
  })

  it('should include repos above minimum stars', () => {
    const repo = createMockRepo({ stargazers_count: 10 })
    expect(shouldIncludeProject(repo, { minStars: 5 })).toBe(true)
  })

  it('should exclude repos with no description and no stars', () => {
    const repo = createMockRepo({ description: '', stargazers_count: 0 })
    expect(shouldIncludeProject(repo)).toBe(false)
  })

  it('should include repos with no description if they have stars', () => {
    const repo = createMockRepo({ description: '', stargazers_count: 5 })
    expect(shouldIncludeProject(repo)).toBe(true)
  })

  it('should include repos with description even if no stars', () => {
    const repo = createMockRepo({ description: 'Good description', stargazers_count: 0 })
    expect(shouldIncludeProject(repo)).toBe(true)
  })

  it('should handle null description', () => {
    const repo = createMockRepo({ description: null as any, stargazers_count: 0 })
    expect(shouldIncludeProject(repo)).toBe(false)
  })

  it('should respect all filters combined', () => {
    const repo = createMockRepo({
      archived: true,
      fork: true,
      stargazers_count: 3,
    })
    
    expect(shouldIncludeProject(repo)).toBe(false)
    expect(shouldIncludeProject(repo, {
      includeArchived: true,
      includeForks: true,
      minStars: 2,
    })).toBe(true)
  })
})

describe('PROJECT_METADATA', () => {
  it('should have metadata for key projects', () => {
    expect(PROJECT_METADATA['bolabaden-infra']).toBeDefined()
    expect(PROJECT_METADATA['bolabaden-site']).toBeDefined()
    expect(PROJECT_METADATA['cloudcradle']).toBeDefined()
  })

  it('should have longDescription for featured projects', () => {
    Object.entries(PROJECT_METADATA).forEach(([key, meta]) => {
      if (meta.featured) {
        expect(meta.longDescription).toBeDefined()
        expect(meta.longDescription).toContain('**Problem:**')
      }
    })
  })

  it('should have valid metadata structure', () => {
    Object.entries(PROJECT_METADATA).forEach(([key, meta]) => {
      if (meta.customTitle) {
        expect(typeof meta.customTitle).toBe('string')
        expect(meta.customTitle.length).toBeGreaterThan(0)
      }
      
      if (meta.customTechnologies) {
        expect(Array.isArray(meta.customTechnologies)).toBe(true)
      }
      
      if (meta.featured !== undefined) {
        expect(typeof meta.featured).toBe('boolean')
      }
    })
  })
})

