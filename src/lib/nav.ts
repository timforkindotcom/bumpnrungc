import type { SiteContent } from "@/lib/content";
import {
  contactTitle,
  hasAbout,
  hasContact,
  hasLocation,
  hasMerch,
  hasServices,
  hasText,
  servicesTitle,
} from "@/lib/content";

export const SITE_TABS = [
  { id: "location", href: "/location" },
  { id: "about", href: "/about" },
  { id: "contact", href: "/contact", featured: true },
  { id: "services", href: "/services" },
  { id: "merch", href: "/merch" },
] as const;

export type SiteTabId = (typeof SITE_TABS)[number]["id"];

export type VisibleTab = {
  id: SiteTabId;
  href: string;
  label: string;
  featured?: boolean;
};

export function getVisibleTabs(content: SiteContent): VisibleTab[] {
  const tabs: VisibleTab[] = [];

  if (hasLocation(content) && hasText(content.location.title)) {
    tabs.push({
      id: "location",
      href: "/location",
      label: content.location.title,
    });
  }

  if (hasAbout(content) && hasText(content.about.title)) {
    tabs.push({
      id: "about",
      href: "/about",
      label: content.about.title,
    });
  }

  const bookLabel = contactTitle(content);
  if (hasContact(content) && hasText(bookLabel)) {
    tabs.push({
      id: "contact",
      href: "/contact",
      label: bookLabel,
      featured: true,
    });
  }

  const servicesLabel = servicesTitle(content);
  if (hasServices(content) && hasText(servicesLabel)) {
    tabs.push({
      id: "services",
      href: "/services",
      label: servicesLabel,
    });
  }

  if (hasMerch(content) && hasText(content.merch.headline)) {
    tabs.push({
      id: "merch",
      href: "/merch",
      label: content.merch.headline,
    });
  }

  return tabs;
}
