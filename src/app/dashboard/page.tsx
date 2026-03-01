import { Metadata } from "next";
import { EmbedsSection } from "@/components/embeds-section";
import { PageLayout } from "@/components/page-layout";
import { config } from "@/lib/config";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: config.DASHBOARD_PAGE_TITLE,
  description: config.DASHBOARD_PAGE_DESCRIPTION,
  pathname: "/dashboard",
  imagePath: "/dashboard/opengraph-image",
});

export default function DashboardPage() {
  return (
    <PageLayout>
      <EmbedsSection />
    </PageLayout>
  );
}
