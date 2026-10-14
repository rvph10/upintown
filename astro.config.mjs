// @ts-check
import { defineConfig, envField, fontProviders } from "astro/config";
import node from "@astrojs/node";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { business } from "./src/data/business";
import { defaultLocale, htmlLang, locales } from "./src/data/i18n";
import { routes } from "./src/data/routes";

const url = (/** @type {string} */ pathname) => new URL(pathname, business.url).href;

// Every page with its translations, for the sitemap: slugs differ per language, so pages are paired from `routes`.
const translations = new Map(
  Object.values(routes).flatMap((route) => {
    /** @type {import('@astrojs/sitemap').LinkItem[]} */
    const links = [
      ...locales.map((locale) => ({ lang: htmlLang[locale], url: url(route[locale]) })),
      { lang: "x-default", url: url(route[defaultLocale]) },
    ];
    return locales.map((locale) => [url(route[locale]), links]);
  }),
);

export default defineConfig({
  site: business.url,
  trailingSlash: "never",
  // The contact form is the only request body, a few kB at most.
  adapter: node({ mode: "standalone", bodySizeLimit: 64 * 1024 }),
  // Behind the proxy, lets Astro trust the forwarded host and protocol so the form's origin check sees the real site.
  security: {
    allowedDomains: [{ hostname: new URL(business.url).hostname, protocol: "https" }],
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Inter Tight",
      cssVariable: "--font-inter-tight",
      weights: ["400 700"],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["sans-serif"],
    },
  ],
  env: {
    schema: {
      RESEND_API_KEY: envField.string({ context: "server", access: "secret" }),
      // Read at build time: the pages are static.
      PUBLIC_UMAMI_SCRIPT_URL: envField.string({ context: "client", access: "public", optional: true, url: true }),
      PUBLIC_UMAMI_WEBSITE_ID: envField.string({ context: "client", access: "public", optional: true }),
    },
  },
  i18n: {
    defaultLocale,
    locales: [...locales],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      filter: (page) => !page.startsWith(url("/components")),
      serialize(item) {
        const links = translations.get(item.url.replace(/\/$/, "")) ?? translations.get(item.url);
        return links ? { ...item, links } : item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
