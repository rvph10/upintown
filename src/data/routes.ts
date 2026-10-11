import type { Locale, Localized } from './i18n';

export const routes = {
  home: { fr: '/', en: '/en' },
  services: { fr: '/services', en: '/en/services' },
  websiteCreation: { fr: '/services/creation-site-internet', en: '/en/services/website-creation' },
  websiteCare: { fr: '/services/entretien-site-internet', en: '/en/services/website-care' },
  googleVisibility: { fr: '/services/visibilite-google', en: '/en/services/google-visibility' },
  pricing: { fr: '/tarifs', en: '/en/pricing' },
  projects: { fr: '/projets', en: '/en/projects' },
  contact: { fr: '/contact', en: '/en/contact' },
  legalNotice: { fr: '/mentions-legales', en: '/en/legal-notice' },
  privacy: { fr: '/confidentialite', en: '/en/privacy' },
} as const satisfies Record<string, Localized>;

export type RouteId = keyof typeof routes;

export function path(route: RouteId, locale: Locale): string {
  return routes[route][locale];
}

export function projectPath(slug: string, locale: Locale): string {
  return `${routes.projects[locale]}/${slug}`;
}
