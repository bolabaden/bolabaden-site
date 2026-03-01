import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
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
      <div className="max-w-4xl mx-auto px-6 sm:px-8 py-20">
        <div className="mb-4">
          <Link
            href="/guides"
            className="text-sm text-emerald-300 hover:text-emerald-200 transition-colors"
          >
            {config.GUIDE_BACK_TO_INDEX_LABEL}
          </Link>
        </div>
        <h1 className="text-3xl font-semibold text-slate-100 mb-2">
          {guide.title}
        </h1>
        <p className="text-slate-400 mb-4">{guide.description}</p>
        <div className="text-sm text-slate-500 mb-8">
          <span className="capitalize">{guide.category}</span> •{" "}
          {guide.difficulty} • {guide.estimatedTime}
        </div>
        <article className="max-w-none">
          <MarkdownContent content={guide.content} />
        </article>
      </div>
    </PageLayout>
  );
}
