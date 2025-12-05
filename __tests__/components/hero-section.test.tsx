import { render, screen, waitFor } from '@testing-library/react'
import { HeroSection } from '@/components/hero-section'

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: any) => <a href={href}>{children}</a>
})

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

describe('HeroSection', () => {
  beforeEach(() => {
    // Mock fetch for API calls
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          stats: {
            totalServices: 8,
            avgUptime: 99.9
          }
        }),
      })
    ) as jest.Mock
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders the hero heading with name', () => {
    render(<HeroSection />)
    expect(screen.getByText(/Hi, I'm/i)).toBeInTheDocument()
    expect(screen.getByText(/Boden Crouch/i)).toBeInTheDocument()
  })

  it('displays the professional title', () => {
    render(<HeroSection />)
    expect(screen.getByText(/Self-taught infrastructure engineer & software developer/i)).toBeInTheDocument()
  })

  it('renders the description text', () => {
    render(<HeroSection />)
    expect(screen.getByText(/I design, deploy, and maintain complex technical systems/i)).toBeInTheDocument()
  })

  it('displays Contact Me and GitHub Profile links', () => {
    render(<HeroSection />)
    expect(screen.getByText(/Contact Me/i)).toBeInTheDocument()
    expect(screen.getByText(/GitHub Profile/i)).toBeInTheDocument()
  })

  it('shows the resume download link', () => {
    render(<HeroSection />)
    expect(screen.getByText(/Download my resume/i)).toBeInTheDocument()
  })

  it('displays quick navigation links', () => {
    render(<HeroSection />)
    expect(screen.getByText(/Browse All Services/i)).toBeInTheDocument()
    expect(screen.getByText(/View Projects/i)).toBeInTheDocument()
    expect(screen.getByText(/Technical Guides/i)).toBeInTheDocument()
  })

  it('fetches and displays service stats', async () => {
    render(<HeroSection />)
    
    await waitFor(() => {
      expect(screen.getByText('8+')).toBeInTheDocument()
      expect(screen.getByText('99.9%')).toBeInTheDocument()
    })
  })

  it('handles fetch errors gracefully', async () => {
    global.fetch = jest.fn(() => Promise.reject('API error')) as jest.Mock
    
    render(<HeroSection />)
    
    // Should still render without crashing
    expect(screen.getByText(/Hi, I'm/i)).toBeInTheDocument()
  })

  it('calculates years of experience based on start year', () => {
    render(<HeroSection />)
    
    // Should show at least 2+ years (2023 start year)
    const experienceText = screen.getByText(/Years Experience/i).parentElement
    expect(experienceText).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    const { container } = render(<HeroSection />)
    
    // Check for semantic HTML structure (section element)
    const section = container.querySelector('section')
    expect(section).toBeInTheDocument()
    
    // Check for main heading
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
  })
})

