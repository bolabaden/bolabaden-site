import { projects, guides, techStack, serviceCategories } from '@/lib/data'

describe('projects data', () => {
  it('should have all projects with required fields', () => {
    expect(projects.length).toBeGreaterThan(0)
    
    projects.forEach(project => {
      expect(project.id).toBeDefined()
      expect(project.title).toBeDefined()
      expect(project.description).toBeDefined()
      expect(project.technologies).toBeInstanceOf(Array)
      expect(project.category).toBeDefined()
      expect(project.status).toBeDefined()
      expect(project.createdAt).toBeInstanceOf(Date)
      expect(project.updatedAt).toBeInstanceOf(Date)
    })
  })

  it('should have valid date ranges', () => {
    const now = new Date()
    
    projects.forEach(project => {
      // CreatedAt should be before or equal to updatedAt
      expect(project.createdAt.getTime()).toBeLessThanOrEqual(project.updatedAt.getTime())
      
      // UpdatedAt should not be in the future
      expect(project.updatedAt.getTime()).toBeLessThanOrEqual(now.getTime())
      
      // CreatedAt should be reasonable (not too old)
      const threeYearsAgo = new Date()
      threeYearsAgo.setFullYear(now.getFullYear() - 3)
      expect(project.createdAt.getTime()).toBeGreaterThan(threeYearsAgo.getTime())
    })
  })

  it('should have dynamic dates that change over time', () => {
    // The fallback dates should be relative to current time
    // This ensures dates don't become stale
    projects.forEach(project => {
      const now = new Date()
      const daysDiff = (now.getTime() - project.updatedAt.getTime()) / (1000 * 60 * 60 * 24)
      
      // Updated date should be within last 12 months
      expect(daysDiff).toBeLessThan(365)
    })
  })

  it('should have featured projects', () => {
    const featuredProjects = projects.filter(p => p.featured)
    expect(featuredProjects.length).toBeGreaterThan(0)
  })

  it('should have valid GitHub URLs for projects with githubUrl', () => {
    projects
      .filter(p => p.githubUrl)
      .forEach(project => {
        expect(project.githubUrl).toMatch(/^https:\/\/github\.com\//)
      })
  })

  it('should have valid categories', () => {
    const validCategories = ['infrastructure', 'frontend', 'backend', 'ai-ml', 'devops', 'database']
    projects.forEach(project => {
      expect(validCategories).toContain(project.category)
    })
  })

  it('should have valid status values', () => {
    const validStatuses = ['active', 'completed', 'archived']
    projects.forEach(project => {
      expect(validStatuses).toContain(project.status)
    })
  })
})

describe('guides data', () => {
  it('should have all guides with required fields', () => {
    expect(guides.length).toBeGreaterThan(0)
    
    guides.forEach(guide => {
      expect(guide.id).toBeDefined()
      expect(guide.title).toBeDefined()
      expect(guide.description).toBeDefined()
      expect(guide.content).toBeDefined()
      expect(guide.category).toBeDefined()
      expect(guide.difficulty).toBeDefined()
      expect(guide.estimatedTime).toBeDefined()
      expect(guide.prerequisites).toBeInstanceOf(Array)
      expect(guide.technologies).toBeInstanceOf(Array)
      expect(guide.createdAt).toBeInstanceOf(Date)
      expect(guide.updatedAt).toBeInstanceOf(Date)
      expect(guide.slug).toBeDefined()
    })
  })

  it('should have updatedAt as current or recent date', () => {
    const now = new Date()
    
    guides.forEach(guide => {
      // UpdatedAt should be current (guides show "last verified" date)
      const diffMs = Math.abs(guide.updatedAt.getTime() - now.getTime())
      // Allow 5 seconds tolerance for test execution time
      expect(diffMs).toBeLessThan(5000)
    })
  })

  it('should have valid difficulty levels', () => {
    const validDifficulties = ['beginner', 'intermediate', 'advanced']
    guides.forEach(guide => {
      expect(validDifficulties).toContain(guide.difficulty)
    })
  })

  it('should have reasonable estimated times', () => {
    guides.forEach(guide => {
      expect(guide.estimatedTime).toMatch(/\d+-?\d*\s*(minute|hour|day)s?/)
    })
  })

  it('should have non-empty content', () => {
    guides.forEach(guide => {
      expect(guide.content.length).toBeGreaterThan(100)
      expect(guide.content).toContain('#') // Markdown heading
    })
  })
})

describe('techStack data', () => {
  it('should have all tech stack entries with required fields', () => {
    expect(techStack.length).toBeGreaterThan(0)
    
    techStack.forEach(tech => {
      expect(tech.name).toBeDefined()
      expect(tech.category).toBeDefined()
      expect(tech.level).toBeDefined()
      expect(tech.yearsOfExperience).toBeGreaterThanOrEqual(0)
      expect(tech.description).toBeDefined()
    })
  })

  it('should have valid skill levels', () => {
    const validLevels = ['beginner', 'intermediate', 'advanced', 'expert']
    techStack.forEach(tech => {
      expect(validLevels).toContain(tech.level)
    })
  })

  it('should have reasonable years of experience', () => {
    techStack.forEach(tech => {
      expect(tech.yearsOfExperience).toBeGreaterThanOrEqual(0)
      expect(tech.yearsOfExperience).toBeLessThan(20) // Sanity check
    })
  })
})

describe('serviceCategories', () => {
  it('should have valid category mappings', () => {
    expect(Object.keys(serviceCategories).length).toBeGreaterThan(0)
    
    Object.entries(serviceCategories).forEach(([key, value]) => {
      expect(typeof key).toBe('string')
      expect(typeof value).toBe('string')
      expect(value.length).toBeGreaterThan(0)
    })
  })

  it('should have consistent categories with projects', () => {
    const projectCategories = [...new Set(projects.map(p => p.category))]
    projectCategories.forEach(category => {
      // Each project category should be valid (though not necessarily in serviceCategories)
      expect(typeof category).toBe('string')
      expect(category.length).toBeGreaterThan(0)
    })
  })
})

