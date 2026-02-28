import type { NextConfig } from "next";

const isGithubPagesBuild = process.env.DEPLOY_TARGET === "github-pages";
const pagesBasePath = process.env.NEXT_PUBLIC_PAGES_BASE_PATH || "/home";

const nextConfig: NextConfig = {
  output: isGithubPagesBuild ? "export" : "standalone",
  outputFileTracingIncludes: isGithubPagesBuild
    ? undefined
    : {
        "/*": ["./src/content/guides/**/*.md", "./guides/**/*.md"],
      },
  basePath: isGithubPagesBuild ? pagesBasePath : undefined,
  assetPrefix: isGithubPagesBuild ? `${pagesBasePath}/` : undefined,
  trailingSlash: isGithubPagesBuild,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
