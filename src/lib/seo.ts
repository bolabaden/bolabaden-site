import type { Metadata } from "next";
import { config } from "@/lib/config";

function toCanonical(pathname: string): string {
  if (!pathname || pathname === "/") return config.SITE_URL;
  return `${config.SITE_URL}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}

export interface BuildPageMetadataInput {
  title: string;
  description: string;
  pathname: string;
  imagePath?: string;
  type?: "website" | "article";
  keywords?: string[];
}

export function buildPageMetadata({
  title,
  description,
  pathname,
  imagePath,
  type = "website",
  keywords,
}: BuildPageMetadataInput): Metadata {
  const canonical = toCanonical(pathname);
  const imageUrl = toCanonical(
    imagePath || `${pathname.replace(/\/$/, "") || ""}/opengraph-image`,
  );

  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: {
      canonical,
    },
    openGraph: {
      type,
      locale: "en_US",
      url: canonical,
      siteName: config.SITE_NAME,
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}
