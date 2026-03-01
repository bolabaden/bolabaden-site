import Link from "next/link";
import { Metadata } from "next";
import { PageLayout } from "@/components/page-layout";
import { config } from "@/lib/config";
import { getGuides } from "@/lib/guides";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: config.GUIDES_PAGE_TITLE,
  description: config.GUIDES_PAGE_DESCRIPTION,
  pathname: "/guides",
  imagePath: "/guides/opengraph-image",
  type: "article",
});
export const dynamic = "force-dynamic";

export default async function GuidesIndexPage() {
  const guides = await getGuides();

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-20">
        <h1 className="text-3xl font-semibold text-slate-100 mb-2">
          {config.GUIDES_INDEX_SECTION_TITLE}
        </h1>
        <p className="text-slate-400 mb-10">
          {config.GUIDES_INDEX_SECTION_SUBTITLE}
        </p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {guides.map((g) => (
            <div
              key={g.id}
              className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 transition hover:border-emerald-400/40"
            >
              <h3 className="mb-2 text-lg font-semibold text-slate-100">
                {g.title}
              </h3>
              <p className="mb-3 text-sm text-slate-400">{g.description}</p>
              <Link
                href={`/guides/${g.slug}`}
                className="text-sm font-medium text-emerald-300 hover:text-emerald-200"
              >
                {config.GUIDES_INDEX_CARD_CTA}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
