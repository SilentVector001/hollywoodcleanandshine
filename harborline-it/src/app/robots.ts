import type { MetadataRoute } from "next";
import { brand } from "@config/brand";

export default function robots(): MetadataRoute.Robots {
  const base = brand.company.siteUrl.replace(/\/$/, "");
  // Demo sites stay out of search results.
  if (brand.demo.enabled) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api", "/risk-check/report"] },
    sitemap: `${base}/sitemap.xml`,
  };
}
