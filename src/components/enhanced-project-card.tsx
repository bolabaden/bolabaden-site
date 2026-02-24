"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Github,
  ExternalLink,
  Calendar,
  Star,
  GitFork,
  AlertCircle,
  TrendingUp,
  Eye,
  Scale,
  GitBranch,
  Archive,
  Users,
  GitCommit,
} from "lucide-react";
import { Project } from "@/lib/types";
import { EnhancedRepoStats } from "@/lib/github-enhanced";
import { getRelativeTime, formatDate } from "@/lib/config";
import { cn } from "@/lib/utils";
import { CommitGraph } from "./commit-graph";
import { MarkdownContent } from "./markdown-content";

interface EnhancedProjectCardProps {
  project: Project;
  featured?: boolean;
  githubStats?: EnhancedRepoStats | null;
  CategoryIcon: React.ComponentType<{ category: string }>;
  StatusBadge: React.ComponentType<{ status: Project["status"] }>;
}

/** Small clickable stat chip that links to a GitHub tab */
function StatLink({
  href,
  icon: Icon,
  label,
  title,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  title: string;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={title}
      className="inline-flex items-center gap-1 hover:text-primary transition-colors"
    >
      <Icon className="h-3 w-3" aria-hidden="true" />
      <span>{label}</span>
    </Link>
  );
}

/** Calculate language percentages from byte counts */
function calculateLanguagePercentages(languages: {
  [lang: string]: number;
}): Array<{ name: string; percentage: number; bytes: number }> {
  const entries = Object.entries(languages);
  const totalBytes = entries.reduce((sum, [_, bytes]) => sum + bytes, 0);

  return entries
    .map(([name, bytes]) => ({
      name,
      bytes,
      percentage: totalBytes > 0 ? (bytes / totalBytes) * 100 : 0,
    }))
    .sort((a, b) => b.bytes - a.bytes); // Sort by bytes descending
}

export function EnhancedProjectCard({
  project,
  featured = false,
  githubStats,
  CategoryIcon,
  StatusBadge,
}: EnhancedProjectCardProps) {
  const [showCommitGraph, setShowCommitGraph] = useState(false);

  // Primary link for the card header — prefer live URL, fall back to GitHub
  const primaryUrl = project.liveUrl || project.githubUrl;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setShowCommitGraph(true)}
      onHoverEnd={() => setShowCommitGraph(false)}
      className={cn(
        "glass rounded-lg p-6 hover:bg-white/5 transition-all duration-300 h-full flex flex-col relative overflow-hidden",
        featured && "border-2 border-primary/30",
      )}
    >
      {featured && (
        <div className="flex items-center gap-2 mb-4">
          <Star className="h-4 w-4 text-yellow-400" aria-hidden="true" />
          <span className="text-sm font-medium text-yellow-400">
            Featured Project
          </span>
        </div>
      )}

      {/* Clickable header */}
      <div className="flex items-start justify-between mb-4">
        <Link
          href={primaryUrl || "#"}
          target={primaryUrl ? "_blank" : undefined}
          rel={primaryUrl ? "noopener noreferrer" : undefined}
          className="flex items-center gap-3 group"
        >
          <div className="p-2 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-colors">
            <CategoryIcon category={project.category} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            <p className="text-xs text-muted-foreground">{project.category}</p>
          </div>
        </Link>
        <div className="flex flex-col items-end gap-2">
          <StatusBadge status={project.status} />
          {/* License badge */}
          {githubStats?.license && project.githubUrl && (
            <Link
              href={`${project.githubUrl}/blob/main/LICENSE`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded hover:bg-emerald-500/30 transition-colors"
              title={`Licensed under ${githubStats.license}`}
            >
              <Scale className="h-3 w-3" />
              {githubStats.license}
            </Link>
          )}
          {/* Repository status badges */}
          {githubStats?.isFork && (
            <div
              className="flex items-center gap-1 text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded"
              title="This is a forked repository"
            >
              <GitBranch className="h-3 w-3" />
              Fork
            </div>
          )}
          {githubStats?.isArchived && (
            <div
              className="flex items-center gap-1 text-xs bg-gray-500/20 text-gray-300 px-2 py-1 rounded"
              title="This repository is archived"
            >
              <Archive className="h-3 w-3" />
              Archived
            </div>
          )}
        </div>
      </div>

      {/* GitHub Stats Row — every stat is a clickable link */}
      {githubStats && project.githubUrl && (
        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
            {githubStats.stars > 0 && (
              <StatLink
                href={`${project.githubUrl}/stargazers`}
                icon={Star}
                label={`${githubStats.stars}`}
                title={`${githubStats.stars} stargazers — view on GitHub`}
              />
            )}
            {githubStats.forks > 0 && (
              <StatLink
                href={`${project.githubUrl}/forks`}
                icon={GitFork}
                label={`${githubStats.forks}`}
                title={`${githubStats.forks} forks — view on GitHub`}
              />
            )}
            {githubStats.totalCommits > 0 && (
              <StatLink
                href={`${project.githubUrl}/commits`}
                icon={GitCommit}
                label={`${githubStats.totalCommits} commits`}
                title={`${githubStats.totalCommits} total commits — view commit history`}
              />
            )}
            {githubStats.recentCommitsCount > 0 && (
              <StatLink
                href={`${project.githubUrl}/commits`}
                icon={TrendingUp}
                label={`${githubStats.recentCommitsCount}/mo`}
                title={`${githubStats.recentCommitsCount} commits in the last 30 days — view commit history`}
              />
            )}
            {githubStats.openIssues > 0 && (
              <StatLink
                href={`${project.githubUrl}/issues`}
                icon={AlertCircle}
                label={`${githubStats.openIssues}`}
                title={`${githubStats.openIssues} open issues — view on GitHub`}
              />
            )}
            {githubStats.contributorCount > 0 && (
              <StatLink
                href={`${project.githubUrl}/graphs/contributors`}
                icon={Users}
                label={`${githubStats.contributorCount} contributors`}
                title={`${githubStats.contributorCount} contributors — view contributor graph`}
              />
            )}
          </div>
          {/* Repository age */}
          {githubStats.createdAt && (
            <div className="text-xs text-muted-foreground/80 flex items-center gap-1">
              <Calendar className="h-3 w-3" aria-hidden="true" />
              Created {getRelativeTime(githubStats.createdAt)}
            </div>
          )}
        </div>
      )}

      {/* Commit Graph (shows on hover) */}
      <AnimatePresence>
        {showCommitGraph &&
          githubStats?.commitActivity &&
          githubStats.commitActivity.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mb-4"
            >
              <div className="text-xs text-muted-foreground mb-2">
                Commit activity
              </div>
              <CommitGraph
                data={githubStats.commitActivity}
                repoUrl={project.githubUrl}
              />
            </motion.div>
          )}
      </AnimatePresence>

      <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
        {project.description}
      </p>

      {project.longDescription && (
        <MarkdownContent
          content={project.longDescription}
          compact
          className="mb-4 text-muted-foreground/80"
        />
      )}

      {/* Language breakdown with visual bars */}
      {githubStats?.languages &&
        Object.keys(githubStats.languages).length > 0 && (
          <div className="mb-4">
            <div className="text-xs text-muted-foreground/80 mb-2 font-medium">
              Languages
            </div>
            <div className="space-y-2">
              {calculateLanguagePercentages(githubStats.languages)
                .slice(0, 5)
                .map((lang) => (
                  <div key={lang.name} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-foreground/90">{lang.name}</span>
                      <span className="text-muted-foreground">
                        {lang.percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-primary to-primary/60 h-full rounded-full transition-all duration-500"
                        style={{ width: `${lang.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

      {/* Contributors section */}
      {githubStats?.topContributors &&
        githubStats.topContributors.length > 0 &&
        project.githubUrl && (
          <div className="mb-4">
            <Link
              href={`${project.githubUrl}/graphs/contributors`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground/80 mb-2 font-medium hover:text-primary transition-colors inline-flex items-center gap-1"
            >
              Top Contributors
              <ExternalLink className="h-3 w-3" />
            </Link>
            <div className="flex items-center gap-2 mt-2">
              {githubStats.topContributors.slice(0, 5).map((contributor) => (
                <Link
                  key={contributor.login}
                  href={`https://github.com/${contributor.login}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative"
                  title={`${contributor.login} — ${contributor.contributions} contributions`}
                >
                  <Image
                    src={contributor.avatar_url}
                    alt={contributor.login}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full border-2 border-white/10 group-hover:border-primary/50 transition-all group-hover:scale-110"
                    unoptimized
                  />
                  <div className="absolute -bottom-1 -right-1 bg-primary/20 text-primary text-[9px] px-1 rounded-full border border-primary/30 font-bold">
                    {contributor.contributions}
                  </div>
                </Link>
              ))}
              {githubStats.contributorCount > 5 && (
                <Link
                  href={`${project.githubUrl}/graphs/contributors`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  +{githubStats.contributorCount - 5} more
                </Link>
              )}
            </div>
          </div>
        )}

      {/* GitHub topics */}
      {githubStats?.topics && githubStats.topics.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {githubStats.topics.slice(0, 5).map((topic) => (
            <Link
              key={topic}
              href={`https://github.com/topics/${topic}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded hover:bg-purple-500/30 transition-colors"
            >
              {topic}
            </Link>
          ))}
        </div>
      )}

      {/* Technology stack (static) */}
      <div className="flex flex-wrap gap-1 mb-4">
        {project.technologies.map((tech) => (
          <span
            key={tech}
            className="text-xs bg-primary/20 text-primary px-2 py-1 rounded"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Date info — clickable to commits */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
        {project.githubUrl ? (
          <Link
            href={`${project.githubUrl}/commits`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-primary transition-colors"
            title="View commit history"
          >
            <Calendar className="h-3 w-3" aria-hidden="true" />
            <span title={formatDate(project.updatedAt, "long")}>
              Updated {getRelativeTime(project.updatedAt)}
            </span>
          </Link>
        ) : (
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" aria-hidden="true" />
            <span title={formatDate(project.updatedAt, "long")}>
              Updated {getRelativeTime(project.updatedAt)}
            </span>
          </div>
        )}
        {githubStats?.lastPush && project.githubUrl && (
          <Link
            href={`${project.githubUrl}/commits`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-primary transition-colors"
            title="View commit history"
          >
            <Eye className="h-3 w-3" aria-hidden="true" />
            <span title={formatDate(githubStats.lastPush, "long")}>
              Last push {getRelativeTime(githubStats.lastPush)}
            </span>
          </Link>
        )}
      </div>

      {/* Links */}
      <div className="mt-auto flex items-center gap-3">
        {project.githubUrl && (
          <Link
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium text-sm"
            aria-label={`View ${project.title} source code on GitHub (opens in new tab)`}
          >
            <Github className="h-4 w-4" aria-hidden="true" />
            View Code
          </Link>
        )}
        {project.liveUrl && (
          <Link
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium text-sm"
            aria-label={`Visit ${project.title} live demo (opens in new tab)`}
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            Live Demo
          </Link>
        )}
      </div>
    </motion.div>
  );
}
