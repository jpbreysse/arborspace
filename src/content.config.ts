import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Documentation pages: one Markdown file per page, in a folder per section (src/content/docs/<section>/<page>.md)
const docs = defineCollection({
  loader: glob({ pattern: '*/*.md', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    audience: z.enum(['Analysts', 'IT teams', 'Everyone']),
    // Position within its section; pages with the same number are sorted by title
    order: z.number().default(10),
  }),
});

export const collections = { docs };
