// Structured calls to Claude for the blog scripts.

import Anthropic from "@anthropic-ai/sdk";

// Override with HOLO_AI_MODEL to compare models on the same article.
export const model = process.env.HOLO_AI_MODEL ?? "claude-sonnet-5-5";
// Haiku has no server-side refusal fallback.
const fallback = model.startsWith("claude-haiku")
  ? {}
  : { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" as const };

export type Content = Anthropic.Beta.BetaContentBlockParam;

export const imageBlock = (webp: Buffer): Content => ({
  type: "image",
  source: { type: "base64", media_type: "image/webp", data: webp.toString("base64") },
});

/** Sends one message and returns Claude's answer parsed against `schema`. */
export async function askJson<T>(system: string, content: Content[], schema: Record<string, unknown>): Promise<T> {
  const client = new Anthropic();
  const stream = client.beta.messages.stream({
    model,
    max_tokens: 64000,
    ...fallback,
    output_config: { effort: "high", format: { type: "json_schema", schema } },
    system,
    messages: [{ role: "user", content }],
  });
  const message = await stream.finalMessage();
  if (message.stop_reason === "refusal") throw new Error(`Claude declined (${message.stop_details?.category})`);
  if (message.stop_reason === "max_tokens") throw new Error("Claude's answer was cut off (max_tokens)");
  const text = message.content.find((block) => block.type === "text");
  if (!text || text.type !== "text") throw new Error("Claude returned no text");
  console.log(
    `${message.model}: ${message.usage.input_tokens} input tokens, ${message.usage.output_tokens} output tokens`,
  );
  return JSON.parse(text.text) as T;
}
