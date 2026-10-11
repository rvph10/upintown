// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://upintown.dev',
  trailingSlash: 'never',
  adapter: node({ mode: 'standalone' }),
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'fr', locales: { fr: 'fr-BE', en: 'en' } },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});