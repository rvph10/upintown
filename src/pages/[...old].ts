import type { APIRoute } from "astro";
import { postRedirects } from "../data/posts";
import { path } from "../data/routes";

// Rendered on demand, and only reached when no page matches: a static page cannot answer with a real 301, it can only
// send a 200 with a meta refresh. Anything not listed here falls through to the 404 page.
export const prerender = false;

/** Addresses from earlier versions of the site that Google still knows. */
const oldPages = new Map([
  ["/about", path("home", "fr")],
  ["/en/about", path("home", "en")],
  ["/project", path("projects", "fr")],
  ["/en/project", path("projects", "en")],
]);

export const GET: APIRoute = async ({ url, redirect }) => {
  const target = oldPages.get(url.pathname) ?? (await postRedirects()).get(url.pathname);
  return target ? redirect(target, 301) : new Response(null, { status: 404 });
};
