import { TechStack } from "@/lib/types";
import {
  CONTEXT_ONLY_LANGUAGE_TAGS,
  LANGUAGE_ALIASES,
  LANGUAGE_CATEGORY_HINTS,
  LICENSE_LANGUAGE_HINTS,
  NEGATIVE_CONTEXT_HINTS,
  NOISE_TOKENS,
  isHardNoiseToken,
  TEXT_REGEX_HINTS,
  TOKEN_LANGUAGE_HINTS,
  TOPIC_LANGUAGE_HINTS,
  noisePenaltyForToken,
  type WeightedLanguageHint,
} from "@/lib/skills-evidence-knowledge";
import { inferLanguageCategoryExpert } from "@/lib/skills-language-taxonomy";

export type EvidenceSource =
  | "primary-language"
  | "language-bytes"
  | "topics"
  | "repo-name"
  | "repo-description"
  | "license"
  | "repo-flags"
  | "ecosystem-keywords"
  | "topic-synonyms"
  | "language-alias"
  | "repo-metadata"
  | "negative-context";

export interface RepositoryEvidenceInput {
  owner: string;
  fullName: string;
  name: string;
  description: string | null;
  primaryLanguage: string | null;
  languageBytes: Record<string, number>;
  topics: string[];
  isFork: boolean;
  isArchived: boolean;
  isDisabled: boolean;
  hasWiki?: boolean;
  hasPages?: boolean;
}

export interface SkillEvidenceSignal {
  language: string;
  category: TechStack["category"];
  source: EvidenceSource;
  score: number;
  confidence: number;
  token?: string;
  detail: string;
}

export interface EvidencePolicy {
  includeTopicSignals: boolean;
  includeTextSignals: boolean;
  includeLicenseSignals: boolean;
  minimumSignalScore: number;
  maxSignalsPerRepo: number;
  includeRegexSignals?: boolean;
  includeAliasSignals?: boolean;
  includeNegativeSignals?: boolean;
  includeMetadataSignals?: boolean;
  topicSignalWeight?: number;
  textSignalWeight?: number;
  regexSignalWeight?: number;
  languageByteSignalWeight?: number;
  primaryLanguageSignalWeight?: number;
  maxTopicSignals?: number;
  maxTextSignals?: number;
  maxRegexSignals?: number;
  tokenMinLength?: number;
  preferPrecisionOverRecall?: boolean;
}

interface ResolvedEvidencePolicy {
  includeTopicSignals: boolean;
  includeTextSignals: boolean;
  includeLicenseSignals: boolean;
  minimumSignalScore: number;
  maxSignalsPerRepo: number;
  includeRegexSignals: boolean;
  includeAliasSignals: boolean;
  includeNegativeSignals: boolean;
  includeMetadataSignals: boolean;
  topicSignalWeight: number;
  textSignalWeight: number;
  regexSignalWeight: number;
  languageByteSignalWeight: number;
  primaryLanguageSignalWeight: number;
  maxTopicSignals: number;
  maxTextSignals: number;
  maxRegexSignals: number;
  tokenMinLength: number;
  preferPrecisionOverRecall: boolean;
}

const RESERVED_CONFIDENCE_SOURCES = new Set<EvidenceSource>([
  "repo-flags",
  "negative-context",
]);

const SOURCE_RELIABILITY: Record<EvidenceSource, number> = {
  "primary-language": 0.98,
  "language-bytes": 0.95,
  topics: 0.8,
  "repo-name": 0.72,
  "repo-description": 0.64,
  license: 0.35,
  "repo-flags": 0.2,
  "ecosystem-keywords": 0.68,
  "topic-synonyms": 0.76,
  "language-alias": 0.7,
  "repo-metadata": 0.48,
  "negative-context": 0.24,
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function normalizeToken(value: string): string {
  return value
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase()
    .replace(/[_./]+/g, "-")
    .replace(/[^a-z0-9#+-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function splitTokens(input: string, minLength: number): string[] {
  const raw = input
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[^a-zA-Z0-9#+.]+/g)
    .map((token) => normalizeToken(token))
    .filter((token) => token.length >= minLength);

  const expanded: string[] = [];
  for (const token of raw) {
    expanded.push(token);
    if (token.includes("-")) {
      for (const part of token.split("-")) {
        if (part.length >= minLength) {
          expanded.push(part);
        }
      }
    }
  }

  return expanded;
}

function canonicalizeLanguageName(language: string): string {
  const normalized = normalizeToken(language);
  const alias = LANGUAGE_ALIASES[normalized];
  if (alias) return alias;

  if (language === "C#" || language === "C++") return language;
  if (language === "Dockerfile") return language;

  if (language.length <= 4 && language === language.toUpperCase()) {
    return language;
  }

  return language
    .split(/\s+/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function inferCategory(language: string): TechStack["category"] {
  const canonical = canonicalizeLanguageName(language);
  const inferred = inferLanguageCategoryExpert(canonical);
  if (inferred.confidence >= 0.45) {
    return inferred.category;
  }

  if (LANGUAGE_CATEGORY_HINTS[canonical])
    return LANGUAGE_CATEGORY_HINTS[canonical];

  const key = normalizeToken(canonical);
  if (
    [
      "sql",
      "postgres",
      "mysql",
      "sqlite",
      "mongo",
      "redis",
      "clickhouse",
      "cassandra",
      "dynamodb",
    ].some((x) => key.includes(x))
  ) {
    return "database";
  }
  if (
    [
      "terraform",
      "kubernetes",
      "helm",
      "ansible",
      "pulumi",
      "bicep",
      "hcl",
      "iac",
    ].some((x) => key.includes(x))
  ) {
    return "infrastructure";
  }
  if (
    [
      "docker",
      "shell",
      "bash",
      "powershell",
      "yaml",
      "nix",
      "make",
      "ci",
      "workflow",
    ].some((x) => key.includes(x))
  ) {
    return "devops";
  }
  if (
    [
      "typescript",
      "javascript",
      "html",
      "css",
      "react",
      "vue",
      "svelte",
      "astro",
      "angular",
      "solid",
    ].some((x) => key.includes(x))
  ) {
    return "frontend";
  }
  if (
    ["jupyter", "cuda", "ai", "ml", "tensor", "torch", "notebook", "nlp"].some(
      (x) => key.includes(x),
    )
  ) {
    return "ai-ml";
  }
  return "backend";
}

function makeSignal(
  language: string,
  source: EvidenceSource,
  score: number,
  confidence: number,
  detail: string,
  token?: string,
): SkillEvidenceSignal {
  const canonical = canonicalizeLanguageName(language);
  return {
    language: canonical,
    category: inferCategory(canonical),
    source,
    score: clamp(score, 0, 1),
    confidence: clamp(confidence, 0, 1),
    detail,
    token,
  };
}

function resolvePolicy(policy: EvidencePolicy): ResolvedEvidencePolicy {
  const primaryLanguageSignalWeight = clamp(
    policy.primaryLanguageSignalWeight ?? 1,
    0.2,
    2.2,
  );
  const languageByteSignalWeight = clamp(
    policy.languageByteSignalWeight ?? 1,
    0.2,
    2.2,
  );
  const topicSignalWeight = clamp(policy.topicSignalWeight ?? 1, 0.2, 2.2);
  const textSignalWeight = clamp(policy.textSignalWeight ?? 1, 0.2, 2.2);
  const regexSignalWeight = clamp(policy.regexSignalWeight ?? 1, 0.2, 2.2);

  return {
    includeTopicSignals: policy.includeTopicSignals,
    includeTextSignals: policy.includeTextSignals,
    includeLicenseSignals: policy.includeLicenseSignals,
    minimumSignalScore: clamp(policy.minimumSignalScore, 0, 1),
    maxSignalsPerRepo: Math.max(1, Math.min(200, policy.maxSignalsPerRepo)),
    includeRegexSignals: policy.includeRegexSignals ?? true,
    includeAliasSignals: policy.includeAliasSignals ?? true,
    includeNegativeSignals: policy.includeNegativeSignals ?? true,
    includeMetadataSignals: policy.includeMetadataSignals ?? true,
    topicSignalWeight,
    textSignalWeight,
    regexSignalWeight,
    languageByteSignalWeight,
    primaryLanguageSignalWeight,
    maxTopicSignals: Math.max(1, Math.min(200, policy.maxTopicSignals ?? 50)),
    maxTextSignals: Math.max(1, Math.min(200, policy.maxTextSignals ?? 80)),
    maxRegexSignals: Math.max(1, Math.min(200, policy.maxRegexSignals ?? 50)),
    tokenMinLength: Math.max(2, Math.min(16, policy.tokenMinLength ?? 2)),
    preferPrecisionOverRecall: policy.preferPrecisionOverRecall ?? true,
  };
}

function languageEntropy(languageBytes: Record<string, number>): number {
  const entries = Object.values(languageBytes).filter(
    (value) => Number.isFinite(value) && value > 0,
  );
  if (entries.length <= 1) return 0;

  const total = entries.reduce((sum, value) => sum + value, 0);
  if (total <= 0) return 0;

  let entropy = 0;
  for (const value of entries) {
    const p = value / total;
    entropy += -p * Math.log2(Math.max(1e-12, p));
  }

  const maxEntropy = Math.log2(entries.length);
  return clamp(entropy / Math.max(1e-9, maxEntropy), 0, 1);
}

function dedupeBestSignals(
  signals: SkillEvidenceSignal[],
): SkillEvidenceSignal[] {
  const deduped = new Map<string, SkillEvidenceSignal>();

  for (const signal of signals) {
    const key = `${signal.language}|${signal.source}|${signal.token || ""}`;
    const current = deduped.get(key);
    if (!current) {
      deduped.set(key, signal);
      continue;
    }

    const currentPower = current.score * current.confidence;
    const nextPower = signal.score * signal.confidence;

    if (nextPower > currentPower) {
      deduped.set(key, signal);
    }
  }

  return Array.from(deduped.values());
}

function applySourceReliability(
  signal: SkillEvidenceSignal,
): SkillEvidenceSignal {
  const reliability = SOURCE_RELIABILITY[signal.source] ?? 0.5;
  const adjustedConfidence = clamp((signal.confidence + reliability) / 2, 0, 1);
  return {
    ...signal,
    confidence: adjustedConfidence,
  };
}

function rankSignals(
  signals: SkillEvidenceSignal[],
  minimumSignalScore: number,
  maxSignalsPerRepo: number,
): SkillEvidenceSignal[] {
  return signals
    .filter((signal) => signal.score >= minimumSignalScore)
    .map((signal) => applySourceReliability(signal))
    .sort((a, b) => {
      const powerA = a.score * a.confidence;
      const powerB = b.score * b.confidence;
      if (powerB !== powerA) return powerB - powerA;
      return b.score - a.score;
    })
    .slice(0, maxSignalsPerRepo);
}

function fromPrimaryLanguage(
  input: RepositoryEvidenceInput,
  policy: ResolvedEvidencePolicy,
): SkillEvidenceSignal[] {
  if (!input.primaryLanguage) return [];

  const language = canonicalizeLanguageName(input.primaryLanguage);
  const totalBytes = Object.values(input.languageBytes).reduce(
    (sum, value) => sum + Math.max(0, value),
    0,
  );
  const sizeSignal = Math.log2(1 + totalBytes);
  const scale = clamp(sizeSignal / 22, 0.3, 1);
  const entropy = languageEntropy(input.languageBytes);
  const confidenceLift = clamp(1 - entropy * 0.22, 0.75, 1);

  return [
    makeSignal(
      language,
      "primary-language",
      (0.72 * scale + 0.24) * policy.primaryLanguageSignalWeight,
      0.97 * confidenceLift,
      `Primary language declared by repository metadata: ${language}`,
      normalizeToken(language),
    ),
  ];
}

function fromLanguageBytes(
  input: RepositoryEvidenceInput,
  policy: ResolvedEvidencePolicy,
): SkillEvidenceSignal[] {
  const canonicalBytes = new Map<string, number>();

  for (const [language, bytes] of Object.entries(input.languageBytes)) {
    if (!Number.isFinite(bytes) || bytes <= 0) continue;
    const canonical = canonicalizeLanguageName(language);
    canonicalBytes.set(canonical, (canonicalBytes.get(canonical) || 0) + bytes);
  }

  const entries = Array.from(canonicalBytes.entries()).sort(
    (a, b) => b[1] - a[1],
  );
  if (entries.length === 0) return [];

  const total = entries.reduce((sum, [, bytes]) => sum + bytes, 0);
  const top = entries[0][1];
  const entropy = languageEntropy(Object.fromEntries(entries));
  const concentration = clamp(1 - entropy, 0, 1);

  return entries.slice(0, 16).map(([language, bytes]) => {
    const share = clamp(bytes / Math.max(1, total), 0, 1);
    const dominance = clamp(bytes / Math.max(1, top), 0, 1);
    const score =
      (0.32 + share * 0.48 + dominance * 0.2 + concentration * 0.08) *
      policy.languageByteSignalWeight;

    return makeSignal(
      language,
      "language-bytes",
      score,
      0.93,
      `Language bytes observed from GitHub language API (${bytes} bytes, ${(share * 100).toFixed(1)}% share)`,
      normalizeToken(language),
    );
  });
}

function normalizeTopicVariants(topic: string): string[] {
  const token = normalizeToken(topic);
  if (!token) return [];

  const variants = new Set<string>([token]);

  if (token.includes("-")) {
    for (const part of token.split("-")) {
      if (part.length >= 2) variants.add(part);
    }
  }

  if (token.includes("+")) {
    for (const part of token.split("+")) {
      if (part.length >= 2) variants.add(part);
    }
  }

  const alias = LANGUAGE_ALIASES[token];
  if (alias) {
    variants.add(normalizeToken(alias));
  }

  return Array.from(variants);
}

function topicHintToSignal(
  originalTopic: string,
  token: string,
  hint: WeightedLanguageHint,
  policy: ResolvedEvidencePolicy,
): SkillEvidenceSignal {
  const isDirect = normalizeToken(originalTopic) === token;
  const source: EvidenceSource = isDirect ? "topics" : "topic-synonyms";
  const precisionModifier = policy.preferPrecisionOverRecall
    ? clamp(0.85 + hint.specificity * 0.2, 0.72, 1.15)
    : 1;

  return makeSignal(
    hint.language,
    source,
    hint.score * policy.topicSignalWeight * precisionModifier,
    hint.confidence,
    `Repository topic '${originalTopic}' maps to ${hint.language}`,
    token,
  );
}

function fromTopics(
  input: RepositoryEvidenceInput,
  policy: ResolvedEvidencePolicy,
): SkillEvidenceSignal[] {
  if (!policy.includeTopicSignals) return [];
  if (!Array.isArray(input.topics) || input.topics.length === 0) return [];

  const unique = new Set<string>();
  const signals: SkillEvidenceSignal[] = [];

  for (const topic of input.topics) {
    const variants = normalizeTopicVariants(topic);

    for (const token of variants) {
      if (!token || unique.has(`${topic}|${token}`)) continue;
      unique.add(`${topic}|${token}`);

      const hint = TOPIC_LANGUAGE_HINTS[token];
      if (!hint) continue;

      signals.push(topicHintToSignal(topic, token, hint, policy));
    }
  }

  return rankSignals(signals, 0, policy.maxTopicSignals);
}

function scoreTokenMatch(token: string): WeightedLanguageHint | null {
  const direct = TOKEN_LANGUAGE_HINTS[token];
  if (direct) return direct;

  const alias = LANGUAGE_ALIASES[token];
  if (alias) {
    return {
      language: alias,
      score: 0.16,
      confidence: 0.58,
      specificity: 0.46,
    };
  }

  const suffixPatterns: Array<{
    test: (t: string) => boolean;
    language: string;
    score: number;
    confidence: number;
    specificity: number;
  }> = [
    {
      test: (t) => t.endsWith("js") && t !== "js",
      language: "JavaScript",
      score: 0.13,
      confidence: 0.52,
      specificity: 0.38,
    },
    {
      test: (t) => t.endsWith("ts") && t !== "ts",
      language: "TypeScript",
      score: 0.13,
      confidence: 0.52,
      specificity: 0.38,
    },
    {
      test: (t) => t.endsWith("py") && t !== "py",
      language: "Python",
      score: 0.12,
      confidence: 0.5,
      specificity: 0.36,
    },
    {
      test: (t) => t.endsWith("rs") && t !== "rs",
      language: "Rust",
      score: 0.12,
      confidence: 0.5,
      specificity: 0.36,
    },
    {
      test: (t) => t.endsWith("go") && t !== "go",
      language: "Go",
      score: 0.11,
      confidence: 0.48,
      specificity: 0.34,
    },
    {
      test: (t) => t.endsWith("rb") && t !== "rb",
      language: "Ruby",
      score: 0.11,
      confidence: 0.48,
      specificity: 0.34,
    },
    {
      test: (t) => t.endsWith("php") && t !== "php",
      language: "PHP",
      score: 0.11,
      confidence: 0.48,
      specificity: 0.34,
    },
    {
      test: (t) => t.endsWith("java") && t !== "java",
      language: "Java",
      score: 0.12,
      confidence: 0.5,
      specificity: 0.36,
    },
    {
      test: (t) => t.endsWith("kt") && t !== "kt",
      language: "Kotlin",
      score: 0.12,
      confidence: 0.5,
      specificity: 0.36,
    },
    {
      test: (t) => t.endsWith("swift") && t !== "swift",
      language: "Swift",
      score: 0.12,
      confidence: 0.5,
      specificity: 0.36,
    },
    {
      test: (t) => t.endsWith("cs") && t !== "cs",
      language: "C#",
      score: 0.11,
      confidence: 0.48,
      specificity: 0.34,
    },
    {
      test: (t) =>
        t.endsWith("cpp") || (t.endsWith("cxx") && t !== "cpp" && t !== "cxx"),
      language: "C++",
      score: 0.11,
      confidence: 0.48,
      specificity: 0.34,
    },
    {
      test: (t) => t.endsWith("dart") && t !== "dart",
      language: "Dart",
      score: 0.11,
      confidence: 0.48,
      specificity: 0.34,
    },
    {
      test: (t) => t.endsWith("scala") && t !== "scala",
      language: "Scala",
      score: 0.11,
      confidence: 0.48,
      specificity: 0.34,
    },
    {
      test: (t) =>
        t.endsWith("ex") || (t.endsWith("exs") && t !== "ex" && t !== "exs"),
      language: "Elixir",
      score: 0.11,
      confidence: 0.48,
      specificity: 0.34,
    },
    {
      test: (t) =>
        t.endsWith("clj") ||
        (t.endsWith("cljs") && t !== "clj" && t !== "cljs"),
      language: "Clojure",
      score: 0.11,
      confidence: 0.48,
      specificity: 0.34,
    },
    {
      test: (t) => t.endsWith("hs") && t !== "hs",
      language: "Haskell",
      score: 0.11,
      confidence: 0.48,
      specificity: 0.34,
    },
    {
      test: (t) => t.endsWith("ml") && t !== "ml",
      language: "OCaml",
      score: 0.1,
      confidence: 0.46,
      specificity: 0.32,
    },
    {
      test: (t) => t.endsWith("lua") && t !== "lua",
      language: "Lua",
      score: 0.1,
      confidence: 0.46,
      specificity: 0.32,
    },
    {
      test: (t) => t.endsWith("r") && t.length > 2,
      language: "R",
      score: 0.09,
      confidence: 0.44,
      specificity: 0.28,
    },
    {
      test: (t) => t.endsWith("jl") && t !== "jl",
      language: "Julia",
      score: 0.1,
      confidence: 0.46,
      specificity: 0.32,
    },
    {
      test: (t) => t.endsWith("sh") && t !== "sh",
      language: "Shell",
      score: 0.09,
      confidence: 0.44,
      specificity: 0.28,
    },
    {
      test: (t) => t.endsWith("ps1") && t !== "ps1",
      language: "PowerShell",
      score: 0.1,
      confidence: 0.46,
      specificity: 0.32,
    },
    {
      test: (t) => t.endsWith("sql") && t !== "sql",
      language: "SQL",
      score: 0.1,
      confidence: 0.46,
      specificity: 0.32,
    },
    {
      test: (t) => t.endsWith("tf") && t !== "tf",
      language: "Terraform",
      score: 0.11,
      confidence: 0.48,
      specificity: 0.34,
    },
    {
      test: (t) =>
        t.endsWith("yaml") ||
        (t.endsWith("yml") && t !== "yaml" && t !== "yml"),
      language: "YAML",
      score: 0.09,
      confidence: 0.44,
      specificity: 0.28,
    },
    {
      test: (t) => t.endsWith("json") && t !== "json",
      language: "JSON",
      score: 0.08,
      confidence: 0.42,
      specificity: 0.26,
    },
    {
      test: (t) => t.endsWith("xml") && t !== "xml",
      language: "XML",
      score: 0.08,
      confidence: 0.42,
      specificity: 0.26,
    },
    {
      test: (t) => t.endsWith("toml") && t !== "toml",
      language: "TOML",
      score: 0.09,
      confidence: 0.44,
      specificity: 0.28,
    },
    {
      test: (t) => t.endsWith("proto") && t !== "proto",
      language: "Protobuf",
      score: 0.1,
      confidence: 0.46,
      specificity: 0.32,
    },
  ];

  for (const pattern of suffixPatterns) {
    if (pattern.test(token)) {
      return {
        language: pattern.language,
        score: pattern.score,
        confidence: pattern.confidence,
        specificity: pattern.specificity,
      };
    }
  }

  const containsPatterns: Array<{
    test: (t: string) => boolean;
    language: string;
    score: number;
    confidence: number;
    specificity: number;
  }> = [
    {
      test: (t) => t.includes("k8s") || t.includes("kube"),
      language: "Kubernetes",
      score: 0.14,
      confidence: 0.58,
      specificity: 0.5,
    },
    {
      test: (t) => t.includes("terraform"),
      language: "Terraform",
      score: 0.14,
      confidence: 0.58,
      specificity: 0.52,
    },
    {
      test: (t) => t.includes("python"),
      language: "Python",
      score: 0.13,
      confidence: 0.56,
      specificity: 0.44,
    },
    {
      test: (t) => t.includes("rust"),
      language: "Rust",
      score: 0.13,
      confidence: 0.56,
      specificity: 0.44,
    },
    {
      test: (t) => t.includes("typescript"),
      language: "TypeScript",
      score: 0.13,
      confidence: 0.56,
      specificity: 0.44,
    },
    {
      test: (t) => t.includes("javascript"),
      language: "JavaScript",
      score: 0.13,
      confidence: 0.56,
      specificity: 0.44,
    },
    {
      test: (t) => t.includes("golang"),
      language: "Go",
      score: 0.13,
      confidence: 0.56,
      specificity: 0.46,
    },
    {
      test: (t) => t.includes("docker"),
      language: "Dockerfile",
      score: 0.14,
      confidence: 0.58,
      specificity: 0.5,
    },
    {
      test: (t) => t.includes("react"),
      language: "TypeScript",
      score: 0.13,
      confidence: 0.54,
      specificity: 0.42,
    },
    {
      test: (t) => t.includes("vue"),
      language: "Vue",
      score: 0.13,
      confidence: 0.54,
      specificity: 0.42,
    },
    {
      test: (t) => t.includes("svelte"),
      language: "Svelte",
      score: 0.13,
      confidence: 0.54,
      specificity: 0.42,
    },
    {
      test: (t) => t.includes("angular"),
      language: "TypeScript",
      score: 0.13,
      confidence: 0.54,
      specificity: 0.42,
    },
    {
      test: (t) => t.includes("next"),
      language: "TypeScript",
      score: 0.12,
      confidence: 0.52,
      specificity: 0.38,
    },
    {
      test: (t) =>
        t.includes("django") || t.includes("flask") || t.includes("fastapi"),
      language: "Python",
      score: 0.14,
      confidence: 0.58,
      specificity: 0.5,
    },
    {
      test: (t) => t.includes("spring") || t.includes("hibernate"),
      language: "Java",
      score: 0.14,
      confidence: 0.58,
      specificity: 0.5,
    },
    {
      test: (t) => t.includes("rails"),
      language: "Ruby",
      score: 0.14,
      confidence: 0.58,
      specificity: 0.52,
    },
    {
      test: (t) => t.includes("laravel") || t.includes("symfony"),
      language: "PHP",
      score: 0.14,
      confidence: 0.58,
      specificity: 0.5,
    },
    {
      test: (t) => t.includes("dotnet") || t.includes("aspnet"),
      language: "C#",
      score: 0.14,
      confidence: 0.58,
      specificity: 0.5,
    },
    {
      test: (t) => t.includes("postgres") || t.includes("postgresql"),
      language: "PostgreSQL",
      score: 0.13,
      confidence: 0.56,
      specificity: 0.48,
    },
    {
      test: (t) => t.includes("mysql"),
      language: "MySQL",
      score: 0.13,
      confidence: 0.56,
      specificity: 0.48,
    },
    {
      test: (t) => t.includes("mongo"),
      language: "MongoDB",
      score: 0.13,
      confidence: 0.56,
      specificity: 0.48,
    },
    {
      test: (t) => t.includes("redis"),
      language: "Redis",
      score: 0.13,
      confidence: 0.56,
      specificity: 0.48,
    },
    {
      test: (t) => t.includes("ansible"),
      language: "Ansible",
      score: 0.14,
      confidence: 0.58,
      specificity: 0.52,
    },
    {
      test: (t) => t.includes("puppet"),
      language: "Puppet",
      score: 0.13,
      confidence: 0.56,
      specificity: 0.5,
    },
    {
      test: (t) => t.includes("chef"),
      language: "Ruby",
      score: 0.12,
      confidence: 0.54,
      specificity: 0.44,
    },
    {
      test: (t) => t.includes("helm"),
      language: "Helm",
      score: 0.14,
      confidence: 0.58,
      specificity: 0.52,
    },
    {
      test: (t) => t.includes("pulumi"),
      language: "Pulumi",
      score: 0.14,
      confidence: 0.58,
      specificity: 0.52,
    },
    {
      test: (t) => t.includes("jupyter") || t.includes("notebook"),
      language: "Jupyter",
      score: 0.13,
      confidence: 0.56,
      specificity: 0.48,
    },
    {
      test: (t) => t.includes("pytorch") || t.includes("torch"),
      language: "Python",
      score: 0.14,
      confidence: 0.58,
      specificity: 0.52,
    },
    {
      test: (t) => t.includes("tensorflow"),
      language: "Python",
      score: 0.14,
      confidence: 0.58,
      specificity: 0.52,
    },
    {
      test: (t) => t.includes("cuda") || t.includes("gpu"),
      language: "CUDA",
      score: 0.12,
      confidence: 0.54,
      specificity: 0.46,
    },
    {
      test: (t) => t.includes("bash") || t.includes("shell"),
      language: "Shell",
      score: 0.11,
      confidence: 0.52,
      specificity: 0.4,
    },
    {
      test: (t) => t.includes("powershell") || t.includes("pwsh"),
      language: "PowerShell",
      score: 0.12,
      confidence: 0.54,
      specificity: 0.44,
    },
    {
      test: (t) => t.includes("graphql") || t.includes("gql"),
      language: "GraphQL",
      score: 0.12,
      confidence: 0.54,
      specificity: 0.44,
    },
    {
      test: (t) => t.includes("grpc"),
      language: "Protobuf",
      score: 0.12,
      confidence: 0.54,
      specificity: 0.44,
    },
    {
      test: (t) =>
        t.includes("webpack") || t.includes("rollup") || t.includes("vite"),
      language: "JavaScript",
      score: 0.11,
      confidence: 0.52,
      specificity: 0.38,
    },
    {
      test: (t) => t.includes("tailwind") || t.includes("postcss"),
      language: "CSS",
      score: 0.11,
      confidence: 0.52,
      specificity: 0.38,
    },
    {
      test: (t) => t.includes("sass") || t.includes("scss"),
      language: "SCSS",
      score: 0.11,
      confidence: 0.52,
      specificity: 0.38,
    },
  ];

  for (const pattern of containsPatterns) {
    if (pattern.test(token)) {
      return {
        language: pattern.language,
        score: pattern.score,
        confidence: pattern.confidence,
        specificity: pattern.specificity,
      };
    }
  }

  return null;
}

function fromRepoTokenFrequency(
  tokens: string[],
  source: EvidenceSource,
  sourceWeight: number,
  policy: ResolvedEvidencePolicy,
): SkillEvidenceSignal[] {
  const counts = new Map<string, number>();
  const penalties = new Map<string, number>();

  for (const token of tokens) {
    const penalty = noisePenaltyForToken(token);
    if (isHardNoiseToken(token)) continue;

    if (NOISE_TOKENS.has(token) && penalty >= 0.9) continue;

    const contribution = clamp(1 - penalty * 0.72, 0.08, 1);
    counts.set(token, (counts.get(token) || 0) + contribution);
    penalties.set(token, Math.max(penalties.get(token) || 0, penalty));
  }

  const signals: SkillEvidenceSignal[] = [];

  for (const [token, weightedCount] of counts.entries()) {
    const matched = scoreTokenMatch(token);
    if (!matched) continue;

    const penalty = penalties.get(token) || 0;

    const repetitionBoost = clamp(
      1 + Math.log2(1 + weightedCount) * 0.2,
      1,
      1.4,
    );
    const precisionModifier = policy.preferPrecisionOverRecall
      ? clamp(0.8 + matched.specificity * 0.28, 0.72, 1.2)
      : 1;
    const noiseScoreModifier = clamp(1 - penalty * 0.65, 0.22, 1);
    const noiseConfidenceModifier = clamp(1 - penalty * 0.45, 0.35, 1);

    const score = clamp(
      matched.score *
        repetitionBoost *
        sourceWeight *
        precisionModifier *
        noiseScoreModifier,
      0.05,
      0.42,
    );

    const confidence =
      source === "repo-name"
        ? clamp((matched.confidence + 0.05) * noiseConfidenceModifier, 0, 1)
        : clamp((matched.confidence - 0.02) * noiseConfidenceModifier, 0, 1);

    signals.push(
      makeSignal(
        matched.language,
        source,
        score,
        confidence,
        source === "repo-name"
          ? `Repository name token '${token}' suggests ${matched.language}`
          : `Repository description token '${token}' suggests ${matched.language}`,
        token,
      ),
    );

    if (policy.includeAliasSignals && LANGUAGE_ALIASES[token]) {
      const canonical = LANGUAGE_ALIASES[token];
      signals.push(
        makeSignal(
          canonical,
          "language-alias",
          clamp(score * 0.78, 0.04, 0.35),
          clamp(confidence * 0.9, 0, 1),
          `Alias token '${token}' canonicalizes to ${canonical}`,
          token,
        ),
      );
    }
  }

  return signals;
}

function fromRegexHints(
  corpus: string,
  source: EvidenceSource,
  sourceWeight: number,
  policy: ResolvedEvidencePolicy,
): SkillEvidenceSignal[] {
  if (!policy.includeRegexSignals) return [];

  const signals: SkillEvidenceSignal[] = [];

  for (const hint of TEXT_REGEX_HINTS) {
    if (!hint.pattern.test(corpus)) continue;

    const precisionModifier = policy.preferPrecisionOverRecall
      ? clamp(0.84 + hint.specificity * 0.2, 0.72, 1.16)
      : 1;

    signals.push(
      makeSignal(
        hint.language,
        "ecosystem-keywords",
        hint.score *
          sourceWeight *
          policy.regexSignalWeight *
          precisionModifier,
        hint.confidence,
        `Regex hint '${hint.pattern.source}' matched ${source === "repo-name" ? "repository name" : "repository description"}`,
        normalizeToken(hint.language),
      ),
    );
  }

  return rankSignals(signals, 0, policy.maxRegexSignals);
}

function fromRepoText(
  input: RepositoryEvidenceInput,
  policy: ResolvedEvidencePolicy,
): SkillEvidenceSignal[] {
  if (!policy.includeTextSignals) return [];

  const nameText = [input.name, input.fullName].filter(Boolean).join(" ");
  const descriptionText = input.description || "";
  const corpus = `${nameText} ${descriptionText}`.trim();
  if (!corpus) return [];

  const nameTokens = splitTokens(nameText, policy.tokenMinLength);
  const descriptionTokens = splitTokens(descriptionText, policy.tokenMinLength);

  const nameSignals = fromRepoTokenFrequency(
    nameTokens,
    "repo-name",
    policy.textSignalWeight * 1.05,
    policy,
  );
  const descriptionSignals = fromRepoTokenFrequency(
    descriptionTokens,
    "repo-description",
    policy.textSignalWeight * 0.92,
    policy,
  );

  const regexNameSignals = fromRegexHints(
    nameText,
    "repo-name",
    policy.textSignalWeight * 1.04,
    policy,
  );
  const regexDescriptionSignals = fromRegexHints(
    descriptionText,
    "repo-description",
    policy.textSignalWeight * 0.95,
    policy,
  );

  return rankSignals(
    dedupeBestSignals([
      ...nameSignals,
      ...descriptionSignals,
      ...regexNameSignals,
      ...regexDescriptionSignals,
    ]),
    0,
    policy.maxTextSignals,
  );
}

function fromLicense(
  input: RepositoryEvidenceInput,
  policy: ResolvedEvidencePolicy,
): SkillEvidenceSignal[] {
  if (!policy.includeLicenseSignals) return [];

  const text = `${input.name} ${input.description || ""}`.toLowerCase();
  const signals: SkillEvidenceSignal[] = [];

  for (const [fragment, language] of Object.entries(LICENSE_LANGUAGE_HINTS)) {
    if (!text.includes(fragment)) continue;

    signals.push(
      makeSignal(
        language,
        "license",
        0.08,
        0.3,
        `Repository text contains license keyword '${fragment}', weak signal for ${language}`,
        normalizeToken(fragment),
      ),
    );
  }

  return signals;
}

function fromRepoMetadata(
  input: RepositoryEvidenceInput,
  policy: ResolvedEvidencePolicy,
): SkillEvidenceSignal[] {
  if (!policy.includeMetadataSignals) return [];

  const signals: SkillEvidenceSignal[] = [];

  if (input.hasPages) {
    signals.push(
      makeSignal(
        "HTML",
        "repo-metadata",
        0.08,
        0.4,
        "Repository has GitHub Pages enabled, weak static-web implementation signal",
        "has-pages",
      ),
    );
  }

  if (input.hasWiki) {
    signals.push(
      makeSignal(
        "Markdown",
        "repo-metadata",
        0.05,
        0.3,
        "Repository has wiki enabled, weak documentation-system signal",
        "has-wiki",
      ),
    );
  }

  return signals;
}

function fromNegativeContext(
  input: RepositoryEvidenceInput,
  policy: ResolvedEvidencePolicy,
): SkillEvidenceSignal[] {
  if (!policy.includeNegativeSignals) return [];

  const text = [
    input.name,
    input.fullName,
    input.description || "",
    ...(input.topics || []),
  ]
    .join(" ")
    .toLowerCase();

  const signals: SkillEvidenceSignal[] = [];

  for (const hint of NEGATIVE_CONTEXT_HINTS) {
    if (!hint.pattern.test(text)) continue;

    signals.push(
      makeSignal(
        hint.tag,
        "negative-context",
        hint.penalty,
        0.22,
        `Negative context '${hint.tag}' detected from repository metadata`,
        normalizeToken(hint.tag),
      ),
    );
  }

  return signals;
}

function fromRepoFlags(input: RepositoryEvidenceInput): SkillEvidenceSignal[] {
  const signals: SkillEvidenceSignal[] = [];

  if (input.isFork) {
    signals.push(
      makeSignal(
        "ForkedRepository",
        "repo-flags",
        0.04,
        0.2,
        "Repository is a fork; this is a weak confidence penalty context signal",
      ),
    );
  }

  if (input.isArchived || input.isDisabled) {
    signals.push(
      makeSignal(
        "InactiveRepository",
        "repo-flags",
        0.05,
        0.25,
        "Repository is archived/disabled; this is a weak recency-quality context signal",
      ),
    );
  }

  return signals;
}

export function collectRepositoryEvidence(
  input: RepositoryEvidenceInput,
  policy: EvidencePolicy,
): SkillEvidenceSignal[] {
  const resolved = resolvePolicy(policy);
  const allSignals: SkillEvidenceSignal[] = [];

  allSignals.push(...fromPrimaryLanguage(input, resolved));
  allSignals.push(...fromLanguageBytes(input, resolved));
  allSignals.push(...fromRepoFlags(input));

  if (resolved.includeTopicSignals) {
    allSignals.push(...fromTopics(input, resolved));
  }

  if (resolved.includeTextSignals) {
    allSignals.push(...fromRepoText(input, resolved));
  }

  if (resolved.includeLicenseSignals) {
    allSignals.push(...fromLicense(input, resolved));
  }

  if (resolved.includeMetadataSignals) {
    allSignals.push(...fromRepoMetadata(input, resolved));
  }

  if (resolved.includeNegativeSignals) {
    allSignals.push(...fromNegativeContext(input, resolved));
  }

  const deduped = dedupeBestSignals(allSignals);

  return rankSignals(
    deduped,
    resolved.minimumSignalScore,
    resolved.maxSignalsPerRepo,
  );
}

export interface LanguageEvidenceAggregate {
  language: string;
  category: TechStack["category"];
  scoreSum: number;
  confidenceWeightedScore: number;
  sourceCounts: Record<EvidenceSource, number>;
  uniqueTokens: Set<string>;
  highlights: Set<string>;
  repositories: Set<string>;
}

export function initializeLanguageEvidenceAggregate(
  language: string,
): LanguageEvidenceAggregate {
  return {
    language,
    category: inferCategory(language),
    scoreSum: 0,
    confidenceWeightedScore: 0,
    sourceCounts: {
      "primary-language": 0,
      "language-bytes": 0,
      topics: 0,
      "repo-name": 0,
      "repo-description": 0,
      license: 0,
      "repo-flags": 0,
      "ecosystem-keywords": 0,
      "topic-synonyms": 0,
      "language-alias": 0,
      "repo-metadata": 0,
      "negative-context": 0,
    },
    uniqueTokens: new Set<string>(),
    highlights: new Set<string>(),
    repositories: new Set<string>(),
  };
}

export function applyEvidenceSignals(
  aggregate: LanguageEvidenceAggregate,
  repoFullName: string,
  signals: SkillEvidenceSignal[],
): LanguageEvidenceAggregate {
  const next = aggregate;

  for (const signal of signals) {
    if (signal.language !== next.language) continue;

    next.scoreSum += signal.score;
    next.confidenceWeightedScore += signal.score * signal.confidence;
    next.sourceCounts[signal.source] += 1;
    if (signal.token) next.uniqueTokens.add(signal.token);
    next.highlights.add(signal.detail);
    next.repositories.add(repoFullName);
  }

  return next;
}

export function evidenceSourceDiversity(
  sourceCounts: Record<EvidenceSource, number>,
): number {
  const entries = Object.entries(sourceCounts) as [EvidenceSource, number][];
  const eligible = entries.filter(
    ([source]) => !RESERVED_CONFIDENCE_SOURCES.has(source),
  );
  const used = eligible.filter(([, count]) => count > 0).length;

  return clamp(used / Math.max(1, eligible.length), 0, 1);
}

export function evidenceRepositoryCoverage(
  repoHits: number,
  totalRepos: number,
): number {
  if (totalRepos <= 0) return 0;
  return clamp(repoHits / totalRepos, 0, 1);
}

export function evidenceTokenDiversity(tokenCount: number): number {
  return clamp(Math.log2(1 + tokenCount) / 3.5, 0, 1);
}

export function evidenceConfidenceScore(
  aggregate: LanguageEvidenceAggregate,
  totalRepos: number,
): number {
  const sourceDiversity = evidenceSourceDiversity(aggregate.sourceCounts);
  const coverage = evidenceRepositoryCoverage(
    aggregate.repositories.size,
    totalRepos,
  );
  const tokenDiversity = evidenceTokenDiversity(aggregate.uniqueTokens.size);

  const weightedDensity = clamp(
    aggregate.confidenceWeightedScore /
      Math.max(1, aggregate.scoreSum + aggregate.repositories.size * 0.15),
    0,
    1,
  );

  const score =
    weightedDensity * 0.46 +
    coverage * 0.24 +
    sourceDiversity * 0.18 +
    tokenDiversity * 0.12;

  return clamp(score, 0, 1);
}

export function summarizeEvidenceHighlights(
  highlights: Set<string>,
  maxItems: number,
): string[] {
  return Array.from(highlights)
    .slice(0, Math.max(1, maxItems))
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function mergeCategoryFromEvidence(
  current: TechStack["category"],
  evidenceCategory: TechStack["category"],
  confidence: number,
): TechStack["category"] {
  if (confidence >= 0.62) {
    return evidenceCategory;
  }
  return current;
}

export function normalizeEvidencePolicy(
  policy: Partial<EvidencePolicy> | undefined,
): EvidencePolicy {
  return {
    includeTopicSignals: policy?.includeTopicSignals ?? true,
    includeTextSignals: policy?.includeTextSignals ?? false,
    includeLicenseSignals: policy?.includeLicenseSignals ?? false,
    minimumSignalScore: clamp(policy?.minimumSignalScore ?? 0.06, 0, 1),
    maxSignalsPerRepo: Math.max(
      1,
      Math.min(100, policy?.maxSignalsPerRepo ?? 40),
    ),
    includeRegexSignals: policy?.includeRegexSignals ?? true,
    includeAliasSignals: policy?.includeAliasSignals ?? true,
    includeNegativeSignals: policy?.includeNegativeSignals ?? true,
    includeMetadataSignals: policy?.includeMetadataSignals ?? true,
    topicSignalWeight: clamp(policy?.topicSignalWeight ?? 1, 0.2, 2.2),
    textSignalWeight: clamp(policy?.textSignalWeight ?? 1, 0.2, 2.2),
    regexSignalWeight: clamp(policy?.regexSignalWeight ?? 1, 0.2, 2.2),
    languageByteSignalWeight: clamp(
      policy?.languageByteSignalWeight ?? 1,
      0.2,
      2.2,
    ),
    primaryLanguageSignalWeight: clamp(
      policy?.primaryLanguageSignalWeight ?? 1,
      0.2,
      2.2,
    ),
    maxTopicSignals: Math.max(1, Math.min(200, policy?.maxTopicSignals ?? 50)),
    maxTextSignals: Math.max(1, Math.min(200, policy?.maxTextSignals ?? 80)),
    maxRegexSignals: Math.max(1, Math.min(200, policy?.maxRegexSignals ?? 50)),
    tokenMinLength: Math.max(2, Math.min(16, policy?.tokenMinLength ?? 2)),
    preferPrecisionOverRecall: policy?.preferPrecisionOverRecall ?? true,
  };
}

export function scorePenaltyFromContextSignals(
  signals: SkillEvidenceSignal[],
): number {
  const countByTag = (tag: string): number =>
    signals.filter(
      (signal) =>
        (signal.source === "repo-flags" ||
          signal.source === "negative-context") &&
        signal.language === tag,
    ).length;

  const forkContext = countByTag("ForkedRepository");
  const inactiveContext = countByTag("InactiveRepository");
  const templateContext = countByTag("TemplateRepository");
  const exampleContext = countByTag("ExampleRepository");
  const experimentalContext = countByTag("ExperimentalRepository");
  const configContext = countByTag("ConfigRepository");
  const curatedContext = countByTag("CuratedListRepository");
  const legacyContext = countByTag("LegacyRepository");

  const penalty = clamp(
    forkContext * 0.015 +
      inactiveContext * 0.025 +
      templateContext * 0.022 +
      exampleContext * 0.016 +
      experimentalContext * 0.014 +
      configContext * 0.012 +
      curatedContext * 0.015 +
      legacyContext * 0.02,
    0,
    0.24,
  );

  return penalty;
}

function isContextOnlySignal(signal: SkillEvidenceSignal): boolean {
  if (CONTEXT_ONLY_LANGUAGE_TAGS.has(signal.language)) return true;
  if (signal.source === "repo-flags" || signal.source === "negative-context")
    return true;
  return false;
}

export function extractLanguagesFromSignals(
  signals: SkillEvidenceSignal[],
): Set<string> {
  const languages = new Set<string>();
  for (const signal of signals) {
    if (isContextOnlySignal(signal)) continue;
    languages.add(signal.language);
  }
  return languages;
}

export function collectSignalsByLanguage(
  signals: SkillEvidenceSignal[],
): Map<string, SkillEvidenceSignal[]> {
  const map = new Map<string, SkillEvidenceSignal[]>();
  for (const signal of signals) {
    if (isContextOnlySignal(signal)) continue;

    const current = map.get(signal.language) || [];
    current.push(signal);
    map.set(signal.language, current);
  }

  return map;
}
