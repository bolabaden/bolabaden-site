import Link from "next/link";
import { Metadata } from "next";
import { MainNavbar } from "@/components/main-navbar";
import { MainFooter } from "@/components/main-footer";
import { ShowcaseSection } from "@/components/showcase-section";
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
    <div className="theme-main min-h-screen bg-[#0b0d10] text-slate-100">
      <MainNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-[#0b0d10] via-slate-950 to-[#0f172a]" />
        <div className="absolute -top-40 right-0 h-72 w-72 rounded-full bg-emerald-500/15 blur-[120px]" />
        <div className="absolute -bottom-35 -left-10 h-72 w-72 rounded-full bg-amber-500/20 blur-[140px]" />

        <div className="relative max-w-6xl mx-auto px-6 sm:px-8 pt-24 pb-20">
          <div className="mt-8 max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight">
              {config.SITE_NAME}
              <span className="block text-emerald-300">
                {config.SITE_SECTION_LABEL}
              </span>
            </h1>
            <p className="mt-6 text-lg text-slate-300">
              {config.SITE_META_DESCRIPTION}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/projects"
                className="inline-flex items-center justify-center rounded-lg bg-emerald-400 px-6 py-3 text-base font-semibold text-slate-900 transition hover:bg-emerald-300"
              >
                View projects
              </Link>
              <Link
                href="/guides"
                className="inline-flex items-center justify-center rounded-lg border border-slate-700 px-6 py-3 text-base font-semibold text-slate-200 transition hover:border-emerald-400 hover:text-emerald-200"
              >
                Read guides
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase Section — creative space */}
      {showcaseEnabled && (
        <section className="py-20 bg-[#0b0d10]">
          <div className="max-w-6xl mx-auto px-6 sm:px-8">
            <ShowcaseSection
              title={config.HOME_SHOWCASE_TITLE}
              subtitle={config.HOME_SHOWCASE_SUBTITLE}
              items={config.HOME_SHOWCASE_ITEMS}
            />
          </div>
        </section>
      )}

      {/* Embedded Services */}
      {embedsEnabled && (
        <section className="py-20 border-t border-slate-800/60 bg-[#0c111b]">
          <div className="max-w-6xl mx-auto px-6 sm:px-8">
            <SectionErrorBoundary
              fallbackTitle={config.HOME_EMBEDS_FALLBACK_TITLE}
            >
              <EmbedsSection mode="default" />
            </SectionErrorBoundary>
          </div>
        </section>
      )}

      {/* Explore Lanes */}
      <section className="py-20" id="explore">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="flex items-center justify-between gap-6 flex-wrap">
            <div>
              <h2 className="text-3xl font-semibold text-slate-100">
                {config.HOME_EXPLORE_TITLE}
              </h2>
              <p className="mt-3 text-slate-400 max-w-2xl">
                {config.HOME_EXPLORE_SUBTITLE}
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {config.HOME_EXPLORE_LANES.map((lane) => (
              <Link
                key={lane.title}
                href={lane.href}
                className="group rounded-2xl border border-slate-800 bg-slate-950/70 p-6 transition hover:border-emerald-400/50"
              >
                <h3 className="text-xl font-semibold text-slate-100">
                  {lane.title}
                </h3>
                <p className="mt-3 text-slate-400">{lane.description}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-emerald-300 group-hover:text-emerald-200">
                  {lane.cta || "Explore"} →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <MainFooter />
    </div>
  );
}
