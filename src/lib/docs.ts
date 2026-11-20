import { getCollection, type CollectionEntry } from 'astro:content';
import { activeDocSections, type DocSection } from '../data/docSections';

export type DocEntry = CollectionEntry<'docs'>;
export interface DocGroup { section: DocSection; pages: DocEntry[]; }

// All docs grouped by section, sections in reading order, pages by their `order` then title
export async function getDocGroups(): Promise<DocGroup[]> {
  const docs = await getCollection('docs');
  return activeDocSections.map((section) => ({
    section,
    pages: docs
      .filter((d) => d.id.split('/')[0] === section.slug)
      .sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title)),
  }));
}

// The same pages as one flat list, for previous / next links
export async function getDocsInOrder(): Promise<DocEntry[]> {
  return (await getDocGroups()).flatMap((g) => g.pages);
}
