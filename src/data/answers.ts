import type { Localized } from "./i18n";
import { planById, policies } from "./offer";

const essentiel = planById("essentiel");
const visibilite = planById("visibilite");
const croissance = planById("croissance");

/** FAQ answers repeated on several pages, so they change in one place. */
export const answers = {
  takeover: {
    fr: "Votre site est d'abord analysé gratuitement. Un site Wix ou Squarespace ne peut pas être déplacé ailleurs : il faut le refaire. Un site WordPress ou fait sur mesure peut parfois être repris, selon son état. Dans tous les cas, vous connaissez le prix avant de décider.",
    en: "Your site is reviewed first, free of charge. A Wix or Squarespace site can't be moved elsewhere, so it has to be rebuilt. A WordPress or custom-built site can sometimes be taken over, depending on its condition. Either way, you know the price before you decide.",
  },
  leaving: {
    fr: `Le nom de domaine, l'e-mail et la fiche Google sont à votre nom. Si vous partez, tout vous est remis sous ${policies.handoverDays} jours après votre demande écrite, factures réglées : le code du site, les réglages du domaine et l'accès complet à votre e-mail.`,
    en: `Your domain, email and Google profile are in your name. If you leave, everything is handed over within ${policies.handoverDays} days of your written request, once invoices are paid: the site's code, the domain settings and full access to your email.`,
  },
  commitment: {
    fr: `${essentiel.name.fr} et ${visibilite.name.fr} sont mensuels, avec ${policies.noticeMonths} mois de préavis. ${croissance.name.fr} demande ${croissance.minimumMonths} mois minimum, le temps que les résultats sur Google se construisent. Aucune formule n'est obligatoire après la création du site.`,
    en: `${essentiel.name.en} and ${visibilite.name.en} are monthly, with ${policies.noticeMonths} month's notice. ${croissance.name.en} has a ${croissance.minimumMonths}-month minimum, since Google results take time to build. No plan is required after your site is built.`,
  },
} satisfies Record<string, Localized>;
