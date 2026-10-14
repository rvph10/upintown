import { business, contactLinks } from "../data/business";
import { nextSteps } from "../data/contact";
import { htmlLang, workingDays, type Locale } from "../data/i18n";
import { planById, policies, services, type PlanId } from "../data/offer";
import type { ContactForm } from "./contact";

// Emails cannot read CSS variables: these are the hex values of the tokens in src/styles/global.css.
const color = {
  paper: "#f2f2f2",
  white: "#ffffff",
  ink: "#000000",
  ash200: "#e6e6e6",
  ash600: "#333333",
  irisStrong: "#7a45f0",
  voltSoft: "#dcffdb",
  voltStrong: "#2e6b05",
};
const font = "'Inter Tight', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";
const logo = new URL("/email/logo.png", business.url).href;

export function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

const heading = (text: string) =>
  `<h1 style="margin:0;font-family:${font};font-size:30px;line-height:1.15;font-weight:600;letter-spacing:-0.02em;color:${color.ink};">${text}</h1>`;

const paragraph = (html: string, top = 16) =>
  `<p style="margin:${top}px 0 0;font-family:${font};font-size:16px;line-height:1.6;color:${color.ash600};">${html}</p>`;

const link = (href: string, text: string) =>
  `<a href="${escapeHtml(href)}" style="color:${color.irisStrong};font-weight:500;text-decoration:underline;">${text}</a>`;

const pill = (text: string) =>
  `<span style="display:inline-block;padding:6px 14px;border-radius:9999px;background:${color.voltSoft};font-family:${font};font-size:14px;font-weight:500;color:${color.voltStrong};">${text}</span>`;

const button = (href: string, label: string) => `
  <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:28px;"><tr>
    <td style="border-radius:9999px;background:${color.ink};">
      <a href="${escapeHtml(href)}" style="display:inline-block;padding:15px 28px;border-radius:9999px;font-family:${font};font-size:15px;font-weight:600;letter-spacing:-0.01em;color:${color.paper};text-decoration:none;">${label}</a>
    </td>
  </tr></table>`;

/** Page shell: logo, white rounded card on paper, small footer. Tables and inline styles for email clients. */
function layout({
  locale,
  title,
  preheader,
  body,
  footer,
}: {
  locale: Locale;
  title: string;
  preheader: string;
  body: string;
  footer: string;
}) {
  return `<!doctype html>
<html lang="${htmlLang[locale]}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${title}</title>
</head>
<body style="margin:0;padding:0;background:${color.paper};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${color.paper};">
  <tr><td align="center" style="padding:40px 16px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
      <tr><td style="padding:0 8px 24px;">
        <a href="${business.url}" style="text-decoration:none;">
          <img src="${logo}" width="22" height="24" alt="" style="display:inline-block;vertical-align:middle;border:0;">
          <span style="vertical-align:middle;margin-left:8px;font-family:${font};font-size:20px;font-weight:600;letter-spacing:-0.02em;color:${color.ink};">${business.name}</span>
        </a>
      </td></tr>
      <tr><td style="padding:40px 32px;border-radius:32px;background:${color.white};">${body}</td></tr>
      <tr><td align="center" style="padding:24px 8px 0;font-family:${font};font-size:13px;line-height:1.5;color:${color.ash600};">${footer}</td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

const confirmationCopy = {
  subject: { fr: "Votre message a bien été reçu", en: "Your message has been received" },
  received: { fr: "Message reçu", en: "Message received" },
  title: { fr: "Merci pour votre message.", en: "Thank you for your message." },
  intro: {
    fr: (days: string) => `Vous recevrez une réponse sous ${days}, du lundi au vendredi.`,
    en: (days: string) => `You will get a reply within ${days}, Monday to Friday.`,
  },
  next: { fr: "Ensuite", en: "What happens next" },
  question: { fr: "Une question en attendant ?", en: "A question in the meantime?" },
  callOrWhatsApp: { fr: "appel ou WhatsApp", en: "call or WhatsApp" },
  automatic: {
    fr: "Cet e-mail est envoyé automatiquement, merci de ne pas y répondre.",
    en: "This email is sent automatically, please do not reply.",
  },
};

/** Sent to the address the visitor typed: fixed text only, never anything they wrote. */
export function confirmationEmail(locale: Locale) {
  const c = confirmationCopy;
  const days = workingDays(policies.inquiryReplyWorkingDays, locale);
  const host = new URL(business.url).host;
  const steps = nextSteps[locale]
    .map(
      (step, index) => `
      <tr>
        <td width="28" valign="top" style="padding-top:${index ? 16 : 0}px;">
          <div style="width:28px;height:28px;border-radius:9999px;background:${color.ink};text-align:center;font-family:${font};font-size:13px;font-weight:600;line-height:28px;color:${color.paper};">${index + 1}</div>
        </td>
        <td valign="top" style="padding:${index ? 16 : 0}px 0 0 14px;font-family:${font};">
          <div style="font-size:16px;font-weight:600;line-height:1.4;color:${color.ink};">${step.title}</div>
          <div style="margin-top:2px;font-size:15px;line-height:1.5;color:${color.ash600};">${step.text}</div>
        </td>
      </tr>`,
    )
    .join("");

  const body = `
    ${pill(c.received[locale])}
    <div style="margin-top:20px;">${heading(c.title[locale])}</div>
    ${paragraph(c.intro[locale](days))}
    <h2 style="margin:32px 0 16px;font-family:${font};font-size:20px;font-weight:600;letter-spacing:-0.02em;color:${color.ink};">${c.next[locale]}</h2>
    <table role="presentation" cellpadding="0" cellspacing="0">${steps}</table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;"><tr>
      <td style="padding:20px 24px;border-radius:24px;background:${color.paper};font-family:${font};font-size:15px;line-height:1.6;color:${color.ash600};">
        <div style="font-weight:600;color:${color.ink};">${c.question[locale]}</div>
        ${link(contactLinks.email, business.email)}<br>
        ${link(contactLinks.phone, business.phone.display)} (${c.callOrWhatsApp[locale]})
      </td>
    </tr></table>`;

  const footer = `${c.automatic[locale]}<br>${business.name} · ${link(business.url, host)}`;

  const text = [
    c.title[locale],
    "",
    c.intro[locale](days),
    "",
    `${c.next[locale]}:`,
    ...nextSteps[locale].map((step, index) => `${index + 1}. ${step.title}. ${step.text}`),
    "",
    `${c.question[locale]} ${business.email}, ${business.phone.display} (${c.callOrWhatsApp[locale]})`,
    "",
    c.automatic[locale],
    `${business.name}, ${business.url}`,
  ].join("\n");

  return {
    subject: c.subject[locale],
    html: layout({ locale, title: c.subject[locale], preheader: c.intro[locale](days), body, footer }),
    text,
  };
}

/** Sent to UpInTown, in French. Everything the visitor typed is escaped. */
export function notificationEmail(form: ContactForm, locale: Locale, page: string) {
  const need = form.need === "other" ? "Autre chose" : (services.find((s) => s.id === form.need)?.name.fr ?? form.need);
  const plan = form.plan ? planById(form.plan as PlanId).name.fr : "";
  const rows: [string, string][] = [
    ["Nom", escapeHtml(form.name)],
    ["E-mail", link(`mailto:${form.email}`, escapeHtml(form.email))],
    ["Entreprise ou site", escapeHtml(form.business) || "-"],
    ["Besoin", escapeHtml(need)],
    ["Formule", escapeHtml(plan) || "-"],
    ["Source", escapeHtml(form.source) || "-"],
    ["Langue", locale.toUpperCase()],
    ["Page", escapeHtml(page)],
  ];
  const details = rows
    .map(
      ([label, value], index) => `
      <tr>
        <td width="150" valign="top" style="padding:12px 0;${index ? `border-top:1px solid ${color.ash200};` : ""}font-family:${font};font-size:14px;font-weight:600;color:${color.ink};">${label}</td>
        <td valign="top" style="padding:12px 0;${index ? `border-top:1px solid ${color.ash200};` : ""}font-family:${font};font-size:15px;line-height:1.5;color:${color.ash600};word-break:break-word;">${value}</td>
      </tr>`,
    )
    .join("");
  const message = escapeHtml(form.message).replace(/\r?\n/g, "<br>");

  const body = `
    ${heading("Nouveau message")}
    ${paragraph(`Envoyé depuis le formulaire de contact par ${escapeHtml(form.name)}.`, 12)}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">${details}</table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;"><tr>
      <td style="padding:20px 24px;border-radius:24px;background:${color.paper};font-family:${font};font-size:16px;line-height:1.6;color:${color.ink};word-break:break-word;">${message}</td>
    </tr></table>
    ${button(`mailto:${form.email}`, "Répondre")}`;

  const text = [
    `Nom: ${form.name}`,
    `E-mail: ${form.email}`,
    `Entreprise / site: ${form.business || "-"}`,
    `Besoin: ${need}`,
    `Formule: ${plan || "-"}`,
    `Source: ${form.source || "-"}`,
    `Langue: ${locale}`,
    `Page: ${page}`,
    "",
    form.message,
  ].join("\n");

  return {
    subject: `Nouveau message: ${form.name}`,
    html: layout({
      locale: "fr",
      title: "Nouveau message",
      preheader: escapeHtml(form.message.slice(0, 120)),
      body,
      footer: `${business.name} · formulaire de contact`,
    }),
    text,
  };
}
