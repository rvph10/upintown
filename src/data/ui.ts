import { workingDays, type Localized } from "./i18n";
import { policies } from "./offer";
import type { RouteId } from "./routes";

export const pageNames: Record<RouteId, Localized> = {
  home: { fr: "Accueil", en: "Home" },
  services: { fr: "Services", en: "Services" },
  websiteCreation: { fr: "Création de site internet", en: "Website creation" },
  websiteCare: { fr: "Entretien du site", en: "Website care" },
  localSeo: { fr: "Référencement local", en: "Local SEO" },
  pricing: { fr: "Tarifs", en: "Pricing" },
  projects: { fr: "Projets", en: "Projects" },
  blog: { fr: "Blog", en: "Blog" },
  contact: { fr: "Contact", en: "Contact" },
  legalNotice: { fr: "Mentions légales", en: "Legal notice" },
  privacy: { fr: "Confidentialité", en: "Privacy policy" },
  terms: { fr: "Conditions générales", en: "Terms of service" },
  questionnaire: { fr: "Questionnaire", en: "Questionnaire" },
};

/** Header links in order; a hash points to a section of that page. */
export const mainNav: readonly { route: RouteId; hash?: string; label?: Localized }[] = [
  { route: "services" },
  { route: "home", hash: "process", label: { fr: "Méthode", en: "Process" } },
  { route: "pricing" },
  { route: "projects" },
];

export const ui = {
  skipToContent: { fr: "Aller au contenu", en: "Skip to content" },
  mainNavLabel: { fr: "Navigation principale", en: "Main navigation" },
  footerNavLabel: { fr: "Navigation du pied de page", en: "Footer navigation" },
  requestQuote: { fr: "Demander un devis", en: "Request a quote" },
  headerCta: { fr: "Demander un devis", en: "Request a quote" },
  languageName: { fr: "Français", en: "English" },
  phone: { fr: "Téléphone", en: "Phone" },
  email: { fr: "E-mail", en: "Email" },
  whatsapp: { fr: "WhatsApp", en: "WhatsApp" },
  followUs: { fr: "Réseaux", en: "Social" },
  perMonth: { fr: "/mois", en: "/month" },
  from: { fr: "À partir de", en: "From" },
  setupFee: { fr: "Mise en place", en: "Setup" },
  notFoundTitle: { fr: "Page introuvable", en: "Page not found" },
  ctaTitle: { fr: "Parlons de votre site.", en: "Let's talk about your website." },
  ctaText: {
    fr: `Décrivez votre activité en quelques lignes. Réponse sous ${workingDays(policies.inquiryReplyWorkingDays, "fr")}, puis un court appel et un devis clair.`,
    en: `Describe your business in a few lines. A reply within ${workingDays(policies.inquiryReplyWorkingDays, "en")}, then a short call and a clear quote.`,
  },
  ctaCall: { fr: "Appeler maintenant", en: "Call now" },
  pauseVideo: { fr: "Mettre la vidéo en pause", en: "Pause the video" },
  playVideo: { fr: "Lire la vidéo", en: "Play the video" },
  shareImageAlt: {
    fr: "UpInTown : un site qui travaille, même quand vous êtes occupé.",
    en: "UpInTown: a website that works, even when you're busy.",
  },
} as const satisfies Record<string, Localized>;
