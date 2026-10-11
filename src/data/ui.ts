import type { Localized } from './i18n';
import type { RouteId } from './routes';

export const pageNames: Record<RouteId, Localized> = {
  home: { fr: 'Accueil', en: 'Home' },
  services: { fr: 'Services', en: 'Services' },
  websiteCreation: { fr: 'Création de site internet', en: 'Website creation' },
  websiteCare: { fr: 'Entretien du site', en: 'Website care' },
  googleVisibility: { fr: 'Visibilité Google', en: 'Google visibility' },
  pricing: { fr: 'Tarifs', en: 'Pricing' },
  projects: { fr: 'Projets', en: 'Projects' },
  contact: { fr: 'Contact', en: 'Contact' },
  legalNotice: { fr: 'Mentions légales', en: 'Legal notice' },
  privacy: { fr: 'Confidentialité', en: 'Privacy policy' },
};

export const mainNav: readonly RouteId[] = ['services', 'projects', 'pricing', 'contact'];

export const ui = {
  skipToContent: { fr: 'Aller au contenu', en: 'Skip to content' },
  mainNavLabel: { fr: 'Navigation principale', en: 'Main navigation' },
  requestQuote: { fr: 'Demander un devis', en: 'Request a quote' },
  languageName: { fr: 'Français', en: 'English' },
  otherLanguageLabel: { fr: 'Read this page in English', en: 'Lire cette page en français' },
  phone: { fr: 'Téléphone', en: 'Phone' },
  email: { fr: 'E-mail', en: 'Email' },
  whatsapp: { fr: 'WhatsApp', en: 'WhatsApp' },
  followUs: { fr: 'Réseaux', en: 'Social' },
  perMonth: { fr: '/mois', en: '/month' },
  from: { fr: 'À partir de', en: 'From' },
  setupFee: { fr: 'Mise en place', en: 'Setup' },
  notFoundTitle: { fr: 'Page introuvable', en: 'Page not found' },
} as const satisfies Record<string, Localized>;
