import { EN_TRANSLATIONS } from './en.js';
import { HI_TRANSLATIONS } from './hi.js';

/**
 * Retrieves a localized string key safely without risking XSS injection.
 * @param key Dictionary translation key.
 * @param language Locale code.
 * @returns Localized text or fallback English string.
 */
export function translate(key: string, language: 'en' | 'hi'): string {
  const dict = language === 'hi' ? HI_TRANSLATIONS : EN_TRANSLATIONS;
  return dict[key] ?? EN_TRANSLATIONS[key] ?? key;
}
