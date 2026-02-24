'use client'

import { Navigation } from '@/components/navigation'
import { HeroSection } from '@/components/hero-section'
import { EmbedsSection } from '@/components/embeds-section'
import { ProjectsSection } from '@/components/projects-section'
import { GuidesSection } from '@/components/guides-section'
import { GitHubStatsSection } from '@/components/github-stats-section'
import { AboutSection } from '@/components/about-section'
import { ContactSection } from '@/components/contact-section'
import { Footer } from '@/components/footer'
import { SectionErrorBoundary } from '@/components/section-error-boundary'

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        <HeroSection />
        <SectionErrorBoundary fallbackTitle="Live services section failed to load">
          <EmbedsSection />
        </SectionErrorBoundary>
        <SectionErrorBoundary fallbackTitle="Projects section failed to load">
          <ProjectsSection />
        </SectionErrorBoundary>
        <SectionErrorBoundary fallbackTitle="Guides section failed to load">
          <GuidesSection />
        </SectionErrorBoundary>
        <SectionErrorBoundary fallbackTitle="GitHub stats section failed to load">
          <GitHubStatsSection />
        </SectionErrorBoundary>
        <SectionErrorBoundary fallbackTitle="About section failed to load">
          <AboutSection />
        </SectionErrorBoundary>
        <SectionErrorBoundary fallbackTitle="Contact section failed to load">
          <ContactSection />
        </SectionErrorBoundary>
      </main>
      <Footer />
    </>
  )
}