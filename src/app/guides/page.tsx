import Link from "next/link";
import { Metadata } from "next";
import { Section } from "@/components/section";
import { PageLayout } from "@/components/page-layout";
import { getGuides } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Technical Guides",
  description:
    "Browse detailed technical guides on Kubernetes, Docker, Terraform, and infrastructure engineering.",
};
export const dynamic = "force-dynamic";

export default async function GuidesIndexPage() {
  const guides = await getGuides();

  return (
    <PageLayout>
      <Section
        id="guides-index"
        title="All Guides"
        subtitle="Browse detailed technical guides."
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
                Read Guide →
              </Link>
            </div>
          ))}
        </div>
      </Section>
    </PageLayout>
  );
}
