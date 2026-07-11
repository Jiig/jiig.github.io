import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";

import { LinksSchema } from "./content/links/types";

const links = defineCollection({
  loader: glob({ pattern: "**/*.{yaml,yml}", base: "./src/content/links" }),
  schema: LinksSchema,
});

export const collections = {
  links,
};
