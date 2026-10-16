// Turns a Holo delivery into French and English blog posts, ready for review in a pull request.
// Runs in the `holo-import` GitHub workflow: node scripts/holo-import.ts <slug>
// Locally: node scripts/holo-import.ts <slug> --payload delivery.json [--dry-run]
//   --payload reads the delivery from a file instead of the `holo/<slug>` branch.
//   --dry-run stops before the Claude call and prints what would be sent.

import { execFileSync } from "node:child_process";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { parseArgs } from "node:util";
import Anthropic from "@anthropic-ai/sdk";
import sharp from "sharp";
import { blogCategories, blogCategoryIds, type BlogCategoryId } from "../src/data/blogCategories.ts";
import type { ServiceId } from "../src/data/offer";

// Override with HOLO_AI_MODEL to compare models on the same article.
const model = process.env.HOLO_AI_MODEL ?? "claude-sonnet-5-5";
// Haiku has no server-side refusal fallback.
const fallback = model.startsWith("claude-haiku")
  ? {}
  : { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" as const };
const serviceIds = ["website", "care", "google"] as const satisfies readonly ServiceId[];

// Images may only come from Holo's storage.
const imageHost = (url: URL) =>
  url.protocol === "https:" &&
  url.hostname.endsWith(".supabase.co") &&
  url.pathname.startsWith("/storage/v1/object/public/");
const imageTypes = ["image/png", "image/jpeg", "image/webp", "image/avif", "image/gif"];
const maxImageBytes = 15 * 1024 * 1024;

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

/** Fields the owner sets during review, kept when Holo updates the article. */
function ownerFields(): { service?: ServiceId; category?: BlogCategoryId; project?: string } {
  const source = git("show", `${branch}:${postFile("fr")}`) ?? git("show", `HEAD:${postFile("fr")}`);
  if (!source) return {};
  const field = (key: string) => new RegExp(`^${key}: "?([^"\\n]+)"?$`, "m").exec(source)?.[1];
  const service = field("service") as ServiceId | undefined;
  const category = field("category") as BlogCategoryId | undefined;
  const project = field("project");
  return {
    service: service && serviceIds.includes(service) ? service : undefined,
    category: category && blogCategoryIds.includes(category) ? category : undefined,
    project: project && /^[a-z0-9-]+$/.test(project) ? project : undefined,
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

async function saveImage(source: string, name: string): Promise<{ file: string; preview: Buffer }> {
  const url = new URL(source);
  if (!imageHost(url)) throw new Error(`Image host not allowed: ${url.hostname}`);
  const response = await fetch(url, { redirect: "error", signal: AbortSignal.timeout(30_000) });
  if (!response.ok) throw new Error(`Image download failed (${response.status}): ${source}`);
  const type = response.headers.get("content-type")?.split(";")[0].trim() ?? "";
  if (!imageTypes.includes(type)) throw new Error(`Image type not allowed (${type}): ${source}`);
  if (Number(response.headers.get("content-length") ?? 0) > maxImageBytes)
    throw new Error(`Image too large: ${source}`);
  const input = Buffer.from(await response.arrayBuffer());
  if (input.length > maxImageBytes) throw new Error(`Image too large: ${source}`);

  // Re-encoding drops metadata and anything hidden in the original file; Astro makes the responsive sizes.
  const image = sharp(input, { limitInputPixels: 50_000_000 }).rotate();
  await image
    .clone()
    .resize({ width: 2400, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(`${assetDir}/${name}`);
  const preview = await image
    .clone()
    .resize({ width: 1024, withoutEnlargement: true })
    .webp({ quality: 70 })
    .toBuffer();
  return { file: assetRef(name), preview };
}

const localeSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    excerpt: { type: "string" },
    metaTitle: { type: "string" },
    metaDescription: { type: "string" },
    coverAlt: { type: "string" },
    body: { type: "string" },
  },
  required: ["title", "excerpt", "metaTitle", "metaDescription", "coverAlt", "body"],
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
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  coverAlt: string;
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

async function edit(request: object, cover: Buffer): Promise<Edited> {
  const system = await readFile(new URL("./holo-import-prompt.md", import.meta.url), "utf8");
  const client = new Anthropic();
  const stream = client.beta.messages.stream({
    model,
    max_tokens: 64000,
    ...fallback,
    output_config: { effort: "high", format: { type: "json_schema", schema: outputSchema } },
    system,
    messages: [
      {
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: "image/webp", data: cover.toString("base64") } },
          { type: "text", text: `The cover image is attached.\n\n${JSON.stringify(request, null, 2)}` },
        ],
      },
    ],
  });
  const message = await stream.finalMessage();
  if (message.stop_reason === "refusal")
    throw new Error(`Claude declined the article (${message.stop_details?.category})`);
  if (message.stop_reason === "max_tokens") throw new Error("Claude's answer was cut off (max_tokens)");
  const text = message.content.find((block) => block.type === "text");
  if (!text || text.type !== "text") throw new Error("Claude returned no text");
  console.log(
    `${message.model}: ${message.usage.input_tokens} input tokens, ${message.usage.output_tokens} output tokens`,
  );
  return JSON.parse(text.text) as Edited;
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

function frontmatter(post: Localized, fields: Record<string, string | undefined>, article: Article, cover: string) {
  const lines = [
    `title: ${JSON.stringify(post.title)}`,
    `excerpt: ${JSON.stringify(post.excerpt)}`,
    `metaTitle: ${JSON.stringify(post.metaTitle)}`,
    `metaDescription: ${JSON.stringify(post.metaDescription)}`,
    `category: ${fields.category}`,
    `cover: ${cover}`,
    `coverAlt: ${JSON.stringify(post.coverAlt)}`,
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
  notes: string[],
  links: string[],
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
    `- Pages: \`/blog/${slug}\` and \`/en/blog/${slug}\``,
    "",
    "## To check before merging",
    ...(edited.flags.length
      ? edited.flags.map((flag) => `- [ ] ${flag.reason}: "${quote(flag.quote)}"`)
      : ["- [ ] No content flags from the AI: read the article anyway."]),
    ...notes.map((note) => `- [ ] ${note}`),
    "- [ ] French text reads well and every fact is true",
    "- [ ] English translation reads naturally",
    "- [ ] Cover image and its description fit",
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
  ].join("\n");
}

const article = await readArticle();
const kept = ownerFields();
const source = cleanBody(article.contentMarkdown);
assertNoHtml(source);

// Fresh images on every run, so an update never leaves old files behind.
await rm(assetDir, { recursive: true, force: true });
await mkdir(assetDir, { recursive: true });
const inline = [...source.matchAll(imagePattern)];
const coverSource = article.featuredImage ?? inline[0]?.[2];
if (!coverSource) throw new Error("The article has no image to use as cover");
const cover = await saveImage(coverSource, "cover.webp");
let body = source;
for (const [index, match] of inline.entries()) {
  const saved = await saveImage(match[2], `image-${index + 1}.webp`);
  body = body.replace(match[0], `![${match[1]}](${saved.file})`);
}

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

const edited = await edit(request, cover.preview);
const notes = verify(edited, body);
const fields = {
  service: kept.service ?? edited.service,
  category: kept.category ?? edited.category,
  project: kept.project,
};
for (const locale of ["fr", "en"] as const) {
  await mkdir(`src/content/posts/${locale}`, { recursive: true });
  await writeFile(postFile(locale), frontmatter(edited[locale], fields, article, cover.file));
}

const summary = prBody(article, edited, kept, notes, linksIn(body).split("\n").filter(Boolean));
if (process.env.PR_BODY_FILE) await writeFile(process.env.PR_BODY_FILE, summary);
else console.log(summary);
console.log(`Wrote ${postFile("fr")}, ${postFile("en")} and ${assetDir}`);
