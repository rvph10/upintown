import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  output: 'server', // SSR pour permettre les API routes
  server: {
    port: 4321,
    host: true
  },  
  adapter: vercel(),
  vite: {
    build: {
      assetsInclude: ['**/*.jpeg', '**/*.jpg', '**/*.png', '**/*.svg', '**/*.gif'],
    },
  },
});
