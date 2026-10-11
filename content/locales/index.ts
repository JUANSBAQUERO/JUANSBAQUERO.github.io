import type { Locale } from '../../src/domain/entities/Locale';
import type { LocaleContent, LocaleContentMap } from '../LocaleContent';
import { en } from './en';
import { es } from './es';

export const localeContent: LocaleContentMap = { en, es };

export function getLocaleContent(locale: Locale): LocaleContent {
  return localeContent[locale];
}
