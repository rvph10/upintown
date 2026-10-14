import type { Localized } from "./i18n";
import { planById } from "./offer";

// Text for the decorative mocks. Fictional example business (a home physio), never presented as a real client.

export const processMocks = {
  fr: {
    you: "Vous",
    call: {
      asked: ["Bonjour, j'aimerais un site.", "On peut en parler ?"],
      replied: ["Avec plaisir !", "Demain à 10 h ?"],
    },
    text: {
      question: "Que faites-vous ?",
      answer: "Kiné à domicile",
      heading: "Votre kiné, directement chez vous.",
      approved: "Textes validés",
    },
    launch: {
      preview: "preview.upintown.dev",
      live: "votre-entreprise.be",
      publish: "Mettre en ligne",
      toast: "Votre site est en ligne",
    },
  },
  en: {
    you: "You",
    call: {
      asked: ["Hi, I'd like a website.", "Can we talk?"],
      replied: ["Happy to!", "Tomorrow at 10?"],
    },
    text: {
      question: "What do you do?",
      answer: "Home physio",
      heading: "Your physio, right at your door.",
      approved: "Text approved",
    },
    launch: {
      preview: "preview.upintown.dev",
      live: "your-business.com",
      publish: "Publish",
      toast: "Your site is live",
    },
  },
};

export const careMock = {
  fr: {
    address: "votre-entreprise.be",
    heading: "Votre kiné, directement chez vous.",
    hours: "Horaires",
    rows: [["Lun - Ven", "8 h - 18 h"]],
    change: { days: "Samedi", before: "Fermé", after: "9 h - 12 h" },
    request: "Pouvez-vous ajouter le samedi matin ?",
    reply: "C'est fait, c'est en ligne",
  },
  en: {
    address: "your-business.com",
    heading: "Your physio, right at your door.",
    hours: "Opening hours",
    rows: [["Mon - Fri", "8 am - 6 pm"]],
    change: { days: "Saturday", before: "Closed", after: "9 am - 12 pm" },
    request: "Could you add Saturday mornings?",
    reply: "Done, it's live",
  },
} satisfies Localized<{
  address: string;
  heading: string;
  hours: string;
  rows: [string, string][];
  change: { days: string; before: string; after: string };
  request: string;
  reply: string;
}>;

export const seoMock = {
  fr: { query: "kiné à domicile", name: "Kiné à domicile", address: "votre-entreprise.be", replied: "Réponse publiée" },
  en: { query: "home physio", name: "Home physio", address: "your-business.com", replied: "Reply posted" },
} satisfies Localized<{ query: string; name: string; address: string; replied: string }>;

export const emailMock = {
  fr: {
    address: "contact@votre-entreprise.be",
    active: "Adresse active",
    inbox: "Boîte de réception",
    messages: ["Demande de rendez-vous", "Question sur vos tarifs", "Merci pour la séance"],
  },
  en: {
    address: "contact@your-business.com",
    active: "Address active",
    inbox: "Inbox",
    messages: ["Appointment request", "Question about your prices", "Thanks for the session"],
  },
} satisfies Localized<{ address: string; active: string; inbox: string; messages: string[] }>;

const posts = planById("croissance").googlePostsPerMonth;

export const reportMock = {
  fr: {
    title: "Rapport du mois",
    searchesLabel: "Recherches qui mènent à votre site",
    searches: ["kiné à domicile", "kiné à domicile prix", "kiné après opération"],
    reviewed: "Analysée",
    adjusted: "Page ajustée",
    done: [`${posts} publications Google`, "Lien d'avis partagé"],
  },
  en: {
    title: "This month's report",
    searchesLabel: "Searches that lead to your site",
    searches: ["home physio", "home physio prices", "physio after surgery"],
    reviewed: "Reviewed",
    adjusted: "Page adjusted",
    done: [`${posts} Google posts`, "Review link shared"],
  },
} satisfies Localized<{
  title: string;
  searchesLabel: string;
  searches: string[];
  reviewed: string;
  adjusted: string;
  done: string[];
}>;
