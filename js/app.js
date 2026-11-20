/**
 * OpenSky Master Application Controller
 * W3C APG Tab Pattern, GenAI Assistant Orchestration, State Management & Accessibility.
 * Zero unescaped .innerHTML usage.
 */

import { setLanguage, getLanguage } from './bilingual.js';
import { queryAiAdvisor, sanitizeInput } from './ai-assistant.js';
import { calculateIndoorAirQuality } from './simulation.js';
import { calculateCommunityImpact } from './community-shield.js';

const TABS = [
  'home', 'family-setup', 'todays-plan', 'what-if', 'community',
  'celebration', 'action-impact', 'settings', 'air-data-unavailable', 'offline-state'
];

let activeIndex = 0;

export function activateTab(tabId, updateHash = true, focusTab = false) {
  const idx = TABS.indexOf(tabId);
  if (idx !== -1) {
    activeIndex = idx;
  }

  // Hide all tab panes
  document.querySelectorAll('.tab-pane').forEach(pane => {
    pane.classList.add('hidden');
  });

  // Reveal target tab pane
  const targetPane = document.getElementById('tab-pane-' + tabId);
  if (targetPane) {
    targetPane.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  // Update ARIA attributes on tab buttons
  document.querySelectorAll('.tab-button').forEach(btn => {
    const bTab = btn.getAttribute('data-tab');
    if (bTab === tabId) {
      btn.setAttribute('aria-selected', 'true');
      btn.setAttribute('tabindex', '0');
      btn.className = "tab-button tab-active bg-primary text-white shadow-md font-bold flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm whitespace-nowrap transition-all duration-200 border border-primary/10 select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary";
      btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      if (focusTab) btn.focus();
    } else {
      btn.setAttribute('aria-selected', 'false');
      btn.setAttribute('tabindex', '-1');
      btn.className = "tab-button bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-medium flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm whitespace-nowrap transition-all duration-200 border border-primary/10 select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary";
    }
  });

  // Update bottom navigation counter
  const counter = document.getElementById('tab-counter');
  if (counter) {
    counter.textContent = `${activeIndex + 1} / ${TABS.length}`;
  }

  if (updateHash) {
    history.pushState(null, '', '#' + tabId);
  }
}

export function initApp() {
  // 1. Tab Click Event Listeners
  document.querySelectorAll('.tab-button').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      activateTab(tabId, true, true);
    });
  });

  // 2. W3C APG Keyboard Navigation for Tabs
  const tablist = document.querySelector('[role="tablist"]');
  if (tablist) {
    tablist.addEventListener('keydown', (e) => {
      let newIdx = activeIndex;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        newIdx = (activeIndex + 1) % TABS.length;
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        newIdx = (activeIndex - 1 + TABS.length) % TABS.length;
      } else if (e.key === 'Home') {
        e.preventDefault();
        newIdx = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        newIdx = TABS.length - 1;
      } else {
        return;
      }
      activateTab(TABS[newIdx], true, true);
    });
  }

  // 3. Delegation for in-screen navigation links (data-path clicks)
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-path]');
    if (trigger) {
      e.preventDefault();
      const path = trigger.getAttribute('data-path');
      activateTab(path, true, true);
    }
  });

  // 4. Floating Prev / Next Controls
  const prevBtn = document.getElementById('prev-tab');
  const nextBtn = document.getElementById('next-tab');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      activeIndex = (activeIndex - 1 + TABS.length) % TABS.length;
      activateTab(TABS[activeIndex], true, false);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      activeIndex = (activeIndex + 1) % TABS.length;
      activateTab(TABS[activeIndex], true, false);
    });
  }

  // 5. Bilingual Language Selector
  const enBtn = document.getElementById('lang-btn-en');
  const hiBtn = document.getElementById('lang-btn-hi');
  if (enBtn) enBtn.addEventListener('click', () => setLanguage('en'));
  if (hiBtn) hiBtn.addEventListener('click', () => setLanguage('hi'));

  // 6. GenAI Assistant Drawer & Queries
  initAiAssistant();

  // 7. Interactive What-If Simulation Listeners
  initSimulationInteractions();

  // 8. Hash-Based Deep Linking
  function checkHash() {
    const hash = window.location.hash.replace('#', '');
    if (hash && TABS.includes(hash)) {
      activateTab(hash, false, false);
    } else {
      activateTab('home', false, false);
    }
  }

  window.addEventListener('load', checkHash);
  window.addEventListener('hashchange', checkHash);
}

/**
 * Initializes GenAI Assistant modal, suggestions, and query handlers.
 */
function initAiAssistant() {
  const toggleBtn = document.getElementById('ai-advisor-toggle');
  const modal = document.getElementById('ai-advisor-modal');
  const closeBtn = document.getElementById('ai-advisor-close');
  const form = document.getElementById('ai-query-form');
  const input = document.getElementById('ai-query-input');
  const responseBox = document.getElementById('ai-response-box');

  if (toggleBtn && modal) {
    toggleBtn.addEventListener('click', () => {
      modal.classList.toggle('hidden');
      if (!modal.classList.contains('hidden') && input) {
        input.focus();
      }
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
  }

  if (form && input && responseBox) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = input.value.trim();
      if (!q) return;

      responseBox.replaceChildren(); // Safe DOM clear
      const loadingEl = document.createElement('div');
      loadingEl.className = 'text-primary font-bold text-sm animate-pulse flex items-center gap-2';
      loadingEl.textContent = 'Generating grounded AI advisory...';
      responseBox.appendChild(loadingEl);

      setTimeout(() => {
        const reply = queryAiAdvisor(q);
        responseBox.replaceChildren();

        const preEl = document.createElement('div');
        preEl.className = 'text-sm text-on-surface whitespace-pre-line leading-relaxed';
        preEl.textContent = reply.replace(/\*\*/g, ''); // Clean markdown formatting safely
        responseBox.appendChild(preEl);
      }, 350);
    });
  }

  // Quick suggestion chips
  document.querySelectorAll('.ai-prompt-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      if (input && form) {
        input.value = chip.getAttribute('data-prompt') || chip.textContent.trim();
        form.dispatchEvent(new Event('submit'));
      }
    });
  });
}

/**
 * Hooks up live recalculation on the What-If simulation tab.
 */
function initSimulationInteractions() {
  const cadrSlider = document.getElementById('sim-cadr-slider');
  const sealToggle = document.getElementById('sim-seal-toggle');
  const outPm25 = document.getElementById('sim-indoor-pm25-val');
  const outAqi = document.getElementById('sim-indoor-aqi-val');
  const outDrop = document.getElementById('sim-drop-pct-val');

  function updateSim() {
    const cadr = cadrSlider ? parseInt(cadrSlider.value, 10) : 350;
    const isSealed = sealToggle ? sealToggle.checked : true;

    const res = calculateIndoorAirQuality({
      outdoorAqi: 312,
      outdoorPm25: 245,
      roomVolumeM3: 45,
      hepaCadrM3h: cadr,
      weatherstripSealed: isSealed,
      ventilationActive: false,
      airConditionerActive: false
    });

    if (outPm25) outPm25.textContent = `${res.indoorPm25} µg/m³`;
    if (outAqi) outAqi.textContent = `AQI ${res.indoorAqi}`;
    if (outDrop) outDrop.textContent = `-${res.percentageDrop}%`;
  }

  if (cadrSlider) cadrSlider.addEventListener('input', updateSim);
  if (sealToggle) sealToggle.addEventListener('change', updateSim);
}

// Auto-boot on DOMContentLoaded
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
}
