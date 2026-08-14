import { defineField, defineType } from "sanity";

export const gameQuips = defineType({
  name: "gameQuips",
  title: "Game Quips",
  type: "document",
  fields: [
    defineField({
      name: "faultType",
      title: "Fault Type",
      type: "string",
      options: {
        list: ["slice", "hook", "chunk", "shank", "pull", "push", "short", "skull"],
      },
    }),
    defineField({
      name: "quips",
      title: "Quips",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],
});
