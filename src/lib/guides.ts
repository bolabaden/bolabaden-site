import "server-only";

import { cache } from "react";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import type { Guide } from "./types";

type GuideFrontmatter = {
  description?: string;
  category?: string;
  difficulty?: string;
  estimatedTime?: string;
  prerequisites?: string[];
  technologies?: string[];
};

const FALLBACK_GUIDES_DIR = path.join(
  process.cwd(),
  "src",
  "content",
  "guides",
);
const DEFAULT_EXTERNAL_GUIDES_DIR = path.join(process.cwd(), "guides");

const titleCaseReplacements: Record<string, string> = {
  ai: "AI",
  api: "API",
  ci: "CI",
  cd: "CD",
  css: "CSS",
  dns: "DNS",
  html: "HTML",
  http: "HTTP",
  https: "HTTPS",
  js: "JS",
  k8s: "K8s",
  ssl: "SSL",
  ts: "TS",
  url: "URL",
  vs: "VS",
  vscode: "VS Code",
};

function toExternalGuidesDir(): string {
  const configured = process.env.GUIDES_DIR?.trim();
  return configured ? path.resolve(configured) : DEFAULT_EXTERNAL_GUIDES_DIR;
}

function normalizeSlug(fileName: string): string {
  return path
    .basename(fileName, path.extname(fileName))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeTitleFromFilename(fileName: string): string {
  const rawBaseName = path.basename(fileName, path.extname(fileName));
  const normalized = rawBaseName
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return normalized
    .split(" ")
    .filter(Boolean)
    .map((word) => {
      const replacement = titleCaseReplacements[word.toLowerCase()];
      if (replacement) return replacement;
      return `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`;
    })
    .join(" ");
}

function stripQuotes(value: string): string {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

function parseInlineList(value: string): string[] {
  const normalized = value.trim();
  if (!normalized.startsWith("[") || !normalized.endsWith("]")) {
    return [];
  }

  return normalized
    .slice(1, -1)
    .split(",")
    .map((item) => stripQuotes(item))
    .filter(Boolean);
}

function parseFrontmatter(rawMarkdown: string): {
  frontmatter: GuideFrontmatter;
  content: string;
} {
  if (!rawMarkdown.startsWith("---\n")) {
    return { frontmatter: {}, content: rawMarkdown.trim() };
  }

  const separatorIndex = rawMarkdown.indexOf("\n---\n", 4);
  if (separatorIndex === -1) {
    return { frontmatter: {}, content: rawMarkdown.trim() };
  }

  const rawFrontmatter = rawMarkdown.slice(4, separatorIndex).trim();
  const content = rawMarkdown.slice(separatorIndex + 5).trim();

  const frontmatter: GuideFrontmatter = {};
  let activeArrayKey: "prerequisites" | "technologies" | undefined;

  for (const line of rawFrontmatter.split(/\r?\n/)) {
    if (!line.trim()) continue;

    const listItemMatch = line.match(/^\s*-\s+(.+)$/);
    if (listItemMatch && activeArrayKey) {
      frontmatter[activeArrayKey] = frontmatter[activeArrayKey] || [];
      frontmatter[activeArrayKey]!.push(stripQuotes(listItemMatch[1]));
      continue;
    }

    const keyValueMatch = line.match(/^([a-zA-Z][a-zA-Z0-9_-]*):\s*(.*)$/);
    if (!keyValueMatch) continue;

    const key = keyValueMatch[1].trim();
    const rawValue = keyValueMatch[2].trim();

    if (key === "description") {
      frontmatter.description = stripQuotes(rawValue);
      activeArrayKey = undefined;
      continue;
    }

    if (key === "category") {
      frontmatter.category = stripQuotes(rawValue);
      activeArrayKey = undefined;
      continue;
    }

    if (key === "difficulty") {
      frontmatter.difficulty = stripQuotes(rawValue);
      activeArrayKey = undefined;
      continue;
    }

    if (key === "estimatedTime") {
      frontmatter.estimatedTime = stripQuotes(rawValue);
      activeArrayKey = undefined;
      continue;
    }

    if (key === "prerequisites" || key === "technologies") {
      const listValue = parseInlineList(rawValue);
      frontmatter[key] = listValue;
      activeArrayKey = rawValue ? undefined : key;
      continue;
    }

    activeArrayKey = undefined;
  }

  return { frontmatter, content };
}

function toDifficulty(value?: string): Guide["difficulty"] {
  const normalized = (value || "").trim().toLowerCase();
  if (
    normalized === "beginner" ||
    normalized === "intermediate" ||
    normalized === "advanced"
  ) {
    return normalized;
  }
  return "intermediate";
}

function toValidDate(value: Date): Date {
  if (isNaN(value.getTime())) return new Date();
  return value;
}

async function directoryExists(directoryPath: string): Promise<boolean> {
  try {
    const stats = await stat(directoryPath);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

async function readGuidesFromDirectory(
  directoryPath: string,
): Promise<Guide[]> {
  const entries = await readdir(directoryPath, { withFileTypes: true });
  const markdownFiles = entries
    .filter((entry) => entry.isFile() && /\.md$/i.test(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));

  const guides = await Promise.all(
    markdownFiles.map(async (fileName) => {
      const filePath = path.join(directoryPath, fileName);
      const [rawMarkdown, fileStats] = await Promise.all([
        readFile(filePath, "utf8"),
        stat(filePath),
      ]);

      const { frontmatter, content } = parseFrontmatter(rawMarkdown);
      const slug = normalizeSlug(fileName);
      const title = normalizeTitleFromFilename(fileName);

      return {
        id: slug,
        slug,
        title,
        description:
          frontmatter.description ||
          `A practical guide for ${title.toLowerCase()}.`,
        content,
        category: frontmatter.category || "development",
        difficulty: toDifficulty(frontmatter.difficulty),
        estimatedTime: frontmatter.estimatedTime || "30-60 minutes",
        prerequisites: frontmatter.prerequisites || [],
        technologies: frontmatter.technologies || [],
        createdAt: toValidDate(fileStats.birthtime),
        updatedAt: toValidDate(fileStats.mtime),
      } satisfies Guide;
    }),
  );

  return guides;
}

export const getGuides = cache(async (): Promise<Guide[]> => {
  const externalGuidesDir = toExternalGuidesDir();

  if (await directoryExists(externalGuidesDir)) {
    return readGuidesFromDirectory(externalGuidesDir);
  }

  return readGuidesFromDirectory(FALLBACK_GUIDES_DIR);
});
