'use client'

import Link from 'next/link'
import { guides } from '@/lib/data'
import { Section } from '@/components/section'

export default function GuidesIndexPage() {
  return (
    <main className="min-h-screen bg-background">
      <Section id="guides-index" title="All Guides" subtitle="Browse detailed technical guides.">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((g) => (
            <div key={g.id} className="glass rounded-lg p-6 hover:bg-white/5 transition-all duration-300">
              <h3 className="font-semibold text-foreground text-lg mb-2">{g.title}</h3>
              <p className="text-muted-foreground text-sm mb-3">{g.description}</p>
              <Link href={`/guides/${g.slug}`} className="text-primary hover:text-primary/80 text-sm font-medium">
                Read Guide
              </Link>
            </div>
          ))}
        </div>
      </Section>
    </main>
  )
}


