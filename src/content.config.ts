import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { projectTagIds } from "./data/projectTags";

// Files live in `fr/` or `en/`; the same file name in both folders links the translations.
const projects = defineCollection({
  loader: glob({ pattern: "{fr,en}/*.md", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      sector: z.string(),
      summary: z.string(),
      /** The client's situation and what they needed. */
      context: z.string(),
      /** What was done, one short line each. */
      work: z.array(z.string()).min(1),
      /** What changed for the client, only when it is known. */
      outcome: z.string().optional(),
      /** Labels for what was done, from `src/data/projectTags.ts`. */
      tags: z.array(z.enum(projectTagIds)).min(1),
      cover: image(),
      coverAlt: z.string(),
      /** Wide image at the top of the project page, instead of the cover. */
      banner: z.object({ src: image(), alt: z.string() }).optional(),
      gallery: z.array(z.object({ src: image(), alt: z.string(), caption: z.string().optional() })).default([]),
      url: z.url().optional(),
      date: z.coerce.date(),
      /** Drafts show in development only. */
      draft: z.boolean().default(false),
    }),
});

export const collections = { projects };
