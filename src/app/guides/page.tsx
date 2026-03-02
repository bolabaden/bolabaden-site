import Link from "next/link";
import { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
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
      <div className="max-w-5xl mx-auto px-2 sm:px-4 lg:px-6 py-16">
        <div className="border-b border-[#1f1f1f] pb-10 mb-10">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-[0.2em] mb-3">
            {config.GUIDES_INDEX_SECTION_TITLE}
          </p>
          <h1 className="text-4xl font-semibold text-white tracking-tight">
            {config.GUIDES_PAGE_TITLE}
          </h1>
          <p className="mt-3 text-zinc-400 max-w-xl">
            {config.GUIDES_PAGE_DESCRIPTION}
          </p>
        </div>

        {guides.length === 0 ? (
          <p className="text-zinc-500 text-sm">No guides yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
            {guides.map((g) => (
              <Link
                key={g.id}
                href={`/guides/${g.slug}`}
                className="group flex flex-col justify-between p-5 rounded-lg border border-[#1f1f1f] hover:border-[#2f2f2f] bg-[#0f0f0f] hover:bg-[#141414] transition-all"
              >
                <div>
                  <p className="text-sm font-medium text-white mb-2">
                    {g.title}
                  </p>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    {g.description}
                  </p>
                  {g.category && (
                    <p className="mt-3 text-[11px] font-medium text-zinc-600 uppercase tracking-wide">
                      {g.category}
                    </p>
                  )}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-zinc-500">
                    {g.estimatedTime}
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-zinc-700 group-hover:text-emerald-400 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
