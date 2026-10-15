import type { Localized } from "./i18n";

/** Project questionnaire for website clients, sent once the planning stage is paid and before the analysis call. */

export type QuestionKind = "text" | "email" | "tel" | "url" | "long" | "choice";

export type Question = {
  id: string;
  kind: QuestionKind;
  label: Localized;
  hint?: Localized;
  placeholder?: Localized;
  required?: boolean;
  options?: readonly { value: string; label: Localized }[];
  autocomplete?: string;
  /** Rows of a long answer. */
  rows?: number;
};

export type QuestionnaireSection = {
  id: string;
  title: Localized;
  intro?: Localized;
  questions: readonly Question[];
};

const unsure = { value: "unsure", label: { fr: "Je ne sais pas", en: "I don't know" } };

export const questionnaire: readonly QuestionnaireSection[] = [
  {
    id: "about",
    title: { fr: "Vous et votre entreprise", en: "You and your business" },
    questions: [
      {
        id: "contactName",
        kind: "text",
        label: { fr: "Votre nom", en: "Your name" },
        placeholder: { fr: "Marie Dupont", en: "Jane Smith" },
        autocomplete: "name",
        required: true,
      },
      {
        id: "email",
        kind: "email",
        label: { fr: "E-mail", en: "Email" },
        placeholder: { fr: "marie@entreprise.be", en: "jane@company.com" },
        autocomplete: "email",
        required: true,
      },
      {
        id: "phone",
        kind: "tel",
        label: { fr: "Téléphone", en: "Phone" },
        placeholder: { fr: "+32 470 12 34 56", en: "+44 7700 900123" },
        autocomplete: "tel",
      },
      {
        id: "businessName",
        kind: "text",
        label: { fr: "Nom de l'entreprise", en: "Business name" },
        hint: { fr: "Tel que vos clients le connaissent.", en: "As your clients know it." },
        autocomplete: "organization",
        required: true,
      },
      {
        id: "legalName",
        kind: "text",
        label: { fr: "Dénomination légale", en: "Legal name" },
        hint: { fr: "Si elle est différente du nom ci-dessus.", en: "If it differs from the name above." },
      },
      {
        id: "companyNumber",
        kind: "text",
        label: { fr: "Numéro d'entreprise ou de TVA", en: "Company or VAT number" },
        hint: { fr: "Pour les mentions légales du site.", en: "For the site's legal notice." },
      },
      {
        id: "channel",
        kind: "choice",
        label: { fr: "Comment préférez-vous être contacté ?", en: "How do you prefer to be contacted?" },
        options: [
          { value: "email", label: { fr: "E-mail", en: "Email" } },
          { value: "whatsapp", label: { fr: "WhatsApp", en: "WhatsApp" } },
          { value: "phone", label: { fr: "Téléphone", en: "Phone" } },
        ],
      },
      {
        id: "address",
        kind: "long",
        rows: 2,
        label: { fr: "Adresse du siège", en: "Registered address" },
        hint: {
          fr: "Pour les mentions légales. Vous choisirez plus bas si elle est affichée sur le site.",
          en: "For the legal notice. You choose further down whether it is shown on the site.",
        },
        autocomplete: "street-address",
      },
    ],
  },
  {
    id: "business",
    title: { fr: "Votre activité", en: "What you do" },
    questions: [
      {
        id: "pitch",
        kind: "long",
        rows: 3,
        label: { fr: "Votre activité en une ou deux phrases", en: "Your business in one or two sentences" },
        hint: { fr: "Comme vous l'expliqueriez à un ami.", en: "The way you would explain it to a friend." },
        required: true,
      },
      {
        id: "services",
        kind: "long",
        rows: 6,
        label: { fr: "Vos services ou produits", en: "Your services or products" },
        hint: {
          fr: "Pour chacun : ce qu'il comprend, pour qui, et son prix si vous voulez l'afficher.",
          en: "For each one: what it includes, who it is for, and its price if you want it shown.",
        },
        required: true,
      },
      {
        id: "focus",
        kind: "long",
        rows: 3,
        label: { fr: "Le service que vous aimeriez vendre davantage", en: "The service you would like to sell more" },
      },
      {
        id: "notDone",
        kind: "long",
        rows: 3,
        label: { fr: "Ce que vous ne faites pas", en: "What you don't do" },
        hint: {
          fr: "Ce qu'on vous demande souvent mais que vous refusez. Le dire évite les mauvaises demandes.",
          en: "What people often ask for but you turn down. Saying so avoids the wrong requests.",
        },
      },
      {
        id: "background",
        kind: "long",
        rows: 3,
        label: { fr: "Votre parcours", en: "Your background" },
        hint: {
          fr: "Depuis quand vous exercez, votre formation, ce qui vous a amené à ce métier.",
          en: "How long you have been doing this, your training, what led you to it.",
        },
      },
    ],
  },
  {
    id: "clients",
    title: { fr: "Vos clients", en: "Your clients" },
    questions: [
      {
        id: "idealClient",
        kind: "long",
        rows: 3,
        label: { fr: "Vos clients idéaux", en: "Your ideal clients" },
        hint: {
          fr: "Particuliers ou entreprises, secteur, situation, ce qui les amène chez vous.",
          en: "Individuals or businesses, sector, situation, what brings them to you.",
        },
        required: true,
      },
      {
        id: "area",
        kind: "text",
        label: { fr: "Où travaillez-vous ?", en: "Where do you work?" },
        placeholder: { fr: "Bruxelles et Brabant wallon, à distance…", en: "London and Surrey, remotely…" },
      },
      {
        id: "discovery",
        kind: "text",
        label: { fr: "Comment vos clients vous trouvent-ils ?", en: "How do clients find you today?" },
        placeholder: { fr: "Bouche-à-oreille, Google, Instagram…", en: "Word of mouth, Google, Instagram…" },
      },
      {
        id: "questions",
        kind: "long",
        rows: 4,
        label: {
          fr: "Les questions que vos clients posent avant d'acheter",
          en: "The questions clients ask before buying",
        },
        hint: { fr: "Elles deviendront les questions fréquentes du site.", en: "They will become the site's FAQ." },
      },
      {
        id: "hesitations",
        kind: "long",
        rows: 3,
        label: { fr: "Ce qui les fait hésiter", en: "What makes them hesitate" },
        placeholder: {
          fr: "Le prix, le délai, la peur de se tromper…",
          en: "The price, the timing, fear of making the wrong choice…",
        },
      },
      {
        id: "whyYou",
        kind: "long",
        rows: 3,
        label: { fr: "Pourquoi vos clients vous choisissent", en: "Why clients choose you" },
        hint: {
          fr: "Si possible avec leurs mots : une phrase entendue, un message reçu.",
          en: "In their words if possible: something they said, a message they sent.",
        },
      },
      {
        id: "competitors",
        kind: "long",
        rows: 3,
        label: { fr: "Vos concurrents", en: "Your competitors" },
        hint: {
          fr: "Leur nom ou leur site, et ce qui vous distingue d'eux.",
          en: "Their name or website, and what sets you apart.",
        },
      },
    ],
  },
  {
    id: "goal",
    title: { fr: "Le rôle du site", en: "What the site is for" },
    questions: [
      {
        id: "mainAction",
        kind: "choice",
        label: { fr: "Que doit faire un visiteur en priorité ?", en: "What should a visitor do first?" },
        options: [
          { value: "call", label: { fr: "Appeler", en: "Call" } },
          { value: "whatsapp", label: { fr: "Écrire sur WhatsApp", en: "Message on WhatsApp" } },
          { value: "form", label: { fr: "Remplir un formulaire", en: "Fill in a form" } },
          { value: "booking", label: { fr: "Réserver en ligne", en: "Book online" } },
          { value: "visit", label: { fr: "Venir sur place", en: "Visit in person" } },
          unsure,
        ],
        required: true,
      },
      {
        id: "success",
        kind: "long",
        rows: 3,
        label: {
          fr: "Dans six mois, à quoi verrez-vous que le site fonctionne ?",
          en: "In six months, how will you know the site works?",
        },
        placeholder: {
          fr: "Plus d'appels, moins de questions répétées, des clients mieux informés…",
          en: "More calls, fewer repeated questions, better informed clients…",
        },
      },
      {
        id: "mustHave",
        kind: "long",
        rows: 3,
        label: { fr: "Ce que le site doit absolument contenir", en: "What the site must include" },
        hint: {
          fr: "Pages, informations, fonctions. La liste des pages est fixée ensemble pendant l'appel.",
          en: "Pages, information, features. The page list is set together during the call.",
        },
      },
    ],
  },
  {
    id: "proof",
    title: { fr: "Vos preuves", en: "What backs you up" },
    intro: {
      fr: "Rien n'est publié sans venir de vous. Indiquez seulement ce que vous pouvez confirmer.",
      en: "Nothing is published unless it comes from you. Only list what you can confirm.",
    },
    questions: [
      {
        id: "credentials",
        kind: "long",
        rows: 3,
        label: { fr: "Diplômes, agréments, certifications", en: "Qualifications, licences, certifications" },
        hint: { fr: "Fédérations ou ordres professionnels compris.", en: "Professional bodies included." },
      },
      {
        id: "figures",
        kind: "long",
        rows: 3,
        label: { fr: "Des chiffres que vous pouvez confirmer", en: "Figures you can confirm" },
        placeholder: {
          fr: "Années d'expérience, nombre de clients ou de projets…",
          en: "Years of experience, number of clients or projects…",
        },
      },
      {
        id: "reviews",
        kind: "url",
        label: { fr: "Lien vers vos avis en ligne", en: "Link to your online reviews" },
        placeholder: { fr: "https://g.page/…", en: "https://g.page/…" },
      },
      {
        id: "testimonials",
        kind: "long",
        rows: 4,
        label: { fr: "Témoignages de clients", en: "Client testimonials" },
        hint: {
          fr: "Précisez pour chacun si le client accepte d'être cité, avec son nom ou ses initiales.",
          en: "For each one, say whether the client agrees to be quoted, by name or initials.",
        },
      },
    ],
  },
  {
    id: "practical",
    title: { fr: "Infos pratiques", en: "Practical details" },
    questions: [
      {
        id: "hours",
        kind: "long",
        rows: 3,
        label: { fr: "Horaires", en: "Opening hours" },
        placeholder: { fr: "Du lundi au vendredi, de 9 h à 18 h", en: "Monday to Friday, 9am to 6pm" },
      },
      {
        id: "showAddress",
        kind: "choice",
        label: { fr: "Afficher votre adresse sur le site ?", en: "Show your address on the site?" },
        options: [
          { value: "yes", label: { fr: "Oui", en: "Yes" } },
          { value: "no", label: { fr: "Non, seulement la zone", en: "No, only the area" } },
          unsure,
        ],
      },
      {
        id: "publicContact",
        kind: "long",
        rows: 2,
        label: { fr: "Téléphone et e-mail à afficher", en: "Phone and email to show" },
        hint: { fr: "S'ils diffèrent de ceux donnés plus haut.", en: "If they differ from the ones above." },
      },
      {
        id: "tools",
        kind: "text",
        label: { fr: "Outils de réservation ou de paiement", en: "Booking or payment tools" },
        placeholder: { fr: "Calendly, Planity, Stripe…", en: "Calendly, Fresha, Stripe…" },
      },
      {
        id: "social",
        kind: "long",
        rows: 3,
        label: { fr: "Vos réseaux sociaux", en: "Your social media" },
        hint: { fr: "Les liens à afficher sur le site.", en: "The links to show on the site." },
      },
    ],
  },
  {
    id: "style",
    title: { fr: "Image et ton", en: "Look and tone" },
    questions: [
      {
        id: "logo",
        kind: "choice",
        label: { fr: "Avez-vous un logo ?", en: "Do you have a logo?" },
        options: [
          { value: "files", label: { fr: "Oui, avec les fichiers", en: "Yes, with the files" } },
          { value: "image", label: { fr: "Oui, en image seulement", en: "Yes, only as an image" } },
          { value: "none", label: { fr: "Non", en: "No" } },
        ],
      },
      {
        id: "tone",
        kind: "choice",
        label: { fr: "Comment s'adresser aux visiteurs ?", en: "How should the site speak to visitors?" },
        options: [
          { value: "formal", label: { fr: "Vouvoiement", en: "Formal" } },
          { value: "casual", label: { fr: "Tutoiement", en: "Friendly" } },
          unsure,
        ],
      },
      {
        id: "brand",
        kind: "text",
        label: { fr: "Couleurs ou polices à respecter", en: "Colours or fonts to keep" },
      },
      {
        id: "words",
        kind: "text",
        label: { fr: "Trois mots qui décrivent votre entreprise", en: "Three words that describe your business" },
      },
      {
        id: "references",
        kind: "long",
        rows: 4,
        label: { fr: "Des sites que vous aimez, ou pas", en: "Websites you like, or don't" },
        hint: {
          fr: "Avec le lien et la raison. Pas forcément dans votre secteur.",
          en: "With the link and the reason. Not necessarily in your field.",
        },
      },
    ],
  },
  {
    id: "existing",
    title: { fr: "Ce qui existe déjà", en: "What you already have" },
    intro: {
      fr: "N'écrivez jamais de mot de passe ici. Les accès sont organisés pendant l'appel.",
      en: "Never write a password here. Access is arranged during the call.",
    },
    questions: [
      {
        id: "currentSite",
        kind: "url",
        label: { fr: "Site actuel", en: "Current website" },
        placeholder: { fr: "https://", en: "https://" },
      },
      {
        id: "domain",
        kind: "text",
        label: { fr: "Nom de domaine et où il est enregistré", en: "Domain name and where it is registered" },
        hint: {
          fr: "Laissez vide si vous n'en avez pas ou ne savez pas.",
          en: "Leave empty if you have none or don't know.",
        },
        placeholder: { fr: "dupont.be chez OVH", en: "smith.co.uk at GoDaddy" },
      },
      {
        id: "emailProvider",
        kind: "text",
        label: { fr: "Où sont vos e-mails aujourd'hui ?", en: "Where is your email today?" },
        placeholder: { fr: "Gmail, Outlook, chez votre hébergeur…", en: "Gmail, Outlook, with your host…" },
      },
      {
        id: "googleProfile",
        kind: "choice",
        label: {
          fr: "Avez-vous une fiche Google (Google Business Profile) ?",
          en: "Do you have a Google Business Profile?",
        },
        options: [
          { value: "yes", label: { fr: "Oui", en: "Yes" } },
          { value: "no", label: { fr: "Non", en: "No" } },
          unsure,
        ],
      },
      {
        id: "existingContent",
        kind: "long",
        rows: 3,
        label: { fr: "Textes ou documents à reprendre", en: "Text or documents to reuse" },
        hint: {
          fr: "Brochure, ancien site, présentation. Les fichiers vont dans le dossier partagé.",
          en: "Brochure, old site, presentation. Files go in the shared folder.",
        },
      },
    ],
  },
  {
    id: "rules",
    title: { fr: "Règles de votre métier", en: "Your profession's rules" },
    questions: [
      {
        id: "professionRules",
        kind: "long",
        rows: 4,
        label: { fr: "Règles à respecter sur votre site", en: "Rules your site must follow" },
        hint: {
          fr: "Mentions obligatoires, règles de votre ordre ou fédération sur la publicité, titres protégés. Laissez vide si rien ne s'applique.",
          en: "Mandatory mentions, your professional body's advertising rules, protected titles. Leave empty if none apply.",
        },
      },
    ],
  },
  {
    id: "timing",
    title: { fr: "Calendrier", en: "Timing" },
    questions: [
      {
        id: "approver",
        kind: "text",
        label: { fr: "Qui relit et valide ?", en: "Who reviews and approves?" },
        hint: {
          fr: "Une seule personne donne l'accord final. Laissez vide si c'est vous.",
          en: "One person gives the final approval. Leave empty if it is you.",
        },
      },
      {
        id: "deadline",
        kind: "text",
        label: { fr: "Une date à respecter ?", en: "A date to keep in mind?" },
        placeholder: { fr: "Ouverture, salon, rentrée…", en: "Opening, trade fair, new season…" },
      },
      {
        id: "absences",
        kind: "text",
        label: { fr: "Des absences prévues ?", en: "Any planned time off?" },
        hint: { fr: "Pour planifier les validations.", en: "To plan the approvals." },
      },
      {
        id: "notes",
        kind: "long",
        rows: 4,
        label: { fr: "Autre chose à ajouter ?", en: "Anything else?" },
      },
    ],
  },
];

export const questions = questionnaire.flatMap((section) => section.questions);

/** Character limits: a long answer leaves room for a list of services, a short one for a name or a link. */
export const answerLimit = (question: Question) => (question.kind === "long" ? 4000 : 300);
