/**
 * Application configuration
 * Centralized configuration for dates, experience, and other constants
 */

export const config = {
  /**
   * Professional experience start year
   * Used to calculate years of experience dynamically
   */
  EXPERIENCE_START_YEAR: parseInt(process.env.NEXT_PUBLIC_EXPERIENCE_START_YEAR || '2021', 10),
  
  /**
   * GitHub API configuration
   */
  GITHUB_OWNER: process.env.NEXT_PUBLIC_GITHUB_OWNER || 'bolabaden',
  
  /**
   * Cache durations (in seconds)
   */
  CACHE_DURATION: {
    GITHUB_REPOS: 300, // 5 minutes
    PROJECTS: 60, // 1 minute
    GUIDES: 3600, // 1 hour
  },
  
  /**
   * Fallback dates for when GitHub API fails
   * These are calculated relative to current date to avoid staleness
   */
  getFallbackDates: () => {
    const now = new Date()
    const sixMonthsAgo = new Date(now)
    sixMonthsAgo.setMonth(now.getMonth() - 6)
    
    return {
      createdAt: sixMonthsAgo,
      updatedAt: now,
    }
  },
} as const

/**
 * Calculate years of experience from start year
 */
export function getYearsOfExperience(): number {
  const currentYear = new Date().getFullYear()
  return Math.max(0, currentYear - config.EXPERIENCE_START_YEAR)
}

/**
 * Get a human-readable relative time string
 */
export function getRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'today'
  if (diffDays === 1) return 'yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  
  const years = Math.floor(diffDays / 365)
  return years === 1 ? '1 year ago' : `${years} years ago`
}

/**
 * Format date for display
 */
export function formatDate(date: Date, format: 'short' | 'long' | 'iso' = 'short'): string {
  switch (format) {
    case 'short':
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    case 'long':
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    case 'iso':
      return date.toISOString()
    default:
      return date.toLocaleDateString()
  }
}

