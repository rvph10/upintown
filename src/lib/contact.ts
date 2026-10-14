import { RESEND_API_KEY } from "astro:env/server";
import type { AstroGlobal } from "astro";
import { business } from "../data/business";
import { confirmationEmail, notificationEmail } from "./email";
import type { Locale } from "../data/i18n";
import { contract, plans, services, type PlanId } from "../data/offer";

export const needs = [...services.map((s) => s.id), "other"] as const;
export type Need = (typeof needs)[number];

export type ContactForm = {
  name: string;
  email: string;
  business: string;
  need: Need | "";
  plan: PlanId | "";
  message: string;
  source: string;
};

export type FieldError = "required" | "invalid" | "tooLong";
export type ContactErrors = Partial<Record<keyof ContactForm, FieldError>>;

const limits: Record<keyof ContactForm, number> = {
  name: 100,
  email: 254,
  business: 200,
  need: 20,
  plan: 20,
  message: 5000,
  source: 200,
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function readForm(data: FormData): ContactForm {
  const get = (key: keyof ContactForm) => String(data.get(key) ?? "").trim();
  const need = get("need");
  const plan = get("plan");
  return {
    name: get("name").replace(/[\r\n]+/g, " "),
    email: get("email"),
    business: get("business"),
    need: (needs as readonly string[]).includes(need) ? (need as Need) : "",
    plan: plans.some((p) => p.id === plan) ? (plan as PlanId) : "",
    message: get("message"),
    source: get("source"),
  };
}

export function validate(form: ContactForm): ContactErrors {
  const errors: ContactErrors = {};
  for (const key of Object.keys(limits) as (keyof ContactForm)[]) {
    if (form[key].length > limits[key]) errors[key] = "tooLong";
  }
  if (!form.name) errors.name = "required";
  if (!form.email) errors.email = "required";
  else if (!emailPattern.test(form.email)) errors.email = "invalid";
  if (!form.need) errors.need = "required";
  if (!form.message) errors.message = "required";
  return errors;
}

const attempts = new Map<string, number[]>();
const windowMs = contract.ipMemoryHours * 60 * 60 * 1000;
const maxAttempts = 5;

// Sends from all visitors together in one window: caps the mail a script spread over many addresses can trigger.
const sends: number[] = [];
const maxSends = 20;

export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  // IPs are forgotten once their window has passed, as the privacy policy says.
  for (const [key, times] of attempts) if (now - times[times.length - 1] >= windowMs) attempts.delete(key);
  const recent = (attempts.get(ip) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  attempts.set(ip, recent);
  return recent.length > maxAttempts;
}

function isOverSendLimit(): boolean {
  const now = Date.now();
  while (sends.length && now - sends[0] >= windowMs) sends.shift();
  if (sends.length >= maxSends) return true;
  sends.push(now);
  return false;
}

/** The proxy (Traefik) appends the address it sees, so only the last entry cannot be set by the visitor. */
function clientIp(request: Request, fallback: string): string {
  return request.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim() || fallback;
}

// One token per displayed form. A token is claimed before sending, so a double click or a resubmitted form never
// sends twice. Kept in memory as long as the rate limit window.
const usedTokens = new Map<string, number>();
const tokenPattern = /^[0-9a-f-]{36}$/;

function claimToken(token: string): boolean {
  const now = Date.now();
  for (const [key, time] of usedTokens) if (now - time > windowMs) usedTokens.delete(key);
  if (!tokenPattern.test(token) || usedTokens.has(token)) return false;
  usedTokens.set(token, now);
  return true;
}

async function send(email: Record<string, unknown>): Promise<void> {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(email),
    // A hung request would keep the token claimed, and a retry would then show "sent" without sending.
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error(`Resend ${response.status}: ${await response.text()}`);
}

export async function sendContact(form: ContactForm, locale: Locale, page: string): Promise<void> {
  const notification = notificationEmail(form, locale, page);
  await send({
    from: `${business.name} <${business.noReplyEmail}>`,
    to: [business.email],
    reply_to: form.email,
    ...notification,
  });

  // The message has arrived: a failed confirmation is only logged, so the visitor is not asked to send it again.
  // Fixed text only: user input never goes into mail sent to an address the user typed.
  try {
    await send({
      from: `${business.name} <${business.noReplyEmail}>`,
      to: [form.email],
      ...confirmationEmail(locale),
      headers: { "Auto-Submitted": "auto-generated" },
    });
  } catch (error) {
    console.error(error);
  }
}

export type ContactState = {
  form: ContactForm;
  errors: ContactErrors;
  status: "idle" | "sent" | "failed" | "limited";
  /** Sent back with the form so the same submission is only handled once. */
  token: string;
};

export async function handleContact(astro: AstroGlobal, locale: Locale): Promise<ContactState | Response> {
  const { request, url } = astro;
  if (request.method !== "POST") {
    const plan = url.searchParams.get("plan") ?? "";
    const form = readForm(new FormData());
    form.plan = plans.some((p) => p.id === plan) ? (plan as PlanId) : "";
    const need = url.searchParams.get("need") ?? "";
    if (form.plan) form.need = form.plan === "essentiel" ? "care" : "google";
    else if ((needs as readonly string[]).includes(need)) form.need = need as Need;
    return { form, errors: {}, status: url.searchParams.has("sent") ? "sent" : "idle", token: crypto.randomUUID() };
  }

  // Not sent by the form: another content type, or a body over the adapter's size limit.
  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return new Response(null, { status: 400 });
  }
  const form = readForm(data);
  const token = String(data.get("token") ?? "");
  if (data.get("fax")) return astro.redirect(`${url.pathname}?sent`, 303);

  const errors = validate(form);
  if (Object.keys(errors).length) return { form, errors, status: "idle", token };

  if (isRateLimited(clientIp(request, astro.clientAddress))) return { form, errors, status: "limited", token };

  // Already sent (or being sent) with this token: show the confirmation without sending again.
  if (!claimToken(token)) return astro.redirect(`${url.pathname}?sent`, 303);

  if (isOverSendLimit()) {
    usedTokens.delete(token);
    return { form, errors, status: "failed", token };
  }

  try {
    await sendContact(form, locale, request.headers.get("referer") ?? url.pathname);
  } catch (error) {
    console.error(error);
    usedTokens.delete(token);
    return { form, errors, status: "failed", token };
  }
  return astro.redirect(`${url.pathname}?sent`, 303);
}
