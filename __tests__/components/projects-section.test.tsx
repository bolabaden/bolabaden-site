import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProjectsSection } from '@/components/projects-section'

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, whileHover, ...props }: any) => <div {...props}>{children}</div>,
  },
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

describe('ProjectsSection', () => {
  beforeEach(() => {
    // Mock successful API response
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
      expect(screen.getByText('Test Project')).toBeInTheDocument()
      expect(screen.getByText('A test project description')).toBeInTheDocument()
    })
  })

  it('displays project technologies as badges', async () => {
    render(<ProjectsSection />)
    
    await waitFor(() => {
      expect(screen.getByText('TypeScript')).toBeInTheDocument()
      expect(screen.getByText('React')).toBeInTheDocument()
    })
  })

  it('shows project links when available', async () => {
    render(<ProjectsSection />)
    
    await waitFor(() => {
      expect(screen.getByText('View Code')).toBeInTheDocument()
      expect(screen.getByText('Live Demo')).toBeInTheDocument()
    })
  })

  it('displays featured badge for featured projects', async () => {
    render(<ProjectsSection />)
    
    await waitFor(() => {
      expect(screen.getByText('Featured Project')).toBeInTheDocument()
    })
  })

  it('handles API errors gracefully', async () => {
    global.fetch = jest.fn(() => Promise.reject('API error')) as jest.Mock
    
    render(<ProjectsSection />)
    
    await waitFor(() => {
      expect(screen.getByText(/Using cached data/i)).toBeInTheDocument()
    })
  })

  it('allows filtering projects by category', async () => {
    render(<ProjectsSection />)
    
    await waitFor(() => {
      expect(screen.getByText('All Projects')).toBeInTheDocument()
      expect(screen.getByText(/frontend/i)).toBeInTheDocument()
    })
  })

  it('displays status badge with correct styling', async () => {
    render(<ProjectsSection />)
    
    await waitFor(() => {
      expect(screen.getByText('Active Development')).toBeInTheDocument()
    })
  })

  it('shows GitHub CTA section', async () => {
    render(<ProjectsSection />)
    
    await waitFor(() => {
      expect(screen.getByText('Open Source Contributions')).toBeInTheDocument()
      expect(screen.getByText(/All projects are open source/i)).toBeInTheDocument()
    })
  })
})

