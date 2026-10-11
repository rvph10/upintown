import type { Localized } from './i18n';
import type { RouteId } from './routes';

export const policies = {
  inquiryReplyWorkingDays: 1,
  changeReplyWorkingDays: 2,
  noticeMonths: 1,
  handoverDays: 14,
  mailboxesIncluded: 1,
  extraMailbox: 5,
  extraMailboxLarge: 10,
  hourlyRate: 50,
} as const;

export const website = {
  fromPrice: 1200,
  extraPage: 150,
  weeks: { min: 3, max: 5 },
  correctionRounds: 1,
  planRequired: false,
  stages: [
    { name: { fr: 'Cadrage', en: 'Planning' }, share: 25 },
    { name: { fr: 'Textes', en: 'Content' }, share: 25 },
    { name: { fr: 'Design', en: 'Design' }, share: 25 },
    { name: { fr: 'Développement et mise en ligne', en: 'Build and launch' }, share: 25 },
  ],
} as const satisfies {
  fromPrice: number;
  extraPage: number;
  weeks: { min: number; max: number };
  correctionRounds: number;
  planRequired: boolean;
  stages: readonly { name: Localized; share: number }[];
};

export type PlanId = 'essentiel' | 'visibilite' | 'croissance';

export type Plan = {
  id: PlanId;
  name: Localized;
  monthly: number;
  setupFee: number;
  minimumMonths: number;
  googlePostsPerMonth: number;
  job: Localized;
};

export const plans: readonly Plan[] = [
  {
    id: 'essentiel',
    name: { fr: 'Essentiel', en: 'Essential' },
    monthly: 89,
    setupFee: 0,
    minimumMonths: 0,
    googlePostsPerMonth: 0,
    job: { fr: 'Tout reste en ordre de marche', en: 'Everything keeps running' },
  },
  {
    id: 'visibilite',
    name: { fr: 'Visibilité', en: 'Visibility' },
    monthly: 159,
    setupFee: 150,
    minimumMonths: 0,
    googlePostsPerMonth: 0,
    job: { fr: 'Être trouvé près de chez vous', en: 'Get found locally' },
  },
  {
    id: 'croissance',
    name: { fr: 'Croissance', en: 'Growth' },
    monthly: 279,
    setupFee: 150,
    minimumMonths: 3,
    googlePostsPerMonth: 2,
    job: { fr: 'Progresser sur Google', en: 'Grow on Google' },
  },
];

export function planById(id: PlanId): Plan {
  return plans.find((plan) => plan.id === id)!;
}

const all = { essentiel: true, visibilite: true, croissance: true } as const;
const fromVisibilite = { visibilite: true, croissance: true } as const;

// A string value replaces the checkmark for that plan.
export const planFeatures: readonly {
  label: Localized;
  plans: Partial<Record<PlanId, true | Localized>>;
}[] = [
  {
    label: { fr: 'Site en ligne, sécurisé et surveillé', en: 'Website online, secure and monitored' },
    plans: all,
  },
  {
    label: { fr: 'Adresse e-mail professionnelle', en: 'Professional email address' },
    plans: all,
  },
  {
    label: { fr: 'Nom de domaine renouvelé, à votre nom', en: 'Domain renewed, in your name' },
    plans: all,
  },
  {
    label: {
      fr: 'Petites modifications (textes, photos, horaires, prix)',
      en: 'Small changes (text, photos, opening hours, prices)',
    },
    plans: all,
  },
  {
    label: { fr: 'Fiche Google complète et à jour', en: 'Google Business Profile complete and up to date' },
    plans: fromVisibilite,
  },
  {
    label: {
      fr: 'Inscription dans les annuaires principaux',
      en: 'Listings in the main directories',
    },
    plans: fromVisibilite,
  },
  {
    label: { fr: 'Réponses à vos avis Google', en: 'Replies to your Google reviews' },
    plans: fromVisibilite,
  },
  {
    label: {
      fr: 'Suivi mensuel de vos recherches Google et améliorations des pages',
      en: 'Monthly review of your Google searches and page improvements',
    },
    plans: { croissance: true },
  },
  {
    label: { fr: "Aide pour récolter des avis (lien et QR code)", en: 'Help collecting reviews (link and QR code)' },
    plans: { croissance: true },
  },
  {
    label: { fr: 'Publications régulières sur votre fiche Google', en: 'Regular Google posts' },
    plans: { croissance: true },
  },
  {
    label: { fr: 'Rapport', en: 'Report' },
    plans: {
      visibilite: { fr: 'Trimestriel', en: 'Quarterly' },
      croissance: { fr: 'Mensuel', en: 'Monthly' },
    },
  },
];

export const services: readonly {
  id: 'website' | 'care' | 'google';
  route: RouteId;
  name: Localized;
  fromPrice: number;
  monthly: boolean;
}[] = [
  {
    id: 'website',
    route: 'websiteCreation',
    name: { fr: 'Création de site internet', en: 'Website creation' },
    fromPrice: website.fromPrice,
    monthly: false,
  },
  {
    id: 'care',
    route: 'websiteCare',
    name: { fr: 'Entretien du site', en: 'Website care' },
    fromPrice: planById('essentiel').monthly,
    monthly: true,
  },
  {
    id: 'google',
    route: 'googleVisibility',
    name: { fr: 'Visibilité Google', en: 'Google visibility' },
    fromPrice: planById('visibilite').monthly,
    monthly: true,
  },
];
