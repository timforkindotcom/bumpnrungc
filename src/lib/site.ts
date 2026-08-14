import type { Metadata } from "next";
import type { SiteContent } from "@/lib/content";

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
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: opts.path },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      type: "website",
    },
  };
}

export function localBusinessJsonLd(content: SiteContent) {
  const url = getSiteUrl();
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${url}/#business`,
    name: content.businessName,
    alternateName: "Bump N Run",
    description: content.seoDescription,
    url,
    slogan: content.tagline,
    image: `${url}/opengraph-image`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Brighton",
      addressRegion: "MI",
      addressCountry: "US",
    },
    areaServed: [
      {
        "@type": "City",
        name: "Brighton",
        containedInPlace: { "@type": "State", name: "Michigan" },
      },
      { "@type": "AdministrativeArea", name: "Livingston County" },
      { "@type": "AdministrativeArea", name: "Washtenaw County" },
      { "@type": "AdministrativeArea", name: "Southeast Michigan" },
    ],
    knowsAbout: [
      "Golf club repair",
      "Golf club regripping",
      "Mobile golf repair",
      "Loft and lie adjustment",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Golf club repair services",
      itemListElement: content.services.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.title,
          description: service.description,
        },
      })),
    },
  };

  if (content.contact.phone) jsonLd.telephone = telephoneUri(content.contact.phone);
  if (content.contact.email) jsonLd.email = content.contact.email;

  const sameAs = [content.contact.instagram, content.contact.facebook].filter(
    Boolean,
  );
  if (sameAs.length) jsonLd.sameAs = sameAs;

  return jsonLd;
}
