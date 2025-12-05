import { render, screen } from '@testing-library/react'
import { AboutSection } from '@/components/about-section'

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, whileHover, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

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

describe('AboutSection', () => {
  it('renders the section title', () => {
    render(<AboutSection />)
    expect(screen.getByText('About Me')).toBeInTheDocument()
  })

  it('displays the personal story narrative', () => {
    render(<AboutSection />)
    expect(screen.getByText(/I'm a self-taught infrastructure engineer/i)).toBeInTheDocument()
    expect(screen.getByText(/rebuilt a staging cluster 4 times/i)).toBeInTheDocument()
  })

  it('shows principle cards', () => {
    render(<AboutSection />)
    expect(screen.getByText('Self-Taught Excellence')).toBeInTheDocument()
    expect(screen.getByText('Practical Solutions')).toBeInTheDocument()
    expect(screen.getByText('Remote Collaboration')).toBeInTheDocument()
    expect(screen.getByText('Security First')).toBeInTheDocument()
  })

  it('displays current focus areas', () => {
    render(<AboutSection />)
    expect(screen.getByText('Current Focus')).toBeInTheDocument()
    expect(screen.getByText('Infrastructure as Code')).toBeInTheDocument()
    expect(screen.getByText('Production Systems')).toBeInTheDocument()
    expect(screen.getByText('AI/ML Integration')).toBeInTheDocument()
  })

  it('includes specific metrics in focus areas', () => {
    render(<AboutSection />)
    // Check for CloudCradle metric
    expect(screen.getByText(/3 hours to 12 minutes/i)).toBeInTheDocument()
    // Check for cost savings metric
    expect(screen.getByText(/reduced costs by 35%/i)).toBeInTheDocument()
  })

  it('shows work preferences section', () => {
    render(<AboutSection />)
    expect(screen.getByText('Work Preferences')).toBeInTheDocument()
    expect(screen.getByText('Remote Work')).toBeInTheDocument()
    expect(screen.getByText('Async Communication')).toBeInTheDocument()
    expect(screen.getByText('Flexible Hours')).toBeInTheDocument()
    expect(screen.getByText('Technical Focus')).toBeInTheDocument()
  })

  it('displays technical stack section', () => {
    render(<AboutSection />)
    expect(screen.getByText('Technical Stack')).toBeInTheDocument()
    // Should display skills from techStack data
    expect(screen.getByText('Kubernetes')).toBeInTheDocument()
    expect(screen.getByText('Docker')).toBeInTheDocument()
  })

  it('shows availability status', () => {
    render(<AboutSection />)
    expect(screen.getByText('Open to Opportunities')).toBeInTheDocument()
    expect(screen.getByText("Let's Work Together")).toBeInTheDocument()
  })

  it('displays contact CTA with email link', () => {
    render(<AboutSection />)
    const emailLink = screen.getByText('Get in Touch').closest('a')
    expect(emailLink).toHaveAttribute('href', 'mailto:boden.crouch@gmail.com')
  })

  it('displays GitHub profile link', () => {
    render(<AboutSection />)
    const githubLink = screen.getByText('View My Code').closest('a')
    expect(githubLink).toHaveAttribute('href', 'https://github.com/bolabaden')
    expect(githubLink).toHaveAttribute('target', '_blank')
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('emphasizes key phrases with strong tags', () => {
    render(<AboutSection />)
    const strongElements = screen.getAllByText(/sane, repeatable infrastructure|automation that you can trust/i)
    expect(strongElements.length).toBeGreaterThan(0)
  })

  it('includes value proposition for hiring', () => {
    render(<AboutSection />)
    expect(screen.getByText(/reduce toil and improve system resilience/i)).toBeInTheDocument()
    expect(screen.getByText(/identify and eliminate manual processes/i)).toBeInTheDocument()
  })
})

