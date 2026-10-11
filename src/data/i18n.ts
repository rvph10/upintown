export const locales = ['fr', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'fr';

export type Localized<T = string> = Record<Locale, T>;

export const htmlLang: Localized = { fr: 'fr-BE', en: 'en' };

export function formatPrice(amount: number, locale: Locale): string {
  return new Intl.NumberFormat(htmlLang[locale], {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount);
}
