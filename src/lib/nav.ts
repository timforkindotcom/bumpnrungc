export const SITE_TABS = [
  { id: "location", href: "/location", label: "Location" },
  { id: "about", href: "/about", label: "About" },
  { id: "contact", href: "/contact", label: "Book Services", featured: true },
  { id: "services", href: "/services", label: "Services" },
  { id: "merch", href: "/merch", label: "Merch" },
] as const;

export type SiteTabId = (typeof SITE_TABS)[number]["id"];
