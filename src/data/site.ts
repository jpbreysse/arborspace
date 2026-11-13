// Contact address, used by every "Discuss a pilot" button
export const contactEmail = 'contact@arborspace.dev';
export const pilotMailto = `mailto:${contactEmail}?subject=${encodeURIComponent('ArborSpace pilot')}`;

export interface NavItem { label: string; href: string; description: string; }
export interface NavGroup { label: string; items: NavItem[]; }

// Main menu: also used for the footer columns
export const nav: NavGroup[] = [
  {
    label: 'Product',
    items: [
      { label: 'Overview', href: '/product', description: 'How ArborSpace fits together' },
      { label: 'Ontology', href: '/product/ontology', description: 'Your vocabulary, as objects and links' },
      { label: 'Rules', href: '/product/rules', description: 'Expert knowledge, written down and applied' },
      { label: 'Review queue', href: '/product/review-queue', description: 'Every finding checked by an expert' },
      { label: 'Deployment', href: '/product/deployment', description: 'On your premises or in your own cloud' },
    ],
  },
  {
    label: 'Solutions',
    items: [
      { label: 'Ontology for Energy Assets', href: '/solutions/energy-assets', description: 'Assets, findings and lenders, connected' },
      { label: 'Technical consulting', href: '/solutions/technical-consulting', description: 'Reuse what your experts already know' },
      { label: 'Commodity trading', href: '/solutions/commodity-trading', description: 'Capture the judgement behind each deal' },
    ],
  },
  {
    label: 'Customers',
    items: [
      { label: 'Due diligence firms', href: '/customers/due-diligence', description: 'Independent engineers advising lenders' },
    ],
  },
  {
    label: 'Resources',
    items: [
      { label: 'Brief', href: '/resources/brief', description: 'ArborSpace on one page' },
      { label: 'Pilot program', href: '/resources/pilot', description: 'Six weeks, fifteen rules, your own engagements' },
    ],
  },
  {
    label: 'Company',
    items: [
      { label: 'About', href: '/company/about', description: 'Why we are building ArborSpace' },
      { label: 'Contact', href: '/company/contact', description: 'Talk to us about a pilot' },
    ],
  },
];

// The worked example used on several pages: a finding and what it is linked to
export const examplePath = [
  { kind: 'Finding', label: 'Vibration above 8.2 mm/s', edge: 'concerns' },
  { kind: 'Asset', label: 'Class 7F gas turbine', edge: 'installed at' },
  { kind: 'Site', label: 'Combined-cycle power plant', edge: 'assessed in' },
  { kind: 'Engagement', label: 'Technical due diligence', edge: 'delivered to' },
  { kind: 'Lender', label: 'The bank financing the asset', edge: '' },
];
