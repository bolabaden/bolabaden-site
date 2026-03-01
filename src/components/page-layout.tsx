'use client'

import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'

/**
 * Shared page layout — wraps every page with Navigation + Footer.
 * The pt-32 accounts for the fixed nav with increased spacing between search bar and menu links.
 */
export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background pt-32">
        {children}
      </main>
      <Footer />
    </>
  )
}
