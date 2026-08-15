import type { MetadataRoute } from "next";
import { getSiteContent } from "@/lib/getSiteContent";
import {
  hasAbout,
  hasContact,
  hasLocation,
  hasMerch,
  hasPrivacy,
  hasServices,
} from "@/lib/content";
import { getSiteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = getSiteUrl();
  const content = await getSiteContent();
  const lastModified = new Date();
  const paths: {
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  }[] = [{ path: "", priority: 1, changeFrequency: "weekly" }];

  if (hasServices(content)) {
    paths.push({ path: "/services", priority: 0.9, changeFrequency: "monthly" });
  }
  if (hasLocation(content)) {
    paths.push({ path: "/location", priority: 0.8, changeFrequency: "monthly" });
  }
  if (hasAbout(content)) {
    paths.push({ path: "/about", priority: 0.7, changeFrequency: "monthly" });
  }
  if (hasContact(content)) {
    paths.push({ path: "/contact", priority: 0.8, changeFrequency: "monthly" });
  }
  if (hasMerch(content)) {
    paths.push({ path: "/merch", priority: 0.3, changeFrequency: "monthly" });
  }
  if (hasPrivacy(content)) {
    paths.push({ path: "/privacy", priority: 0.2, changeFrequency: "yearly" });
  }

  return paths.map(({ path, priority, changeFrequency }) => ({
    url: `${url}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
