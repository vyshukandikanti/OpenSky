import { toggleModal } from '../ui/Modal.js';
import { generateSmogAdvice } from '../../services/aiAdvisorService.js';
import { appStore } from '../../store/appStore.js';

export function setupAiAdvisorModal(): void {
  const openBtn = document.getElementById('ai-advisor-toggle');
  const closeBtn = document.getElementById('ai-advisor-close');
  const sendBtn = document.getElementById('ai-advisor-send');
  const inputEl = document.getElementById('ai-advisor-input') as HTMLInputElement | null;

  openBtn?.addEventListener('click', () => toggleModal('ai-advisor-modal', true));
  closeBtn?.addEventListener('click', () => toggleModal('ai-advisor-modal', false));

  sendBtn?.addEventListener('click', async () => {
    const queryText = inputEl?.value.trim() ?? '';
    if (queryText.length === 0) {
      return;
    }
    const state = appStore.getState();
    await generateSmogAdvice({
      query: queryText,
      city: state.telemetry.city,
      currentAqi: state.telemetry.aqi,
      language: state.language,
    });
  });
}
