import { workingDays, type Localized } from "./i18n";
import { policies } from "./offer";

const replyDays = (locale: "fr" | "en") => workingDays(policies.inquiryReplyWorkingDays, locale);

/** What happens after a contact message, shown on the contact page and in the confirmation email. */
export const nextSteps: Localized<{ title: string; text: string }[]> = {
  fr: [
    {
      title: `Réponse sous ${replyDays("fr")}`,
      text: "Une première réponse à votre message, avec les questions utiles.",
    },
    { title: "Un court appel gratuit", text: "Sans engagement, pour comprendre votre activité et vos attentes." },
    { title: "Un devis clair", text: "Le prix, les étapes et les délais, avec les conditions générales." },
  ],
  en: [
    {
      title: `A reply within ${replyDays("en")}`,
      text: "A first answer to your message, with the questions that matter.",
    },
    { title: "A short free call", text: "No commitment, to understand your business and what you expect." },
    { title: "A clear quote", text: "Price, stages and timeline, with the terms of service." },
  ],
};
