import { getCollection, type CollectionEntry } from "astro:content";
import { htmlLang, type Locale, type Localized } from "./i18n";
import { postPath } from "./routes";

export type Post = CollectionEntry<"posts"> & { locale: Locale; slug: string; minutes: number };

const wordsPerMinute = 220;

export async function getPosts(locale?: Locale): Promise<Post[]> {
  const entries = await getCollection("posts");
  return entries
    .map((entry) => {
      const [entryLocale, slug] = entry.id.split("/") as [Locale, string];
      const words = entry.body?.split(/\s+/).filter(Boolean).length ?? 0;
      return { ...entry, locale: entryLocale, slug, minutes: Math.max(1, Math.round(words / wordsPerMinute)) };
    })
    .filter((post) => (!locale || post.locale === locale) && !(import.meta.env.PROD && post.data.draft))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function postAlternates(slug: string): Promise<Partial<Localized>> {
  const all = await getPosts();
  return Object.fromEntries(
    all.filter((post) => post.slug === slug).map((post) => [post.locale, postPath(slug, post.locale)]),
  );
}

export function formatPostDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(htmlLang[locale], { day: "numeric", month: "long", year: "numeric" }).format(date);
}

export function readingTime(minutes: number, locale: Locale): string {
  return locale === "fr" ? `${minutes} min de lecture` : `${minutes} min read`;
}
