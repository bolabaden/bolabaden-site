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
      <div className="max-w-3xl mx-auto px-2 sm:px-4 lg:px-6 py-16">
        <div className="mb-8">
          <Link
            href="/guides"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            {config.GUIDE_BACK_TO_INDEX_LABEL}
          </Link>
        </div>
        <div className="border-b border-[#1f1f1f] pb-8 mb-8">
          <h1 className="text-3xl font-semibold text-white tracking-tight mb-3">
            {guide.title}
          </h1>
          <p className="text-zinc-400 mb-4 leading-relaxed">
            {guide.description}
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
              {guide.category}
            </span>
            <span className="text-zinc-700">·</span>
            <span className="text-xs text-zinc-500 capitalize">
              {guide.difficulty}
            </span>
            <span className="text-zinc-700">·</span>
            <span className="text-xs text-zinc-500">{guide.estimatedTime}</span>
          </div>
        </div>
        <article className="max-w-none">
          <MarkdownContent content={guide.content} />
        </article>
      </div>
    </PageLayout>
  );
}
