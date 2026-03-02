/**
 * SEO robots.txt generation for search engine directives.
 *
 * CONTEXT: Shared SEO Utility
 * Dynamic robots.txt metadata (allow/disallow paths).
 * Applied site-wide regardless of context (portfolio or discovery).
 */

import { MetadataRoute } from "next";
import { config } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/public/"],
      },
    ],
    sitemap: `${config.SITE_URL}/sitemap.xml`,
  };
}
