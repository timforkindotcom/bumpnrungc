import { defineField, defineType } from "sanity";

export const merchPage = defineType({
  name: "merchPage",
  title: "Merch Page",
  type: "document",
  fields: [
    defineField({ name: "headline", title: "Headline", type: "string" }),
    defineField({ name: "body", title: "Body", type: "text" }),
    defineField({ name: "comingSoon", title: "Coming Soon Label", type: "string" }),
  ],
});
