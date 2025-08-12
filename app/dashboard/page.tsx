import { Dashboard } from '@/components/dashboard'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16">
        <Dashboard />
      </div>
      <Footer />
    </main>
  )
}
