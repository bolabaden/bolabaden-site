import Link from "next/link";
import { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { MainNavbar } from "@/components/main-navbar";
import { MainFooter } from "@/components/main-footer";
import { SectionErrorBoundary } from "@/components/section-error-boundary";
import { EmbedsSection } from "@/components/embeds-section";
import { config } from "@/lib/config";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: config.HOME_PAGE_TITLE,
  description: config.HOME_PAGE_DESCRIPTION,
  pathname: "/",
  imagePath: "/opengraph-image",
  keywords: config.HOME_PAGE_KEYWORDS,
});

export default function HomePage() {
  const showcaseEnabled = config.HOME_LAYOUT_SECTIONS.some(
    (s) => s.id === "showcase" && s.enabled,
  );
  const embedsEnabled = config.HOME_LAYOUT_SECTIONS.some(
    (s) => s.id === "embeds" && s.enabled,
  );

  return (
    <div className="theme-main min-h-screen bg-[#0a0a0a] text-white">
      <MainNavbar />

      {/* Hero */}
      <section className="border-b border-[#1f1f1f]">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 pt-20 pb-18">
          <p className="text-xs font-semibold text-emerald-500 uppercase tracking-[0.2em] mb-5">
            {config.SITE_SECTION_LABEL}
          </p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-white leading-[1.05] max-w-3xl">
            {config.SITE_NAME}
          </h1>
          <p className="mt-6 text-[17px] text-zinc-400 max-w-xl leading-relaxed">
            {config.SITE_META_DESCRIPTION}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 bg-white text-black font-medium text-sm px-5 py-2.5 rounded-md hover:bg-zinc-100 transition-colors"
            >
              View projects
            </Link>
            <Link
              href="/guides"
              className="inline-flex items-center gap-2 border border-[#2f2f2f] text-white font-medium text-sm px-5 py-2.5 rounded-md hover:border-[#444] transition-colors"
            >
              Read guides
            </Link>
          </div>
        </div>
      </section>

      {/* Quick links (showcase) */}
      {showcaseEnabled && config.HOME_SHOWCASE_ITEMS.length > 0 && (
        <section className="border-b border-[#1f1f1f]">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-12">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-[0.2em] mb-5">
              {config.HOME_SHOWCASE_TITLE}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {config.HOME_SHOWCASE_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={item.href ?? "#"}
                  target={item.href?.startsWith("/") ? undefined : "_blank"}
                  rel={
                    item.href?.startsWith("/")
                      ? undefined
                      : "noopener noreferrer"
                  }
                  className="group flex flex-col justify-between p-4 rounded-lg border border-[#1f1f1f] hover:border-[#2f2f2f] bg-[#0f0f0f] hover:bg-[#141414] transition-all"
                >
                  <div>
                    <p className="text-sm font-medium text-white">
                      {item.title}
                    </p>
                    {item.description && (
                      <p className="mt-1 text-xs text-zinc-500 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <div className="mt-3 flex items-center justify-end">
                    <ArrowUpRight className="h-3.5 w-3.5 text-zinc-700 group-hover:text-emerald-400 transition-colors" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Live services */}
      {embedsEnabled && (
        <SectionErrorBoundary fallbackTitle={config.HOME_EMBEDS_FALLBACK_TITLE}>
          <EmbedsSection mode="default" />
        </SectionErrorBoundary>
      )}

      {/* Explore lanes */}
      <section className="border-b border-[#1f1f1f]" id="explore">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-12">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-[0.2em] mb-2">
            Explore
          </p>
          <h2 className="text-2xl font-semibold text-white mb-1">
            {config.HOME_EXPLORE_TITLE}
          </h2>
          <p className="text-sm text-zinc-400 mb-8 max-w-xl">
            {config.HOME_EXPLORE_SUBTITLE}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {config.HOME_EXPLORE_LANES.map((lane) => (
              <Link
                key={lane.title}
                href={lane.href}
                className="group flex items-center justify-between p-5 rounded-lg border border-[#1f1f1f] hover:border-[#2f2f2f] bg-[#0f0f0f] hover:bg-[#141414] transition-all"
              >
                <div>
                  <p className="font-medium text-white">{lane.title}</p>
                  <p className="mt-1 text-sm text-zinc-400">
                    {lane.description}
                  </p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-zinc-600 group-hover:text-emerald-400 transition-colors shrink-0 ml-4" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <MainFooter />
    </div>
  );
}
