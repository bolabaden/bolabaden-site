import { TechStack } from "@/lib/types";
import {
  getLanguageAliasMap,
  getLanguageCategoryHints,
  getTaxonomyProfileSnapshots,
  getTaxonomyWeightedKeywords,
  getTaxonomyRegexRules,
  inferLanguageCategoryExpert,
} from "@/lib/skills-language-taxonomy";

export interface WeightedLanguageHint {
  language: string;
  score: number;
  confidence: number;
  specificity: number;
}

export interface RegexLanguageHint {
  pattern: RegExp;
  language: string;
  score: number;
  confidence: number;
  specificity: number;
}

export interface NegativeContextHint {
  pattern: RegExp;
  tag: string;
  penalty: number;
}

const LANGUAGE_ALIASES_OVERRIDES: Record<string, string> = {
  js: "JavaScript",
  javascript: "JavaScript",
  node: "JavaScript",
  nodejs: "JavaScript",
  express: "JavaScript",
  koa: "JavaScript",
  hapi: "JavaScript",
  denojs: "TypeScript",

  ts: "TypeScript",
  typescript: "TypeScript",
  deno: "TypeScript",
  bun: "TypeScript",
  nest: "TypeScript",
  nestjs: "TypeScript",
  react: "TypeScript",
  next: "TypeScript",
  nextjs: "TypeScript",
  tsc: "TypeScript",

  vue: "Vue",
  vuejs: "Vue",
  nuxt: "Vue",
  nuxtjs: "Vue",
  svelte: "Svelte",
  astro: "Astro",
  angular: "TypeScript",
  angularjs: "TypeScript",
  solidjs: "Solid",
  solid: "Solid",

  html: "HTML",
  css: "CSS",
  scss: "SCSS",
  sass: "Sass",
  less: "Less",
  stylus: "Stylus",
  tailwind: "CSS",
  postcss: "CSS",

  py: "Python",
  python: "Python",
  django: "Python",
  flask: "Python",
  fastapi: "Python",
  pandas: "Python",
  numpy: "Python",
  pydantic: "Python",
  poetry: "Python",
  uv: "Python",
  pip: "Python",
  jupyter: "Jupyter",
  ipynb: "Jupyter",
  pytorch: "Python",
  tensorflow: "Python",
  sklearn: "Python",
  xgboost: "Python",
  airflow: "Python",
  spark: "Python",

  go: "Go",
  golang: "Go",
  gin: "Go",
  fiber: "Go",
  grpc: "Go",
  echo: "Go",

  rust: "Rust",
  cargo: "Rust",
  tokio: "Rust",
  axum: "Rust",
  actix: "Rust",
  bevy: "Rust",

  java: "Java",
  spring: "Java",
  kotlin: "Kotlin",
  gradle: "Java",
  maven: "Java",
  quarkus: "Java",

  csharp: "C#",
  dotnet: "C#",
  aspnet: "C#",
  net: "C#",
  cs: "C#",

  cpp: "C++",
  "c++": "C++",
  cmake: "C++",
  c: "C",

  ruby: "Ruby",
  rails: "Ruby",
  ror: "Ruby",

  php: "PHP",
  laravel: "PHP",
  symfony: "PHP",

  swift: "Swift",
  ios: "Swift",

  dart: "Dart",
  flutter: "Dart",

  sql: "SQL",
  postgres: "PostgreSQL",
  postgresql: "PostgreSQL",
  mysql: "MySQL",
  sqlite: "SQLite",
  mongodb: "MongoDB",
  mongo: "MongoDB",
  redis: "Redis",
  prisma: "SQL",
  orm: "SQL",
  clickhouse: "ClickHouse",
  cassandra: "Cassandra",
  dynamodb: "DynamoDB",

  docker: "Dockerfile",
  dockerfile: "Dockerfile",
  compose: "YAML",
  kubernetes: "Kubernetes",
  k8s: "Kubernetes",
  helm: "Helm",
  terraform: "Terraform",
  hcl: "HCL",
  ansible: "Ansible",
  pulumi: "Pulumi",
  bicep: "Bicep",
  nix: "Nix",
  bash: "Bash",
  shell: "Shell",
  sh: "Shell",
  zsh: "Shell",
  powershell: "PowerShell",
  ps1: "PowerShell",
  make: "Makefile",
  makefile: "Makefile",
  yaml: "YAML",
  yml: "YAML",
  githubactions: "YAML",

  cuda: "CUDA",
  triton: "Python",
  llm: "Python",
  rag: "Python",
  ml: "Python",
  ai: "Python",
  r: "R",
  matlab: "Python",
};

const TOKEN_LANGUAGE_HINTS_OVERRIDES: Record<string, WeightedLanguageHint> = {
  nextjs: {
    language: "TypeScript",
    score: 0.24,
    confidence: 0.8,
    specificity: 0.9,
  },
  vite: {
    language: "TypeScript",
    score: 0.2,
    confidence: 0.74,
    specificity: 0.72,
  },
  webpack: {
    language: "JavaScript",
    score: 0.19,
    confidence: 0.68,
    specificity: 0.68,
  },
  rollup: {
    language: "JavaScript",
    score: 0.19,
    confidence: 0.68,
    specificity: 0.68,
  },
  turborepo: {
    language: "TypeScript",
    score: 0.22,
    confidence: 0.76,
    specificity: 0.8,
  },
  nx: {
    language: "TypeScript",
    score: 0.12,
    confidence: 0.48,
    specificity: 0.4,
  },

  django: {
    language: "Python",
    score: 0.25,
    confidence: 0.82,
    specificity: 0.92,
  },
  flask: {
    language: "Python",
    score: 0.22,
    confidence: 0.78,
    specificity: 0.86,
  },
  fastapi: {
    language: "Python",
    score: 0.25,
    confidence: 0.84,
    specificity: 0.94,
  },
  pydantic: {
    language: "Python",
    score: 0.22,
    confidence: 0.76,
    specificity: 0.82,
  },
  celery: {
    language: "Python",
    score: 0.2,
    confidence: 0.7,
    specificity: 0.72,
  },
  airflow: {
    language: "Python",
    score: 0.22,
    confidence: 0.72,
    specificity: 0.78,
  },

  springboot: {
    language: "Java",
    score: 0.26,
    confidence: 0.84,
    specificity: 0.94,
  },
  spring: { language: "Java", score: 0.23, confidence: 0.8, specificity: 0.86 },
  quarkus: {
    language: "Java",
    score: 0.22,
    confidence: 0.74,
    specificity: 0.78,
  },

  dotnet: { language: "C#", score: 0.24, confidence: 0.82, specificity: 0.88 },
  aspnet: { language: "C#", score: 0.24, confidence: 0.82, specificity: 0.9 },
  blazor: { language: "C#", score: 0.22, confidence: 0.76, specificity: 0.8 },

  rails: { language: "Ruby", score: 0.24, confidence: 0.82, specificity: 0.9 },
  laravel: { language: "PHP", score: 0.24, confidence: 0.82, specificity: 0.9 },
  symfony: { language: "PHP", score: 0.22, confidence: 0.76, specificity: 0.8 },

  postgres: {
    language: "PostgreSQL",
    score: 0.22,
    confidence: 0.78,
    specificity: 0.84,
  },
  mysql: { language: "MySQL", score: 0.2, confidence: 0.74, specificity: 0.78 },
  mongodb: {
    language: "MongoDB",
    score: 0.22,
    confidence: 0.78,
    specificity: 0.84,
  },
  redis: {
    language: "Redis",
    score: 0.22,
    confidence: 0.78,
    specificity: 0.84,
  },
  sqlite: {
    language: "SQLite",
    score: 0.2,
    confidence: 0.72,
    specificity: 0.76,
  },
  prisma: { language: "SQL", score: 0.16, confidence: 0.62, specificity: 0.6 },

  docker: {
    language: "Dockerfile",
    score: 0.21,
    confidence: 0.78,
    specificity: 0.8,
  },
  kubernetes: {
    language: "Kubernetes",
    score: 0.24,
    confidence: 0.84,
    specificity: 0.92,
  },
  helm: { language: "Helm", score: 0.24, confidence: 0.84, specificity: 0.92 },
  terraform: {
    language: "Terraform",
    score: 0.24,
    confidence: 0.84,
    specificity: 0.92,
  },
  ansible: {
    language: "Ansible",
    score: 0.23,
    confidence: 0.8,
    specificity: 0.88,
  },
  pulumi: {
    language: "Pulumi",
    score: 0.23,
    confidence: 0.8,
    specificity: 0.88,
  },
  bicep: { language: "Bicep", score: 0.23, confidence: 0.8, specificity: 0.88 },
  nomad: { language: "HCL", score: 0.2, confidence: 0.72, specificity: 0.76 },

  githubactions: {
    language: "YAML",
    score: 0.19,
    confidence: 0.66,
    specificity: 0.66,
  },
  githubaction: {
    language: "YAML",
    score: 0.19,
    confidence: 0.66,
    specificity: 0.66,
  },
  workflow: {
    language: "YAML",
    score: 0.12,
    confidence: 0.45,
    specificity: 0.35,
  },

  pytorch: {
    language: "Python",
    score: 0.24,
    confidence: 0.82,
    specificity: 0.9,
  },
  tensorflow: {
    language: "Python",
    score: 0.24,
    confidence: 0.82,
    specificity: 0.9,
  },
  huggingface: {
    language: "Python",
    score: 0.22,
    confidence: 0.74,
    specificity: 0.78,
  },
  langchain: {
    language: "Python",
    score: 0.22,
    confidence: 0.74,
    specificity: 0.78,
  },
  llamaindex: {
    language: "Python",
    score: 0.22,
    confidence: 0.74,
    specificity: 0.78,
  },
  triton: {
    language: "Python",
    score: 0.2,
    confidence: 0.68,
    specificity: 0.7,
  },
  onnx: {
    language: "Python",
    score: 0.18,
    confidence: 0.64,
    specificity: 0.62,
  },
  cuda: { language: "CUDA", score: 0.24, confidence: 0.82, specificity: 0.9 },
};

const TOPIC_LANGUAGE_HINTS_OVERRIDES: Record<string, WeightedLanguageHint> = {
  typescript: {
    language: "TypeScript",
    score: 0.3,
    confidence: 0.84,
    specificity: 0.94,
  },
  javascript: {
    language: "JavaScript",
    score: 0.28,
    confidence: 0.8,
    specificity: 0.9,
  },
  nodejs: {
    language: "JavaScript",
    score: 0.28,
    confidence: 0.8,
    specificity: 0.9,
  },
  react: {
    language: "TypeScript",
    score: 0.24,
    confidence: 0.74,
    specificity: 0.76,
  },
  nextjs: {
    language: "TypeScript",
    score: 0.28,
    confidence: 0.82,
    specificity: 0.92,
  },
  vue: { language: "Vue", score: 0.28, confidence: 0.8, specificity: 0.9 },
  svelte: {
    language: "Svelte",
    score: 0.28,
    confidence: 0.8,
    specificity: 0.9,
  },
  astro: { language: "Astro", score: 0.28, confidence: 0.8, specificity: 0.9 },
  frontend: {
    language: "TypeScript",
    score: 0.14,
    confidence: 0.5,
    specificity: 0.32,
  },

  python: {
    language: "Python",
    score: 0.3,
    confidence: 0.84,
    specificity: 0.94,
  },
  fastapi: {
    language: "Python",
    score: 0.29,
    confidence: 0.83,
    specificity: 0.92,
  },
  django: {
    language: "Python",
    score: 0.29,
    confidence: 0.83,
    specificity: 0.92,
  },
  flask: {
    language: "Python",
    score: 0.27,
    confidence: 0.78,
    specificity: 0.82,
  },
  backend: {
    language: "Python",
    score: 0.14,
    confidence: 0.5,
    specificity: 0.32,
  },

  go: { language: "Go", score: 0.3, confidence: 0.84, specificity: 0.94 },
  golang: { language: "Go", score: 0.3, confidence: 0.84, specificity: 0.94 },
  rust: { language: "Rust", score: 0.3, confidence: 0.84, specificity: 0.94 },
  java: { language: "Java", score: 0.3, confidence: 0.84, specificity: 0.94 },
  kotlin: {
    language: "Kotlin",
    score: 0.3,
    confidence: 0.84,
    specificity: 0.94,
  },
  csharp: { language: "C#", score: 0.3, confidence: 0.84, specificity: 0.94 },
  dotnet: { language: "C#", score: 0.28, confidence: 0.8, specificity: 0.88 },
  ruby: { language: "Ruby", score: 0.3, confidence: 0.84, specificity: 0.94 },
  rails: { language: "Ruby", score: 0.28, confidence: 0.8, specificity: 0.88 },
  php: { language: "PHP", score: 0.3, confidence: 0.84, specificity: 0.94 },
  laravel: { language: "PHP", score: 0.28, confidence: 0.8, specificity: 0.88 },
  swift: { language: "Swift", score: 0.3, confidence: 0.84, specificity: 0.94 },
  dart: { language: "Dart", score: 0.3, confidence: 0.84, specificity: 0.94 },
  flutter: {
    language: "Dart",
    score: 0.28,
    confidence: 0.8,
    specificity: 0.88,
  },

  devops: {
    language: "Shell",
    score: 0.16,
    confidence: 0.52,
    specificity: 0.36,
  },
  infra: {
    language: "Terraform",
    score: 0.18,
    confidence: 0.58,
    specificity: 0.46,
  },
  infrastructure: {
    language: "Terraform",
    score: 0.18,
    confidence: 0.58,
    specificity: 0.46,
  },
  kubernetes: {
    language: "Kubernetes",
    score: 0.3,
    confidence: 0.84,
    specificity: 0.94,
  },
  k8s: {
    language: "Kubernetes",
    score: 0.3,
    confidence: 0.84,
    specificity: 0.94,
  },
  helm: { language: "Helm", score: 0.3, confidence: 0.84, specificity: 0.94 },
  terraform: {
    language: "Terraform",
    score: 0.3,
    confidence: 0.84,
    specificity: 0.94,
  },
  ansible: {
    language: "Ansible",
    score: 0.3,
    confidence: 0.84,
    specificity: 0.94,
  },
  pulumi: {
    language: "Pulumi",
    score: 0.3,
    confidence: 0.84,
    specificity: 0.94,
  },
  bicep: { language: "Bicep", score: 0.3, confidence: 0.84, specificity: 0.94 },
  docker: {
    language: "Dockerfile",
    score: 0.28,
    confidence: 0.8,
    specificity: 0.9,
  },

  postgresql: {
    language: "PostgreSQL",
    score: 0.29,
    confidence: 0.83,
    specificity: 0.92,
  },
  mysql: {
    language: "MySQL",
    score: 0.29,
    confidence: 0.83,
    specificity: 0.92,
  },
  sqlite: {
    language: "SQLite",
    score: 0.27,
    confidence: 0.78,
    specificity: 0.82,
  },
  mongodb: {
    language: "MongoDB",
    score: 0.29,
    confidence: 0.83,
    specificity: 0.92,
  },
  redis: {
    language: "Redis",
    score: 0.29,
    confidence: 0.83,
    specificity: 0.92,
  },
  sql: { language: "SQL", score: 0.2, confidence: 0.62, specificity: 0.58 },
  database: {
    language: "SQL",
    score: 0.17,
    confidence: 0.56,
    specificity: 0.44,
  },

  ai: { language: "Python", score: 0.18, confidence: 0.6, specificity: 0.48 },
  ml: { language: "Python", score: 0.19, confidence: 0.62, specificity: 0.52 },
  machinelearning: {
    language: "Python",
    score: 0.21,
    confidence: 0.66,
    specificity: 0.58,
  },
  deeplearning: {
    language: "Python",
    score: 0.22,
    confidence: 0.68,
    specificity: 0.64,
  },
  llm: { language: "Python", score: 0.21, confidence: 0.66, specificity: 0.6 },
  rag: { language: "Python", score: 0.2, confidence: 0.64, specificity: 0.58 },
  jupyter: {
    language: "Jupyter",
    score: 0.28,
    confidence: 0.8,
    specificity: 0.88,
  },
  cuda: { language: "CUDA", score: 0.28, confidence: 0.8, specificity: 0.88 },
};

const TAXONOMY_PROFILE_SNAPSHOTS = getTaxonomyProfileSnapshots();

function normalizeAliasMapKeys(
  aliases: Record<string, string>,
): Record<string, string> {
  const normalized: Record<string, string> = {};
  for (const [token, language] of Object.entries(aliases)) {
    const key = normalizeHintToken(token);
    if (!key) continue;
    normalized[key] = language;
  }
  return normalized;
}

function normalizeHintMapKeys(
  map: Record<string, WeightedLanguageHint>,
): Record<string, WeightedLanguageHint> {
  const normalized: Record<string, WeightedLanguageHint> = {};
  for (const [token, hint] of Object.entries(map)) {
    const key = normalizeHintToken(token);
    if (!key) continue;
    normalized[key] = hint;
  }
  return normalized;
}

function upsertWeightedHint(
  map: Record<string, WeightedLanguageHint>,
  token: string,
  hint: WeightedLanguageHint,
): void {
  const key = normalizeHintToken(token);
  if (!key) return;

  const existing = map[key];
  if (!existing) {
    map[key] = hint;
    return;
  }

  const existingPower = existing.score * existing.confidence;
  const nextPower = hint.score * hint.confidence;
  if (
    nextPower > existingPower ||
    (nextPower === existingPower && hint.specificity > existing.specificity)
  ) {
    map[key] = hint;
  }
}

function buildTaxonomyAliasDefaults(): Record<string, string> {
  const aliasMap = normalizeAliasMapKeys(getLanguageAliasMap());

  for (const profile of TAXONOMY_PROFILE_SNAPSHOTS) {
    aliasMap[normalizeHintToken(profile.name)] = profile.name;
    for (const alias of profile.aliases) {
      const key = normalizeHintToken(alias);
      if (!key) continue;
      aliasMap[key] = profile.name;
    }
  }

  return aliasMap;
}

function buildTaxonomyTokenHintDefaults(): Record<
  string,
  WeightedLanguageHint
> {
  const hints: Record<string, WeightedLanguageHint> = {};

  for (const profile of TAXONOMY_PROFILE_SNAPSHOTS) {
    upsertWeightedHint(hints, profile.name, {
      language: profile.name,
      score: 0.2,
      confidence: 0.74,
      specificity: 0.76,
    });

    for (const alias of profile.aliases) {
      const normalizedAlias = normalizeHintToken(alias);
      const shortToken = normalizedAlias.length <= 2;
      upsertWeightedHint(hints, alias, {
        language: profile.name,
        score: shortToken ? 0.12 : 0.18,
        confidence: shortToken ? 0.52 : 0.68,
        specificity: shortToken ? 0.34 : 0.62,
      });
    }

    for (const ecosystem of profile.ecosystems) {
      upsertWeightedHint(hints, ecosystem, {
        language: profile.name,
        score: 0.16,
        confidence: 0.62,
        specificity: 0.58,
      });
    }

    for (const tag of profile.tags) {
      upsertWeightedHint(hints, tag, {
        language: profile.name,
        score: 0.12,
        confidence: 0.54,
        specificity: 0.46,
      });
    }
  }

  return hints;
}

function buildTaxonomyTopicHintDefaults(): Record<
  string,
  WeightedLanguageHint
> {
  const hints: Record<string, WeightedLanguageHint> = {};

  for (const profile of TAXONOMY_PROFILE_SNAPSHOTS) {
    upsertWeightedHint(hints, profile.name, {
      language: profile.name,
      score: 0.24,
      confidence: 0.78,
      specificity: 0.84,
    });

    for (const alias of profile.aliases) {
      upsertWeightedHint(hints, alias, {
        language: profile.name,
        score: 0.22,
        confidence: 0.74,
        specificity: 0.8,
      });
    }

    for (const ecosystem of profile.ecosystems) {
      upsertWeightedHint(hints, ecosystem, {
        language: profile.name,
        score: 0.2,
        confidence: 0.7,
        specificity: 0.72,
      });
    }

    for (const tag of profile.tags) {
      upsertWeightedHint(hints, tag, {
        language: profile.name,
        score: 0.16,
        confidence: 0.6,
        specificity: 0.54,
      });
    }
  }

  return hints;
}

const LANGUAGE_ALIASES_DEFAULTS = buildTaxonomyAliasDefaults();
const TOKEN_LANGUAGE_HINTS_DEFAULTS = buildTaxonomyTokenHintDefaults();
const TOPIC_LANGUAGE_HINTS_DEFAULTS = buildTaxonomyTopicHintDefaults();

export const LANGUAGE_ALIASES: Record<string, string> = Object.freeze({
  ...LANGUAGE_ALIASES_DEFAULTS,
  ...normalizeAliasMapKeys(LANGUAGE_ALIASES_OVERRIDES),
});

export const TOKEN_LANGUAGE_HINTS: Record<string, WeightedLanguageHint> =
  Object.freeze({
    ...TOKEN_LANGUAGE_HINTS_DEFAULTS,
    ...normalizeHintMapKeys(TOKEN_LANGUAGE_HINTS_OVERRIDES),
  });

export const TOPIC_LANGUAGE_HINTS: Record<string, WeightedLanguageHint> =
  Object.freeze({
    ...TOPIC_LANGUAGE_HINTS_DEFAULTS,
    ...normalizeHintMapKeys(TOPIC_LANGUAGE_HINTS_OVERRIDES),
  });

const TEXT_REGEX_HINTS_OVERRIDES: RegexLanguageHint[] = [
  {
    pattern: /\b(next(?:\.js)?|nextjs)\b/i,
    language: "TypeScript",
    score: 0.22,
    confidence: 0.78,
    specificity: 0.84,
  },
  {
    pattern: /\b(react|reactjs|jsx|tsx)\b/i,
    language: "TypeScript",
    score: 0.18,
    confidence: 0.66,
    specificity: 0.64,
  },
  {
    pattern: /\b(vue|nuxt)\b/i,
    language: "Vue",
    score: 0.2,
    confidence: 0.72,
    specificity: 0.74,
  },
  {
    pattern: /\b(svelte|sveltekit)\b/i,
    language: "Svelte",
    score: 0.2,
    confidence: 0.72,
    specificity: 0.74,
  },
  {
    pattern: /\b(astro)\b/i,
    language: "Astro",
    score: 0.2,
    confidence: 0.72,
    specificity: 0.74,
  },
  {
    pattern: /\b(typescript|type-script)\b/i,
    language: "TypeScript",
    score: 0.2,
    confidence: 0.74,
    specificity: 0.8,
  },
  {
    pattern: /\b(javascript|node(?:\.js)?|express|koa|bun|deno)\b/i,
    language: "JavaScript",
    score: 0.16,
    confidence: 0.62,
    specificity: 0.56,
  },

  {
    pattern:
      /\b(python|django|flask|fastapi|pydantic|poetry|pandas|numpy|scikit|sklearn)\b/i,
    language: "Python",
    score: 0.21,
    confidence: 0.76,
    specificity: 0.82,
  },
  {
    pattern: /\b(golang|\bgo\b|gin|fiber|goroutine|grpc)\b/i,
    language: "Go",
    score: 0.2,
    confidence: 0.72,
    specificity: 0.74,
  },
  {
    pattern: /\b(rust|tokio|axum|actix|cargo)\b/i,
    language: "Rust",
    score: 0.21,
    confidence: 0.76,
    specificity: 0.84,
  },
  {
    pattern: /\b(java|spring(?:boot)?|maven|gradle|quarkus)\b/i,
    language: "Java",
    score: 0.2,
    confidence: 0.72,
    specificity: 0.76,
  },
  {
    pattern: /\b(kotlin)\b/i,
    language: "Kotlin",
    score: 0.22,
    confidence: 0.78,
    specificity: 0.88,
  },
  {
    pattern: /\b(c\#|csharp|dotnet|asp\.?net|blazor)\b/i,
    language: "C#",
    score: 0.22,
    confidence: 0.78,
    specificity: 0.86,
  },
  {
    pattern: /\b(c\+\+|cpp|cmake)\b/i,
    language: "C++",
    score: 0.2,
    confidence: 0.72,
    specificity: 0.8,
  },
  {
    pattern: /\b\bc\b\b/i,
    language: "C",
    score: 0.08,
    confidence: 0.42,
    specificity: 0.2,
  },
  {
    pattern: /\b(ruby|rails)\b/i,
    language: "Ruby",
    score: 0.2,
    confidence: 0.72,
    specificity: 0.78,
  },
  {
    pattern: /\b(php|laravel|symfony)\b/i,
    language: "PHP",
    score: 0.2,
    confidence: 0.72,
    specificity: 0.78,
  },
  {
    pattern: /\b(swift|ios|xcode)\b/i,
    language: "Swift",
    score: 0.2,
    confidence: 0.72,
    specificity: 0.78,
  },
  {
    pattern: /\b(dart|flutter)\b/i,
    language: "Dart",
    score: 0.2,
    confidence: 0.72,
    specificity: 0.78,
  },

  {
    pattern: /\b(postgres|postgresql)\b/i,
    language: "PostgreSQL",
    score: 0.2,
    confidence: 0.72,
    specificity: 0.8,
  },
  {
    pattern: /\b(mysql|mariadb)\b/i,
    language: "MySQL",
    score: 0.18,
    confidence: 0.68,
    specificity: 0.74,
  },
  {
    pattern: /\b(sqlite)\b/i,
    language: "SQLite",
    score: 0.18,
    confidence: 0.68,
    specificity: 0.74,
  },
  {
    pattern: /\b(mongo|mongodb|mongoose)\b/i,
    language: "MongoDB",
    score: 0.2,
    confidence: 0.72,
    specificity: 0.8,
  },
  {
    pattern: /\b(redis|cache)\b/i,
    language: "Redis",
    score: 0.16,
    confidence: 0.6,
    specificity: 0.56,
  },
  {
    pattern: /\b(sql|orm|migration|schema)\b/i,
    language: "SQL",
    score: 0.12,
    confidence: 0.5,
    specificity: 0.38,
  },

  {
    pattern: /\b(docker|dockerfile|container)\b/i,
    language: "Dockerfile",
    score: 0.2,
    confidence: 0.74,
    specificity: 0.82,
  },
  {
    pattern: /\b(kubernetes|k8s|kubectl)\b/i,
    language: "Kubernetes",
    score: 0.22,
    confidence: 0.78,
    specificity: 0.88,
  },
  {
    pattern: /\b(helm|chart)\b/i,
    language: "Helm",
    score: 0.22,
    confidence: 0.78,
    specificity: 0.88,
  },
  {
    pattern: /\b(terraform|\.tf\b|hcl)\b/i,
    language: "Terraform",
    score: 0.22,
    confidence: 0.78,
    specificity: 0.88,
  },
  {
    pattern: /\b(ansible|playbook)\b/i,
    language: "Ansible",
    score: 0.22,
    confidence: 0.78,
    specificity: 0.88,
  },
  {
    pattern: /\b(pulumi)\b/i,
    language: "Pulumi",
    score: 0.22,
    confidence: 0.78,
    specificity: 0.88,
  },
  {
    pattern: /\b(bicep)\b/i,
    language: "Bicep",
    score: 0.22,
    confidence: 0.78,
    specificity: 0.88,
  },
  {
    pattern: /\b(github actions|workflow|ci\/cd|pipeline)\b/i,
    language: "YAML",
    score: 0.14,
    confidence: 0.56,
    specificity: 0.46,
  },
  {
    pattern: /\b(shell|bash|zsh|powershell|pwsh|makefile|nix)\b/i,
    language: "Shell",
    score: 0.14,
    confidence: 0.54,
    specificity: 0.42,
  },

  {
    pattern:
      /\b(machine learning|deep learning|computer vision|nlp|llm|rag|inference|training)\b/i,
    language: "Python",
    score: 0.18,
    confidence: 0.62,
    specificity: 0.52,
  },
  {
    pattern: /\b(jupyter|notebook|ipynb)\b/i,
    language: "Jupyter",
    score: 0.2,
    confidence: 0.72,
    specificity: 0.78,
  },
  {
    pattern: /\b(cuda|gpu|kernel)\b/i,
    language: "CUDA",
    score: 0.18,
    confidence: 0.62,
    specificity: 0.56,
  },
];

function escapeRegexToken(token: string): string {
  return token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeLanguageForRegex(language: string): string {
  return language
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase()
    .replace(/[_./]+/g, "-")
    .replace(/[^a-z0-9#+-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildTaxonomyRegexHintDefaults(): RegexLanguageHint[] {
  const hints: RegexLanguageHint[] = [];
  const profileMap = new Map<
    string,
    { name: string; score: number; confidence: number; specificity: number }
  >();

  const snapshots = getTaxonomyProfileSnapshots();

  for (const snapshot of snapshots) {
    const primaryKey = normalizeLanguageForRegex(snapshot.name);
    if (!profileMap.has(primaryKey)) {
      profileMap.set(primaryKey, {
        name: snapshot.name,
        score: 0.2,
        confidence: 0.72,
        specificity: 0.78,
      });
    }

    const allTokens = new Set<string>();
    allTokens.add(snapshot.name);
    snapshot.aliases.forEach((alias) => allTokens.add(alias));

    if (allTokens.size > 0) {
      const patternTerms = Array.from(allTokens)
        .map((token) => {
          const normalized = normalizeLanguageForRegex(token);
          if (normalized.length <= 1) return null;
          return escapeRegexToken(normalized);
        })
        .filter(Boolean) as string[];

      if (patternTerms.length > 0) {
        const patternStr = `\\b(${patternTerms.join("|")})\\b`;
        hints.push({
          pattern: new RegExp(patternStr, "i"),
          language: snapshot.name,
          score: 0.2,
          confidence: 0.72,
          specificity: 0.78,
        });
      }
    }

    for (const ecosystem of snapshot.ecosystems) {
      const ecosystemKey = normalizeLanguageForRegex(ecosystem);
      if (ecosystemKey.length <= 1) continue;

      hints.push({
        pattern: new RegExp(`\\b${escapeRegexToken(ecosystemKey)}\\b`, "i"),
        language: snapshot.name,
        score: 0.14,
        confidence: 0.58,
        specificity: 0.52,
      });
    }
  }

  const weightedKeywords = getTaxonomyWeightedKeywords();
  const keywordGroupsByCategory = new Map<string, Set<string>>();

  for (const keyword of weightedKeywords) {
    const categoryKey = `${keyword.category}`;
    if (!keywordGroupsByCategory.has(categoryKey)) {
      keywordGroupsByCategory.set(categoryKey, new Set());
    }
    const normalized = normalizeLanguageForRegex(keyword.token);
    if (normalized.length > 1) {
      keywordGroupsByCategory.get(categoryKey)!.add(normalized);
    }
  }

  for (const [category, tokens] of keywordGroupsByCategory) {
    if (tokens.size === 0) continue;

    const patternTerms = Array.from(tokens)
      .map((token) => escapeRegexToken(token))
      .filter(Boolean);

    if (patternTerms.length > 0) {
      const patternStr = `\\b(${patternTerms.slice(0, 20).join("|")})\\b`;
      hints.push({
        pattern: new RegExp(patternStr, "i"),
        language: "TypeScript",
        score: 0.12,
        confidence: 0.56,
        specificity: 0.46,
      });
    }
  }

  return hints;
}

const TEXT_REGEX_HINTS_DEFAULTS = buildTaxonomyRegexHintDefaults();

export const TEXT_REGEX_HINTS: readonly RegexLanguageHint[] = Object.freeze([
  ...TEXT_REGEX_HINTS_DEFAULTS,
  ...TEXT_REGEX_HINTS_OVERRIDES,
]);

export type NoiseSeverity = "hard" | "soft" | "contextual";

export interface NoiseTokenProfile {
  token: string;
  severity: NoiseSeverity;
  penalty: number;
  aliases?: string[];
}

function normalizeNoiseToken(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[_./]+/g, "-")
    .replace(/[^a-z0-9#+-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export const NOISE_TOKEN_PROFILES: NoiseTokenProfile[] = [
  {
    token: "repo",
    severity: "hard",
    penalty: 1,
    aliases: ["repository", "repos", "repositories"],
  },
  {
    token: "project",
    severity: "hard",
    penalty: 1,
    aliases: ["projects", "proj"],
  },
  {
    token: "service",
    severity: "hard",
    penalty: 0.98,
    aliases: ["services", "svc"],
  },
  {
    token: "app",
    severity: "hard",
    penalty: 0.98,
    aliases: ["apps", "application", "applications"],
  },
  {
    token: "api",
    severity: "soft",
    penalty: 0.64,
    aliases: ["apis", "endpoint", "endpoints"],
  },
  {
    token: "web",
    severity: "soft",
    penalty: 0.54,
    aliases: ["website", "site", "frontend-app"],
  },
  {
    token: "server",
    severity: "soft",
    penalty: 0.6,
    aliases: ["servers", "srv"],
  },
  { token: "client", severity: "soft", penalty: 0.58, aliases: ["clients"] },
  {
    token: "tool",
    severity: "hard",
    penalty: 0.94,
    aliases: ["tools", "utility", "utilities"],
  },
  {
    token: "code",
    severity: "hard",
    penalty: 0.92,
    aliases: ["source", "src"],
  },
  { token: "sample", severity: "hard", penalty: 0.95, aliases: ["samples"] },
  {
    token: "internal",
    severity: "soft",
    penalty: 0.52,
    aliases: ["private-internal"],
  },
  {
    token: "personal",
    severity: "soft",
    penalty: 0.56,
    aliases: ["personal-use"],
  },
  {
    token: "private",
    severity: "soft",
    penalty: 0.58,
    aliases: ["public", "shared"],
  },
  {
    token: "production",
    severity: "contextual",
    penalty: 0.36,
    aliases: ["prod"],
  },
  {
    token: "development",
    severity: "contextual",
    penalty: 0.34,
    aliases: ["dev"],
  },
  {
    token: "test",
    severity: "hard",
    penalty: 0.88,
    aliases: ["tests", "testing", "spec", "specs"],
  },
  {
    token: "tmp",
    severity: "hard",
    penalty: 1,
    aliases: ["temp", "temporary"],
  },
  {
    token: "misc",
    severity: "hard",
    penalty: 1,
    aliases: ["miscellaneous", "other", "others"],
  },
  {
    token: "work",
    severity: "soft",
    penalty: 0.5,
    aliases: ["workspace", "working"],
  },
  { token: "note", severity: "hard", penalty: 0.9, aliases: ["notes"] },
  {
    token: "study",
    severity: "hard",
    penalty: 0.86,
    aliases: ["learn", "learning", "tutorial", "tutorials"],
  },
  {
    token: "playground",
    severity: "hard",
    penalty: 0.96,
    aliases: ["sandbox", "experiment", "experiments", "experimental"],
  },
  {
    token: "starter",
    severity: "hard",
    penalty: 0.96,
    aliases: [
      "starterkit",
      "starter-kit",
      "template",
      "templates",
      "boilerplate",
      "scaffold",
    ],
  },
  {
    token: "example",
    severity: "hard",
    penalty: 0.96,
    aliases: ["examples", "demo", "demos", "showcase"],
  },
  {
    token: "proof",
    severity: "hard",
    penalty: 0.94,
    aliases: ["poc", "prototype", "prototypes"],
  },
  {
    token: "archive",
    severity: "hard",
    penalty: 0.98,
    aliases: ["archived", "legacy", "deprecated"],
  },
  { token: "old", severity: "hard", penalty: 0.92, aliases: ["new", "latest"] },
  {
    token: "build",
    severity: "contextual",
    penalty: 0.34,
    aliases: ["dist", "artifact", "artifacts"],
  },
  {
    token: "docs",
    severity: "soft",
    penalty: 0.58,
    aliases: ["doc", "documentation"],
  },
  {
    token: "config",
    severity: "soft",
    penalty: 0.52,
    aliases: ["configs", "configuration", "settings"],
  },
  {
    token: "infra",
    severity: "contextual",
    penalty: 0.22,
    aliases: ["infrastructure"],
  },
  {
    token: "module",
    severity: "soft",
    penalty: 0.44,
    aliases: ["modules", "package", "packages"],
  },
  {
    token: "core",
    severity: "contextual",
    penalty: 0.28,
    aliases: ["base", "common", "shared"],
  },
  {
    token: "platform",
    severity: "contextual",
    penalty: 0.28,
    aliases: ["system", "systems"],
  },
  {
    token: "engine",
    severity: "contextual",
    penalty: 0.26,
    aliases: ["runtime"],
  },
  {
    token: "manager",
    severity: "contextual",
    penalty: 0.28,
    aliases: ["management"],
  },
  {
    token: "service-api",
    severity: "contextual",
    penalty: 0.24,
    aliases: ["api-service"],
  },
  {
    token: "backend-api",
    severity: "contextual",
    penalty: 0.24,
    aliases: ["api-backend"],
  },
  {
    token: "frontend-app",
    severity: "contextual",
    penalty: 0.2,
    aliases: ["app-frontend"],
  },
  {
    token: "data",
    severity: "contextual",
    penalty: 0.32,
    aliases: ["dataset", "datasets"],
  },
  {
    token: "assets",
    severity: "soft",
    penalty: 0.62,
    aliases: ["asset", "static"],
  },
  { token: "scripts", severity: "soft", penalty: 0.58, aliases: ["script"] },
  {
    token: "helper",
    severity: "soft",
    penalty: 0.56,
    aliases: ["helpers", "utils", "util"],
  },
  {
    token: "v1",
    severity: "hard",
    penalty: 1,
    aliases: ["v2", "v3", "v4", "v5", "v6", "v7", "v8", "v9", "v10"],
  },
];

const noisePenaltyByToken = new Map<string, number>();
const hardNoiseTokens = new Set<string>();

for (const profile of NOISE_TOKEN_PROFILES) {
  const canonical = normalizeNoiseToken(profile.token);
  if (!canonical) continue;

  const existing = noisePenaltyByToken.get(canonical) || 0;
  noisePenaltyByToken.set(canonical, Math.max(existing, profile.penalty));
  if (profile.severity === "hard" || profile.penalty >= 0.95) {
    hardNoiseTokens.add(canonical);
  }

  for (const alias of profile.aliases || []) {
    const normalizedAlias = normalizeNoiseToken(alias);
    if (!normalizedAlias) continue;
    const current = noisePenaltyByToken.get(normalizedAlias) || 0;
    noisePenaltyByToken.set(
      normalizedAlias,
      Math.max(current, profile.penalty),
    );
    if (profile.severity === "hard" || profile.penalty >= 0.95) {
      hardNoiseTokens.add(normalizedAlias);
    }
  }
}

export const NOISE_TOKENS = new Set<string>(noisePenaltyByToken.keys());

export const HARD_NOISE_TOKENS = hardNoiseTokens;

export function noisePenaltyForToken(token: string): number {
  const normalized = normalizeNoiseToken(token);
  if (!normalized) return 1;

  const direct = noisePenaltyByToken.get(normalized);
  if (typeof direct === "number") return direct;

  if (/^v\d+$/.test(normalized)) return 1;
  if (/^(test|demo|sample|example)-/.test(normalized)) return 0.92;
  if (/(^|-)tmp($|-)|(^|-)temp($|-)/.test(normalized)) return 0.95;
  if (normalized.length <= 2) return 0.26;

  return 0;
}

export function isHardNoiseToken(token: string): boolean {
  const normalized = normalizeNoiseToken(token);
  if (!normalized) return true;
  if (HARD_NOISE_TOKENS.has(normalized)) return true;
  if (/^v\d+$/.test(normalized)) return true;
  return false;
}

export interface LicenseLanguageProfile {
  license: string;
  aliases: string[];
  languageHints: {
    language: string;
    weight: number;
    reason: string;
  }[];
  ecosystemMarker?: string;
  era?: string;
}

const LICENSE_PROFILES: LicenseLanguageProfile[] = [
  {
    license: "MIT",
    aliases: ["mit-license", "expat"],
    languageHints: [
      {
        language: "TypeScript",
        weight: 0.38,
        reason: "Modern JS ecosystem default",
      },
      {
        language: "JavaScript",
        weight: 0.32,
        reason: "NPM ecosystem preference",
      },
      { language: "Python", weight: 0.24, reason: "PyPI common choice" },
      { language: "Ruby", weight: 0.18, reason: "Ruby gems common" },
    ],
    ecosystemMarker: "permissive-open-source",
    era: "2000s-present",
  },
  {
    license: "Apache-2.0",
    aliases: ["apache license 2.0", "apache", "asl", "apache-2"],
    languageHints: [
      { language: "Java", weight: 0.52, reason: "ASF ecosystem standard" },
      { language: "Scala", weight: 0.42, reason: "JVM Scala projects" },
      { language: "Kotlin", weight: 0.38, reason: "Android/JVM ecosystem" },
      { language: "Go", weight: 0.32, reason: "Cloud-native tools preference" },
      { language: "Rust", weight: 0.24, reason: "Systems projects" },
    ],
    ecosystemMarker: "enterprise-friendly",
    era: "2004-present",
  },
  {
    license: "GPL-3.0",
    aliases: ["gnu general public license v3", "gpl3", "gplv3", "gnu gpl"],
    languageHints: [
      { language: "C", weight: 0.48, reason: "GNU project heritage" },
      { language: "C++", weight: 0.42, reason: "GNU toolchain ecosystem" },
      { language: "Python", weight: 0.28, reason: "FSF-aligned projects" },
      { language: "Bash", weight: 0.24, reason: "GNU utilities" },
    ],
    ecosystemMarker: "copyleft-strong",
    era: "2007-present",
  },
  {
    license: "GPL-2.0",
    aliases: ["gnu general public license v2", "gpl2", "gplv2"],
    languageHints: [
      { language: "C", weight: 0.56, reason: "Linux kernel era" },
      { language: "C++", weight: 0.38, reason: "Legacy GNU projects" },
    ],
    ecosystemMarker: "copyleft-classical",
    era: "1991-present",
  },
  {
    license: "LGPL-2.1",
    aliases: ["lgpl", "gnu lesser general public license", "lesser gpl"],
    languageHints: [
      { language: "C", weight: 0.52, reason: "Library-focused GPL variant" },
      { language: "C++", weight: 0.46, reason: "Shared library projects" },
    ],
    ecosystemMarker: "copyleft-library",
    era: "1999-present",
  },
  {
    license: "BSD-3-Clause",
    aliases: ["bsd 3-clause", "modified bsd", "new bsd"],
    languageHints: [
      { language: "C", weight: 0.48, reason: "BSD Unix heritage" },
      {
        language: "C++",
        weight: 0.38,
        reason: "Systems programming tradition",
      },
      { language: "Go", weight: 0.24, reason: "Go standard library influence" },
    ],
    ecosystemMarker: "permissive-academic",
    era: "1999-present",
  },
  {
    license: "BSD-2-Clause",
    aliases: ["bsd 2-clause", "simplified bsd", "freebsd license"],
    languageHints: [
      { language: "C", weight: 0.52, reason: "FreeBSD ecosystem" },
      { language: "C++", weight: 0.42, reason: "Minimalist BSD projects" },
    ],
    ecosystemMarker: "permissive-minimal",
    era: "1999-present",
  },
  {
    license: "MPL-2.0",
    aliases: ["mozilla public license", "mpl", "mpl2"],
    languageHints: [
      { language: "Rust", weight: 0.58, reason: "Mozilla Rust projects" },
      {
        language: "JavaScript",
        weight: 0.32,
        reason: "Firefox/Mozilla web tech",
      },
      { language: "C++", weight: 0.24, reason: "Firefox legacy components" },
    ],
    ecosystemMarker: "copyleft-file-level",
    era: "2012-present",
  },
  {
    license: "ISC",
    aliases: ["isc license"],
    languageHints: [
      {
        language: "JavaScript",
        weight: 0.46,
        reason: "NPM alternative to MIT",
      },
      { language: "TypeScript", weight: 0.38, reason: "Node.js ecosystem" },
    ],
    ecosystemMarker: "permissive-simple",
    era: "2000s-present",
  },
  {
    license: "Unlicense",
    aliases: ["unlicense", "public domain"],
    languageHints: [
      {
        language: "JavaScript",
        weight: 0.28,
        reason: "Permissive JS projects",
      },
      { language: "Python", weight: 0.24, reason: "Public domain Python" },
      { language: "C", weight: 0.22, reason: "Single-file libraries" },
    ],
    ecosystemMarker: "public-domain",
    era: "2010-present",
  },
  {
    license: "CC0-1.0",
    aliases: ["cc0", "creative commons zero", "cc zero"],
    languageHints: [
      {
        language: "Python",
        weight: 0.24,
        reason: "Data/documentation projects",
      },
      { language: "JavaScript", weight: 0.22, reason: "Public datasets" },
    ],
    ecosystemMarker: "public-domain-data",
    era: "2009-present",
  },
  {
    license: "AGPL-3.0",
    aliases: ["agpl", "affero gpl", "gnu affero"],
    languageHints: [
      { language: "Python", weight: 0.42, reason: "Web service copyleft" },
      { language: "JavaScript", weight: 0.32, reason: "Network service apps" },
      { language: "Go", weight: 0.24, reason: "Server-side services" },
    ],
    ecosystemMarker: "copyleft-network",
    era: "2007-present",
  },
  {
    license: "EPL-2.0",
    aliases: ["eclipse public license", "epl"],
    languageHints: [
      { language: "Java", weight: 0.56, reason: "Eclipse ecosystem" },
      { language: "Scala", weight: 0.32, reason: "JVM tooling" },
    ],
    ecosystemMarker: "copyleft-weak-enterprise",
    era: "2017-present",
  },
  {
    license: "EUPL-1.2",
    aliases: ["european union public license", "eupl"],
    languageHints: [
      { language: "Java", weight: 0.38, reason: "EU government projects" },
      { language: "Python", weight: 0.28, reason: "EU public sector" },
    ],
    ecosystemMarker: "copyleft-european",
    era: "2017-present",
  },
  {
    license: "WTFPL",
    aliases: [
      "do what the fuck you want to public license",
      "wtf public license",
    ],
    languageHints: [
      { language: "C", weight: 0.32, reason: "Humorous permissive projects" },
      { language: "Python", weight: 0.28, reason: "Small utilities" },
    ],
    ecosystemMarker: "permissive-humorous",
    era: "2004-present",
  },
  {
    license: "Zlib",
    aliases: ["zlib license"],
    languageHints: [
      { language: "C", weight: 0.52, reason: "Compression library heritage" },
      { language: "C++", weight: 0.42, reason: "Game engine libraries" },
    ],
    ecosystemMarker: "permissive-game-dev",
    era: "1995-present",
  },
  {
    license: "Artistic-2.0",
    aliases: ["artistic license", "perl artistic license"],
    languageHints: [
      { language: "Perl", weight: 0.72, reason: "Perl community standard" },
      { language: "Ruby", weight: 0.24, reason: "Perl-influenced projects" },
    ],
    ecosystemMarker: "copyleft-artistic",
    era: "2000-present",
  },
  {
    license: "Python-2.0",
    aliases: ["python software foundation license", "psf license"],
    languageHints: [
      { language: "Python", weight: 0.82, reason: "Python core/stdlib" },
    ],
    ecosystemMarker: "language-specific-python",
    era: "2001-present",
  },
  {
    license: "Ruby",
    aliases: ["ruby license"],
    languageHints: [
      { language: "Ruby", weight: 0.78, reason: "Ruby language ecosystem" },
    ],
    ecosystemMarker: "language-specific-ruby",
    era: "1993-present",
  },
  {
    license: "PHP-3.01",
    aliases: ["php license"],
    languageHints: [
      { language: "PHP", weight: 0.74, reason: "PHP core ecosystem" },
    ],
    ecosystemMarker: "language-specific-php",
    era: "1999-present",
  },
  {
    license: "Vim",
    aliases: ["vim license", "charityware"],
    languageHints: [
      { language: "Vim script", weight: 0.68, reason: "Vim plugin ecosystem" },
      { language: "C", weight: 0.22, reason: "Vim-influenced tools" },
    ],
    ecosystemMarker: "charityware",
    era: "2002-present",
  },
  {
    license: "0BSD",
    aliases: ["zero-clause bsd", "free public license 1.0.0"],
    languageHints: [
      { language: "C", weight: 0.42, reason: "Minimal embedded code" },
      { language: "Rust", weight: 0.32, reason: "Public domain alternative" },
    ],
    ecosystemMarker: "permissive-zero-clause",
    era: "2006-present",
  },
  {
    license: "BSL-1.0",
    aliases: ["boost software license", "boost license"],
    languageHints: [
      { language: "C++", weight: 0.72, reason: "Boost library ecosystem" },
    ],
    ecosystemMarker: "permissive-cpp",
    era: "2003-present",
  },
  {
    license: "MS-PL",
    aliases: ["microsoft public license", "ms public license"],
    languageHints: [
      { language: "C#", weight: 0.58, reason: "Microsoft OSS projects" },
      { language: "F#", weight: 0.38, reason: ".NET ecosystem" },
    ],
    ecosystemMarker: "permissive-microsoft",
    era: "2007-present",
  },
  {
    license: "MS-RL",
    aliases: ["microsoft reciprocal license", "ms reciprocal license"],
    languageHints: [
      { language: "C#", weight: 0.54, reason: "MS copyleft variant" },
    ],
    ecosystemMarker: "copyleft-microsoft",
    era: "2007-present",
  },
  {
    license: "OFL-1.1",
    aliases: ["sil open font license", "open font license"],
    languageHints: [
      { language: "CSS", weight: 0.32, reason: "Font projects" },
      { language: "JavaScript", weight: 0.24, reason: "Web font tooling" },
    ],
    ecosystemMarker: "font-specific",
    era: "2007-present",
  },
  {
    license: "NCL",
    aliases: ["non-commercial license"],
    languageHints: [
      { language: "Python", weight: 0.28, reason: "Research software" },
      { language: "MATLAB", weight: 0.24, reason: "Academic toolboxes" },
    ],
    ecosystemMarker: "non-commercial",
    era: "various",
  },
];

function normalizeLicenseKey(license: string): string {
  return license
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const licenseHintMap = new Map<string, string>();

for (const profile of LICENSE_PROFILES) {
  const primaryHint = profile.languageHints[0];
  if (!primaryHint) continue;

  licenseHintMap.set(
    normalizeLicenseKey(profile.license),
    primaryHint.language,
  );
  for (const alias of profile.aliases) {
    licenseHintMap.set(normalizeLicenseKey(alias), primaryHint.language);
  }
}

export const LICENSE_LANGUAGE_HINTS: Record<string, string> =
  Object.fromEntries(licenseHintMap);

export interface NegativeContextProfile {
  patterns: RegExp[];
  tag: string;
  penalty: number;
  severity: "critical" | "high" | "moderate" | "low" | "minimal";
  reason: string;
  affectsCategories?: TechStack["category"][];
}

export const NEGATIVE_CONTEXT_PROFILES: NegativeContextProfile[] = [
  {
    patterns: [
      /\b(template|boilerplate|starter[-\s]?kit|scaffold|cookiecutter|generator)\b/i,
      /\b(project[-\s]?template|starter[-\s]?project|template[-\s]?repo)\b/i,
      /\b(initialize|init[-\s]?project|bootstrap[-\s]?project)\b/i,
    ],
    tag: "TemplateRepository",
    penalty: 0.42,
    severity: "high",
    reason:
      "Template/starter repositories signal setup tools rather than production usage",
  },
  {
    patterns: [
      /\b(example|examples|sample|samples|demo|demos|showcase)\b/i,
      /\b(tutorial|tutorials|walkthrough|guide|learning[-\s]?resource)\b/i,
      /\b(code[-\s]?sample|demo[-\s]?app|example[-\s]?project)\b/i,
      /\b(getting[-\s]?started|hello[-\s]?world|quick[-\s]?start)\b/i,
    ],
    tag: "ExampleRepository",
    penalty: 0.38,
    severity: "high",
    reason:
      "Example/demo repositories demonstrate concepts rather than solve production problems",
  },
  {
    patterns: [
      /\b(playground|sandbox|experiment|experimental|scratchpad)\b/i,
      /\b(poc|proof[-\s]?of[-\s]?concept|prototype|prototyping)\b/i,
      /\b(test[-\s]?bed|lab|research|exploration)\b/i,
      /\b(spike|trial|trial[-\s]?run|feasibility)\b/i,
    ],
    tag: "ExperimentalRepository",
    penalty: 0.36,
    severity: "high",
    reason:
      "Experimental repositories indicate exploration rather than stable production systems",
  },
  {
    patterns: [
      /\b(personal[-\s]?site|portfolio|resume|cv|curriculum)\b/i,
      /\b(homepage|blog|website|personal[-\s]?page)\b/i,
      /\b(about[-\s]?me|my[-\s]?profile|profile[-\s]?site)\b/i,
    ],
    tag: "PersonalSiteRepository",
    penalty: 0.32,
    severity: "moderate",
    reason:
      "Personal portfolio sites may overstate breadth vs. depth of real-world experience",
  },
  {
    patterns: [
      /\b(dotfiles|rc[-\s]?files|config[-\s]?files|configurations?)\b/i,
      /\b(settings|preferences|setup|environment)\b/i,
      /\b(vim|nvim|emacs|zsh|bash[-\s]?config)\b/i,
    ],
    tag: "ConfigRepository",
    penalty: 0.28,
    severity: "moderate",
    reason:
      "Configuration repositories reflect personal tooling rather than software engineering skills",
  },
  {
    patterns: [
      /\b(awesome[-\s]?list|curated[-\s]?list|link[-\s]?collection)\b/i,
      /\b(resources|bookmarks|references|reading[-\s]?list)\b/i,
      /\b(list[-\s]?of[-\s]?tools|tool[-\s]?list|framework[-\s]?list)\b/i,
    ],
    tag: "CuratedListRepository",
    penalty: 0.34,
    severity: "moderate",
    reason:
      "Curated lists indicate curation rather than software development skills",
  },
  {
    patterns: [
      /\b(archive|archived|legacy|deprecated|obsolete|unmaintained)\b/i,
      /\b(old[-\s]?version|historical|retired|discontinued)\b/i,
      /\b(no[-\s]?longer[-\s]?maintained|end[-\s]?of[-\s]?life)\b/i,
    ],
    tag: "LegacyRepository",
    penalty: 0.4,
    severity: "high",
    reason:
      "Legacy/archived repositories may not reflect current skills or best practices",
  },
  {
    patterns: [
      /\b(fork|forked[-\s]?from|clone|cloned[-\s]?repo)\b/i,
      /\b(upstream|mirror|copy[-\s]?of)\b/i,
    ],
    tag: "ForkedRepository",
    penalty: 0.26,
    severity: "moderate",
    reason:
      "Forked repositories may not indicate original authorship or deep contribution",
  },
  {
    patterns: [
      /\b(school[-\s]?project|university|college|course[-\s]?work)\b/i,
      /\b(homework|assignment|class[-\s]?project|academic)\b/i,
      /\b(semester[-\s]?project|capstone|thesis)\b/i,
    ],
    tag: "AcademicRepository",
    penalty: 0.3,
    severity: "moderate",
    reason:
      "Academic projects are learning exercises with different constraints than production systems",
  },
  {
    patterns: [
      /\b(notes|note[-\s]?taking|documentation[-\s]?only|readme[-\s]?collection)\b/i,
      /\b(cheat[-\s]?sheet|reference[-\s]?guide|quick[-\s]?reference)\b/i,
      /\b(snippets|gists|code[-\s]?snippets)\b/i,
    ],
    tag: "DocumentationRepository",
    penalty: 0.24,
    severity: "low",
    reason:
      "Documentation-only repositories indicate knowledge organization rather than development",
  },
  {
    patterns: [
      /\b(practice|练习|coding[-\s]?practice|exercises?)\b/i,
      /\b(kata|challenge|challenges|problem[-\s]?solving)\b/i,
      /\b(leetcode|hackerrank|codewars|advent[-\s]?of[-\s]?code)\b/i,
      /\b(interview[-\s]?prep|interview[-\s]?questions)\b/i,
    ],
    tag: "PracticeRepository",
    penalty: 0.34,
    severity: "moderate",
    reason:
      "Practice/challenge repositories focus on algorithms rather than system design skills",
  },
  {
    patterns: [
      /\b(toy[-\s]?project|toy[-\s]?app|mini[-\s]?project|micro[-\s]?project)\b/i,
      /\b(simple[-\s]?app|basic[-\s]?app|trivial|minimal[-\s]?example)\b/i,
      /\b(for[-\s]?fun|hobby[-\s]?project|weekend[-\s]?project)\b/i,
    ],
    tag: "ToyRepository",
    penalty: 0.3,
    severity: "moderate",
    reason:
      "Toy projects may lack production considerations like scale, security, observability",
  },
  {
    patterns: [
      /\b(broken|not[-\s]?working|work[-\s]?in[-\s]?progress|wip)\b/i,
      /\b(incomplete|unfinished|abandoned|on[-\s]?hold)\b/i,
      /\b(failed[-\s]?experiment|didn't[-\s]?work|stopped[-\s]?development)\b/i,
    ],
    tag: "IncompleteRepository",
    penalty: 0.44,
    severity: "critical",
    reason:
      "Incomplete/broken repositories indicate lack of delivery or follow-through",
  },
  {
    patterns: [
      /\b(test[-\s]?repo|testing[-\s]?repo|dummy[-\s]?repo|placeholder)\b/i,
      /\b(ignore[-\s]?this|delete[-\s]?me|temporary[-\s]?repo)\b/i,
      /\b(scratch|throwaway|junk)\b/i,
    ],
    tag: "TestRepository",
    penalty: 0.48,
    severity: "critical",
    reason: "Test/placeholder repositories contain no real work",
  },
  {
    patterns: [
      /\b(static[-\s]?site|landing[-\s]?page|single[-\s]?page|brochure[-\s]?site)\b/i,
      /\b(marketing[-\s]?site|coming[-\s]?soon|under[-\s]?construction)\b/i,
    ],
    tag: "StaticSiteRepository",
    penalty: 0.18,
    severity: "low",
    reason:
      "Simple static sites may not demonstrate backend or infrastructure skills",
    affectsCategories: ["backend", "infrastructure", "database"],
  },
  {
    patterns: [
      /\b(data[-\s]?only|dataset|data[-\s]?collection|raw[-\s]?data)\b/i,
      /\b(corpus|training[-\s]?data|benchmark[-\s]?data)\b/i,
    ],
    tag: "DataRepository",
    penalty: 0.22,
    severity: "low",
    reason:
      "Data-only repositories may not demonstrate software development skills",
    affectsCategories: ["frontend", "backend", "infrastructure"],
  },
  {
    patterns: [
      /\b(auto[-\s]?generated|generated[-\s]?code|code[-\s]?gen|codegen)\b/i,
      /\b(scaffolded[-\s]?by|created[-\s]?with[-\s]?generator)\b/i,
    ],
    tag: "GeneratedRepository",
    penalty: 0.26,
    severity: "moderate",
    reason: "Auto-generated code may not reflect manual engineering skills",
  },
  {
    patterns: [
      /\b(monorepo[-\s]?template|workspace[-\s]?template|nx[-\s]?example)\b/i,
      /\b(turborepo[-\s]?starter|lerna[-\s]?example)\b/i,
    ],
    tag: "MonorepoTemplateRepository",
    penalty: 0.38,
    severity: "high",
    reason:
      "Monorepo templates are setup tools rather than production implementations",
  },
  {
    patterns: [
      /\b(icon[-\s]?pack|icon[-\s]?library|svg[-\s]?collection|assets[-\s]?only)\b/i,
      /\b(fonts|typography[-\s]?collection|image[-\s]?assets)\b/i,
    ],
    tag: "AssetRepository",
    penalty: 0.28,
    severity: "moderate",
    reason: "Asset-only repositories don't demonstrate coding skills",
    affectsCategories: [
      "backend",
      "infrastructure",
      "database",
      "devops",
      "ai-ml",
    ],
  },
  {
    patterns: [
      /\b(migrated[-\s]?to|moved[-\s]?to|now[-\s]?at|see[-\s]?new[-\s]?repo)\b/i,
      /\b(redirect|relocated|transferred)\b/i,
    ],
    tag: "MigratedRepository",
    penalty: 0.36,
    severity: "high",
    reason: "Migrated repositories may be outdated or placeholder references",
  },
];

export const NEGATIVE_CONTEXT_HINTS: NegativeContextHint[] =
  NEGATIVE_CONTEXT_PROFILES.flatMap((profile) =>
    profile.patterns.map((pattern) => ({
      pattern,
      tag: profile.tag,
      penalty: profile.penalty,
    })),
  );

export const CONTEXT_ONLY_LANGUAGE_TAGS = new Set<string>([
  "ForkedRepository",
  "InactiveRepository",
  "TemplateRepository",
  "ExampleRepository",
  "ExperimentalRepository",
  "PersonalSiteRepository",
  "ConfigRepository",
  "CuratedListRepository",
  "LegacyRepository",
  "AcademicRepository",
  "DocumentationRepository",
  "PracticeRepository",
  "ToyRepository",
  "IncompleteRepository",
  "TestRepository",
  "StaticSiteRepository",
  "DataRepository",
  "GeneratedRepository",
  "MonorepoTemplateRepository",
  "AssetRepository",
  "MigratedRepository",
]);

type SkillCategory = TechStack["category"];

const SKILL_CATEGORIES: SkillCategory[] = [
  "frontend",
  "backend",
  "infrastructure",
  "database",
  "ai-ml",
  "devops",
];

function normalizeHintToken(value: string): string {
  return value
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase()
    .replace(/[_./]+/g, "-")
    .replace(/[^a-z0-9#+-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function initializeCategoryVotes(): Record<SkillCategory, number> {
  return {
    frontend: 0,
    backend: 0,
    infrastructure: 0,
    database: 0,
    "ai-ml": 0,
    devops: 0,
  };
}

function winnerCategory(votes: Record<SkillCategory, number>): SkillCategory {
  return SKILL_CATEGORIES.reduce<SkillCategory>(
    (best, current) => (votes[current] > votes[best] ? current : best),
    "backend",
  );
}

function normalizeVoteDistribution(
  votes: Record<SkillCategory, number>,
): Record<SkillCategory, number> {
  const total = SKILL_CATEGORIES.reduce(
    (sum, category) => sum + Math.max(0, votes[category]),
    0,
  );

  if (total <= 0) {
    return initializeCategoryVotes();
  }

  const normalized = initializeCategoryVotes();
  for (const category of SKILL_CATEGORIES) {
    normalized[category] = votes[category] / total;
  }

  return normalized;
}

function applyVoteCalibration(
  votes: Record<SkillCategory, number>,
): Record<SkillCategory, number> {
  const normalized = normalizeVoteDistribution(votes);
  const calibrated = initializeCategoryVotes();

  for (const category of SKILL_CATEGORIES) {
    const densityLift = Math.sqrt(Math.max(0, normalized[category]));
    const base = Math.max(0, votes[category]);
    calibrated[category] = base * (0.78 + densityLift * 0.44);
  }

  return calibrated;
}

function addTaxonomyVotes(
  language: string,
  votes: Record<SkillCategory, number>,
): void {
  const inferred = inferLanguageCategoryExpert(language);
  votes[inferred.category] += Math.max(0.12, inferred.confidence) * 2.3;

  for (const entry of inferred.breakdown.slice(0, 3)) {
    const spreadWeight =
      entry.score > 0 ? Math.min(0.85, entry.score / 3.4) : 0;
    if (spreadWeight > 0) {
      votes[entry.category] += spreadWeight;
    }
  }
}

function addHintLanguageVotes(
  language: string,
  votes: Record<SkillCategory, number>,
  baseWeight: number,
): void {
  const inferred = inferLanguageCategoryExpert(language);
  votes[inferred.category] += baseWeight * Math.max(0.2, inferred.confidence);
}

function gatherLanguagesFromStaticHints(): Set<string> {
  const languages = new Set<string>();

  for (const language of Object.values(LANGUAGE_ALIASES)) {
    if (language) languages.add(language);
  }

  for (const hint of Object.values(TOKEN_LANGUAGE_HINTS)) {
    if (hint.language) languages.add(hint.language);
  }

  for (const hint of Object.values(TOPIC_LANGUAGE_HINTS)) {
    if (hint.language) languages.add(hint.language);
  }

  for (const hint of TEXT_REGEX_HINTS) {
    if (hint.language) languages.add(hint.language);
  }

  return languages;
}

function buildExpertLanguageCategoryHints(): Record<string, SkillCategory> {
  const taxonomyBase = getLanguageCategoryHints();
  const output: Record<string, SkillCategory> = { ...taxonomyBase };
  const allLanguages = new Set<string>(Object.keys(taxonomyBase));

  for (const language of gatherLanguagesFromStaticHints()) {
    allLanguages.add(language);
  }

  for (const [alias, canonicalLanguage] of Object.entries(LANGUAGE_ALIASES)) {
    if (canonicalLanguage) {
      allLanguages.add(canonicalLanguage);
      const normalizedAlias = normalizeHintToken(alias);
      if (normalizedAlias && !allLanguages.has(normalizedAlias)) {
        allLanguages.add(normalizedAlias);
      }
    }
  }

  for (const language of allLanguages) {
    const normalized = normalizeHintToken(language);
    if (!normalized) continue;

    const votes = initializeCategoryVotes();

    addTaxonomyVotes(language, votes);

    const directTokenHint = TOKEN_LANGUAGE_HINTS[normalized];
    if (directTokenHint) {
      addHintLanguageVotes(
        directTokenHint.language,
        votes,
        1.35 * directTokenHint.confidence,
      );
    }

    const directTopicHint = TOPIC_LANGUAGE_HINTS[normalized];
    if (directTopicHint) {
      addHintLanguageVotes(
        directTopicHint.language,
        votes,
        1.2 * directTopicHint.confidence,
      );
    }

    for (const regexHint of TEXT_REGEX_HINTS) {
      if (normalizeHintToken(regexHint.language) !== normalized) continue;
      addHintLanguageVotes(
        regexHint.language,
        votes,
        0.82 * regexHint.confidence,
      );
    }

    for (const [alias, canonical] of Object.entries(LANGUAGE_ALIASES)) {
      if (normalizeHintToken(canonical) !== normalized) continue;
      const aliasInference = inferLanguageCategoryExpert(canonical);
      votes[aliasInference.category] += 0.34;
      if (!output[alias]) {
        output[alias] = aliasInference.category;
      }
    }

    const calibratedVotes = applyVoteCalibration(votes);
    const decided = winnerCategory(calibratedVotes);
    output[language] = decided;

    const canonical = Object.entries(LANGUAGE_ALIASES).find(
      ([, canonicalLanguage]) =>
        normalizeHintToken(canonicalLanguage) === normalized,
    )?.[1];
    if (canonical) {
      output[canonical] = decided;
    }
  }

  return Object.freeze(output);
}

export const LANGUAGE_CATEGORY_HINTS: Record<string, TechStack["category"]> =
  buildExpertLanguageCategoryHints();
