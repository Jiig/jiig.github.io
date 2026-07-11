import { z } from "astro/zod";

export const LinkSchema = z.object({
  name: z.string(),
  iconName: z.string(),
  url: z.url(),
});

export const SectionSchema = z.object({
  name: z.string(),
  links: z.array(LinkSchema),
});

export const LinksSchema = z.object({
  sections: z.array(SectionSchema),
});

export type Section = z.infer<typeof SectionSchema>;
export type Links = z.infer<typeof LinksSchema>;
export type Link = z.infer<typeof LinkSchema>;
