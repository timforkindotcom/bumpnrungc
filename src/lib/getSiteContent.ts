import { cache } from "react";
import type { SiteContent } from "./content";
import { defaultContent } from "./content";

export const getSiteContent = cache(async (): Promise<SiteContent> => {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

  if (!projectId) {
    return defaultContent;
  }

  try {
    const { createClient } = await import("@sanity/client");
    const client = createClient({
      projectId,
      dataset,
      apiVersion: "2024-01-01",
      useCdn: true,
    });

    const data = await client.fetch<Partial<SiteContent> | null>(
      `{
        "businessName": *[_type == "siteSettings"][0].businessName,
        "subheader": *[_type == "siteSettings"][0].subheader,
        "tagline": *[_type == "siteSettings"][0].tagline,
        "ctaHeadline": *[_type == "siteSettings"][0].ctaHeadline,
        "ctaServicesLabel": *[_type == "siteSettings"][0].ctaServicesLabel,
        "ctaContactLabel": *[_type == "siteSettings"][0].ctaContactLabel,
        "freePlayBadge": *[_type == "siteSettings"][0].freePlayBadge,
        "seoTitle": *[_type == "siteSettings"][0].seoTitle,
        "seoDescription": *[_type == "siteSettings"][0].seoDescription,
        "location": *[_type == "locationPage"][0]{
          title,
          body,
          serviceArea
        },
        "about": *[_type == "aboutPage"][0]{
          title,
          body,
          closer
        },
        "services": *[_type == "serviceItem"] | order(order asc) {
          title,
          description
        },
        "contact": *[_type == "contactPage"][0]{
          intro,
          phone,
          email,
          instagram,
          facebook
        },
        "merch": *[_type == "merchPage"][0]{
          headline,
          body,
          comingSoon
        },
        "quips": *[_type == "gameQuips"] {
          faultType,
          quips
        }
      }`,
    );

    if (!data?.businessName) {
      return defaultContent;
    }

    return {
      ...defaultContent,
      ...data,
      location: { ...defaultContent.location, ...data.location },
      about: { ...defaultContent.about, ...data.about },
      contact: { ...defaultContent.contact, ...data.contact },
      merch: { ...defaultContent.merch, ...data.merch },
      services: data.services?.length ? data.services : defaultContent.services,
      quips: data.quips?.length ? data.quips : defaultContent.quips,
    };
  } catch {
    return defaultContent;
  }
});

