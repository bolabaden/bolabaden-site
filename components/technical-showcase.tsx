'use client'

import Link from 'next/link'
import { Section } from './section'
import { Dashboard } from './dashboard'

export function TechnicalShowcase() {
  return (
    <Section 
      id="services" 
      title="Infrastructure & Services"
      subtitle="Real-time monitoring of our cloud infrastructure with comprehensive observability and performance metrics."
      background="muted"
    >
      <div className="mb-8 text-center">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          View Full Dashboard
        </Link>
      </div>
      <Dashboard />
    </Section>
  )
}