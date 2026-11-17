import { ImageResponse } from "next/og";
import { brand } from "@config/brand";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Favicon generated from brand.logo.mark and brand.colors. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: brand.colors.primary,
          borderRadius: 14,
          color: "white",
          fontSize: 40,
          fontWeight: 800,
        }}
      >
        {brand.logo.mark}
      </div>
    ),
    size,
  );
}
