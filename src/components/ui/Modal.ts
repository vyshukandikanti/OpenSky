/**
 * W3C APG Accessible Dialog helper for modals.
 */
export function toggleModal(modalId: string, isOpen: boolean): void {
  const modal = document.getElementById(modalId);
  if (!modal) {
    return;
  }
  if (isOpen) {
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
  } else {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
  }
}
