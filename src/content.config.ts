import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { blogCategoryIds } from "./data/blogCategories";
import { serviceIds } from "./data/offer";
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

// Same layout as projects: `fr/` and `en/`, matched by file name. The file name is also the address unless
// `urlSlug` sets a shorter or translated one; the file name then redirects to it.
const posts = defineCollection({
  loader: glob({ pattern: "{fr,en}/*.md", base: "./src/content/posts" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** The address in this language, when it differs from the file name. Never change it once published. */
      urlSlug: z
        .string()
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        .optional(),
      /** One or two sentences, on cards and under the title. */
      excerpt: z.string(),
      /** Search result title and description, when they differ from the title and excerpt. */
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      category: z.enum(blogCategoryIds),
      cover: image(),
      coverAlt: z.string(),
      date: z.coerce.date(),
      /** The service the article leads to, for its calls to action. */
      service: z.enum(serviceIds),
      /** A project from `src/content/projects` shown as an example, by file name. */
      project: z.string().optional(),
      /** Holo article id, for articles imported by `scripts/holo-import.ts`. */
      holoId: z.string().optional(),
      /** Drafts show in development only. */
      draft: z.boolean().default(false),
    }),
});

export const collections = { projects, posts };
