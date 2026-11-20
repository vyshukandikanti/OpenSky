import { appStore } from '../store/appStore.js';

const TABS: readonly string[] = [
  'home',
  'family-setup',
  'todays-plan',
  'what-if',
  'community',
  'celebration',
  'action-impact',
  'settings',
  'air-data-unavailable',
  'offline-state',
];

/**
 * Calculates cyclic tab index navigation for ArrowLeft and ArrowRight keys.
 * @param currentIndex Current zero-based active tab index.
 * @param direction Navigation direction offset (-1 or +1).
 * @returns Next valid tab name.
 */
export function getAdjacentTab(currentIndex: number, direction: -1 | 1): string {
  const nextIdx = (currentIndex + direction + TABS.length) % TABS.length;
  return TABS[nextIdx] ?? 'home';
}

/**
 * Dispatches tab change event and updates application state.
 * @param tabName Target tab identifier.
 */
export function setActiveTab(tabName: string): void {
  if (TABS.includes(tabName)) {
    appStore.update({ activeTab: tabName });
  }
}
