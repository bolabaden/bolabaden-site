import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { guides } from "@/lib/data";
import { Section } from "@/components/section";
import { PageLayout } from "@/components/page-layout";
import { MarkdownContent } from "@/components/markdown-content";

export async function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = guides.find((g) => g.slug === slug);
  if (!guide) return { title: "Guide Not Found" };
  return {
    title: guide.title,
    description: guide.description,
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = guides.find((g) => g.slug === slug);
  if (!guide) return notFound();

  return (
    <PageLayout>
      <div className="mb-4">
        <Link
          href="/guides"
          className="text-sm text-primary hover:text-primary/80 transition-colors"
        >
          ← All Guides
        </Link>
      </div>
      <Section title={guide.title} subtitle={guide.description} size="lg">
        <article className="max-w-none">
          <div className="text-sm text-muted-foreground mb-6">
            <span className="capitalize">{guide.category}</span> •{" "}
            {guide.difficulty} • {guide.estimatedTime}
          </div>
          <MarkdownContent content={guide.content} />
        </article>
      </Section>
    </PageLayout>
  );
}
