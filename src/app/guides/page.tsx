import Link from "next/link";
import { Metadata } from "next";
import { Section } from "@/components/section";
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
      <Section
        id="guides-index"
        title={config.GUIDES_INDEX_SECTION_TITLE}
        subtitle={config.GUIDES_INDEX_SECTION_SUBTITLE}
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {guides.map((g) => (
            <div
              key={g.id}
              className="p-6 transition-all duration-300 rounded-lg glass hover:bg-white/5"
            >
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {g.title}
              </h3>
              <p className="mb-3 text-sm text-muted-foreground">
                {g.description}
              </p>
              <Link
                href={`/guides/${g.slug}`}
                className="text-sm font-medium text-primary hover:text-primary/80"
              >
                {config.GUIDES_INDEX_CARD_CTA}
              </Link>
            </div>
          ))}
        </div>
      </Section>
    </PageLayout>
  );
}
