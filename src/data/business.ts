import type { Localized } from "./i18n";

const phone = "+32456972848";

export const business = {
  name: "UpInTown",
  url: "https://upintown.dev",
  email: "hey@upintown.dev",
  noReplyEmail: "no-reply@upintown.dev",
  phone: { display: "+32 456 97 28 48", e164: phone },
  areaServed: ["BE"],
  languages: ["fr", "en"],
  openingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  social: {
    instagram: "https://www.instagram.com/upintown.dev",
    linkedin: "https://www.linkedin.com/in/raphael-genu",
    github: "https://github.com/rvph10",
  },
} as const;

export const contactLinks = {
  email: `mailto:${business.email}`,
  phone: `tel:${phone}`,
  whatsapp: `https://wa.me/${phone.slice(1)}`,
} as const;

// For the legal pages; the VAT mention also appears on the pricing page.
export const legal = {
  /** ISO date of the last legal notice change. */
  noticeUpdated: "2026-10-13",
  /** ISO date of the last privacy policy change. */
  privacyUpdated: "2026-10-13",
  owner: "Raphaël Genu",
  form: { fr: "Personne physique (indépendant)", en: "Sole trader" } satisfies Localized,
  address: {
    street: "Kerkedelle 51 boîte A",
    postalCode: "1200",
    city: "Woluwe-Saint-Lambert",
    country: { fr: "Belgique", en: "Belgium" } satisfies Localized,
  },
  companyNumber: "1034.448.184",
  vatNumber: "BE 1034.448.184",
  vatExempt: true,
  vatMention: {
    fr: "Petite entreprise soumise au régime de la franchise de taxe. TVA non applicable.",
    en: "Small business subject to the VAT exemption scheme. VAT not applicable.",
  } satisfies Localized,
  host: {
    name: "Hetzner Online GmbH",
    address: "Industriestr. 25, 91710 Gunzenhausen, Germany",
    url: "https://www.hetzner.com",
  },
} as const;

// UpInTown's own processors, listed in the privacy policy. Add Umami once it is live on the site.
export const processors = [
  {
    name: "Hetzner",
    purpose: { fr: "Hébergement du site", en: "Website hosting" },
    country: { fr: "Allemagne", en: "Germany" },
  },
  {
    name: "Resend",
    purpose: { fr: "Envoi des messages du formulaire de contact", en: "Delivery of contact form messages" },
    country: { fr: "États-Unis", en: "United States" },
  },
  {
    name: "Zoho",
    purpose: { fr: "Messagerie électronique", en: "Email" },
    country: { fr: "Union européenne", en: "European Union" },
  },
  {
    name: "Google Workspace",
    purpose: {
      fr: "Stockage des fichiers clients et appels vidéo (Google Meet)",
      en: "Client file storage and video calls (Google Meet)",
    },
    country: { fr: "Irlande, transferts possibles hors UE", en: "Ireland, possible transfers outside the EU" },
  },
  {
    name: "WhatsApp",
    purpose: { fr: "Messages et appels", en: "Messages and calls" },
    country: { fr: "Irlande, transferts possibles hors UE", en: "Ireland, possible transfers outside the EU" },
  },
  {
    name: "Stripe",
    purpose: { fr: "Abonnements mensuels, devis et factures", en: "Monthly subscriptions, quotes and invoices" },
    country: { fr: "Irlande", en: "Ireland" },
  },
  {
    name: "Accountable",
    purpose: { fr: "Facturation et comptabilité", en: "Invoicing and accounting" },
    country: { fr: "Belgique", en: "Belgium" },
  },
] as const satisfies readonly {
  name: string;
  purpose: Localized;
  country: Localized;
}[];

// Subprocessors for client sites and email, listed in the data processing agreement.
export const clientProcessors = [
  {
    name: legal.host.name,
    purpose: { fr: "Hébergement des sites et des statistiques", en: "Hosting of sites and statistics" },
    country: { fr: "Allemagne", en: "Germany" },
  },
  {
    name: "Zoho",
    purpose: { fr: "Messagerie", en: "Email" },
    country: { fr: "Union européenne", en: "European Union" },
  },
  {
    name: "Resend",
    purpose: { fr: "Envoi des messages des formulaires de contact", en: "Delivery of contact form messages" },
    country: { fr: "États-Unis", en: "United States" },
  },
  {
    name: "Google Workspace",
    purpose: { fr: "Stockage des fichiers fournis par le Client", en: "Storage of files provided by the Client" },
    country: { fr: "Irlande, transferts possibles hors UE", en: "Ireland, possible transfers outside the EU" },
  },
] as const satisfies readonly { name: string; purpose: Localized; country: Localized }[];
