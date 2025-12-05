import {
  config,
  getYearsOfExperience,
  getRelativeTime,
  formatDate,
} from '@/lib/config'

describe('config', () => {
  describe('EXPERIENCE_START_YEAR', () => {
    it('should have a valid start year', () => {
      expect(config.EXPERIENCE_START_YEAR).toBeGreaterThan(2000)
      expect(config.EXPERIENCE_START_YEAR).toBeLessThanOrEqual(new Date().getFullYear())
    })
  })

  describe('getFallbackDates', () => {
    it('should return dates within reasonable ranges', () => {
      const { createdAt, updatedAt } = config.getFallbackDates()
      const now = new Date()
      
      expect(createdAt).toBeInstanceOf(Date)
      expect(updatedAt).toBeInstanceOf(Date)
      expect(updatedAt.getTime()).toBeGreaterThanOrEqual(createdAt.getTime())
      expect(updatedAt.getTime()).toBeLessThanOrEqual(now.getTime())
    })

    it('should create createdAt about 6 months ago', () => {
      const { createdAt } = config.getFallbackDates()
      const now = new Date()
      const sixMonthsAgo = new Date(now)
      sixMonthsAgo.setMonth(now.getMonth() - 6)
      
      // Allow 1 day tolerance for date calculations
      const diffDays = Math.abs(createdAt.getTime() - sixMonthsAgo.getTime()) / (1000 * 60 * 60 * 24)
      expect(diffDays).toBeLessThan(2)
    })

    it('should set updatedAt to now', () => {
      const { updatedAt } = config.getFallbackDates()
      const now = new Date()
      
      // Allow 1 second tolerance
      const diffMs = Math.abs(updatedAt.getTime() - now.getTime())
      expect(diffMs).toBeLessThan(1000)
    })
  })
})

describe('getYearsOfExperience', () => {
  it('should return a non-negative number', () => {
    const years = getYearsOfExperience()
    expect(years).toBeGreaterThanOrEqual(0)
    expect(Number.isInteger(years)).toBe(true)
  })

  it('should calculate years correctly from start year', () => {
    const currentYear = new Date().getFullYear()
    const expectedYears = Math.max(0, currentYear - config.EXPERIENCE_START_YEAR)
    expect(getYearsOfExperience()).toBe(expectedYears)
  })

  it('should be consistent across multiple calls', () => {
    const first = getYearsOfExperience()
    const second = getYearsOfExperience()
    expect(first).toBe(second)
  })

  it('should return reasonable experience range', () => {
    const years = getYearsOfExperience()
    expect(years).toBeGreaterThanOrEqual(0)
    expect(years).toBeLessThan(50) // Sanity check
  })
})

describe('getRelativeTime', () => {
  it('should return "today" for current date', () => {
    const now = new Date()
    expect(getRelativeTime(now)).toBe('today')
  })

  it('should return "yesterday" for yesterday', () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    expect(getRelativeTime(yesterday)).toBe('yesterday')
  })

  it('should return "X days ago" for recent dates', () => {
    const threeDaysAgo = new Date()
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
    expect(getRelativeTime(threeDaysAgo)).toBe('3 days ago')
  })

  it('should return "X weeks ago" for dates within a month', () => {
    const twoWeeksAgo = new Date()
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)
    expect(getRelativeTime(twoWeeksAgo)).toBe('2 weeks ago')
  })

  it('should return "X months ago" for dates within a year', () => {
    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
    const result = getRelativeTime(threeMonthsAgo)
    expect(result).toMatch(/\d+ months ago/)
  })

  it('should return "1 year ago" for dates exactly one year ago', () => {
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
    expect(getRelativeTime(oneYearAgo)).toBe('1 year ago')
  })

  it('should return "X years ago" for dates multiple years ago', () => {
    const twoYearsAgo = new Date()
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2)
    expect(getRelativeTime(twoYearsAgo)).toBe('2 years ago')
  })

  it('should handle edge cases', () => {
    // 6 days ago
    const sixDaysAgo = new Date()
    sixDaysAgo.setDate(sixDaysAgo.getDate() - 6)
    expect(getRelativeTime(sixDaysAgo)).toBe('6 days ago')
    
    // 7 days ago (1 week)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    expect(getRelativeTime(sevenDaysAgo)).toBe('1 weeks ago')
  })
})

describe('formatDate', () => {
  const testDate = new Date('2024-03-15T14:30:00Z')

  it('should format short dates correctly', () => {
    const formatted = formatDate(testDate, 'short')
    expect(formatted).toMatch(/Mar 15, 2024/)
  })

  it('should format long dates correctly', () => {
    const formatted = formatDate(testDate, 'long')
    expect(formatted).toContain('March')
    expect(formatted).toContain('15')
    expect(formatted).toContain('2024')
    expect(formatted).toMatch(/\d{2}:\d{2}/) // Time format
  })

  it('should format ISO dates correctly', () => {
    const formatted = formatDate(testDate, 'iso')
    expect(formatted).toBe('2024-03-15T14:30:00.000Z')
  })

  it('should default to short format', () => {
    const formatted = formatDate(testDate)
    expect(formatted).toMatch(/Mar 15, 2024/)
  })

  it('should handle current date', () => {
    const now = new Date()
    const formatted = formatDate(now, 'iso')
    expect(formatted).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
  })

  it('should be consistent for same date', () => {
    const date1 = formatDate(testDate, 'short')
    const date2 = formatDate(testDate, 'short')
    expect(date1).toBe(date2)
  })

  it('should handle different formats for same date', () => {
    const short = formatDate(testDate, 'short')
    const long = formatDate(testDate, 'long')
    const iso = formatDate(testDate, 'iso')
    
    expect(short).not.toBe(long)
    expect(short).not.toBe(iso)
    expect(long).not.toBe(iso)
    
    // But all should contain the year
    expect(short).toContain('2024')
    expect(long).toContain('2024')
    expect(iso).toContain('2024')
  })
})

describe('config.CACHE_DURATION', () => {
  it('should have reasonable cache durations', () => {
    expect(config.CACHE_DURATION.GITHUB_REPOS).toBe(300) // 5 minutes
    expect(config.CACHE_DURATION.PROJECTS).toBe(60) // 1 minute
    expect(config.CACHE_DURATION.GUIDES).toBe(3600) // 1 hour
  })

  it('should have all cache durations as positive numbers', () => {
    Object.values(config.CACHE_DURATION).forEach(duration => {
      expect(duration).toBeGreaterThan(0)
      expect(Number.isInteger(duration)).toBe(true)
    })
  })
})

