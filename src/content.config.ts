import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Files live in `fr/` or `en/`; the same file name in both folders links the translations.
const projects = defineCollection({
  loader: glob({ pattern: '{fr,en}/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      sector: z.string(),
      summary: z.string(),
      services: z.array(z.enum(['website', 'care', 'google'])),
      cover: image(),
      coverAlt: z.string(),
      url: z.url().optional(),
      date: z.coerce.date(),
    }),
});

export const collections = { projects };
