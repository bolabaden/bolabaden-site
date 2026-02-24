import { Metadata } from "next";
import { ContactSection } from "@/components/contact-section";
import { PageLayout } from "@/components/page-layout";
import { config } from "@/lib/config";

export const metadata: Metadata = {
  title: `Contact — ${config.OWNER_NAME}`,
  description: `Get in touch with ${config.OWNER_NAME}. Available for remote roles in infrastructure, backend, and full-stack development.`,
};

export default function ContactPage() {
  return (
    <PageLayout>
      <ContactSection />
    </PageLayout>
  );
}
