import { workingDays, type Localized } from "./i18n";
import { policies } from "./offer";
import type { RouteId } from "./routes";

export const descriptions: Record<RouteId, Localized> = {
  home: {
    fr: "Site internet, e-mail professionnel et fiche Google pris en charge pour les indépendants et petites entreprises, à prix fixe.",
    en: "Website, professional email and Google profile taken care of for independents and small businesses, at a fixed price.",
  },
  services: {
    fr: "Création de site internet, entretien et visibilité Google pour indépendants et petites entreprises.",
    en: "Website creation, website care and Google visibility for independents and small businesses.",
  },
  websiteCreation: {
    fr: "Un site internet clair et rapide, réalisé par étapes validées, textes compris.",
    en: "A clear, fast website built in approved stages, text included.",
  },
  websiteCare: {
    fr: "Votre site, vos e-mails et votre nom de domaine entretenus chaque mois, petites modifications comprises.",
    en: "Your website, email and domain looked after every month, small changes included.",
  },
  googleVisibility: {
    fr: "Fiche Google, annuaires et avis gérés pour être trouvé par vos clients sur Google et Google Maps.",
    en: "Google profile, directories and reviews managed so customers find you on Google and Google Maps.",
  },
  pricing: {
    fr: "Tarifs publics : création de site internet et formules mensuelles, sans surprise.",
    en: "Public prices: website creation and monthly plans, with no surprises.",
  },
  projects: {
    fr: "Sites internet réalisés par UpInTown.",
    en: "Websites built by UpInTown.",
  },
  contact: {
    fr: `Décrivez votre besoin, réponse sous ${workingDays(policies.inquiryReplyWorkingDays, "fr")}.`,
    en: `Tell us what you need, reply within ${workingDays(policies.inquiryReplyWorkingDays, "en")}.`,
  },
  legalNotice: {
    fr: "Mentions légales du site upintown.dev.",
    en: "Legal notice for upintown.dev.",
  },
  privacy: {
    fr: "Comment UpInTown traite vos données personnelles.",
    en: "How UpInTown handles your personal data.",
  },
};
