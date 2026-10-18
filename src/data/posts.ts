import { getCollection, type CollectionEntry } from "astro:content";
import { htmlLang, type Locale, type Localized } from "./i18n";
import { postPath } from "./routes";

/** `key` is the file name, shared by the translations; `slug` is the address in this language. */
export type Post = CollectionEntry<"posts"> & { locale: Locale; key: string; slug: string; minutes: number };

const wordsPerMinute = 220;

export async function getPosts(locale?: Locale): Promise<Post[]> {
  const entries = await getCollection("posts");
  return entries
    .map((entry) => {
      const [entryLocale, key] = entry.id.split("/") as [Locale, string];
      const words = entry.body?.split(/\s+/).filter(Boolean).length ?? 0;
      const slug = entry.data.urlSlug ?? key;
      return { ...entry, locale: entryLocale, key, slug, minutes: Math.max(1, Math.round(words / wordsPerMinute)) };
    })
    .filter((post) => (!locale || post.locale === locale) && !(import.meta.env.PROD && post.data.draft))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function postAlternates(key: string): Promise<Partial<Localized>> {
  const all = await getPosts();
  return Object.fromEntries(
    all.filter((post) => post.key === key).map((post) => [post.locale, postPath(post.slug, post.locale)]),
  );
}

/** Pages for each post's file name when its address differs (Holo's slug, earlier addresses), so old links still work. */
export async function postRedirects(locale: Locale) {
  return (await getPosts(locale))
    .filter((post) => post.key !== post.slug)
    .map((post) => ({ params: { slug: post.key }, props: { redirect: postPath(post.slug, locale) } }));
}

export function formatPostDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(htmlLang[locale], { day: "numeric", month: "long", year: "numeric" }).format(date);
}

export function readingTime(minutes: number, locale: Locale): string {
  return locale === "fr" ? `${minutes} min de lecture` : `${minutes} min read`;
}
