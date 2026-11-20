import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://arborspace.dev',
  output: 'static',
  build: { format: 'directory' },
  // Code blocks in the docs follow the light or dark theme of the site
  markdown: { shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } } },
  redirects: {
    '/brief': '/product',
    '/solutions/technical-due-diligence': '/solutions/energy-assets',
  },
});
