import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  output: 'server', // SSR pour permettre les API routes
  adapter: vercel(),
  vite: {
    build: {
      assetsInclude: ['**/*.jpeg', '**/*.jpg', '**/*.png', '**/*.svg', '**/*.gif'],
    },
  },
});
