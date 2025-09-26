import { notFound } from 'next/navigation'
import { guides } from '@/lib/data'
import { Section } from '@/components/section'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'

// Generate static params for all guides at build time
export async function generateStaticParams() {
  return guides.map((guide) => ({
    slug: guide.slug,
  }))
}

export default function GuidePage({ params }: { params: { slug: string } }) {
  const guide = guides.find((g) => g.slug === params.slug)
  if (!guide) return notFound()

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16">
        <Section title={guide.title} subtitle={guide.description} size="lg">
          <article className="prose prose-invert max-w-none">
            <div className="text-sm text-muted-foreground mb-6">
              <span className="capitalize">{guide.category}</span> • {guide.difficulty} • {guide.estimatedTime}
            </div>
            <div>
              {/* Guide content is preformatted Markdown string; basic render for now */}
              <pre className="whitespace-pre-wrap break-words text-sm leading-relaxed">{guide.content}</pre>
            </div>
          </article>
        </Section>
      </div>
      <Footer />
    </main>
  )
}


