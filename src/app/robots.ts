import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const url = getSiteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/studio", "/studio/", "/api/"],
    },
    sitemap: `${url}/sitemap.xml`,
  };
}
