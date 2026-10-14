import type { Localized } from "./i18n";
import { services, type ServiceId } from "./offer";
import type { RouteId } from "./routes";

export type ProjectTag = { name: Localized; route?: RouteId };

const service = (id: ServiceId): ProjectTag => {
  const { name, route } = services.find((entry) => entry.id === id)!;
  return { name, route };
};

/** Labels shown on project cards and pages. Tags with a route link to that service page. */
export const projectTags = {
  website: service("website"),
  care: service("care"),
  google: service("google"),
  design: { name: { fr: "Design visuel", en: "Visual design" } },
  seo: { name: { fr: "Référencement (SEO)", en: "SEO" } },
  branding: { name: { fr: "Identité de marque", en: "Brand identity" } },
  marketing: { name: { fr: "Marketing", en: "Marketing" } },
  analytics: { name: { fr: "Analyse du trafic", en: "Traffic analysis" } },
} satisfies Record<string, ProjectTag>;

export type ProjectTagId = keyof typeof projectTags;
export const projectTagIds = Object.keys(projectTags) as [ProjectTagId, ...ProjectTagId[]];
