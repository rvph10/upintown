import type { Localized } from "./i18n";

export interface Testimonial {
  /** Short theme of the review, shown above the quote and in the picker. */
  topic: string;
  /** Real client words. */
  quote: string;
  /** Changed name, never the client's real one. */
  name: string;
  sector: string;
}

export const testimonials: Localized<Testimonial[]> = {
  fr: [
    {
      topic: "Approche personnelle",
      quote:
        "Ce que j'ai le plus apprécié, c'est l'approche personnelle. La communication était directe, mes questions recevaient des réponses claires et j'ai senti que les besoins de mon activité étaient vraiment pris en compte.",
      name: "Sophie L.",
      sector: "Profession libérale",
    },
    {
      topic: "Textes rédigés pour vous",
      quote:
        "Rédiger les textes de mon site, je le repoussais sans cesse : je ne savais pas par où commencer. Être aidée pour transformer mes services en textes clairs et bien structurés a rendu tout le projet beaucoup plus simple.",
      name: "Nadia B.",
      sector: "Indépendante",
    },
    {
      topic: "Un seul interlocuteur",
      quote:
        "J'ai apprécié d'avoir un seul interlocuteur du début à la fin du projet. La communication était plus simple et le travail restait centré sur nos priorités.",
      name: "Claire M.",
      sector: "Entrepreneuse",
    },
    {
      topic: "Un processus clair",
      quote:
        "Tout le processus était organisé et facile à suivre. Tout était expliqué simplement, sans jargon technique. Je savais toujours où on en était et quelle était la prochaine étape.",
      name: "Marc D.",
      sector: "Entreprise de services",
    },
    {
      topic: "E-mail professionnel",
      quote:
        "Une adresse e-mail professionnelle, c'est un petit changement, mais mon entreprise paraît beaucoup plus établie. Tout a été configuré pour moi, je n'ai pas eu à m'occuper de la partie technique.",
      name: "Julien R.",
      sector: "Indépendant",
    },
    {
      topic: "Entretien du site",
      quote:
        "C'est un soulagement de savoir que mon site est entretenu. Je m'inquiète beaucoup moins des mises à jour, de la sécurité ou des problèmes techniques, et je peux me concentrer sur mon travail au quotidien.",
      name: "Thomas V.",
      sector: "Gérant de petite entreprise",
    },
  ],
  en: [
    {
      topic: "Personal approach",
      quote:
        "What I appreciated most was the personal approach. Communication was direct, my questions got clear answers, and I felt my business needs were genuinely taken into account.",
      name: "Sophie L.",
      sector: "Independent professional",
    },
    {
      topic: "Text written for you",
      quote:
        "Writing the text for my website was something I kept putting off because I didn't know where to start. Getting help turning my services into clear, well-structured text made the whole project much easier.",
      name: "Nadia B.",
      sector: "Self-employed",
    },
    {
      topic: "One point of contact",
      quote:
        "I appreciated having one point of contact throughout the project. It made communication simpler and kept the work focused on our priorities.",
      name: "Claire M.",
      sector: "Entrepreneur",
    },
    {
      topic: "A clear process",
      quote:
        "The whole process felt organised and easy to follow. Everything was explained in plain language, without technical jargon. I always knew what was happening and what came next.",
      name: "Marc D.",
      sector: "Service business owner",
    },
    {
      topic: "Professional email",
      quote:
        "A professional email address was a small change that made my business feel much more established. Everything was set up for me, so I didn't have to figure out the technical side.",
      name: "Julien R.",
      sector: "Self-employed",
    },
    {
      topic: "Website care",
      quote:
        "It's a relief to know my website is being looked after. I worry much less about updates, security or technical issues, and I can concentrate on my daily work.",
      name: "Thomas V.",
      sector: "Small business owner",
    },
  ],
};

/** Tells visitors the names are changed. Shown wherever testimonials appear. */
export const testimonialsNote: Localized = {
  fr: "Les noms ont été modifiés pour préserver l'anonymat des clients.",
  en: "Names have been changed to protect client privacy.",
};
