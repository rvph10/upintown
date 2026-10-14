import { formatPrice, type Locale, type Localized } from "./i18n";
import type { RouteId } from "./routes";

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

/** Contract and data terms used on the legal pages. Days are calendar days. */
export const contract = {
  updated: "2026-10-13",
  quoteValidDays: 30,
  invoiceDueDays: 14,
  lateFeeIndemnity: 40,
  projectPauseDays: 30,
  projectAbandonDays: 90,
  launchFixDays: 30,
  unpaidPauseDays: 15,
  unpaidNoticeDays: 30,
  unpaidGraceDays: 8,
  planEndNoticeMonths: 2,
  priceNoticeMonths: 2,
  reducedWeeksPerYear: 8,
  reducedNoticeWeeks: 2,
  liabilityMonths: 12,
  termsNoticeMonths: 1,
  amicableDays: 30,
  breachHours: 48,
  deletionDays: 30,
  subprocessorNoticeMonths: 1,
  prospectRetentionMonths: 12,
  /** Contact form rate limiting keeps IPs in memory this long. */
  ipMemoryHours: 1,
} as const;

export const website = {
  fromPrice: 1200,
  extraPage: 150,
  weeks: { min: 3, max: 5 },
  correctionRounds: 1,
  planRequired: false,
  stages: [
    { id: "planning", name: { fr: "Cadrage", en: "Planning" }, share: 25 },
    { id: "content", name: { fr: "Textes", en: "Content" }, share: 25 },
    { id: "design", name: { fr: "Design", en: "Design" }, share: 25 },
    { id: "launch", name: { fr: "Développement et mise en ligne", en: "Build and launch" }, share: 25 },
  ],
} as const satisfies {
  fromPrice: number;
  extraPage: number;
  weeks: { min: number; max: number };
  correctionRounds: number;
  planRequired: boolean;
  stages: readonly { id: string; name: Localized; share: number }[];
};

export type StageId = (typeof website.stages)[number]["id"];

/** What the website price includes. */
export const websiteIncluded: readonly Localized[] = [
  { fr: "Accueil, services et une page par service", en: "Home, services and a page per service" },
  { fr: "Formulaire de contact et pages légales", en: "Contact form and legal pages" },
  { fr: "Textes rédigés pour vous, validés par vous", en: "Text written for you, approved by you" },
  { fr: "Adapté aux téléphones", en: "Works on phones" },
  {
    fr: `${website.correctionRounds} série de corrections avant la mise en ligne`,
    en: `${website.correctionRounds} round of corrections before launch`,
  },
];

export type PlanId = "essentiel" | "visibilite" | "croissance";

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
    id: "essentiel",
    name: { fr: "Essentiel", en: "Essential" },
    monthly: 89,
    setupFee: 0,
    minimumMonths: 0,
    googlePostsPerMonth: 0,
    job: { fr: "Tout reste en ordre de marche", en: "Everything keeps running" },
  },
  {
    id: "visibilite",
    name: { fr: "Visibilité", en: "Visibility" },
    monthly: 159,
    setupFee: 150,
    minimumMonths: 0,
    googlePostsPerMonth: 0,
    job: { fr: "Être trouvé près de chez vous", en: "Get found locally" },
  },
  {
    id: "croissance",
    name: { fr: "Croissance", en: "Growth" },
    monthly: 279,
    setupFee: 150,
    minimumMonths: 3,
    googlePostsPerMonth: 2,
    job: { fr: "Progresser sur Google", en: "Grow on Google" },
  },
];

export function planById(id: PlanId): Plan {
  return plans.find((plan) => plan.id === id)!;
}

const all = { essentiel: true, visibilite: true, croissance: true } as const;
const fromVisibilite = { visibilite: true, croissance: true } as const;

const extraMailbox = { fr: formatPrice(policies.extraMailbox, "fr"), en: formatPrice(policies.extraMailbox, "en") };
const googlePosts = planById("croissance").googlePostsPerMonth;

export const featureGroups = {
  site: { fr: "Votre site et vos e-mails", en: "Your website and email" },
  google: { fr: "Votre présence sur Google", en: "Your presence on Google" },
  followUp: { fr: "Suivi", en: "Follow-up" },
} as const satisfies Record<string, Localized>;

// A string value replaces the checkmark for that plan. `details` is shown in a tooltip.
export const planFeatures: readonly {
  label: Localized;
  group: keyof typeof featureGroups;
  details?: Localized;
  plans: Partial<Record<PlanId, true | Localized>>;
}[] = [
  {
    label: { fr: "Site en ligne, sécurisé et surveillé", en: "Website online, secure and monitored" },
    group: "site",
    details: {
      fr: "Le site est surveillé en continu. En cas de panne, une alerte arrive aussitôt et le problème est en général réglé avant que vous ne le remarquiez.",
      en: "Your site is monitored continuously. If it goes down, an alert comes in right away and the problem is usually fixed before you notice.",
    },
    plans: all,
  },
  {
    label: { fr: "Adresse e-mail professionnelle", en: "Professional email address" },
    group: "site",
    details: {
      fr: `Une adresse à votre nom, comme contact@votre-entreprise.be. ${policies.mailboxesIncluded} boîte incluse, ${extraMailbox.fr} par mois par boîte en plus.`,
      en: `An address in your business name, like contact@your-business.com. ${policies.mailboxesIncluded} mailbox included, ${extraMailbox.en} a month per extra mailbox.`,
    },
    plans: all,
  },
  {
    label: { fr: "Nom de domaine à votre nom", en: "Domain in your name" },
    group: "site",
    details: {
      fr: "Votre adresse de site (votre-entreprise.be) est renouvelée à temps et enregistrée à votre nom. Elle vous appartient, même si vous partez.",
      en: "Your web address (your-business.com) is renewed on time and registered in your name. It stays yours, even if you leave.",
    },
    plans: all,
  },
  {
    label: { fr: "Petites modifications", en: "Small changes" },
    group: "site",
    details: {
      fr: `Textes, photos, horaires, prix : faits sous ${policies.changeReplyWorkingDays} jours ouvrables. Les nouvelles pages et fonctionnalités sont sur devis.`,
      en: `Text, photos, opening hours, prices: done within ${policies.changeReplyWorkingDays} working days. New pages and features are quoted separately.`,
    },
    plans: all,
  },
  {
    label: { fr: "Fiche Google à jour", en: "Google profile kept current" },
    group: "google",
    details: {
      fr: "Votre fiche Google (celle qui apparaît dans Google Maps) reste complète et à jour. Vous en restez propriétaire.",
      en: "Your Google Business Profile (the one shown in Google Maps) stays complete and up to date. You remain its owner.",
    },
    plans: fromVisibilite,
  },
  {
    label: { fr: "Inscription dans les annuaires", en: "Directory listings" },
    group: "google",
    details: {
      fr: "Votre entreprise inscrite dans les principaux annuaires en ligne, avec les mêmes coordonnées partout.",
      en: "Your business listed in the main online directories, with the same details everywhere.",
    },
    plans: fromVisibilite,
  },
  {
    label: { fr: "Réponses à vos avis Google", en: "Replies to your Google reviews" },
    group: "google",
    details: {
      fr: "Chaque avis reçoit une réponse. Pour les métiers sensibles, vous validez chaque réponse avant qu'elle soit publiée.",
      en: "Every review gets a reply. For sensitive trades, you approve each reply before it is posted.",
    },
    plans: fromVisibilite,
  },
  {
    label: { fr: "Suivi mensuel des recherches qui mènent à vous", en: "Monthly review of the searches that find you" },
    group: "followUp",
    details: {
      fr: "Chaque mois, les recherches qui mènent à votre site sont analysées, puis vos pages sont ajustées pour mieux y répondre.",
      en: "Every month, the searches that lead to your site are reviewed, then your pages are adjusted to answer them better.",
    },
    plans: { croissance: true },
  },
  {
    label: { fr: "Aide pour récolter des avis", en: "Help collecting reviews" },
    group: "google",
    details: {
      fr: "Un lien direct et un QR code à partager avec vos clients, pour qu'ils laissent un avis en quelques secondes.",
      en: "A direct link and a QR code to share with your customers, so they can leave a review in seconds.",
    },
    plans: { croissance: true },
  },
  {
    label: { fr: "Publications sur votre fiche Google", en: "Posts on your Google profile" },
    group: "google",
    details: {
      fr: `${googlePosts} publications par mois sur votre fiche Google, pour la garder active.`,
      en: `${googlePosts} posts a month on your Google profile, to keep it active.`,
    },
    plans: { croissance: true },
  },
  {
    label: { fr: "Rapport", en: "Report" },
    group: "followUp",
    details: {
      fr: "Un résumé clair de ce qui a été fait et de l'évolution de votre présence sur Google.",
      en: "A clear summary of what was done and how your Google presence is evolving.",
    },
    plans: {
      visibilite: { fr: "Trimestriel", en: "Quarterly" },
      croissance: { fr: "Mensuel", en: "Monthly" },
    },
  },
];

/** A feature as one phrase for a plan: a text value (the report frequency) joins the label, e.g. "Rapport trimestriel". */
export function featureLabel(feature: (typeof planFeatures)[number], plan: PlanId, locale: Locale): string {
  const value = feature.plans[plan];
  if (typeof value !== "object") return feature.label[locale];
  return locale === "fr"
    ? `${feature.label.fr} ${value.fr.toLowerCase()}`
    : `${value.en} ${feature.label.en.toLowerCase()}`;
}

/** Labels of the features a plan has and another plan does not. */
export function featuresOnlyIn(plan: PlanId, locale: Locale, without?: PlanId): string[] {
  return planFeatures
    .filter((feature) => feature.plans[plan] && !(without && feature.plans[without]))
    .map((feature) => featureLabel(feature, plan, locale));
}

export const serviceIds = ["website", "care", "google"] as const;
export type ServiceId = (typeof serviceIds)[number];

export const services: readonly {
  id: ServiceId;
  route: RouteId;
  name: Localized;
  tagline: Localized;
  fromPrice: number;
  monthly: boolean;
}[] = [
  {
    id: "website",
    route: "websiteCreation",
    name: { fr: "Création de site internet", en: "Website creation" },
    tagline: { fr: "Un site professionnel, textes compris", en: "A professional site, text included" },
    fromPrice: website.fromPrice,
    monthly: false,
  },
  {
    id: "care",
    route: "websiteCare",
    name: { fr: "Entretien du site", en: "Website care" },
    tagline: { fr: "En ligne, à jour, avec votre e-mail pro", en: "Online, up to date, with your pro email" },
    fromPrice: planById("essentiel").monthly,
    monthly: true,
  },
  {
    id: "google",
    route: "localSeo",
    name: { fr: "Référencement local", en: "Local SEO" },
    tagline: { fr: "Être trouvé sur Google et Google Maps", en: "Get found on Google and Google Maps" },
    fromPrice: planById("visibilite").monthly,
    monthly: true,
  },
];
