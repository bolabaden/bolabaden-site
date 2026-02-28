"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Github,
  GitPullRequest,
  GitMerge,
  AlertCircle,
  Star,
  GitFork,
  Users,
  Code,
  Eye,
  Calendar,
  TrendingUp,
  BookOpen,
  Building,
  Activity,
  CheckCircle,
  Clock,
  MessageSquare,
  Zap,
  ExternalLink,
  GitBranch,
  Globe,
  Mail,
  MapPin,
  Hash,
} from "lucide-react";
import { Section } from "./section";
import { config } from "@/lib/config";
import { cn } from "@/lib/utils";
import type {
  GitHubComprehensiveStats,
  ContributionDay,
  GitHubPRItem,
  GitHubIssueItem,
} from "@/lib/github-profile";

// ──────────────────────────────────────────────────────────────────────────────
// Small helpers
// ──────────────────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

function reltime(iso: string | null | undefined): string {
  if (!iso) return "unknown";
  const ms = new Date(iso).getTime();
  if (isNaN(ms)) return "unknown";
  const diff = Date.now() - ms;
  const d = Math.floor(diff / 86_400_000);
  if (d === 0) return "today";
  if (d === 1) return "yesterday";
  if (d < 30) return `${d}d ago`;
  if (d < 365) return `${Math.floor(d / 30)}mo ago`;
  return `${Math.floor(d / 365)}y ago`;
}

const levelColors: Record<number, string> = {
  0: "bg-white/5",
  1: "bg-primary/20",
  2: "bg-primary/40",
  3: "bg-primary/70",
  4: "bg-primary",
};

const eventLabels: Record<
  string,
  { label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  PushEvent: { label: "Pushes", icon: Zap },
  PullRequestEvent: { label: "Pull Requests", icon: GitPullRequest },
  IssuesEvent: { label: "Issues", icon: AlertCircle },
  IssueCommentEvent: { label: "Comments", icon: MessageSquare },
  CreateEvent: { label: "Branches/Tags", icon: GitBranch },
  ForkEvent: { label: "Forks", icon: GitFork },
  WatchEvent: { label: "Stars Given", icon: Star },
  PullRequestReviewEvent: { label: "PR Reviews", icon: Eye },
  CommitCommentEvent: { label: "Commit Comments", icon: MessageSquare },
  DeleteEvent: { label: "Deletions", icon: Hash },
  GollumEvent: { label: "Wiki Edits", icon: BookOpen },
  ReleaseEvent: { label: "Releases", icon: CheckCircle },
};

// ──────────────────────────────────────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  href,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  accent?: string;
}) {
  const inner = (
    <div
      className={cn(
        "glass rounded-xl p-5 flex flex-col gap-2 hover:bg-white/5 transition-all duration-200 h-full",
        href && "cursor-pointer group",
      )}
    >
      <div className="flex items-center justify-between">
        <div className={cn("p-2 rounded-lg", accent ?? "bg-primary/20")}>
          <Icon
            className={cn("h-4 w-4", accent ? "text-white" : "text-primary")}
          />
        </div>
        {href && (
          <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
        )}
      </div>
      <div className="text-2xl font-bold text-foreground tabular-nums">
        {value}
      </div>
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      {sub && <div className="text-xs text-muted-foreground/70">{sub}</div>}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full"
      >
        {inner}
      </Link>
    );
  }
  return inner;
}

function ContributionGrid({ weeks }: { weeks: { days: ContributionDay[] }[] }) {
  const monthByWeek = new Map<number, string>();

  let currentMonth = "";
  weeks.forEach((week, wi) => {
    const firstDay = week.days[0];
    if (firstDay) {
      const m = new Date(firstDay.date + "T12:00:00").toLocaleString("en", {
        month: "short",
      });
      if (m !== currentMonth) {
        currentMonth = m;
        monthByWeek.set(wi, m);
      }
    }
  });

  return (
    <div className="overflow-x-auto pb-2">
      <div className="inline-flex flex-col gap-0.5 min-w-max">
        <div className="flex gap-0.5 h-4 mb-1">
          {weeks.map((_, wi) => {
            const monthLabel = monthByWeek.get(wi);

            return (
              <div key={`month-${wi}`} className="w-3 relative shrink-0">
                {monthLabel && (
                  <span className="absolute left-0 top-0 text-xs text-muted-foreground whitespace-nowrap">
                    {monthLabel}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Grid */}
        <div className="flex gap-0.5">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-0.5">
              {week.days.map((day) => (
                <div
                  key={day.date}
                  className={cn(
                    "w-3 h-3 rounded-sm transition-all",
                    levelColors[day.level],
                  )}
                  title={`${day.date}: ${day.count} contribution${day.count !== 1 ? "s" : ""}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PRItem({ pr, username }: { pr: GitHubPRItem; username: string }) {
  return (
    <Link
      href={pr.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group"
    >
      <div
        className={cn(
          "mt-0.5 p-1.5 rounded-full shrink-0",
          pr.merged_at
            ? "bg-purple-500/20"
            : pr.state === "open"
              ? "bg-green-500/20"
              : "bg-red-500/20",
        )}
      >
        {pr.merged_at ? (
          <GitMerge className="h-3 w-3 text-purple-400" />
        ) : pr.state === "open" ? (
          <GitPullRequest className="h-3 w-3 text-green-400" />
        ) : (
          <GitPullRequest className="h-3 w-3 text-red-400" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {pr.title}
        </div>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className="text-xs text-muted-foreground">
            {pr.repoFullName}
          </span>
          {pr.isExternal && (
            <span className="text-xs bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded">
              external
            </span>
          )}
          <span className="text-xs text-muted-foreground">
            {reltime(pr.created_at)}
          </span>
        </div>
      </div>
    </Link>
  );
}

function IssueItem({ issue }: { issue: GitHubIssueItem }) {
  return (
    <Link
      href={issue.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group"
    >
      <div
        className={cn(
          "mt-0.5 p-1.5 rounded-full shrink-0",
          issue.state === "open" ? "bg-green-500/20" : "bg-purple-500/20",
        )}
      >
        <AlertCircle
          className={cn(
            "h-3 w-3",
            issue.state === "open" ? "text-green-400" : "text-purple-400",
          )}
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {issue.title}
        </div>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className="text-xs text-muted-foreground">
            {issue.repoFullName}
          </span>
          {issue.isExternal && (
            <span className="text-xs bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded">
              external
            </span>
          )}
          {issue.comments > 0 && (
            <span className="text-xs text-muted-foreground flex items-center gap-0.5">
              <MessageSquare className="h-2.5 w-2.5" />
              {issue.comments}
            </span>
          )}
          {issue.reactions > 0 && (
            <span className="text-xs text-muted-foreground">
              👍 {issue.reactions}
            </span>
          )}
          <span className="text-xs text-muted-foreground">
            {reltime(issue.created_at)}
          </span>
        </div>
      </div>
    </Link>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Main section
// ──────────────────────────────────────────────────────────────────────────────

export function GitHubStatsSection() {
  const username = config.GITHUB_OWNER;
  const [stats, setStats] = useState<GitHubComprehensiveStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prTab, setPrTab] = useState<"all" | "external">("all");
  const [issueTab, setIssueTab] = useState<"all" | "external">("all");

  useEffect(() => {
    fetch(`/api/github/${username}/stats`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(setStats)
      .catch((e) => setError(`GitHub stats unavailable (${e})`))
      .finally(() => setLoading(false));
  }, [username]);

  const profileUrl = `https://github.com/${username}`;

  return (
    <Section
      id="github-stats"
      title="GitHub Activity"
      subtitle={`Real-time metrics pulled live from GitHub — every PR, issue, review, and commit tracked publicly`}
      background="muted"
    >
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="ml-3 text-muted-foreground">
            Loading GitHub statistics…
          </span>
        </div>
      )}

      {error && (
        <div className="text-center py-16 text-muted-foreground">
          <Github className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>{error}</p>
          <Link
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            View on GitHub <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      )}

      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-8"
        >
          {/* ── Profile Header ── */}
          <div className="glass rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <Link href={profileUrl} target="_blank" rel="noopener noreferrer">
                <Image
                  src={stats.profile.avatar_url}
                  alt={stats.profile.name ?? username}
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-full border-4 border-primary/30 hover:border-primary/60 transition-colors"
                  unoptimized
                />
              </Link>

              <div className="flex-1 min-w-0 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row items-center sm:items-end gap-3 mb-2">
                  <Link
                    href={profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-2xl font-bold text-foreground hover:text-primary transition-colors"
                  >
                    {stats.profile.name ?? username}
                  </Link>
                  <span className="text-muted-foreground text-sm">
                    @{username}
                  </span>
                </div>

                {stats.profile.bio && (
                  <p className="text-muted-foreground text-sm mb-3 max-w-xl">
                    {stats.profile.bio}
                  </p>
                )}

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground justify-center sm:justify-start">
                  {stats.profile.company && (
                    <span className="flex items-center gap-1">
                      <Building className="h-3.5 w-3.5" />
                      {stats.profile.company}
                    </span>
                  )}
                  {stats.profile.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {stats.profile.location}
                    </span>
                  )}
                  {stats.profile.email && (
                    <Link
                      href={`mailto:${stats.profile.email}`}
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      {stats.profile.email}
                    </Link>
                  )}
                  {stats.profile.blog && (
                    <Link
                      href={
                        stats.profile.blog.startsWith("http")
                          ? stats.profile.blog
                          : `https://${stats.profile.blog}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                      <Globe className="h-3.5 w-3.5" />
                      {stats.profile.blog}
                    </Link>
                  )}
                  {stats.profile.twitter_username && (
                    <Link
                      href={`https://twitter.com/${stats.profile.twitter_username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                      <Hash className="h-3.5 w-3.5" />@
                      {stats.profile.twitter_username}
                    </Link>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Joined {new Date(stats.profile.created_at).getFullYear()}
                  </span>
                </div>

                {/* Follower / Following row */}
                <div className="flex gap-4 mt-3 justify-center sm:justify-start">
                  <Link
                    href={`${profileUrl}?tab=followers`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:text-primary transition-colors"
                  >
                    <span className="font-semibold text-foreground">
                      {fmt(stats.profile.followers)}
                    </span>
                    <span className="text-muted-foreground ml-1">
                      followers
                    </span>
                  </Link>
                  <Link
                    href={`${profileUrl}?tab=following`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:text-primary transition-colors"
                  >
                    <span className="font-semibold text-foreground">
                      {fmt(stats.profile.following)}
                    </span>
                    <span className="text-muted-foreground ml-1">
                      following
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ── Big Numbers ── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
            <StatCard
              label="Total Repos"
              value={fmt(stats.repoSummary.totalRepos)}
              icon={BookOpen}
              href={`${profileUrl}?tab=repositories`}
            />
            <StatCard
              label="Stars Received"
              value={fmt(stats.repoSummary.totalStarsReceived)}
              sub={
                stats.repoSummary.mostStarredRepo
                  ? `★ ${stats.repoSummary.mostStarredRepo.stars} — ${stats.repoSummary.mostStarredRepo.name.split("/")[1]}`
                  : undefined
              }
              icon={Star}
              href={`${profileUrl}?tab=stars`}
            />
            <StatCard
              label="Forks Received"
              value={fmt(stats.repoSummary.totalForksReceived)}
              sub={
                stats.repoSummary.mostForkedRepo
                  ? `⑂ ${stats.repoSummary.mostForkedRepo.forks} — ${stats.repoSummary.mostForkedRepo.name.split("/")[1]}`
                  : undefined
              }
              icon={GitFork}
              href={profileUrl}
            />
            <StatCard
              label="PRs Opened"
              value={fmt(stats.prStats.total)}
              sub={`${fmt(stats.prStats.merged)} merged · ${fmt(stats.prStats.toExternalRepos)} to external repos`}
              icon={GitPullRequest}
              href={`https://github.com/pulls?q=author%3A${username}`}
            />
            <StatCard
              label="Issues Opened"
              value={fmt(stats.issueStats.total)}
              sub={`${fmt(stats.issueStats.toExternalRepos)} to external repos`}
              icon={AlertCircle}
              href={`https://github.com/issues?q=author%3A${username}`}
            />
            <StatCard
              label="PR Reviews"
              value={fmt(stats.reviewStats.total)}
              sub={`across ${stats.reviewStats.reposReviewed.length} repos`}
              icon={Eye}
              href={`https://github.com/pulls?q=reviewed-by%3A${username}`}
            />
            <StatCard
              label="Followers"
              value={fmt(stats.profile.followers)}
              icon={Users}
              href={`${profileUrl}?tab=followers`}
            />
            <StatCard
              label="Open Source Repos"
              value={fmt(stats.repoSummary.openSourceRepos)}
              sub={`${stats.repoSummary.forkedRepos} forked · ${stats.repoSummary.archivedRepos} archived`}
              icon={Github}
              href={`${profileUrl}?tab=repositories`}
            />
            <StatCard
              label="Repos Contributed To"
              value={fmt(
                stats.prStats.reposContributedTo.length +
                  stats.issueStats.reposFiledIn.length,
              )}
              sub="via PRs + issues"
              icon={Code}
              href={`https://github.com/pulls?q=author%3A${username}`}
            />
            <StatCard
              label="Active Days"
              value={stats.activity.activeDays}
              sub="in last 90 days"
              icon={TrendingUp}
              href={profileUrl}
            />
            {stats.contributions && (
              <StatCard
                label="Contributions"
                value={fmt(stats.contributions.totalContributions)}
                sub="this year"
                icon={Activity}
                href={profileUrl}
              />
            )}
            <StatCard
              label="Organizations"
              value={stats.orgs.length}
              icon={Building}
              href={profileUrl}
            />
          </div>

          {/* ── Contribution Calendar ── */}
          {stats.contributions && (
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Contribution Activity
                </h3>
                <Link
                  href={profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  {fmt(stats.contributions.totalContributions)} this year{" "}
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
              <ContributionGrid weeks={stats.contributions.weeks} />
              <div className="flex items-center gap-2 mt-3 justify-end text-xs text-muted-foreground">
                <span>Less</span>
                {[0, 1, 2, 3, 4].map((l) => (
                  <div
                    key={l}
                    className={cn("w-3 h-3 rounded-sm", levelColors[l])}
                  />
                ))}
                <span>More</span>
              </div>
            </div>
          )}

          {/* ── 2-column: PRs + Issues ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pull Requests */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <GitPullRequest className="h-5 w-5 text-primary" />
                  Pull Requests
                </h3>
                <Link
                  href={`https://github.com/pulls?q=author%3A${username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  view all <ExternalLink className="h-3 w-3" />
                </Link>
              </div>

              {/* PR stats pills */}
              <div className="flex flex-wrap gap-2 mb-4 text-xs">
                <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                  {fmt(stats.prStats.merged)} merged
                </span>
                <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded">
                  {fmt(stats.prStats.open)} open
                </span>
                <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                  {fmt(stats.prStats.toExternalRepos)} to external repos
                </span>
                <span className="bg-white/10 text-muted-foreground px-2 py-1 rounded">
                  {stats.prStats.reposContributedTo.length} repos
                </span>
              </div>

              {/* Tab toggle */}
              <div className="flex gap-2 mb-3">
                {(["all", "external"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setPrTab(t)}
                    className={cn(
                      "px-3 py-1 text-xs rounded-lg font-medium transition-colors",
                      prTab === t
                        ? "bg-primary/20 text-primary"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {t === "all" ? "All PRs" : "External Only"}
                  </button>
                ))}
              </div>

              <div className="space-y-0.5 max-h-72 overflow-y-auto">
                {(prTab === "all"
                  ? stats.prStats.recent
                  : stats.prStats.recent.filter((p) => p.isExternal)
                ).map((pr, i) => (
                  <PRItem key={i} pr={pr} username={username} />
                ))}
                {stats.prStats.recent.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    No recent PRs found
                  </p>
                )}
              </div>
            </div>

            {/* Issues */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  Issues Submitted
                </h3>
                <Link
                  href={`https://github.com/issues?q=author%3A${username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  view all <ExternalLink className="h-3 w-3" />
                </Link>
              </div>

              <div className="flex flex-wrap gap-2 mb-4 text-xs">
                <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded">
                  {fmt(stats.issueStats.open)} open
                </span>
                <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                  {fmt(stats.issueStats.closed)} closed
                </span>
                <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                  {fmt(stats.issueStats.toExternalRepos)} to external repos
                </span>
                <span className="bg-white/10 text-muted-foreground px-2 py-1 rounded">
                  {stats.issueStats.reposFiledIn.length} repos
                </span>
              </div>

              <div className="flex gap-2 mb-3">
                {(["all", "external"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setIssueTab(t)}
                    className={cn(
                      "px-3 py-1 text-xs rounded-lg font-medium transition-colors",
                      issueTab === t
                        ? "bg-primary/20 text-primary"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {t === "all" ? "All Issues" : "External Only"}
                  </button>
                ))}
              </div>

              <div className="space-y-0.5 max-h-72 overflow-y-auto">
                {(issueTab === "all"
                  ? stats.issueStats.recent
                  : stats.issueStats.recent.filter((i) => i.isExternal)
                ).map((issue, i) => (
                  <IssueItem key={i} issue={issue} />
                ))}
                {stats.issueStats.recent.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    No recent issues found
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ── 2-column: Languages + Activity Breakdown ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Language Breakdown */}
            {stats.repoSummary.topLanguages.length > 0 && (
              <div className="glass rounded-2xl p-6">
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-5">
                  <Code className="h-5 w-5 text-primary" />
                  Languages Across All Repos
                </h3>
                <div className="space-y-3">
                  {stats.repoSummary.topLanguages.map((lang) => (
                    <div key={lang.name} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground font-medium">
                          {lang.name}
                        </span>
                        <span className="text-muted-foreground">
                          {lang.percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                        <progress
                          className={cn(
                            "github-progress-bar",
                            "github-language-progress",
                          )}
                          max={100}
                          value={Math.max(0, Math.min(100, lang.percentage))}
                          aria-label={`${lang.name} usage ${lang.percentage}%`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Event type breakdown */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-5">
                <Zap className="h-5 w-5 text-primary" />
                Recent Activity Breakdown
                <span className="text-xs text-muted-foreground font-normal ml-auto">
                  last 90 days
                </span>
              </h3>
              <div className="space-y-2">
                {Object.entries(stats.activity.eventTypes)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 10)
                  .map(([type, count]) => {
                    const cfg = eventLabels[type];
                    const Icon = cfg?.icon ?? Activity;
                    const total = Object.values(
                      stats.activity.eventTypes,
                    ).reduce((a, b) => a + b, 0);
                    const pct = total > 0 ? (count / total) * 100 : 0;
                    return (
                      <div key={type} className="flex items-center gap-3">
                        <div className="p-1.5 bg-primary/20 rounded">
                          <Icon className="h-3 w-3 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between text-xs mb-0.5">
                            <span className="text-foreground">
                              {cfg?.label ?? type.replace("Event", "")}
                            </span>
                            <span className="text-muted-foreground font-medium">
                              {count}
                            </span>
                          </div>
                          <div className="w-full bg-white/5 rounded-full h-1.5">
                            <progress
                              className={cn(
                                "github-progress-bar",
                                "github-activity-progress",
                              )}
                              max={100}
                              value={Math.max(0, Math.min(100, pct))}
                              aria-label={`${cfg?.label ?? type} ${pct.toFixed(1)}%`}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
              {stats.activity.mostActiveRepo && (
                <div className="mt-4 pt-4 border-t border-white/10 text-xs text-muted-foreground flex items-center justify-between">
                  <span>Most active repo:</span>
                  <Link
                    href={`https://github.com/${stats.activity.mostActiveRepo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 transition-colors font-medium flex items-center gap-1"
                  >
                    {stats.activity.mostActiveRepo}{" "}
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* ── Organizations ── */}
          {stats.orgs.length > 0 && (
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-5">
                <Building className="h-5 w-5 text-primary" />
                Organizations
              </h3>
              <div className="flex flex-wrap gap-4">
                {stats.orgs.map((org) => (
                  <Link
                    key={org.login}
                    href={org.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 glass rounded-xl p-3 hover:bg-white/10 transition-all group"
                  >
                    <Image
                      src={org.avatar_url}
                      alt={org.login}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-lg border border-white/10 group-hover:border-primary/40 transition-colors"
                      unoptimized
                    />
                    <div>
                      <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                        {org.login}
                      </div>
                      {org.description && (
                        <div className="text-xs text-muted-foreground line-clamp-1 max-w-40">
                          {org.description}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* ── PR Review Activity ── */}
          {stats.reviewStats.total > 0 && (
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  PR Reviews Given
                </h3>
                <div className="flex gap-2 text-xs">
                  <span className="bg-primary/20 text-primary px-2 py-1 rounded">
                    {fmt(stats.reviewStats.total)} total
                  </span>
                  <span className="bg-white/10 text-muted-foreground px-2 py-1 rounded">
                    {stats.reviewStats.reposReviewed.length} repos
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {stats.reviewStats.recent.slice(0, 10).map((rev, i) => (
                  <Link
                    key={i}
                    href={rev.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors group text-xs"
                  >
                    <CheckCircle className="h-3.5 w-3.5 text-primary shrink-0" />
                    <div className="min-w-0">
                      <div className="text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {rev.title}
                      </div>
                      <div className="text-muted-foreground">
                        {rev.repoFullName}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* ── Recent Event Feed ── */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Recent Public Events
              </h3>
              <Link
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
              >
                GitHub profile <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {stats.activity.recentEvents.map((evt, i) => {
                const cfg = eventLabels[evt.type];
                const Icon = cfg?.icon ?? Activity;
                const repoName = evt.repo?.name ?? "";
                const repoUrl = `https://github.com/${repoName}`;
                return (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <div className="mt-0.5 p-1.5 bg-primary/10 rounded shrink-0">
                      <Icon className="h-3 w-3 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1 text-xs">
                      <span className="text-muted-foreground">
                        {cfg?.label ?? evt.type.replace("Event", "")}
                      </span>
                      {" in "}
                      <Link
                        href={repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground hover:text-primary transition-colors font-medium"
                      >
                        {repoName}
                      </Link>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {reltime(evt.created_at)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-muted-foreground">
            Data fetched live from GitHub API · Last updated:{" "}
            {new Date(stats.fetchedAt).toLocaleTimeString()} ·{" "}
            <Link
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              github.com/{username}
            </Link>
          </div>
        </motion.div>
      )}
    </Section>
  );
}
