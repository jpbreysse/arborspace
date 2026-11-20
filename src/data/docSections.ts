// Documentation sections, in reading order. Each section is a folder in src/content/docs.
// A section only appears on the site once its folder holds at least one page.
export interface DocSection { slug: string; label: string; description: string; }

export const docSections: DocSection[] = [
  { slug: 'getting-started', label: 'Getting started', description: 'The words and ideas behind ArborSpace' },
  { slug: 'ontology', label: 'Ontology', description: 'Classes, links and attributes' },
  { slug: 'rules', label: 'Rules', description: 'From an expert check to a rule' },
  { slug: 'review', label: 'Review', description: 'The review queue and the life of a finding' },
  { slug: 'using-the-app', label: 'Using the app', description: 'Search, questions and the asset registry' },
  { slug: 'deployment', label: 'Deployment', description: 'Running ArborSpace in your environment' },
  { slug: 'reference', label: 'Reference', description: 'Relation types, finding types, release notes' },
];

// Sections that already hold pages, read from the folders at build time
const files = Object.keys(import.meta.glob('../content/docs/*/*.md'));
const used = new Set(files.map((f) => f.split('/').at(-2)));
export const activeDocSections = docSections.filter((s) => used.has(s.slug));
