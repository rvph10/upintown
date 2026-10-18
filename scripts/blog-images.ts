// Generates the images of a blog post: Claude writes a brief per image, fal.ai draws two candidates, Claude keeps
// the better one and describes it, and the result is saved as WebP next to the post.

import { mkdir, readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";
import type { ServiceId } from "../src/data/offer";
import { askJson, imageBlock, type Content } from "./claude.ts";

const falModel = "krea/v3/text-to-image";
// 16:9, wide enough for the 2000px article header; cards and headers crop it to 4:3 and 21:9.
const size = { width: 1920, height: 1088 };
const candidates = 2;

// One backdrop colour per service, so the blog grid reads as a system.
const colours: Record<ServiceId, string> = {
  website: "tangerine orange #ff8a3d",
  care: "sky blue #66cbfd",
  google: "sunny yellow #ffd23f",
};

const sets = {
  plinths: (c: string) =>
    `a tonal studio set in shades of ${c}: large rounded plinths, a half arch and a curved wall at different depths behind the subject, softly out of focus. Clean and minimal, no other objects.`,
  blinds: (c: string) =>
    `a seamless ${c} backdrop with a crisp diagonal shadow pattern of window blinds falling across it from the left, like late afternoon sun.`,
  acrylic: (c: string) =>
    `a ${c} backdrop with two large translucent acrylic panels, one a deeper shade and one a pale tint of the same colour, overlapping behind the subject and casting soft coloured light.`,
};
type SetId = keyof typeof sets;

const negative =
  "faces looking at the camera, beige, linen, offices, desks, rooms, streets, plants, coffee cups, paper, props, readable text, letters, names, real brand logos, watermarks, plastic skin, extra fingers, deformed hands, abstract 3D render";

interface Brief {
  name: string;
  scene: string;
  device: string;
  screen: string;
  camera: string;
  set: SetId;
}

export interface Illustrated {
  file: string;
  alt: { fr: string; en: string };
  prompt: string;
  note?: string;
}

const briefSchema = {
  type: "object",
  properties: {
    images: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          scene: { type: "string" },
          device: { type: "string" },
          screen: { type: "string" },
          camera: { type: "string" },
          set: { type: "string", enum: Object.keys(sets) },
        },
        required: ["name", "scene", "device", "screen", "camera", "set"],
        additionalProperties: false,
      },
    },
  },
  required: ["images"],
  additionalProperties: false,
};

const pickSchema = {
  type: "object",
  properties: {
    images: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          choice: { type: "integer" },
          altFr: { type: "string" },
          altEn: { type: "string" },
          problem: { type: "string" },
        },
        required: ["name", "choice", "altFr", "altEn", "problem"],
        additionalProperties: false,
      },
    },
  },
  required: ["images"],
  additionalProperties: false,
};

function prompt(brief: Brief, service: ServiceId): string {
  const colour = colours[service];
  return [
    "Realistic editorial photograph for a blog cover, 16:9, shot like a modern tech brand campaign.",
    "",
    `Scene: ${brief.scene}`,
    `Device: ${brief.device}, clearly visible and sharp.`,
    `Screen: ${brief.screen} The interface is conveyed through shapes, icons, colours and photos, with no readable words. Interface colours: white, light grey, black and touches of ${colour}, nothing else.`,
    "",
    `Camera: ${brief.camera} The device is the sharpest point, natural shallow depth of field.`,
    "Composition: keep the hands and the device in the centre of the frame, with backdrop space on every side.",
    `Set: ${sets[brief.set](colour)}`,
    "Wardrobe: plain clothes in charcoal or off-white, no logos.",
    "Light: soft directional studio light from one side, natural shadows, gentle reflection on the screen glass.",
    "Look: natural skin texture, real hands with natural proportions, candid and energetic, not posed.",
  ].join("\n");
}

async function generate(text: string): Promise<Buffer> {
  const key = process.env.FAL_KEY;
  if (!key) throw new Error("FAL_KEY is not set");
  for (let attempt = 1; ; attempt++) {
    try {
      const response = await fetch(`https://fal.run/${falModel}`, {
        method: "POST",
        headers: { Authorization: `Key ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text, negative_prompt: negative, image_size: size, output_format: "png" }),
        signal: AbortSignal.timeout(240_000),
      });
      if (!response.ok) throw new Error(`fal.ai ${response.status}: ${(await response.text()).slice(0, 300)}`);
      const { images } = (await response.json()) as { images: { url: string }[] };
      const url = new URL(images[0].url);
      if (url.protocol !== "https:" || !url.hostname.endsWith("fal.media"))
        throw new Error(`Image host not allowed: ${url.hostname}`);
      const image = await fetch(url, { redirect: "error", signal: AbortSignal.timeout(60_000) });
      if (!image.ok) throw new Error(`Image download failed (${image.status})`);
      return Buffer.from(await image.arrayBuffer());
    } catch (error) {
      if (attempt === 2) throw error;
      console.warn(`fal.ai attempt ${attempt} failed, retrying:`, error);
    }
  }
}

const preview = (image: Buffer) => sharp(image).resize({ width: 768 }).webp({ quality: 70 }).toBuffer();

/**
 * Makes `names` (`cover.webp`, `image-1.webp`...) for a post and saves them in `dir`. `body` is the French article
 * where inline images appear as Markdown lines pointing to their file name. `hint` is an optional note from the owner.
 */
export async function illustrate(options: {
  title: string;
  body: string;
  service: ServiceId;
  names: string[];
  dir: string;
  hint?: string;
}): Promise<Record<string, Illustrated>> {
  const { title, body, service, names, dir, hint } = options;
  const system = await readFile(new URL("./blog-images-prompt.md", import.meta.url), "utf8");

  const request = { images: names, title, body, ...(hint ? { ownerHint: hint } : {}) };
  const { images: briefs } = await askJson<{ images: Brief[] }>(
    system,
    [{ type: "text", text: `Write the briefs.\n\n${JSON.stringify(request, null, 2)}` }],
    briefSchema,
  );
  for (const name of names) if (!briefs.some((brief) => brief.name === name)) throw new Error(`No brief for ${name}`);

  const drawn = await Promise.all(
    names.map(async (name) => {
      const brief = briefs.find((b) => b.name === name)!;
      const text = prompt(brief, service);
      const images = await Promise.all(Array.from({ length: candidates }, () => generate(text)));
      return { name, text, images };
    }),
  );

  const content: Content[] = [];
  for (const { name, images } of drawn) {
    for (const [index, image] of images.entries()) {
      content.push({ type: "text", text: `${name}, candidate ${index + 1}:` }, imageBlock(await preview(image)));
    }
  }
  content.push({
    type: "text",
    text: `Pick and describe.\n\n${JSON.stringify({ title, briefs }, null, 2)}`,
  });
  const { images: picks } = await askJson<{
    images: { name: string; choice: number; altFr: string; altEn: string; problem: string }[];
  }>(system, content, pickSchema);

  await mkdir(dir, { recursive: true });
  const result: Record<string, Illustrated> = {};
  for (const { name, text, images } of drawn) {
    const pick = picks.find((p) => p.name === name);
    if (!pick) throw new Error(`No choice for ${name}`);
    const chosen = images[Math.min(Math.max(pick.choice, 1), candidates) - 1];
    await writeFile(`${dir}/${name}`, await sharp(chosen).webp({ quality: 82 }).toBuffer());
    result[name] = {
      file: name,
      alt: { fr: pick.altFr, en: pick.altEn },
      prompt: text,
      ...(pick.problem ? { note: pick.problem } : {}),
    };
  }
  return result;
}
