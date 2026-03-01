import Link from "next/link";
import { Metadata } from "next";
import {
  ArrowRight,
  ArrowUpRight,
  Blocks,
  BookOpen,
  Compass,
  Cpu,
  FlaskConical,
  Layers,
  LayoutDashboard,
  Rocket,
  Workflow,
} from "lucide-react";
import { EmbedsSection } from "@/components/embeds-section";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import { Section } from "@/components/section";
import { SectionErrorBoundary } from "@/components/section-error-boundary";
import { ShowcaseSection } from "@/components/showcase-section";
import { SideToc, type TocItem } from "@/components/side-toc";
import { config, type HomeLayoutSectionId, buildConfiguredSections } from "@/lib/config";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: config.HOME_PAGE_TITLE,
  description: config.HOME_PAGE_DESCRIPTION,
  pathname: "/",
  imagePath: "/opengraph-image",
  keywords: config.HOME_PAGE_KEYWORDS,
});

const VALID_HOME_SECTION_IDS: HomeLayoutSectionId[] = [
  "showcase",
  "embeds",
  "home-hub",
  "explore-lanes",
  "future-blocks",
];

const VALID_HOME_SECTION_ID_SET = new Set<HomeLayoutSectionId>(
  VALID_HOME_SECTION_IDS,
);

const SECTION_LABEL_FALLBACKS: Record<HomeLayoutSectionId, string> = {
  showcase: "Creative Space",
  embeds: "Live Services",
  "home-hub": "Hub",
  "explore-lanes": "Explore",
  "future-blocks": "Future",
};

const hubIconMap = {
  book: BookOpen,
  blocks: Blocks,
  code: Blocks,
  compass: Compass,
  dashboard: LayoutDashboard,
} as const;

const laneIconMap = {
  cpu: Cpu,
  layers: Layers,
  rocket: Rocket,
  workflow: Workflow,
} as const;

function normalizeHomeTocItems(): TocItem[] {
  const homeSections = buildConfiguredSections(
    config.HOME_LAYOUT_SECTIONS,
    VALID_HOME_SECTION_ID_SET,
    SECTION_LABEL_FALLBACKS,
  )
    .filter((section) => section.enabled)
    .sort((a, b) => a.order - b.order);

  if (homeSections.length > 0) {
    return homeSections.map((section) => ({
      id: section.id,
      label: section.label,
    }));
  }

  return config.HOME_TOC_ITEMS.filter((item): item is TocItem =>
    VALID_HOME_SECTION_ID_SET.has(item.id as HomeLayoutSectionId),
  );
}

function normalizeHomeSections() {
  return buildConfiguredSections(
    config.HOME_LAYOUT_SECTIONS,
    VALID_HOME_SECTION_ID_SET,
    SECTION_LABEL_FALLBACKS,
  );
}

export default function HomePage() {
  const homeSections = normalizeHomeSections();
  const homeTocItems = normalizeHomeTocItems();
  const embedsMode = config.HOME_EMBEDS_MODE === "default" ? "default" : "hero";

  return (
    <>
      <Navigation />
      {homeTocItems.length > 0 && <SideToc items={homeTocItems} />}
      <main className="min-h-screen bg-background pb-24 pt-32 md:pb-0">
        {homeSections
          .filter((section) => section.enabled)
          .map((section) => {
            if (section.id === "showcase") {
              return (
                <ShowcaseSection
                  key={section.id}
                  title={config.HOME_SHOWCASE_TITLE}
                  subtitle={config.HOME_SHOWCASE_SUBTITLE}
                  items={config.HOME_SHOWCASE_ITEMS}
                />
              );
            }

            if (section.id === "embeds") {
              return (
                <SectionErrorBoundary
                  key={section.id}
                  fallbackTitle={config.HOME_EMBEDS_FALLBACK_TITLE}
                >
                  <EmbedsSection mode={embedsMode} />
                </SectionErrorBoundary>
              );
            }

            if (section.id === "home-hub") {
              return (
                <Section
                  key={section.id}
                  id="home-hub"
                  title={config.HOME_HUB_TITLE}
                  subtitle={config.HOME_HUB_SUBTITLE}
                >
                  <div className="mx-auto mb-10 max-w-3xl rounded-2xl border border-primary/25 bg-primary/10 p-6 text-center">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {config.HOME_HUB_INTRO}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {config.HOME_HUB_CARDS.map((card) => {
                      const CardIcon =
                        hubIconMap[card.icon as keyof typeof hubIconMap] ||
                        Compass;

                      return (
                        <Link
                          key={`${card.href}-${card.title}`}
                          href={card.href}
                          className="group rounded-2xl border border-border bg-secondary/20 p-6 transition-all duration-300 hover:border-primary/40 hover:bg-secondary/35"
                        >
                          <CardIcon
                            className="mb-4 h-6 w-6 text-primary"
                            aria-hidden="true"
                          />
                          <h3 className="mb-2 text-lg font-semibold text-foreground">
                            {card.title}
                          </h3>
                          <p className="mb-4 text-sm text-muted-foreground">
                            {card.description}
                          </p>
                          <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                            {card.cta}
                            <ArrowRight
                              className="h-4 w-4 transition-transform group-hover:translate-x-1"
                              aria-hidden="true"
                            />
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </Section>
              );
            }

            if (section.id === "explore-lanes") {
              return (
                <Section
                  key={section.id}
                  id="explore-lanes"
                  title={config.HOME_EXPLORE_TITLE}
                  subtitle={config.HOME_EXPLORE_SUBTITLE}
                  background="muted"
                >
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {config.HOME_EXPLORE_LANES.map((lane) => {
                      const LaneIcon =
                        laneIconMap[lane.icon as keyof typeof laneIconMap] ||
                        Rocket;

                      return (
                        <Link
                          key={`${lane.href}-${lane.title}`}
                          href={lane.href}
                          className="group rounded-xl border border-border bg-background/65 p-5 transition-all duration-300 hover:border-primary/35 hover:bg-background"
                        >
                          <div className="mb-3 flex items-center gap-2">
                            <LaneIcon
                              className="h-5 w-5 text-primary"
                              aria-hidden="true"
                            />
                            <h3 className="text-base font-semibold text-foreground">
                              {lane.title}
                            </h3>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {lane.description}
                          </p>
                          <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary">
                            {lane.cta || "Explore"}
                            <ArrowUpRight
                              className="h-4 w-4"
                              aria-hidden="true"
                            />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </Section>
              );
            }

            return (
              <Section
                key={section.id}
                id="future-blocks"
                title={config.HOME_FUTURE_TITLE}
                subtitle={config.HOME_FUTURE_SUBTITLE}
                background="muted"
              >
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/35 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
                  <FlaskConical className="h-4 w-4" aria-hidden="true" />
                  {config.HOME_FUTURE_BADGE}
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
                  {config.HOME_FUTURE_PLACEHOLDERS.map((placeholder) => (
                    <div
                      key={placeholder}
                      className="rounded-xl border border-border/80 bg-background/70 px-4 py-3 text-sm text-muted-foreground"
                    >
                      {placeholder}
                    </div>
                  ))}
                </div>
              </Section>
            );
          })}
      </main>
      <Footer />
    </>
  );
}
