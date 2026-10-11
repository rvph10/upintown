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

export function workingDays(count: number, locale: Locale): string {
  if (locale === 'fr') return `${count} jour${count > 1 ? 's' : ''} ouvrable${count > 1 ? 's' : ''}`;
  return count === 1 ? 'one working day' : `${count} working days`;
}
