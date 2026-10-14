import { getCollection, type CollectionEntry } from "astro:content";
import type { Locale, Localized } from "./i18n";
import { projectPath } from "./routes";

export type Project = CollectionEntry<"projects"> & { locale: Locale; slug: string };

export async function getProjects(locale?: Locale): Promise<Project[]> {
  const entries = await getCollection("projects");
  return entries
    .map((entry) => {
      const [entryLocale, slug] = entry.id.split("/") as [Locale, string];
      return { ...entry, locale: entryLocale, slug };
    })
    .filter((project) => !locale || project.locale === locale)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function projectAlternates(slug: string): Promise<Partial<Localized>> {
  const all = await getProjects();
  return Object.fromEntries(
    all
      .filter((project) => project.slug === slug)
      .map((project) => [project.locale, projectPath(slug, project.locale)]),
  );
}
