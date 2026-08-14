import { defineField, defineType } from "sanity";

export const locationPage = defineType({
  name: "locationPage",
  title: "Location Page",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "body", title: "Body", type: "text" }),
    defineField({ name: "serviceArea", title: "Service Area", type: "string" }),
  ],
});
