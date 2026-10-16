import { createHmac, timingSafeEqual } from "node:crypto";

/** Holo signs the raw body: `X-Holo-Signature: sha256=<hex>` (HMAC-SHA256 with the shared secret). */
export function validSignature(body: Buffer, header: string | null, secret: string): boolean {
  const match = /^sha256=([0-9a-f]{64})$/i.exec(header?.trim() ?? "");
  if (!match) return false;
  const expected = createHmac("sha256", secret).update(body).digest();
  return timingSafeEqual(expected, Buffer.from(match[1], "hex"));
}

export const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export interface HoloDelivery {
  event: "article.published" | "article.updated";
  test: boolean;
  version: 1;
  deliveryId: string;
  sentAt: string;
  article: {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    contentMarkdown: string;
    metaTitle: string;
    metaDescription: string;
    featuredImage: string | null;
    images: { url: string; alt: string }[];
    publishedAt: string;
    isRepublish: boolean;
  };
}

/** Checks the fields the import uses, so a malformed delivery is refused here rather than in the import. */
export function readDelivery(data: unknown): HoloDelivery | null {
  if (typeof data !== "object" || data === null) return null;
  const d = data as Record<string, unknown>;
  if (d.version !== 1 || typeof d.test !== "boolean" || typeof d.deliveryId !== "string") return null;
  if (d.event !== "article.published" && d.event !== "article.updated") return null;
  if (d.test) return d as unknown as HoloDelivery;
  const a = d.article as Record<string, unknown> | undefined;
  if (!a || typeof a !== "object") return null;
  const strings = ["id", "slug", "title", "excerpt", "contentMarkdown", "publishedAt"] as const;
  if (!strings.every((key) => typeof a[key] === "string" && a[key])) return null;
  if (!slugPattern.test(a.slug as string) || (a.slug as string).length > 120) return null;
  return d as unknown as HoloDelivery;
}

/** The parts of a delivery the import needs, without the HTML copy of the body. */
export function inboxFile(delivery: HoloDelivery): string {
  const { contentHtml: _html, ...article } = delivery.article as HoloDelivery["article"] & { contentHtml?: string };
  const { event, deliveryId, sentAt } = delivery;
  return `${JSON.stringify({ event, deliveryId, sentAt, article }, null, 2)}\n`;
}

class GitHubError extends Error {}

/** Minimal GitHub REST client for the one branch and file a delivery touches. */
function github(token: string, repo: string) {
  return async (method: string, path: string, body?: unknown): Promise<{ status: number; data: any }> => {
    const response = await fetch(`https://api.github.com/repos/${repo}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "upintown-holo-webhook",
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(6000),
    });
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;
    if (response.status >= 500) throw new GitHubError(`${method} ${path}: ${response.status}`);
    return { status: response.status, data };
  };
}

/**
 * Saves the delivery as `inbox/<slug>.json` on branch `holo/<slug>`, then asks GitHub to run the import workflow.
 * The workflow runs from `main`, so nothing pushed to a `holo/*` branch is ever executed.
 */
export async function queueImport(delivery: HoloDelivery, token: string, repo: string): Promise<void> {
  const api = github(token, repo);
  const { slug } = delivery.article;
  const branch = `holo/${slug}`;
  const file = `inbox/${slug}.json`;
  const content = inboxFile(delivery);

  const ref = await api("GET", `/git/ref/heads/${branch}`);
  if (ref.status === 404) {
    const main = await api("GET", "/git/ref/heads/main");
    if (main.status !== 200) throw new GitHubError(`main ref: ${main.status}`);
    const created = await api("POST", "/git/refs", { ref: `refs/heads/${branch}`, sha: main.data.object.sha });
    if (created.status !== 201 && created.status !== 422) throw new GitHubError(`create branch: ${created.status}`);
  } else if (ref.status !== 200) {
    throw new GitHubError(`branch ref: ${ref.status}`);
  }

  const existing = await api("GET", `/contents/${file}?ref=${encodeURIComponent(branch)}`);
  const unchanged =
    existing.status === 200 && Buffer.from(existing.data.content, "base64").toString("utf8") === content;
  if (!unchanged) {
    const saved = await api("PUT", `/contents/${file}`, {
      message: `Receive Holo article ${slug}`,
      content: Buffer.from(content).toString("base64"),
      branch,
      sha: existing.status === 200 ? existing.data.sha : undefined,
    });
    if (saved.status !== 200 && saved.status !== 201) throw new GitHubError(`save inbox: ${saved.status}`);
  }

  // Sent even when unchanged: a retry may follow an attempt that saved the file but failed before this call.
  const dispatched = await api("POST", "/dispatches", { event_type: "holo-article", client_payload: { slug } });
  if (dispatched.status !== 204) throw new GitHubError(`dispatch: ${dispatched.status}`);
}
