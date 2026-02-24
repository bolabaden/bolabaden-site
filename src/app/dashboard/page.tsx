import { Metadata } from 'next'
import { EmbedsSection } from '@/components/embeds-section'
import { PageLayout } from '@/components/page-layout'

export const metadata: Metadata = {
  title: 'Dashboard — Live Services',
  description: 'Live embedded views of self-hosted services including AI Research Wizard, SearXNG, and Homepage Dashboard.',
}

export default function DashboardPage() {
  return (
    <PageLayout>
      <EmbedsSection />
    </PageLayout>
  )
}
