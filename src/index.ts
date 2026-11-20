import { setupHeader } from './components/layout/Header.js';
import { bindTabButtons } from './components/layout/Tabs.js';
import { setupAiAdvisorModal } from './components/features/AiAdvisorModal.js';
import { bindWhatIfSliders } from './components/features/WhatIfSlider.js';
import { renderCommunityShieldMetrics } from './components/features/CommunityShieldCard.js';

export function initializeOpenSkyApp(): void {
  setupHeader('en');
  bindTabButtons();
  setupAiAdvisorModal();
  bindWhatIfSliders();
  renderCommunityShieldMetrics();
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initializeOpenSkyApp);
}
