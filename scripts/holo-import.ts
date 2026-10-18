// Turns a Holo delivery into French and English blog posts, ready for review in a pull request.
// Runs in the `holo-import` GitHub workflow: node scripts/holo-import.ts <slug>
// Locally: node scripts/holo-import.ts <slug> --payload delivery.json [--dry-run]
//   --payload reads the delivery from a file instead of the `holo/<slug>` branch.
//   --dry-run stops before the Claude call and prints what would be sent.

import { execFileSync } from "node:child_process";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { parseArgs } from "node:util";
import { blogCategories, blogCategoryIds, type BlogCategoryId } from "../src/data/blogCategories.ts";
import type { ServiceId } from "../src/data/offer";
import { illustrate, type Illustrated } from "./blog-images.ts";
import { askJson } from "./claude.ts";

const serviceIds = ["website", "care", "google"] as const satisfies readonly ServiceId[];

const { positionals, values } = parseArgs({
  allowPositionals: true,
  options: { payload: { type: "string" }, "dry-run": { type: "boolean", default: false } },
});
const slug = positionals[0];
if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error(`Invalid slug: ${slug}`);

const branch = `origin/holo/${slug}`;
const postFile = (locale: string) => `src/content/posts/${locale}/${slug}.md`;
const assetDir = `src/assets/blog/${slug}`;
// Image paths as written in a post file.
const assetRef = (name: string) => `../../../assets/blog/${slug}/${name}`;

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  contentMarkdown: string;
  metaTitle?: string;
  metaDescription?: string;
  featuredImage?: string | null;
  images?: { url: string; alt: string }[];
  publishedAt: string;
}

function git(...args: string[]): string | null {
  try {
    return execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
  } catch {
    return null;
  }
}

async function readArticle(): Promise<Article> {
  const raw = values.payload
    ? await readFile(values.payload, "utf8")
    : git("show", `origin/holo-inbox:inbox/${slug}.json`);
  if (!raw) throw new Error(`No delivery found for ${slug}`);
  const { article } = JSON.parse(raw) as { article: Article };
  if (article?.slug !== slug) throw new Error(`Delivery slug ${article?.slug} does not match ${slug}`);
  for (const key of ["id", "title", "contentMarkdown", "publishedAt"] as const) {
    if (typeof article[key] !== "string" || !article[key]) throw new Error(`Delivery has no ${key}`);
  }
  return article;
}

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** The post file as reviewed on the article branch, else as published on main. */
function existingPost(locale: "fr" | "en"): { source: string; published: boolean } | null {
  // On the article branch, only a commit by a person counts: the import's own output is not a review.
  const reviewed = git("log", "-1", "--format=%ae", branch, "--", postFile(locale))?.trim();
  const fromBranch =
    reviewed && !reviewed.includes("github-actions[bot]") ? git("show", `${branch}:${postFile(locale)}`) : null;
  if (fromBranch) return { source: fromBranch, published: false };
  const fromMain = git("show", `HEAD:${postFile(locale)}`);
  return fromMain ? { source: fromMain, published: true } : null;
}

const field = (source: string, key: string) => new RegExp(`^${key}: "?([^"\\n]+)"?$`, "m").exec(source)?.[1];

/** Fields the owner sets during review, kept when Holo updates the article. A published address never changes. */
function ownerFields(): {
  service?: ServiceId;
  category?: BlogCategoryId;
  project?: string;
  slugs: Partial<Record<"fr" | "en", string>>;
} {
  const slugs: Partial<Record<"fr" | "en", string>> = {};
  for (const locale of ["fr", "en"] as const) {
    const post = existingPost(locale);
    const kept = post && field(post.source, "urlSlug");
    if (kept && slugPattern.test(kept)) slugs[locale] = kept;
    else if (post?.published) slugs[locale] = slug;
  }
  const source = existingPost("fr")?.source;
  if (!source) return { slugs };
  const service = field(source, "service") as ServiceId | undefined;
  const category = field(source, "category") as BlogCategoryId | undefined;
  const project = field(source, "project");
  return {
    service: service && serviceIds.includes(service) ? service : undefined,
    category: category && blogCategoryIds.includes(category) ? category : undefined,
    project: project && /^[a-z0-9-]+$/.test(project) ? project : undefined,
    slugs,
  };
}

const imagePattern = /!\[([^\]]*)\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)/g;
const linkPattern = /(?<!!)\[[^\]]*\]\(\s*<?(https?:\/\/[^)\s>]+)>?/g;

/** Removes what the page already shows (meta lines, title, hero image) and keeps one H1 per page. */
function cleanBody(markdown: string): string {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  while (lines.length) {
    const line = lines[0].trim();
    const skip =
      line === "" ||
      /^\*\*(Meta title|Meta description|Slug):\*\*/i.test(line) ||
      /^# /.test(line) ||
      /^!\[[^\]]*\]\([^)]*\)$/.test(line);
    if (!skip) break;
    lines.shift();
  }
  return lines.join("\n").replace(/^# /gm, "## ").trim();
}

/** Astro renders raw HTML in Markdown as is, so an article containing any is refused. */
function assertNoHtml(markdown: string) {
  const text = markdown.replace(/```[\s\S]*?```/g, "").replace(/`[^`\n]*`/g, "");
  const tag = /<!--|<\/?[a-z][a-z0-9-]*(?:\s[^>]*)?\/?>/i.exec(text);
  if (tag) throw new Error(`Raw HTML is not accepted in articles: ${tag[0].slice(0, 80)}`);
}

const localeSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    slug: { type: "string" },
    excerpt: { type: "string" },
    metaTitle: { type: "string" },
    metaDescription: { type: "string" },
    body: { type: "string" },
  },
  required: ["title", "slug", "excerpt", "metaTitle", "metaDescription", "body"],
  additionalProperties: false,
};

const outputSchema = {
  type: "object",
  properties: {
    service: { type: "string", enum: [...serviceIds] },
    category: { type: "string", enum: [...blogCategoryIds] },
    fr: localeSchema,
    en: localeSchema,
    changes: {
      type: "array",
      items: {
        type: "object",
        properties: { before: { type: "string" }, after: { type: "string" }, reason: { type: "string" } },
        required: ["before", "after", "reason"],
        additionalProperties: false,
      },
    },
    flags: {
      type: "array",
      items: {
        type: "object",
        properties: { quote: { type: "string" }, reason: { type: "string" } },
        required: ["quote", "reason"],
        additionalProperties: false,
      },
    },
  },
  required: ["service", "category", "fr", "en", "changes", "flags"],
  additionalProperties: false,
};

type Localized = {
  title: string;
  slug: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  body: string;
};
interface Edited {
  service: ServiceId;
  category: BlogCategoryId;
  fr: Localized;
  en: Localized;
  changes: { before: string; after: string; reason: string }[];
  flags: { quote: string; reason: string }[];
}

async function edit(request: object): Promise<Edited> {
  const system = await readFile(new URL("./holo-import-prompt.md", import.meta.url), "utf8");
  return askJson<Edited>(system, [{ type: "text", text: JSON.stringify(request, null, 2) }], outputSchema);
}

const sorted = (items: Iterable<string>) => [...items].sort().join("\n");
const imagesIn = (markdown: string) => sorted([...markdown.matchAll(imagePattern)].map((m) => m[2]));
const linksIn = (markdown: string) => sorted([...markdown.matchAll(linkPattern)].map((m) => m[1]));

/** Checks the AI kept every image and link, and fixes dashes it missed. */
function verify(edited: Edited, source: string): string[] {
  const notes: string[] = [];
  for (const locale of ["fr", "en"] as const) {
    const post = edited[locale];
    if (imagesIn(post.body) !== imagesIn(source)) throw new Error(`The ${locale} body lost or changed an image`);
    if (linksIn(post.body) !== linksIn(source)) throw new Error(`The ${locale} body lost or changed a link`);
    assertNoHtml(post.body);
    if (!slugPattern.test(post.slug) || post.slug.length > 60) throw new Error(`Invalid ${locale} slug: ${post.slug}`);
    for (const key of Object.keys(post) as (keyof Localized)[]) {
      const fixed = post[key].replace(/\s*[–—]\s*/g, ", ");
      if (fixed !== post[key])
        notes.push(`Dash replaced by a comma in ${locale}.${key}: check the sentence still reads well.`);
      post[key] = fixed;
    }
    if (/ - /.test(post.body))
      notes.push(`A spaced hyphen is left in the ${locale} body: check it is not used as a dash.`);
    if (post.metaTitle.length > 60)
      notes.push(`${locale} metaTitle is ${post.metaTitle.length} characters (aim for 60).`);
    if (post.metaDescription.length > 155)
      notes.push(`${locale} metaDescription is ${post.metaDescription.length} characters (aim for 155).`);
  }
  return notes;
}

function frontmatter(
  post: Localized,
  address: string,
  fields: Record<string, string | undefined>,
  article: Article,
  coverAlt: string,
) {
  const lines = [
    `title: ${JSON.stringify(post.title)}`,
    ...(address !== slug ? [`urlSlug: ${address}`] : []),
    `excerpt: ${JSON.stringify(post.excerpt)}`,
    `metaTitle: ${JSON.stringify(post.metaTitle)}`,
    `metaDescription: ${JSON.stringify(post.metaDescription)}`,
    `category: ${fields.category}`,
    `cover: ${assetRef("cover.webp")}`,
    `coverAlt: ${JSON.stringify(coverAlt)}`,
    `date: ${article.publishedAt.slice(0, 10)}`,
    `service: ${fields.service}`,
    ...(fields.project ? [`project: ${fields.project}`] : []),
    `holoId: ${JSON.stringify(article.id)}`,
  ];
  return `---\n${lines.join("\n")}\n---\n\n${post.body.trim()}\n`;
}

function prBody(
  article: Article,
  edited: Edited,
  kept: ReturnType<typeof ownerFields>,
  addresses: Record<"fr" | "en", string>,
  notes: string[],
  links: string[],
  images: Record<string, Illustrated>,
) {
  const quote = (text: string) => text.replace(/\n/g, " ").replace(/\|/g, "\\|");
  const choice = (label: string, value: string, suggested: string, owned: boolean) =>
    `- ${label}: \`${value}\`${owned && value !== suggested ? ` (kept from the existing post; AI suggested \`${suggested}\`)` : ""}`;
  const service = kept.service ?? edited.service;
  const category = kept.category ?? edited.category;
  return [
    `Imported from Holo: **${article.title}**`,
    "",
    "Merging publishes the article in French and English. Close the pull request to drop it.",
    "",
    "## Fields",
    choice("Service (calls to action)", service, edited.service, Boolean(kept.service)),
    choice("Category", `${category} (${blogCategories[category].name.fr})`, edited.category, Boolean(kept.category)),
    `- Project shown as an example: ${kept.project ? `\`${kept.project}\`` : "none (add \`project: <slug>\` to both files to show one)"}`,
    `- Pages: \`/blog/${addresses.fr}\` and \`/en/blog/${addresses.en}\`${kept.slugs.fr || kept.slugs.en ? "" : " (to shorten one, edit \`urlSlug\` in its file)"}`,
    "",
    "## To check before merging",
    ...(edited.flags.length
      ? edited.flags.map((flag) => `- [ ] ${flag.reason}: "${quote(flag.quote)}"`)
      : ["- [ ] No content flags from the AI: read the article anyway."]),
    ...notes.map((note) => `- [ ] ${note}`),
    "- [ ] French text reads well and every fact is true",
    "- [ ] English translation reads naturally",
    "- [ ] Images and their descriptions fit",
    "",
    "## Changes made to Holo's French text",
    ...(edited.changes.length
      ? [
          "| Before | After | Why |",
          "| --- | --- | --- |",
          ...edited.changes.map((c) => `| ${quote(c.before)} | ${quote(c.after)} | ${quote(c.reason)} |`),
        ]
      : ["None."]),
    "",
    "## External links",
    ...(links.length ? links.map((link) => `- ${link}`) : ["None."]),
    "",
    "## Images",
    "Generated with fal.ai. To redo the cover only: Actions, Blog cover, Run workflow with this slug and an optional hint.",
    ...Object.entries(images).flatMap(([name, image]) => [
      "",
      `<details><summary>${name}: ${image.alt.fr}</summary>`,
      "",
      "```",
      image.prompt,
      "```",
      "</details>",
    ]),
  ].join("\n");
}

const article = await readArticle();
const kept = ownerFields();
const source = cleanBody(article.contentMarkdown);
assertNoHtml(source);

// Holo's images are replaced by generated ones: the cover, and at most one image in the text, where Holo put its
// first one. Fresh files on every run, so an update never leaves old ones behind.
await rm(assetDir, { recursive: true, force: true });
let body = source;
const inline = [...source.matchAll(imagePattern)];
for (const [index, match] of inline.entries()) {
  body = body.replace(match[0], index === 0 ? `![](${assetRef("image-1.webp")})` : "");
}
body = body.replace(/\n{3,}/g, "\n\n");
const imageNames = ["cover.webp", ...(inline.length ? ["image-1.webp"] : [])];

const request = {
  categories: blogCategoryIds.map((id) => ({ id, name: blogCategories[id].name.fr })),
  title: article.title,
  excerpt: article.excerpt,
  metaTitle: article.metaTitle ?? "",
  metaDescription: article.metaDescription ?? "",
  body,
};

if (values["dry-run"]) {
  console.log(JSON.stringify({ kept, request }, null, 2));
  process.exit(0);
}

const edited = await edit(request);
const notes = verify(edited, body);
const addresses = { fr: kept.slugs.fr ?? edited.fr.slug, en: kept.slugs.en ?? edited.en.slug };
const fields = {
  service: kept.service ?? edited.service,
  category: kept.category ?? edited.category,
  project: kept.project,
};
const images = await illustrate({
  title: edited.fr.title,
  body: edited.fr.body.replaceAll(assetRef(""), ""),
  service: fields.service,
  names: imageNames,
  dir: assetDir,
});
for (const [name, image] of Object.entries(images)) {
  if (image.note) notes.push(`${name}: ${image.note}`);
}
for (const locale of ["fr", "en"] as const) {
  const post = edited[locale];
  if (images["image-1.webp"])
    post.body = post.body.replace(
      /!\[[^\]]*\]\(([^)]*image-1\.webp)\)/,
      `![${images["image-1.webp"].alt[locale]}]($1)`,
    );
  await mkdir(`src/content/posts/${locale}`, { recursive: true });
  await writeFile(
    postFile(locale),
    frontmatter(post, addresses[locale], fields, article, images["cover.webp"].alt[locale]),
  );
}

const summary = prBody(article, edited, kept, addresses, notes, linksIn(body).split("\n").filter(Boolean), images);
if (process.env.PR_BODY_FILE) await writeFile(process.env.PR_BODY_FILE, summary);
else console.log(summary);
console.log(`Wrote ${postFile("fr")}, ${postFile("en")} and ${assetDir}`);
