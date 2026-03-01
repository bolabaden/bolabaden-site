"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Brain,
  Code,
  Globe,
  Clock,
  MessageSquare,
  CheckCircle,
  Zap,
  Target,
  Users,
  BookOpen,
  Server,
  Shield,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import { Section } from "./section";
import { techStack } from "@/lib/data";
import { TechStack } from "@/lib/types";
import { config } from "@/lib/config";
import { cn } from "@/lib/utils";

const SkillCard = ({ skill }: { skill: TechStack }) => {
  const [expanded, setExpanded] = useState(false);
  const levelColors = {
    beginner: "bg-green-500/20 text-green-400",
    intermediate: "bg-yellow-500/20 text-yellow-400",
    advanced: "bg-orange-500/20 text-orange-400",
    expert: "bg-red-500/20 text-red-400",
  };

  const categoryIcons = {
    frontend: Code,
    backend: Server,
    infrastructure: Server,
    database: Server,
    "ai-ml": Brain,
    devops: Zap,
  };

  const Icon =
    categoryIcons[skill.category as keyof typeof categoryIcons] || Code;
  const repositories = skill.repositories || [];
  const hasRepositories = repositories.length > 0;
  const hasInsights = Boolean(skill.insights);
  const evidenceHighlights = (skill.insights?.evidenceHighlights || [])
    .filter(Boolean)
    .slice(0, 4);
  const metricTiles = skill.insights
    ? [
        {
          label: "Repos",
          value: `${skill.insights.repositoryCount}`,
        },
        {
          label: "Primary Share",
          value: `${skill.insights.primaryLanguageSharePct}%`,
        },
        {
          label: "Owners",
          value: `${skill.insights.ownerCount}`,
        },
        {
          label: "Evidence",
          value: `${skill.insights.evidenceConfidencePct}%`,
        },
      ]
    : [];
  const categoryLabel = skill.category.replace("-", "/");
  const levelLabel = `${skill.level.charAt(0).toUpperCase()}${skill.level.slice(1)}`;
  const fallbackExperienceLabel =
    skill.yearsOfExperience < 1
      ? `${Math.max(1, Math.round(skill.yearsOfExperience * 12))} months active usage`
      : `${skill.yearsOfExperience} year${skill.yearsOfExperience === 1 ? "" : "s"} active usage`;
  const experienceText = skill.experienceLabel || fallbackExperienceLabel;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass rounded-lg p-4 hover:bg-white/5 transition-all duration-300"
    >
      <button
        type="button"
        onClick={() => hasRepositories && setExpanded((prev) => !prev)}
        disabled={!hasRepositories}
        className={cn(
          "w-full text-left",
          hasRepositories && "cursor-pointer",
          !hasRepositories && "cursor-default",
        )}
        aria-label={
          hasRepositories
            ? `${expanded ? "Collapse" : "Expand"} ${skill.name} repositories`
            : undefined
        }
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground text-sm">
                {skill.name}
              </h4>
              <p className="text-xs text-muted-foreground">{categoryLabel}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                levelColors[skill.level],
              )}
            >
              {levelLabel}
            </span>
            {hasRepositories && (
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform duration-300",
                  expanded && "rotate-180",
                )}
                aria-hidden="true"
              />
            )}
          </div>
        </div>

        <p className="text-xs leading-relaxed text-muted-foreground mb-3">
          {skill.description ||
            `${skill.name} in active use across recent projects.`}
        </p>

        <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
          <span className="rounded-md border border-border bg-muted/40 px-2 py-1 font-medium text-foreground">
            {experienceText}
          </span>
          {hasInsights && skill.insights && (
            <span className="rounded-md border border-border bg-muted/40 px-2 py-1">
              Activity {skill.insights.activityScorePct}%
            </span>
          )}
        </div>

        {metricTiles.length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            {metricTiles.map((metric) => (
              <div
                key={`${skill.name}-${metric.label}`}
                className="rounded-md border border-border bg-background/30 px-2 py-1.5"
              >
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  {metric.label}
                </div>
                <div className="text-xs font-semibold text-foreground">
                  {metric.value}
                </div>
              </div>
            ))}
          </div>
        )}
      </button>

      <AnimatePresence initial={false}>
        {expanded && hasRepositories && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-4 border-t border-border pt-3"
          >
            {evidenceHighlights.length > 0 && (
              <div className="mb-3 rounded-md border border-border bg-muted/20 p-2.5">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-foreground">
                  Evidence Highlights
                </p>
                <ul className="space-y-1">
                  {evidenceHighlights.map((highlight, index) => (
                    <li
                      key={`${skill.name}-highlight-${index}`}
                      className="flex items-start gap-1.5 text-xs text-muted-foreground"
                    >
                      <span className="mt-0.75 h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="text-xs font-medium text-foreground mb-2">
              Repositories using {skill.name}
            </p>
            <ol className="space-y-1">
              {repositories.map((repo, index) => (
                <li
                  key={`${skill.name}-${repo.url}-${index}`}
                  className="text-xs"
                >
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                  >
                    <span className="text-muted-foreground">{index + 1}.</span>
                    <span>{repo.name}</span>
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ol>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const PrincipleCard = ({
  icon: Icon,
  title,
  description,
  href,
  external,
}: {
  icon: any;
  title: string;
  description: string;
  href?: string;
  external?: boolean;
}) => {
  const card = (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="glass rounded-lg p-6 text-center hover:bg-white/5 transition-all duration-300 h-full"
    >
      <div className="p-3 bg-primary/20 rounded-lg w-fit mx-auto mb-4">
        <Icon className="h-8 w-8 text-primary" />
      </div>
      <h3 className="font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </motion.div>
  );

  if (!href) {
    return card;
  }

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full"
      >
        {card}
      </a>
    );
  }

  if (href.startsWith("#")) {
    return (
      <a href={href} className="block h-full">
        {card}
      </a>
    );
  }

  return (
    <Link href={href} className="block h-full">
      {card}
    </Link>
  );
};

const WorkPreferenceCard = ({
  icon: Icon,
  label,
  description,
  href,
}: {
  icon: any;
  label: string;
  description: string;
  href?: string;
}) => {
  const card = (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass rounded-lg p-4 text-center hover:bg-white/5 transition-all duration-300 h-full"
    >
      <div className="p-3 bg-primary/20 rounded-lg w-fit mx-auto mb-3">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h4 className="font-semibold text-foreground mb-2">{label}</h4>
      <p className="text-sm text-muted-foreground">{description}</p>
    </motion.div>
  );

  if (!href) {
    return card;
  }

  if (href.startsWith("mailto:") || href.startsWith("http")) {
    return (
      <a
        href={href}
        className="block h-full"
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {card}
      </a>
    );
  }

  if (href.startsWith("#")) {
    return (
      <a href={href} className="block h-full">
        {card}
      </a>
    );
  }

  return (
    <Link href={href} className="block h-full">
      {card}
    </Link>
  );
};

export function AboutSection() {
  const [skills, setSkills] = useState<TechStack[]>(techStack);
  const [skillsLoading, setSkillsLoading] = useState(true);

  useEffect(() => {
    async function fetchSkills() {
      try {
        const res = await fetch("/api/github/skills?limit=16");
        if (res.ok) {
          const data = await res.json();
          if (data.skills?.length > 0) {
            setSkills(data.skills);
          }
        }
      } catch {
        // Keep using fallback techStack from data.ts
      } finally {
        setSkillsLoading(false);
      }
    }
    fetchSkills();
  }, []);

  const principles = [
    {
      icon: BookOpen,
      title: "Self-Taught Excellence",
      description:
        "Passionate about continuous learning and staying current with emerging technologies",
      href: "/guides",
    },
    {
      icon: Target,
      title: "Practical Solutions",
      description:
        "Focus on building things that work reliably in production environments",
      href: "/about#projects",
    },
    {
      icon: Users,
      title: "Remote Collaboration",
      description:
        "Experienced in async communication and distributed team workflows",
      href: "/contact",
    },
    {
      icon: Shield,
      title: "Security First",
      description:
        "Always prioritize security and best practices in system design",
      href: "/guides",
    },
  ];

  const workPreferences = [
    {
      icon: Globe,
      label: "Remote Work",
      description: "Fully remote, distributed teams",
      href: "/contact",
    },
    {
      icon: MessageSquare,
      label: "Async Communication",
      description: "Email, text-based chat, documentation",
      href: `mailto:${config.CONTACT_EMAIL}`,
    },
    {
      icon: Clock,
      label: "Flexible Hours",
      description: "Central timezone, flexible scheduling",
      href: "/contact",
    },
    {
      icon: Code,
      label: "Technical Focus",
      description: "Hands-on development and architecture",
      href: "/about#projects",
    },
  ];

  return (
    <Section
      id="about"
      title="About Me"
      subtitle="Self-taught infrastructure engineer who learned to automate production systems after breaking my home lab so often I learned to script the fixes."
      background="muted"
    >
      {/* Philosophy and Approach */}
      <div className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {principles.map((principle, index) => (
            <PrincipleCard key={index} {...principle} />
          ))}
        </div>
      </div>

      {/* Background Story */}
      <div className="mb-16">
        <div className="glass rounded-lg p-8 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">My Story</h3>
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>
                  I'm a self-taught infrastructure engineer who learned by doing
                  — and by breaking things. I once rebuilt a staging cluster 4
                  times in a week because a manual network setup left services
                  half-configured. That frustration led me to write the
                  Terraform modules that now run unattended for 10+ months.
                </p>
                <p>
                  My focus is on building{" "}
                  <strong className="text-foreground">
                    sane, repeatable infrastructure
                  </strong>
                  (Kubernetes, Terraform, OCI) and turning ad-hoc setups into
                  automated, testable systems. I hyper-focus on tricky debugging
                  sessions and spot odd failure modes others miss — a trait
                  that's served me well in production environments.
                </p>
                <p>
                  Today, I run 8+ self-hosted services with 99.9% uptime,
                  contribute to open source, and share knowledge through
                  comprehensive technical documentation. My work emphasizes
                  <strong className="text-foreground">
                    automation that you can trust
                  </strong>{" "}
                  and systems designed to be debugged at 3 AM.
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Current Focus</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium text-foreground">
                      Infrastructure as Code
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Automating Oracle Cloud deployments with Terraform; built
                      CloudCradle to reduce provisioning time from 3 hours to 12
                      minutes
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium text-foreground">
                      Production Systems
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Self-hosting 20+ services with automated health checks,
                      canary deployments, and self-healing via Traefik and
                      custom orchestration
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium text-foreground">
                      AI/ML Integration
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Building intelligent fallback systems for LLM APIs;
                      reduced costs by 35% through smart model selection
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Work Preferences */}
      <div className="mb-16">
        <h3 className="text-2xl font-semibold mb-8 text-center">
          Work Preferences
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {workPreferences.map((pref, index) => (
            <WorkPreferenceCard
              key={index}
              icon={pref.icon}
              label={pref.label}
              description={pref.description}
              href={pref.href}
            />
          ))}
        </div>
      </div>

      {/* Technical Skills */}
      <div className="mb-16">
        <h3 className="text-2xl font-semibold mb-8 text-center">
          Technical Stack
        </h3>
        {skillsLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="ml-3 text-sm text-muted-foreground">
              Loading skills from GitHub…
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {skills.map((skill) => (
              <SkillCard key={skill.name} skill={skill} />
            ))}
          </div>
        )}
      </div>

      {/* Availability */}
      <div className="text-center">
        <div className="glass rounded-lg p-8 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-400">
              Open to Opportunities
            </span>
          </div>
          <h3 className="text-2xl font-semibold mb-4">Let's Work Together</h3>
          <p className="text-muted-foreground mb-6">
            I'm seeking remote roles where I can design reliable systems,
            automate infrastructure, and solve challenging technical problems.
            Ideal fit: infrastructure engineer, platform engineer, or SRE role
            where I can reduce toil and improve system resilience.
            <span className="block mt-2">
              Typical onboarding contribution: identify and eliminate manual
              processes, saving teams hours per week and reducing incident
              frequency.
            </span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`mailto:${config.CONTACT_EMAIL}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              aria-label={`Send email to ${config.OWNER_NAME}`}
            >
              <MessageSquare className="h-4 w-4" aria-hidden="true" />
              Get in Touch
            </a>
            <a
              href={config.GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 glass hover:bg-white/10 transition-colors rounded-lg"
              aria-label={`Visit ${config.OWNER_NAME}'s GitHub profile (opens in new tab)`}
            >
              <Code className="h-4 w-4" aria-hidden="true" />
              View My Code
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}
