import { EmbedsSection } from '@/components/embeds-section'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16">
        <EmbedsSection />
      </div>
      <Footer />
    </main>
  )
}
