import { cache } from "react";
import type { SiteContent } from "./content";
import { defaultContent } from "./content";

function withoutNulls<T extends Record<string, unknown>>(
  value: T | null | undefined,
): Partial<T> {
  if (!value) return {};
  return Object.fromEntries(
    Object.entries(value).filter(([, item]) => item != null && item !== ""),
  ) as Partial<T>;
}

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
      useCdn: false,
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
      {},
      { cache: "no-store" },
    );

    if (!data) {
      return defaultContent;
    }

    const services = (data.services ?? []).filter(
      (item) => item?.title && item?.description,
    );
    const quips = (data.quips ?? []).filter(
      (item) => item?.faultType && item?.quips?.length,
    );

    return {
      ...defaultContent,
      ...withoutNulls(data as Record<string, unknown>),
      location: {
        ...defaultContent.location,
        ...withoutNulls(data.location as Record<string, unknown> | undefined),
      },
      about: {
        ...defaultContent.about,
        ...withoutNulls(data.about as Record<string, unknown> | undefined),
      },
      contact: {
        ...defaultContent.contact,
        ...withoutNulls(data.contact as Record<string, unknown> | undefined),
      },
      merch: {
        ...defaultContent.merch,
        ...withoutNulls(data.merch as Record<string, unknown> | undefined),
      },
      services: services.length ? services : defaultContent.services,
      quips: quips.length ? quips : defaultContent.quips,
    };
  } catch {
    return defaultContent;
  }
});
