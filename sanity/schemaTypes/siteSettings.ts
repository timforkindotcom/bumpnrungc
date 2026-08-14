import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "businessName", title: "Business Name", type: "string" }),
    defineField({ name: "subheader", title: "Subheader", type: "string" }),
    defineField({ name: "tagline", title: "Tagline", type: "string" }),
    defineField({ name: "ctaHeadline", title: "CTA Headline", type: "string" }),
    defineField({ name: "ctaServicesLabel", title: "CTA Services Button", type: "string" }),
    defineField({ name: "ctaContactLabel", title: "CTA Contact Button", type: "string" }),
    defineField({ name: "freePlayBadge", title: "Free Play Badge", type: "string" }),
    defineField({ name: "seoTitle", title: "SEO Title", type: "string" }),
    defineField({ name: "seoDescription", title: "SEO Description", type: "text" }),
  ],
});
