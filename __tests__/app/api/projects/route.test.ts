/**
 * Unit tests for Projects API endpoint
 */

import { GET } from '@/app/api/projects/route'
import * as githubModule from '@/lib/github'

// Mock the GitHub module
jest.mock('@/lib/github')

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: (data: any, init?: any) => ({
      json: async () => data,
      status: init?.status || 200,
      ok: (init?.status || 200) >= 200 && (init?.status || 200) < 300,
    }),
  },
}))

// Helper to create mock NextRequest
function createMockRequest(url: string): Request {
  return new Request(url, {
    method: 'GET',
  })
}

// Mock data module
jest.mock('@/lib/data', () => ({
  projects: [
    {
      id: 'test-project-1',
      title: 'Test Project 1',
      description: 'Test description 1',
      technologies: ['TypeScript', 'React'],
      category: 'frontend',
      status: 'active',
      githubUrl: 'https://github.com/owner/repo1',
      featured: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-06-01'),
    },
    {
      id: 'test-project-2',
      title: 'Test Project 2',
      description: 'Test description 2',
      technologies: ['Python', 'FastAPI'],
      category: 'backend',
      status: 'active',
      githubUrl: 'https://github.com/owner/repo2',
      featured: false,
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-07-01'),
    },
    {
      id: 'test-project-3',
      title: 'Test Project 3',
      description: 'Test description 3',
      technologies: ['Docker', 'Kubernetes'],
      category: 'infrastructure',
      status: 'active',
      featured: true,
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-08-01'),
    },
  ],
}))

describe('Projects API Endpoint', () => {
  const mockFetchMultipleRepos = githubModule.fetchMultipleRepos as jest.MockedFunction<
    typeof githubModule.fetchMultipleRepos
  >

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/projects', () => {
    it('should return all projects with enriched GitHub data', async () => {
      // Mock GitHub API responses
      mockFetchMultipleRepos.mockResolvedValueOnce([
        {
          updatedAt: new Date('2024-12-01'),
          createdAt: new Date('2024-01-01'),
          stars: 10,
          forks: 2,
          openIssues: 1,
          language: 'TypeScript',
          topics: ['react', 'nextjs'],
        },
        {
          updatedAt: new Date('2024-12-02'),
          createdAt: new Date('2024-02-01'),
          stars: 20,
          forks: 5,
          openIssues: 3,
          language: 'Python',
          topics: ['fastapi', 'api'],
        },
      ])

      const request = createMockRequest('http://localhost:3000/api/projects')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.projects).toHaveLength(3)
      expect(data.lastUpdated).toBeDefined()
      
      // Check that GitHub data was applied (dates come back as Date objects, not strings)
      expect(data.projects[0].updatedAt).toEqual(new Date('2024-12-01'))
      expect(data.projects[1].updatedAt).toEqual(new Date('2024-12-02'))
    })

    it('should filter featured projects when featured=true', async () => {
      mockFetchMultipleRepos.mockResolvedValueOnce([
        {
          updatedAt: new Date('2024-12-01'),
          createdAt: new Date('2024-01-01'),
          stars: 10,
          forks: 2,
          openIssues: 1,
          language: 'TypeScript',
          topics: [],
        },
        null, // Project 2 GitHub fetch failed
      ])

      const request = createMockRequest('http://localhost:3000/api/projects?featured=true')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.projects).toHaveLength(2) // Only featured projects
      expect(data.projects.every((p: any) => p.featured)).toBe(true)
    })

    it('should filter projects by category', async () => {
      mockFetchMultipleRepos.mockResolvedValueOnce([
        {
          updatedAt: new Date('2024-12-01'),
          createdAt: new Date('2024-01-01'),
          stars: 10,
          forks: 2,
          openIssues: 1,
          language: 'TypeScript',
          topics: [],
        },
        {
          updatedAt: new Date('2024-12-02'),
          createdAt: new Date('2024-02-01'),
          stars: 20,
          forks: 5,
          openIssues: 3,
          language: 'Python',
          topics: [],
        },
      ])

      const request = createMockRequest('http://localhost:3000/api/projects?category=frontend')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.projects).toHaveLength(1)
      expect(data.projects[0].category).toBe('frontend')
    })

    it('should handle GitHub API failures gracefully with fallback dates', async () => {
      mockFetchMultipleRepos.mockResolvedValueOnce([
        null, // GitHub fetch failed
        null, // GitHub fetch failed
      ])

      const request = createMockRequest('http://localhost:3000/api/projects')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.projects).toHaveLength(3)
      // Should use current date as fallback
      expect(data.projects[0].updatedAt).toBeDefined()
    })

    it('should handle complete API failure and return static data', async () => {
      // Mock fetchMultipleRepos to throw an error
      mockFetchMultipleRepos.mockRejectedValueOnce(new Error('API Error'))

      const request = createMockRequest('http://localhost:3000/api/projects')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.projects).toHaveLength(3) // Static fallback data
      expect(data.error).toBeDefined()
      expect(data.error).toContain('Failed to fetch realtime data')
    })

    it('should handle projects without GitHub URLs', async () => {
      mockFetchMultipleRepos.mockResolvedValueOnce([
        {
          updatedAt: new Date('2024-12-01'),
          createdAt: new Date('2024-01-01'),
          stars: 10,
          forks: 2,
          openIssues: 1,
          language: 'TypeScript',
          topics: [],
        },
        {
          updatedAt: new Date('2024-12-02'),
          createdAt: new Date('2024-02-01'),
          stars: 20,
          forks: 5,
          openIssues: 3,
          language: 'Python',
          topics: [],
        },
      ])

      const request = createMockRequest('http://localhost:3000/api/projects')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      // Project 3 has no GitHub URL, should still be included
      expect(data.projects).toHaveLength(3)
    })

    it('should apply both featured and category filters together', async () => {
      mockFetchMultipleRepos.mockResolvedValueOnce([
        {
          updatedAt: new Date('2024-12-01'),
          createdAt: new Date('2024-01-01'),
          stars: 10,
          forks: 2,
          openIssues: 1,
          language: 'TypeScript',
          topics: [],
        },
        {
          updatedAt: new Date('2024-12-02'),
          createdAt: new Date('2024-02-01'),
          stars: 20,
          forks: 5,
          openIssues: 3,
          language: 'Python',
          topics: [],
        },
      ])

      const request = createMockRequest(
        'http://localhost:3000/api/projects?featured=true&category=frontend'
      )
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.projects).toHaveLength(1)
      expect(data.projects[0].featured).toBe(true)
      expect(data.projects[0].category).toBe('frontend')
    })
  })
})

