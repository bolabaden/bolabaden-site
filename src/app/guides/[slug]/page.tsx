import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Section } from "@/components/section";
import { PageLayout } from "@/components/page-layout";
import { MarkdownContent } from "@/components/markdown-content";
import { config } from "@/lib/config";
import { getGuides } from "@/lib/guides";
import { buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guides = await getGuides();
  const guide = guides.find((g) => g.slug === slug);
  if (!guide) return { title: config.GUIDE_NOT_FOUND_TITLE };
  return buildPageMetadata({
    title: guide.title,
    description: guide.description,
    pathname: `/guides/${guide.slug}`,
    imagePath: `/guides/${guide.slug}/opengraph-image`,
    type: "article",
    keywords: [guide.category, guide.difficulty, ...(guide.technologies || [])],
  });
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guides = await getGuides();
  const guide = guides.find((g) => g.slug === slug);
  if (!guide) return notFound();

  return (
    <PageLayout>
      <div className="mb-4">
        <Link
          href="/guides"
          className="text-sm text-primary hover:text-primary/80 transition-colors"
        >
          {config.GUIDE_BACK_TO_INDEX_LABEL}
        </Link>
      </div>
      <Section title={guide.title} subtitle={guide.description} size="lg">
        <article className="max-w-none">
          <div className="text-sm text-muted-foreground mb-6">
            <span className="capitalize">{guide.category}</span> •{" "}
            {guide.difficulty} • {guide.estimatedTime}
          </div>
          <MarkdownContent content={guide.content} />
        </article>
      </Section>
    </PageLayout>
  );
}
