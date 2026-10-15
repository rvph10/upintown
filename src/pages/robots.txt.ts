import type { APIRoute } from "astro";
import { routes } from "../data/routes";

const disallowed = Object.values(routes.questionnaire)
  .map((path) => `Disallow: ${path}\n`)
  .join("");

export const GET: APIRoute = ({ site }) =>
  new Response(`User-agent: *\nAllow: /\n${disallowed}\nSitemap: ${new URL("/sitemap-index.xml", site)}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
