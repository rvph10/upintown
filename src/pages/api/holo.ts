import type { APIRoute } from "astro";
import { HOLO_GITHUB_REPO, HOLO_GITHUB_TOKEN, HOLO_WEBHOOK_SECRET } from "astro:env/server";
import { business } from "../../data/business";
import { postPath } from "../../data/routes";
import { queueImport, readDelivery, validSignature } from "../../lib/holo";

export const prerender = false;

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

// Holo publishing webhook (docs.tryholo.ai/seo/seo-webhooks). Answers within a few seconds: the article is only
// queued here, the GitHub workflow `holo-import` turns it into a pull request.
export const POST: APIRoute = async ({ request }) => {
  if (!HOLO_WEBHOOK_SECRET || !HOLO_GITHUB_TOKEN || !HOLO_GITHUB_REPO) {
    return json(503, { error: "Webhook not configured" });
  }

  // The signature covers the exact bytes, so nothing is parsed before it is checked.
  const body = Buffer.from(await request.arrayBuffer());
  if (!validSignature(body, request.headers.get("x-holo-signature"), HOLO_WEBHOOK_SECRET)) {
    return json(401, { error: "Invalid signature" });
  }

  let delivery;
  try {
    delivery = readDelivery(JSON.parse(body.toString("utf8")));
  } catch {
    delivery = null;
  }
  if (!delivery) return json(400, { error: "Invalid payload" });
  if (delivery.test) return json(200, { message: "Test webhook received" });

  try {
    await queueImport(delivery, HOLO_GITHUB_TOKEN, HOLO_GITHUB_REPO);
  } catch (error) {
    console.error("Holo webhook: could not queue", delivery.deliveryId, error);
    // 5xx makes Holo retry the same delivery later.
    return json(503, { error: "Could not queue the article, retry later" });
  }

  return json(200, { url: new URL(postPath(delivery.article.slug, "fr"), business.url).href });
};

export const ALL: APIRoute = () => json(405, { error: "Method not allowed" });
