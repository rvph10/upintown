import type { Localized } from './i18n';

const phone = '+32456972848';

export const business = {
  name: 'UpInTown',
  url: 'https://upintown.dev',
  email: 'hello@upintown.dev',
  phone: { display: '+32 456 97 28 48', e164: phone },
  areaServed: ['BE'],
  languages: ['fr', 'en'],
  openingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  social: {
    instagram: 'https://www.instagram.com/upintown.dev',
    linkedin: 'https://www.linkedin.com/in/raphael-genu',
    github: 'https://github.com/rvph10',
  },
} as const;

export const contactLinks = {
  email: `mailto:${business.email}`,
  phone: `tel:${phone}`,
  whatsapp: `https://wa.me/${phone.slice(1)}`,
} as const;

// Only for the legal notice and privacy policy.
export const legal = {
  owner: 'Raphaël Genu',
  form: { fr: 'Personne physique (indépendant)', en: 'Sole trader' } satisfies Localized,
  address: {
    street: 'Kerkedelle 51 boîte A',
    postalCode: '1200',
    city: 'Woluwe-Saint-Lambert',
    country: { fr: 'Belgique', en: 'Belgium' } satisfies Localized,
  },
  companyNumber: '1034.448.184',
  vatNumber: 'BE 1034.448.184',
  vatExempt: true,
  vatMention: {
    fr: 'Petite entreprise soumise au régime de la franchise de taxe. TVA non applicable.',
    en: 'Small business subject to the VAT exemption scheme. VAT not applicable.',
  } satisfies Localized,
  host: {
    name: 'Hetzner Online GmbH',
    address: 'Industriestr. 25, 91710 Gunzenhausen, Germany',
    url: 'https://www.hetzner.com',
  },
} as const;

export const processors = [
  {
    name: 'Hetzner',
    purpose: { fr: 'Hébergement du site', en: 'Website hosting' },
    country: { fr: 'Allemagne', en: 'Germany' },
  },
  {
    name: 'Resend',
    purpose: { fr: 'Envoi des messages du formulaire de contact', en: 'Delivery of contact form messages' },
    country: { fr: 'États-Unis', en: 'United States' },
  },
  {
    name: 'Stripe',
    purpose: { fr: 'Paiement des abonnements mensuels', en: 'Monthly subscription payments' },
    country: { fr: 'Irlande', en: 'Ireland' },
  },
  {
    name: 'Zoho',
    purpose: { fr: 'Messagerie électronique', en: 'Email' },
  },
  {
    name: 'Umami',
    purpose: {
      fr: 'Statistiques de visite sans cookies, auto-hébergées',
      en: 'Cookieless visit statistics, self-hosted',
    },
  },
] as const satisfies readonly {
  name: string;
  purpose: Localized;
  country?: Localized;
}[];
