import { ImageResponse } from "next/og";
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
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function AboutOpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background:
          "linear-gradient(135deg, hsl(222 47% 11%) 0%, hsl(217 32% 17%) 62%, hsl(217 91% 60% / 0.28) 100%)",
        color: "hsl(210 20% 98%)",
        padding: "62px",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <div style={{ fontSize: 24, opacity: 0.9 }}>{config.SITE_NAME}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <div style={{ fontSize: 62, fontWeight: 700 }}>
          {config.OG_ABOUT_TITLE}
        </div>
        <div
          style={{ fontSize: 34, color: "hsl(217 91% 72%)", fontWeight: 600 }}
        >
          {config.OG_ABOUT_SUBTITLE}
        </div>
        <div style={{ fontSize: 26, opacity: 0.92, maxWidth: "1000px" }}>
          {config.OG_ABOUT_DESCRIPTION}
        </div>
      </div>
      <div
        style={{ fontSize: 22, opacity: 0.8 }}
      >{`${config.SITE_DOMAIN}/about`}</div>
    </div>,
    size,
  );
}
