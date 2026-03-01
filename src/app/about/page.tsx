import { Metadata } from "next";
import Link from "next/link";
import { AboutNavigation } from "@/components/about-navigation";
import { HeroSection } from "@/components/hero-section";
import { EmbedsSection } from "@/components/embeds-section";
import { ProjectsSection } from "@/components/projects-section";
import { GuidesSection } from "@/components/guides-section";
import { GitHubStatsSection } from "@/components/github-stats-section";
import { AboutSection } from "@/components/about-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { SideToc, type TocItem } from "@/components/side-toc";
import { SectionErrorBoundary } from "@/components/section-error-boundary";
import { getGuides } from "@/lib/guides";
import {
  config,
  type AboutLayoutSectionId,
  buildConfiguredSections,
  type NormalizedSection,
} from "@/lib/config";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: `About — ${config.OWNER_NAME}`,
  description: `${config.OWNER_NAME}'s full portfolio, projects, live services, guides, and contact information.`,
  pathname: "/about",
  imagePath: "/about/opengraph-image",
});

export const dynamic = "force-dynamic";

const VALID_ABOUT_SECTION_IDS: AboutLayoutSectionId[] = [
  "hero",
  "embeds",
  "projects",
  "guides",
  "github-stats",
  "about",
  "contact",
];

const VALID_ABOUT_SECTION_ID_SET = new Set<AboutLayoutSectionId>(
  VALID_ABOUT_SECTION_IDS,
);

const ABOUT_LABEL_FALLBACKS: Record<AboutLayoutSectionId, string> = {
  hero: "Overview",
  embeds: "Live Services",
  projects: "Projects",
  guides: "Guides",
  "github-stats": "GitHub Stats",
  about: "About",
  contact: "Contact",
};

function buildAboutLegacyFallback(
  fallbackIds: AboutLayoutSectionId[],
): NormalizedSection<AboutLayoutSectionId>[] {
  return config.ABOUT_TOC_ITEMS.filter(
    (item): item is TocItem & { id: AboutLayoutSectionId } =>
      VALID_ABOUT_SECTION_ID_SET.has(item.id as AboutLayoutSectionId),
  ).map((item, index) => ({
    id: item.id,
    label: item.label,
    enabled: true,
    order: index + 1,
  }));
}

function normalizeAboutSections() {
  return buildConfiguredSections(
    config.ABOUT_LAYOUT_SECTIONS,
    VALID_ABOUT_SECTION_ID_SET,
    ABOUT_LABEL_FALLBACKS,
    buildAboutLegacyFallback,
  );
}

export default async function AboutPage() {
  const aboutSections = normalizeAboutSections();
  const enabledSectionIds = new Set(
    aboutSections
      .filter((section) => section.enabled)
      .map((section) => section.id),
  );
  const aboutTocItems: TocItem[] = aboutSections
    .filter((section) => section.enabled)
    .map((section) => ({ id: section.id, label: section.label }));
  const shouldLoadGuides = enabledSectionIds.has("guides");
  const embedsMode = config.ABOUT_EMBEDS_MODE === "hero" ? "hero" : "default";

  const guides = shouldLoadGuides ? await getGuides() : [];

  return (
    <>
      <AboutNavigation />
      {aboutTocItems.length > 0 && <SideToc items={aboutTocItems} />}
      <main className="min-h-screen bg-background pb-24 pt-32 md:pb-0">
        <section className="py-10 border-b border-border/50 bg-muted/10">
          <div className="container mx-auto px-4">
            <div className="grid gap-4 md:grid-cols-3">
              {config.HOME_HUB_CARDS.slice(0, 3).map((card) => (
                <Link
                  key={card.title}
                  href={card.href}
                  className="group rounded-xl border border-border bg-background/70 p-5 transition-colors hover:border-primary/50"
                >
                  <h2 className="text-lg font-semibold text-foreground mb-2">
                    {card.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                  <span className="mt-3 inline-block text-sm font-medium text-primary group-hover:text-primary/80 transition-colors">
                    {card.cta} →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {aboutSections
          .filter((section) => section.enabled)
          .map((section) => {
            if (section.id === "hero") {
              return (
                <SectionErrorBoundary
                  key={section.id}
                  fallbackTitle="Overview section failed to load"
                >
                  <HeroSection />
                </SectionErrorBoundary>
              );
            }

            if (section.id === "embeds") {
              return (
                <SectionErrorBoundary
                  key={section.id}
                  fallbackTitle={config.ABOUT_EMBEDS_FALLBACK_TITLE}
                >
                  <EmbedsSection mode={embedsMode} />
                </SectionErrorBoundary>
              );
            }

            if (section.id === "projects") {
              return (
                <SectionErrorBoundary
                  key={section.id}
                  fallbackTitle="Projects section failed to load"
                >
                  <ProjectsSection />
                </SectionErrorBoundary>
              );
            }

            if (section.id === "guides") {
              return (
                <SectionErrorBoundary
                  key={section.id}
                  fallbackTitle="Guides section failed to load"
                >
                  <GuidesSection guides={guides} />
                </SectionErrorBoundary>
              );
            }

            if (section.id === "github-stats") {
              return (
                <SectionErrorBoundary
                  key={section.id}
                  fallbackTitle="GitHub stats section failed to load"
                >
                  <GitHubStatsSection />
                </SectionErrorBoundary>
              );
            }

            if (section.id === "about") {
              return (
                <SectionErrorBoundary
                  key={section.id}
                  fallbackTitle="About section failed to load"
                >
                  <AboutSection />
                </SectionErrorBoundary>
              );
            }

            return (
              <SectionErrorBoundary
                key={section.id}
                fallbackTitle="Contact section failed to load"
              >
                <ContactSection />
              </SectionErrorBoundary>
            );
          })}
      </main>
      <Footer />
    </>
  );
}
