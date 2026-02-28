import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";

const CHECK_TIMEOUT_MS = 3000;

function normalizePath(path: string): string {
  if (!path) return "/search";
  return path.startsWith("/") ? path : `/${path}`;
}

function buildSearchUrl(
  baseUrl: string,
  searchPath: string,
  query: string,
): string {
  const url = new URL(baseUrl.replace(/\/+$/, ""));
  url.pathname = normalizePath(searchPath);
  url.search = "";
  url.searchParams.set("q", query);
  return url.toString();
}

async function isHealthySearchTarget(url: string): Promise<boolean> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CHECK_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "manual",
      cache: "no-store",
      signal: controller.signal,
      headers: {
        "User-Agent": "bolabaden-site/healthcheck",
      },
    });

    return response.status >= 200 && response.status < 400;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() || "";

  const primarySearchUrl = buildSearchUrl(
    config.SEARXNG_URL,
    config.SEARXNG_SEARCH_PATH,
    query,
  );

  const fallbackSearchUrl = buildSearchUrl(
    config.SEARXNG_PUBLIC_URL,
    config.SEARXNG_SEARCH_PATH,
    query,
  );

  if (
    !config.SEARXNG_FALLBACK_ENABLED ||
    config.SEARXNG_URL === config.SEARXNG_PUBLIC_URL
  ) {
    return NextResponse.redirect(primarySearchUrl, { status: 307 });
  }

  const healthy = await isHealthySearchTarget(primarySearchUrl);
  if (healthy) {
    return NextResponse.redirect(primarySearchUrl, { status: 307 });
  }

  return NextResponse.redirect(fallbackSearchUrl, { status: 307 });
}
