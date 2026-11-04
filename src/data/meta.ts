import { workingDays, type Localized } from "./i18n";
import { policies } from "./offer";
import type { RouteId } from "./routes";

/** Title tags of the main pages, before " | UpInTown". Other pages use their page name. */
export const titles = {
  home: {
    fr: "Création de site internet pour indépendants et PME",
    en: "Small business websites, built and looked after",
  },
  services: {
    fr: "Services : site internet, entretien et fiche Google",
    en: "Services: website, care and Google presence",
  },
  websiteCreation: {
    fr: "Création de site vitrine professionnel, prix affiché",
    en: "Small business website creation, price up front",
  },
  websiteCare: {
    fr: "Maintenance et hébergement de site web, e-mail compris",
    en: "Website maintenance and hosting, email included",
  },
  localSeo: {
    fr: "Référencement local : fiche Google Business et avis",
    en: "Local SEO: Google Business Profile and reviews",
  },
  pricing: {
    fr: "Tarifs : prix d'un site internet et formules mensuelles",
    en: "Pricing: website cost and monthly plans",
  },
  projects: {
    fr: "Projets : exemples de sites vitrines",
    en: "Projects: example small business websites",
  },
  blog: {
    fr: "Blog : conseils pour votre site internet",
    en: "Blog: advice for your small business website",
  },
  contact: {
    fr: "Contact : demander un devis de site internet",
    en: "Contact: request a website quote",
  },
  questionnaire: {
    fr: "Questionnaire de projet",
    en: "Project questionnaire",
  },
} satisfies Partial<Record<RouteId, Localized>>;

export const descriptions: Record<RouteId, Localized> = {
  home: {
    fr: "Site internet, e-mail professionnel et fiche Google pris en charge pour les indépendants et petites entreprises, à prix fixe.",
    en: "Website, professional email and Google profile taken care of for independents and small businesses, at a fixed price.",
  },
  services: {
    fr: "Création de site internet, entretien et référencement local pour indépendants et petites entreprises.",
    en: "Website creation, website care and local SEO for independents and small businesses.",
  },
  websiteCreation: {
    fr: "Création ou refonte de site vitrine pour indépendants et petites entreprises : textes rédigés pour vous, étapes validées une à une, prix affiché.",
    en: "A new business website or a redesign for independents and small businesses: text written for you, stages approved one by one, published price.",
  },
  websiteCare: {
    fr: "Maintenance et hébergement de site internet : sécurité, nom de domaine, adresse e-mail professionnelle et petites modifications, à prix fixe.",
    en: "Website maintenance and hosting: security, domain name, professional email address and small changes, at a fixed monthly price.",
  },
  localSeo: {
    fr: "Référencement local (SEO) : fiche Google, avis, annuaires et pages de votre site suivis chaque mois pour être trouvé sur Google et Google Maps.",
    en: "Local SEO: Google profile, reviews, directories and your site's pages adjusted so customers find you on Google and Google Maps.",
  },
  pricing: {
    fr: "Tarifs publics : création de site internet et formules mensuelles, sans surprise.",
    en: "Public prices: website creation and monthly plans, with no surprises.",
  },
  projects: {
    fr: "Exemples de sites internet et d'identités de marque signés UpInTown : boulangerie, dépannage, bien-être, création.",
    en: "Examples of websites and brand identities by UpInTown: a bakery, appliance repair, wellness and a creative agency.",
  },
  blog: {
    fr: "Conseils pratiques sur les sites internet, Google et l'e-mail professionnel pour les indépendants et petites entreprises.",
    en: "Practical advice on websites, Google and professional email for independents and small businesses.",
  },
  contact: {
    fr: `Site internet, e-mail ou présence sur Google : décrivez votre besoin, réponse sous ${workingDays(policies.inquiryReplyWorkingDays, "fr")}, puis un court appel gratuit.`,
    en: `Website, email or Google presence: describe what you need and get a reply within ${workingDays(policies.inquiryReplyWorkingDays, "en")}, then a short free call.`,
  },
  questionnaire: {
    fr: "Vos réponses servent de base à l'appel d'analyse et à la rédaction de vos textes.",
    en: "Your answers are the starting point for the analysis call and for writing your text.",
  },
  legalNotice: {
    fr: "Mentions légales du site upintown.dev : éditeur, numéro d'entreprise, hébergeur et contact.",
    en: "Legal notice for upintown.dev: publisher, company number, hosting provider and contact details.",
  },
  privacy: {
    fr: "Comment UpInTown traite vos données personnelles : ce qui est collecté, pourquoi, avec quels prestataires, et quels sont vos droits.",
    en: "How UpInTown handles your personal data: what is collected, why, with which providers, and what your rights are.",
  },
  terms: {
    fr: "Les conditions de prestation d'UpInTown : projets de site, formules mensuelles et traitement des données.",
    en: "UpInTown's terms of service: website projects, monthly plans and data processing.",
  },
};
