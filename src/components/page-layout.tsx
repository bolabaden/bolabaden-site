'use client'

import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'

/**
 * Shared page layout — wraps every page with Navigation + Footer.
 * The pt-[5.5rem] accounts for the fixed nav (search bar + nav bar).
 */
export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background pt-[5.5rem]">
        {children}
      </main>
      <Footer />
    </>
  )
}
