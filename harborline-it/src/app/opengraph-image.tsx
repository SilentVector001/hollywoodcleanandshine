import { ImageResponse } from "next/og";
import { brand } from "@config/brand";

export const alt = brand.seo.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Social share image generated from the brand config (no stock photos). */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: `linear-gradient(135deg, ${brand.colors.primaryDark} 0%, ${brand.colors.primary} 100%)`,
          color: "white",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 16,
              background: brand.colors.accent,
              color: brand.colors.primaryDark,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 44,
              fontWeight: 800,
            }}
          >
            {brand.logo.mark}
          </div>
          <div style={{ fontSize: 40, fontWeight: 700 }}>{brand.company.name}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.1, maxWidth: 980 }}>{brand.hero.headline}</div>
          <div style={{ fontSize: 30, opacity: 0.85 }}>{brand.company.tagline}</div>
        </div>
      </div>
    ),
    size,
  );
}
