import { appStore } from '../store/appStore.js';

/**
 * Updates application display language in global state.
 * @param language Target locale code ('en' or 'hi').
 */
export function setAppLanguage(language: 'en' | 'hi'): void {
  appStore.update({ language });
}
