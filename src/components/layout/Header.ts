import { translate } from '../../i18n/translator.js';
import { setAppLanguage } from '../../hooks/useBilingual.js';

export function setupHeader(language: 'en' | 'hi'): void {
  const titleEl = document.getElementById('app-header-title');
  if (titleEl) {
    titleEl.textContent = translate('appTitle', language);
  }

  const enBtn = document.getElementById('lang-btn-en');
  enBtn?.addEventListener('click', () => setAppLanguage('en'));

  const hiBtn = document.getElementById('lang-btn-hi');
  hiBtn?.addEventListener('click', () => setAppLanguage('hi'));
}
