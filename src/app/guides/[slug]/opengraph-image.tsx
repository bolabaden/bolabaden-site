import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { getGuides } from "@/lib/guides";
import { config } from "@/lib/config";

/**
 * OpenGraph image generator using Next.js ImageResponse.
 *
 * ⚠️  INLINE STYLES REQUIRED HERE
 * This file uses `ImageResponse` from next/og which does NOT support Tailwind CSS.
 * ImageResponse uses Satori (a headless browser implementation) and requires plain inline CSS.
 * This is a documented exception to the "no inline styles" rule.
 * See: https://nextjs.org/docs/app/api-reference/functions/image-response
 */

export const runtime = "edge";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function GuideOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guides = await getGuides();
  const guide = guides.find((g) => g.slug === slug);

  if (!guide) return notFound();

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background:
          "linear-gradient(135deg, hsl(222 47% 11%) 0%, hsl(217 32% 17%) 64%, hsl(217 91% 60% / 0.3) 100%)",
        color: "hsl(210 20% 98%)",
        padding: "58px",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            width: "12px",
            height: "12px",
            borderRadius: "999px",
            background: "hsl(217 91% 60%)",
          }}
        />
        <div style={{ fontSize: 24, opacity: 0.9 }}>
          {config.SITE_NAME} • Guide
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div
          style={{
            fontSize: 54,
            fontWeight: 700,
            lineHeight: 1.08,
            maxWidth: "1080px",
          }}
        >
          {guide.title}
        </div>
        <div
          style={{
            fontSize: 26,
            opacity: 0.9,
            maxWidth: "1080px",
            lineHeight: 1.35,
          }}
        >
          {guide.description}
        </div>
      </div>

      <div
        style={{ display: "flex", gap: "10px", fontSize: 22, opacity: 0.85 }}
      >
        <span>{guide.category}</span>
        <span>•</span>
        <span>{guide.difficulty}</span>
        <span>•</span>
        <span>{guide.estimatedTime}</span>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
