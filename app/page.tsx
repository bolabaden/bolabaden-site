'use client'

import { Navigation } from '@/components/navigation'
import { HeroSection } from '@/components/hero-section'
import { ProjectsSection } from '@/components/projects-section'
import { GuidesSection } from '@/components/guides-section'
import { EmbedsSection } from '@/components/embeds-section'
import { AboutSection } from '@/components/about-section'
import { ContactSection } from '@/components/contact-section'
import { Footer } from '@/components/footer'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <ProjectsSection />
      <GuidesSection />
      <EmbedsSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </main>
  )
}