import { RESEND_API_KEY } from 'astro:env/server';
import type { AstroGlobal } from 'astro';
import { business } from '../data/business';
import { workingDays, type Locale } from '../data/i18n';
import { plans, policies, services, type PlanId } from '../data/offer';

export const needs = [...services.map((s) => s.id), 'other'] as const;
export type Need = (typeof needs)[number];

export type ContactForm = {
  name: string;
  email: string;
  business: string;
  need: Need | '';
  plan: PlanId | '';
  message: string;
  source: string;
};

export type FieldError = 'required' | 'invalid' | 'tooLong';
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
  const get = (key: keyof ContactForm) => String(data.get(key) ?? '').trim();
  const need = get('need');
  const plan = get('plan');
  return {
    name: get('name').replace(/[\r\n]+/g, ' '),
    email: get('email'),
    business: get('business'),
    need: (needs as readonly string[]).includes(need) ? (need as Need) : '',
    plan: plans.some((p) => p.id === plan) ? (plan as PlanId) : '',
    message: get('message'),
    source: get('source'),
  };
}

export function validate(form: ContactForm): ContactErrors {
  const errors: ContactErrors = {};
  for (const key of Object.keys(limits) as (keyof ContactForm)[]) {
    if (form[key].length > limits[key]) errors[key] = 'tooLong';
  }
  if (!form.name) errors.name = 'required';
  if (!form.email) errors.email = 'required';
  else if (!emailPattern.test(form.email)) errors.email = 'invalid';
  if (!form.need) errors.need = 'required';
  if (!form.message) errors.message = 'required';
  return errors;
}

const attempts = new Map<string, number[]>();
const windowMs = 60 * 60 * 1000;
const maxAttempts = 5;

export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (attempts.get(ip) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  attempts.set(ip, recent);
  return recent.length > maxAttempts;
}

async function send(email: Record<string, unknown>): Promise<void> {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(email),
  });
  if (!response.ok) throw new Error(`Resend ${response.status}: ${await response.text()}`);
}

const confirmation = {
  subject: { fr: 'Votre message a bien été reçu', en: 'Your message has been received' },
  body: {
    fr: (days: string) =>
      `Bonjour,\n\nMerci pour votre message. Vous recevrez une réponse sous ${days}, du lundi au vendredi.\n\nPour toute question en attendant : ${business.email} ou ${business.phone.display} (appel ou WhatsApp).\n\nCet e-mail est envoyé automatiquement, merci de ne pas y répondre.\n\n${business.name}\n${business.url}`,
    en: (days: string) =>
      `Hello,\n\nThank you for your message. You will get a reply within ${days}, Monday to Friday.\n\nIf you have a question in the meantime: ${business.email} or ${business.phone.display} (call or WhatsApp).\n\nThis email is sent automatically, please do not reply.\n\n${business.name}\n${business.url}`,
  },
};

export async function sendContact(form: ContactForm, locale: Locale, page: string): Promise<void> {
  const notification = [
    `Nom: ${form.name}`,
    `E-mail: ${form.email}`,
    `Entreprise / site: ${form.business || '-'}`,
    `Besoin: ${form.need}`,
    `Formule: ${form.plan || '-'}`,
    `Source: ${form.source || '-'}`,
    `Langue: ${locale}`,
    `Page: ${page}`,
    '',
    form.message,
  ].join('\n');

  await send({
    from: `${business.name} <${business.noReplyEmail}>`,
    to: [business.email],
    reply_to: form.email,
    subject: `Nouveau message: ${form.name}`,
    text: notification,
  });

  // Fixed text only: user input never goes into mail sent to an address the user typed.
  await send({
    from: `${business.name} <${business.noReplyEmail}>`,
    to: [form.email],
    subject: confirmation.subject[locale],
    text: confirmation.body[locale](workingDays(policies.inquiryReplyWorkingDays, locale)),
    headers: { 'Auto-Submitted': 'auto-generated' },
  });
}

export type ContactState = {
  form: ContactForm;
  errors: ContactErrors;
  status: 'idle' | 'sent' | 'failed' | 'limited';
};

export async function handleContact(astro: AstroGlobal, locale: Locale): Promise<ContactState | Response> {
  const { request, url } = astro;
  if (request.method !== 'POST') {
    const plan = url.searchParams.get('plan') ?? '';
    const form = readForm(new FormData());
    form.plan = plans.some((p) => p.id === plan) ? (plan as PlanId) : '';
    if (form.plan) form.need = form.plan === 'essentiel' ? 'care' : 'google';
    return { form, errors: {}, status: url.searchParams.has('sent') ? 'sent' : 'idle' };
  }

  const data = await request.formData();
  const form = readForm(data);
  if (data.get('fax')) return astro.redirect(`${url.pathname}?sent`, 303);

  const errors = validate(form);
  if (Object.keys(errors).length) return { form, errors, status: 'idle' };

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || astro.clientAddress;
  if (isRateLimited(ip)) return { form, errors, status: 'limited' };

  try {
    await sendContact(form, locale, request.headers.get('referer') ?? url.pathname);
  } catch (error) {
    console.error(error);
    return { form, errors, status: 'failed' };
  }
  return astro.redirect(`${url.pathname}?sent`, 303);
}
