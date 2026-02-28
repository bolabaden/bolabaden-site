"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Clock,
  ArrowRight,
  Users,
  Target,
  Zap,
  CheckCircle,
  ChevronDown,
} from "lucide-react";
import { Section } from "./section";
import { Guide } from "@/lib/types";
import { cn } from "@/lib/utils";

const DifficultyBadge = ({
  difficulty,
}: {
  difficulty: Guide["difficulty"];
}) => {
  const difficultyConfig = {
    beginner: { color: "bg-green-500/20 text-green-400", label: "Beginner" },
    intermediate: {
      color: "bg-yellow-500/20 text-yellow-400",
      label: "Intermediate",
    },
    advanced: { color: "bg-red-500/20 text-red-400", label: "Advanced" },
  };

  const { color, label } = difficultyConfig[difficulty];

  return (
    <span className={cn("px-2 py-1 rounded-full text-xs font-medium", color)}>
      {label}
    </span>
  );
};

const GuideCard = ({ guide }: { guide: Guide }) => (
  <Link href={`/guides/${guide.slug}`} className="block h-full group">
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass rounded-lg p-6 hover:bg-white/5 transition-all duration-300 h-full flex flex-col"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground text-lg mb-2 group-hover:text-primary transition-colors">
            {guide.title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {guide.description}
          </p>
        </div>
        <DifficultyBadge difficulty={guide.difficulty} />
      </div>

      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>{guide.estimatedTime}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          <span>{guide.category}</span>
        </div>
      </div>

      {guide.prerequisites.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-foreground mb-2">
            Prerequisites:
          </h4>
          <div className="flex flex-wrap gap-1">
            {guide.prerequisites.map((prereq) => (
              <span
                key={prereq}
                className="text-xs bg-secondary/50 text-secondary-foreground px-2 py-1 rounded"
              >
                {prereq}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-1 mb-4">
        {guide.technologies.map((tech) => (
          <span
            key={tech}
            className="text-xs bg-primary/20 text-primary px-2 py-1 rounded"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="mt-auto">
        <span className="inline-flex items-center gap-2 text-primary group-hover:text-primary/80 transition-colors font-medium">
          Read Guide{" "}
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </motion.div>
  </Link>
);

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  href,
  details,
}: {
  icon: any;
  title: string;
  description: string;
  href: string;
  details: string[];
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="glass rounded-lg p-6 hover:bg-white/5 transition-all duration-300"
    >
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full text-center"
      >
        <div className="p-3 bg-primary/20 rounded-lg w-fit mx-auto mb-4">
          <Icon className="h-8 w-8 text-primary" />
        </div>
        <h3 className="font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="mt-3 flex justify-center">
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform",
              expanded && "rotate-180",
            )}
          />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4 border-t border-border pt-3"
          >
            <ul className="space-y-1 text-sm text-muted-foreground text-left mb-3">
              {details.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-primary mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href={href}
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-medium"
            >
              Explore <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const GuideCategoryCard = ({
  category,
  guidesInCategory,
}: {
  category: string;
  guidesInCategory: Guide[];
}) => {
  const [expanded, setExpanded] = useState(false);
  const topGuides = guidesInCategory.slice(0, 4);

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="glass rounded-lg p-6 hover:bg-white/5 transition-all duration-300"
    >
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full text-left"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold mb-2 capitalize">
              {category} Guides
            </h3>
            <p className="text-muted-foreground text-sm">
              {guidesInCategory.length}{" "}
              {guidesInCategory.length === 1 ? "guide" : "guides"} available in
              this category.
            </p>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform mt-1",
              expanded && "rotate-180",
            )}
          />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.ol
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4 border-t border-border pt-3 space-y-2"
          >
            {topGuides.map((guide, index) => (
              <li key={guide.id} className="text-sm">
                <Link
                  href={`/guides/${guide.slug}`}
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80"
                >
                  <span className="text-muted-foreground">{index + 1}.</span>
                  <span>{guide.title}</span>
                </Link>
              </li>
            ))}
            <li className="pt-1">
              <button
                onClick={() => {
                  const event = new CustomEvent("guides:set-filter", {
                    detail: category,
                  });
                  window.dispatchEvent(event);
                }}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Filter grid by this category
              </button>
            </li>
          </motion.ol>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export function GuidesSection({ guides }: { guides: Guide[] }) {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const categories = [
    "all",
    ...Array.from(new Set(guides.map((g) => g.category))),
  ];
  const filteredGuides =
    activeFilter === "all"
      ? guides
      : guides.filter((guide) => guide.category === activeFilter);

  const features = [
    {
      icon: Target,
      title: "Production-Ready",
      description:
        "All guides tested in real production environments with proven reliability",
      href: "/guides",
      details: [
        "Battle-tested workflows",
        "Real deployment examples",
        "Operational guardrails",
      ],
    },
    {
      icon: Zap,
      title: "Step-by-Step",
      description:
        "Clear, detailed instructions with code examples and troubleshooting tips",
      href: "/guides",
      details: [
        "Actionable checkpoints",
        "Commands and examples",
        "Troubleshooting paths",
      ],
    },
    {
      icon: CheckCircle,
      title: "Real Infrastructure",
      description:
        "Based on actual running services with live deployed applications",
      href: "/#embeds",
      details: [
        "Mapped to live services",
        "Operational metrics included",
        "Direct links to deployed systems",
      ],
    },
  ];

  const guideCategories = categories
    .filter((category) => category !== "all")
    .map((category) => ({
      category,
      guidesInCategory: guides.filter((guide) => guide.category === category),
    }));

  useEffect(() => {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      if (customEvent.detail) {
        setActiveFilter(customEvent.detail);
      }
    };
    window.addEventListener("guides:set-filter", handler);
    return () => window.removeEventListener("guides:set-filter", handler);
  }, []);

  return (
    <Section
      id="guides"
      title="Guides & Resources"
      subtitle="Technical guides, deployment tutorials, and infrastructure documentation. Learn how to replicate and extend what I've built."
      background="gradient"
    >
      {/* Features Overview */}
      <div className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>

      {/* Service Categories Overview */}
      <div className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {guideCategories.map(({ category, guidesInCategory }) => (
            <GuideCategoryCard
              key={category}
              category={category}
              guidesInCategory={guidesInCategory}
            />
          ))}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize",
                activeFilter === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/50 text-secondary-foreground hover:bg-secondary/70",
              )}
            >
              {category === "all" ? "All Guides" : category}
            </button>
          ))}
        </div>
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {filteredGuides.map((guide) => (
          <GuideCard key={guide.id} guide={guide} />
        ))}
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <div className="glass rounded-lg p-8 max-w-2xl mx-auto">
          <BookOpen className="h-16 w-16 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-semibold mb-4">Want More Guides?</h3>
          <p className="text-muted-foreground mb-6">
            Looking for specific deployment guides or have questions about
            self-hosting? I'm constantly adding new content based on real
            infrastructure experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Request a Guide
            </Link>
            <Link
              href="/guides"
              className="inline-flex items-center gap-2 px-6 py-3 glass hover:bg-white/10 transition-colors rounded-lg"
            >
              <BookOpen className="h-4 w-4" />
              Browse All Guides
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}
