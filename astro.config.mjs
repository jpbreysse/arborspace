import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://arborspace.dev',
  output: 'static',
  build: { format: 'directory' },
  redirects: {
    '/brief': '/resources/brief',
    '/solutions/technical-due-diligence': '/solutions/energy-assets',
  },
});
