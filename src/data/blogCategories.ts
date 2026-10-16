import type { Localized } from "./i18n";

// No runtime imports: `scripts/holo-import.ts` loads this file directly with Node.
export const blogCategoryIds = ["website", "google", "email", "care", "advice"] as const;
export type BlogCategoryId = (typeof blogCategoryIds)[number];

export const blogCategories: Record<BlogCategoryId, { name: Localized }> = {
  website: { name: { fr: "Site internet", en: "Website" } },
  google: { name: { fr: "Google", en: "Google" } },
  email: { name: { fr: "E-mail", en: "Email" } },
  care: { name: { fr: "Entretien", en: "Website care" } },
  advice: { name: { fr: "Conseils", en: "Advice" } },
};
