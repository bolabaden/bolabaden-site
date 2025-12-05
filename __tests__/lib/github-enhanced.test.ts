import {
  parseGitHubUrl,
  transformCommitActivityToGraph,
  calculateRecentCommits,
  fetchUserRepos,
  fetchCommitActivity,
  fetchLanguageStats,
  fetchContributors,
  getEnhancedRepoStats,
  GitHubCommitActivity,
} from '@/lib/github-enhanced'

describe('parseGitHubUrl', () => {
  it('should parse valid GitHub URLs', () => {
    const result = parseGitHubUrl('https://github.com/bolabaden/project')
    expect(result).toEqual({ owner: 'bolabaden', repo: 'project' })
  })

  it('should handle URLs with trailing slashes', () => {
    const result = parseGitHubUrl('https://github.com/user/repo/')
    expect(result).toEqual({ owner: 'user', repo: 'repo' })
  })

  it('should handle URLs with extra paths', () => {
    const result = parseGitHubUrl('https://github.com/user/repo/issues/123')
    expect(result).toEqual({ owner: 'user', repo: 'repo' })
  })

  it('should return null for invalid URLs', () => {
    expect(parseGitHubUrl('not a url')).toBeNull()
    expect(parseGitHubUrl('https://example.com/repo')).toBeNull()
    expect(parseGitHubUrl('https://github.com/onlyuser')).toBeNull()
  })

  it('should handle different GitHub domains', () => {
    const result = parseGitHubUrl('https://github.com/owner/repo')
    expect(result).not.toBeNull()
  })
})

describe('transformCommitActivityToGraph', () => {
  it('should transform activity data to graph format', () => {
    const activity: GitHubCommitActivity[] = [
      { week: 1672531200, total: 5, days: [1, 0, 2, 1, 0, 1, 0] },
      { week: 1673136000, total: 10, days: [2, 3, 1, 1, 2, 1, 0] },
    ]

    const result = transformCommitActivityToGraph(activity)
    
    expect(result).toHaveLength(2)
    expect(result[0].date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(result[0].count).toBe(5)
    expect(result[1].count).toBe(10)
  })

  it('should handle empty activity', () => {
    const result = transformCommitActivityToGraph([])
    expect(result).toEqual([])
  })

  it('should convert Unix timestamps to ISO dates', () => {
    const activity: GitHubCommitActivity[] = [
      { week: 1609459200, total: 1, days: [1, 0, 0, 0, 0, 0, 0] }, // 2021-01-01
    ]

    const result = transformCommitActivityToGraph(activity)
    expect(result[0].date).toBe('2021-01-01')
  })
})

describe('calculateRecentCommits', () => {
  it('should calculate commits from last 30 days', () => {
    const now = Date.now()
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000)
    const sixtyDaysAgo = now - (60 * 24 * 60 * 60 * 1000)

    const activity: GitHubCommitActivity[] = [
      { week: Math.floor(sixtyDaysAgo / 1000), total: 100, days: [0, 0, 0, 0, 0, 0, 0] }, // Old
      { week: Math.floor(thirtyDaysAgo / 1000), total: 5, days: [1, 1, 1, 1, 1, 0, 0] }, // ~30 days
      { week: Math.floor(now / 1000), total: 10, days: [2, 2, 2, 2, 2, 0, 0] }, // Recent
    ]

    const result = calculateRecentCommits(activity)
    expect(result).toBe(15) // 5 + 10, not including the 100 from 60 days ago
  })

  it('should return 0 for no recent activity', () => {
    const sixtyDaysAgo = Date.now() - (60 * 24 * 60 * 60 * 1000)
    
    const activity: GitHubCommitActivity[] = [
      { week: Math.floor(sixtyDaysAgo / 1000), total: 100, days: [0, 0, 0, 0, 0, 0, 0] },
    ]

    const result = calculateRecentCommits(activity)
    expect(result).toBe(0)
  })

  it('should handle empty activity', () => {
    expect(calculateRecentCommits([])).toBe(0)
  })
})

describe('GitHub API functions', () => {
  beforeEach(() => {
    // Mock fetch for all API tests
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('fetchUserRepos', () => {
    it('should fetch all repos for a user', async () => {
      const mockRepos = [
        { name: 'repo1', full_name: 'user/repo1', pushed_at: '2024-12-01' },
        { name: 'repo2', full_name: 'user/repo2', pushed_at: '2024-11-01' },
      ]

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRepos,
      })

      const result = await fetchUserRepos('testuser')
      expect(result).toHaveLength(2)
      expect(result[0].name).toBe('repo1')
    })

    it('should handle API errors gracefully', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      })

      const result = await fetchUserRepos('nonexistent')
      expect(result).toEqual([])
    })

    it('should handle network errors', async () => {
      ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

      const result = await fetchUserRepos('testuser')
      expect(result).toEqual([])
    })

    it('should paginate through multiple pages', async () => {
      const page1 = Array(100).fill({ name: 'repo', pushed_at: '2024-01-01' })
      const page2 = Array(50).fill({ name: 'repo2', pushed_at: '2024-01-01' })

      ;(global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => page1,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => page2,
        })

      const result = await fetchUserRepos('testuser')
      expect(result).toHaveLength(150)
    })
  })

  describe('fetchCommitActivity', () => {
    it('should fetch commit activity', async () => {
      const mockActivity: GitHubCommitActivity[] = [
        { week: 1672531200, total: 5, days: [1, 0, 2, 1, 0, 1, 0] },
      ]

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockActivity,
      })

      const result = await fetchCommitActivity('owner', 'repo')
      expect(result).toEqual(mockActivity)
    })

    it('should return empty array on error', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      })

      const result = await fetchCommitActivity('owner', 'repo')
      expect(result).toEqual([])
    })
  })

  describe('fetchLanguageStats', () => {
    it('should fetch language statistics', async () => {
      const mockLanguages = {
        'TypeScript': 50000,
        'JavaScript': 30000,
        'CSS': 5000,
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockLanguages,
      })

      const result = await fetchLanguageStats('owner', 'repo')
      expect(result).toEqual(mockLanguages)
      expect(result.TypeScript).toBe(50000)
    })

    it('should return empty object on error', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      })

      const result = await fetchLanguageStats('owner', 'repo')
      expect(result).toEqual({})
    })
  })

  describe('fetchContributors', () => {
    it('should fetch contributors', async () => {
      const mockContributors = [
        { login: 'user1', contributions: 100, avatar_url: 'https://example.com/1.jpg' },
        { login: 'user2', contributions: 50, avatar_url: 'https://example.com/2.jpg' },
      ]

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockContributors,
      })

      const result = await fetchContributors('owner', 'repo', 5)
      expect(result).toEqual(mockContributors)
    })

    it('should respect limit parameter', async () => {
      ;(global.fetch as jest.Mock).mockImplementation((url) => {
        expect(url).toContain('per_page=3')
        return Promise.resolve({
          ok: true,
          json: async () => [],
        })
      })

      await fetchContributors('owner', 'repo', 3)
    })

    it('should return empty array on error', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      })

      const result = await fetchContributors('owner', 'repo')
      expect(result).toEqual([])
    })
  })

  describe('getEnhancedRepoStats', () => {
    it('should fetch and combine all stats', async () => {
      const now = Date.now()
      const twoWeeksAgo = Math.floor((now - (14 * 24 * 60 * 60 * 1000)) / 1000)
      const oneWeekAgo = Math.floor((now - (7 * 24 * 60 * 60 * 1000)) / 1000)
      
      const mockRepo = {
        name: 'test-repo',
        created_at: '2024-01-01',
        updated_at: '2024-12-01',
        pushed_at: '2024-12-05',
        stargazers_count: 10,
        forks_count: 2,
        open_issues_count: 1,
        size: 1000,
        language: 'TypeScript',
        topics: ['infrastructure', 'automation'],
        license: { name: 'MIT' },
        archived: false,
        fork: false,
        has_issues: true,
      }

      // Use recent timestamps so calculateRecentCommits works correctly
      const mockActivity: GitHubCommitActivity[] = [
        { week: twoWeeksAgo, total: 5, days: [1, 0, 2, 1, 0, 1, 0] },
        { week: oneWeekAgo, total: 10, days: [2, 3, 1, 1, 2, 1, 0] },
      ]

      const mockLanguages = { TypeScript: 50000, JavaScript: 10000 }
      const mockContributors = [{ login: 'user1', contributions: 15, avatar_url: 'url' }]

      ;(global.fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: true, json: async () => mockRepo }) // Repo
        .mockResolvedValueOnce({ ok: true, json: async () => mockActivity }) // Activity
        .mockResolvedValueOnce({ ok: true, json: async () => mockLanguages }) // Languages
        .mockResolvedValueOnce({ ok: true, json: async () => mockContributors }) // Contributors

      const result = await getEnhancedRepoStats('https://github.com/owner/repo')
      
      expect(result).not.toBeNull()
      expect(result?.stars).toBe(10)
      expect(result?.forks).toBe(2)
      expect(result?.totalCommits).toBe(15)
      expect(result?.recentCommitsCount).toBe(15) // Both weeks are within 30 days
      expect(result?.primaryLanguage).toBe('TypeScript')
      expect(result?.contributorCount).toBe(1)
    })

    it('should return null for invalid URL', async () => {
      const result = await getEnhancedRepoStats('invalid-url')
      expect(result).toBeNull()
    })

    it('should return null when repo fetch fails', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      })

      const result = await getEnhancedRepoStats('https://github.com/owner/nonexistent')
      expect(result).toBeNull()
    })

    it('should handle partial data gracefully', async () => {
      const mockRepo = {
        name: 'test-repo',
        created_at: '2024-01-01',
        updated_at: '2024-12-01',
        pushed_at: '2024-12-05',
        stargazers_count: 0,
        forks_count: 0,
        open_issues_count: 0,
        size: 100,
        language: null,
        topics: [],
        license: null,
        archived: false,
        fork: false,
        has_issues: false,
      }

      ;(global.fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: true, json: async () => mockRepo })
        .mockResolvedValueOnce({ ok: true, json: async () => [] }) // No activity
        .mockResolvedValueOnce({ ok: true, json: async () => ({}) }) // No languages
        .mockResolvedValueOnce({ ok: true, json: async () => [] }) // No contributors

      const result = await getEnhancedRepoStats('https://github.com/owner/repo')
      
      expect(result).not.toBeNull()
      expect(result?.stars).toBe(0)
      expect(result?.totalCommits).toBe(0)
      expect(result?.primaryLanguage).toBeNull()
      expect(result?.license).toBeNull()
    })
  })
})

describe('fetchUserRepos edge cases', () => {
  beforeEach(() => {
    global.fetch = jest.fn()
  })

  it('should stop after 10 pages to prevent infinite loops', async () => {
    const fullPage = Array(100).fill({ name: 'repo', pushed_at: '2024-01-01' })
    
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => fullPage,
    })

    const result = await fetchUserRepos('testuser')
    
    // Should have fetched 10 pages max = 1000 repos
    expect(result.length).toBe(1000)
    expect(global.fetch).toHaveBeenCalledTimes(10)
  })

  it('should stop when receiving less than full page', async () => {
    const fullPage = Array(100).fill({ name: 'repo1', pushed_at: '2024-01-01' })
    const partialPage = Array(25).fill({ name: 'repo2', pushed_at: '2024-01-01' })

    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => fullPage,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => partialPage,
      })

    const result = await fetchUserRepos('testuser')
    
    expect(result.length).toBe(125)
    expect(global.fetch).toHaveBeenCalledTimes(2) // Stopped after partial page
  })

  it('should include Authorization header when token present', async () => {
    process.env.GITHUB_TOKEN = 'test-token'
    
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    })

    await fetchUserRepos('testuser')
    
    const call = (global.fetch as jest.Mock).mock.calls[0]
    expect(call[1].headers.Authorization).toBe('Bearer test-token')
    
    delete process.env.GITHUB_TOKEN
  })

  it('should work without Authorization header', async () => {
    delete process.env.GITHUB_TOKEN
    
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    })

    await fetchUserRepos('testuser')
    
    const call = (global.fetch as jest.Mock).mock.calls[0]
    expect(call[1].headers.Authorization).toBeUndefined()
  })
})

describe('commit activity calculations', () => {
  it('should correctly sum total commits', () => {
    const activity: GitHubCommitActivity[] = [
      { week: 1672531200, total: 5, days: [1, 1, 1, 1, 1, 0, 0] },
      { week: 1673136000, total: 10, days: [2, 2, 2, 2, 2, 0, 0] },
      { week: 1673740800, total: 3, days: [1, 1, 1, 0, 0, 0, 0] },
    ]

    const total = activity.reduce((sum, week) => sum + week.total, 0)
    expect(total).toBe(18)
  })

  it('should handle weeks with zero commits', () => {
    const activity: GitHubCommitActivity[] = [
      { week: 1672531200, total: 0, days: [0, 0, 0, 0, 0, 0, 0] },
      { week: 1673136000, total: 5, days: [5, 0, 0, 0, 0, 0, 0] },
    ]

    const graph = transformCommitActivityToGraph(activity)
    expect(graph[0].count).toBe(0)
    expect(graph[1].count).toBe(5)
  })
})

