export const SITE_TABS = [
  { id: "location", href: "/location", label: "Location" },
  { id: "about", href: "/about", label: "About" },
  { id: "services", href: "/services", label: "Services" },
  { id: "contact", href: "/contact", label: "Contact" },
  { id: "merch", href: "/merch", label: "Merch" },
] as const;

export type SiteTabId = (typeof SITE_TABS)[number]["id"];
