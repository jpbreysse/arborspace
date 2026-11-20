import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Documentation pages: one Markdown file per page in src/content/docs
const docs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    audience: z.enum(['Analysts', 'IT teams']),
    order: z.number(),
  }),
});

export const collections = { docs };
