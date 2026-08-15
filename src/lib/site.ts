import type { Metadata } from "next";
import { hasText, type SiteContent } from "@/lib/content";

export const LIVE_SITE_URL = "https://bumpnrungc.com";

/** Live site URL. Set NEXT_PUBLIC_SITE_URL on Vercel to lock it in. */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (process.env.NODE_ENV === "production") return LIVE_SITE_URL;
  return "http://localhost:3000";
}

function telephoneUri(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return digits;
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return digits;
}

export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = `${getSiteUrl()}${opts.path}`;
  const metadata: Metadata = {
    alternates: { canonical: opts.path },
    openGraph: {
      url,
      type: "website",
    },
  };
  if (hasText(opts.title)) {
    metadata.title = opts.title;
    metadata.openGraph = { ...metadata.openGraph, title: opts.title };
  }
  if (hasText(opts.description)) {
    metadata.description = opts.description;
    metadata.openGraph = { ...metadata.openGraph, description: opts.description };
  }
  return metadata;
}

export function sanityPageMetadata(
  content: SiteContent,
  title: string,
  description: string,
  path: string,
): Metadata {
  return pageMetadata({
    title: title.trim() || content.seoTitle || content.businessName,
    description: description.trim() || content.seoDescription,
    path,
  });
}

export function localBusinessJsonLd(content: SiteContent) {
  const url = getSiteUrl();
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${url}/#business`,
    url,
  };

  if (hasText(content.businessName)) jsonLd.name = content.businessName;
  if (hasText(content.seoDescription)) jsonLd.description = content.seoDescription;
  if (hasText(content.tagline)) jsonLd.slogan = content.tagline;
  if (hasText(content.location.serviceArea)) {
    jsonLd.areaServed = content.location.serviceArea;
  }
  if (content.services.length) {
    jsonLd.hasOfferCatalog = {
      "@type": "OfferCatalog",
      name: content.servicesPage.title || content.businessName,
      itemListElement: content.services.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.title,
          description: service.description,
        },
      })),
    };
  }

  if (content.contact.phone) jsonLd.telephone = telephoneUri(content.contact.phone);
  if (content.contact.email) jsonLd.email = content.contact.email;

  const sameAs = [content.contact.instagram, content.contact.facebook].filter(
    Boolean,
  );
  if (sameAs.length) jsonLd.sameAs = sameAs;

  return jsonLd;
}
