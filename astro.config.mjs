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
  adapter: node({ mode: "standalone" }),
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
