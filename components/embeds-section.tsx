'use client'

import { useState } from 'react'
import { Section } from './section'
import { cn } from '@/lib/utils'

type Service = {
  id: string
  name: string
  description: string
  url: string
  height?: number
}

export function EmbedsSection() {
  const [activeTab, setActiveTab] = useState('homepage')

  // Predefined services with their direct URLs
  const services: Service[] = [
    {
      id: 'AI-ResearchWizard',
      name: 'AI Research Wizard',
      description: 'AI Research Wizard',
      url: 'https://gptr.bolabaden.org',
      height: 700,
    },
    {
      id: 'SearXNG',
      name: 'SearXNG',
      description: 'Privacy-respecting metasearch engine',
      url: 'https://searxng.bolabaden.org',
      height: 700,
    },
    {
      id: 'homepage',
      name: 'Homepage Dashboard',
      description: 'Comprehensive dashboard for all self-hosted services',
      url: 'https://homepage.bolabaden.org',
      height: 700,
    }
  ]

  const activeService = services.find(s => s.id === activeTab) || services[0]

  return (
    <Section id="embeds" title="Live Services" subtitle="Embedded, read-only views of self-hosted services" background="muted">
      <div className="glass rounded-lg p-4">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-border">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => setActiveTab(service.id)}
              className={cn(
                'px-4 py-2 text-sm font-medium transition-colors rounded-t-lg border-b-2',
                activeTab === service.id
                  ? 'text-primary border-primary bg-primary/10'
                  : 'text-muted-foreground border-transparent hover:text-foreground hover:border-border'
              )}
            >
              {service.name}
            </button>
          ))}
        </div>

        {/* Service Info */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground">{activeService.name}</h3>
          <p className="text-sm text-muted-foreground">{activeService.description}</p>
          <a 
            href={activeService.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            Open in new tab →
          </a>
        </div>

        {/* Iframe */}
        <div className="relative">
          <iframe
            src={activeService.url}
            title={activeService.name}
            className="w-full rounded-md border border-border"
            style={{ height: `${activeService.height}px` }}
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
            allow="fullscreen"
          />
        </div>
      </div>
    </Section>
  )
}


