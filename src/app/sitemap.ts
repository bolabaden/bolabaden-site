import { MetadataRoute } from 'next'
import { config } from '@/lib/config'
import { guides } from '@/lib/data'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = config.SITE_URL

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/dashboard`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/guides`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ]

  const guideRoutes: MetadataRoute.Sitemap = guides.map((guide) => ({
    url: `${baseUrl}/guides/${guide.slug}`,
    lastModified: guide.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...guideRoutes]
}
