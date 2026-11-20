import { setActiveTab } from '../../hooks/useTabNavigation.js';

export function bindTabButtons(): void {
  const tabButtons = document.querySelectorAll<HTMLButtonElement>('[role="tab"]');
  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tabName = btn.getAttribute('data-tab');
      if (tabName) {
        setActiveTab(tabName);
      }
    });
  });
}
