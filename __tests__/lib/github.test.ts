/**
 * Unit tests for GitHub API service
 */

import {
  fetchGitHubRepo,
  parseGitHubUrl,
  getRepoStats,
  fetchMultipleRepos,
} from '@/lib/github'

// Mock fetch globally
global.fetch = jest.fn()

describe('GitHub API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('parseGitHubUrl', () => {
    it('should parse valid GitHub URLs', () => {
      const result = parseGitHubUrl('https://github.com/bolabaden/bolabaden-infra')
      expect(result).toEqual({
        owner: 'bolabaden',
        repo: 'bolabaden-infra',
      })
    })

    it('should parse GitHub URLs with trailing slash', () => {
      const result = parseGitHubUrl('https://github.com/bolabaden/bolabaden-infra/')
      expect(result).toEqual({
        owner: 'bolabaden',
        repo: 'bolabaden-infra',
      })
    })

    it('should return null for invalid URLs', () => {
      expect(parseGitHubUrl('not-a-url')).toBeNull()
      expect(parseGitHubUrl('https://gitlab.com/user/repo')).toBeNull()
      expect(parseGitHubUrl('https://github.com/onlyonepart')).toBeNull()
    })

    it('should handle URLs with extra path segments', () => {
      const result = parseGitHubUrl('https://github.com/bolabaden/bolabaden-infra/issues')
      expect(result).toEqual({
        owner: 'bolabaden',
        repo: 'bolabaden-infra',
      })
    })
  })

  describe('fetchGitHubRepo', () => {
    const mockRepoData = {
      name: 'test-repo',
      full_name: 'owner/test-repo',
      description: 'Test repository',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-12-01T00:00:00Z',
      pushed_at: '2024-12-03T00:00:00Z',
      stargazers_count: 42,
      watchers_count: 10,
      forks_count: 5,
      open_issues_count: 3,
      language: 'TypeScript',
      topics: ['nextjs', 'react', 'typescript'],
      html_url: 'https://github.com/owner/test-repo',
      homepage: 'https://example.com',
      archived: false,
    }

    it('should fetch repository data successfully', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRepoData,
      })

      const result = await fetchGitHubRepo('owner', 'test-repo')
      expect(result).toEqual(mockRepoData)
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.github.com/repos/owner/test-repo',
        expect.objectContaining({
          headers: expect.objectContaining({
            Accept: 'application/vnd.github.v3+json',
          }),
        })
      )
    })

    it('should include authorization header when GITHUB_TOKEN is set', async () => {
      const originalEnv = process.env.GITHUB_TOKEN
      process.env.GITHUB_TOKEN = 'test-token'

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRepoData,
      })

      await fetchGitHubRepo('owner', 'test-repo')
      
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.github.com/repos/owner/test-repo',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
          }),
        })
      )

      // Restore original env
      if (originalEnv !== undefined) {
        process.env.GITHUB_TOKEN = originalEnv
      } else {
        delete process.env.GITHUB_TOKEN
      }
    })

    it('should return null when API request fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      })

      const result = await fetchGitHubRepo('owner', 'nonexistent')
      expect(result).toBeNull()
    })

    it('should return null when fetch throws error', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

      const result = await fetchGitHubRepo('owner', 'test-repo')
      expect(result).toBeNull()
    })
  })

  describe('getRepoStats', () => {
    const mockRepoData = {
      name: 'test-repo',
      full_name: 'owner/test-repo',
      description: 'Test repository',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-12-01T00:00:00Z',
      pushed_at: '2024-12-03T00:00:00Z',
      stargazers_count: 42,
      watchers_count: 10,
      forks_count: 5,
      open_issues_count: 3,
      language: 'TypeScript',
      topics: ['nextjs', 'react'],
      html_url: 'https://github.com/owner/test-repo',
      homepage: null,
      archived: false,
    }

    it('should get repository stats successfully', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRepoData,
      })

      const result = await getRepoStats('https://github.com/owner/test-repo')
      
      expect(result).toEqual({
        updatedAt: new Date('2024-12-03T00:00:00Z'),
        createdAt: new Date('2024-01-01T00:00:00Z'),
        stars: 42,
        forks: 5,
        openIssues: 3,
        language: 'TypeScript',
        topics: ['nextjs', 'react'],
      })
    })

    it('should use updated_at when pushed_at is not available', async () => {
      const dataWithoutPushedAt = { ...mockRepoData }
      delete (dataWithoutPushedAt as any).pushed_at

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => dataWithoutPushedAt,
      })

      const result = await getRepoStats('https://github.com/owner/test-repo')
      expect(result?.updatedAt).toEqual(new Date('2024-12-01T00:00:00Z'))
    })

    it('should return null for invalid GitHub URL', async () => {
      const result = await getRepoStats('https://gitlab.com/owner/repo')
      expect(result).toBeNull()
      expect(global.fetch).not.toHaveBeenCalled()
    })

    it('should return null when repo fetch fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      })

      const result = await getRepoStats('https://github.com/owner/nonexistent')
      expect(result).toBeNull()
    })
  })

  describe('fetchMultipleRepos', () => {
    const mockRepoData1 = {
      name: 'repo1',
      full_name: 'owner/repo1',
      description: 'Repo 1',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-12-01T00:00:00Z',
      pushed_at: '2024-12-03T00:00:00Z',
      stargazers_count: 10,
      watchers_count: 5,
      forks_count: 2,
      open_issues_count: 1,
      language: 'TypeScript',
      topics: ['test'],
      html_url: 'https://github.com/owner/repo1',
      homepage: null,
      archived: false,
    }

    const mockRepoData2 = {
      ...mockRepoData1,
      name: 'repo2',
      full_name: 'owner/repo2',
      stargazers_count: 20,
    }

    it('should fetch multiple repositories in parallel', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockRepoData1,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockRepoData2,
        })

      const urls = [
        'https://github.com/owner/repo1',
        'https://github.com/owner/repo2',
      ]

      const results = await fetchMultipleRepos(urls)

      expect(results).toHaveLength(2)
      expect(results[0]?.stars).toBe(10)
      expect(results[1]?.stars).toBe(20)
      expect(global.fetch).toHaveBeenCalledTimes(2)
    })

    it('should handle partial failures gracefully', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockRepoData1,
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 404,
        })

      const urls = [
        'https://github.com/owner/repo1',
        'https://github.com/owner/nonexistent',
      ]

      const results = await fetchMultipleRepos(urls)

      expect(results).toHaveLength(2)
      expect(results[0]).not.toBeNull()
      expect(results[1]).toBeNull()
    })

    it('should handle empty array', async () => {
      const results = await fetchMultipleRepos([])
      expect(results).toEqual([])
      expect(global.fetch).not.toHaveBeenCalled()
    })
  })
})

