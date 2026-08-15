import { defineField, defineType } from "sanity";

export const privacyPage = defineType({
  name: "privacyPage",
  title: "Privacy Page",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "body", title: "Body", type: "text" }),
  ],
});
