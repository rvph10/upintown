// Generates a new cover for an existing blog post, without touching its text.
// Runs in the `blog-cover` GitHub workflow: node scripts/blog-cover.ts <file name> [--hint "..."]

import { readFile, writeFile } from "node:fs/promises";
import { parseArgs } from "node:util";
import type { ServiceId } from "../src/data/offer";
import { illustrate } from "./blog-images.ts";

const serviceIds = ["website", "care", "google"] as const satisfies readonly ServiceId[];

const { positionals, values } = parseArgs({ allowPositionals: true, options: { hint: { type: "string" } } });
const slug = positionals[0];
if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error(`Invalid slug: ${slug}`);

const postFile = (locale: string) => `src/content/posts/${locale}/${slug}.md`;
const [fr, en] = await Promise.all([readFile(postFile("fr"), "utf8"), readFile(postFile("en"), "utf8")]);
const field = (source: string, key: string) => new RegExp(`^${key}: "?(.*?)"?$`, "m").exec(source)?.[1];

const service = field(fr, "service") as ServiceId;
if (!(serviceIds as readonly string[]).includes(service)) throw new Error(`Unknown service: ${service}`);

const images = await illustrate({
  title: field(fr, "title") ?? "",
  body: fr.replace(/^---\n[\s\S]*?\n---\n/, "").replaceAll(`../../../assets/blog/${slug}/`, ""),
  service,
  names: ["cover.webp"],
  dir: `src/assets/blog/${slug}`,
  hint: values.hint?.trim() || undefined,
});

const cover = images["cover.webp"];
for (const [locale, source] of [
  ["fr", fr],
  ["en", en],
] as const) {
  const updated = source
    .replace(/^cover: .*$/m, `cover: ../../../assets/blog/${slug}/cover.webp`)
    .replace(/^coverAlt: .*$/m, `coverAlt: ${JSON.stringify(cover.alt[locale])}`);
  await writeFile(postFile(locale), updated);
}

const summary = [
  `New cover for **${field(fr, "title")}**${values.hint ? ` (hint: ${values.hint})` : ""}.`,
  "",
  ...(cover.note ? [`- [ ] ${cover.note}`, ""] : []),
  `- ${cover.alt.fr}`,
  "",
  "<details><summary>Prompt</summary>",
  "",
  "```",
  cover.prompt,
  "```",
  "</details>",
].join("\n");
if (process.env.PR_BODY_FILE) await writeFile(process.env.PR_BODY_FILE, summary);
else console.log(summary);
