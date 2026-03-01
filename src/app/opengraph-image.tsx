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
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background:
          "linear-gradient(135deg, hsl(222 47% 11%) 0%, hsl(217 32% 17%) 60%, hsl(217 91% 60% / 0.35) 100%)",
        color: "hsl(210 20% 98%)",
        padding: "64px",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div
          style={{
            width: "14px",
            height: "14px",
            borderRadius: "999px",
            background: "hsl(217 91% 60%)",
          }}
        />
        <div style={{ fontSize: 26, opacity: 0.9 }}>{config.SITE_NAME}</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.05 }}>
          {config.OG_HOME_TITLE}
        </div>
        <div
          style={{ fontSize: 36, color: "hsl(217 91% 72%)", fontWeight: 600 }}
        >
          {config.OG_HOME_SUBTITLE}
        </div>
        <div
          style={{
            fontSize: 28,
            opacity: 0.9,
            maxWidth: "1000px",
            lineHeight: 1.35,
          }}
        >
          {config.OG_HOME_DESCRIPTION}
        </div>
      </div>

      <div style={{ fontSize: 22, opacity: 0.8 }}>{config.SITE_DOMAIN}</div>
    </div>,
    {
      ...size,
    },
  );
}
