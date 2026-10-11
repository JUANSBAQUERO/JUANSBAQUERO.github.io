import { DEFAULT_LOCALE, isLocale, type Locale } from '../../domain/entities/Locale';

const STORAGE_KEY = 'portfolio-locale';

/**
 * Resolves which locale to show on load: an explicit `?lang=es` query
 * param wins (useful for sharing a direct link in one language), then a
 * previously chosen locale saved in localStorage, then the browser's own
 * language preference, finally falling back to DEFAULT_LOCALE. Pure
 * function of the inputs passed in -- no direct `window`/`navigator`
 * access -- so it's testable without a browser/DOM.
 */
export function resolveInitialLocale(
  queryLang: string | null,
  storedLocale: string | null,
  browserLanguages: readonly string[],
): Locale {
  if (queryLang && isLocale(queryLang)) return queryLang;
  if (storedLocale && isLocale(storedLocale)) return storedLocale;
  for (const lang of browserLanguages) {
    const primary = lang.slice(0, 2).toLowerCase();
    if (isLocale(primary)) return primary;
  }
  return DEFAULT_LOCALE;
}

/** Thin persistence wrapper so callers never touch localStorage directly
 *  (keeps the storage key in exactly one place). */
export class LocalePreference {
  get(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null; // private browsing / storage disabled -- fall through
    }
  }

  set(locale: Locale): void {
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // ignore -- language switch still works for the current session
    }
  }
}
