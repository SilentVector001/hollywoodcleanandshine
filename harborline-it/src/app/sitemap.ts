import type { MetadataRoute } from "next";
import { brand } from "@config/brand";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = brand.company.siteUrl.replace(/\/$/, "");
  return ["", "/about", "/contact"].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
