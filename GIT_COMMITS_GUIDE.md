# Guide des Commits - Migration Astro

Ce document détaille l'ensemble des commits à effectuer pour la migration vers Astro.

## 📋 Ordre des Commits

### 1. Configuration Astro et Vercel

**Type:** `feat(config)`

**Message:**

```
feat(config): configure Astro with SSR and Vercel adapter

- Enable SSR mode for API routes support
- Configure Vercel adapter with Web Analytics and Speed Insights
- Set site URL to https://upintown.dev
- Configure Vite to include image assets
- Set dev server to port 4321 with host access
```

**Fichiers:**

- `astro.config.mjs` (modifié)

**Commande:**

```bash
git add astro.config.mjs
git commit -m "feat(config): configure Astro with SSR and Vercel adapter

- Enable SSR mode for API routes support
- Configure Vercel adapter with Web Analytics and Speed Insights
- Set site URL to https://upintown.dev
- Configure Vite to include image assets
- Set dev server to port 4321 with host access"
```

---

### 2. Configuration de Sécurité Vercel

**Type:** `feat(security)`

**Message:**

```
feat(security): add Vercel security headers and caching configuration

- Implement CSP, X-Frame-Options, and HSTS headers
- Configure cache policies for static assets (1 year)
- Set no-cache policy for API routes
- Add sitemap rewrite configuration
- Enable security best practices (XSS protection, nosniff, referrer policy)
```

**Fichiers:**

- `vercel.json` (nouveau)

**Commande:**

```bash
git add vercel.json
git commit -m "feat(security): add Vercel security headers and caching configuration

- Implement CSP, X-Frame-Options, and HSTS headers
- Configure cache policies for static assets (1 year)
- Set no-cache policy for API routes
- Add sitemap rewrite configuration
- Enable security best practices (XSS protection, nosniff, referrer policy)"
```

---

### 3. Composant SEO

**Type:** `feat(seo)`

**Message:**

```
feat(seo): add comprehensive SEO component

- Add OpenGraph and Twitter Card meta tags
- Support for article metadata (publish/modified dates, author, tags)
- Automatic title and description optimization (60/160 chars)
- Canonical URL management
- Noindex support for specific pages
- Dynamic og:image with proper dimensions (1200x630)
```

**Fichiers:**

- `src/components/SEO.astro` (nouveau)

**Commande:**

```bash
git add src/components/SEO.astro
git commit -m "feat(seo): add comprehensive SEO component

- Add OpenGraph and Twitter Card meta tags
- Support for article metadata (publish/modified dates, author, tags)
- Automatic title and description optimization (60/160 chars)
- Canonical URL management
- Noindex support for specific pages
- Dynamic og:image with proper dimensions (1200x630)"
```

---

### 4. Composant d'Optimisation d'Images

**Type:** `feat(images)`

**Message:**

```
feat(images): add OptimizedImage component with responsive support

- Support for Astro's native Image optimization
- Automatic responsive image generation (400, 800, 1200, 1920px)
- WebP format by default for better compression
- Configurable quality, format, and loading strategy
- Fallback to standard img tag for string URLs
- Lazy loading by default for better performance
```

**Fichiers:**

- `src/components/OptimizedImage.astro` (nouveau)

**Commande:**

```bash
git add src/components/OptimizedImage.astro
git commit -m "feat(images): add OptimizedImage component with responsive support

- Support for Astro's native Image optimization
- Automatic responsive image generation (400, 800, 1200, 1920px)
- WebP format by default for better compression
- Configurable quality, format, and loading strategy
- Fallback to standard img tag for string URLs
- Lazy loading by default for better performance"
```

---

### 5. Sitemap Dynamique

**Type:** `feat(seo)`

**Message:**

```
feat(seo): add dynamic XML sitemap generation

- Create sitemap.xml API route
- Include all main pages (home, about, project, contact)
- Configure changefreq and priority for each page
- Add lastmod timestamps
- Set proper caching headers (1 hour)
```

**Fichiers:**

- `src/pages/sitemap.xml.ts` (nouveau)

**Commande:**

```bash
git add src/pages/sitemap.xml.ts
git commit -m "feat(seo): add dynamic XML sitemap generation

- Create sitemap.xml API route
- Include all main pages (home, about, project, contact)
- Configure changefreq and priority for each page
- Add lastmod timestamps
- Set proper caching headers (1 hour)"
```

---

### 6. Robots.txt

**Type:** `feat(seo)`

**Message:**

```
feat(seo): add robots.txt for search engine crawling

- Allow all search engine bots
- Reference sitemap location
- Include commented examples for blocking specific paths/bots
```

**Fichiers:**

- `public/robots.txt` (nouveau)

**Commande:**

```bash
git add public/robots.txt
git commit -m "feat(seo): add robots.txt for search engine crawling

- Allow all search engine bots
- Reference sitemap location
- Include commented examples for blocking specific paths/bots"
```

---

### 7. PWA Manifest

**Type:** `feat(pwa)`

**Message:**

```
feat(pwa): add web app manifest for PWA support

- Configure app name and short name
- Define maskable icons (192x192, 512x512)
- Set theme and background colors
- Enable standalone display mode
```

**Fichiers:**

- `public/site.webmanifest` (nouveau)

**Commande:**

```bash
git add public/site.webmanifest
git commit -m "feat(pwa): add web app manifest for PWA support

- Configure app name and short name
- Define maskable icons (192x192, 512x512)
- Set theme and background colors
- Enable standalone display mode"
```

---

### 8. Favicons et Icônes d'Application

**Type:** `feat(assets)`

**Message:**

```
feat(assets): add comprehensive favicon and app icon set

- Add SVG favicon for modern browsers
- Include PNG fallbacks (96x96)
- Add Apple touch icon (180x180)
- Include PWA manifest icons (192x192, 512x512)
- Add legacy ICO format for broad compatibility
```

**Fichiers:**

- `public/favicon.ico` (nouveau)
- `public/global/favicon.svg` (nouveau)
- `public/global/favicon-96x96.png` (nouveau)
- `public/global/apple-touch-icon.png` (nouveau)
- `public/global/web-app-manifest-192x192.png` (nouveau)
- `public/global/web-app-manifest-512x512.png` (nouveau)

**Commande:**

```bash
git add public/favicon.ico public/global/favicon.svg public/global/favicon-96x96.png public/global/apple-touch-icon.png public/global/web-app-manifest-192x192.png public/global/web-app-manifest-512x512.png
git commit -m "feat(assets): add comprehensive favicon and app icon set

- Add SVG favicon for modern browsers
- Include PNG fallbacks (96x96)
- Add Apple touch icon (180x180)
- Include PWA manifest icons (192x192, 512x512)
- Add legacy ICO format for broad compatibility"
```

---

### 9. Images de Projets

**Type:** `feat(assets)`

**Message:**

```
feat(assets): add project showcase images and media

- Add 5 project images in PNG and WebP formats
- Include project showcase video (MP4)
- Optimize images for web delivery
```

**Fichiers:**

- `public/project-images/` (nouveau dossier)
  - `project-img-1.png`, `project-img-1.webp`
  - `project-img-2.png`, `project-img-2.webp`
  - `project-img-3.png`, `project-img-3.webp`
  - `project-img-4.png`, `project-img-4.webp`
  - `project-img-5.png`
  - `project-showcase.mp4`

**Commande:**

```bash
git add public/project-images/
git commit -m "feat(assets): add project showcase images and media

- Add 5 project images in PNG and WebP formats
- Include project showcase video (MP4)
- Optimize images for web delivery"
```

---

### 10. Mise à Jour du Logo

**Type:** `refactor(assets)`

**Message:**

```
refactor(assets): update logo SVG with improved styling
```

**Fichiers:**

- `public/global/logo.svg` (modifié)

**Commande:**

```bash
git add public/global/logo.svg
git commit -m "refactor(assets): update logo SVG with improved styling"
```

---

### 11. Mise à Jour des Layouts et Composants

**Type:** `refactor(layouts)`

**Message:**

```
refactor(layouts): update BaseLayout with SEO integration

- Integrate new SEO component
- Update meta tags structure
- Improve accessibility and semantics
```

**Fichiers:**

- `src/layouts/BaseLayout.astro` (modifié)

**Commande:**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "refactor(layouts): update BaseLayout with SEO integration

- Integrate new SEO component
- Update meta tags structure
- Improve accessibility and semantics"
```

---

### 12. Mise à Jour du Footer

**Type:** `refactor(components)`

**Message:**

```
refactor(components): update Footer component for Astro
```

**Fichiers:**

- `src/components/Footer.astro` (modifié)

**Commande:**

```bash
git add src/components/Footer.astro
git commit -m "refactor(components): update Footer component for Astro"
```

---

### 13. Mise à Jour des Pages

**Type:** `refactor(pages)`

**Message:**

```
refactor(pages): migrate pages to Astro framework

- Update index page with Astro syntax
- Refactor about page for SSR
- Modernize project page structure
- Update contact page with new form handling
- Improve 404 page design
```

**Fichiers:**

- `src/pages/index.astro` (modifié)
- `src/pages/about.astro` (modifié)
- `src/pages/project.astro` (modifié)
- `src/pages/contact.astro` (modifié)
- `src/pages/404.astro` (modifié)

**Commande:**

```bash
git add src/pages/index.astro src/pages/about.astro src/pages/project.astro src/pages/contact.astro src/pages/404.astro
git commit -m "refactor(pages): migrate pages to Astro framework

- Update index page with Astro syntax
- Refactor about page for SSR
- Modernize project page structure
- Update contact page with new form handling
- Improve 404 page design"
```

---

### 14. Mise à Jour des Styles

**Type:** `refactor(styles)`

**Message:**

```
refactor(styles): update CSS for Astro compatibility

- Modernize global styles
- Update about page styles
- Refactor contact page styles
- Improve project page styles
```

**Fichiers:**

- `src/styles/globals.css` (modifié)
- `src/styles/about.css` (modifié)
- `src/styles/contact.css` (modifié)
- `src/styles/project.css` (modifié)

**Commande:**

```bash
git add src/styles/globals.css src/styles/about.css src/styles/contact.css src/styles/project.css
git commit -m "refactor(styles): update CSS for Astro compatibility

- Modernize global styles
- Update about page styles
- Refactor contact page styles
- Improve project page styles"
```

---

### 15. Mise à Jour des Scripts

**Type:** `refactor(scripts)`

**Message:**

```
refactor(scripts): update JavaScript for Astro integration

- Update Lenis smooth scroll initialization
- Refactor anime.js animations
- Modernize newsletter subscription handler
```

**Fichiers:**

- `src/scripts/lenis-scroll.js` (modifié)
- `src/scripts/anime.js` (modifié)
- `src/scripts/newsletter.js` (modifié)

**Commande:**

```bash
git add src/scripts/lenis-scroll.js src/scripts/anime.js src/scripts/newsletter.js
git commit -m "refactor(scripts): update JavaScript for Astro integration

- Update Lenis smooth scroll initialization
- Refactor anime.js animations
- Modernize newsletter subscription handler"
```

---

### 16. Nettoyage des Anciennes Images

**Type:** `chore(cleanup)`

**Message:**

```
chore(cleanup): remove obsolete gallery images and assets

- Remove old contact GIF
- Delete legacy gallery images (6 images)
- Clean up DS_Store files
```

**Fichiers:**

- `public/contact/contact.gif` (supprimé)
- `public/contact/.DS_Store` (supprimé)
- `public/gallery-images/` (dossier supprimé)
  - `gallery-img-1.jpg` à `gallery-img-6.jpg`
  - `.DS_Store`

**Commande:**

```bash
git add -u public/contact/ public/gallery-images/
git commit -m "chore(cleanup): remove obsolete gallery images and assets

- Remove old contact GIF
- Delete legacy gallery images (6 images)
- Clean up DS_Store files"
```

---

### 17. Suppression de l'API Contact Obsolète

**Type:** `refactor(api)`

**Message:**

```
refactor(api): remove deprecated contact API endpoint

Contact form now handled differently in Astro SSR
```

**Fichiers:**

- `src/pages/api/contact.ts` (supprimé)

**Commande:**

```bash
git add -u src/pages/api/contact.ts
git commit -m "refactor(api): remove deprecated contact API endpoint

Contact form now handled differently in Astro SSR"
```

---

### 18. Suppression de l'Ancien Site Icon

**Type:** `chore(cleanup)`

**Message:**

```
chore(cleanup): remove legacy site-icon.png

Replaced by comprehensive favicon set
```

**Fichiers:**

- `public/global/site-icon.png` (supprimé)

**Commande:**

```bash
git add -u public/global/site-icon.png
git commit -m "chore(cleanup): remove legacy site-icon.png

Replaced by comprehensive favicon set"
```

---

### 19. Fichiers de Configuration Astro

**Type:** `chore(astro)`

**Message:**

```
chore(astro): update Astro auto-generated configuration files

- Update content assets definitions
- Refresh content modules
- Update TypeScript types
- Sync data store
```

**Fichiers:**

- `.astro/content-assets.mjs` (modifié)
- `.astro/content-modules.mjs` (modifié)
- `.astro/content.d.ts` (modifié)
- `.astro/data-store.json` (modifié)
- `.astro/types.d.ts` (modifié)

**Commande:**

```bash
git add .astro/
git commit -m "chore(astro): update Astro auto-generated configuration files

- Update content assets definitions
- Refresh content modules
- Update TypeScript types
- Sync data store"
```

---

### 20. Documentation

**Type:** `docs`

**Message:**

```
docs: add OG image creation instructions

Guide for creating optimized Open Graph images
```

**Fichiers:**

- `OG_IMAGE_INSTRUCTIONS.md` (nouveau)

**Commande:**

```bash
git add OG_IMAGE_INSTRUCTIONS.md
git commit -m "docs: add OG image creation instructions

Guide for creating optimized Open Graph images"
```

---

## 🚀 Exécution Complète

Si vous souhaitez exécuter tous les commits d'un coup (non recommandé pour la review), vous pouvez utiliser ce script :

```bash
#!/bin/bash

# 1. Configuration Astro
git add astro.config.mjs
git commit -m "feat(config): configure Astro with SSR and Vercel adapter

- Enable SSR mode for API routes support
- Configure Vercel adapter with Web Analytics and Speed Insights
- Set site URL to https://upintown.dev
- Configure Vite to include image assets
- Set dev server to port 4321 with host access"

# 2. Configuration Vercel
git add vercel.json
git commit -m "feat(security): add Vercel security headers and caching configuration

- Implement CSP, X-Frame-Options, and HSTS headers
- Configure cache policies for static assets (1 year)
- Set no-cache policy for API routes
- Add sitemap rewrite configuration
- Enable security best practices (XSS protection, nosniff, referrer policy)"

# 3. Composant SEO
git add src/components/SEO.astro
git commit -m "feat(seo): add comprehensive SEO component

- Add OpenGraph and Twitter Card meta tags
- Support for article metadata (publish/modified dates, author, tags)
- Automatic title and description optimization (60/160 chars)
- Canonical URL management
- Noindex support for specific pages
- Dynamic og:image with proper dimensions (1200x630)"

# 4. Composant OptimizedImage
git add src/components/OptimizedImage.astro
git commit -m "feat(images): add OptimizedImage component with responsive support

- Support for Astro's native Image optimization
- Automatic responsive image generation (400, 800, 1200, 1920px)
- WebP format by default for better compression
- Configurable quality, format, and loading strategy
- Fallback to standard img tag for string URLs
- Lazy loading by default for better performance"

# 5. Sitemap
git add src/pages/sitemap.xml.ts
git commit -m "feat(seo): add dynamic XML sitemap generation

- Create sitemap.xml API route
- Include all main pages (home, about, project, contact)
- Configure changefreq and priority for each page
- Add lastmod timestamps
- Set proper caching headers (1 hour)"

# 6. Robots.txt
git add public/robots.txt
git commit -m "feat(seo): add robots.txt for search engine crawling

- Allow all search engine bots
- Reference sitemap location
- Include commented examples for blocking specific paths/bots"

# 7. PWA Manifest
git add public/site.webmanifest
git commit -m "feat(pwa): add web app manifest for PWA support

- Configure app name and short name
- Define maskable icons (192x192, 512x512)
- Set theme and background colors
- Enable standalone display mode"

# 8. Favicons
git add public/favicon.ico public/global/favicon.svg public/global/favicon-96x96.png public/global/apple-touch-icon.png public/global/web-app-manifest-192x192.png public/global/web-app-manifest-512x512.png
git commit -m "feat(assets): add comprehensive favicon and app icon set

- Add SVG favicon for modern browsers
- Include PNG fallbacks (96x96)
- Add Apple touch icon (180x180)
- Include PWA manifest icons (192x192, 512x512)
- Add legacy ICO format for broad compatibility"

# 9. Images de projets
git add public/project-images/
git commit -m "feat(assets): add project showcase images and media

- Add 5 project images in PNG and WebP formats
- Include project showcase video (MP4)
- Optimize images for web delivery"

# 10. Logo
git add public/global/logo.svg
git commit -m "refactor(assets): update logo SVG with improved styling"

# 11. BaseLayout
git add src/layouts/BaseLayout.astro
git commit -m "refactor(layouts): update BaseLayout with SEO integration

- Integrate new SEO component
- Update meta tags structure
- Improve accessibility and semantics"

# 12. Footer
git add src/components/Footer.astro
git commit -m "refactor(components): update Footer component for Astro"

# 13. Pages
git add src/pages/index.astro src/pages/about.astro src/pages/project.astro src/pages/contact.astro src/pages/404.astro
git commit -m "refactor(pages): migrate pages to Astro framework

- Update index page with Astro syntax
- Refactor about page for SSR
- Modernize project page structure
- Update contact page with new form handling
- Improve 404 page design"

# 14. Styles
git add src/styles/globals.css src/styles/about.css src/styles/contact.css src/styles/project.css
git commit -m "refactor(styles): update CSS for Astro compatibility

- Modernize global styles
- Update about page styles
- Refactor contact page styles
- Improve project page styles"

# 15. Scripts
git add src/scripts/lenis-scroll.js src/scripts/anime.js src/scripts/newsletter.js
git commit -m "refactor(scripts): update JavaScript for Astro integration

- Update Lenis smooth scroll initialization
- Refactor anime.js animations
- Modernize newsletter subscription handler"

# 16. Nettoyage images
git add -u public/contact/ public/gallery-images/
git commit -m "chore(cleanup): remove obsolete gallery images and assets

- Remove old contact GIF
- Delete legacy gallery images (6 images)
- Clean up DS_Store files"

# 17. Suppression API
git add -u src/pages/api/contact.ts
git commit -m "refactor(api): remove deprecated contact API endpoint

Contact form now handled differently in Astro SSR"

# 18. Nettoyage icon
git add -u public/global/site-icon.png
git commit -m "chore(cleanup): remove legacy site-icon.png

Replaced by comprehensive favicon set"

# 19. Fichiers Astro
git add .astro/
git commit -m "chore(astro): update Astro auto-generated configuration files

- Update content assets definitions
- Refresh content modules
- Update TypeScript types
- Sync data store"

# 20. Documentation
git add OG_IMAGE_INSTRUCTIONS.md
git commit -m "docs: add OG image creation instructions

Guide for creating optimized Open Graph images"

echo "✅ Tous les commits ont été effectués avec succès!"
```

---

## 📝 Notes

- **Convention de nommage:** Utilisation de Conventional Commits (feat, refactor, chore, docs)
- **Ordre recommandé:** Les commits sont ordonnés de manière logique (config → features → refactor → cleanup)
- **Review:** Il est recommandé de faire une review après chaque commit pour s'assurer que tout est correct
- **Tests:** Pensez à tester l'application après chaque commit majeur

## 🎯 Résumé

- **Total de commits:** 20
- **Nouveaux fichiers:** 18
- **Fichiers modifiés:** 19
- **Fichiers supprimés:** 10
- **Impact:** Migration complète vers Astro avec amélioration SEO, sécurité et performance
