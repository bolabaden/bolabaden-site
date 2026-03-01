import { Metadata } from "next";
import { PageLayout } from "@/components/page-layout";
import { ProjectsSection } from "@/components/projects-section";
import { config } from "@/lib/config";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: config.PROJECTS_PAGE_TITLE,
  description: config.PROJECTS_PAGE_DESCRIPTION,
  pathname: "/projects",
  imagePath: "/projects/opengraph-image",
  type: "article",
});

export default function ProjectsPage() {
  return (
    <PageLayout>
      <ProjectsSection />
    </PageLayout>
  );
}
