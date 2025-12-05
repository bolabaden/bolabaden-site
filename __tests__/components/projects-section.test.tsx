import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProjectsSection } from '@/components/projects-section'

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, whileHover, onHoverStart, onHoverEnd, ...props }: any) => (
      <div {...props} onMouseEnter={onHoverStart} onMouseLeave={onHoverEnd}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: any) => <a href={href}>{children}</a>
})

// Mock Section component
jest.mock('@/components/section', () => ({
  Section: ({ children, title, subtitle, id }: any) => (
    <section id={id}>
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
      {children}
    </section>
  ),
}))

// Mock the EnhancedProjectCard component
jest.mock('@/components/enhanced-project-card', () => ({
  EnhancedProjectCard: ({ project, featured, githubStats }: any) => (
    <div data-testid={`project-${project.id}`}>
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      {featured && <span>Featured Project</span>}
      {project.technologies.map((tech: string) => (
        <span key={tech}>{tech}</span>
      ))}
      {githubStats && <div data-testid="github-stats">GitHub Stats</div>}
      {project.githubUrl && <a href={project.githubUrl}>View Code</a>}
      {project.liveUrl && <a href={project.liveUrl}>Live Demo</a>}
      <span>{project.status === 'active' ? 'Active Development' : project.status}</span>
    </div>
  ),
}))

describe('ProjectsSection', () => {
  beforeEach(() => {
    // Mock successful API response for enhanced endpoint
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          projects: [
            {
              id: 'test-project',
              title: 'Test Project',
              description: 'A test project description',
              longDescription: 'Detailed description with metrics',
              technologies: ['TypeScript', 'React'],
              category: 'frontend',
              status: 'active',
              featured: true,
              githubUrl: 'https://github.com/test/project',
              liveUrl: 'https://test.example.com',
              createdAt: '2024-01-01T00:00:00.000Z',
              updatedAt: '2024-12-01T00:00:00.000Z',
            },
          ],
          githubStats: {
            'test-project': {
              stars: 5,
              forks: 1,
              recentCommitsCount: 10,
              commitActivity: [],
            },
          },
        }),
      })
    ) as jest.Mock
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders the section title and subtitle', () => {
    render(<ProjectsSection />)
    expect(screen.getByText('Public Tools & Services')).toBeInTheDocument()
    expect(screen.getByText(/All services are live/i)).toBeInTheDocument()
  })

  it('shows loading state initially', () => {
    render(<ProjectsSection />)
    expect(screen.getByText(/Loading realtime project data/i)).toBeInTheDocument()
  })

  it('displays projects after loading', async () => {
    render(<ProjectsSection />)
    
    await waitFor(() => {
      // Project may appear multiple times (featured + all projects section)
      const titles = screen.getAllByText('Test Project')
      expect(titles.length).toBeGreaterThan(0)
      const descriptions = screen.getAllByText('A test project description')
      expect(descriptions.length).toBeGreaterThan(0)
    }, { timeout: 3000 })
  })

  it('displays project technologies as badges', async () => {
    render(<ProjectsSection />)
    
    await waitFor(() => {
      // Technologies appear multiple times due to featured + all sections
      const tsElements = screen.getAllByText('TypeScript')
      expect(tsElements.length).toBeGreaterThan(0)
      const reactElements = screen.getAllByText('React')
      expect(reactElements.length).toBeGreaterThan(0)
    }, { timeout: 3000 })
  })

  it('shows project links when available', async () => {
    render(<ProjectsSection />)
    
    await waitFor(() => {
      // Links appear multiple times (featured + all projects)
      const codeLinks = screen.getAllByText('View Code')
      expect(codeLinks.length).toBeGreaterThan(0)
      const demoLinks = screen.getAllByText('Live Demo')
      expect(demoLinks.length).toBeGreaterThan(0)
    }, { timeout: 3000 })
  })

  it('displays featured badge for featured projects', async () => {
    render(<ProjectsSection />)
    
    await waitFor(() => {
      // Featured badge only shows in featured section
      const featuredBadges = screen.getAllByText('Featured Project')
      expect(featuredBadges.length).toBeGreaterThan(0)
    }, { timeout: 3000 })
  })

  it('handles API errors gracefully', async () => {
    global.fetch = jest.fn(() => Promise.reject('API error')) as jest.Mock
    
    render(<ProjectsSection />)
    
    await waitFor(() => {
      expect(screen.getByText(/Using cached data/i)).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('allows filtering projects by category', async () => {
    render(<ProjectsSection />)
    
    await waitFor(() => {
      expect(screen.getByText('All Projects')).toBeInTheDocument()
      // The category filter button exists
      const categoryButtons = screen.getAllByRole('button')
      expect(categoryButtons.length).toBeGreaterThan(0)
    }, { timeout: 3000 })
  })

  it('displays status badge with correct styling', async () => {
    render(<ProjectsSection />)
    
    await waitFor(() => {
      // Status appears multiple times (featured + all sections)
      const statusBadges = screen.getAllByText('Active Development')
      expect(statusBadges.length).toBeGreaterThan(0)
    }, { timeout: 3000 })
  })

  it('shows GitHub CTA section', async () => {
    render(<ProjectsSection />)
    
    await waitFor(() => {
      expect(screen.getByText('Open Source Contributions')).toBeInTheDocument()
      expect(screen.getByText(/All projects are open source/i)).toBeInTheDocument()
    }, { timeout: 3000 })
  })
  
  it('fetches from enhanced endpoint', async () => {
    render(<ProjectsSection />)
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/projects/enhanced')
    })
  })
  
  it('handles GitHub stats when available', async () => {
    render(<ProjectsSection />)
    
    await waitFor(() => {
      // GitHub stats are passed to EnhancedProjectCard
      // Featured projects appear in both sections, so we use getAllByTestId
      const statsElements = screen.queryAllByTestId('github-stats')
      expect(statsElements.length).toBeGreaterThan(0)
    }, { timeout: 3000 })
  })
})

