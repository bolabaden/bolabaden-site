import { NextResponse } from "next/server";
import {
  EnhancedGitHubRepo,
  fetchAllUserRepos,
  fetchLanguageStats,
} from "@/lib/github-enhanced";
import { config } from "@/lib/config";
import { TechStack } from "@/lib/types";
import {
  applyEvidenceSignals,
  collectRepositoryEvidence,
  collectSignalsByLanguage,
  evidenceConfidenceScore,
  extractLanguagesFromSignals,
  initializeLanguageEvidenceAggregate,
  mergeCategoryFromEvidence,
  normalizeEvidencePolicy,
  scorePenaltyFromContextSignals,
  summarizeEvidenceHighlights,
  type LanguageEvidenceAggregate,
} from "@/lib/skills-evidence";

const DAY_MS = 24 * 60 * 60 * 1000;
const MONTH_MS = 30.44 * DAY_MS;
const YEAR_MS = 365.25 * DAY_MS;

const MODEL_VERSION = "skills-v4.0.0";
const MAX_USERS = 20;
const MAX_LIMIT = 100;
const MAX_REPOS_FAST = 0;
const MAX_REPOS_BALANCED = 40;
const MAX_REPOS_DETAILED = 120;
const DEFAULT_LIMIT = 20;
const DEFAULT_TOP_REPOS_PER_SKILL = 12;

type AccuracyMode = "fast" | "balanced" | "detailed";
type CalibrationMode = "strict" | "balanced" | "lenient";

type RepoLanguageSource = "detailed" | "primary-fallback";

interface ParsedParams {
  users: string[];
  limit: number;
  accuracy: AccuracyMode;
  calibration: CalibrationMode;
  includeForks: boolean;
  includeArchived: boolean;
  minRepoSizeKb: number;
  minLanguageBytes: number;
  diagnostics: boolean;
  maxRepos: number;
  maxReposPerSkill: number;
  includeDisabled: boolean;
  includePrivate: boolean;
  includeTopicSignals: boolean;
  includeTextSignals: boolean;
  includeLicenseSignals: boolean;
  minEvidenceSignalScore: number;
  maxEvidenceSignalsPerRepo: number;
  includeEvidenceNarrative: boolean;
}

interface RepoSnapshot {
  owner: string;
  fullName: string;
  name: string;
  url: string;
  description: string | null;
  createdAt: string;
  pushedAt: string;
  updatedAt: string;
  stargazers: number;
  forks: number;
  watchers: number;
  sizeKb: number;
  defaultPrimaryLanguage: string | null;
  topicsCount: number;
  isFork: boolean;
  isArchived: boolean;
  isPrivate: boolean;
  isDisabled: boolean;
  isDetailedLanguageData: boolean;
  languageSource: RepoLanguageSource;
  languageBytes: Record<string, number>;
  totalLanguageBytes: number;
  topics: string[];
  hasWiki: boolean;
  hasPages: boolean;
}

interface LanguageRepositoryLink {
  name: string;
  fullName: string;
  url: string;
  pushedAt: string;
  createdAt: string;
  bytes: number;
  shareInRepo: number;
  isPrimary: boolean;
  stargazers: number;
  forks: number;
  watchers: number;
  recencyWeight: number;
  contributionWeight: number;
  owner: string;
}

interface LanguageAggregate {
  canonicalName: string;
  category: TechStack["category"];
  aliases: Set<string>;
  totalBytes: number;
  weightedBytes: number;
  primaryBytes: number;
  secondaryBytes: number;
  repoCount: number;
  primaryRepoCount: number;
  secondaryRepoCount: number;
  recentRepoCount: number;
  activeMonths: Set<string>;
  firstSeenMs: number;
  lastSeenMs: number;
  ownerSet: Set<string>;
  weightedRecency: number;
  weightedPopularity: number;
  weightedBreadth: number;
  weightedContinuity: number;
  weightedConfidenceEvidence: number;
  records: LanguageRepositoryLink[];
  evidence: LanguageEvidenceAggregate;
}

interface SkillComputation {
  skill: TechStack;
  rankScore: number;
  confidence: number;
  activityScore: number;
  intensityScore: number;
  breadthScore: number;
  recencyScore: number;
  continuityScore: number;
  shareScore: number;
  popularityScore: number;
  qualityScore: number;
  evidenceScore: number;
  evidenceSummary: string[];
  weightedBytes: number;
  totalBytes: number;
}

interface ModelDiagnostics {
  warnings: string[];
  usersQueried: number;
  reposFetched: number;
  reposConsidered: number;
  reposWithDetailedLanguages: number;
  reposWithFallbackLanguages: number;
  languageSignals: number;
  executionMs: number;
  selectedAccuracy: AccuracyMode;
  selectedCalibration: CalibrationMode;
  evidenceSignals: number;
  evidenceSignalsBySource: Record<string, number>;
}

interface CalibrationProfile {
  rankWeight: number;
  confidenceWeight: number;
  yearBlendTemporal: number;
  yearBlendActivity: number;
  yearConfidenceLift: number;
  expert: {
    minRank: number;
    minConfidence: number;
    minYears: number;
    minRepos: number;
    minActiveMonths: number;
  };
  advanced: {
    minRank: number;
    minConfidence: number;
    minYears: number;
    minRepos: number;
    minActiveMonths: number;
  };
  intermediate: {
    minRank: number;
    minConfidence: number;
    minYears: number;
  };
}

const CALIBRATION_PROFILES: Record<CalibrationMode, CalibrationProfile> = {
  strict: {
    rankWeight: 0.68,
    confidenceWeight: 0.32,
    yearBlendTemporal: 0.58,
    yearBlendActivity: 0.42,
    yearConfidenceLift: 0.08,
    expert: {
      minRank: 0.86,
      minConfidence: 0.72,
      minYears: 5,
      minRepos: 4,
      minActiveMonths: 24,
    },
    advanced: {
      minRank: 0.7,
      minConfidence: 0.58,
      minYears: 2.3,
      minRepos: 2,
      minActiveMonths: 10,
    },
    intermediate: {
      minRank: 0.46,
      minConfidence: 0.34,
      minYears: 0.9,
    },
  },
  balanced: {
    rankWeight: 0.72,
    confidenceWeight: 0.28,
    yearBlendTemporal: 0.65,
    yearBlendActivity: 0.35,
    yearConfidenceLift: 0.1,
    expert: {
      minRank: 0.8,
      minConfidence: 0.64,
      minYears: 4,
      minRepos: 3,
      minActiveMonths: 18,
    },
    advanced: {
      minRank: 0.62,
      minConfidence: 0.5,
      minYears: 2,
      minRepos: 2,
      minActiveMonths: 8,
    },
    intermediate: {
      minRank: 0.38,
      minConfidence: 0.28,
      minYears: 0.8,
    },
  },
  lenient: {
    rankWeight: 0.77,
    confidenceWeight: 0.23,
    yearBlendTemporal: 0.7,
    yearBlendActivity: 0.3,
    yearConfidenceLift: 0.12,
    expert: {
      minRank: 0.76,
      minConfidence: 0.54,
      minYears: 3,
      minRepos: 2,
      minActiveMonths: 12,
    },
    advanced: {
      minRank: 0.56,
      minConfidence: 0.42,
      minYears: 1.6,
      minRepos: 1,
      minActiveMonths: 6,
    },
    intermediate: {
      minRank: 0.34,
      minConfidence: 0.2,
      minYears: 0.6,
    },
  },
};

const CATEGORY_MAP: Record<string, TechStack["category"]> = {
  typescript: "frontend",
  javascript: "frontend",
  html: "frontend",
  css: "frontend",
  scss: "frontend",
  sass: "frontend",
  less: "frontend",
  stylus: "frontend",
  vue: "frontend",
  svelte: "frontend",
  astro: "frontend",
  handlebars: "frontend",
  pug: "frontend",

  python: "backend",
  go: "backend",
  rust: "backend",
  java: "backend",
  "c#": "backend",
  csharp: "backend",
  ruby: "backend",
  php: "backend",
  kotlin: "backend",
  swift: "backend",
  c: "backend",
  "c++": "backend",
  cpp: "backend",
  zig: "backend",
  elixir: "backend",
  erlang: "backend",
  haskell: "backend",
  scala: "backend",
  ocaml: "backend",
  dart: "backend",
  lua: "backend",

  hcl: "infrastructure",
  terraform: "infrastructure",
  ansible: "infrastructure",
  helm: "infrastructure",
  nomad: "infrastructure",
  bicep: "infrastructure",
  pulumi: "infrastructure",

  shell: "devops",
  bash: "devops",
  zsh: "devops",
  dockerfile: "devops",
  makefile: "devops",
  nix: "devops",
  powershell: "devops",
  batchfile: "devops",
  yaml: "devops",
  yml: "devops",

  sql: "database",
  plpgsql: "database",
  plsql: "database",
  postgresql: "database",

  jupyter: "ai-ml",
  "jupyter notebook": "ai-ml",
  cuda: "ai-ml",
};

const LANGUAGE_ALIASES: Record<string, string> = {
  js: "JavaScript",
  javascript: "JavaScript",
  ts: "TypeScript",
  typescript: "TypeScript",
  py: "Python",
  python: "Python",
  golang: "Go",
  go: "Go",
  shell: "Shell",
  bash: "Shell",
  sh: "Shell",
  "c#": "C#",
  csharp: "C#",
  "c++": "C++",
  cpp: "C++",
  ps1: "PowerShell",
  powershell: "PowerShell",
  yml: "YAML",
  yaml: "YAML",
  mdx: "MDX",
  markdown: "Markdown",
  hcl: "HCL",
  terraform: "HCL",
  dockerfile: "Dockerfile",
  makefile: "Makefile",
  "jupyter notebook": "Jupyter",
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round(value: number, digits: number = 3): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function formatPercent(value: number): number {
  return Math.round(clamp(value, 0, 1) * 100);
}

function buildSkillNarrative(input: {
  language: string;
  repositories: number;
  owners: number;
  primarySharePct: number;
  activityScorePct: number;
  evidenceConfidencePct: number;
}): string {
  const repoText = `${input.repositories} repo${input.repositories === 1 ? "" : "s"}`;
  const ownerText = `${input.owners} owner${input.owners === 1 ? "" : "s"}`;

  return `${input.language} appears in ${repoText} across ${ownerText}, with ${input.primarySharePct}% primary-language share, ${input.activityScorePct}% activity, and ${input.evidenceConfidencePct}% evidence confidence.`;
}

function parsePositiveInt(
  value: string | null,
  fallback: number,
  max: number,
): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(parsed, max);
}

function parseNonNegativeInt(
  value: string | null,
  fallback: number,
  max: number,
): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 0) return fallback;
  return Math.min(parsed, max);
}

function parseBoolean(value: string | null, fallback: boolean): boolean {
  if (value === null) return fallback;
  const normalized = value.trim().toLowerCase();
  if (["1", "true", "yes", "on"].includes(normalized)) return true;
  if (["0", "false", "no", "off"].includes(normalized)) return false;
  return fallback;
}

function parseCsvUsers(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((user) => user.trim())
    .filter(Boolean)
    .filter((user, index, all) => all.indexOf(user) === index)
    .slice(0, MAX_USERS);
}

function parseAccuracy(value: string | null): AccuracyMode {
  const normalized = (value || "").trim().toLowerCase();
  if (normalized === "fast") return "fast";
  if (normalized === "detailed") return "detailed";
  return "balanced";
}

function parseCalibration(value: string | null): CalibrationMode {
  const normalized = (value || "").trim().toLowerCase();
  if (normalized === "lenient") return "lenient";
  if (normalized === "balanced") return "balanced";
  return "balanced";
}

function parseRequestParams(request: Request): ParsedParams {
  const { searchParams } = new URL(request.url);

  const users = parseCsvUsers(searchParams.get("users"));
  const accuracy = parseAccuracy(searchParams.get("accuracy"));
  const calibration = parseCalibration(searchParams.get("calibration"));
  const includeForks = parseBoolean(searchParams.get("includeForks"), false);
  const includeArchived = parseBoolean(
    searchParams.get("includeArchived"),
    false,
  );
  const includeDisabled = parseBoolean(
    searchParams.get("includeDisabled"),
    false,
  );
  const includePrivate = parseBoolean(
    searchParams.get("includePrivate"),
    false,
  );

  const maxReposByMode =
    accuracy === "detailed"
      ? MAX_REPOS_DETAILED
      : accuracy === "balanced"
        ? MAX_REPOS_BALANCED
        : MAX_REPOS_FAST;

  return {
    users,
    limit: parsePositiveInt(
      searchParams.get("limit"),
      DEFAULT_LIMIT,
      MAX_LIMIT,
    ),
    accuracy,
    calibration,
    includeForks,
    includeArchived,
    includeDisabled,
    includePrivate,
    minRepoSizeKb: parseNonNegativeInt(
      searchParams.get("minRepoSizeKb"),
      1,
      1_000_000,
    ),
    minLanguageBytes: parseNonNegativeInt(
      searchParams.get("minLanguageBytes"),
      1_024,
      10_000_000,
    ),
    diagnostics: parseBoolean(searchParams.get("diagnostics"), false),
    maxRepos: parsePositiveInt(
      searchParams.get("maxRepos"),
      maxReposByMode || MAX_REPOS_DETAILED,
      2_000,
    ),
    maxReposPerSkill: parsePositiveInt(
      searchParams.get("maxReposPerSkill"),
      DEFAULT_TOP_REPOS_PER_SKILL,
      50,
    ),
    includeTopicSignals: parseBoolean(
      searchParams.get("includeTopicSignals"),
      true,
    ),
    includeTextSignals: parseBoolean(
      searchParams.get("includeTextSignals"),
      false,
    ),
    includeLicenseSignals: parseBoolean(
      searchParams.get("includeLicenseSignals"),
      false,
    ),
    minEvidenceSignalScore: clamp(
      Number.parseFloat(searchParams.get("minEvidenceSignalScore") || "0.06"),
      0,
      1,
    ),
    maxEvidenceSignalsPerRepo: parsePositiveInt(
      searchParams.get("maxEvidenceSignalsPerRepo"),
      40,
      100,
    ),
    includeEvidenceNarrative: parseBoolean(
      searchParams.get("includeEvidenceNarrative"),
      true,
    ),
  };
}

function normalizeLanguageName(language: string): string {
  const trimmed = language.trim();
  if (!trimmed) return "Unknown";
  const alias = LANGUAGE_ALIASES[trimmed.toLowerCase()];
  if (alias) return alias;

  if (trimmed === trimmed.toUpperCase() && trimmed.length <= 4) {
    return trimmed;
  }

  return trimmed
    .split(/\s+/)
    .map((part) =>
      part.length <= 2
        ? part.toUpperCase()
        : part[0].toUpperCase() + part.slice(1).toLowerCase(),
    )
    .join(" ");
}

function inferCategory(language: string): TechStack["category"] {
  const key = language.trim().toLowerCase();
  if (CATEGORY_MAP[key]) return CATEGORY_MAP[key];

  if (
    ["sql", "db", "database", "postgres", "mysql", "sqlite"].some((token) =>
      key.includes(token),
    )
  ) {
    return "database";
  }

  if (
    [
      "terraform",
      "ansible",
      "helm",
      "kubernetes",
      "nomad",
      "infrastructure",
    ].some((token) => key.includes(token))
  ) {
    return "infrastructure";
  }

  if (
    ["docker", "shell", "powershell", "batch", "yaml", "nix", "devops"].some(
      (token) => key.includes(token),
    )
  ) {
    return "devops";
  }

  if (
    ["react", "next", "vue", "svelte", "css", "html", "frontend"].some(
      (token) => key.includes(token),
    )
  ) {
    return "frontend";
  }

  if (
    ["ml", "ai", "jupyter", "cuda", "pytorch", "tensorflow"].some((token) =>
      key.includes(token),
    )
  ) {
    return "ai-ml";
  }

  return "backend";
}

function safeTimeMs(
  value: string | null | undefined,
  fallbackMs: number,
): number {
  if (!value) return fallbackMs;
  const ms = new Date(value).getTime();
  return Number.isFinite(ms) ? ms : fallbackMs;
}

function recencyWeightForMonths(monthsSinceLastPush: number): number {
  if (monthsSinceLastPush <= 1) return 1;
  if (monthsSinceLastPush <= 3) return 0.95;
  if (monthsSinceLastPush <= 6) return 0.9;
  if (monthsSinceLastPush <= 12) return 0.82;
  if (monthsSinceLastPush <= 18) return 0.74;
  if (monthsSinceLastPush <= 24) return 0.66;
  if (monthsSinceLastPush <= 36) return 0.56;
  return 0.42;
}

function popularityWeight(
  stars: number,
  forks: number,
  watchers: number,
): number {
  const starsSignal = Math.log2(1 + Math.max(0, stars));
  const forksSignal = Math.log2(1 + Math.max(0, forks));
  const watchersSignal = Math.log2(1 + Math.max(0, watchers));
  const raw =
    1 + starsSignal * 0.14 + forksSignal * 0.12 + watchersSignal * 0.08;
  return clamp(raw, 1, 2.75);
}

function repoImportance(repo: EnhancedGitHubRepo, nowMs: number): number {
  const pushedAt = safeTimeMs(
    repo.pushed_at || repo.updated_at || repo.created_at,
    nowMs,
  );
  const months = Math.max(0, (nowMs - pushedAt) / MONTH_MS);
  const recency = recencyWeightForMonths(months);
  const sizeScore = Math.log2(1 + Math.max(0, repo.size));
  const socialScore = Math.log2(
    1 +
      Math.max(
        0,
        repo.stargazers_count + repo.forks_count + repo.watchers_count,
      ),
  );
  const qualityPenalty = repo.disabled ? 0.5 : repo.archived ? 0.75 : 1;
  const forkPenalty = repo.fork ? 0.85 : 1;
  return (
    (1 + sizeScore * 0.55 + socialScore * 0.35) *
    recency *
    qualityPenalty *
    forkPenalty
  );
}

function shouldIncludeRepo(
  repo: EnhancedGitHubRepo,
  params: ParsedParams,
): boolean {
  if (!params.includeForks && repo.fork) return false;
  if (!params.includeArchived && repo.archived) return false;
  if (!params.includeDisabled && repo.disabled) return false;
  if (!params.includePrivate && repo.private) return false;
  if (repo.size < params.minRepoSizeKb) return false;
  return true;
}

function dedupeRepos(repos: EnhancedGitHubRepo[]): EnhancedGitHubRepo[] {
  const map = new Map<string, EnhancedGitHubRepo>();
  for (const repo of repos) {
    const key = repo.full_name || `${repo.name}:${repo.html_url}`;
    const existing = map.get(key);
    if (!existing) {
      map.set(key, repo);
      continue;
    }

    const existingPush = safeTimeMs(
      existing.pushed_at || existing.updated_at || existing.created_at,
      0,
    );
    const currentPush = safeTimeMs(
      repo.pushed_at || repo.updated_at || repo.created_at,
      0,
    );
    if (currentPush > existingPush) {
      map.set(key, repo);
    }
  }
  return Array.from(map.values());
}

function getRepoOwner(fullName: string, fallbackOwner: string): string {
  const [owner] = fullName.split("/");
  return owner || fallbackOwner;
}

function monthKey(ms: number): string {
  const date = new Date(ms);
  const year = date.getUTCFullYear();
  const month = `${date.getUTCMonth() + 1}`.padStart(2, "0");
  return `${year}-${month}`;
}

function monthsBetween(fromMs: number, toMs: number): number {
  if (toMs <= fromMs) return 0;
  return Math.max(0, (toMs - fromMs) / MONTH_MS);
}

function languageBytesFromPrimary(
  repo: EnhancedGitHubRepo,
): Record<string, number> {
  if (!repo.language) return {};
  const canonical = normalizeLanguageName(repo.language);
  const sizeBytes = Math.max(0, repo.size) * 1024;
  if (!sizeBytes) return {};
  return { [canonical]: sizeBytes };
}

function sumBytes(languageBytes: Record<string, number>): number {
  return Object.values(languageBytes).reduce(
    (sum, value) => sum + Math.max(0, value),
    0,
  );
}

async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  task: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  if (items.length === 0) return [];

  const results = new Array<R>(items.length);
  let cursor = 0;

  const worker = async () => {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await task(items[index], index);
    }
  };

  const workers = Array.from(
    { length: Math.max(1, Math.min(concurrency, items.length)) },
    () => worker(),
  );
  await Promise.all(workers);
  return results;
}

async function buildRepoSnapshots(
  repos: EnhancedGitHubRepo[],
  params: ParsedParams,
  diagnostics: ModelDiagnostics,
): Promise<RepoSnapshot[]> {
  const nowMs = Date.now();
  const sortedByImportance = [...repos].sort(
    (a, b) => repoImportance(b, nowMs) - repoImportance(a, nowMs),
  );
  const selectedRepos = sortedByImportance.slice(0, params.maxRepos);

  const detailedBudget =
    params.accuracy === "detailed"
      ? Math.min(selectedRepos.length, MAX_REPOS_DETAILED)
      : params.accuracy === "balanced"
        ? Math.min(selectedRepos.length, MAX_REPOS_BALANCED)
        : 0;

  const detailedTargets = new Set<string>(
    selectedRepos
      .slice(0, detailedBudget)
      .map((repo) => repo.full_name || repo.name),
  );

  const snapshots = await mapWithConcurrency(selectedRepos, 8, async (repo) => {
    const fullName = repo.full_name || repo.name;
    const defaultLanguageBytes = languageBytesFromPrimary(repo);
    let languageBytes = defaultLanguageBytes;
    let source: RepoLanguageSource = "primary-fallback";
    let detailedSuccess = false;

    if (detailedTargets.has(fullName) && params.accuracy !== "fast") {
      const [owner, repoName] = fullName.split("/");
      if (owner && repoName) {
        try {
          const fetched = await fetchLanguageStats(owner, repoName);
          const normalizedEntries = Object.entries(fetched)
            .filter(
              ([, bytes]) =>
                typeof bytes === "number" &&
                Number.isFinite(bytes) &&
                bytes > 0,
            )
            .map(
              ([language, bytes]) =>
                [normalizeLanguageName(language), bytes] as const,
            );

          if (normalizedEntries.length > 0) {
            languageBytes = normalizedEntries.reduce<Record<string, number>>(
              (acc, [language, bytes]) => {
                acc[language] = (acc[language] || 0) + bytes;
                return acc;
              },
              {},
            );
            source = "detailed";
            detailedSuccess = true;
          }
        } catch {
          source = "primary-fallback";
        }
      }
    }

    if (detailedSuccess) {
      diagnostics.reposWithDetailedLanguages += 1;
    } else {
      diagnostics.reposWithFallbackLanguages += 1;
    }

    const pushedAtMs = safeTimeMs(
      repo.pushed_at || repo.updated_at || repo.created_at,
      nowMs,
    );
    return {
      owner: getRepoOwner(fullName, repo.name),
      fullName,
      name: repo.name,
      url: repo.html_url,
      description: repo.description,
      createdAt: repo.created_at,
      pushedAt: repo.pushed_at || repo.updated_at || repo.created_at,
      updatedAt: repo.updated_at,
      stargazers: Math.max(0, repo.stargazers_count),
      forks: Math.max(0, repo.forks_count),
      watchers: Math.max(0, repo.watchers_count),
      sizeKb: Math.max(0, repo.size),
      defaultPrimaryLanguage: repo.language
        ? normalizeLanguageName(repo.language)
        : null,
      topicsCount: Array.isArray(repo.topics) ? repo.topics.length : 0,
      isFork: repo.fork,
      isArchived: repo.archived,
      isPrivate: repo.private,
      isDisabled: repo.disabled,
      isDetailedLanguageData: detailedSuccess,
      languageSource: source,
      languageBytes,
      topics: Array.isArray(repo.topics) ? repo.topics : [],
      hasWiki: repo.has_wiki,
      hasPages: repo.has_pages,
      totalLanguageBytes: Math.max(
        0,
        sumBytes(languageBytes) || Math.max(0, repo.size) * 1024,
      ),
      pushedAtMs,
    } as RepoSnapshot & { pushedAtMs: number };
  });

  return snapshots.map(({ pushedAtMs: _pushedAtMs, ...snapshot }) => snapshot);
}

function initializeLanguageAggregate(language: string): LanguageAggregate {
  return {
    canonicalName: language,
    category: inferCategory(language),
    aliases: new Set<string>([language]),
    totalBytes: 0,
    weightedBytes: 0,
    primaryBytes: 0,
    secondaryBytes: 0,
    repoCount: 0,
    primaryRepoCount: 0,
    secondaryRepoCount: 0,
    recentRepoCount: 0,
    activeMonths: new Set<string>(),
    firstSeenMs: Number.POSITIVE_INFINITY,
    lastSeenMs: 0,
    ownerSet: new Set<string>(),
    weightedRecency: 0,
    weightedPopularity: 0,
    weightedBreadth: 0,
    weightedContinuity: 0,
    weightedConfidenceEvidence: 0,
    records: [],
    evidence: initializeLanguageEvidenceAggregate(language),
  };
}

function aggregateLanguages(
  snapshots: RepoSnapshot[],
  params: ParsedParams,
  diagnostics: ModelDiagnostics,
): Map<string, LanguageAggregate> {
  const nowMs = Date.now();
  const aggregate = new Map<string, LanguageAggregate>();
  const evidencePolicy = normalizeEvidencePolicy({
    includeTopicSignals: params.includeTopicSignals,
    includeTextSignals: params.includeTextSignals,
    includeLicenseSignals: params.includeLicenseSignals,
    minimumSignalScore: params.minEvidenceSignalScore,
    maxSignalsPerRepo: params.maxEvidenceSignalsPerRepo,
  });

  for (const repo of snapshots) {
    const repoTotal = Math.max(1, repo.totalLanguageBytes);
    const pushedMs = safeTimeMs(
      repo.pushedAt || repo.updatedAt || repo.createdAt,
      nowMs,
    );
    const createdMs = safeTimeMs(repo.createdAt, pushedMs);
    const monthsSincePush = Math.max(0, (nowMs - pushedMs) / MONTH_MS);
    const recency = recencyWeightForMonths(monthsSincePush);
    const popularity = popularityWeight(
      repo.stargazers,
      repo.forks,
      repo.watchers,
    );
    const evidenceSignals = collectRepositoryEvidence(
      {
        owner: repo.owner,
        fullName: repo.fullName,
        name: repo.name,
        description: repo.description,
        primaryLanguage: repo.defaultPrimaryLanguage,
        languageBytes: repo.languageBytes,
        topics: repo.topics,
        isFork: repo.isFork,
        isArchived: repo.isArchived,
        isDisabled: repo.isDisabled,
        hasWiki: repo.hasWiki,
        hasPages: repo.hasPages,
      },
      evidencePolicy,
    );
    diagnostics.evidenceSignals += evidenceSignals.length;
    for (const signal of evidenceSignals) {
      diagnostics.evidenceSignalsBySource[signal.source] =
        (diagnostics.evidenceSignalsBySource[signal.source] || 0) + 1;
    }

    const evidencePenalty = scorePenaltyFromContextSignals(evidenceSignals);
    const baseImportance = clamp(
      (1 + Math.log2(1 + Math.max(0, repo.sizeKb))) *
        recency *
        (1 - evidencePenalty * 0.35),
      0.2,
      12,
    );

    const normalizedPairs = Object.entries(repo.languageBytes)
      .filter(
        ([, bytes]) =>
          Number.isFinite(bytes) && bytes >= params.minLanguageBytes,
      )
      .map(
        ([rawLanguage, bytes]) =>
          [normalizeLanguageName(rawLanguage), bytes] as const,
      );

    if (normalizedPairs.length === 0) {
      continue;
    }

    const dominantLanguage = normalizedPairs.reduce<{
      language: string;
      bytes: number;
    }>(
      (prev, current) =>
        current[1] > prev.bytes
          ? { language: current[0], bytes: current[1] }
          : prev,
      { language: normalizedPairs[0][0], bytes: normalizedPairs[0][1] },
    ).language;

    for (const [language, bytes] of normalizedPairs) {
      diagnostics.languageSignals += 1;
      const shareInRepo = clamp(bytes / repoTotal, 0, 1);
      const contributionWeight = baseImportance * (0.3 + 1.4 * shareInRepo);
      const isPrimary =
        language === dominantLanguage ||
        language === repo.defaultPrimaryLanguage;

      let entry = aggregate.get(language);
      if (!entry) {
        entry = initializeLanguageAggregate(language);
        aggregate.set(language, entry);
      }

      entry.aliases.add(language);
      entry.totalBytes += bytes;
      entry.weightedBytes += bytes * contributionWeight;
      entry.ownerSet.add(repo.owner);
      entry.activeMonths.add(monthKey(pushedMs));
      entry.firstSeenMs = Math.min(entry.firstSeenMs, createdMs);
      entry.lastSeenMs = Math.max(entry.lastSeenMs, pushedMs);
      entry.weightedRecency += recency * contributionWeight;
      entry.weightedPopularity += popularity * contributionWeight;
      entry.weightedBreadth += contributionWeight;
      entry.weightedContinuity +=
        clamp(1 - monthsSincePush / 48, 0.2, 1) * contributionWeight;
      entry.weightedConfidenceEvidence +=
        (repo.isDetailedLanguageData ? 1 : 0.55) *
        (isPrimary ? 1.1 : 0.95) *
        contributionWeight;

      if (monthsSincePush <= 18) {
        entry.recentRepoCount += 1;
      }

      if (isPrimary) {
        entry.primaryRepoCount += 1;
        entry.primaryBytes += bytes;
      } else {
        entry.secondaryRepoCount += 1;
        entry.secondaryBytes += bytes;
      }

      entry.records.push({
        name: repo.name,
        fullName: repo.fullName,
        url: repo.url,
        pushedAt: repo.pushedAt,
        createdAt: repo.createdAt,
        bytes,
        shareInRepo,
        isPrimary,
        stargazers: repo.stargazers,
        forks: repo.forks,
        watchers: repo.watchers,
        recencyWeight: recency,
        contributionWeight,
        owner: repo.owner,
      });
    }

    const evidenceByLanguage = collectSignalsByLanguage(evidenceSignals);
    const evidenceLanguages = extractLanguagesFromSignals(evidenceSignals);

    for (const language of evidenceLanguages) {
      let entry = aggregate.get(language);
      if (!entry) {
        entry = initializeLanguageAggregate(language);
        aggregate.set(language, entry);
      }

      const languageSignals = evidenceByLanguage.get(language) || [];
      entry.evidence = applyEvidenceSignals(
        entry.evidence,
        repo.fullName,
        languageSignals,
      );

      const categoryConfidence = evidenceConfidenceScore(
        entry.evidence,
        Math.max(1, snapshots.length),
      );
      entry.category = mergeCategoryFromEvidence(
        entry.category,
        entry.evidence.category,
        categoryConfidence,
      );
    }
  }

  for (const entry of aggregate.values()) {
    entry.repoCount = Math.max(
      new Set(entry.records.map((record) => record.fullName)).size,
      entry.evidence.repositories.size,
    );
  }

  return aggregate;
}

function confidenceFromSignals(
  language: LanguageAggregate,
  totalWeightedBytes: number,
  totalRepos: number,
): number {
  const bytesEvidence = clamp(
    totalWeightedBytes > 0 ? language.weightedBytes / totalWeightedBytes : 0,
    0,
    1,
  );
  const repoEvidence = clamp(
    totalRepos > 0 ? language.repoCount / Math.max(3, totalRepos) : 0,
    0,
    1,
  );
  const ownerEvidence = clamp(language.ownerSet.size / 3, 0, 1);
  const detailedEvidence = clamp(
    language.weightedConfidenceEvidence / Math.max(1, language.weightedBreadth),
    0,
    1,
  );
  const recencyEvidence = clamp(
    language.weightedRecency / Math.max(1, language.weightedBreadth),
    0,
    1,
  );
  const continuityEvidence = clamp(language.activeMonths.size / 18, 0, 1);
  const evidenceConfidence = evidenceConfidenceScore(language.evidence, totalRepos);
  const raw =
    bytesEvidence * 0.2 +
    repoEvidence * 0.16 +
    ownerEvidence * 0.08 +
    detailedEvidence * 0.19 +
    recencyEvidence * 0.15 +
    continuityEvidence * 0.1 +
    evidenceConfidence * 0.12;
  return clamp(raw, 0.12, 0.98);
}

function scoreLanguage(
  language: LanguageAggregate,
  globalWeightedBytes: number,
  totalRepos: number,
  calibration: CalibrationMode,
): Omit<SkillComputation, "skill"> & {
  yearsOfExperience: number;
  experienceLabel: string;
  level: TechStack["level"];
  description: string;
  insights: NonNullable<TechStack["insights"]>;
  repositories: TechStack["repositories"];
  evidenceSummary: string[];
  evidenceScore: number;
} {
  const nowMs = Date.now();
  const spanYears = clamp(
    (language.lastSeenMs - language.firstSeenMs) / YEAR_MS,
    0,
    25,
  );
  const monthsSinceLastSeen = clamp(
    (nowMs - language.lastSeenMs) / MONTH_MS,
    0,
    600,
  );
  const activeMonths = language.activeMonths.size;
  const activeYears = activeMonths / 12;

  const recencyScore = recencyWeightForMonths(monthsSinceLastSeen);
  const breadthScore = clamp(language.repoCount / 10, 0, 1);
  const continuityScore = clamp(
    activeMonths /
      Math.max(1, monthsBetween(language.firstSeenMs, language.lastSeenMs)),
    0.08,
    1,
  );
  const intensityScore = clamp(Math.log2(1 + language.totalBytes) / 23, 0, 1);
  const weightedShare = clamp(
    globalWeightedBytes > 0 ? language.weightedBytes / globalWeightedBytes : 0,
    0,
    1,
  );
  const shareScore = clamp(Math.sqrt(weightedShare / 0.22), 0, 1);

  const popularityAverage = clamp(
    language.weightedPopularity / Math.max(1, language.weightedBreadth),
    0,
    3,
  );
  const popularityScore = clamp((popularityAverage - 1) / 1.5, 0, 1);
  const evidenceScore = evidenceConfidenceScore(language.evidence, totalRepos);

  const confidence = confidenceFromSignals(
    language,
    globalWeightedBytes,
    totalRepos,
  );
  const profile = CALIBRATION_PROFILES[calibration];

  const activityScore =
    recencyScore * 0.45 +
    continuityScore * 0.25 +
    clamp(language.recentRepoCount / Math.max(1, language.repoCount), 0, 1) *
      0.3;

  const qualityScore =
    intensityScore * 0.22 +
    breadthScore * 0.23 +
    shareScore * 0.17 +
    activityScore * 0.23 +
    popularityScore * 0.12 +
    evidenceScore * 0.03;

  const rankScore =
    qualityScore * profile.rankWeight + confidence * profile.confidenceWeight;

  const temporalSignalYears =
    spanYears *
    (0.42 +
      continuityScore * 0.24 +
      recencyScore * 0.16 +
      confidence * (0.18 + profile.yearConfidenceLift));
  const activitySignalYears =
    activeYears *
    (0.52 +
      breadthScore * 0.22 +
      intensityScore * 0.14 +
      confidence * (0.12 + profile.yearConfidenceLift));
  const evidenceCap = clamp(
    0.58 +
      Math.log2(1 + language.repoCount) * 0.14 +
      Math.min(1, activeMonths / 24) * 0.2 +
      confidence * 0.22,
    0.58,
    1.2,
  );
  const estimatedYears = round(
    Math.max(
      0.1,
      (temporalSignalYears * profile.yearBlendTemporal +
        activitySignalYears * profile.yearBlendActivity) *
        evidenceCap,
    ),
    1,
  );

  let level: TechStack["level"];
  if (
    rankScore >= profile.expert.minRank &&
    confidence >= profile.expert.minConfidence &&
    estimatedYears >= profile.expert.minYears &&
    language.repoCount >= profile.expert.minRepos &&
    activeMonths >= profile.expert.minActiveMonths
  ) {
    level = "expert";
  } else if (
    rankScore >= profile.advanced.minRank &&
    confidence >= profile.advanced.minConfidence &&
    estimatedYears >= profile.advanced.minYears &&
    language.repoCount >= profile.advanced.minRepos &&
    activeMonths >= profile.advanced.minActiveMonths
  ) {
    level = "advanced";
  } else if (
    rankScore >= profile.intermediate.minRank &&
    confidence >= profile.intermediate.minConfidence &&
    estimatedYears >= profile.intermediate.minYears
  ) {
    level = "intermediate";
  } else {
    level = "beginner";
  }

  let experienceLabel: string;
  if (estimatedYears < 1) {
    const months = Math.max(1, Math.round(estimatedYears * 12));
    experienceLabel = `${months} month${months === 1 ? "" : "s"} active usage`;
  } else {
    const yearsText =
      estimatedYears % 1 === 0
        ? estimatedYears.toFixed(0)
        : estimatedYears.toFixed(1);
    const yearsValue = Number(yearsText);
    experienceLabel = `${yearsText} year${yearsValue === 1 ? "" : "s"} active usage`;
  }

  const primaryWeight = clamp(
    language.primaryBytes / Math.max(1, language.totalBytes),
    0,
    1,
  );
  const ownerBreadth = language.ownerSet.size;

  const insights: NonNullable<TechStack["insights"]> = {
    repositoryCount: language.repoCount,
    primaryLanguageSharePct: formatPercent(primaryWeight),
    ownerCount: ownerBreadth,
    activityScorePct: formatPercent(activityScore),
    evidenceConfidencePct: formatPercent(evidenceScore),
  };

  const description = buildSkillNarrative({
    language: language.canonicalName,
    repositories: insights.repositoryCount,
    owners: insights.ownerCount,
    primarySharePct: insights.primaryLanguageSharePct,
    activityScorePct: insights.activityScorePct,
    evidenceConfidencePct: insights.evidenceConfidencePct,
  });

  const evidenceSummary = summarizeEvidenceHighlights(language.evidence.highlights, 4);

  const repositories = language.records
    .sort((a, b) => {
      const scoreA = a.contributionWeight * (0.65 + a.recencyWeight * 0.35);
      const scoreB = b.contributionWeight * (0.65 + b.recencyWeight * 0.35);
      return scoreB - scoreA;
    })
    .map((record) => ({
      name: record.name,
      url: record.url,
      pushedAt: record.pushedAt,
    }));

  return {
    rankScore,
    confidence,
    activityScore,
    intensityScore,
    breadthScore,
    recencyScore,
    continuityScore,
    shareScore,
    popularityScore,
    qualityScore,
    weightedBytes: language.weightedBytes,
    totalBytes: language.totalBytes,
    yearsOfExperience: estimatedYears,
    experienceLabel,
    level,
    description,
    insights,
    repositories,
    evidenceSummary,
    evidenceScore,
  };
}

function fallbackResponse(reason: string, status: number) {
  return NextResponse.json(
    {
      error: reason,
      skills: [],
      count: 0,
      users: config.GITHUB_USERNAMES,
      totalRepos: 0,
      lastUpdated: new Date().toISOString(),
      modelVersion: MODEL_VERSION,
    },
    { status },
  );
}

function trimSkillRepositories(
  skills: SkillComputation[],
  maxReposPerSkill: number,
): TechStack[] {
  return skills.map(({ skill }) => ({
    ...skill,
    repositories: (skill.repositories || []).slice(0, maxReposPerSkill),
  }));
}

export async function GET(request: Request) {
  const startedAt = Date.now();
  const params = parseRequestParams(request);

  const diagnostics: ModelDiagnostics = {
    warnings: [],
    usersQueried: 0,
    reposFetched: 0,
    reposConsidered: 0,
    reposWithDetailedLanguages: 0,
    reposWithFallbackLanguages: 0,
    languageSignals: 0,
    executionMs: 0,
    selectedAccuracy: params.accuracy,
    selectedCalibration: params.calibration,
    evidenceSignals: 0,
    evidenceSignalsBySource: {},
  };

  try {
    const requestedUsers =
      params.users.length > 0 ? params.users : config.GITHUB_USERNAMES;

    if (!Array.isArray(requestedUsers) || requestedUsers.length === 0) {
      diagnostics.warnings.push("No GitHub users configured or supplied.");
      diagnostics.executionMs = Date.now() - startedAt;
      return fallbackResponse(
        "No users configured for skills aggregation",
        400,
      );
    }

    diagnostics.usersQueried = requestedUsers.length;

    const fetchedRepos = await fetchAllUserRepos(requestedUsers);
    diagnostics.reposFetched = fetchedRepos.length;

    const uniqueRepos = dedupeRepos(fetchedRepos);
    const filteredRepos = uniqueRepos.filter((repo) =>
      shouldIncludeRepo(repo, params),
    );
    diagnostics.reposConsidered = filteredRepos.length;

    if (filteredRepos.length === 0) {
      diagnostics.warnings.push(
        "No repositories matched the current filter parameters.",
      );
      diagnostics.executionMs = Date.now() - startedAt;

      return NextResponse.json(
        {
          skills: [],
          count: 0,
          users: requestedUsers,
          totalRepos: 0,
          lastUpdated: new Date().toISOString(),
          modelVersion: MODEL_VERSION,
          filters: {
            includeForks: params.includeForks,
            includeArchived: params.includeArchived,
            includeDisabled: params.includeDisabled,
            includePrivate: params.includePrivate,
            minRepoSizeKb: params.minRepoSizeKb,
            minLanguageBytes: params.minLanguageBytes,
            accuracy: params.accuracy,
            calibration: params.calibration,
            includeTopicSignals: params.includeTopicSignals,
            includeTextSignals: params.includeTextSignals,
            includeLicenseSignals: params.includeLicenseSignals,
            minEvidenceSignalScore: params.minEvidenceSignalScore,
            maxEvidenceSignalsPerRepo: params.maxEvidenceSignalsPerRepo,
          },
          ...(params.diagnostics ? { diagnostics } : {}),
        },
        {
          headers: {
            "Cache-Control": `public, s-maxage=${config.CACHE_DURATION.SKILLS}, stale-while-revalidate=${config.CACHE_DURATION.SKILLS * 2}`,
          },
        },
      );
    }

    const snapshots = await buildRepoSnapshots(
      filteredRepos,
      params,
      diagnostics,
    );
    const aggregate = aggregateLanguages(snapshots, params, diagnostics);

    const totalWeightedBytes = Array.from(aggregate.values()).reduce(
      (sum, language) => sum + language.weightedBytes,
      0,
    );

    const scored: SkillComputation[] = Array.from(aggregate.values())
      .map((language) => {
        const scoredParts = scoreLanguage(
          language,
          totalWeightedBytes,
          snapshots.length,
          params.calibration,
        );
        const skill: TechStack = {
          name: language.canonicalName,
          category: language.category,
          level: scoredParts.level,
          yearsOfExperience: scoredParts.yearsOfExperience,
          experienceLabel: scoredParts.experienceLabel,
          description: scoredParts.description,
          insights: {
            ...scoredParts.insights,
            evidenceHighlights: params.includeEvidenceNarrative
              ? scoredParts.evidenceSummary
              : [],
          },
          repositories: scoredParts.repositories,
        };

        return {
          skill,
          rankScore: scoredParts.rankScore,
          confidence: scoredParts.confidence,
          activityScore: scoredParts.activityScore,
          intensityScore: scoredParts.intensityScore,
          breadthScore: scoredParts.breadthScore,
          recencyScore: scoredParts.recencyScore,
          continuityScore: scoredParts.continuityScore,
          shareScore: scoredParts.shareScore,
          popularityScore: scoredParts.popularityScore,
          qualityScore: scoredParts.qualityScore,
          evidenceScore: scoredParts.evidenceScore,
          evidenceSummary: scoredParts.evidenceSummary,
          weightedBytes: scoredParts.weightedBytes,
          totalBytes: scoredParts.totalBytes,
        };
      })
      .sort((a, b) => {
        if (b.rankScore !== a.rankScore) return b.rankScore - a.rankScore;
        if (b.confidence !== a.confidence) return b.confidence - a.confidence;
        return b.totalBytes - a.totalBytes;
      })
      .slice(0, params.limit);

    const skills = trimSkillRepositories(scored, params.maxReposPerSkill);

    const categoryDistribution = skills.reduce<Record<string, number>>(
      (acc, skill) => {
        acc[skill.category] = (acc[skill.category] || 0) + 1;
        return acc;
      },
      {},
    );

    const averageConfidence =
      scored.length > 0
        ? round(
            scored.reduce((sum, item) => sum + item.confidence, 0) /
              scored.length,
            4,
          )
        : 0;

    diagnostics.executionMs = Date.now() - startedAt;

    return NextResponse.json(
      {
        skills,
        count: skills.length,
        users: requestedUsers,
        totalRepos: filteredRepos.length,
        totalFetchedRepos: fetchedRepos.length,
        lastUpdated: new Date().toISOString(),
        modelVersion: MODEL_VERSION,
        source: {
          accuracy: params.accuracy,
          calibration: params.calibration,
          detailedLanguageRepos: diagnostics.reposWithDetailedLanguages,
          fallbackLanguageRepos: diagnostics.reposWithFallbackLanguages,
          minRepoSizeKb: params.minRepoSizeKb,
          minLanguageBytes: params.minLanguageBytes,
          evidencePolicy: {
            includeTopicSignals: params.includeTopicSignals,
            includeTextSignals: params.includeTextSignals,
            includeLicenseSignals: params.includeLicenseSignals,
            minEvidenceSignalScore: params.minEvidenceSignalScore,
            maxEvidenceSignalsPerRepo: params.maxEvidenceSignalsPerRepo,
          },
        },
        quality: {
          averageConfidence,
          categoryDistribution,
        },
        topSignals: scored
          .slice(0, Math.min(10, scored.length))
          .map((item) => ({
            language: item.skill.name,
            score: round(item.rankScore, 4),
            confidence: round(item.confidence, 4),
            activity: round(item.activityScore, 4),
            breadth: round(item.breadthScore, 4),
            continuity: round(item.continuityScore, 4),
            intensity: round(item.intensityScore, 4),
            evidence: round(item.evidenceScore, 4),
            bytes: item.totalBytes,
            evidenceSummary: item.evidenceSummary.slice(0, 2),
          })),
        ...(params.diagnostics ? { diagnostics } : {}),
      },
      {
        headers: {
          "Cache-Control": `public, s-maxage=${config.CACHE_DURATION.SKILLS}, stale-while-revalidate=${config.CACHE_DURATION.SKILLS * 2}`,
        },
      },
    );
  } catch (error) {
    console.error("Failed to aggregate GitHub skills:", error);

    diagnostics.executionMs = Date.now() - startedAt;
    diagnostics.warnings.push(
      "Unhandled exception in skills aggregation pipeline.",
    );

    return NextResponse.json(
      {
        error: "Failed to fetch skills",
        skills: [],
        count: 0,
        users: params.users.length > 0 ? params.users : config.GITHUB_USERNAMES,
        totalRepos: 0,
        lastUpdated: new Date().toISOString(),
        modelVersion: MODEL_VERSION,
        ...(params.diagnostics ? { diagnostics } : {}),
      },
      { status: 500 },
    );
  }
}
