import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://www.sellmycarnewcastle.uk/sitemap.xml",
    host: "https://www.sellmycarnewcastle.uk",
  };
}
