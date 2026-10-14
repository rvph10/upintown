import { business, clientProcessors, legal } from "./business";
import { formatPrice, lowerFirst, workingDays, type Locale } from "./i18n";
import { contract, planById, plans, policies, website } from "./offer";
import { path } from "./routes";

/** A paragraph (may contain links) or a bulleted list. */
export type TermsBlock = string | { list: string[] };

export interface TermsSection {
  id: string;
  title: string;
  blocks: TermsBlock[];
}

export interface Terms {
  sections: TermsSection[];
  annex: { id: string; title: string; intro: string; sections: TermsSection[] };
}

const months = (count: number, locale: Locale) =>
  locale === "fr" ? `${count} mois` : `${count} month${count > 1 ? "s" : ""}`;
const days = (count: number, locale: Locale) => (locale === "fr" ? `${count} jours` : `${count} days`);
const weeks = (count: number, locale: Locale) =>
  locale === "fr" ? `${count} semaine${count > 1 ? "s" : ""}` : `${count} week${count > 1 ? "s" : ""}`;
const link = (href: string, text: string) => `<a href="${href}">${text}</a>`;

/** French spacing: a non-breaking space before : ; ! ? » and after «, so they never start or end a line alone. */
const frenchSpacing = (text: string) => text.replace(/ ([:;!?»])/g, "\u00a0$1").replace(/« /g, "«\u00a0");

function mapText(terms: Terms, fix: (text: string) => string): Terms {
  const section = (s: TermsSection): TermsSection => ({
    ...s,
    title: fix(s.title),
    blocks: s.blocks.map((block) => (typeof block === "string" ? fix(block) : { list: block.list.map(fix) })),
  });
  return {
    sections: terms.sections.map(section),
    annex: {
      ...terms.annex,
      title: fix(terms.annex.title),
      intro: fix(terms.annex.intro),
      sections: terms.annex.sections.map(section),
    },
  };
}

export function getTerms(locale: Locale): Terms {
  return locale === "fr" ? mapText(buildTerms(locale), frenchSpacing) : buildTerms(locale);
}

function buildTerms(locale: Locale): Terms {
  const c = contract;
  const d = (count: number) => days(count, locale);
  const m = (count: number) => months(count, locale);
  const w = (count: number) => weeks(count, locale);
  const price = (amount: number) => formatPrice(amount, locale);
  const planNames = plans.map((plan) => plan.name[locale]);
  const essential = planById("essentiel");
  const visibility = planById("visibilite");
  const growth = planById("croissance");
  const stages = website.stages.map((stage) => stage.name[locale]);
  const share = website.stages[0].share;
  const hourly = price(policies.hourlyRate);
  const address = `${legal.address.street}, ${legal.address.postalCode} ${legal.address.city}, ${legal.address.country[locale]}`;
  const site = link(path("home", locale), "upintown.dev");
  const privacy = path("privacy", locale);
  const processors = clientProcessors.map(
    (processor) =>
      `${processor.name} (${processor.country[locale]})${locale === "fr" ? " :" : ":"} ${lowerFirst(processor.purpose[locale])}`,
  );

  if (locale === "fr") {
    return {
      sections: [
        {
          id: "objet",
          title: "Qui sommes-nous",
          blocks: [
            `${business.name} est le nom commercial de ${legal.owner}, indépendant en personne physique, ${address}, numéro d'entreprise ${legal.companyNumber} (ci-après « ${business.name} »). Contact : ${link(`mailto:${business.email}`, business.email)}, ${business.phone.display}.`,
            `Ces conditions s'appliquent à toutes les prestations d'${business.name} : création de sites internet, formules mensuelles d'entretien et de visibilité, et travaux supplémentaires.`,
            `${business.name} travaille uniquement avec des professionnels (entreprises, indépendants, professions libérales) agissant pour leur activité (ci-après « le Client »). Les règles de protection des consommateurs ne s'appliquent donc pas.`,
            `Le contrat est formé par le devis accepté et ces conditions. En cas de contradiction, le devis l'emporte. Les conditions générales du Client ne s'appliquent pas, sauf accord écrit d'${business.name}.`,
          ],
        },
        {
          id: "devis",
          title: "Devis, acceptation et communication",
          blocks: [
            `Le premier appel de découverte est gratuit et sans engagement. Chaque devis précise la prestation, le prix et le lien vers ces conditions. Il est valable ${d(c.quoteValidDays)}.`,
            `Le Client accepte le devis et ces conditions de manière formelle : par une réponse écrite par e-mail (« J'accepte le devis et les conditions générales ») ou par la signature du devis.`,
            `Dans ces conditions, « par écrit » signifie par e-mail ou par message (WhatsApp compris). Une validation doit être explicite (par exemple « Je valide les textes ») et porter sur une version précise. Une réaction ou un emoji ne vaut pas validation.`,
            `${business.name} travaille du lundi au vendredi, hors jours fériés belges. Les délais en jours ouvrables suivent ce calendrier.`,
          ],
        },
        {
          id: "projets",
          title: "Projets de site internet",
          blocks: [
            `Un projet se déroule en ${stages.length} étapes, chacune facturée ${share} % du prix du devis :`,
            {
              list: [
                `${stages[0]} : questionnaire, appel d'analyse et liste des pages.`,
                `${stages[1]} : rédaction, puis validation écrite par le Client.`,
                `${stages[2]} : maquette de la page d'accueil avec les vrais textes, puis validation écrite.`,
                `${stages[3]} : construction du site, lien de prévisualisation, ${website.correctionRounds === 1 ? "une série" : `${website.correctionRounds} séries`} de corrections, puis mise en ligne.`,
              ],
            },
            `Les trois premières étapes commencent à la réception du paiement de leur facture. La facture de la dernière étape est envoyée quand le lien de prévisualisation est prêt, et le site est mis en ligne après son paiement. Chaque facture est envoyée à la validation de l'étape précédente et mentionne l'étape validée et sa date.`,
            `Avant l'appel d'analyse, le Client fournit son logo, ses éléments existants et le questionnaire complété. Les photos manquantes sont fournies avant l'étape ${stages[2]}.`,
            `Aucun fait n'est ajouté aux textes s'il n'a pas été fourni par le Client. Modifier les textes après leur validation est un travail supplémentaire.`,
            `La série de corrections couvre des ajustements (textes, images, espacements), pas un changement de structure ou de design déjà validé. Toute demande au-delà est facturée ${hourly} de l'heure, avec une estimation communiquée avant de commencer.`,
            `Les délais annoncés (en général ${website.weeks.min} à ${website.weeks.max} semaines) sont des estimations. Tout retard du Client (contenus, validations, accès) décale le planning d'autant.`,
            `Sans réponse du Client pendant ${d(c.projectPauseDays)}, le projet est mis en pause, avec un avis écrit. Sans réponse pendant ${d(c.projectAbandonDays)}, il est considéré comme abandonné : les étapes payées restent acquises, le travail déjà réalisé est remis au Client, et une reprise est traitée comme un nouveau projet.`,
            `Le Client peut arrêter un projet à tout moment par écrit. L'étape en cours, déjà payée, reste acquise, et il ne doit rien de plus.`,
            `Pour un Client sans formule mensuelle, ${business.name} corrige gratuitement pendant ${d(c.launchFixDays)} après la mise en ligne les erreurs qui viennent de son travail. Ensuite, les corrections sont facturées au tarif horaire. Aucune formule n'est obligatoire après la mise en ligne : le Client peut faire héberger son site ailleurs.`,
          ],
        },
        {
          id: "formules",
          title: "Formules mensuelles",
          blocks: [
            `Le contenu de chaque formule (${planNames.join(", ")}) est décrit sur ${site} et dans le devis.`,
            `Les petites modifications (textes, photos, horaires, prix) sont réalisées sous ${workingDays(policies.changeReplyWorkingDays, locale)}, sans limite de nombre. Une demande qui crée une nouvelle section, une nouvelle page ou une nouvelle fonctionnalité fait l'objet d'un devis séparé.`,
            `Les formules ${visibility.name.fr} et ${growth.name.fr} comprennent des frais de mise en place uniques de ${price(visibility.setupFee)}, dus aussi en passant de la formule ${essential.name.fr} à l'une d'elles.`,
            `Pour les professions sensibles, chaque réponse à un avis Google est approuvée par le Client avant publication.`,
            `Les résultats sur Google (classement, visites, appels) dépendent de nombreux facteurs extérieurs et se construisent sur plusieurs mois. Ils ne sont pas garantis. La surveillance permet en général de corriger une panne rapidement, sans que la disponibilité continue du site soit garantie.`,
            `Les formules sont facturées chaque mois par abonnement. Une montée en gamme s'applique immédiatement, au prorata. Une baisse s'applique à partir du mois suivant.`,
            `Les formules ${essential.name.fr} et ${visibility.name.fr} sont sans durée minimale. La formule ${growth.name.fr} a une durée minimale de ${m(growth.minimumMonths)}.`,
            `Le Client peut résilier sa formule par écrit, avec un préavis de ${m(policies.noticeMonths)}. L'abonnement prend fin à la fin de la période de facturation au cours de laquelle le préavis expire. ${business.name} peut mettre fin à une formule par écrit avec un préavis de ${m(c.planEndNoticeMonths)}, avec la remise complète prévue à l'article « Fin du contrat et départ ».`,
            `${business.name} peut annoncer, au moins ${w(c.reducedNoticeWeeks)} à l'avance, des périodes de délais allongés, pour un total de ${w(c.reducedWeeksPerYear)} par an au maximum. La surveillance du site et les urgences (site hors ligne, piratage) restent assurées.`,
            `Toute hausse de prix est annoncée par écrit ${m(c.priceNoticeMonths)} à l'avance. Le Client peut résilier sans frais avant son entrée en vigueur, y compris pendant la durée minimale de la formule ${growth.name.fr}.`,
          ],
        },
        {
          id: "paiement",
          title: "Prix, facturation et paiement",
          blocks: [
            `Les prix sont indiqués en euros et sont définitifs. ${legal.vatMention.fr}`,
            `Les factures d'étape suivent l'article « Projets de site internet ». Les autres factures (travail supplémentaire, tarif horaire) sont payables sous ${d(c.invoiceDueDays)}.`,
            `En cas de retard, la loi du 2 août 2002 concernant la lutte contre le retard de paiement dans les transactions commerciales s'applique : intérêts de retard au taux légal et indemnité forfaitaire de ${price(c.lateFeeIndemnity)} par facture. ${business.name} peut renoncer à les appliquer.`,
          ],
        },
        {
          id: "impayes",
          title: "Formule mensuelle impayée",
          blocks: [
            {
              list: [
                `En cas d'échec d'un paiement, le prestataire de paiement relance automatiquement et ${business.name} prévient le Client par écrit.`,
                `Après ${d(c.unpaidPauseDays)}, les demandes de modification sont mises en pause.`,
                `Après ${d(c.unpaidNoticeDays)}, ${business.name} envoie une mise en demeure écrite. Le Client dispose de ${d(c.unpaidGraceDays)} pour régulariser.`,
                `Sans paiement à l'issue de ce délai, le site est suspendu. Les boîtes e-mail ne sont jamais coupées. ${business.name} peut ensuite résilier la formule.`,
              ],
            },
            `Les données du Client restent récupérables selon l'article « Fin du contrat et départ », une fois les factures payées. Le nom de domaine est enregistré au nom du Client et n'est jamais retenu en cas de litige.`,
          ],
        },
        {
          id: "client",
          title: "Obligations du Client",
          blocks: [
            `Le Client garantit qu'il a le droit d'utiliser tout ce qu'il fournit (logo, photos, textes, marques) et prend en charge toute réclamation d'un tiers à ce sujet. Les images fournies par ${business.name} relèvent de sa responsabilité.`,
            `Une fois ses textes validés, le Client est responsable de leur contenu : exactitude, promesses commerciales et respect des règles de sa profession.`,
            `${business.name} met en place les pages légales du site à partir des informations fournies par le Client. ${business.name} ne fournit pas de conseil juridique : le Client reste responsable de leur exactitude et de sa propre conformité au RGPD.`,
            `Le Client fournit dans un délai raisonnable les contenus, validations et accès nécessaires (domaine, messagerie, fiche Google).`,
          ],
        },
        {
          id: "propriete",
          title: "Propriété et mention",
          blocks: [
            `Une fois le projet entièrement payé, le Client devient propriétaire de tout ce qui a été créé spécifiquement pour son site : design, textes, images créées pour lui et code de ses pages.`,
            `Pour les outils et composants réutilisables d'${business.name} intégrés au site, le Client reçoit une licence gratuite, définitive et sans restriction : il peut les utiliser, les modifier et les confier à un autre prestataire. ${business.name} garde le droit de les réutiliser pour d'autres projets. Les logiciels libres utilisés restent soumis à leur propre licence.`,
            `Le site comporte en bas de page une mention discrète « Conçu par ${business.name} », dans le style du site. Elle reste en place tant que le site conserve le design créé par ${business.name}. Le Client peut la retirer si le design est refait par un autre prestataire.`,
            `${business.name} ne cite le nom du Client, son site ou ses résultats comme référence qu'avec son accord écrit.`,
          ],
        },
        {
          id: "responsabilite",
          title: "Responsabilité",
          blocks: [
            `Si ${business.name} commet une erreur, elle la corrige gratuitement et en priorité. Si un service payé n'a pas fonctionné par sa faute, la période concernée est remboursée ou offerte.`,
            `Au-delà, la responsabilité d'${business.name} est limitée au total des montants payés par le Client au cours des ${m(c.liabilityMonths)} précédant le fait qui l'engage. Pour un projet de site seul, cela correspond au prix du projet. Cette limite ne s'applique pas en cas de faute grave ou intentionnelle.`,
            `${business.name} ne répond pas des dommages indirects (manque à gagner, perte de clients, atteinte à la réputation), ni des pannes de services tiers (hébergeur, messagerie, Google, paiement), ni des conséquences d'une intervention du Client ou d'un autre prestataire sur le site.`,
          ],
        },
        {
          id: "confidentialite",
          title: "Confidentialité et force majeure",
          blocks: [
            `Chaque partie garde confidentielles les informations non publiques reçues de l'autre (accès, données, informations commerciales), pendant le contrat et après sa fin.`,
            `Aucune partie n'est responsable d'un retard ou d'un manquement causé par un événement imprévisible et hors de son contrôle (panne majeure d'un fournisseur, catastrophe, maladie grave). Les délais sont suspendus pendant la durée de l'événement.`,
          ],
        },
        {
          id: "depart",
          title: "Fin du contrat et départ",
          blocks: [
            `Le Client peut demander par écrit la remise de son site et de ses accès. Une fois les factures payées, ${business.name} la réalise sous ${d(policies.handoverDays)} :`,
            {
              list: [
                "le code source et les fichiers du site ;",
                "la liste des enregistrements DNS ;",
                "l'accès administrateur à la messagerie ;",
                `le retrait des accès d'${business.name} à la fiche Google ;`,
                "l'export des statistiques.",
              ],
            },
            `Le Client est titulaire de son nom de domaine et propriétaire principal de sa messagerie et de sa fiche Google. ${business.name} n'en est que le gestionnaire ou le contact technique. Après la remise, ses données sont supprimées selon l'annexe.`,
            `${business.name} peut mettre fin au contrat sans préavis en cas de faute grave du Client : impayé selon l'article « Formule mensuelle impayée », comportement abusif ou contenu illégal. La remise reste due une fois les factures payées.`,
          ],
        },
        {
          id: "donnees",
          title: "Données personnelles",
          blocks: [
            `Pour sa propre gestion (devis, facturation, échanges), ${business.name} traite les données de ses Clients selon sa ${link(privacy, "politique de confidentialité")}.`,
            `Quand ${business.name} héberge le site ou la messagerie du Client, elle traite des données pour son compte, comme sous-traitant. L'accord de traitement des données en annexe fait partie du contrat.`,
          ],
        },
        {
          id: "modifications",
          title: "Modification des conditions",
          blocks: [
            `${business.name} peut modifier ces conditions. Les Clients avec une formule en cours sont prévenus par écrit ${m(c.termsNoticeMonths)} à l'avance et peuvent résilier sans frais avant l'entrée en vigueur. Un projet de site déjà accepté reste soumis à la version acceptée.`,
          ],
        },
        {
          id: "litiges",
          title: "Langue, droit applicable et litiges",
          blocks: [
            `Ces conditions existent en français et en anglais. En cas de différence, la version française fait foi. Le contrat est soumis au droit belge.`,
            `En cas de désaccord, les parties cherchent d'abord une solution à l'amiable pendant ${d(c.amicableDays)} à partir de la notification écrite du problème. À défaut, les tribunaux francophones de Bruxelles sont seuls compétents, y compris pour les Clients établis à l'étranger.`,
          ],
        },
      ],
      annex: {
        id: "annexe",
        title: "Annexe : accord de traitement des données",
        intro: `Cet accord applique l'article 28 du Règlement général sur la protection des données (RGPD). Le Client est le responsable du traitement, ${business.name} le sous-traitant.`,
        sections: [
          {
            id: "annexe-objet",
            title: "Objet et durée",
            blocks: [
              `${business.name} traite des données personnelles pour le compte du Client uniquement pour fournir ses prestations : hébergement du site, envoi des messages du formulaire de contact, gestion de la messagerie, statistiques de visite et gestion de la fiche Google. L'accord dure aussi longtemps que ces prestations.`,
            ],
          },
          {
            id: "annexe-donnees",
            title: "Données et personnes concernées",
            blocks: [
              {
                list: [
                  "Visiteurs du site : messages du formulaire de contact (nom, coordonnées, contenu) et statistiques de visite sans cookies.",
                  "Correspondants du Client : contenu des boîtes e-mail.",
                  "Auteurs d'avis Google : nom et contenu de l'avis, consultés pour y répondre.",
                ],
              },
              "Les messages du formulaire de contact sont seulement envoyés par e-mail au Client. Ils ne sont pas enregistrés sur le serveur.",
            ],
          },
          {
            id: "annexe-engagements",
            title: "Engagements",
            blocks: [
              `${business.name} :`,
              {
                list: [
                  "traite les données uniquement sur instruction écrite du Client, et le prévient si une instruction lui semble contraire au RGPD ;",
                  `garde les données confidentielles : seul ${legal.owner} y a accès ;`,
                  "applique les mesures de sécurité décrites ci-dessous ;",
                  "aide le Client, dans la mesure du possible, à répondre aux demandes des personnes concernées (accès, rectification, effacement) ;",
                  `prévient le Client par écrit dans les ${c.breachHours} heures après avoir découvert une violation de données, pour lui permettre de prévenir l'Autorité de protection des données dans le délai de 72 heures ;`,
                  "met à disposition du Client les informations nécessaires pour vérifier le respect de cet accord.",
                ],
              },
            ],
          },
          {
            id: "annexe-securite",
            title: "Sécurité",
            blocks: [
              {
                list: [
                  "Double authentification sur tous les comptes d'administration, avec clé physique pour l'hébergement, la messagerie et Google.",
                  "Accès au serveur par clé SSH uniquement, sans mot de passe.",
                  "Pare-feu qui n'expose que les ports web.",
                  "Mises à jour régulières du serveur et des sites.",
                  "HTTPS sur tous les sites.",
                  "Mots de passe conservés dans un gestionnaire de mots de passe.",
                ],
              },
            ],
          },
          {
            id: "annexe-sous-traitants",
            title: "Sous-traitants ultérieurs",
            blocks: [
              "Le Client autorise le recours aux sous-traitants suivants :",
              { list: processors },
              "Les transferts hors de l'Union européenne sont encadrés par les garanties prévues par le RGPD (clauses contractuelles types de la Commission européenne ou cadre de protection des données UE-États-Unis). Google (fiche d'établissement, Search Console) agit comme responsable de traitement indépendant pour ses propres services.",
              `${business.name} prévient le Client par écrit au moins ${m(c.subprocessorNoticeMonths)} avant tout ajout ou remplacement d'un sous-traitant. Le Client peut s'y opposer pour un motif légitime et, à défaut de solution, résilier sans frais.`,
            ],
          },
          {
            id: "annexe-fin",
            title: "Fin de l'accord",
            blocks: [
              `À la fin du contrat, ${business.name} remet les données au Client selon l'article « Fin du contrat et départ ». Elles sont ensuite supprimées de ses serveurs dans les ${d(c.deletionDays)}, et des sauvegardes dans les ${d(c.deletionDays)} suivants.`,
            ],
          },
        ],
      },
    };
  }

  return {
    sections: [
      {
        id: "about",
        title: "Who we are",
        blocks: [
          `${business.name} is the trade name of ${legal.owner}, a sole trader, ${address}, company number ${legal.companyNumber} ("${business.name}"). Contact: ${link(`mailto:${business.email}`, business.email)}, ${business.phone.display}.`,
          `These terms apply to all ${business.name} services: website creation, monthly care and visibility plans, and additional work.`,
          `${business.name} works only with professionals (companies, sole traders, liberal professions) acting for their business ("the Client"). Consumer protection rules therefore do not apply.`,
          `The contract is made up of the accepted quote and these terms. If they conflict, the quote prevails. The Client's own terms do not apply unless ${business.name} agrees in writing.`,
        ],
      },
      {
        id: "quotes",
        title: "Quotes, acceptance and communication",
        blocks: [
          `The first discovery call is free and without commitment. Each quote states the service, the price and the link to these terms. It is valid for ${d(c.quoteValidDays)}.`,
          `The Client accepts the quote and these terms formally: by replying by email ("I accept the quote and the terms of service") or by signing the quote.`,
          `In these terms, "in writing" means by email or by message (WhatsApp included). An approval must be explicit (for example "I approve the text") and refer to a specific version. A reaction or an emoji is not an approval.`,
          `${business.name} works Monday to Friday, excluding Belgian public holidays. Deadlines in working days follow this calendar.`,
        ],
      },
      {
        id: "projects",
        title: "Website projects",
        blocks: [
          `A project runs in ${stages.length} stages, each invoiced at ${share}% of the quoted price:`,
          {
            list: [
              `${stages[0]}: questionnaire, analysis call and page list.`,
              `${stages[1]}: writing, then written approval by the Client.`,
              `${stages[2]}: homepage mockup with the real text, then written approval.`,
              `${stages[3]}: building the site, preview link, ${website.correctionRounds === 1 ? "one round" : `${website.correctionRounds} rounds`} of corrections, then launch.`,
            ],
          },
          `The first three stages start once their invoice is paid. The invoice for the last stage is sent when the preview link is ready, and the site goes live once it is paid. Each invoice is sent when the previous stage is approved and states which stage was approved and when.`,
          `Before the analysis call, the Client provides their logo, existing materials and the completed questionnaire. Missing photos are provided before the ${stages[2]} stage.`,
          `No fact is added to the text unless the Client provided it. Changing the text after approval is additional work.`,
          `The correction round covers adjustments (text, images, spacing), not a change to an approved structure or design. Anything beyond that is billed at ${hourly} an hour, with an estimate given before starting.`,
          `Announced timelines (usually ${website.weeks.min} to ${website.weeks.max} weeks) are estimates. Any delay on the Client's side (content, approvals, access) shifts the schedule accordingly.`,
          `With no response from the Client for ${d(c.projectPauseDays)}, the project is paused with written notice. With no response for ${d(c.projectAbandonDays)}, it is considered abandoned: paid stages are kept, the work done so far is handed to the Client, and a restart is treated as a new project.`,
          `The Client may stop a project at any time in writing. The current stage, already paid, is kept and nothing more is owed.`,
          `For a Client without a monthly plan, ${business.name} fixes errors caused by its work free of charge for ${d(c.launchFixDays)} after launch. After that, fixes are billed at the hourly rate. No plan is required after launch: the Client may host the site elsewhere.`,
        ],
      },
      {
        id: "plans",
        title: "Monthly plans",
        blocks: [
          `The content of each plan (${planNames.join(", ")}) is described on ${site} and in the quote.`,
          `Small changes (text, photos, opening hours, prices) are made within ${workingDays(policies.changeReplyWorkingDays, locale)}, with no limit on their number. A request that creates a new section, page or feature is quoted separately.`,
          `The ${visibility.name.en} and ${growth.name.en} plans include a one-off setup fee of ${price(visibility.setupFee)}, also due when moving up from the ${essential.name.en} plan.`,
          `For sensitive professions, each reply to a Google review is approved by the Client before it is posted.`,
          `Results on Google (ranking, visits, calls) depend on many outside factors and build over several months. They are not guaranteed. Monitoring usually allows an outage to be fixed quickly, but continuous availability of the site is not guaranteed.`,
          `Plans are billed monthly by subscription. Moving to a higher plan applies immediately, prorated. Moving to a lower plan applies from the next month.`,
          `The ${essential.name.en} and ${visibility.name.en} plans have no minimum term. The ${growth.name.en} plan has a minimum term of ${m(growth.minimumMonths)}.`,
          `The Client may cancel a plan in writing with ${m(policies.noticeMonths)} notice. The subscription ends at the end of the billing period in which the notice expires. ${business.name} may end a plan in writing with ${m(c.planEndNoticeMonths)} notice, with the full handover described under "Ending and leaving".`,
          `${business.name} may announce, at least ${w(c.reducedNoticeWeeks)} ahead, periods of longer response times, up to ${w(c.reducedWeeksPerYear)} a year in total. Site monitoring and emergencies (site down, hacked) remain covered.`,
          `Any price increase is announced in writing ${m(c.priceNoticeMonths)} ahead. The Client may cancel free of charge before it takes effect, including during the ${growth.name.en} minimum term.`,
        ],
      },
      {
        id: "payment",
        title: "Prices, invoicing and payment",
        blocks: [
          `Prices are in euros and final. ${legal.vatMention.en}`,
          `Stage invoices follow the "Website projects" section. Other invoices (additional work, hourly work) are due within ${d(c.invoiceDueDays)}.`,
          `Late payment is governed by the Belgian law of 2 August 2002 on combating late payment in commercial transactions: late interest at the legal rate and a flat indemnity of ${price(c.lateFeeIndemnity)} per invoice. ${business.name} may choose not to apply them.`,
        ],
      },
      {
        id: "unpaid",
        title: "Unpaid monthly plan",
        blocks: [
          {
            list: [
              `If a payment fails, the payment provider retries automatically and ${business.name} informs the Client in writing.`,
              `After ${d(c.unpaidPauseDays)}, change requests are paused.`,
              `After ${d(c.unpaidNoticeDays)}, ${business.name} sends a formal written notice. The Client has ${d(c.unpaidGraceDays)} to pay.`,
              `Without payment by then, the site is suspended. Mailboxes are never cut off. ${business.name} may then end the plan.`,
            ],
          },
          `The Client's data remains available under "Ending and leaving" once invoices are paid. The domain name is registered in the Client's name and is never withheld in a dispute.`,
        ],
      },
      {
        id: "client",
        title: "Client obligations",
        blocks: [
          `The Client guarantees they have the right to use everything they provide (logo, photos, text, trademarks) and handles any third-party claim about it. Images supplied by ${business.name} are its own responsibility.`,
          `Once the text is approved, the Client is responsible for its content: accuracy, commercial claims and compliance with the rules of their profession.`,
          `${business.name} sets up the site's legal pages from information provided by the Client. ${business.name} does not give legal advice: the Client remains responsible for their accuracy and for their own GDPR compliance.`,
          `The Client provides the content, approvals and access needed (domain, email, Google profile) within a reasonable time.`,
        ],
      },
      {
        id: "ownership",
        title: "Ownership and credit",
        blocks: [
          `Once the project is fully paid, the Client owns everything created specifically for their site: design, text, images made for them and the code of their pages.`,
          `For the reusable tools and components of ${business.name} built into the site, the Client receives a free, perpetual and unrestricted licence: they may use them, change them and hand them to another provider. ${business.name} keeps the right to reuse them in other projects. Open source software used remains under its own licence.`,
          `The site carries a discreet "Designed by ${business.name}" credit in the footer, in the site's style. It stays as long as the site keeps the design created by ${business.name}. The Client may remove it if the design is redone by another provider.`,
          `${business.name} names the Client, their site or their results as a reference only with their written consent.`,
        ],
      },
      {
        id: "liability",
        title: "Liability",
        blocks: [
          `If ${business.name} makes a mistake, it fixes it free of charge and as a priority. If a paid service did not work through its fault, the period concerned is refunded or not charged.`,
          `Beyond that, the liability of ${business.name} is limited to the total amounts paid by the Client in the ${m(c.liabilityMonths)} before the event giving rise to it. For a website project alone, this is the price of the project. This limit does not apply to gross or intentional misconduct.`,
          `${business.name} is not liable for indirect damage (lost revenue, lost clients, harm to reputation), for outages of third-party services (hosting, email, Google, payment), or for the consequences of changes made to the site by the Client or another provider.`,
        ],
      },
      {
        id: "confidentiality",
        title: "Confidentiality and force majeure",
        blocks: [
          `Each party keeps confidential the non-public information received from the other (access, data, business information), during the contract and after it ends.`,
          `Neither party is liable for a delay or failure caused by an unforeseeable event beyond its control (major supplier outage, disaster, serious illness). Deadlines are suspended for the duration of the event.`,
        ],
      },
      {
        id: "leaving",
        title: "Ending and leaving",
        blocks: [
          `The Client may request the handover of their site and access in writing. Once invoices are paid, ${business.name} completes it within ${d(policies.handoverDays)}:`,
          {
            list: [
              "source code and site files;",
              "the list of DNS records;",
              "administrator access to the email service;",
              `removal of ${business.name}'s access to the Google profile;`,
              "an export of the statistics.",
            ],
          },
          `The Client is the holder of their domain name and the primary owner of their email service and Google profile. ${business.name} only manages them or acts as technical contact. After the handover, their data is deleted as described in the annex.`,
          `${business.name} may end the contract without notice in case of serious breach by the Client: non-payment as described under "Unpaid monthly plan", abusive behaviour or illegal content. The handover remains due once invoices are paid.`,
        ],
      },
      {
        id: "data",
        title: "Personal data",
        blocks: [
          `For its own administration (quotes, invoicing, communication), ${business.name} processes its Clients' data under its ${link(privacy, "privacy policy")}.`,
          `When ${business.name} hosts the Client's site or email, it processes data on the Client's behalf as a processor. The data processing agreement in the annex is part of the contract.`,
        ],
      },
      {
        id: "changes",
        title: "Changes to these terms",
        blocks: [
          `${business.name} may change these terms. Clients with an active plan are informed in writing ${m(c.termsNoticeMonths)} ahead and may cancel free of charge before the change takes effect. A website project already accepted stays under the version accepted.`,
        ],
      },
      {
        id: "disputes",
        title: "Language, governing law and disputes",
        blocks: [
          `These terms exist in French and English. If they differ, the French version prevails. The contract is governed by Belgian law.`,
          `In case of disagreement, the parties first seek an amicable solution for ${d(c.amicableDays)} from written notice of the problem. Failing that, the French-speaking courts of Brussels have exclusive jurisdiction, including for Clients established abroad.`,
        ],
      },
    ],
    annex: {
      id: "annex",
      title: "Annex: data processing agreement",
      intro: `This agreement applies Article 28 of the General Data Protection Regulation (GDPR). The Client is the controller, ${business.name} the processor.`,
      sections: [
        {
          id: "annex-scope",
          title: "Subject and duration",
          blocks: [
            `${business.name} processes personal data on the Client's behalf only to provide its services: site hosting, delivery of contact form messages, email management, visit statistics and Google profile management. The agreement lasts as long as these services.`,
          ],
        },
        {
          id: "annex-data",
          title: "Data and data subjects",
          blocks: [
            {
              list: [
                "Site visitors: contact form messages (name, contact details, content) and cookieless visit statistics.",
                "The Client's correspondents: mailbox content.",
                "Google review authors: name and review content, read in order to reply.",
              ],
            },
            "Contact form messages are only sent by email to the Client. They are not stored on the server.",
          ],
        },
        {
          id: "annex-commitments",
          title: "Commitments",
          blocks: [
            `${business.name}:`,
            {
              list: [
                "processes data only on the Client's written instructions, and tells the Client if an instruction seems to breach the GDPR;",
                `keeps the data confidential: only ${legal.owner} has access to it;`,
                "applies the security measures described below;",
                "helps the Client, as far as possible, to answer requests from data subjects (access, rectification, erasure);",
                `informs the Client in writing within ${c.breachHours} hours of discovering a personal data breach, so the Client can notify the Data Protection Authority within 72 hours;`,
                "makes available to the Client the information needed to check compliance with this agreement.",
              ],
            },
          ],
        },
        {
          id: "annex-security",
          title: "Security",
          blocks: [
            {
              list: [
                "Two-factor authentication on all admin accounts, with a hardware key for hosting, email and Google.",
                "Server access by SSH key only, no passwords.",
                "Firewall exposing only web ports.",
                "Regular updates of the server and sites.",
                "HTTPS on all sites.",
                "Passwords kept in a password manager.",
              ],
            },
          ],
        },
        {
          id: "annex-subprocessors",
          title: "Subprocessors",
          blocks: [
            "The Client authorises the use of the following subprocessors:",
            { list: processors },
            "Transfers outside the European Union are covered by the safeguards provided by the GDPR (European Commission standard contractual clauses or the EU-US Data Privacy Framework). Google (Business Profile, Search Console) acts as an independent controller for its own services.",
            `${business.name} informs the Client in writing at least ${m(c.subprocessorNoticeMonths)} before adding or replacing a subprocessor. The Client may object on legitimate grounds and, if no solution is found, cancel free of charge.`,
          ],
        },
        {
          id: "annex-end",
          title: "End of the agreement",
          blocks: [
            `When the contract ends, ${business.name} hands the data to the Client as described under "Ending and leaving". It is then deleted from its servers within ${d(c.deletionDays)}, and from backups within the following ${d(c.deletionDays)}.`,
          ],
        },
      ],
    },
  };
}
