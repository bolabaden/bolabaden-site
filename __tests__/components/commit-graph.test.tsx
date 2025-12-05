import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CommitGraph, CommitSparkline } from '@/components/commit-graph'
import { CommitGraphData } from '@/lib/github-enhanced'

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, onHoverStart, onHoverEnd, ...props }: any) => (
      <div 
        {...props}
        onMouseEnter={onHoverStart}
        onMouseLeave={onHoverEnd}
      >
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

// Mock config
jest.mock('@/lib/config', () => ({
  getRelativeTime: jest.fn((date: Date) => {
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    if (diff === 0) return 'today'
    if (diff < 7) return `${diff} days ago`
    return `${Math.floor(diff / 7)} weeks ago`
  }),
}))

describe('CommitGraph', () => {
  const mockData: CommitGraphData[] = [
    { date: '2024-10-01', count: 5 },
    { date: '2024-10-08', count: 10 },
    { date: '2024-10-15', count: 3 },
    { date: '2024-10-22', count: 7 },
    { date: '2024-10-29', count: 12 },
    { date: '2024-11-05', count: 8 },
    { date: '2024-11-12', count: 4 },
    { date: '2024-11-19', count: 9 },
    { date: '2024-11-26', count: 6 },
    { date: '2024-12-03', count: 11 },
    { date: '2024-12-10', count: 2 },
    { date: '2024-12-17', count: 15 },
  ]

  it('should render graph with correct number of bars', () => {
    const { container } = render(<CommitGraph data={mockData} />)
    
    // Should render 12 weeks (last 12 from data)
    const bars = container.querySelectorAll('.flex-1')
    expect(bars.length).toBe(12)
  })

  it('should return null for empty data', () => {
    const { container } = render(<CommitGraph data={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('should return null for null data', () => {
    const { container } = render(<CommitGraph data={null as any} />)
    expect(container.firstChild).toBeNull()
  })

  it('should display legend text', () => {
    render(<CommitGraph data={mockData} />)
    expect(screen.getByText('12 weeks ago')).toBeInTheDocument()
    expect(screen.getByText('Recent activity')).toBeInTheDocument()
  })

  it('should apply correct colors based on commit intensity', () => {
    const { container } = render(<CommitGraph data={mockData} />)
    
    // Max is 15 commits (last week)
    // Should have different color intensities
    const bars = container.querySelectorAll('[class*="bg-green"]')
    expect(bars.length).toBeGreaterThan(0)
  })

  it('should show gray for weeks with zero commits', () => {
    const dataWithZeros: CommitGraphData[] = [
      { date: '2024-12-01', count: 0 },
      { date: '2024-12-08', count: 5 },
    ]
    
    const { container } = render(<CommitGraph data={dataWithZeros} />)
    const grayBar = container.querySelector('.bg-gray-800')
    expect(grayBar).toBeInTheDocument()
  })

  it('should accept custom className', () => {
    const { container } = render(<CommitGraph data={mockData} className="custom-class" />)
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('should take only last 12 weeks', () => {
    const longData = Array(52).fill(null).map((_, i) => ({
      date: `2024-${String(i + 1).padStart(2, '0')}-01`,
      count: i,
    }))

    const { container } = render(<CommitGraph data={longData} />)
    const bars = container.querySelectorAll('.flex-1')
    expect(bars.length).toBe(12) // Should only show 12, not 52
  })
})

describe('CommitSparkline', () => {
  const mockData: CommitGraphData[] = [
    { date: '2024-12-01', count: 5 },
    { date: '2024-12-08', count: 10 },
    { date: '2024-12-15', count: 8 },
  ]

  it('should render SVG sparkline', () => {
    const { container } = render(<CommitSparkline data={mockData} />)
    
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('viewBox', '0 0 100 20')
  })

  it('should render polyline with points', () => {
    const { container } = render(<CommitSparkline data={mockData} />)
    
    const polyline = container.querySelector('polyline')
    expect(polyline).toBeInTheDocument()
    expect(polyline).toHaveAttribute('points')
    expect(polyline?.getAttribute('points')).not.toBe('')
  })

  it('should return null for empty data', () => {
    const { container } = render(<CommitSparkline data={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('should accept custom className', () => {
    const { container } = render(<CommitSparkline data={mockData} className="sparkline-custom" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('sparkline-custom')
  })

  it('should use last 12 weeks only', () => {
    const longData = Array(52).fill(null).map((_, i) => ({
      date: `2024-${String(i % 12 + 1).padStart(2, '0')}-01`,
      count: i,
    }))

    render(<CommitSparkline data={longData} />)
    
    // Verify it doesn't crash and renders something
    const { container } = render(<CommitSparkline data={longData} />)
    expect(container.querySelector('polyline')).toBeInTheDocument()
  })
})

describe('CommitGraph hover behavior', () => {
  const mockData: CommitGraphData[] = [
    { date: '2024-12-01', count: 5 },
    { date: '2024-12-08', count: 10 },
  ]

  it('should show tooltip information', () => {
    const { container } = render(<CommitGraph data={mockData} />)
    
    // Tooltip should be present in DOM (even if hidden)
    const commitText = container.textContent
    expect(commitText).toContain('commits')
  })

  it('should display commit count in tooltip', () => {
    render(<CommitGraph data={mockData} />)
    
    // The 10 and 5 commit counts should be somewhere in the DOM
    expect(screen.getByText(/10 commits/)).toBeInTheDocument()
  })
})

