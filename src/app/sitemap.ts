import type { MetadataRoute } from "next";
import { getAllGuides } from "@/lib/guides";

const BASE = "https://www.sellmycarnewcastle.uk";

export default function sitemap(): MetadataRoute.Sitemap {
  const today = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: today, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/about`, lastModified: today, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/careers`, lastModified: today, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/guides`, lastModified: today, changeFrequency: "weekly", priority: 0.8 },
  ];

  const guidePages: MetadataRoute.Sitemap = getAllGuides().map((g) => ({
    url: `${BASE}/guides/${g.slug}`,
    lastModified: new Date(g.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...guidePages];
}
