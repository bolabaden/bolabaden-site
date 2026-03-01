import { Metadata } from "next";
import { ContactSection } from "@/components/contact-section";
import { PageLayout } from "@/components/page-layout";
import { config } from "@/lib/config";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: config.CONTACT_PAGE_TITLE,
  description: config.CONTACT_PAGE_DESCRIPTION,
  pathname: "/contact",
  imagePath: "/contact/opengraph-image",
});

export default function ContactPage() {
  return (
    <PageLayout>
      <ContactSection />
    </PageLayout>
  );
}
