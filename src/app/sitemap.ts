import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = getSiteUrl();
  const lastModified = new Date();
  const paths: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] =
    [
      { path: "", priority: 1, changeFrequency: "weekly" },
      { path: "/services", priority: 0.9, changeFrequency: "monthly" },
      { path: "/location", priority: 0.8, changeFrequency: "monthly" },
      { path: "/about", priority: 0.7, changeFrequency: "monthly" },
      { path: "/contact", priority: 0.8, changeFrequency: "monthly" },
      { path: "/merch", priority: 0.3, changeFrequency: "monthly" },
      { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
    ];

  return paths.map(({ path, priority, changeFrequency }) => ({
    url: `${url}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
