import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { EmbedsSection } from "@/components/embeds-section";
import { ProjectsSection } from "@/components/projects-section";
import { GuidesSection } from "@/components/guides-section";
import { GitHubStatsSection } from "@/components/github-stats-section";
import { AboutSection } from "@/components/about-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { SectionErrorBoundary } from "@/components/section-error-boundary";
import { getGuides } from "@/lib/guides";
import { config } from "@/lib/config";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const showLiveServices = config.HOME_LIVE_SERVICES_ENABLED;
  const showProjects = config.HOME_PROJECTS_ENABLED;
  const showGuides = config.HOME_GUIDES_ENABLED;
  const showGitHubStats = config.HOME_GITHUB_STATS_ENABLED;
  const showAbout = config.HOME_ABOUT_ENABLED;
  const showContact = config.HOME_CONTACT_ENABLED;

  const guides = showGuides ? await getGuides() : [];

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        <HeroSection />
        {showLiveServices && (
          <SectionErrorBoundary fallbackTitle="Live services section failed to load">
            <EmbedsSection />
          </SectionErrorBoundary>
        )}
        {showProjects && (
          <SectionErrorBoundary fallbackTitle="Projects section failed to load">
            <ProjectsSection />
          </SectionErrorBoundary>
        )}
        {showGuides && (
          <SectionErrorBoundary fallbackTitle="Guides section failed to load">
            <GuidesSection guides={guides} />
          </SectionErrorBoundary>
        )}
        {showGitHubStats && (
          <SectionErrorBoundary fallbackTitle="GitHub stats section failed to load">
            <GitHubStatsSection />
          </SectionErrorBoundary>
        )}
        {showAbout && (
          <SectionErrorBoundary fallbackTitle="About section failed to load">
            <AboutSection />
          </SectionErrorBoundary>
        )}
        {showContact && (
          <SectionErrorBoundary fallbackTitle="Contact section failed to load">
            <ContactSection />
          </SectionErrorBoundary>
        )}
      </main>
      <Footer />
    </>
  );
}
