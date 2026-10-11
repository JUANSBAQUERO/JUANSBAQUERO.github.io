/**
 * Domain type for the two supported UI/content languages. Kept minimal on
 * purpose -- adding a third language later means adding one more entry
 * here plus one more file under content/locales/, nothing else in the
 * domain or application layers needs to change.
 */
export type Locale = 'en' | 'es';

export const SUPPORTED_LOCALES: readonly Locale[] = ['en', 'es'];
export const DEFAULT_LOCALE: Locale = 'en';

export function isLocale(value: string): value is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}
