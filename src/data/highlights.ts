import type { Localized } from "./i18n";
import { website } from "./offer";

export type Highlight = { value: string; label: string };

/** Real, measured client results only, shown in the marquees. A marquee stays hidden while this is empty. */
export const highlights: Localized<Highlight[]> = {
  fr: [
    { value: "+9\u00a0500", label: "visites sur les sites suivis" },
    { value: "+36\u00a0%", label: "de visiteurs en plus en 5 mois" },
    { value: "+32,5\u00a0%", label: "de demandes de devis en 6 mois" },
    { value: "7 fois plus", label: "d'avis Google sur les fiches suivies" },
    { value: "4,9/5", label: "note Google moyenne des clients suivis" },
    { value: `${website.weeks.min} à ${website.weeks.max} semaines`, label: "et votre site est en ligne" },
  ],
  en: [
    { value: "9,500+", label: "visits to the websites looked after" },
    { value: "+36%", label: "more visitors in 5 months" },
    { value: "+32.5%", label: "more quote requests in 6 months" },
    { value: "7x more", label: "Google reviews on the profiles looked after" },
    { value: "4.9/5", label: "average Google rating of the clients looked after" },
    { value: `${website.weeks.min} to ${website.weeks.max} weeks`, label: "and your website is live" },
  ],
};
