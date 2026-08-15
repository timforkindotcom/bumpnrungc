/**
 * Site copy. The live site only shows what is published in Sanity.
 * Empty fields stay empty — nothing here is used as fallback text.
 */
export type ServiceItem = {
  title: string;
  description: string;
};

export type QuipGroup = {
  faultType: string;
  quips: string[];
};

export type SiteContent = {
  businessName: string;
  subheader: string;
  tagline: string;
  ctaHeadline: string;
  ctaServicesLabel: string;
  ctaContactLabel: string;
  freePlayBadge: string;
  seoTitle: string;
  seoDescription: string;
  location: {
    title: string;
    body: string;
    serviceArea: string;
  };
  about: {
    title: string;
    body: string;
    closer: string;
  };
  servicesPage: {
    title: string;
    intro: string;
  };
  services: ServiceItem[];
  contact: {
    title: string;
    intro: string;
    phone: string;
    email: string;
    instagram: string;
    facebook: string;
  };
  merch: {
    headline: string;
    body: string;
    comingSoon: string;
  };
  privacy: {
    title: string;
    body: string;
  };
  quips: QuipGroup[];
};

export const emptyContent: SiteContent = {
  businessName: "",
  subheader: "",
  tagline: "",
  ctaHeadline: "",
  ctaServicesLabel: "",
  ctaContactLabel: "",
  freePlayBadge: "",
  seoTitle: "",
  seoDescription: "",
  location: { title: "", body: "", serviceArea: "" },
  about: { title: "", body: "", closer: "" },
  servicesPage: { title: "", intro: "" },
  services: [],
  contact: {
    title: "",
    intro: "",
    phone: "",
    email: "",
    instagram: "",
    facebook: "",
  },
  merch: { headline: "", body: "", comingSoon: "" },
  privacy: { title: "", body: "" },
  quips: [],
};

export function hasText(value?: string | null): boolean {
  return Boolean(value?.trim());
}

export function hasLocation(content: SiteContent): boolean {
  return (
    hasText(content.location.title) ||
    hasText(content.location.body) ||
    hasText(content.location.serviceArea)
  );
}

export function hasAbout(content: SiteContent): boolean {
  return (
    hasText(content.about.title) ||
    hasText(content.about.body) ||
    hasText(content.about.closer)
  );
}

export function hasServices(content: SiteContent): boolean {
  return (
    hasText(content.servicesPage.title) ||
    hasText(content.servicesPage.intro) ||
    content.services.length > 0
  );
}

export function hasContact(content: SiteContent): boolean {
  return (
    hasText(content.contact.title) ||
    hasText(content.contact.intro) ||
    hasText(content.contact.phone) ||
    hasText(content.contact.email) ||
    hasText(content.contact.instagram) ||
    hasText(content.contact.facebook)
  );
}

export function hasMerch(content: SiteContent): boolean {
  return (
    hasText(content.merch.headline) ||
    hasText(content.merch.body) ||
    hasText(content.merch.comingSoon)
  );
}

export function hasPrivacy(content: SiteContent): boolean {
  return hasText(content.privacy.title) || hasText(content.privacy.body);
}

export function servicesTitle(content: SiteContent): string {
  return content.servicesPage.title.trim() || content.ctaServicesLabel.trim();
}

export function contactTitle(content: SiteContent): string {
  return content.contact.title.trim() || content.ctaContactLabel.trim();
}
